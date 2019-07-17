const mongodb = require('mongodb');
const Product = require('../models/product');
const ObjectID = mongodb.ObjectId();
exports.getAddProducts = (req, res, next) => {
  res.render(
    'admin/edit-product',
    {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false
    });
};

exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  console.log("Create PROD:::::::",req.user)
  const product = new Product(title,price,description,imageUrl,null,req.user._id);
  product.save()
  .then((result)=>{
    console.log("Created the product");
    res.redirect('/admin/products');
  })
  .catch((error)=>{
    console.log("Error Insert:",error);
  });
  
};
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product)=>{ 
      if (!product) {
            return res.redirect('/');
          }
          res.render(
            'admin/edit-product',
            {
              pageTitle: 'Edit Product',
              path: '/admin/edit-product',
              editing: editMode,
              product: product
            });
    })
    .catch((error)=>{
        console.log(error);
    });
  
};
exports.posteditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const product = new Product(
                          updatedTitle,
                          updatedPrice,
                          updatedDescription,
                          updatedImageUrl,
                          prodId);
  
  product.save()
         .then(()=>{
            console.log('updated product');
            res.redirect('/admin/products');
         })
         .catch((error)=>{
            console.log(error);
         });
};
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then((products) => {
    res.render('admin/products',
    {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch((error)=>{
    console.log(error);
  });
};

exports.postDeleteProduct = (req,res,next)=>{
  const prodId = req.body.productId;
  Product.deleteById(prodId).then(()=>{
    console.log('Product deleted');
    res.redirect('/admin/products');
  })
  .catch((error)=>{
      console.log(error);
  });
}