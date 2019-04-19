const fs = require("fs");

const express = require('express');
const router = express.Router();

function func(request) {
  const folder = request.query.containingFolder;
  const mainFile = request.query.mainFile; //The site can send the name of a mainFile
  const reply = [];
  fs.readdirSync(`public/${folder}`).forEach((file) => {
    const stats = fs.statSync(`public/${folder}/${file}`);
    const extension = file.split('.').pop();
    if (stats.isFile() && extension.match(/js|html|css/)) {
      const fileBody = fs.readFileSync(`public/${folder}/${file}`, "utf-8");
      reply.push({
        name: file,
        body: (extension != "html") ? fileBody : fileBody.replace(/\</g, "&lt").replace(/\>/g, "&gt"),
        extn: extension
      });
      if (file == mainFile || file == "sketch.js" || file == "index.html") reply[reply.length - 1].mainFile = true;
      else reply[reply.length - 1].mainFile = false; //Tells whether the file is the one to be shown first
    }
  });
  return JSON.stringify(reply);
}

router.get("/", (req, res, next) => {
  response.send(func(request));
  next();
});

module.exports = { router, func };
