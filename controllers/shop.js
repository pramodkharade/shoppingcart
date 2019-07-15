const Product = require('../models/product');
const cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    
    Product.findAll()
        .then((products)=>{
            res.render('shop/product-list',
            {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
         })
        .catch((error)=>{
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
    Product.findById(prodId, (product) => {
        cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}
exports.getCart = (req, res, next) => {
    req.user.getCart()
            .then((cart)=>{
                return cart.getProducts()
                           .then((cartProducts)=>{
                            res.render('shop/cart',
                                        {
                                            path: '/cart',
                                            pageTitle: 'Your Cart',
                                            products:cartProducts
                                        });
                           })
                           .catch();
            })
            .catch((error)=>{
                console.log('Error is:',error);
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