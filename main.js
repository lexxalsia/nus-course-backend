const express = require("express");
require("dotenv").config();

const { router } = require("./api");
const { auth, config, authRouter } = require("./auth0");

let app = express();
app.use(express.json());
app.use(router);

app.use(auth(config));
app.use(authRouter);

app.listen(process.env.PORT, (errors) => {
  if (errors) {
    console.log(errors);
  } else {
    console.log(`Listening on port ${process.env.PORT}`);
  }
});
