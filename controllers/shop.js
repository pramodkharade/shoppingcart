const Product = require('../models/product');


exports.getProducts = (req,res,next)=>{
    Product.fetchAll((products)=>{
        res.render('shop/product-list',
                    { prods:products,
                      pageTitle:'All Products',
                      path:'/products'
                    });
    });
};
exports.getProduct = (req,res,next)=>{
    const prodId = req.params.productId;
    console.log(Product.findById(prodId,(product)=>{
        res.render('shop/product-details',{product:product,pageTitle:product.title,path:'/products'})
    }));
    
}

exports.getIndex = (req,res,next)=>{
    Product.fetchAll((products)=>{
        res.render('shop/index',
        { prods:products,
          pageTitle:'Home',
          path:'/'
        });
    });
};

exports.getCart = (req,res,next)=>{
    res.render('shop/cart',
    {
        path:'/cart',
        pageTitle:'Your Cart'
    });
};

exports.getCheckout = (req,res,next)=>{
    res.render('shop/checkout',{
        path:"/checkout",
        pageTitle:'Checkout'
    });
};
exports.getOrders = (req,res,next)=>{
    res.render('shop/orders',{
        path:"/orders",
        pageTitle:'Orders'
    });
};