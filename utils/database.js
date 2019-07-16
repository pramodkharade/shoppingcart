const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

const mongoConnect = (callback)=>{
    mongoClient.connect(
            'mongodb+srv://pramodkharade:Dnyanda2017@shoppingcart-tmdv2.mongodb.net/test?retryWrites=true&w=majority',
            
            { useNewUrlParser:true})
           .then((client)=>{
               console.log('connected!');
               callback(client);
           })
           .catch((error)=>{
               console.log(error);
           });
}

module.exports = mongoConnect;