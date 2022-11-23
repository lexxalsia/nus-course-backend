const express = require("express");
const { requiresAuth } = require("express-openid-connect");
const { getTransactions } = require("./mysql");

const controllerName = "Transaction";

let transactionRouter = express.Router();

// GET /Transaction
// Get list of transactions order by Date ascendingly
transactionRouter.get(`/${controllerName}`, requiresAuth(), (req, resp) => {
  getTransactions(req.oidc.user.email).then(
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

module.exports = { transactionRouter };
