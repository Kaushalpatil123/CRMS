const express = require('express');
const router = express.Router();
const bankDetailController = require('../controllers/bankdetail'); 

// Create a new bank detail
router.post('/', bankDetailController.createBankDetail);

// Get all bank details
router.get('/', bankDetailController.getAllBankDetails);

// Get a single bank detail by ID
router.get('/:id', bankDetailController.getBankDetailById);

// Update a bank detail
router.put('/:id', bankDetailController.updateBankDetail);

// Delete a bank detail
router.delete('/:id', bankDetailController.deleteBankDetail);

module.exports = router;