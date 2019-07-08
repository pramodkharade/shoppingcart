const fs = require('fs');
const path = require('path');
const Cart = require('./cart');
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
    constructor(id,title,imageUrl,price,description){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    save(){
        getProductsFromFile((products)=>{
            if(this.id){
                const existingProductIndex = products.findIndex(prod=> prod.id === this.id);
                const updatedProducts = [...products];
                 updatedProducts[existingProductIndex] = this;
                 fs.writeFile(filepath,JSON.stringify(updatedProducts),(error)=>{
                    console.log(error);
                });
            }else{
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(filepath,JSON.stringify(products),(error)=>{
                    console.log(error);
                });
            }
            
        });
    }
    static deleteById(id){
        console.log('ID Is:',id);
        getProductsFromFile((products)=>{
            const product = products.find(prod=> prod.id === id);
            console.log('product Is:',product);
            const updatedProduct = products.filter(p=> p.id !== id);
            fs.writeFile(filepath,JSON.stringify(updatedProduct),(error)=>{
                if(!error){
                    Cart.deleteProduct(id,+product.price);
                }
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