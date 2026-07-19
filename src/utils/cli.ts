import {
  loginSession,
  searchProducts,
  addProduct,
  getCartList,
  clearCart,
} from "./monmarche.js";

const commands = {
  loginSession,
  searchProducts,
  addProduct,
  getCartList,
  clearCart,
};
const cmd = process.argv[2] as keyof typeof commands;

function parseArgs(argv: string[]) {
  const named: Record<string, string> = {};
  const positional: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].replace(/^--/, "");
      const value = argv[i + 1];
      if (value && !value.startsWith("--")) {
        named[key] = value;
        i++;
      } else {
        named[key] = "true";
      }
    } else {
      positional.push(argv[i]);
    }
  }

  return { named, positional };
}

(async () => {
  try {
    if (!(cmd in commands)) {
      console.log(`Command "${cmd}" not recognized.`);
      console.log("Available commands:", Object.keys(commands).join(", "));
      process.exit(1);
    }

    const { named, positional } = parseArgs(process.argv.slice(3));
    const session = named["session"];

    let result;

    if (cmd === "loginSession") {
      result = await loginSession();
    } else if (cmd === "searchProducts") {
      const product = positional[0] || "";
      result = await searchProducts(product, session);
    } else if (cmd === "getCartList") {
      result = await getCartList(session);
    } else if (cmd === "clearCart") {
      result = await clearCart(session);
    } else if (cmd === "addProduct") {
      const id = named["id"];
      const quantity = parseInt(named["quantity"], 10);
      if (!id || isNaN(quantity)) {
        console.error("Missing or invalid --id or --quantity");
        process.exit(1);
      }
      result = await addProduct({ id, quantity, session });
    }

    console.log(result);
    process.exit(0);
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    process.exit(1);
  }
})();
