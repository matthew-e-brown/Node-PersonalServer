const fs = require("fs");

const express = require('express');
const router = express.Router();

function dateFormatCustom(date) {
  const n = date.getDate(); //day of month, 0 - 31
  const m = date.getMonth(); // 0 - 11
  const y = date.getFullYear(); // 2019

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return `${months[m]}. ${n}${((day) => {
    const ld = day.toString().split('').pop(); //last digit
    switch (ld) {
      case '1': return (day != 11) ? 'st' : 'th';
      case '2': return (day != 12) ? 'nd' : 'th';
      case '3': return (day != 13) ? 'rd' : 'th';
      default: return 'th';
    }
  })(n)}, ${y}`;
}

router.get("/", (request, response, next) => {
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
  response.send(JSON.stringify(reply));
});

module.exports = router;
