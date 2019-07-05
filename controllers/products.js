const products=[];
exports.getAddProducts = (req,res,next)=>{
    res.render('add-product',{pageTitle:'Add Product',path:'/admin/add-product'});
 };

 exports.postAddProducts = (req,res,next)=>{
    products.push({title:req.body.title});
    res.redirect('/')
};

exports.getProducts = (req,res,next)=>{
    res.render('shop',{prods:products,pageTitle:'Shop',path:'/'});
};