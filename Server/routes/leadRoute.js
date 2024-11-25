const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const validateRequest = require('../middlewares/validationMiddleware');
const { leadSchema, updateLeadSchema } = require('../validations/lead');
const { validateToken, Admin, Indiamart } = require('../middlewares/token.js');
const upload = require("../middlewares/multer.js")
// console.log('Imported leadSchema:', leadSchema);
// Create a new lead
router.post('/', validateToken, validateRequest(leadSchema), leadController.createLead);

// Get all leads
router.get('/', validateToken, leadController.getLeads);

router.get("/indiamart-leads", validateToken, Indiamart, leadController.getIndiaMARTLeads);

router.get('/export', leadController.exportLeads);

// Get a single lead by ID
router.get('/:id', leadController.getLeadById);

// Update a lead by ID
router.put('/:id', validateToken, validateRequest(updateLeadSchema), leadController.updateLead);

router.put('/lastInteraction/:id', validateToken, leadController.updateLastInteraction);

router.put('/active/:id', leadController.active);

// Delete a lead by ID
router.delete('/:id', leadController.deleteLead);

router.post('/import', upload.single('file'), leadController.importLeads);

router.get('/dashboard/lead-count', leadController.getLeadCountLastYear);

router.post('/lead-to-prospect/:id', leadController.convertLeadToProspect);

router.post('/indiamart-leads', leadController.IndiaMartLeads);

router.post('/clone/:id', leadController.cloneLead);

router.post("/assign-executive", validateToken, Indiamart, leadController.assignExecutiveToIndiaMARTLead);

router.put('/lead-wishlist/:id', leadController.wishlistLead);

router.put("/undo-deleted-lead/:id", leadController.undodeletelead);

router.get("/dashboard/modul-counts", leadController.getDashboardCounts);

module.exports = router;
