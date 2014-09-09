var express = require('express');
var router = express.Router();
var api = require('../modules/api');
var request = require('request');

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
      api.request("edge/count.json", {graph_id: req.params.id}, function(ee, rr, bb){
        res.render('graphs/show', {graph: b[0], user: body[0], edge_count: bb, created_at: api.idToTime(b[0]._id)})
      })
    })
  })
})
router.get('/:id/destroy', function(req, res){
  api.request("graph/destroy.json", {_id: req.params.id}, function(e,r,b){
    res.redirect('/users/'+req.session.user.name)
  })
})
router.get('/:id/download', function(req, res){
  // console.log(req.params.id)
  // api.request('graph/download.gexf', {graph_id: req.params.id}, function(e,r,b){
  //   console.log(e)
  //   console.log(r)
  //   res.render(b)
  // })
  request('http://0.0.0.0:8080/v1/graph/download.gexf?graph_id='+req.params.id, function (error, response, body) {
    res.end(body)
    if (!error && response.statusCode == 200) {

    }
  })
})

router.get('/:id/download_file', function(req, res) {
    var doc = new PDFDocument();
    // ...

    doc.output(function(buf) { // as of PDFKit v0.2.1 -- see edit history for older versions
        res.writeHead(200, {
             'Content-Type': 'application/pdf',
             'Cache-Control': 'private',
             'Content-Length': buf.length
        });
        res.end(buf);
    });
});
module.exports = router;
