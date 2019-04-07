const htmlparse = require("node-html-parser");
const fs = require("fs");

const express = require('express');
const router = express.Router();

router.get('/', (request, response, next) => {
  const sortState = request.query.sort;
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

    //Path to Folder
    reply[i].pathToFolder = paths[i];

    //Title
    let html = fs.readFileSync(`public/${reply[i].pathToSrc}`, "utf-8");
    html = htmlparse.parse(html);
    reply[i].title = html.querySelector("title").innerHTML;

    //Description
    try {
      reply[i].desc = fs.readFileSync(`public/${paths[i]}/site-data/desc.txt`, "utf-8");
      // console.log(`${paths[i]} description check`);
    } catch (err) {
      reply[i].desc = "\n";
      // console.log(`${paths[i]} description failed`);
    }

    //Dates
    try {
      let dates = fs.readFileSync(`public/${paths[i]}/site-data/date.txt`, "utf-8").split(/\r\n|\n/);
      dates.pop(); //get rid of the "" element

      for (let d = 0; d < dates.length; d++) dates[d] = new Date(dates[d]);
      reply[i].dateString = (dates.length < 2) ? dateFormatCustom(dates[0]) : `${dateFormatCustom(dates[0])} to ${dateFormatCustom(dates[1])}`;
      reply[i].dateUnix = (dates[1]) ? dates[1].getTime() : dates[0].getTime();
      // console.log(`${paths[i]} dates check`);
    } catch (err) {
      reply[i].dateString = "";
      reply[i].dateUnix = Number.MAX_SAFE_INTEGER; // If you can't find it, just stick it at the end of the list
      // console.log(`${paths[i]} dates failed`);
    }
  }

  // If sortState is not NewToOld, sort OldToNew.
  // Done this way so that an undefined value gets the default sort, OTN.
  reply.sort((a, b) => sortState != 'nto' ? a.dateUnix - b.dateUnix : b.dateUnix - a.dateUnix);

  response.send(JSON.stringify(reply));
});

module.exports = router;
