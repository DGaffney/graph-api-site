var express = require('express');
var router = express.Router();
var api = require('../modules/api');
/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});
router.get('/new', function(req, res){
  res.render('edges/new', {graph_id: req.query.graph_id})
})
router.post('/new', function(req, res){
  var submission_count = 0
  var edges = req.body.edges.split('\n')
  for (var edge in edges){
    source = edges[edge].split(',')[0]
    target = edges[edge].split(',')[1]
    api.request('edge/create.json', {source: source, target: target, graph_id: req.body.graph_id}, function (e, r, b){
      b
    })
    submission_count = submission_count+1;
  }
  res.render('edges/new', {graph_id: req.body.graph_id, flash: "A total of "+submission_count+" edges are now being added to this graph. Please be patient as this may take a considerable amount of time if you're adding lots of edges..."})
})
module.exports = router;
