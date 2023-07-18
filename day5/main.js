// Also learn get json data from responce
// conver a json data to html page

const http = require("node:http");
const fs = require("fs");
const html = fs.readFileSync("./index.html", "utf-8");
const bloglist = fs.readFileSync("./postlist.html", "utf-8");
const allposts = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

const finalPostData = allposts.map((post) => {
  let output = bloglist.replace("{{%PostNumber%}}", post.id);
  output = output.replace("{{%PostTitle%}}", post.title);
  output = output.replace("{{%postDesctiption%}}", post.body);
  return output;
});

const server = http.createServer((request, response) => {
  let path = request.url;
  if ((path === "/home") | (path === "/")) {
    response.writeHead(200, {
      "Content-Type": "text/html",
    });
    response.end(html.replace("{{%pageHeading%}}", "This is our home page"));
  } else if (path === "/about") {
    response.writeHead(200, {
      "Content-Type": "text/html",
    });
    response.end(html.replace("{{%pageHeading%}}", "this is our about page"));
  } else if (path === "/getdata") {
    response.writeHead(200, {
      "Content-Type": "text/html",
    });
    response.end(
      html.replace("{{%pageHeading%}}", finalPostData.slice(",").join(" "))
    );
  } else {
    response.writeHead(404, {
      "Content-Type": "text/html",
    });
    response.end(html.replace("{{%pageHeading%}}", "No Page Found!"));
  }
});

server.listen(8080, () => {
  console.log("server is listening on port 8080");
});
