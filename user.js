const express = require("express");
const { addUser } = require("./mysql");

const controllerName = "User";

let userRouter = express.Router();

// POST /account/balance
// A mock API that generate some transactions and current bank balance
userRouter.post(`/${controllerName}`, (req, resp) => {
  addUser(req.body).then(
    function (user) {
      resp.status(201).json(JSON.parse(user));
    },
    function (error) {
      resp.status(500).send(error || `Failed to create new user.`);
    }
  );
});

module.exports = { userRouter };
