const Product = require('../models/product');
const cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list',
            {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
    });
};
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    console.log(Product.findById(prodId, (product) => {
        res.render('shop/product-details', { product: product, pageTitle: product.title, path: '/products' })
    }));

}

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index',
            {
                prods: products,
                pageTitle: 'Home',
                path: '/'
            });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}
exports.getCart = (req, res, next) => {
    cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
            res.render('shop/cart',
                {
                    path: '/cart',
                    pageTitle: 'Your Cart',
                    products:cartProducts
                });
        });

    });
};

exports.postCartDeleteProduct= ((req,res,next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId,(product)=>{
        cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
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