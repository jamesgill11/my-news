const db = require("../db/connection");

// exports.sendComments = () => {
//   return db.select().from("comments");
// };

exports.newPatchComment = (comment_id, votes = 0) => {
  return db("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", votes)
    .returning("*")
    .then((res) => {
      if (comment_id === undefined) {
        return Promise.reject({ status: 404, msg: "comment not found!" });
      }
      return res[0];
    });
};

exports.removeCommentByCommentId = (comment_id) => {
  return db("comments")
    .where("comment_id", comment_id)
    .del()
    .then((count) => {
      if (count === 0)
        return Promise.reject({ status: 404, msg: "comment_id not found" });
    });
};
