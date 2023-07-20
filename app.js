const express = require("express");
const fs = require("fs");
const port = 4000;
let app = express();
const userData = JSON.parse(fs.readFileSync("userData.json", "utf-8"));

const simpleConsole = (req, res, next) => {
  console.log("I got printed every time for " + req.url);
  next();
};

// middleware
app.use(express.json());
// custom middlewares
app.use(simpleConsole);
// manupulate req object
app.use((req, res, next) => {
  req.presentdate = new Date();
  next();
});

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

const getAllUsers = (req, res) => {
  res.status(200).json({
    success: true,
    presentdate: req.presentdate,
    count: userData.length,
    data: { userData },
  });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  const user = userData.find((el) => el.id === id * 1);

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: `following ${id} is not present` });
  }

  res.status(200).json({ success: true, data: { userData: user } });
};

const createUser = (req, res) => {
  const userId = userData[userData.length - 1].id + 1;
  const newUser = Object.assign({ id: userId }, req.body);
  userData.push(newUser);

  fs.writeFile("userData.json", JSON.stringify(userData), (err) => {
    if (err) {
      return res.status(404).json({ success: false, message: err.message });
    }
    res.status(200).json({ success: true, data: { userData: newUser } });
  });
};

const updateUser = (req, res) => {
  const id = req.params.id * 1;
  const dataToUpdate = userData.find((el) => el.id === id);
  const index = userData.indexOf(dataToUpdate);
  Object.assign(dataToUpdate, req.body);
  (userData[index] = dataToUpdate),
    fs.writeFile("userData.json", JSON.stringify(userData), (err) => {
      if (err) {
        return res.status(404).json({ success: false, message: err.message });
      }
      res.status(200).json({ success: true, data: { userData: dataToUpdate } });
    });
};

const deleteUser = (req, res) => {
  const id = req.params.id * 1;
  const finalObjectAfterDelete = userData.filter((el) => el.id !== id);
  // const dataToUpdate = userData.find((el) => el.id === id);
  // const index = userData.indexOf(dataToUpdate);
  // Object.assign(dataToUpdate, req.body);
  // (userData[index] = dataToUpdate),

  fs.writeFile(
    "userData.json",
    JSON.stringify(finalObjectAfterDelete),
    (err) => {
      if (err) {
        return res.status(404).json({ success: false, message: err.message });
      }
      res
        .status(200)
        .json({ success: true, message: "user successfully deleted" });
    }
  );
};

// // Get All Users
// app.get("/api/user", getAllUsers);

// // Get User by ID multiple params at same time as "/api/user/:id/:name/:x?"
// app.get("/api/user/:id", getUserById);

// // Create New User
// app.post("/api/user", createUser);

// // Update the user data
// app.patch("/api/user/:id", updateUser);

// // Delete the user data
// app.delete("/api/user/:id", deleteUser);

// reote chaning.....

app.route("/api/user").get(getAllUsers).post(createUser);

app
  .route("/api/user/:id")
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

app.listen(port, () => {
  console.log("server listening on " + port);
});
