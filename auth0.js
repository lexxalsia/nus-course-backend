const express = require("express");
require("dotenv").config();

let authRouter = express.Router();

const { auth, requiresAuth } = require("express-openid-connect");

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  routes: {
    login: false,
    postLogoutRedirect: process.env.POST_LOGOUT_REDIRECT,
  },
  session: {
    cookie: {
      sameSite: process.env.COOKIE_SAMESITE,
      secure: process.env.COOKIE_SECURE,
      httpOnly: true,
    },
  },
};

// req.isAuthenticated is provided from the auth router
authRouter.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

authRouter.get("/login", (req, res) => {
  res.oidc.login({ returnTo: process.env.POST_LOGIN_REDIRECT });
});

authRouter.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

module.exports = { auth, requiresAuth, config, authRouter };
