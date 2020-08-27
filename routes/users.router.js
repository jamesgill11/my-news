const usersRouter = require("express").Router();
const { sendUserByUsername } = require("../controllers/users.controller");
const { handle405Errors } = require("../errors/handleCustomErrors");

usersRouter.get("/:username", sendUserByUsername);

module.exports = usersRouter;
