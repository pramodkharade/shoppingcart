const fs = require('fs');
const path = require('path');
const filepath = path.join(__dirname,
    '../data',
    'cart.json');
module.exports = class Cart {
    static addProduct(id,productPrice){
       // Fetch the previous cart
    fs.readFile(filepath, (err, fileContent) => {
        let cart = { products: [], totalPrice: 0 };
        if (!err) {
          cart = JSON.parse(fileContent);
        }
        // Analyze the cart => Find existing product
        const existingProductIndex = cart.products.findIndex(
          prod => prod.id === id
        );
        const existingProduct = cart.products[existingProductIndex];
        let updatedProduct;
        // Add new product/ increase quantity
        if (existingProduct) {
          updatedProduct = { ...existingProduct };
          updatedProduct.qty = updatedProduct.qty + 1;
          cart.products = [...cart.products];
          cart.products[existingProductIndex] = updatedProduct;
        } else {
          updatedProduct = { id: id, qty: 1 };
          cart.products = [...cart.products, updatedProduct];
        }
        cart.totalPrice = cart.totalPrice + +productPrice;
        fs.writeFile(filepath, JSON.stringify(cart), err => {
          console.log(err);
        });
      });
    }
    static deleteProduct(id, productPrice){
      fs.readFile(filepath,(err, fileContent)=>{
          if(err){
            return;
          }
          console.log('Prod Id is:',id,' Product Price:', productPrice);
          const updatedCart = {...JSON.parse(fileContent)};
          const product = updatedCart.products.find(prod=> prod.id === id);
          const productQty = product.qty;
          updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
          updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
          fs.writeFile(filepath, JSON.stringify(updatedCart), err => {
            console.log(err);
          });
      });
    }
    static getCart(cb){
      fs.readFile(filepath,(err,fileContent)=>{
          const cart = JSON.parse(fileContent);
          if(err){
            cb(null);
          }else{
            cb(cart);
          }
      });
    }
}