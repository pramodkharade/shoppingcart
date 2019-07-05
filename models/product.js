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
    constructor(title){
        this.title = title;
    }
    save(){
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
}