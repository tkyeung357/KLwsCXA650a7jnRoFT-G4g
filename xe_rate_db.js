var mongoClient = require("mongodb").MongoClient, 
asset = require("assert");

var xe_rate_db = function() {
    this.url = 'mongodb://minion:banana@ds053380.mongolab.com:53380/timsdb';
}

xe_rate_db.prototype.insertXeRate = function(data, callback) {
    
    mongoClient.connect(this.url, function(err, db) {
        if(err !== null) {
            console.log('db connect failed');
            callback(err, null);
            return;
        }
        console.log('connected to db');
        var xe_collection = db.collection('xerate');
        xe_collection.insert(data, function(err, result) {
            callback(err, result);
            db.close();
            console.log('db connection closed');
        });
    });
}

module.exports = xe_rate_db;
/*
    mongoClient.connect(url, function(err, db) {
        asset.equal(null, err);
        console.log('connected to db');
        db.close();
    });
*/