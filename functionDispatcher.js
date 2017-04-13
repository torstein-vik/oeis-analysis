var https = require('https');

var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

var handler = require('./functionHandler.js');

MongoClient.connect("mongodb://127.0.0.1:27017/multfuncdb", (err, db) => {
    if(err) throw err;

    console.log("Database connected!");

    var collection = db.collection('OEIS-Functions');

    var query = collection.find({program: /SAGE|Sage/});

    query.count((err, num) => console.log(`Amount: ${num}`));

    query.each((err, doc) => {
        if(err == null && doc != null){
            dispatch(doc);

        }
    });

});

function dispatch(f){
    handler.handle(f);
}
