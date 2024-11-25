const Stage = require('../models/prospectStage');

exports.createstage = async (req, res) => {
    try {
      const stage = new Stage(req.body);
      await stage.save();
      res.status(201).json({
        status: 'success',
        message: 'Stage created successfully',
        data: stage
      });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: 'Stage already exists' });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  };

  exports.getallstage = async (req, res) => {
    try {
      const { role } = req.query;
      let query = {};
      if (role) {
        query.role = role;
      }
      const stage = await Stage.find(query);
      res.status(200).json(stage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.getstageById = async (req, res) => {
    try {
      const stage = await Stage.findOne({ _id: req.params.id });
      if (!stage) {
        return res.status(404).json({ error: 'Stage not found' });
      }
      res.status(200).json(stage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.deletestage = async (req, res) => {
    try {
      const id = req.params.id;
      const status = await Stage.findByIdAndDelete(id);
      if (!status) {
        return res.status(404).json({ error: 'Stage not found' });
      }
      res.status(200).json({ message: 'Stage deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.updateStage = async (req, res) => {
    try {
      const { id } = req.params;
      const updateStage = await Stage.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!updateStage) {
        return res.status(404).json({ error: 'Stage not found' });
      }
  
      res.status(200).json({
        status: 'success',
        message: 'Stage updated successfully',
        data: updateStage
      });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: 'Stage already exists' });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  };