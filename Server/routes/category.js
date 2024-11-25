// routes/category.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');
const validateRequest = require('../middlewares/validationMiddleware');
const { categorySchema, subcategorySchema } = require('../validations/category');

router.post('/', validateRequest(categorySchema), categoryController.addCategory);
router.get('/', categoryController.getCategories);
router.put('/:categoryId', validateRequest(categorySchema), categoryController.updateCategory);
router.delete('/:categoryId', categoryController.deleteCategory);
router.post('/:categoryId/subcategory', validateRequest(subcategorySchema), categoryController.addSubcategory);
router.put('/:categoryId/subcategory/:subcategoryId', validateRequest(subcategorySchema), categoryController.updateSubcategory);
router.delete('/:categoryId/subcategory/:subcategoryId', categoryController.deleteSubcategory);
router.get('/:categoryId/subcategory', categoryController.getSubcategory);

module.exports = router;