const Product = require('../models/product');
const Order = require('../models/order');
//const cart = require('../models/cart');

exports.getProducts = (req, res, next) => {

    Product.find()
        .then((products) => {
            res.render('shop/product-list',
                {
                    prods: products,
                    pageTitle: 'All Products',
                    path: '/products'
                });
        })
        .catch((error) => {
            console.log(error);
        });
};
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-details', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));

}

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
            console.log(result);
        });
}
exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            const products = user.cart.items;
                    res.render('shop/cart',
                        {
                            path: '/cart',
                            pageTitle: 'Your Cart',
                            products: products
                        });
                
        })
        .catch((error) => {
            console.log('Error is:', error);
        });
};

exports.postCartDeleteProduct = ((req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .removeItemFromCart(prodId)
        .then((result) => {
            res.redirect('/cart');
        })
        .catch((error) => { console.log(error); });
});
exports.postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user=>{
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };
              });
              const order = new Order({
                user: {
                  name: req.user.name,
                  userId: req.user
                },
                products: products
              });
              return order.save();
        })
        .then((result) => {
            return req.user.clearCart();
        }).then(()=>{
            res.redirect('/orders');
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getOrders = (req, res, next) => {
    Order.find({'user.userId':req.user._id})
        .then((orders) => {
            res.render('shop/orders', {
                path: "/orders",
                pageTitle: 'Orders',
                orders: orders
            });
        })
        .catch((error) => {
            console.log(error);
        });

};