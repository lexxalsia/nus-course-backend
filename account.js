const express = require("express");
const { requiresAuth } = require("./auth0");
const { generateBalance, generateTransactions } = require("./dataHelper");
const {
  getAccountBalance,
  addAccountBalance,
  addTransactions,
  getAccountOverview,
} = require("./mysql");

const controllerName = "account";

let accountRouter = express.Router();

// GET /account/connect
// A mock API that generate some transactions and current bank balance
accountRouter.get(`/${controllerName}/connect`, requiresAuth(), (req, resp) => {
  // 1. Mock an account balance
  const balance = generateBalance();

  // 2. Mock transactions (Past 3 months till now)
  const transactions = generateTransactions();

  Promise.all([
    addAccountBalance(balance, req.oidc.user.email),
    addTransactions(
      transactions.sort((a, b) => a.date.getTime() - b.date.getTime()),
      req.oidc.user.email
    ),
  ]).then(
    function (values) {
      values[0] && values[1]
        ? resp.status(200).send()
        : resp.status(500).send();
    },
    function (error) {
      resp.status(500).send(error || `Failed to save mock data.`);
    }
  );
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

// GET /account/overview
// Return the account overview with top expenses
accountRouter.get(
  `/${controllerName}/Overview`,
  requiresAuth(),
  (req, resp) => {
    getAccountOverview(req.oidc.user.email).then(
      function (results) {
        let categories = JSON.parse(results[0]);
        let settings =
          results[1] === undefined
            ? []
            : JSON.parse(JSON.parse(results[1]).Settings);

        categories.map((category) => {
          category["Sum"] = Math.abs(category["Sum"]);

          let match = settings.find(
            (setting) => setting.Category === category.Category
          );

          if (match) {
            category["Target"] = match.Value || 0;
          } else {
            category["Target"] = 0;
          }
        });

        if (categories === "[]") {
          resp.status(204).send();
        } else {
          resp.status(200).json(categories);
        }
      },
      function (error) {
        resp.status(500).send(error || `Failed to get account overview.`);
      }
    );
  }
);

module.exports = { accountRouter };
