const Cart = require('./cart');
const db = require('../utils/database');
module.exports = class Product {
    constructor(id,title,imageUrl,price,description){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    save(){
        
    }
    static deleteById(id){
       
    }
    static fetchAll(cb){
        return db.execute('SELECT * FROM products');
    }

    static findById(id,cb){
        
    }
}