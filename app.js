const express = require("express");
const fs = require("fs");
const port = 4000;
let app = express();
const userData = JSON.parse(fs.readFileSync("userData.json", "utf-8"));

// middleware
app.use(express.json());

// Route = http method + url
app.get("/", (req, res) => {
  res.status(200).send("this is our first route");
});

app.get("/html", (req, res) => {
  res.status(200).send("<h1>this is our first route</h1>");
});

app.get("/jsonData", (req, res) => {
  res
    .status(200)
    .json({ success: true, data: { name: "vikash", lname: "singh" } });
});

// Get All Users
app.get("/api/user", (req, res) => {
  res
    .status(200)
    .json({ success: true, count: userData.length, data: { userData } });
});

// get singl user data by id
// can also define multiple params at same time as "/api/user/:id/:name/:x?"

// Get User by ID
app.get("/api/user/:id", (req, res) => {
  const { id } = req.params;
  const user = userData.find((el) => el.id === id * 1);

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: `following ${id} is not present` });
  }

  res.status(200).json({ success: true, data: { userData: user } });
});

// Create New User
app.post("/api/user", (req, res) => {
  const userId = userData[userData.length - 1].id + 1;

  const newUser = Object.assign({ id: userId }, req.body);

  userData.push(newUser);

  fs.writeFile("userData.json", JSON.stringify(userData), (err) => {
    if (err) {
      return res.status(404).json({ success: false, message: err.message });
    }
    res.status(200).json({ success: true, data: { userData: newUser } });
  });
});

// Update the user data

app.patch("/api/user/:id", (req, res) => {
  const id = req.params.id * 1;
  const dataToUpdate = userData.find((el) => el.id === id);
  const index = userData.indexOf(dataToUpdate);
  const newUser = Object.assign(dataToUpdate, req.body);
  (userData[index] = newUser),
    fs.writeFile("userData.json", JSON.stringify(userData), (err) => {
      if (err) {
        return res.status(404).json({ success: false, message: err.message });
      }
      res.status(200).json({ success: true, data: { userData: newUser } });
    });
});

app.listen(port, () => {
  console.log("server listening on " + port);
});
