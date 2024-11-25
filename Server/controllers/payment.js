const Payment = require('../models/payment');
const User = require('../models/user');
const Customer = require('../models/customerModel');
const { uploadFile } = require('../utils/cloudinary');
const { extractJWTDetails, extractJWTFromRequest } = require('../middlewares/token');
const cloudinary = require('cloudinary').v2
const fs=require('fs');
const path = require('path');
const ejs = require('ejs');
const { default: puppeteer } = require('puppeteer');

async function generateReceiptNumber() {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const prefix = `${currentYear}/${nextYear.toString().substr(-2)}-OS`;

    const lastPayment = await Payment.findOne().sort({ receiptNumber: -1 });
    
    let nextNumber = 1001;
    if (lastPayment && lastPayment.receiptNumber) {
        const lastNumber = parseInt(lastPayment.receiptNumber.split('-OS')[1]);
        nextNumber = lastNumber + 1;
    }
    
    return `${prefix}${nextNumber}`;
}

exports.createPayment = async (req, res) => {
    try {
        const { customer, address, mobileNumber, alternateNumber, receiptDate, dueDate,
            products, amountReceived, amountReceivedInFavourOf, totalDueAmount, amountPaid, balanceDue, description,
            executive, paymentMode, chequeDetails, onlinePaymentDetails } = req.body;
        
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = extractJWTDetails(token);
    
        if (!decodedToken || !decodedToken._id) {
            return res.status(401).json({ error: 'Invalid or missing token' });
        }

        const existingCustomer = await Customer.findById(customer);
        if (!existingCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        let uploadFileUrl = null;
        if (req.file) {
            const localPath = req.file.path;

            if (!localPath) {
                return res.status(400).json({ message: 'uploadFile is required' });
            }

            const response = await uploadFile(localPath);

            if (!response) {
                return res.status(400).json({ message: 'uploadFile failed' });
            }

            uploadFileUrl = response?.url;
        }

        const receiptNumber = await generateReceiptNumber();

        let parsedOnlinePaymentDetails = null;
        if (onlinePaymentDetails && onlinePaymentDetails !== '') {
            parsedOnlinePaymentDetails = JSON.parse(onlinePaymentDetails);
        }

        const newPayment = new Payment({
            customer, address, mobileNumber, alternateNumber, receiptDate, receiptNumber, dueDate,
            products, amountReceived, amountReceivedInFavourOf, totalDueAmount, amountPaid, balanceDue, description,
            executive, paymentMode, chequeDetails, onlinePaymentDetails: parsedOnlinePaymentDetails, authorizedSignatory: uploadFileUrl,
            updatedId: decodedToken._id,
        });

        await newPayment.save();

        res.status(200).json({
            status: 'success',
            message: 'Payment created successfully',
            payment: newPayment,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
        .populate('customer', 'firstName lastName')
        .populate('executive','userName');
        if (!payment) return res.status(404).json({
            message: 'Payment not found',
            status: 'fail'
        });
        res.status(200).json({
            status: 'success',
            message: 'Payment fetched successfully',
            data: payment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) ;
        const pageSize = parseInt(req.query.pageSize) ;
        const skip = (page - 1) * pageSize;

        const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

        let query = {};

        if (startDate && endDate) {
            const adjustedEndDate = new Date(endDate);
            adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
            adjustedEndDate.setMilliseconds(adjustedEndDate.getMilliseconds() - 1);

            query.createdAt = { 
                $gte: startDate, 
                $lte: adjustedEndDate 
            };
        }

        const totalPayments = await Payment.countDocuments(query);

        const payments = await Payment.find(query)
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(pageSize)
            .populate('customer', 'firstName lastName')
            .populate('executive', 'userName')
            .lean();

        const hasPreviousPage = page > 1;
        const hasNextPage = skip + pageSize < totalPayments;

        res.status(200).json({
            status: 'success',
            message: 'Payments fetched successfully',
            data: payments,
            currentPage: page,
            pageSize: pageSize,
            hasPreviousPage,
            hasNextPage,
            totalPayments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePayment = async (req, res) => {
    try {
        const { customer, address, mobileNumber, alternateNumber, receiptDate, receiptNumber, dueDate,
            products, amountReceived, amountReceivedInFavourOf, totalDueAmount, amountPaid, balanceDue, description,
            executive, paymentMode, chequeDetails, onlinePaymentDetails } = req.body;
        
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = extractJWTDetails(token);
    
        if (!decodedToken || !decodedToken._id) {
            return res.status(401).json({ error: 'Invalid or missing token' });
        }

        const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, {
            customer, address, mobileNumber, alternateNumber, receiptDate, receiptNumber, dueDate,
            products, amountReceived, amountReceivedInFavourOf, totalDueAmount, amountPaid, balanceDue, description,
            executive, paymentMode, chequeDetails,
            onlinePaymentDetails: onlinePaymentDetails && onlinePaymentDetails !== '' ? JSON.parse(onlinePaymentDetails) : undefined,
            updatedId: decodedToken._id,
        }, { new: true });

        if (!updatedPayment) {
            return res.status(404).json({ status: 'fail', message: 'Payment not found' });
        }
        
        const localPath = req.file?.path;
        if (localPath) {
            if (updatedPayment.authorizedSignatory) {
                const oldFilePublicId = updatedPayment.authorizedSignatory.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(oldFilePublicId, (error) => {
                    if (error) console.error('Error deleting old file:', error);
                });
            }

            const response = await uploadFile(localPath);
            const responseUrl = response?.url;

            if (!responseUrl) {
                return res.status(400).json({ message: 'uploadFile failed' });
            }
            updatedPayment.authorizedSignatory = responseUrl;

            fs.unlinkSync(localPath);
        }

        await updatedPayment.save();

        res.status(200).json({
            status: 'success',
            message: 'Payment updated successfully',
            payment: updatedPayment,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deletePayment = async (req, res) => {
    try {
        const id = req.params.id;
        const payment = await Payment.findByIdAndDelete(id);
        if (!payment) return res.status(404).json({
            message: 'Payment not found',
            status: 'fail'
        });

        res.status(200).json({
            status: 'success',
            message: 'Payment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.downloadPaymentReceipt = async (req, res) => {
    try {
      const id = req.params.id;
      
      const payment = await Payment.findById(id)
            .populate('customer')
            .populate('updatedId');
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
        
      const ejsFilePath = path.join(__dirname, '../views/downloadPaymentReceipt.ejs');
  
      const htmlContent = await ejs.renderFile(ejsFilePath, { payment });
  
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
      });
  
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
      const pdfBuffer = await page.pdf({
        width: '350mm',
        height: '200mm',
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        preferCSSPageSize: true,
        // format: 'A4',
        // landscape: true, 
        printBackground: true,
      });
  
      await browser.close();
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=paymentReceipt-${id}.pdf`);
      res.setHeader('Content-Length', pdfBuffer.length); 
      
      res.setHeader('X-Status-Message', 'PDF generated successfully');
      res.setHeader('X-Status-Code', '200');
  
      return res.end(pdfBuffer); 
  
    } catch (error) {
      console.error('Error downloading paymentReceipt:', error);
      return res.status(500).json({ error: 'An error occurred while generating the PDF.' });
    }
};

exports.viewReceipt = async (req, res) => {
    try {
        const id = req.params.id;

        const payment = await Payment.findById(id)
            .populate('customer')
            .populate('updatedId');
        
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        const ejsFilePath = path.join(__dirname, '../views/downloadPaymentReceipt.ejs');
        const htmlContent = await ejs.renderFile(ejsFilePath, { payment });

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            width: '350mm',
            height: '200mm',
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            printBackground: true,
            preferCSSPageSize: true,
        });
        
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="paymentReceipt-${id}.pdf"`);

        return res.end(pdfBuffer);

    } catch (error) {
        console.error('Error viewing receipt:', error);
        return res.status(500).json({ error: 'An error occurred while viewing the receipt.' });
    }
};


exports.viewOrDownloadReceipt = async (req, res) => {
    try {
        const id = req.params.id;

        const payment = await Payment.findById(id)
            .populate('customer')
            .populate('updatedId');

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // const ejsFilePath = path.join(__dirname, '../views/downloadPaymentReceipt.ejs');
        // const htmlContent = await ejs.renderFile(ejsFilePath, { payment });
        
        // const browser = await puppeteer.launch({
        //     headless: true,
        //     args: ['--no-sandbox', '--disable-setuid-sandbox']
        // });
        
        // const page = await browser.newPage();
        // await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // const pdfBuffer = await page.pdf({
        //     width: '350mm',
        //     height: '200mm',
        //     margin: { top: 0, right: 0, bottom: 0, left: 0 },
        //     preferCSSPageSize: true,
        //     printBackground: true,
        // });

        // await browser.close();

        const baseUrl = process.env.backendurl;
        const viewUrl = `${baseUrl}/api/payment/viewReceipt/${id}`;
        const downloadUrl = `${baseUrl}/api/payment/download/paymentReceipt/${id}`;

        res.status(200).json({
            status: 'success',
            message: 'Receipt options fetched successfully',
            viewUrl: viewUrl,
            downloadUrl: downloadUrl
        });

    } catch (error) {
        console.error('Error generating receipt:', error);
        return res.status(500).json({ error: 'An error occurred while generating the receipt.' });
    }
};
