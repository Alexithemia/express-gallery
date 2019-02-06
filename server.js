const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const gallery = require('./routes/gallery');
const knex = require('./database');

const app = express();
const PORT = process.env.PORT || 8080;

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }));
app.set('view engine', '.hbs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'));

app.use('/gallery', gallery);

app.get('/', function (req, res) {
  knex('images')
    .select('id', 'author', 'link', 'description')
    .then(function (imgs) {
      res.render('./', { 'list': imgs });
    })

});

app.listen(PORT, function () {
  console.log(`Server running on port: ${PORT}`);
});

module.exports = app;