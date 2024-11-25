const express = require('express');
const router = express.Router();
const prospectController = require('../controllers/prospectController.js');
const validateRequest = require('../middlewares/validationMiddleware');
const { prospectSchema, updateProspectSchema, updateProspectCategorySchema } = require('../validations/prospect');
const upload = require("../middlewares/multer.js");

router.post('/create-prospect', validateRequest(prospectSchema), prospectController.createProspects);
router.get('/getAllProspects', prospectController.getAllProspects);
router.get('/get-prospect/:id', prospectController.getProspectByID);
router.put('/update-prospect/:id', validateRequest(updateProspectSchema), prospectController.updateProspect);
router.delete('/delete-prospect/:id', prospectController.deleteProspect);
router.put('/update/:id/stage', validateRequest(updateProspectCategorySchema), prospectController.updateProspectStage);
router.post('/import', upload.single('file'), prospectController.importProspects);
router.get('/export', prospectController.exportProspects);
router.post('/convert-to-customer/:prospectId', prospectController.convertProspectToCustomer);

module.exports = router;