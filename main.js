// import express from "express";

// let app = express();

// app.get("/", (req, res) => {
//   res.send("Hello world!");
// });

// app.listen(3000, (errors) => {
//   if (errors) {
//     console.log(errors);
//   } else {
//     console.log("Listening on port 3000");
//   }
// });

const express = require("express");
const apis = require("./api");

let app = express();
app.use(express.json());
app.use(apis.router);

app.listen(3000, (errors) => {
  if (errors) {
    console.log(errors);
  } else {
    console.log("Listening on port 3000");
  }
});
