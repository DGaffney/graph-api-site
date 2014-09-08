var express = require('express');
var api = require('../modules/api');
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
  api.request("user/index.json", {email: req.body.email}, function(error, response, body) {
      if (body.length != 0){
        req.session.user = body;
        res.render('users/new', {flash: "Sorry, but a user with that email address already exists..."});
      } else {
        console.log("BODY")
        console.log(req.body)
        api.request("user/create.json", req.body, function(e, r, b){
          req.session.user = b;
          console.log("Session")
          console.log(req.session)
          res.render('users/new')
        })
      }
  });

});
router.get('/login', function(req, res){
  res.render('users/login')
})
router.post('/login', function(req, res){
  api.request("user/index.json", {email: req.body.email}, function(error, response, body) {
    if (body[0].password == req.body.password){
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
router.get('/:name', function(req, res){
  api.request("graph/index.json", {"user_id": req.session.user._id}, function(error, response, body) {
      if (error) {
          //handle the error
      }
      console.log(body)
      res.render('users/main', {graphs: body, count: body.length});
  });
})
module.exports = router;
