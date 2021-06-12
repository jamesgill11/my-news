const {
  fetchArticlesByArticleId,
  patchVotes,
  postArticleComment,
  fetchCommentsByArticleId,
  fetchAllArticles,
} = require("../models/articles.model");
console.log("in articles");
exports.sendArticles = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesByArticleId(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  patchVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.sendNewArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  postArticleComment(article_id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
exports.sendCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  fetchCommentsByArticleId(article_id, sort_by, order)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.sendAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  fetchAllArticles(sort_by, order, author, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
