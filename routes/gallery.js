const express = require('express');
const router = express.Router();
const knex = require('../database/knex');
const flash = require('connect-flash');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { next(); }
  else {
    req.flash('info', 'You must be logged in to do that');
    res.redirect('/login');
  }
}

router.route('/')
  .post(isAuthenticated, function (req, res) {
    knex('images')
      .insert(req.body)
      .then(function () {
        knex.select('id')
          .from('images')
          .where('link', req.body.link)
          .then(function (image) {
            res.redirect(image[0].id);
          });
      })
      .catch(function () {
        res.redirect('gallery/new');
      })
  });

router.route('/new')
  .get(isAuthenticated, function (req, res) {
    res.render('gallery/new')
  });

router.route('/:id')
  .get(function (req, res) {
    knex.select('author', 'link', 'description', 'id')
      .from('images')
      .where('id', req.params.id)
      .then(function (image) {
        knex.select('id', 'author', 'link')
          .from('images')
          .whereNot('id', req.params.id)
          .then(function (imageList) {
            if (image[0]) {
              image[0].user = req.session.passport.user;
              res.render('gallery/image', { 'detail': image[0], 'list': imageList, 'user': req.user });
            } else {
              res.render('404');
            }
          });
      });
  })
  .put(isAuthenticated, function (req, res) {
    knex.select('author')
      .from('images')
      .where('id', req.params.id)
      .then(function (image) {
        if (image.length) {
          let imgObj = req.body;
          delete imgObj._method;
          knex('images')
            .where('id', req.params.id)
            .update(imgObj)
            .then(function () {
              res.redirect(req.params.id);
            })
            .catch(function () {
              res.status(400).redirect('gallery/edit');
            });
        } else {
          res.render('404');
        }
      })
      .catch(function () {
        res.status(500).end('unknown server error');
      });
  })
  .delete(isAuthenticated, function (req, res) {
    knex('images')
      .where('id', req.params.id)
      .del()
      .then(function () {
        res.redirect('/');
      })
      .catch(function () {
        res.status(500).end('unknown server error');
      });
  });

router.route('/:id/edit')
  .get(isAuthenticated, function (req, res) {
    knex.select('id', 'author', 'link', 'description')
      .from('images')
      .where('id', req.params.id)
      .then(function (image) {
        if (image.length) {
          res.render('gallery/edit', image[0]);
        } else {
          res.render('404');
        }
      })
      .catch(function () {
        res.status(500).end('unknown server error');
      });
  });

module.exports = router;