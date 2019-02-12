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

router.route('/logout')
  .post(function (req, res) {

  });

module.exports = router;