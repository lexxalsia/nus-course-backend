// SYK's version

const express = require("express");
const { requiresAuth, config } = require("./auth0");
const data = require("./mock_data");

let router = express.Router();

router.get("/sum", requiresAuth(), (req, resp) => {
  resp.send(`Sum is ${parseFloat(req.query.n1) + parseFloat(req.query.n2)}`);
});

router.get("/product", requiresAuth(), (req, resp) => {
  resp.send(`Product name is ${req.query.name}`);
});

router.get("/users", requiresAuth(), (req, resp) => {
  resp.send(data.get_all_users());
});

router.get("/users/:id", requiresAuth(), (req, resp) => {
  // validate request
  if (isNaN(parseInt(req.params.id))) {
    resp.status(400).send("Bad Request.");
  }

  let user = data.get_user_by_user_id(req.params.id);

  if (user == null || user == undefined) {
    resp.status(404).send("Not Found.");
  }

  resp.send(user);
});

router.post("/users", requiresAuth(), (req, resp) => {
  if (!req.body.first_name) {
    resp.status(400).send("first_name is empty");
  }
  if (!req.body.last_name) {
    resp.status(400).send("last_name is empty");
  }
  if (!req.body.email) {
    resp.status(400).send("email is empty");
  }
  if (!req.body.user_id) {
    resp.status(400).send("user_id is empty");
  }
  if (!req.body.phone) {
    resp.status(400).send("phone is empty");
  }
  if (!req.body.plan_id) {
    resp.status(400).send("plan_id is empty");
  }
  if (!req.body.signup_date) {
    resp.status(400).send("signup_date is empty");
  }

  let user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    user_id: req.body.user_id,
    phone: req.body.phone,
    plan_id: req.body.plan_id,
    signup_date: req.body.signup_date,
  };

  try {
    data.add_user(user);
  } catch (err) {}

  resp.status(201).send(`User added`);
});

module.exports = { router };

// // Dixant's version

// const express = require("express");
// const data = require("./mock_data");

// // export let router = express.Router();

// let router = express.Router();

// router.get("/sum", (request, response) => {
//   response.send(
//     `Sum is ${parseFloat(request.query.n1) + parseFloat(request.query.n2)}`
//   );
// });

// router.get("/product", (request, response) => {
//   response.send(
//     `Product is ${parseFloat(request.query.n1) * parseFloat(request.query.n2)}`
//   );
// });

// router.get("/users/all", (request, response) => {
//   let users = data.get_all_users();
//   response.send(users);
// });

// router.get("/users/by-id", (request, response) => {
//   let user = data.get_user_by_user_id(parseInt(request.query.user_id));
//   response.send(user);
// });

// router.post("/users/add", (request, response) => {
//     let user = {
//       first_name: request.body.first_name,
//       last_name: request.body.last_name,
//       email: request.body.email,
//       user_id: request.body.user_id,
//       phone: request.body.phone,
//       plan_id: request.body.plan_id,
//       signup_date: request.body.signup_date,
//     };
//   //   data.add_user(user);
//   //   response.send("User added successfully!");
//   // });
//   data.add_user(user);
//   response.status(201).send("User added successfully!");
// });

// module.exports = { router };
