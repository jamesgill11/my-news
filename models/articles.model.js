const db = require("../db/connection");

exports.fetchArticlesByArticleId = (id) => {
  return db
    .select("articles.*")
    .from("articles")
    .where("article_id", "=", id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count("comments.article_id", { as: "comment_count" })
    .then((result) => {
      console.log(result);

      const newResult = result.filter((res) => {
        if (res.article_id === Number(id)) {
          return { res };
        }
      });
      if (newResult.length === 0 || newResult === []) {
        return (
          Promise.reject({ status: 404, msg: "article not found!" }) ||
          Promise.reject({ status: 400, msg: "Bad Request!" })
        );
      } else {
        return newResult.map((commentCount) => {
          return {
            ...commentCount,
            comment_count: Number(commentCount.comment_count),
          };
        });
      }
    });
};

exports.patchVotes = (article_id, votes = 0) => {
  return db("articles")
    .where("article_id", "=", article_id)
    .increment("votes", votes)
    .returning("*")
    .then((res) => {
      return res[0];
    });
};

exports.postArticleComment = (id, newComment) => {
  const newData = {
    article_id: id,
    author: newComment.username,
    body: newComment.body,
  };
  return db
    .insert(newData)
    .into("comments")
    .returning("*")
    .then((result) => {
      return result;
    });
};

exports.fetchCommentsByArticleId = (
  id,
  sort_by = "created_at",
  order = "desc"
) => {
  return db
    .select("comment_id", "votes", "body", "author", "created_at")
    .from("comments")
    .where("comments.article_id", "=", id)
    .orderBy(sort_by, order);
};

exports.fetchAllArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  return db
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .count("comments.article_id", { as: "comment_count" })
    .then((result) => {
      if (result.author !== author)
        return result.filter((res) => res.author === author);
      else if (result.topic !== topic)
        return result.filter((res) => res.topic === topic);
      else
        return result.map((count) => {
          return { ...count, comment_count: Number(count.comment_count) };
        });
    });
};
