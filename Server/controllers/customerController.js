const Customer = require('../models/customerModel');

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const {
      companyName,
      firstName,
      lastName,
      email,
      mobile,
      website,
      industrySegment,
      country,
      state,
      city,
      receivables,
      receivablesNotes,
      businessProspect,
      orderTarget,
      msmeNo,
      panNo,
      GSTIN
    } = req.body;

    const customer = new Customer({
      companyName,
      firstName,
      lastName,
      email,
      mobile,
      website,
      industrySegment,
      country,
      state,
      city,
      receivables,
      receivablesNotes,
      businessProspect,
      orderTarget,
      msmeNo,
      panNo,
      GSTIN
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  try {
    const {
      companyName,
      firstName,
      lastName,
      email,
      mobile,
      website,
      industrySegment,
      country,
      state,
      city,
      receivables,
      receivablesNotes,
      businessProspect,
      orderTarget,
      msmeNo,
      panNo,
      GSTIN
    } = req.body;
    const id = req.params.id;
    const updatedData = {
      companyName,
      firstName,
      lastName,
      email,
      mobile,
      website,
      industrySegment,
      country,
      state,
      city,
      receivables,
      receivablesNotes,
      businessProspect,
      orderTarget,
      msmeNo,
      panNo,
      GSTIN
    };

    const customer = await Customer.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
