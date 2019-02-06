const express = require('express');
const router = express.Router();
const knex = require('../database');

router.route('/')
  .post(function (req, res) {
    knex('images')
      .insert(req.body)
      .then(function () {
        knex.select('id')
          .from('images')
          .where('link', req.body.link)
          .then(function (image) {
            res.redirect('gallery/' + image[0].id);
          });
      })
      .catch(function () {
        res.redirect('gallery/new');
      })
  });

router.route('/new')
  .get(function (req, res) {
    res.render('gallery/new')
  });

router.route('/:id')
  .get(function (req, res) {
    knex.select('author', 'link', 'description')
      .from('images')
      .where('id', req.params.id)
      .then(function (image) {
        if (image[0]) {
          res.render('gallery/image', image[0]);
        } else {
          res.render('404');
        }
      });
  })
  .put(function (req, res) {
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
            .then(function (result) {
              console.log(result);

              res.redirect('/gallery/' + req.params.id);
            })
            .catch(function (result) {
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
  .delete(function (req, res) {
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
  .get(function (req, res) {
    knex.select('author', 'link', 'description')
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