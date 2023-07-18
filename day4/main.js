// create dynamic routing with dynamic html content and learn to set headers
// Also learn how to send json data in response

const http = require("node:http");
const fs = require("fs");
const html = fs.readFileSync("./index.html", "utf-8");

const server = http.createServer((request, response) => {
  let path = request.url;
  console.log(path);
  if ((path === "/home") | (path === "/")) {
    response.writeHead(200, {
      "Content-Type": "text/html",
    });
    response.end(html.replace("{{%pageHeading%}}", "This is our home page"));
  } else if (path === "/about") {
    // const html = fs.readFileSync("./index.html", "utf-8");
    // response.end(html);
    response.writeHead(200, {
      "Content-Type": "text/html",
    });
    response.end(html.replace("{{%pageHeading%}}", "this is our about page"));
  } else {
    // response.end("<h2>Page Not Found</h2>");
    response.writeHead(404, {
      "Content-Type": "text/html",
    });
    response.end(html.replace("{{%pageHeading%}}", "No Page Found!"));
  }

  // console.log(request.method);

  // response.end("this is our home page");
});

server.listen(8080, () => {
  console.log("server is listening on port 8080");
});
