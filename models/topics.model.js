const db = require("../db/connection");

exports.fetchAllTopics = () => {
  return db.select().from("topics");
};
