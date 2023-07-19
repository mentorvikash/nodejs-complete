// what is pipe and right position to use read or write streams

// while requesting a large file, may cause crash and bad experience to user is used convetion methods

const http = require("http");
const fs = require("fs");

const server = http.createServer();

server.on("request", (req, res) => {
  const fileread = fs.createReadStream("./longtext.txt");

  // fileread.on("data", (chucks) => {
  //   res.write(chucks);
  // });

  // fileread.on("end", () => {
  //   res.end();
  // });

  // the pipe method help us to write the data with the same speed as it read by createReadStream
  fileread.pipe(res);

  fileread.on("error", (error) => {
    res.end(error.message);
  });
});

server.listen(8080, (err, res) => {
  console.log("server listening on 8080");
});
