const express = require('express');
const router = express.Router();
const stageController = require('../controllers/prospectStage');
// const validateRequest = require('../middlewares/validationMiddleware');
// const { prospectSchema, updateProspectSchema, updateProspectCategorySchema } = require('../validations/prospect');

router.post('/create-stage',stageController.createstage);
router.get('/all-stage',stageController.getallstage);
router.get('/stage/:id',stageController.getstageById);
router.delete('/deleted/:id',stageController.deletestage);
router.put('/update/:id', stageController.updateStage);

module.exports = router;