'use strict'

const express = require("express");
const cookieParser = require("cookie-parser");

/* My routes */
const sketchlist = require('./routes/getSketchList');
const sourcecode = require('./routes/getSourceCode');

const app = express();

const server = app.listen(80, () => {
  console.log(`Listening on port #${server.address().port}.`);
});

app.set('view engine', 'ejs');

app.use(cookieParser());

/* Host the site */
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.render('index', {
    // Get the sketch list from the function in sketchlist
    sketches: JSON.parse(sketchlist.func(req.cookies['sketchSortState'])),
    sortState: req.cookies['sketchSortState']
  });
});

/* Host my routes */
app.use('/getSketchList', sketchlist.router);
app.use('/getSourceCode', sourcecode.router);

/* Since this is the last route, it will be the default
 * in the event of a 404. Hence, it is the 404 route. */
app.use((req, res, next) => {
  throw {
    status: 404,
    message: 'File not found.'
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  if (req.accepts('html')) {
    res.render('error', {
      status: err.status || 500,
      message: err.message,
      detail: err.stack
    });
  } else res.type('txt').send('Error 404: Not Found.')
});
