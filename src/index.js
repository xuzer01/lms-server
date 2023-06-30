const express = require("express");
const database = require("./database/");
const router = require("./routes");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express JS");
});

app.use(router);

database.sync();

app.listen(3000);
