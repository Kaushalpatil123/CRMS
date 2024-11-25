const Contactus = require('../models/contactus');

exports.createContact = async (req, res) => {
    try {
      const { name, mobile, email, Comment } = req.body;
  
      if (!name || !mobile || !email) {
        return res.status(400).json({ message: "Name, mobile, and email are required fields" });
      }
  
      const newContact = new Contactus({
        name,
        mobile,
        email,
        Comment
      });
  
      const savedContact = await newContact.save();
      res.status(201).json({
        status: "Success",
        message: "Your message has been received successfully. We will contact you as soon as possible. ",
        data: savedContact,
      });
    } catch (error) {
      console.error("Failed to create contact:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // Get all contacts
  exports.getAllContacts = async (req, res) => {
    try {
      const contacts = await Contactus.find();
      res.status(200).json({
        status: "Success",
        data: contacts,
      });
    } catch (error) {
      console.error("Failed to fetch contacts:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // Get a single contact by ID
  exports.getContactById = async (req, res) => {
    try {
      const contact = await Contactus.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json({
        status: "Success",
        data: contact,
      });
    } catch (error) {
      console.error("Failed to fetch contact:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // Update a contact
  exports.updateContact = async (req, res) => {
    try {
      const { name, mobile, email, Comment } = req.body;
      const updatedContact = await Contactus.findByIdAndUpdate(
        req.params.id,
        { name, mobile, email, Comment },
        { new: true, runValidators: true }
      );
  
      if (!updatedContact) {
        return res.status(404).json({ message: "Contact not found" });
      }
  
      res.status(200).json({
        status: "Success",
        message: "Contact updated successfully",
        data: updatedContact,
      });
    } catch (error) {
      console.error("Failed to update contact:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // Delete a contact
  exports.deleteContact = async (req, res) => {
    try {
      const deletedContact = await Contactus.findByIdAndDelete(req.params.id);
  
      if (!deletedContact) {
        return res.status(404).json({ message: "Contact not found" });
      }
  
      res.status(200).json({
        status: "Success",
        message: "Contact deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete contact:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };