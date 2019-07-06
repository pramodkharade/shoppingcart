const fs = require('fs');
const path = require('path');
const filepath = path.join(__dirname,
    '../data',
    'cart.json');
module.exports = class Cart {
    static addProduct(id,productPrice){
        // fetch previous cart
        fs.readFile(filepath,(err,fileContent)=>{
            let cart = {products:[],totalPrice:0};
            if(!err){
                const cart = JSON.parse(fileContent); 
            }
            // analyze the cart => find existing product
            const existingProductIndex = cart.products.findIndex((prod)=> prod.id===id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex]= updatedProduct;
            }else{
                updatedProduct = {id:id,qty:1};
                cart.products = [...cart.products,updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(filepath,JSON.stringify(cart),(err)=>{
                console.log(err);
            });
        });
    }
}