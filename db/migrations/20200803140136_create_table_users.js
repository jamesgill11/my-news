exports.up = function (knex) {
  console.log("creating users table");
  return knex.schema.createTable("users", (usersTable) => {
    usersTable.text("username").primary().notNullable();
    usersTable.string("avatar_url");
    usersTable.text("name").notNullable();
  });
};

exports.down = function (knex) {
  console.log("dropping users table");
  return knex.schema.dropTable("users");
};
