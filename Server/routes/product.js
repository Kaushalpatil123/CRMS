const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.js');
const validateRequest = require('../middlewares/validationMiddleware');
const { productSchema, productUpdateSchema } = require('../validations/product.js');
const { validateToken, Admin, Indiamart } = require('../middlewares/token.js');
// const upload = require("../middlewares/multer.js")

router.post('/',validateRequest(productSchema),productController.createproduct);
router.put('/:id',validateRequest(productUpdateSchema), productController.updateProduct);
router.get('/',validateToken, productController.getAllProducts);
router.get('/admin',validateToken, productController.getadminproduct);
router.get('/:id', productController.getProductById);
router.delete('/:id', productController.deleteProduct);
router.put("/undo-deleted-product/:id", productController.undodeleteproduct);
router.put('/product-wishlist/:id', productController.wishlistproduct);


module.exports = router;