// what is stream -> way to devide the data into chucks so, will imporove the performance
// buffer => it chunks of data in binary format (which represent in hexadecimal as by default it is in binary form)
// Readable stream | Writable stream | Duplex stream | Transform stream
// implementations of stream.

// while requesting a large file, may cause crash and bad experience to user is used convetion methods

const http = require("http");
const fs = require("fs");

const server = http.createServer();

server.on("request", (req, res) => {
  const fileread = fs.createReadStream("./longtext.txt");

  fileread.on("data", (chucks) => {
    res.write(chucks);
    res.end();
  });

  fileread.on("error", (error) => {
    res.end(error.message);
  });
});

server.listen(8080, (err, res) => {
  console.log("server listening on 8080");
});
