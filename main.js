const express = require("express");
require("dotenv").config();

const { auth, config, authRouter } = require("./auth0");
const { router } = require("./api");

// Register main App
let app = express();

// Set Express to parse JSON
app.use(express.json());

// Init auth
app.use(auth(config));

// Register routers
app.use(authRouter);
app.use(router);

app.listen(process.env.PORT, (errors) => {
  if (errors) {
    console.log(errors);
  } else {
    console.log(`Listening on port ${process.env.PORT}`);
  }
});
