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
        return db.execute('INSERT INTO products (title,price,imageUrl,description) VALUES(?,?,?,?)',[
            this.title,this.price,this.imageUrl,this.description
        ]);
    }
    static deleteById(id){
       
    }
    static fetchAll(cb){
        return db.execute('SELECT * FROM products');
    }

    static findById(id,cb){
        
    }
}