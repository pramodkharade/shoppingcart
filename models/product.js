const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    title:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    description:{
        type:String,
        require: true
    },
    imageUrl:{
        type:String,
        require:true
    }
});

module.exports = mongoose.model('Product',productSchema);
// const mongodb = require('mongodb');
// const getDb = require('../utils/database').getDb;
// class Product{
//     constructor(title,price,description,imageUrl,id,userId){
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ?new mongodb.ObjectId(id):null;
//         this.userId = userId;
//         console.log('product save:',this.userId);
//     }
//     save(){
//         const db = getDb();
//         let dbOp;
//       if(this._id){
//           //update record
//           dbOp = db.collection('products').updateOne({_id: this._id}, {$set:this});
//       }else{
//         dbOp = db.collection('products')
//         .insertOne(this);
//       }
//       return dbOp.then((result)=>{
//             console.log(result);
//         })
//         .catch((error)=>{
//             console.log(error);
//         });
//     }
//     static findById(prodID){
//         const db = getDb();
//         return db.collection('products').find({_id: new mongodb.ObjectId(prodID)})
//                  .next()
//                  .then((product)=>{
//                      return product;
//                  })
//                  .catch(error=>{});
//     }
//     static fetchAll(){
//         const db = getDb();
//         return db.collection('products')
//                  .find()
//                  .toArray()
//                  .then((products)=>{
//                      console.log('Product is:',products);
//                      return products;
//                  })
//                  .catch(error=>{
//                      console.log(error);
//                  });
//     }
//     static deleteById(prodId){
//         const db = getDb();
//        return  db.collection('products')
//           .deleteOne({_id: new mongodb.ObjectId(prodId)})
//           .then(()=>{})
//           .catch((error)=>{
//               console.log(error);
//           });
//     }
// }
// module.exports = Product;