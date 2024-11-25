const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const validateRequest = require('../middlewares/validationMiddleware');
const { customerSchema } = require('../validations/customer');

// Create a new customer
router.post('/', validateRequest(customerSchema),customerController.createCustomer);

// Get all customers
router.get('/', customerController.getCustomers);

// Get a single customer by ID
router.get('/:id', customerController.getCustomerById);

// Update a customer by ID
router.put('/:id', customerController.updateCustomer);

// Delete a customer by ID
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
