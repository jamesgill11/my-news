const ENV = process.env.NODE_ENV || "development";
// const data = { test, development, production: development };

const data = {
  development: require("./development-data"),
  test: require("./test-data"),
  production: development,
};

module.exports = data[ENV];
