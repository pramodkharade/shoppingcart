const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;
class Product{
    constructor(title,price,description,imageUrl){
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }
    save(){
        const db = getDb();
      return   db.collection('products')
          .insertOne(this)
          .then((result)=>{
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
}
module.exports = Product;