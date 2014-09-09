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
  api.request('node/create.json', {label: node, id: node, attributes: [{value: 2, for: "Friends"}, {value: 7, for: "Number"}]}, function (e, r, b){
    callback(null, b._id)
  })
}
router.post('/new', function(req, res){
  var node_ids = [];
  var nodes = req.body.nodes.split(/,|\n|\r\n/);
  var graph_id = req.body.graph_id
  async.map(nodes, node_create, function (err, result) {
    api.request('graph/add_node.json', {node_ids: result, graph_id: graph_id}, function (e, r, b){
      res.render('nodes/new', {flash: "A total of "+result.length+" nodes have been added to this graph!", graph_id: graph_id, node_ids: result, node_ids_count: result.length})
    })
  });


})

module.exports = router;
