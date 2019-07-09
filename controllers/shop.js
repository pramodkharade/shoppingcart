const Product = require('../models/product');
const cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([rows,fieldsData])=>{
            res.render('shop/product-list',
            {
                prods: rows,
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
    Product.findById(prodId)
           .then(([product])=>{
               console.log("Product of:",product[0]);
            res.render('shop/product-details',
            {  product: product[0],
               pageTitle: product.title,
               path: '/products' 
           })
           })
           .catch(()=>{});

}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, fieldsData]) => {
            console.log("Rows:",rows);
            res.render('shop/index',
                {
                    prods: rows,
                    pageTitle: 'Home',
                    path: '/'
                });
        })
        .catch((error) => {
            console.log(error);
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