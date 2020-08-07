const commentsRouter = require("express").Router();
const {
  sendPatchComment,
  deleteCommentByCommentId,
} = require("../controllers/comments.controller");
const { handle405Errors } = require("../errors/handleCustomErrors");

commentsRouter
  .route("/:comment_id")
  .patch(sendPatchComment)
  .delete(deleteCommentByCommentId)
  .all(handle405Errors);

module.exports = commentsRouter;
