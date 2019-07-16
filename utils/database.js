const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = (callback)=>{
    mongoClient.connect(
            'mongodb+srv://username:password@shoppingcart-tmdv2.mongodb.net/dbname?retryWrites=true&w=majority',
            
            { useNewUrlParser:true})
           .then((client)=>{
               console.log('connected!');
               _db = client.db();
               callback();
           })
           .catch((error)=>{
               console.log(error);
               throw error;
           });
};

const getDb = () =>{
    if(_db){
        return _db;
    }
    throw 'No database found!'
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;