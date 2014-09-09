var express = require('express');
var api = require('../modules/api');
var md5 = require('MD5');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    api.request("user/index.json", {}, function(error, response, body) {
        if (error) {
            //handle the error
        }
        res.render('users/index', { title: 'Butts', data: body});
    });
});
router.get('/new', function(req, res) {
    res.render('users/new', {});
});
router.post('/new', function(req, res) {
  api.request("user/index.json", {name: req.body.username}, function(error, response, body) {
      if (body.length != 0){
        req.session.user = body;
        res.render('users/new', {flash: "Sorry, but a user with that email address already exists..."});
      } else if (req.body.password != req.body.password_confirm){
        res.render('users/new', {flash: "Sorry, but your passwords didn't match. Please try one more time."});
      } else {
        api.request("user/create.json", {email: req.body.email, name: req.body.username, md5: md5(req.body.password)}, function(e, r, b){
          req.session.user = b;
          res.render('users/new')
        })
      }
  });

});
router.get('/login', function(req, res){
  res.render('users/login')
})
router.post('/login', function(req, res){
  api.request("user/index.json", {name: req.body.username}, function(error, response, body) {
    if (body[0].md5 == md5(req.body.password)){
      req.session.user = body[0];
      res.redirect('/users/'+req.session.user.name)
    } else {
      res.render('users/login', {flash: "Sorry, but your password didn't seem to check out..."});
    }
  })
})
router.get('/logout', function(req, res){
  req.session.user = null;
  res.render('users/login', {flash: "You have been logged out."})
})
router.get('/forgot', function(req, res){
  res.render('users/forgot')
})
router.post('/forgot', function(req, res){
  api.request("user/index.json", {name: req.body.username}, function(error, response, body) {
    if (req.body.secret_password == "fidelio"){
      if (req.body.password != req.body.password_confirm){
        res.render('users/forgot', {flash: "Sorry, but your passwords didn't match. Please try one more time."});
      } else if (body.length == 0){
        res.render('users/forgot', {flash: "Sorry, but I couldn't find an existing account matching that username. Maybe try <a href='/users/new'>Signing up</a>?"});
      } else {
        api.request("user/update_password.json", {name: req.body.username, md5: md5(req.body.password)}, function(e, r, b){
          req.session.user = b;
          res.render('users/login', {flas: "Alright, things are looking good. Your password is now updated."})
        })
      }
    }
  })
})
router.get('/:name', function(req, res){
  api.request("graph/index.json", {"user_id": req.session.user._id}, function(error, response, body) {
      if (error) {
          //handle the error
      }
      res.render('users/main', {graphs: body, count: body.length});
  });
})
module.exports = router;
