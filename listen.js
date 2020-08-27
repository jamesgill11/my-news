const app = require("./app");

// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 8000;
// }
app.listen(9090, () => {
  console.log("listening on 9090");
});

// app.listen(port);
