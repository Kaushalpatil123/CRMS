const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');

const {validateToken}= require('../middlewares/token');

const validateRequest = require('../middlewares/validationMiddleware');
const { orderValidationSchema, updateOrderValidationSchema } = require('../validations/order');


// CRUD operations
router.post('/create-order',validateToken,validateRequest(orderValidationSchema),orderController.createOrder);
router.get('/get-orders',orderController.getAllOrders);
router.get('/get-order/:id',orderController.getOrderById);
router.put('/update-order/:id',validateToken,validateRequest(updateOrderValidationSchema),orderController.updateOrder);
router.delete('/delete-order/:id',orderController.deleteOrder);
router.post('/clone-order/:id',orderController.cloneOrder);
router.get('/exportorders',orderController.exportOrders)
router.put('/order-wishlist/:id',orderController.wishlistOrder);
router.post('/convert-lead/:id',orderController.markAsLead);
router.put('/undelete-order/:id',orderController.undeleteOrder);

module.exports = router;