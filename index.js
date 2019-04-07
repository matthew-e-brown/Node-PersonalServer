const express = require("express");

/* My routes */
const sketchlist = require('./routes/getSketchList');
const sourcecode = require('./routes/getSourceCode');

const app = express();

const server = app.listen(80, () => {
  console.log(`Listening on port #${server.address().port}.`);
});

/* Host the site */
app.use(express.static("public"));

/* Host my routes */
app.use('/getSketchList', sketchlist);
app.use('/getSourceCode', sourcecode);
