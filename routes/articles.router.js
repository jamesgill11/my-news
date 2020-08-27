const articlesRouter = require("express").Router();
const {
  sendArticles,
  updateVotes,
  sendNewArticleComment,
  sendCommentsByArticleId,
  sendAllArticles,
} = require("../controllers/articles.controller");
const { handle405Errors } = require("../errors/handleCustomErrors");

articlesRouter.get("/", sendAllArticles).all(handle405Errors);
articlesRouter.route("/:article_id").get(sendArticles).patch(updateVotes);
articlesRouter
  .route("/:article_id/comments")
  .post(sendNewArticleComment)
  .get(sendCommentsByArticleId)
  .all(handle405Errors);

module.exports = articlesRouter;
