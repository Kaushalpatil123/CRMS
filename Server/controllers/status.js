const Status = require('../models/status');

exports.createstatus = async (req, res) => {
    try {
      const status = new Status(req.body);
      await status.save();
      res.status(201).json({
        status: 'success',
        message: 'status created successfully',
        data: status
      });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: 'Status already exists for this role' });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  };

  exports.getallstatus = async (req, res) => {
    try {
      const { role } = req.query;
      let query = {};
      if (role) {
        query.role = role;
      }
      const status = await Status.find(query);
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.getstatusById = async (req, res) => {
    try {
      const status = await Status.findOne({ _id: req.params.id });
      if (!status) {
        return res.status(404).json({ error: 'status not found' });
      }
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.deletestatus = async (req, res) => {
    try {
      const id = req.params.id;
      const status = await Status.findByIdAndDelete(id);
      if (!status) {
        return res.status(404).json({ error: 'status not found' });
      }
      res.status(200).json({ message: 'status deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.updateStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedStatus = await Status.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!updatedStatus) {
        return res.status(404).json({ error: 'Status not found' });
      }
  
      res.status(200).json({
        status: 'success',
        message: 'Status updated successfully',
        data: updatedStatus
      });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: 'Status already exists for this role' });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  };