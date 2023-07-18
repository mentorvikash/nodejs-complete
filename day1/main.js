// readline

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("please enter your name: ", (name) => {
  console.log("your name is " + name);
  rl.close();
});

rl.on("close", () => {
  console.log("interface is closed");
  process.exit(0);
});
