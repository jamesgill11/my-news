const app = require("./app");

// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 8000;
// }
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

// app.listen(port);
