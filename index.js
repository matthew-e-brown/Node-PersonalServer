// https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Yyn-fBtGHfN0_xCtBwUkBp
// https://stackoverflow.com/questions/2727167/how-do-you-get-a-list-of-the-names-of-all-files-present-in-a-directory-in-node-j

const express = require("express");
const fs = require("fs");
const htmlparse = require("node-html-parser");

const app = express();

const server = app.listen(3000, () => {
  console.log("listening on port:3000");
});

app.use(express.static("public"));

app.get("/getsketches", (request, response) => {
  let folderNames = [];
  let paths = [];
  fs.readdirSync("public/p5/").forEach((file) => {
    let stat = fs.statSync(`public/p5/${file}`);
    if (stat.isDirectory()) {
      folderNames.push(file);
      paths.push(`p5/${file}`);
    }
  });
  // folders = ['asteroids'];
  // paths = ['public/p5/asteroids'];
  //Folders is now all the directories in the p5 folder (each sketch)
  let reply = new Array(folderNames.length);
  for (let i = 0; i < reply.length; i++) {
    reply[i] = {};

    //Path to HTML File
    reply[i].pathToSrc = `${paths[i]}/${folderNames[i]}.html`;

    //Title
    let html = fs.readFileSync(`public/${reply[i].pathToSrc}`, "utf-8");
    html = htmlparse.parse(html);
    reply[i].title = html.querySelector("title").innerHTML;

    //Description
    try {
      reply[i].desc = fs.readFileSync(`public/${paths[i]}/site-data/desc.txt`, "utf-8");
    } catch {
      reply[i].desc = "";
    }

    //Dates
    try {
      let dates = fs.readFileSync(`public/${paths[i]}/site-data/date.txt`, "utf-8").split("\r\n");
      dates.pop(); //get rid of the "" element

      for (let d = 0; d < dates.length; d++) dates[d] = new Date(dates[d]);
      reply[i].dateString = (dates.length < 2) ? dateFormatCustom(dates[0]) : `${dateFormatCustom(dates[0])} to ${dateFormatCustom(dates[1])}`;
      reply[i].dateUnix = dates[0].getTime();
    } catch {
      reply[i].dateString = "";
      reply[i].dateUnix = Number.MAX_SAFE_INTEGER;
    }
  }

  reply.sort((a, b) => a.dateUnix - b.dateUnix);
  // for (let i = 0; i < reply.length; i++) delete reply[i].dateUnix;

  response.send(JSON.stringify(reply));
});

function dateFormatCustom(date) {
  let n = date.getDate(); //day of month, 0 - 31
  let m = date.getMonth(); // 0 - 11
  let y = date.getFullYear(); // 2019

  let months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return `${months[m]}. ${n}${((day) => {
    let ld = day.toString().split('').pop(); //last digit
    switch (ld) {
      case '1':
        return (day != 11) ? 'st' : 'th';
      case '2':
        return (day != 12) ? 'nd' : 'th';
      case '3':
        return (day != 13) ? 'rd' : 'th';
      default:
        return 'th';
    }
  })(n)}, ${y}`;
}
