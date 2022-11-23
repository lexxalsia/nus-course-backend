const express = require("express");
const { requiresAuth } = require("./auth0");
const { generateBalance, generateTransactions } = require("./dataHelper");
const { getAccountBalance } = require("./mysql");

const controllerName = "account";

let accountRouter = express.Router();

// GET /account/connect
// A mock API that generate some transactions and current bank balance
accountRouter.get(`/${controllerName}/connect`, requiresAuth(), (req, resp) => {
  // 1. Mock an account balance
  let balance = generateBalance();

  // 2. Mock transactions (Past 3 months till now)
  let transactions = generateTransactions();

  resp
    .status(200)
    .send(transactions.sort((a, b) => b.date.getTime() - a.date.getTime()));
});

// GET /account/balance
// Return the account balance
accountRouter.get(`/${controllerName}/balance`, requiresAuth(), (req, resp) => {
  getAccountBalance(req.oidc.user.email).then(
    function (balance) {
      resp.status(200).json(JSON.parse(balance));
    },
    function (error) {
      resp.status(500).send(error || `Failed to get account balance.`);
    }
  );
});

module.exports = { accountRouter };
