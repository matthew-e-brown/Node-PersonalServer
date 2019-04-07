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

/* Since this is the last route, it will be the default
 * in the event of a 404. Hence, it is the 404 route. */
app.use((request, response, next) => {
  response.status(404);

  if (request.accepts('html')) {
    response.redirect('404.html');
    return;
  }

  response.type('txt').send('Error 404: Not Found.')
});
