const express = require('express');
const router = express.Router();
const {validateToken}= require('../middlewares/token');
const validateRequest = require('../middlewares/validationMiddleware');
const paymentController = require('../controllers/payment');
const {paymentValidationSchema,updatePaymentValidationSchema} = require('../validations/payment');
const upload = require("../middlewares/multer.js")


router.post('/create-payment',validateToken,upload.single('authorizedSignatory'),validateRequest(paymentValidationSchema),paymentController.createPayment);
router.get('/getAllpayments',paymentController.getAllPayments);
router.get('/get-payment/:id',paymentController.getPaymentById);
router.put('/update-payment/:id',validateToken,upload.single('authorizedSignatory'),validateRequest(updatePaymentValidationSchema),paymentController.updatePayment);
router.delete('/delete-payment/:id',paymentController.deletePayment);
router.get('/download/paymentReceipt/:id',paymentController.downloadPaymentReceipt);
router.get('/viewReceipt/:id', paymentController.viewReceipt);
router.get('/viewOrDownloadReceipt/:id', paymentController.viewOrDownloadReceipt);

module.exports = router;
