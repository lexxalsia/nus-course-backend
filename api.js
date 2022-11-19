const express = require("express");
const data = require("./mock_data");

let router = express.Router();

router.get("/sum", (req, resp) => {
  resp.send(`Sum is ${parseFloat(req.query.n1) + parseFloat(req.query.n2)}`);
});

router.get("/product", (req, resp) => {
  resp.send(`Product name is ${req.query.name}`);
});

router.get("/users", (req, resp) => {
  resp.send(data.get_all_users());
});

router.get("/users/:id", (req, resp) => {
  resp.send(data.get_user_by_user_id(req.params.id));
});

router.post("/users", (req, resp) => {
  let user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    user_id: req.body.user_id,
    phone: req.body.phone,
    plan_id: req.body.plan_id,
    signup_date: req.body.signup_date,
  };
  data.add_user(user);

  resp.status(201).send(`User added`);
});

module.exports = { router };
