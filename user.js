const express = require("express");
const { requiresAuth } = require("express-openid-connect");
const { getUser, addUser, updateUser } = require("./mysql");

const controllerName = "User";

let userRouter = express.Router();

// GET /User
// Get user lastname, firstname, active status
userRouter.get(`/${controllerName}`, requiresAuth(), (req, resp) => {
  getUser(req.oidc.user.email).then(
    function (user) {
      resp.status(200).json(JSON.parse(user));
    },
    function (error) {
      resp.status(500).send(error || `Failed to get user detail.`);
    }
  );
});

// POST /User
// Webhook for Auth0 to call during post signup
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

// PUT /User
// To update lastname, firstname, and active status
userRouter.put(`/${controllerName}`, requiresAuth(), (req, resp) => {
  updateUser(req.body).then(
    function (user) {
      resp.status(200).json(JSON.parse(user));
    },
    function (error) {
      resp.status(500).send(error || `Failed to update user.`);
    }
  );
});

module.exports = { userRouter };
