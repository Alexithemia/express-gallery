const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const gallery = require('./routes/gallery');
const knex = require('./database/knex');
const redis = require('connect-redis')(session);
const flash = require('connect-flash');

const User = require('./database/models/User');
const app = express();
const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || 'development';
const SESSION_SECRET = process.env.SESSION_SECRET || 'keyboard cat';
const saltRounds = 12;

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }));
app.set('view engine', '.hbs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  store: new redis({ url: 'redis://redis-server:6379', logErrors: true }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: ENV === 'production' }
}))

app.use(methodOverride('_method'));

// PASSPORT STUFFFFFFFFFF
app.use(passport.initialize());
app.use(passport.session());

// after login
passport.serializeUser((user, done) => {
  return done(null, {
    id: user.id
  });
});

// after every request
passport.deserializeUser((user, done) => {
  new User({ id: user.id }).fetch()
    .then(dbUser => {
      dbUser = dbUser.toJSON();
      return done(null, {
        id: dbUser.id,
        username: dbUser.username
      });
    })
    .catch((err) => {
      console.log(err);
      return done(err);
    });
});

passport.use(new LocalStrategy(function (username, password, done) {
  return new User({ username: username })
    .fetch()
    .then((user) => {
      user = user.toJSON();

      if (user === null) {
        return done(null, false, { message: 'bad username or password' });
      }
      else {
        bcrypt.compare(password, user.password)
          .then((res) => {
            if (res) { return done(null, user); }
            else {
              return done(null, false, { message: 'bad username or password' });
            }
          });
      }
    })
    .catch(err => {
      console.log('error: ', err);
      return done(err);
    });
}));

app.get('/register', function (req, res) {
  res.render('auth/register')
});

app.post('/register', (req, res) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) { console.log(err); }
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) { console.log(err); }
      return new User({
        username: req.body.username,
        password: hash
      })
        .save()
        .then((user) => {
          res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
          return res.send('Error Creating account');
        });
    });
  });
});

app.get('/login', function (req, res) {
  res.render('auth/login', { messages: req.flash('info') })
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', isAuthenticated, (req, res) => {
  req.logout();
  res.redirect('/');
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { next(); }
  else {
    req.flash('info', 'You must be logged in to do that');
    res.redirect('/login');
  }
}

app.use('/gallery', gallery);

app.get('/', function (req, res) {
  knex('images')
    .select('id', 'author', 'link')
    .orderBy('updated_at', 'desc')
    .then(function (imgs) {
      res.render('./', { 'list': imgs, 'user': req.user });
    })
});

app.listen(PORT, function () {
  console.log(`Server running on port: ${PORT}`);
});

module.exports = app;