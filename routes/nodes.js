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
var node_create = function (node, callback){
  api.request('node/create.json', {label: node}, function (e, r, b){
    callback(null, b._id)
  })
}
router.post('/new', function(req, res){
  var node_ids = [];
  var nodes = req.body.nodes.split(/,|\n/);
  var graph_id = req.body.graph_id
  async.map(nodes, node_create, function (err, result) {
    console.log(node_ids)
    api.request('graph/add_node.json', {node_ids: node_ids, graph_id: graph_id}, function (e, r, b){
      console.log(b)
      res.render('nodes/new', {graph_id: graph_id, node_ids: node_ids, node_ids_count: node_ids.length})
    })
  });


})

module.exports = router;
