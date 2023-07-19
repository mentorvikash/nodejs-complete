// event loop understanding an execution

const fs = require("fs");

console.log("statement 1 execution");

// timers task (1st phase)
setTimeout(() => {
  console.log("statement 2 execution");
}, 2000);

// input output task (2nd phase)
fs.readFile("./longtext.txt", (err, data) => {
  console.log("read file is executed successfully");
});

// setImmediate task (3rd phase)
setImmediate(() => {
  console.log("setImmediate statement 3 execution");
});

process.nextTick(() => {
  console.log(" nextTick task has top most priority");
});

console.log("statement 4 execution");
