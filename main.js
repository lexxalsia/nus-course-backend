const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { auth, config, authRouter } = require("./auth0");
const { router } = require("./api");
const { accountRouter } = require("./account");
const { userRouter } = require("./user");
const { transactionRouter } = require("./transaction");
const { planRouter } = require("./plan");

// Register main App
let app = express();

// Enable All CORS Requests
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

// Set Express to parse JSON
app.use(express.json());

// Init auth
app.use(auth(config));

// Register routers
app.use(authRouter);
app.use(router);
app.use(accountRouter);
app.use(userRouter);
app.use(transactionRouter);
app.use(planRouter);

app.listen(process.env.PORT, (errors) => {
  if (errors) {
    console.log(errors);
  } else {
    console.log(`Listening on port ${process.env.PORT}`);
  }
});
