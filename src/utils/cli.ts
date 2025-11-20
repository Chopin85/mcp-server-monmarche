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
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, "");
    const value = argv[i + 1];
    args[key] = value;
  }
  return args;
}

(async () => {
  try {
    if (!(cmd in commands)) {
      console.log(`Command "${cmd}" not recognized.`);
      console.log("Available commands:", Object.keys(commands).join(", "));
      process.exit(1);
    }

    let result;

    if (
      cmd === "loginSession" ||
      cmd === "searchProducts" ||
      cmd === "getCartList" ||
      cmd === "clearCart"
    ) {
      const arg = process.argv[3];
      result = await commands[cmd](arg);
    } else if (cmd === "addProduct") {
      const args = parseArgs(process.argv.slice(3));
      const id = args["id"];
      const quantity = parseInt(args["quantity"], 10);
      if (!id || isNaN(quantity)) {
        console.error("Missing or invalid --id or --quantity");
        process.exit(1);
      }
      result = await commands[cmd]({ id, quantity });
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
