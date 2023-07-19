// How to create or custom event emmiter and handler
// Event emmiter (server) => event listener (.on) => event handler (callback function)
// Event emmited in sychrouse ways.

// const http = require("node:http");
const fs = require("fs");
const event = require("node:events");
const Users = require("./user");

// you can use any of two
// const EventEmitter = new event.EventEmitter();
const EventEmitter = new event();
const UserEmmiter = new Users();

UserEmmiter.on("buy-Iceream", () => {
  console.log("also console this");
  UserEmmiter.buyIceCream();
});

UserEmmiter.emit("buy-Iceream");

EventEmitter.on("buy-milk", () => {
  console.log("let go to maket and buy some milk");
});

EventEmitter.on("buy-milk", (number, name) => {
  if (number >= 5) {
    console.log(`hay ${name}, your entered ${number} grater then 5  `);
  } else {
    console.log(`hay ${name}, your entered ${number} less then 5  `);
  }
});

EventEmitter.emit("buy-milk", 3, "maya");

// const server = http.createServer();

// server.on("request", (request, response) => {
//   let path = request.url;
//   console.log(path);
//   if ((path === "/home") | (path === "/")) {
//     response.end("this is our home page");
//   } else if (path === "/about") {
//     const html = fs.readFileSync("./index.html", "utf-8");
//     response.end(html);
//   } else {
//     response.end("<h2>Page Not Found</h2>");
//   }
// });

// // const server = http.createServer((request, response) => {
// //   let path = request.url;
// //   console.log(path);
// //   if ((path === "/home") | (path === "/")) {
// //     response.end("this is our home page");
// //   } else if (path === "/about") {
// //     const html = fs.readFileSync("./index.html", "utf-8");
// //     response.end(html);
// //   } else {
// //     response.end("<h2>Page Not Found</h2>");
// //   }

// //   // console.log(request.method);

// //   // response.end("this is our home page");
// // });

// server.listen(8080, () => {
//   console.log("server is listening on port 8080");
// });
