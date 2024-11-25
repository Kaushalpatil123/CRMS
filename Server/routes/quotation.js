const express = require("express");
const router = express.Router();
const quotationController = require("../controllers/quotation.js");
const validateRequest = require('../middlewares/validationMiddleware');
const upload = require("../middlewares/multer.js")
const {quotationValidationSchema, updateQuotationValidationSchema}= require('../validations/quotation.js');
const {validateToken}= require('../middlewares/token');

router.post("/create-quotation", 
    validateToken,
    upload.single('uploadFile'), // multer processes the file first
    validateRequest(quotationValidationSchema), // validation runs after multer
    quotationController.createQuotation

);

router.get("/getAllquotations",quotationController.getAllQuotation);
router.get("/get-quotation/:id",quotationController.getQuotationById);
router.put("/update-quotation/:id",validateToken,upload.single('uploadFile'), validateRequest(updateQuotationValidationSchema),quotationController.updateQuotation);
router.delete("/delete-quotation/:id", quotationController.deleteQuotation);
router.get('/get-customer-quotation/:id', quotationController.findQuotationByCustomer);
router.get('/exportquotation', quotationController.exportQuotations);
router.post('/clone/:id',quotationController.cloneQuotation)
router.put('/quotation-wishlist/:id',quotationController.wishlistQuotation);
router.get('/download/:id',quotationController.downloadQuotation);
router.put("/undo-deleted-quotation/:id", quotationController.undodeleteQuotation);


module.exports = router;
