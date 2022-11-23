const express = require("express");
const { requiresAuth } = require("express-openid-connect");
const {
  getPlans,
  getPlan,
  addPlan,
  updatePlan,
  deletePlan,
} = require("./mysql");

const controllerName = "Plan";

let planRouter = express.Router();

// GET /Plan
// Get list of plans
planRouter.get(`/${controllerName}`, requiresAuth(), (req, resp) => {
  getPlans(req.oidc.user.email).then(
    function (plans) {
      if (plans === "[]") {
        resp.status(204).send();
      } else {
        resp.status(200).json(JSON.parse(plans));
      }
    },
    function (error) {
      resp.status(500).send(error || `Failed to get plans.`);
    }
  );
});

// GET /Plan/:{uuid}
// Get plan by uuid
planRouter.get(`/${controllerName}/:id`, requiresAuth(), (req, resp) => {
  getPlan(req.params.id, req.oidc.user.email).then(
    function (plan) {
      if (plan === undefined || plan === "[]") {
        resp.status(204).send();
      } else {
        resp.status(200).json(JSON.parse(plan));
      }
    },
    function (error) {
      resp.status(500).send(error || `Failed to get plan.`);
    }
  );
});

// POST /Plan
// Add new plan
planRouter.post(`/${controllerName}`, (req, resp) => {
  addPlan(req.body, req.oidc.user.email).then(
    function (plan) {
      resp.status(201).json(JSON.parse(plan));
    },
    function (error) {
      resp.status(500).send(error || `Failed to create new plan.`);
    }
  );
});

// PUT /Plan
// To update name, settings, and active status
planRouter.put(`/${controllerName}`, requiresAuth(), (req, resp) => {
  updatePlan(req.body, req.oidc.user.email).then(
    function (plan) {
      resp.status(200).json(JSON.parse(plan));
    },
    function (error) {
      resp.status(500).send(error || `Failed to update plan.`);
    }
  );
});

// DELETE /Plan
// To delete existing plan
planRouter.delete(`/${controllerName}/:id`, requiresAuth(), (req, resp) => {
  deletePlan(req.params.id, req.oidc.user.email).then(
    function (deleted) {
      if (deleted) {
        resp.status(204).send();
      } else {
        resp.status(404).send();
      }
    },
    function (error) {
      resp.status(500).send(error || `Failed to update plan.`);
    }
  );
});

module.exports = { planRouter };
