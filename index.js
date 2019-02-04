// https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Yyn-fBtGHfN0_xCtBwUkBp
// https://stackoverflow.com/questions/2727167/how-do-you-get-a-list-of-the-names-of-all-files-present-in-a-directory-in-node-j

const express = require("express");
const fs = require("fs");
const parser = require("node-html-parser");

const app = express();

const server = app.listen(3000, () => {
  console.log("listening on port:3000");
});

app.use(express.static("site"));

app.get("/getsketches", (request, response) => {
  const data = request.query;

  fs.readdir("site/p5/", (err, blob) => {
    if (err) throw err;
    let reply = "";
    for (let obj of blob) reply += `${obj} `
    response.send(reply);
  });

});
