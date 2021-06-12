const db = require("../db/connection");

exports.fetchAllTopics = () => {
  console.log("inmodle");
  return db.select().from("topics");
};
