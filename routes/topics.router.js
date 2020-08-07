const topicsRouter = require("express").Router();
const { sendTopics } = require("../controllers/topics.controller");
const { handle405Errors } = require("../errors/handleCustomErrors");

topicsRouter.route("/").get(sendTopics).all(handle405Errors);

module.exports = topicsRouter;
