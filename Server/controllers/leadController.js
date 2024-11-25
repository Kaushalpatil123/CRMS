const Lead = require('../models/leadModel');
const Prospect = require('../models/Prospect');
const User = require('../models/user');
const Status = require('../models/status');
const Product = require('../models/product');
const Customer = require('../models/customerModel');
const Invoice = require('../models/invoiceModel');
const Quotation = require('../models/Quotation');
const Order = require('../models/Order');
const { extractJWTDetails } = require('../middlewares/token');
const xlsx = require('xlsx');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cron = require('node-cron');
const { leadSchema, updateLeadSchema, lastInteractionSchema,importLeadsSchema } = require('../validations/lead');
const moment = require('moment');
const { time } = require('console');
// Create a new lead
exports.createLead = async (req, res) => {
  try {
    const { error, value } = leadSchema.validate(req.body, { stripUnknown: true });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const token = req.headers.authorization.split(' ')[1]; 
    const decodedToken = extractJWTDetails(token);
    
    if (!decodedToken || !decodedToken._id) {
      return res.status(401).json({ error: 'Invalid or missing token' });
    }

    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (value.status) {
      const statusExists = await Status.findOne({ status: value.status, role : "Lead" });
      if (!statusExists) {
        return res.status(400).json({ error: 'Invalid status' });
      }
    }

    // value.executive = user.userName;
    value.updatedId = user._id;

    const lead = new Lead(value);
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get all leads
// exports.getLeads = async (req, res) => {
//   try {
//     const leads = await Lead.find({ isDeleted: false });
//     res.status(200).json(leads);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const status = req.query.status;
    const executive = req.query.executive;
    const isactive = req.query.isactive;
    const isWishlist = req.query.isWishlist;
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1; 

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = extractJWTDetails(token);
    
    if (!decodedToken || !decodedToken.Role) {
      return res.status(401).json({ error: 'Invalid or missing token' });
    }

    const userRole = decodedToken.Role;

    let query = {};

    if (userRole !== 'Admin') {
      query.isDeleted = false;
    }

    if (userRole === 'Indiamart') {
      query.executive = 'IndiaMART';
      query.source = 'IndiaMART';
    } else {
      query.$or = [
        { executive: { $ne: 'IndiaMART' } },
        { executive: 'IndiaMART', source: { $ne: 'IndiaMART' } }
      ];
    }

    if (startDate && endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
      adjustedEndDate.setMilliseconds(adjustedEndDate.getMilliseconds() - 1);

      query.createdAt = { 
        $gte: startDate, 
        $lte: adjustedEndDate 
      };
    }

    if (status) {
      query.status = status;
    }

    if (executive && userRole !== 'Indiamart') {
      query.executive = executive;
    }

    if (isactive !== undefined) {
      query.isactive = isactive === 'true';
    }

    if(isWishlist !== undefined){
      query.wishlist = isWishlist === 'true';
    }

    const totalLeads = await Lead.countDocuments(query);

    const leadIds = await Lead.find(query)
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(pageSize)
      .select('_id');

    const leads = await Lead.find({ _id: { $in: leadIds.map(lead => lead._id) } })
      .sort({ createdAt: sortOrder }) 
      .populate('updatedId', 'userName')
      .lean();

    const leadsWithStatus = await Promise.all(leads.map(async (lead) => {
      if (lead.status) {
        const statusInfo = await Status.findOne({ status: lead.status, role: "Lead" }).lean();
        return { ...lead, statusColor: statusInfo ? statusInfo.color : null };
      }
      return lead;
    }));

    const hasPreviousPage = page > 1;
    const hasNextPage = skip + pageSize < totalLeads;

    res.status(200).json({
      leads: leadsWithStatus,
      currentPage: page,
      pageSize: pageSize,
      hasPreviousPage,
      hasNextPage,
      totalLeads,
      sortOrder: sortOrder === 1 ? 'asc' : 'desc'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getIndiaMARTLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const status = req.query.status;
    const isactive = req.query.isactive;
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1; 

    let query = { 
      isDeleted: false,
      executive: 'IndiaMART',
      source: 'IndiaMART'
    };

    if (startDate && endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
      adjustedEndDate.setMilliseconds(adjustedEndDate.getMilliseconds() - 1);

      query.createdAt = { 
        $gte: startDate, 
        $lte: adjustedEndDate 
      };
    }

    if (status) {
      query.status = status;
    }

    if (isactive !== undefined) {
      query.isactive = isactive === 'true';
    }

    const totalLeads = await Lead.countDocuments(query);

    const leadIds = await Lead.find(query)
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(pageSize)
      .select('_id');

    const leads = await Lead.find({ _id: { $in: leadIds.map(lead => lead._id) } })
      .sort({ createdAt: sortOrder }) 
      .populate('updatedId', 'userName')
      .lean();

    const leadsWithStatus = await Promise.all(leads.map(async (lead) => {
      if (lead.status) {
        const statusInfo = await Status.findOne({ status: lead.status, role: "Lead" }).lean();
        return { ...lead, statusColor: statusInfo ? statusInfo.color : null };
      }
      return lead;
    }));

    const hasPreviousPage = page > 1;
    const hasNextPage = skip + pageSize < totalLeads;

    res.status(200).json({
      leads: leadsWithStatus,
      currentPage: page,
      pageSize: pageSize,
      hasPreviousPage,
      hasNextPage,
      totalLeads,
      sortOrder: sortOrder === 1 ? 'asc' : 'desc'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id }).lean();
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    if (lead.status) {
      const statusInfo = await Status.findOne({ status: lead.status, role: "Lead" }).lean();
      lead.statusColor = statusInfo ? statusInfo.color : null;
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a lead
exports.updateLead = async (req, res) => {
  try {
    const id = req.params.id;
    const { error, value } = updateLeadSchema.validate(req.body, { stripUnknown: true });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const lead = await Lead.findOne({ _id: id, isDeleted: false });
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Extract username from token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = extractJWTDetails(token);
    
    if (!decodedToken || !decodedToken._id) {
      return res.status(401).json({ error: 'Invalid or missing token' });
    }

    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const username = user.userName;

    if (value.status) {
      const statusExists = await Status.findOne({ status: value.status, role: "Lead" });
      if (!statusExists) {
        return res.status(400).json({ error: 'Invalid status' });
      }
    }

    if (value.lastInteractions) {
      value.lastInteractions = value.lastInteractions.map(interaction => ({
        ...interaction,
        executiveName: interaction.executiveName || username
      }));
      lead.lastInteractions.push(...value.lastInteractions);
      delete value.lastInteractions;
    }

    if (value.nextInteraction) {
      value.nextInteraction.executiveName = value.nextInteraction.executiveName || username;
    }

    if (value.deleteContact) {
      lead.contacts = lead.contacts.filter(contact => contact._id.toString() !== value.deleteContact);
      delete value.deleteContact;
    }

    if (value.addContact) {
      lead.contacts.push(value.addContact);
      delete value.addContact;
    }

    if (value.updateContact) {
      const contactIndex = lead.contacts.findIndex(contact => contact._id.toString() === value.updateContact.id);
      if (contactIndex !== -1) {
        lead.contacts[contactIndex] = { ...lead.contacts[contactIndex], ...value.updateContact.contact };
      }
      delete value.updateContact;
    }

    for (const [key, val] of Object.entries(value)) {
      if (val !== undefined) {
        lead[key] = val;
      }
    }

    await lead.save();

    res.status(200).json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateLastInteraction = async (req, res) => {
  try {
    const id = req.params.id;
    const { error, value } = lastInteractionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const lead = await Lead.findOne({ _id: id, isDeleted: false });
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = extractJWTDetails(token);
    
    if (!decodedToken || !decodedToken._id) {
      return res.status(401).json({ error: 'Invalid or missing token' });
    }

    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const username = user.userName;

    const newInteraction = {
      ...value,
      executiveName: value.executiveName || username
    };

    lead.lastInteractions.push(newInteraction);

    await lead.save();

    res.status(200).json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a lead
exports.deleteLead = async (req, res) => {
  try {
    const id = req.params.id;
    const lead = await Lead.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.active = async (req, res) => {
  try {
    const { reason } = req.body;
    const id = req.params.id;

    const currentLead = await Lead.findOne({ _id: id, isDeleted: false });

    if (!currentLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const newActiveStatus = !currentLead.isactive;

    const updatedData = {
      isactive: newActiveStatus,
    };

    if (reason) {
      updatedData.reason = reason;
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

    res.status(200).json({
      message: `Lead ${newActiveStatus ? 'activated' : 'deactivated'} successfully`,
      lead: updatedLead
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.importLeads = async (req, res) => {
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
      const newProducts = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          let firstName = '', lastName = '';
          if (row.Contact) {
            const nameParts = row.Contact.split(' ');
            firstName = nameParts[0] || '';
            lastName = nameParts.slice(1).join(' ') || '';
          }

          const parseDateTime = (field) => {
            if (field) {
              const match = field.match(/(\d{2}-\w{3}-\d{2}) (\d{2}:\d{2} [AP]M)[-\s]+(.+)/);
              if (match) {
                const [, dateStr, timeStr, description] = match;
                return {
                  date: moment(dateStr, 'DD-MMM-YY').format('DD-MM-YYYY'),
                  time: timeStr,
                  description: description.trim()
                };
              }
            }
            return null;
          };

          const lastTalk = parseDateTime(row['Last Talk']);
          
          const nextAction = parseDateTime(row['Next Action']);

          let product = await Product.findOne({ itemname: row.Product });
          if (!product && row.Product) {
            product = new Product({
              itemname: row.Product,
            });
            await product.save();
            newProducts.push(row.Product);
          }

          const lead = {
            companyName: row.Company,
            contacts: [{
              firstName,
              lastName,
              email: row.Email || '',
              phoneNumber: row.Mobile
            }],
            designation: row.Designation || '',
            city: row.City || '',
            state: row.State || '',
            country: row.Country || '',
            source: row.Source || '',
            product: row.Product || '',
            requirements: row.Needs || '',
            notes: row.Notes || '',
            executive: row.POC || '',
            lastInteractions: lastTalk ? [{
              executiveName: row.POC || '',
              date: lastTalk.date,
              time: lastTalk.time,
              description: lastTalk.description
            }] : undefined,
            nextInteraction: nextAction ? {
              executiveName: row.POC || '',
              date: nextAction.date,
              time: nextAction.time,
              description: nextAction.description
            } : undefined
          };

          const validatedLead = await importLeadsSchema.validateAsync(lead);
          validatedData.push(validatedLead);
        } catch (error) {
          errors.push(`Row ${i + 2}: ${error.message}`);
        }
      }

      const savedLeads = [];
      const saveErrors = [];

      for (let i = 0; i < validatedData.length; i++) {
        try {
          const newLead = new Lead(validatedData[i]);
          await newLead.save();
          savedLeads.push(i + 2);
        } catch (error) {
          saveErrors.push(`Row ${i + 2}: ${error.message}`);
        }
      }

      res.status(200).json({
        message: 'Import process completed',
        totalRows: data.length,
        savedRows: savedLeads.length,
        failedRows: errors.length + saveErrors.length,
        validationErrors: errors,
        saveErrors: saveErrors
        // newProductsCreated: newProducts
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
exports.exportLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    const workbook = xlsx.utils.book_new()
    const worksheet = xlsx.utils.json_to_sheet(leads.map(lead => ({
      Company: lead.companyName,
      "First Name": lead.contacts[0]?.firstName || '',
      "Last Name": lead.contacts[0]?.lastName || '',
      Email: lead.contacts[0]?.email || '',
      Mobile: lead.contacts[0]?.phoneNumber || '',
      Country: lead.country,
      State: lead.state,
      City: lead.city,
      "In-charge": lead.executive,
      Source: lead.source,
      Designation: lead.designation,
      Product: lead.product,
      Requirements: lead.requirements,
      Notes: lead.notes,
      "Lead Since": lead.lastInteractions[0]?.date || '',
      "Last Interaction Executive": lead.lastInteractions[0]?.executiveName || '',
      "Last Interaction Date": lead.lastInteractions[0]?.date || '',
      "Last Interaction Description": lead.lastInteractions[0]?.description || '',
      "Next Talk on": lead.nextInteraction?.date || '',
      "Next Interaction Executive": lead.nextInteraction?.executiveName || '',
      "Next Interaction Description": lead.nextInteraction?.description || ''
    })));
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Leads');
    const filename = 'leads.xlsx';
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLeadCountLastYear = async (req, res) => {
  try {
    const period = parseInt(req.query.period) || 12; 
    
    if (period <= 0 || period > 12) {
      return res.status(400).json({ error: "Period must be between 1 and 12 months" });
    }

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - period + 1);
    startDate.setDate(1); 
    startDate.setHours(0, 0, 0, 0); 

    const leadCounts = await Lead.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    const allMonths = [];
    for (let i = 0; i < period; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      allMonths.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1
      });
    }

    const countMap = new Map(leadCounts.map(item => [
      `${item._id.year}-${item._id.month}`,
      item.count
    ]));

    const formattedResult = allMonths.map(item => {
      const date = new Date(item.year, item.month - 1);
      const key = `${item.year}-${item.month}`;
      return {
        month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        count: countMap.get(key) || 0
      };
    });

    formattedResult.sort((a, b) => new Date(b.month) - new Date(a.month));

    res.status(200).json(formattedResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.convertLeadToProspect = async (req, res) => {
  try {
    const leadId = req.params.id;

    const lead = await Lead.findOne({ _id: leadId, isDeleted: false });
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // lead.isDeleted = true;
    // await lead.save();

    const newProspect = new Prospect({
      company: lead.companyName,
      title: lead.contacts[0].title || 'Mr.', 
      firstName: lead.contacts[0].firstName,
      lastName: lead.contacts[0].lastName,
      mobile: lead.contacts[0].phoneNumber,
      email: lead.contacts[0].email,
      country: lead.country,
      state: lead.state,
      city: lead.city,
      category: 'Prospect',
      product: lead.product,
      executive: lead.executive,
      requirement: lead.requirements, 
      lastInteractions: lead.lastInteractions, 
      nextInteraction: lead.nextInteraction,
      prospectStage: 'New'
      // prospectCategory: 'New'
    });

    await newProspect.save();
    lead.isDeleted = true;
    await lead.save();

    res.status(200).json({
      message: 'Lead successfully converted to Prospect',
      prospect: newProspect
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const IndiaMartLead = async () => {
//   try {
//     const indiaMartApiKey = 'mRyxFrtv43bET/ej4nWC7liPolPAnzFgWA==';
//     const indiaMartApiUrl = 'https://mapi.indiamart.com/wservce/crm/crmListing/v2/';
    
//     const response = await axios.post(indiaMartApiUrl, {
//       glusr_crm_key: indiaMartApiKey,
//       start_time: new Date(Date.now() - 10 * 60 * 1000).toISOString(), 
//       end_time: new Date().toISOString(),
//     });
//     console.log(response)

//     if (response.data.STATUS !== 'SUCCESS') {
//       throw new Error('Failed to fetch data from IndiaMART');
//     }

//     const savedLeads = await Promise.all(response.data.RESPONSE.map(async (lead) => {
//       console.log(lead)

//       const cleanHtmlContent = (htmlString) => {
//         if (!htmlString) return '';
//         return htmlString
//           .replace(/<[^>]*>/g, ', ')  
//           .replace(/,\s*,/g, ',')   
//           .replace(/^\s*,\s*|\s*,\s*$/g, '')  
//           .trim();
//       };

//       let cleanNumber = phoneNumber.replace(/[^0-9]/g, '');  

//       if (cleanNumber.startsWith('91') && cleanNumber.length > 10) {
//         cleanNumber = cleanNumber.substring(2);
//       }

//       const transformedLead = {
//         companyName: lead.SENDER_COMPANY,
//         contacts: [{
//           firstName: lead.SENDER_NAME.split(' ')[0],
//           lastName: lead.SENDER_NAME.split(' ').slice(1).join(' '),
//           email: lead.SENDER_EMAIL,
//           phoneNumber: cleanNumber
//         }],
//         country: "India",
//         state: lead.SENDER_STATE,
//         city: lead.SENDER_CITY,
//         executive: 'IndiaMART', 
//         source: 'IndiaMART',
//         requirements: cleanHtmlContent(lead.QUERY_MESSAGE),
//         product: lead.QUERY_PRODUCT_NAME,
//       };

//       const newLead = new Lead(transformedLead);
//       return await newLead.save();
//     }));

//     const validLeads = savedLeads.filter(lead => lead !== null);
//     console.log(`Leads fetched and saved successfully. Count: ${validLeads.length}`);
//   } catch (error) {
//     console.error('Error fetching and saving IndiaMART leads:', error);
//   }
// };

// cron.schedule('*/10 * * * *', IndiaMartLead);

exports.IndiaMartLeads = async (req, res) => {
  try {
    await IndiaMartLead();
    res.status(200).json({ message: 'Leads fetched and saved successfully' });
  } catch (error) {
    console.error('Error fetching and saving IndiaMART leads:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.cloneLead = async (req, res) => {
  try {
    const { id } = req.params;

    const originalLead = await Lead.findById(id);
    if (!originalLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const clonedLeadData = originalLead.toObject();

    delete clonedLeadData._id;

    clonedLeadData.isactive = true;
    clonedLeadData.isDeleted = false;
    clonedLeadData.reason = '';

    const clonedLead = new Lead(clonedLeadData);
    await clonedLead.save();

    res.status(201).json(clonedLead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.assignExecutiveToIndiaMARTLead = async (req, res) => {
  try {
    const { leadIds, executiveName } = req.body;  
    if (!Array.isArray(leadIds)) {
      return res.status(400).json({ error: 'leadIds must be an array' });
    }

    const updateResults = await Promise.all(
      leadIds.map(async (leadId) => {
        const lead = await Lead.findOne({ 
          _id: leadId, 
          executive: 'IndiaMART', 
          source: 'IndiaMART' 
        });

        if (!lead) {
          return {
            leadId,
            success: false,
            message: 'Lead not found or already assigned'
          };
        }

        lead.executive = executiveName;
        const updatedLead = await lead.save();
        return {
          leadId,
          success: true,
          lead: updatedLead
        };
      })
    );

    const successfulUpdates = updateResults.filter(result => result.success);
    const failedUpdates = updateResults.filter(result => !result.success);

    res.status(200).json({
      message: 'Executive assignment process completed',
      successfulAssignments: successfulUpdates.length,
      failedAssignments: failedUpdates.length,
      details: {
        successful: successfulUpdates,
        failed: failedUpdates
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.wishlistLead = async (req,res) => {
  try {
    const id = req.params.id;
    const lead = await Lead.findById(id);
    if(!lead){
      return res.status(404).json({ error: 'Lead not found' });
    }
    const isWishlist = lead.wishlist;
    const leadUpdated = await Lead.findByIdAndUpdate(id, { wishlist: !isWishlist }, { new: true});
    const message = !isWishlist ? "Lead added to wishlist successfully" : "Lead removed from wishlist successfully";
    res.status(200).json({ message, lead:leadUpdated });
  } catch (error) {
    res.status(500).json({ error: error.message })    
  }
};

exports.undodeletelead = async (req, res) => {
  try {
      const id = req.params.id;
      const lead = await Lead.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
      if (!lead) return res.status(404).json({
          message: 'Lead not found',
          status: 'fail'
      });

      res.status(200).json({
          status: 'success',
          message: 'Lead retrieve successfully'
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

exports.getDashboardCounts = async (req, res) => {
  try {
      const leadCount = await Lead.countDocuments({ isDeleted: false });
      const customerCount = await Customer.countDocuments();
      const invoiceCount = await Invoice.countDocuments({ isDeleted: false });
      const quotationCount = await Quotation.countDocuments({ isDeleted: false });
      const orderCount = await Order.countDocuments({ isDeleted: false });

      return res.status(200).json({
          success: true,
          data: {
              totalLeads: leadCount,
              totalCustomers: customerCount,
              totalInvoices: invoiceCount,
              totalQuotations: quotationCount,
              totalOrders: orderCount
          }
      });
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message
      });
  }
};