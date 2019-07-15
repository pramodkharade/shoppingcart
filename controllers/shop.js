const Product = require('../models/product');
const cart = require('../models/cart');

exports.getProducts = (req, res, next) => {

    Product.findAll()
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
    Product.findByPk(prodId)
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
    Product.findAll()
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
    let fetchCart;
    let newQuantity = 1;
    req.user.getCart()
        .then((cart) => {
            fetchCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                /***get existing cart product**/
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            /****Return new product from cart**/
            return Product.findByPk(prodId);

        })
        .then(product => {
            return fetchCart.addProduct(product, {
                through: { quantity: newQuantity }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch((error) => {
            console.log(error);
        });
}
exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then((cart) => {
            return cart.getProducts()
                .then((cartProducts) => {
                    res.render('shop/cart',
                        {
                            path: '/cart',
                            pageTitle: 'Your Cart',
                            products: cartProducts
                        });
                })
                .catch();
        })
        .catch((error) => {
            console.log('Error is:', error);
        });
};

exports.postCartDeleteProduct = ((req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
            .then((cart)=>{
                return cart.getProducts({where:{id:prodId}});
            })
            .then((products)=>{
                const product = products[0];
                return product.cartItem. destroy();
            })
            .then((result)=>{
                res.redirect('/cart');
            })
            .catch((error)=>{ console.log(error);});
});
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: "/checkout",
        pageTitle: 'Checkout'
    });
};
exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: "/orders",
        pageTitle: 'Orders'
    });
};