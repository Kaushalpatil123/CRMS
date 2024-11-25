const express = require('express');
const router = express.Router();
const statusController = require('../controllers/status');
// const validateRequest = require('../middlewares/validationMiddleware');
// const { prospectSchema, updateProspectSchema, updateProspectCategorySchema } = require('../validations/prospect');

router.post('/create-status',statusController.createstatus);
router.get('/all-status',statusController.getallstatus);
router.get('/status/:id',statusController.getstatusById);
router.delete('/deleted/:id',statusController.deletestatus);
router.put('/update/:id', statusController.updateStatus);

module.exports = router;