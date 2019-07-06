const fs = require('fs');
const path = require('path');
const filepath = path.join(__dirname,
    '../data',
    'products.json');
const getProductsFromFile = (cb)=>{
    
        fs.readFile(filepath,(err,data)=>{
            if(err){
                cb([]);
            }else{
                cb(JSON.parse(data));
            }
        });
}
module.exports = class Product {
    constructor(title,imageUrl,price,description){
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    save(){
        this.id = Math.random().toString();
        getProductsFromFile((products)=>{
            products.push(this);
            fs.writeFile(filepath,JSON.stringify(products),(error)=>{
                console.log(error);
            });
        });
    }
    static fetchAll(cb){
        getProductsFromFile(cb);
    }

    static findById(id,cb){
        getProductsFromFile((products)=>{
            const product = products.find(p=>p.id===id);
            cb(product);
        });
    }
}