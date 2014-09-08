var express = require('express');
var router = express.Router();
var api = require('../modules/api');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});
router.get('/new', function(req, res){
  res.render('graphs/new')
})
router.post('/new', function(req, res){
  api.request("graph/create.json", req.body, function(error, response, body) {
      if (error) {
          //handle the error
      }
      api.request('graph/index.json', {user_id: req.session.user._id}, function (e, r, b){
        res.redirect('/users/'+req.session.user.name);
      })
  });
})
router.get('/:id', function(req, res){
  api.request("graph/index.json", {_id: req.params.id}, function(e, r, b){
    api.request("user/index.json", {_id: req.body.user_id}, function(error, response, body){
      console.log(b)
      console.log(body)
      res.render('graphs/show', {graph: b[0], user: body[0]})
    })
  })
})
router.get('/:id/destroy', function(req, res){
  api.request("graph/destroy.json", {_id: req.params.id}, function(e,r,b){
    res.redirect('/users/'+req.session.user.name)
  })
})
module.exports = router;
