const EventEmitter = require("node:events");

class Users extends EventEmitter {
  constructor(name, email, password) {
    super();
    name: name;
  }

  getUserDate() {
    const data = {
      name: "vikash singh",
      company: "revive coding",
    };
  }

  buyIceCream() {
    console.log("lets buy some ice cream!");
  }
}

module.exports = Users;
