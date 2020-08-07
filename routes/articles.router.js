const articlesRouter = require("express").Router();
const {
  sendArticles,
  updateVotes,
  sendNewArticleComment,
  sendCommentsByArticleId,
  sendAllArticles,
} = require("../controllers/articles.controller");

articlesRouter.get("/", sendAllArticles);
articlesRouter.route("/:article_id").get(sendArticles).patch(updateVotes);
articlesRouter
  .route("/:article_id/comments")
  .post(sendNewArticleComment)
  .get(sendCommentsByArticleId);

module.exports = articlesRouter;
