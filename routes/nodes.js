var express = require('express');
var router = express.Router();
var api = require('../modules/api');
var async = require('async')

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});
router.get('/new', function(req, res){
  res.render('nodes/new', {graph_id: req.query.graph_id})
})
var node_create = function (node){
  api.request('node/create.json', {id: node, label: node}, function (e, r, b){
    b
  })
}
router.post('/new', function(req, res){
  var node_ids = [];
  var nodes = req.body.nodes.split(/,|\n/);
  var funcs = []
  for (var i = 0;i < nodes.length; i++){
    funcs.push(node_create(nodes[i]))
  }
  api.request('graph/add_node.json', {node_ids: node_ids, graph_id: req.query.graph_id}, function (e, r, b){
    res.render('nodes/new', {graph_id: req.query.graph_id, node_ids: node_ids, node_ids_count: node_ids.length})
  })


  // while (node_ids.length != req.body.nodes.split(/,|\n/)) {}


})
module.exports = router;
