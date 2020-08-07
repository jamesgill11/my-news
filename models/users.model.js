const db = require("../db/connection");

exports.fetchUserByUsername = (username) => {
  return db
    .select("*")
    .from("users")
    .where("username", username)
    .then((res) => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: "user not found!" });
      }
      return res;
    });
};
