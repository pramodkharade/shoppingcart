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
        // const cartProduct = this.cart.items.findIndex(cp => {
        //     return cp._id === product._id;
        // });

        const updatedCart = { items: [{productId: new mongodb.ObjectId(product._id), quantity: 1 }] };
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