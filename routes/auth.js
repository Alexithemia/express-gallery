const express = require('express');
const router = express.Router();
const knex = require('../database/knex');
const bcrypt = require('bcryptjs');

router.route('/dashboard')
  .get(function (req, res) {
    res.render('auth/dashboard')
  });

router.route('/login')
  .get(function (req, res) {
    res.render('auth/login')
  });

router.route('/register')
  .get(function (req, res) {
    res.render('auth/register')
  });

// router.route('/login')
//   .post('/login', passport.authenticate('local', {
//     successRedirect: '/secret',
//     failureRedirect: '/login.html'
//   }));

// router.route('/register')
//   .post(function (req, res) {
//     bcrypt.genSalt(12, function (err, salt) {
//       bcrypt.hash(req.body.password, salt, function (err, hash) {
//         console.log(hash);
//         req.body.password = hash;
//         knex('users')
//           .insert(req.body)
//           .then(function () {
//             knex.select('first_name', 'last_name', 'email')
//               .from('users')
//               .where('email', req.body.email)
//               .then(function (user) {
//                 res.redirect('auth/profile' + user[0]);
//               })
//               .catch(function () {

//               });
//           })
//           .catch(function () {
//             res.redirect('register')
//           });
//       });
//     });

//   });

router.route('/logout')
  .post(function (req, res) {

  });

module.exports = router;