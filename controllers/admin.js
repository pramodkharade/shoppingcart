const Product = require('../models/product');
exports.getAddProducts = (req,res,next)=>{
    res.render('admin/add-product',{pageTitle:'Add Product',path:'/admin/add-product'});
 };

 exports.postAddProducts = (req,res,next)=>{
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/')
};

exports.getProducts = (req,res,next) =>{
    Product.fetchAll((products)=>{
        res.render('admin/products',
                    { prods:products,
                      pageTitle:'AdminProducts',
                      path:'/admin/products'
                    });
    });
};