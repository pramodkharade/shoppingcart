const express = require('express');
const path = require('path');
const {body} = require('express-validator');
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
router.post('/add-product',
            [
                body('title').isString().isLength({ min: 3 }).trim().withMessage('Please provide title '),
                body('price').isFloat().withMessage('Please provide price '),
                body('description').isLength({ min: 5 ,max:400 }).trim().withMessage('Please provide description ')
                
            ],
            isAuth, 
            adminControllers.postAddProducts
            );

router.get('/edit-product/:productId',isAuth, adminControllers.getEditProduct);
router.post('/edit-product',
            [
                body('title').isString().isLength({ min: 3 }).trim().withMessage('Please provide title '),
                body('price').isFloat().withMessage('Please provide price '),
                body('description').isLength({ min: 5 ,max:400 }).trim().withMessage('Please provide description ')
                
            ],
             isAuth, 
             adminControllers.posteditProduct
             );
router.post('/delete-product',isAuth,adminControllers.postDeleteProduct);
exports.router = router;
