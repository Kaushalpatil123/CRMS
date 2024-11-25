const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchase.js");
const validateRequest = require('../middlewares/validationMiddleware');
const upload = require("../middlewares/multer.js")
const {purchaseValidationSchema}= require('../validations/purchase.js');
const {validateToken}= require('../middlewares/token');

router.post("/create-purchase", 
    validateToken,
    upload.single('uploadFile'), 
    validateRequest(purchaseValidationSchema), 
    purchaseController.createpurchase

);
router.get("/getAllpurchase",purchaseController.getAllpurchase);


module.exports = router;
