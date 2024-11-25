const express = require("express");
const router = express.Router();
const contactusController = require("../controllers/contactus");

router.post("/", contactusController.createContact);

router.get("/", contactusController.getAllContacts);

router.get("/:id", contactusController.getContactById);

router.put("/:id", contactusController.updateContact);

router.delete("/:id", contactusController.deleteContact);

module.exports = router;