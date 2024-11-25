const Bankdetail = require('../models/bankdetail'); 

exports.createBankDetail = async (req, res) => {
    try {
        const newBankDetail = new Bankdetail(req.body);
        const savedBankDetail = await newBankDetail.save();
        res.status(201).json(savedBankDetail);
    } catch (error) {
        res.status(400).json({ message: "Error creating bank detail", error: error.message });
    }
};

exports.getAllBankDetails = async (req, res) => {
    try {
        const bankDetails = await Bankdetail.find();
        res.status(200).json(bankDetails);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bank details", error: error.message });
    }
};

exports.getBankDetailById = async (req, res) => {
    try {
        const bankDetail = await Bankdetail.findById(req.params.id);
        if (!bankDetail) {
            return res.status(404).json({ message: "Bank detail not found" });
        }
        res.status(200).json(bankDetail);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bank detail", error: error.message });
    }
};

exports.updateBankDetail = async (req, res) => {
    try {
        const updatedBankDetail = await Bankdetail.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedBankDetail) {
            return res.status(404).json({ message: "Bank detail not found" });
        }
        res.status(200).json(updatedBankDetail);
    } catch (error) {
        res.status(400).json({ message: "Error updating bank detail", error: error.message });
    }
};

exports.deleteBankDetail = async (req, res) => {
    try {
        const deletedBankDetail = await Bankdetail.findByIdAndDelete(req.params.id);
        if (!deletedBankDetail) {
            return res.status(404).json({ message: "Bank detail not found" });
        }
        res.status(200).json({ message: "Bank detail deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting bank detail", error: error.message });
    }
};