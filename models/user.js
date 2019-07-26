const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;
class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }
    save() {
        let db = getDb();
        return db.collection('users').insertOne(this)
            .then(() => { })
            .catch(error => {
                console.log(error);
            });
    }
    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
        const db = getDb();
        return db.collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: updatedCart } }
            );
    }
    static findById(userId) {
        let db = getDb();
        return db.collection('users').find({ _id: new mongodb.ObjectId(userId) })
            .next()
            .then((user) => {

                console.log('User Model::', user);
                return user;
            })
            .catch(error => {
                console.log(error);
            });
    }
}
module.exports = User;