const Invoice = require('../models/invoiceModel');
const Customer = require('../models/customerModel');
const xlsx = require('xlsx');
const User = require("../models/user");
const Status = require('../models/status');
const Address = require('../models/address');
const BankDetail = require('../models/bankdetail'); 
const { extractJWTDetails } = require('../middlewares/token');
const path = require('path');
const ejs = require('ejs');
const puppeteer  = require('puppeteer')
const fs=require('fs');
require("dotenv").config();

exports.createInvoice = async (req, res) => {
  try {
    const {
      type,
      customer,
      copyFrom,
      partyDetails,
      documentDetails,
      itemList,
      status,
      paidAmount,
      balanceAmount,
      project,
      address,
      finalTotal,
      amount,
      roundoff,
      extracharges,
      discount,
      note
      // GSTIN
    } = req.body;

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = extractJWTDetails(token);

    if (!decodedToken || !decodedToken._id) {
      return res.status(401).json({ error: 'Invalid or missing token' });
    }

    const user = await User.findById(decodedToken._id).select('_id userName email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const customerDetails = await Customer.findById(customer).select('firstName lastName');
    if (!customerDetails) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const bankDetails = await BankDetail.findById(req.body.bankDetails);
    if (!bankDetails) {
      return res.status(400).json({ error: "Invalid bank detail ID" });
    }

    const invoiceCount = await Invoice.countDocuments();
    const newInvoiceNumber = `INV-${invoiceCount + 1}`;


    const documentDetailsWithInvoiceNo = {
      ...documentDetails,
      invoiceNo: newInvoiceNumber
    };

    // const finalTotal = itemList.reduce((sum, item) => sum + item.amount, 0);

    const invoiceData = {
      type,
      customer,
      customerDetails,
      user: user,
      copyFrom,
      partyDetails,
      documentDetails: documentDetailsWithInvoiceNo,
      itemList,
      paidAmount,
      balanceAmount,
      project,
      address,
      finalTotal,
      amount,
      roundoff,
      extracharges,
      discount,
      status,
      bankDetails,
      note,
      // GSTIN,
      updatedId: decodedToken._id,
    }

    // if(status){
    //   const statusExists = await Status.findOne({status: status, role: 'Invoice'});
    //   if(!statusExists){
    //     return res.status(400).json({error: 'Invalid Status'});
    //   }
    //   invoiceData.status = status;
    // }

    const invoice = new Invoice(invoiceData);

    await invoice.save();

    if(address && Object.keys(address).length > 0){
      const addressData = {
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        state: address.state,
        country: address.country,
        pincode: address.pincode,
        type: address.type,
        customer: req.body.customer
      };
      const existingAddress = await Address.findOne({ ...addressData });
      if (!existingAddress) {
        const newAddress = new Address({ ...addressData });
        await newAddress.save();
      }
    }

    const response = {
      ...invoice._doc,
      updatedId: {
        _id: invoice.updatedId,
        userName: user.userName,
        email: user.email
      }
    };
    res.status(201).json({ invoice: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



exports.getInvoices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const isWishlist = req.query.isWishlist;
    const skip = (page - 1) * pageSize;
    const executive = req.query.executive;

    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const status = req.query.status;
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

    if(status!=undefined){
      query.status = status;
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

    if(isWishlist !== undefined){
      query.wishlist = isWishlist === 'true';
    }

    let totalInvoices = await Invoice.countDocuments(query);

    const invoiceIds = await Invoice.find(query)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(pageSize)
            .select('_id'); 

    const invoices = await Invoice.find({ _id: { $in: invoiceIds.map(invoice => invoice._id) } })
            .sort({ createdAt: sortOrder })
            .populate('updatedId', 'userName')
            .populate('customer', 'firstName lastName')
            .populate('user','userName')
            .populate('bankDetails');

    let filteredInvoices = invoices;
    if (executive) {
      filteredInvoices = invoices.filter(invoice => invoice.user && invoice.user.userName === executive);
      totalInvoices = filteredInvoices.length;
    }

    const hasPreviousPage = page > 1;
    const hasNextPage = skip + pageSize < totalInvoices;

    res.status(200).json({
      invoices: filteredInvoices,
      currentPage: page,
      pageSize: pageSize,
      hasPreviousPage,
      hasNextPage,
      totalInvoices,
      status,
      sortOrder: sortOrder === 1 ? 'asc' : 'desc'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id : req.params.id})
      .populate('updatedId', 'userName email')
      .populate('customer', 'firstName lastName')
      .populate('user','userName')
      .populate('bankDetails');
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateInvoice = async (req, res) => {
  try {
    const {
      type,
      customer,
      copyFrom,
      partyDetails,
      documentDetails,
      itemList,
      status,
      finalTotal,
      amount,
      roundoff,
      extracharges,
      discount,
      paidAmount,
      balanceAmount,
      project,
      // GSTIN,
      address,
      note
    } = req.body;

    const id = req.params.id;

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = extractJWTDetails(token);

    if (!decodedToken || !decodedToken._id) {
      return res.status(401).json({ error: 'Invalid or missing token' });
    }

    const user = await User.findOne({ _id: decodedToken._id, isDeleted: false });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const bankDetail = await BankDetail.findById(req.body.bankDetails);
    if (!bankDetail) {
      return res.status(400).json({ error: "Invalid bank detail ID" });
    }

    const updatedId = decodedToken._id;

    const existingInvoice = await Invoice.findOne({_id: id, isDeleted: false});

    if(!existingInvoice){
      return res.status(404).json({ error: 'Invoice not found'})
    }

    const updatedAddress = {...existingInvoice.address, ...address};

    const updatedData = {
      type,
      customer,
      copyFrom,
      partyDetails,
      documentDetails,
      itemList,
      updatedId,
      finalTotal,
      amount,
      roundoff,
      extracharges,
      discount,
      paidAmount,
      balanceAmount,
      project,
      status,
      bankDetails: bankDetail,
      note,
      // GSTIN,
      address:updatedAddress
    };

    // Updating the invoice in the database
    const invoice = await Invoice.findOneAndUpdate({_id:id, isDeleted: false}, updatedData, { new: true, runValidators: true }).populate('updatedId', 'userName');

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Sending the updated invoice, updatedId, and updated userName in the response
    res.status(200).json({
      invoice,
      updatedBy: {
        updatedId: invoice.updatedId._id,
        userName: invoice.updatedId.userName
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, {isDeleted: true}, {new: true});
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInvoicesByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Find invoices by customer reference
    const invoices = await Invoice.find({ customer: customerId, isDeleted:false });

    if (!invoices.length) {
      return res.status(404).json({ message: 'No invoices found for this customer' });
    }

    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exportInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ isDeleted: false })
      .populate('user', 'userName') // Populate user with userName
      .populate('customer', 'firstName lastName') // Populate customer with firstName and lastName
      .populate('user','userName');

    const workbook = xlsx.utils.book_new();

    const worksheet = xlsx.utils.json_to_sheet(invoices.map(invoice => ({
      "Invoice No": invoice.documentDetails.invoiceNo,
      "Type": invoice.type,
      "Customer": invoice.customerDetails ? `${invoice.customerDetails.firstName} ${invoice.customerDetails.lastName}` : '',
      "User": invoice.user ? invoice.user.userName : '',
      "Contact Person": invoice.partyDetails.contactPerson,
      "Billing Address": invoice.partyDetails.billingAddress,
      "Sales Credit": invoice.partyDetails.salesCredit,
      "Shipping Address": invoice.partyDetails.shippingAddress,
      "Shipping Details": invoice.partyDetails.shippingDetails,
      "Invoice Date": invoice.documentDetails.invoiceDate ? new Date(invoice.documentDetails.invoiceDate).toLocaleDateString() : '',
      "Due Date": invoice.documentDetails.dueDate ? new Date(invoice.documentDetails.dueDate).toLocaleDateString() : '',
      "Item List": invoice.itemList.map(item => `
        Item: ${item.itemDescription}, 
        Quantity: ${item.qty}, 
        Unit: ${item.unit}, 
        Rate: ${item.rate}, 
        Discount: ${item.discount}, 
        Taxable: ${item.taxable}, 
        CGST: ${item.CGST}, 
        SGST: ${item.SGST}, 
        Amount: ${item.amount}`
      ).join('\n'), // Join items in the list into a single string with new lines separating each
      "paidAmount": invoice.paidAmount,
      "balanceAmount": invoice.balanceAmount,
      "project": invoice.project,
      "address": invoice.address ? [
        invoice.address.address1 ? `Address1: ${invoice.address.address1}` : '',
        invoice.address.address2 ? `Address2: ${invoice.address.address2}` : '',
        invoice.address.city ? `City: ${invoice.address.city}` : '',
        invoice.address.state ? `State: ${invoice.address.state}` : '',
        invoice.address.country ? `Country: ${invoice.address.country}` : '',
        invoice.address.pincode ? `Pincode: ${invoice.address.pincode}` : ''
      ].filter(Boolean).join(', ') : '',
      "Final Total": invoice.finalTotal,
    })));

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Invoices');

    const filename = 'invoices.xlsx';
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);


    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    res.send(buffer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.cloneInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id == ", id);

    const originalInvoice = await Invoice.findOne({_id: id, isDeleted:false});
    if (!originalInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    console.log("original invoice", originalInvoice);

    const clonedInvoiceData = originalInvoice.toObject();
    delete clonedInvoiceData._id;


    const invoiceCount = await Invoice.countDocuments({ isDeleted: false });
    clonedInvoiceData.documentDetails.invoiceNo = `INV-${invoiceCount + 1}`;


    clonedInvoiceData.isDeleted = false;
    clonedInvoiceData.reason = '';

    const clonedInvoice = new Invoice(clonedInvoiceData);
    await clonedInvoice.save();

    res.status(201).json({ message: 'Invoice cloned successfully', data: clonedInvoice });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.wishlistInvoice = async (req,res) => {
  try {
    const id = req.params.id;
    const invoice = await Invoice.findOne({_id: id, isDeleted: false})
    .populate('user', 'userName') 
    .populate('customer', 'firstName lastName')
    .populate('user','userName');
    if(!invoice){
      return res.status(404).json({ error:'Invoice not found' });
    }
    const isWishlist = invoice.wishlist;
    const invoiceUpdated = await Invoice.findByIdAndUpdate(id, { wishlist:!isWishlist }, { new: true });
    const message = !isWishlist ? 'Invoice added to wishlist successfully' : 'Invoice removed from wishlist successfully';
    return res.status(200).json({ message , invoice: invoiceUpdated });
  } catch (error) {
    res.send(500).json({ error: error.message });    
  }
}

exports.getCustomerAddresses = async(req,res) => {
  try {
    const customerId = req.params.id;
    const addresses = await Address.find({customer: customerId}).populate('customer','firstName lastName');
    if(addresses.length === 0){
      return res.status(404).json({ error: 'Addresses not found'});
    }
    return res.status(200).json({addresses});
  } catch (error) {
    res.send(500).json({ error: error.message });    
  }
}

exports.getAddressById = async(req,res) => {
  try {
    const id = req.params.id;
    const address = await Address.findById(id).populate('customer','firstName lastName');
    if(!address){
      return res.status(404).json({ error: 'Address not found' });
    }
    return res.status(200).json({address});
  } catch (error) {
    res.send(500).json({ error: error.message });    
  }
}
exports.undodeleteinvoice = async (req, res) => {
  try {
      const id = req.params.id;
      const invoice = await Invoice.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
      if (!invoice) return res.status(404).json({
          message: 'Invoice not found',
          status: 'fail'
      });

      res.status(200).json({
          status: 'success',
          message: 'Invoice retrieve successfully'
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

// exports.downloadInvoicePDF = async (req, res) => {

//   try {
//       const id = req.params.id;

//       const invoice = await Invoice.findOne({ _id: id, isDeleted: false })
//           .populate('customer')
//           .populate('user')
//           .populate('updatedId')
//           .populate('bankDetails');

//       if (!invoice) {
//           return res.status(404).json({ error: 'Invoice not found' });
//       }

//       const data = {
//           invoiceNumber: invoice.documentDetails.invoiceNo,
//           invoiceDate: invoice.documentDetails.invoiceDate,
//           dueDate: invoice.documentDetails.dueDate,
//           customer: invoice.customer,
//           companyName: invoice.customer.companyName,
//           billingAddress: invoice.address,
//           shippingAddress: invoice.partyDetails.shippingAddress,
//           items: invoice.itemList,
//           subTotal: invoice.amount,
//           roundoff: invoice.roundoff,
//           taxAmount: invoice.itemList.reduce((sum, item) => sum + (item.CGST + item.SGST) * item.taxable / 100, 0),
//           totalAmount: invoice.finalTotal,
//           paidAmount: invoice.paidAmount,
//           balanceAmount: invoice.balanceAmount,
//           banckdetail: invoice.bankDetails,
//           extracharges: invoice.extracharges,
//           companyDetails: {
//               name: "ONE STEP MEGA STORE",
//               address: "PRADHAN WALI GALI, KHERA KALAN, Delhi, Delhi, 110082",
//               phone: "+91-7827677274, +91-7290876316",
//               email: "sales@osmsturf.com",
//               website: "www.osmsturf.com",
//               gstin: "07AWKPV4949H1ZT",
//               pan: "AWKPV4949H",
//               msme: "UDYAM-DL-06-0057089"
//           }
//       };
// console.log(data)

//       const ejsFilePath = path.join(__dirname, '../views/invoice-template.ejs');

//       const htmlContent = await ejs.renderFile(ejsFilePath, { data });

//       const browser = await puppeteer.launch({
//           headless: true,
//           args: ['--no-sandbox', '--disable-setuid-sandbox']
//       });

//       const page = await browser.newPage();
//       await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

//       const pdfBuffer = await page.pdf({
//           format: 'A3',
//           printBackground: true,
//       });

//       await browser.close();

//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename=invoice-${id}.pdf`);
//       res.setHeader('Content-Length', pdfBuffer.length);

//       res.setHeader('X-Status-Message', 'PDF generated successfully');
//       res.setHeader('X-Status-Code', '200');

//       return res.end(pdfBuffer);

//   } catch (error) {
//       console.error('Error downloading invoice:', error);
//       return res.status(500).json({ error: 'An error occurred while generating the PDF.' });
//   }
// };

const numberToWords = require('number-to-words'); // Make sure to install this package

exports.downloadInvoicePDF = async (req, res) => {
    try {
        const id = req.params.id;

        const invoice = await Invoice.findOne({ _id: id, isDeleted: false })
            .populate('customer')
            .populate('user')
            .populate('updatedId')
            .populate('bankDetails');

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        const totalAmountInWords = convertNumberToWords(invoice.finalTotal); 

        const data = {
            invoiceNumber: invoice.documentDetails.invoiceNo,
            invoiceDate: invoice.documentDetails.invoiceDate,
            dueDate: invoice.documentDetails.dueDate,
            customer: invoice.customer,
            companyName: invoice.customer.companyName,
            billingAddress: invoice.address,
            shippingAddress: invoice.partyDetails.shippingAddress,
            items: invoice.itemList,
            subTotal: invoice.amount,
            roundoff: invoice.roundoff,
            taxAmount: invoice.itemList.reduce((sum, item) => sum + (item.CGST + item.SGST) * item.taxable / 100, 0),
            totalAmount: invoice.finalTotal,
            totalAmountInWords: totalAmountInWords, 
            paidAmount: invoice.paidAmount,
            balanceAmount: invoice.balanceAmount,
            bankdetail: invoice.bankDetails,
            extracharges: invoice.extracharges,
            GSTIN:invoice.customer.GSTIN || 'NA',
            companyDetails: {
                name: "ONE STEP MEGA STORE",
                address: "PRADHAN WALI GALI, KHERA KALAN, Delhi, Delhi, 110082",
                phone: "+91-7827677274, +91-7290876316",
                email: "sales@osmsturf.com",
                website: "www.osmsturf.com",
                gstin: "07AWKPV4949H1ZT",
                pan: "AWKPV4949H",
                msme: "UDYAM-DL-06-0057089"
            }
        };
        console.log(data);

        const ejsFilePath = path.join(__dirname, '../views/invoice-template.ejs');

        const htmlContent = await ejs.renderFile(ejsFilePath, { data });

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

        const pdfBuffer = await page.pdf({
            format: 'A3',
            printBackground: true,
            pageRanges: '1'
        });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${id}.pdf`);
        res.setHeader('Content-Length', pdfBuffer.length);

        res.setHeader('X-Status-Message', 'PDF generated successfully');
        res.setHeader('X-Status-Code', '200');

        return res.end(pdfBuffer);

    } catch (error) {
        console.error('Error downloading invoice:', error);
        return res.status(500).json({ error: 'An error occurred while generating the PDF.' });
    }
};

// Function to convert number to words
function convertNumberToWords(number) {
    return numberToWords.toWords(number);
}
