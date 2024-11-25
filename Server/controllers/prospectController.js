const Prospect = require('../models/Prospect');
const xlsx = require('xlsx');
const fs = require('fs').promises;
const { prospectSchema, importProspectSchema, updateProspectSchema } = require('../validations/prospect');
const Customer = require('../models/customerModel');
const { customerSchema } = require('../validations/customer');
const Status = require('../models/status');
const Stage = require('../models/prospectStage')
const moment = require('moment');

exports.createProspects = async (req, res) => {
  try {
    const { error, value } = prospectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (value.status) {
      const statusExists = await Status.findOne({ status: value.status, role: "Prospect" });
      if (!statusExists) {
        return res.status(400).json({ error: 'Invalid status' });
      }
    }

    if (value.prospectStage) {
      const stageExists = await Stage.findOne({ status: value.prospectStage });
      if (!stageExists) {
        return res.status(400).json({ error: 'Invalid Prospect stage' });
      }
    }
    const prospect = new Prospect(value);
    await prospect.save();
    res.status(201).json({
      status: 'success',
      message: 'Prospect created successfully',
      data: prospect
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllProspects = async (req, res) => {
  try {
    const { prospectStage, status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    let filter = {};
    if (prospectStage) {
      filter.prospectStage = prospectStage;
    }
    if (status) {
      filter.status = status;
    }

    const totalProspects = await Prospect.countDocuments(filter);

    const prospects = await Prospect.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const prospectsWithColors = await Promise.all(prospects.map(async (prospect) => {
      let updatedProspect = { ...prospect };

      if (prospect.status) {
        const statusInfo = await Status.findOne({ status: prospect.status, role: "Prospect" }).lean();
        updatedProspect.statusColor = statusInfo ? statusInfo.color : null;
      }

      if (prospect.prospectStage) {
        const stageInfo = await Stage.findOne({ status: prospect.prospectStage }).lean();
        updatedProspect.prospectStageColor = stageInfo ? stageInfo.color : null;
      }

      return updatedProspect;
    }));

    const hasPreviousPage = page > 1;
    const hasNextPage = skip + pageSize < totalProspects;

    res.status(200).json({
      status: 'success',
      message: 'Prospects fetched successfully',
      data: prospectsWithColors,
      currentPage: page,
      pageSize: pageSize,
      hasPreviousPage,
      hasNextPage,
      totalProspects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProspectByID = async (req, res) => {
  try {
    const prospect = await Prospect.findById(req.params.id).lean();
    if (!prospect) {
      return res.status(404).json({
        status: 'fail',
        message: 'Prospect not found'
      });
    }

    let updatedProspect = { ...prospect };

    if (prospect.status) {
      const statusInfo = await Status.findOne({ status: prospect.status, role: "Prospect" }).lean();
      updatedProspect.statusColor = statusInfo ? statusInfo.color : null;
    }

    if (prospect.prospectStage) {
      const stageInfo = await Stage.findOne({ status: prospect.prospectStage }).lean();
      updatedProspect.prospectStageColor = stageInfo ? stageInfo.color : null;
    }

    res.status(200).json({
      status: 'success',
      message: 'Prospect fetched successfully',
      data: updatedProspect
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProspect = async (req, res) => {
  try {
    const { error, value } = updateProspectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { lastInteractions, ...updateData } = value;
    
    let prospect = await Prospect.findById(req.params.id);
    if (!prospect) {
      return res.status(404).json({
        status: 'fail',
        message: 'Prospect not found'
      });
    }

    if (updateData.status) {
      const statusExists = await Status.findOne({ status: updateData.status, role: "Prospect" });
      if (!statusExists) {
        return res.status(400).json({ error: 'Invalid status' });
      }
    }

    if (updateData.prospectStage) {
      const stageExists = await Stage.findOne({ status: updateData.prospectStage });
      if (!stageExists) {
        return res.status(400).json({ error: 'Invalid Prospect stage' });
      }
    }

    if (lastInteractions) {
      prospect.lastInteractions.push(...lastInteractions);
    }

    Object.assign(prospect, updateData);

    await prospect.save();

    res.status(200).json({
      status: 'success',
      message: 'Prospect updated successfully',
      data: prospect
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProspect = async (req, res) => {
  try {
    const prospect = await Prospect.findByIdAndDelete(req.params.id);
    if (!prospect) return res.status(404).json({ message: 'Prospect not found' });
    res.status(200).json({ message: 'Prospect deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProspectStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { prospectStage } = req.body;

    const prospect = await Prospect.findByIdAndUpdate(id, { prospectStage }, { new: true });

    if (!prospect) {
      return res.status(404).json({ message: 'Prospect not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Prospect stage updated successfully',
      data: prospect,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.importProspects = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;

    try {
      const workbook = xlsx.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(worksheet);

      const validatedData = [];
      const errors = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const prospect = {
            company: row.Company,
            title: row.Title,
            firstName: row['First Name'],
            lastName: row['Last Name'],
            mobile: row.Mobile,
            email: row.Email,
            // ... other fields
            lastInteractions: row['Last Talk on'] ? [{
              executiveName: row.Executive,
              date: moment(row['Last Talk on']).isValid() ? moment(row['Last Talk on']).format('DD-MM-YYYY') : null,
              description: row['Last Talk Notes']
            }] : [],
            nextInteraction: row['Next Talk on'] ? {
              executiveName: row.Executive,
              date: moment(row['Next Talk on']).isValid() ? moment(row['Next Talk on']).format('DD-MM-YYYY') : null,
              description: row['Next Talk Notes']
            } : null
          };

          const { error } = importProspectSchema.validate(prospect);
          if (error) {
            throw new Error(error.details[0].message);
          }

          validatedData.push(prospect);
        } catch (error) {
          errors.push(`Row ${i + 2}: ${error.message}`);
        }
      }

      const savedProspects = [];
      const saveErrors = [];

      for (const prospect of validatedData) {
        try {
          const newProspect = new Prospect(prospect);
          await newProspect.save();
          savedProspects.push(newProspect);
        } catch (error) {
          saveErrors.push(`${prospect.email}: ${error.message}`);
        }
      }

      res.status(200).json({
        message: 'Import process completed',
        totalRows: data.length,
        savedRows: savedProspects.length,
        failedRows: errors.length + saveErrors.length,
        validationErrors: errors,
        saveErrors: saveErrors
      });

    } finally {
      try {
        await fs.unlink(filePath);
        console.log(`Successfully deleted file: ${filePath}`);
      } catch (unlinkError) {
        console.error(`Error deleting file ${filePath}:`, unlinkError);
      }
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exportProspects = async (req, res) => {
  try {
    const prospects = await Prospect.find();

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(prospects.map(prospect => ({
      Company: prospect.company,
      Title: prospect.title,
      'First Name': prospect.firstName,
      'Last Name': prospect.lastName,
      Mobile: prospect.mobile,
      Email: prospect.email,
      Stage: prospect.prospectStage,
      Executive: prospect.executive,
      Website: prospect.website,
      'Industry Segment': prospect.industrySegment,
      Country: prospect.country,
      State: prospect.state,
      Product: prospect.product,
      'Bussiness Target': prospect.businessProspectAnnual,
      Requirement: prospect.requirement,
      Notes: prospect.receivablesnotes,
      'Last Talk on': prospect.lastInteractions.length > 0 ? moment(prospect.lastInteractions[0].date).format('DD/MM/YYYY') : '',
      'Last Talk Notes': prospect.lastInteractions.length > 0 ? prospect.lastInteractions[0].description : '',
      'Next Talk on': prospect.nextInteraction ? moment(prospect.nextInteraction.date).format('DD/MM/YYYY') : '',
      'Next Talk Notes': prospect.nextInteraction ? prospect.nextInteraction.description : ''
    })));

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Prospects');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=prospects.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.convertProspectToCustomer = async (req, res) => {
  try {
    const { prospectId } = req.params;

    const prospect = await Prospect.findById(prospectId);
    if (!prospect) {
      return res.status(404).json({ message: 'Prospect not found' });
    }

    const customerData = {
      companyName: prospect.company,
      firstName: prospect.firstName,
      lastName: prospect.lastName,
      email: prospect.email,
      mobile: prospect.mobile,
      website: prospect.website,
      industrySegment: prospect.industrySegment,
      country: prospect.country,
      state: prospect.state,
      receivables: prospect.receivables,
      receivablesNotes: prospect.receivablesnotes,
      businessProspect: prospect.businessProspectAnnual,
      orderTarget: prospect.orderTarget,
      msmeNo: prospect.msmenumber,
      panNo: prospect.pannumber
    };

    const { error, value } = customerSchema.validate(customerData);
    if (error) {
      return res.status(400).json({ message: 'Invalid customer data', errors: error.details });
    }

    const newCustomer = new Customer(value);
    await newCustomer.save();

    await Prospect.findByIdAndDelete(prospectId);

    res.status(200).json({ 
      message: 'Prospect successfully converted to customer',
      customer: newCustomer
    });

  } catch (error) {
    console.error('Error converting prospect to customer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};