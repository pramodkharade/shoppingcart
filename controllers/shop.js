const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const Product = require('../models/product');
const Order = require('../models/order');
const stripe = require('stripe')('your secret key');
//const cart = require('../models/cart');
const ITEM_PER_PAGE = 2;
exports.getProducts = (req, res, next) => {

    const page = +req.query.page || 1;
    let totalItems;
    Product.find().countDocuments()
        .then(numberProducts => {
            totalItems = numberProducts;
            return Product.find()
                .skip((page - 1) * ITEM_PER_PAGE)
                .limit(ITEM_PER_PAGE);
        })
        .then((products) => {
            res.render('shop/product-list',
                {
                    prods: products,
                    pageTitle: 'All Products',
                    path: '/products',
                    isAuthenticated: req.session.isLoggedIn,
                    currentPage: page,
                    hasNextPage: ITEM_PER_PAGE * page < totalItems,
                    hasPreviousPage: page > 1,
                    nextPage: page + 1,
                    previousPage: page -1 ,
                    lastPage: Math.ceil(totalItems/ITEM_PER_PAGE)
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
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));

}

exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    Product.find().countDocuments()
        .then(numberProducts => {
            totalItems = numberProducts;
            return Product.find()
                .skip((page - 1) * ITEM_PER_PAGE)
                .limit(ITEM_PER_PAGE);
        }).then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                currentPage: page,
                hasNextPage: ITEM_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page -1 ,
                lastPage: Math.ceil(totalItems/ITEM_PER_PAGE)
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId; console.log('User Session', req.user);
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        });
};
exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            const products = user.cart.items;
            res.render('shop/cart',
                {
                    path: '/cart',
                    pageTitle: 'Your Cart',
                    products: products,
                    isAuthenticated: req.session.isLoggedIn
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
exports.getCheckout = (req,res,next)=>{
    
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            let total=0;
            const products = user.cart.items;
            products.forEach(p=>{
                total += p.quantity * p.productId.price;
            });
            res.render('shop/checkout',
                {
                    path: '/checkout',
                    pageTitle: 'Checkout',
                    products: products,
                    isAuthenticated: req.session.isLoggedIn,
                    totalSum: total
                });

        })
        .catch((error) => {
            console.log('Error is:', error);
        });
};
exports.postOrder = (req, res, next) => {
    const token = req.body.stripeToken; // Using Express
  let totalSum = 0;
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            user.cart.items.forEach(p => {
                totalSum += p.quantity * p.productId.price;
              });
        
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
            const charge = stripe.charges.create({
                amount: totalSum * 100,
                currency: 'usd',
                description: 'Demo Order',
                source: token,
                metadata: { order_id: result._id.toString() }
              });
            return req.user.clearCart();
        }).then(() => {
            res.redirect('/orders');
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then((orders) => {
            res.render('shop/orders', {
                path: "/orders",
                pageTitle: 'Orders',
                orders: orders,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch((error) => {
            console.log(error);
        });

};
exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId).then((order) => {
        if (!order) {
            return next(Error('No order found'));
        }
        if (order.user.userId.toString() !== req.user._id.toString()) {
            return next(Error('Unauthorized user'));
        }
        const invoiceName = 'invoice' + orderId + '.pdf';
        const invoicePath = path.join('data', 'invoices', invoiceName);
        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            'inline; filename="' + invoiceName + '"'
        );
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.fontSize(26).text("Invoice", {
            underline: true,
            align: 'center'
        });
        pdfDoc.text('----------------------------------', {
            align: 'center'
        });
        let totalPrice = 0;
        order.products.forEach(prod => {
            totalPrice += prod.quantity * prod.product.price;
            pdfDoc.fontSize(14).text(
                prod.product.title +
                " - "
                + prod.quantity
                + ' X '
                + ' $ ' +
                prod.product.price
            );
        });
        pdfDoc.text('===============================');
        pdfDoc.fontSize(18).text('Total Price: $ ' + totalPrice);
        pdfDoc.end();
        // fs.readFile(invoicePath, (error, data) => {
        //     if (error) {
        //         return next(error);
        //     }
        //     res.setHeader('Content-Type', 'application/pdf');
        //     res.setHeader(
        //         'Content-Disposition',
        //         'inline; filename="' + invoiceName + '"'
        //     );
        //     res.send(data);
        // });
        // const file  = fs.createReadStream(invoicePath);

        //     file.pipe(res); 

    })
        .catch(error => {
            return next(error);
        });

};
