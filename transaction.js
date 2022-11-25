const express = require("express");
const { requiresAuth } = require("express-openid-connect");
const { getTransactions, getTransactionsByCategory } = require("./mysql");

const controllerName = "Transaction";

let transactionRouter = express.Router();

// GET /Transaction
// Get list of transactions order by Date ascendingly
transactionRouter.get(`/${controllerName}`, requiresAuth(), (req, resp) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const category = req.query.category;
  const description = req.query.description;

  getTransactions(
    startDate,
    endDate,
    category,
    description,
    req.oidc.user.email
  ).then(
    function (transactions) {
      if (transactions === "[]") {
        resp.status(204).send();
      } else {
        resp.status(200).json(JSON.parse(transactions));
      }
    },
    function (error) {
      resp.status(500).send(error || `Failed to get user transactions.`);
    }
  );
});

// GET /Transaction/Category
// Get list of transactions group by category for current month
transactionRouter.get(
  `/${controllerName}/Category`,
  requiresAuth(),
  (req, resp) => {
    getTransactionsByCategory(req.oidc.user.email).then(
      function (transactions) {
        if (transactions === "[]") {
          resp.status(204).send();
        } else {
          resp.status(200).json(JSON.parse(transactions));
        }
      },
      function (error) {
        resp.status(500).send(error || `Failed to get user transactions.`);
      }
    );
  }
);

module.exports = { transactionRouter };
