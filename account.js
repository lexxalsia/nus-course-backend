const express = require("express");
const { requiresAuth } = require("./auth0");
const { generateBalance, generateTransactions } = require("./dataHelper");

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

module.exports = { accountRouter };
