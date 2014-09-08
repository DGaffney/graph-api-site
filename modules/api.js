var request = require('request-json');
var base_url = "http://0.0.0.0:8080/v1/"
var client = request.newClient(base_url);
var ObjectID = require('mongodb').ObjectID
exports.request = function (url, data, callback) {
  client.post(base_url+url, data, function (error, response, body) {
      if (error) {
          return callback(error);
      }
      callback(null, response, body);
  })
};

exports.idToTime = function (mongoId){
  var objectId = new ObjectID();
  return objectId.getTimestamp();
};
