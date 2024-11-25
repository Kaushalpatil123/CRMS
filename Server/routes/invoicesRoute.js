const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

const validateRequest = require('../middlewares/validationMiddleware');
const { invoiceSchema , updateInvoiceSchema} = require('../validations/invoice');

const { validateToken } = require("../middlewares/token");

// CRUD operations
router.post('/',validateRequest(invoiceSchema), validateToken,invoiceController.createInvoice);
router.get('/', invoiceController.getInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.put('/:id',validateRequest(updateInvoiceSchema), invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);
router.get('/invoices/customer/:customerId', invoiceController.getInvoicesByCustomer);
router.get('/export/invoice', invoiceController.exportInvoices );
router.post('/cloneinvoice/:id',invoiceController.cloneInvoice);
router.put('/invoice-wishlist/:id',invoiceController.wishlistInvoice);
router.get('/getCustomerAddresses/:id',invoiceController.getCustomerAddresses);
router.get('/getAddressById/:id',invoiceController.getAddressById);
router.put("/undo-deleted-invoice/:id", invoiceController.undodeleteinvoice);
router.get('/download/:id',invoiceController.downloadInvoicePDF);

module.exports = router;