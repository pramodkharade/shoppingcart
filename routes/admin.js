const express = require('express');
const path = require('path');
const rootDir = require('../utils/path');
const adminControllers = require('../controllers/admin');
const router = express.Router();
const products = [];
// /admin/add-product =>GET
router.get('/add-product',adminControllers.getAddProducts);
// /admin/products => GET
// router.get('/products',adminControllers.getProducts);
// /admin/add-product =>POST
router.post('/add-product',adminControllers.postAddProducts);

// router.get('/edit-product/:productId',adminControllers.getEditProduct);
// router.post('/edit-product',adminControllers.posteditProduct);
// router.post('/delete-product',adminControllers.postDeleteProduct);
exports.router = router;
