const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;
class User{
    constructor(username,email){
        this.name = username;
        this.email = email;
    }
    save(){
        let db = getDb();
       return db.collection('users').insertOne(this)
                                    .then(()=>{})
                                    .catch(error=>{
                                        console.log(error);
                                    });
    }
    static findById(userId){
        let db = getDb();
       return db.collection('users').find({_id: new mongodb.ObjectId(userId)})
                              .next()
                              .then(()=>{})
                              .catch(error=>{
                                  console.log(error);
                                });
    }
}
module.exports = User;