// read or write to file

// sycn fucntion
const fs = require("fs");

const content = fs.readFileSync("./input.txt", "utf8");

console.log(content);

const contentToWrite = `this is our first line \n created at ${Date.now()}`;

fs.writeFileSync(".output.txt", contentToWrite);

// asychronous function  (here we also form callback hell)

fs.readFile("./output.txt", "utf-8", (error, data) => {
  if (error) {
    console.log("something went wrong");
  } else {
    console.log("res1:", data);
    fs.readFile("./input.txt", "utf-8", (error1, data1) => {
      if (error1) {
        console.log(error1);
      } else {
        console.log("res2: ", data1);
        fs.writeFile("./outputCopy.txt", data1, (error3) => {
          if (error3) {
            console.log(error3);
          } else {
            console.log("file written successfully");
          }
        });
      }
    });
  }
});
