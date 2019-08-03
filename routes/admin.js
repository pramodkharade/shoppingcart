const express = require('express');
const path = require('path');
const rootDir = require('../utils/path');
const adminControllers = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const router = express.Router();
const products = [];
// /admin/add-product =>GET
router.get('/add-product',isAuth, adminControllers.getAddProducts);
// /admin/products => GET
router.get('/products',isAuth, adminControllers.getProducts);
// /admin/add-product =>POST
router.post('/add-product',isAuth, adminControllers.postAddProducts);

router.get('/edit-product/:productId',isAuth, adminControllers.getEditProduct);
router.post('/edit-product', isAuth, adminControllers.posteditProduct);
router.post('/delete-product',isAuth,adminControllers.postDeleteProduct);
exports.router = router;
