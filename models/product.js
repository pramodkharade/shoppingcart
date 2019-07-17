const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;
class Product{
    constructor(title,price,description,imageUrl,id){
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = new mongodb.ObjectId(id);
    }
    save(){
        const db = getDb();
        let dbOp;
      if(this._id){
          //update record
          dbOp = db.collection('products').updateOne({_id: this._id}, {$set:this});
      }else{
        dbOp = db.collection('products')
        .insertOne(this);
      }
      return dbOp.then((result)=>{
            console.log(result);
        })
        .catch((error)=>{
            console.log(error);
        });
    }
    static findById(prodID){
        const db = getDb();
        return db.collection('products').find({_id: new mongodb.ObjectId(prodID)})
                 .next()
                 .then((product)=>{
                     return product;
                 })
                 .catch(error=>{});
    }
    static fetchAll(){
        const db = getDb();
        return db.collection('products')
                 .find()
                 .toArray()
                 .then((products)=>{
                     console.log('Product is:',products);
                     return products;
                 })
                 .catch(error=>{
                     console.log(error);
                 });
    }
    static deleteById(prodId){
        const db = getDb();
       return  db.collection('products')
          .deleteOne({_id: new mongodb.ObjectId(prodId)})
          .then(()=>{})
          .catch((error)=>{
              console.log(error);
          });
    }
}
module.exports = Product;