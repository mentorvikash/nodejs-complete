// what is event driven architecture
// Event emmiter (server) => event listener (.on) => event handler (callback function)

const http = require("node:http");
const fs = require("fs");

const server = http.createServer();

server.on("request", (request, response) => {
  let path = request.url;
  console.log(path);
  if ((path === "/home") | (path === "/")) {
    response.end("this is our home page");
  } else if (path === "/about") {
    const html = fs.readFileSync("./index.html", "utf-8");
    response.end(html);
  } else {
    response.end("<h2>Page Not Found</h2>");
  }
});

// const server = http.createServer((request, response) => {
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

//   // console.log(request.method);

//   // response.end("this is our home page");
// });

server.listen(8080, () => {
  console.log("server is listening on port 8080");
});
