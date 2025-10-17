import { loginSession, searchProducts, addProduct } from "./monmarche.js";

/** --- CLI --- **/
const commands = { loginSession, searchProducts, addProduct };
const cmd = process.argv[2] as keyof typeof commands;

(async () => {
  if (cmd in commands) {
    const arg = process.argv[3];
    let result;

    if (cmd === "addProduct") {
      // Parse JSON string for addProduct command
      try {
        const productData = JSON.parse(arg);
        result = await commands[cmd](productData);
      } catch (error) {
        console.error("Invalid JSON for addProduct command");
        process.exit(1);
      }
    } else {
      result = await commands[cmd](arg);
    }

    console.log(result);
  } else {
    console.log(`Command "${cmd}" not recognized.`);
    console.log("Available commands:", Object.keys(commands).join(", "));
  }
  process.exit(1);
})();
