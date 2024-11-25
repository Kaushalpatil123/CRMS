const purchase = require('../models/purchase');
const User = require('../models/user');
const Customer = require('../models/customerModel');
const { uploadFile } = require('../utils/cloudinary');
const { extractJWTDetails, extractJWTFromRequest } = require('../middlewares/token');
const xlsx = require('xlsx');
const {quotationValidationSchema,updateQuotationValidationSchema}= require('../validations/quotation.js');
const fs=require('fs');
const cloudinary = require('cloudinary').v2

exports.createpurchase = async (req, res) => {
    try {
        const {
            customer, contactPerson, salesCredit, address, shippingAddress,
            reference, quotationDate, dueDate, termsAndConditions,
            notes, bankDetails, totalAmountBeforeTax, total, grandTotal, addExtraCharges, addDiscount, ItemList
        } = req.body;

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = extractJWTDetails(token);
    
        if (!decodedToken || !decodedToken._id) {
            return res.status(401).json({ error: 'Invalid or missing token' });
        }
    
        const user = await User.findById(decodedToken._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const customerDetails = await Customer.findById(customer);
        if (!customerDetails) {
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

        // const quotationCount = await Quotation.countDocuments({
        //     user: decodedToken._id
        // });
        // const quotationNo = `QOUT-${quotationCount + 1}`;

        const newpurchase = new purchase({
            customer, contactPerson, salesCredit, address, shippingAddress,
            reference, quotationDate, dueDate, ItemList: JSON.parse(ItemList), termsAndConditions,
            notes, bankDetails, totalAmountBeforeTax, total, grandTotal,
            addExtraCharges, addDiscount, user: user, 
            uploadFile: uploadFileUrl, updatedId: decodedToken._id
        });


        await newpurchase.save();

        // const responseObj = {
        //     ...newQuotation._doc,
        //     updatedId: {
        //         _id: newQuotation.updatedId,
        //         userName: user.userName
        //     }
        // };
        
        res.status(200).json({
            status: 'success',
            message: 'purchase created successfully',
            quotation: newpurchase,
        });

    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: error.message });
    }
};

exports.getAllpurchase = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        // Get timestamps from query parameters
        const startTimestamp = req.query.startTimestamp ? new Date(req.query.startTimestamp) : null;
        const endTimestamp = req.query.endTimestamp ? new Date(req.query.endTimestamp) : null;

        // Build query object
        const query = { isDeleted: false };
        if (startTimestamp && endTimestamp) {
            query.createdAt = { $gte: startTimestamp, $lte: endTimestamp };
        } else if (startTimestamp) {
            query.createdAt = { $gte: startTimestamp };
        } else if (endTimestamp) {
            query.createdAt = { $lte: endTimestamp };
        }

        // Get the total count of quotations based on the query
        const totalpurchase = await purchase.countDocuments(query);

        // Fetch quotations based on the query
        const purchases = await purchase.find(query)
            .populate('customer', 'firstName lastName')
            .skip(skip)
            .limit(pageSize)
            .populate('updatedId', 'userName')
            .sort({ createdAt: -1 });

        const hasPreviousPage = page > 1;
        const hasNextPage = skip + pageSize < totalpurchase;

        res.status(200).json({
            message: 'purchase fetched successfully',
            status: 'success',
            data: {
                purchases,
                currentPage: page,
                pageSize: pageSize,
                hasPreviousPage,
                hasNextPage,
                totalpurchase
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}