const usersRouter = require("express").Router();
const { sendUserByUsername } = require("../controllers/users.controller");

usersRouter.get("/:username", sendUserByUsername);

module.exports = usersRouter;
