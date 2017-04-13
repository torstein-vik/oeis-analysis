var https = require('https');

var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

getData(0, (initData) => {
    
    console.log("Count: " + initData.count);
    
    MongoClient.connect("mongodb://127.0.0.1:27017/multfuncdb", (err, db) => {
        if(err) throw err;
        
        console.log("Database connected!");
        
        db.createCollection('OEIS-Functions', (err, collection) => {
            if(err) throw err;
            
            console.log("Collection created!");
            
            collection.remove({});
            
            collection.insert(initData.results);
            
            console.log(`Inserted ${Math.min(10, initData.count)} / ${initData.count}`);
            
            function insertNext(i){
                getData(i, (data) => {
                    
                    if(i * 10 >= initData.count){
                        console.log("All functions added!");
                        console.log("Done!");
                    } else {
                        collection.insert(data.results);
                        console.log(`Inserted ${Math.min(i * 10 + 10, initData.count)} / ${initData.count}`);
                    
                        setTimeout(() => insertNext(i + 1), 1000);
                    }
                });
            }
            
            insertNext(1);
            
        });
    });
});



function getData(i, callback){
    https.get('https://oeis.org/search?q=keyword:mult&fmt=json&start=' + i * 10, (res) => {
        res.setEncoding('utf8');
        
        var rawData = '';
        
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => callback(JSON.parse(rawData)));
    }).on('error', (err) => {throw err;});
}
