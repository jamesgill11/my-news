const express = require("express");
const path = require("path");
const app = express();
const apiRouter = require("./routes/api.router");
const {
  handleCustomErrors,
  handlePSQLErrors,
  handleServerErrors,
  handle405Errors,
} = require("./errors/handleCustomErrors");

app.use(express.static(path.join(__dirname, "build")));

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  next({ status: 404, msg: "Route not found" });
});

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

module.exports = app;
