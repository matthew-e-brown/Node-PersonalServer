const http = require("http");
const express = require("express");
const app = express();

app.get('/', (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000);
