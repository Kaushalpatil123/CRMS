const Quotation = require('../models/Quotation');
const User = require('../models/user');
const Customer = require('../models/customerModel');
const Address = require('../models/address.js');
const { uploadFile } = require('../utils/cloudinary');
const { extractJWTDetails, extractJWTFromRequest } = require('../middlewares/token');
const xlsx = require('xlsx');
const {quotationValidationSchema,updateQuotationValidationSchema}= require('../validations/quotation.js');
const fs=require('fs');
const cloudinary = require('cloudinary').v2
const moment = require('moment');
const path = require('path');
const ejs = require('ejs');
const { default: puppeteer } = require('puppeteer');
const numberToWords = require('number-to-words'); 
const BankDetail = require('../models/bankdetail'); 

exports.createQuotation = async (req, res) => {
    try {
        const {
            customer, contactPerson, salesCredit, address, shippingAddress,
            reference, quotationDate, dueDate, termsAndConditions,
            notes, bankDetails, totalAmountBeforeTax, total, grandTotal, addExtraCharges, addDiscount, ItemList,status,roundoff
        } = req.body;

        console.log(JSON.parse(req.body.address))
        let parsedAddress;
        if(typeof address === 'string') {
            try {
                parsedAddress = JSON.parse(address);
            } catch (error) {
                return res.status(400).json({ message: 'Invalid address format' });                
            }
        } else {
            parsedAddress = address;
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

        const quotationCount = await Quotation.countDocuments();
        const quotationNo = `QOUT-${quotationCount + 1}`;
        const parsedAddExtraCharges = addExtraCharges ? JSON.parse(addExtraCharges) : [];
        const parsedAddDiscount = addDiscount ? JSON.parse(addDiscount) : {};

        const newQuotation = new Quotation({
            customer, contactPerson, salesCredit, address: parsedAddress, shippingAddress,
            reference, quotationDate, dueDate, ItemList: JSON.parse(ItemList), termsAndConditions,
            notes, bankDetails, totalAmountBeforeTax, total, grandTotal,status,
            addExtraCharges: parsedAddExtraCharges, addDiscount: parsedAddDiscount, user: user, 
            uploadFile: uploadFileUrl, updatedId: decodedToken._id,quotationNo: quotationNo,
            roundoff
        });


        await newQuotation.save();

        if(parsedAddress && Object.keys(parsedAddress).length > 0){
            const addressData = {
                address1: parsedAddress.address1,
                address2: parsedAddress.address2,
                city: parsedAddress.city,
                state: parsedAddress.state,
                country: parsedAddress.country,
                pincode: parsedAddress.pincode,
                type: parsedAddress.type,
                customer: customer
              };
            const existingAddress = await Address.findOne({ ...addressData });
            if (!existingAddress) {
              const newAddress = new Address({ ...addressData });
              await newAddress.save();
            }
        }

        const responseObj = {
            ...newQuotation._doc,
            updatedId: {
                _id: newQuotation.updatedId,
                userName: user.userName
            }
        };
        

        res.status(200).json({
            status: 'success',
            message: 'Quotation created successfully',
            quotation: responseObj,
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
};


// exports.getAllQuotation = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const skip = (page - 1) * pageSize;

//         // Get the total count of leads
//         const totalQotations = await Quotation.countDocuments({ isDeleted: false});

//         const quotations = await Quotation.find({ isDeleted: false})
//             .populate('customer', 'firstName lastName')
//             .skip(skip)
//             .limit(pageSize)
//             .populate('updatedId', 'userName')
//             .sort({ createdAt: -1 });
            


//         const hasPreviousPage = page > 1;
//         const hasNextPage = skip + pageSize < totalQotations;

//         res.status(200).json({
//             message: 'Quotation fetched successfully',
//             status: 'success',
//             data: {
//                 quotations,
//                 currentPage: page,
//                 pageSize: pageSize,
//                 hasPreviousPage,
//                 hasNextPage,
//                 totalQotations
//             }
//         });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

exports.getQuotationById = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id)
        .populate('customer')
        .populate('updatedId', 'userName');;
        if (!quotation) return res.status(404).json({
            message: 'Quotation not found',
            status: 'fail'
        });
        res.status(200).json({
            status: 'success',
            message: 'Quotation fetched successfully',
            data: quotation
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.getAllQuotation = async (req, res) => {
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

        // Build query object
        const query = {};

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

        let totalQuotations = await Quotation.countDocuments(query);

        const quotationIds = await Quotation.find(query)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(pageSize)
            .select('_id');
        
        const quotations = await Quotation.find({ _id: { $in: quotationIds.map(quotation => quotation._id) } })
            .sort({ createdAt: sortOrder })
            .populate('customer', 'firstName lastName')
            .populate('updatedId', 'userName')
            .populate('user','userName');

        let filteredQuotations = quotations;
        if (executive) {
            filteredQuotations = quotations.filter(quotation => quotation.user && quotation.user.userName === executive);
            totalQuotations = filteredQuotations.length;
        }

        const hasPreviousPage = page > 1;
        const hasNextPage = skip + pageSize < totalQuotations;

        res.status(200).json({
            message: 'Quotations fetched successfully',
            status: 'success',
            data: {
                quotations:filteredQuotations,
                currentPage: page,
                pageSize: pageSize,
                hasPreviousPage,
                hasNextPage,
                totalQuotations,
                sortOrder: sortOrder === 1 ? 'asc' : 'desc'
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// exports.updateQuotation = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updates = req.body;

//         // Find the existing quotation
//         const quotation = await Quotation.findOne({_id:id,isDeleted:false});
//         if (!quotation) {
//             return res.status(404).json({ message: 'Quotation not found', status: 'fail' });
//         }

//         // Update other fields in the quotation
//         Object.keys(updates).forEach((key) => {
//             quotation[key] = updates[key];
//         });

//         // Handle file upload if a new file is provided
//         const localPath = req.file?.path;
//         if (localPath) {
//             // Delete the old file from Cloudinary if it exists
//             if (quotation.uploadFile) {
//                 const oldFilePublicId = quotation.uploadFile.split('/').pop().split('.')[0];
//                 await cloudinary.uploader.destroy(oldFilePublicId, (error, result) => {
//                     if (error) console.error('Error deleting old file:', error);
//                     else console.log('Old file deleted:', result);
//                 });
//             }

//             // Upload new file to Cloudinary
//             const response = await uploadFile(localPath);
//             const responseUrl = response?.url;

//             if (!responseUrl) {
//                 return res.status(400).json({ message: 'uploadFile failed' });
//             }

//             // Update the quotation with the new file URL
//             quotation.uploadFile = responseUrl;

//             // Delete the local file after uploading to Cloudinary
//             fs.unlinkSync(localPath);
//         }

//         // Save the updated quotation
//         await quotation.save();
//         res.status(200).json({
//             status: 'success',
//             message: 'Quotation updated successfully',
//             data: quotation
//         });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };
exports.updateQuotation = async (req, res) => {
    try {
        const { id } = req.params;
      const {
        customer, contactPerson, salesCredit, address, shippingAddress,
        reference, quotationDate, dueDate, termsAndConditions,
        notes, bankDetails, totalAmountBeforeTax, total, grandTotal, addExtraCharges, addDiscount, ItemList,status,roundoff
      }=req.body;

      console.log(typeof req.body.addExtraCharges)
      const token = req.headers.authorization.split(' ')[1];
    const decodedToken = extractJWTDetails(token);

    const existingQuotation = await Quotation.findOne({_id: id, isDeleted: false});

    if(!existingQuotation){
        return res.status(404).json({ error: 'Quotation not found'});
    }

    let parsedAddress = address;

    if (typeof address === 'string') {
        try {
            parsedAddress = JSON.parse(address);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid address format. Failed to parse JSON.' });
        }
    }
    
    const updatedAddress = { ...existingQuotation.address, ...parsedAddress };

    if (!decodedToken || !decodedToken._id) {
      return res.status(401).json({ error: 'Invalid or missing token' });
    }

    const user = await User.findById(decodedToken._id);
   
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(req.user._id)
    const updatedId = decodedToken._id;
    
    // let parsedAddExtraCharges = addExtraCharges;
    // let parsedAddDiscount = addDiscount;
    // let parsedItemList = ItemList;

    // try {
    //     if (addExtraCharges && typeof addExtraCharges === 'string') {
    //         parsedAddExtraCharges = JSON.parse(addExtraCharges);
    //     }
    // } catch (error) {
    //     return res.status(400).json({ error: 'Invalid JSON format for addExtraCharges' });
    // }

    // try {
    //     if (addDiscount && typeof addDiscount === 'string') {
    //         parsedAddDiscount = JSON.parse(addDiscount);
    //     }
    // } catch (error) {
    //     return res.status(400).json({ error: 'Invalid JSON format for addDiscount' });
    // }

    // try {
    //     if (ItemList && typeof ItemList === 'string') {
    //         parsedItemList = JSON.parse(ItemList);
    //     }
    // } catch (error) {
    //     return res.status(400).json({ error: 'Invalid JSON format for ItemList' });
    // }

    // // Updated data

    // const updatedData = {
    //     customer, contactPerson, salesCredit, address: updatedAddress, shippingAddress,
    //     reference, quotationDate, dueDate, termsAndConditions,
    //     notes, bankDetails, totalAmountBeforeTax, total, grandTotal,
    //     addExtraCharges: parsedAddExtraCharges, addDiscount: parsedAddDiscount, ItemList: parsedItemList, status, roundoff, updatedId: decodedToken._id
    // };

    

    const updatedData = {
      customer, contactPerson, salesCredit, address:updatedAddress, shippingAddress,
        reference, quotationDate, dueDate, termsAndConditions,
        notes, bankDetails, totalAmountBeforeTax, total, grandTotal, addExtraCharges:JSON.parse(addExtraCharges), addDiscount:JSON.parse(addDiscount), ItemList:JSON.parse(ItemList),status,updatedId,
        roundoff
    };

    console.log(addExtraCharges)
       
        // Save the updated quotation
        const quotation = await Quotation.findByIdAndUpdate(id, updatedData,
             { new: true });

        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found', status: 'fail' });
        }
         // Handle file upload if a new file is provided
         const localPath = req.file?.path;
         if (localPath) {
             // If there is an old file, remove it from Cloudinary
             if (quotation.uploadFile) {
                 const oldFilePublicId = quotation.uploadFile.split('/').pop().split('.')[0];
                 await cloudinary.uploader.destroy(oldFilePublicId, (error) => {
                     if (error) console.error('Error deleting old file:', error);
                 });
             }
 
             // Upload the new file to Cloudinary
             const response = await uploadFile(localPath);
             const responseUrl = response?.url;
 
             if (!responseUrl) {
                 return res.status(400).json({ message: 'uploadFile failed' });
             }
 
             // Update the file URL in the quotation
             quotation.uploadFile = responseUrl;
 
             // Remove the local file after upload
             fs.unlinkSync(localPath);
         }
 
        quotation.save();
        res.status(200).json({
            status: 'success',
            message: 'Quotation updated successfully',
            data: quotation,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteQuotation = async (req, res) => {
    try {
        const id = req.params.id;
        const quotation = await Quotation.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!quotation) return res.status(404).json({
            message: 'Quotation not found',
            status: 'fail'
        });

        res.status(200).json({
            status: 'success',
            message: 'Quotation deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.findQuotationByCustomer = async (req, res) => {
    try {
        const customer = req.params.id;
        const quotations = await Quotation.find({ customer: customer, isDeleted: false })
        const totalQuotation = quotations.length;

        if (!totalQuotation) return res.status(404).json({
            message: 'Quotation not found',
            status: 'fail'
        });
        res.status(200).json({
            status: 'success',
            message: 'Quotation fetched successfully',
            data: {
                quotations,
                totalQuotation
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.exportQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find()
    .populate('customer', 'firstName lastName') // Populate customer with firstName and lastName
            .populate('user', 'userName');
  
    
    
    const workbook = xlsx.utils.book_new();
    

    const worksheet = xlsx.utils.json_to_sheet(quotations.map(quotation => ({
      "Quotation No": quotation.quotationNo,
      "Customer": quotation.customer ? `${quotation.customer.firstName} ${quotation.customer.lastName}` : '',
      "User": quotation.user ? quotation.user.userName : '',
      "Contact Person": quotation.contactPerson,
      "Sales Credit": quotation.salesCredit,
      "Address": quotation.address,
      "Shipping Address": quotation.shippingAddress,
      "Quotation Date": quotation.quotationDate ? moment(quotation.quotationDate, 'DD-MM-YYYY').format('DD/MM/YYYY') : '',
      "Due Date": quotation.dueDate ? moment(quotation.dueDate, 'DD-MM-YYYY').format('DD/MM/YYYY') : '',
      "Item List": quotation.ItemList.map(item => `
        Item: ${item.itemandDescription}, 
        HSN/SAC: ${item.hsnSac}, 
        Quantity: ${item.quantity}, 
        Unit: ${item.unit}, 
        Rate: ${item.rate}, 
        Discount: ${item.discount}, 
        Taxable: ${item.taxable}, 
        CGST: ${item.cgst}, 
        SGST: ${item.sgst}, 
        Amount: ${item.amount}`
      ).join('\n'), // Join items in the list into a single string with new lines separating each
      "Terms and Conditions": quotation.termsAndConditions,
      "Notes": quotation.notes,
      "Bank Details": quotation.bankDetails,
      "Total Amount Before Tax": quotation.totalAmountBeforeTax,
      "Total": quotation.total,
      "Grand Total": quotation.grandTotal,
      "Extra Charges": quotation.addExtraCharges,
      "Discount": quotation.addDiscount,
      "address": quotation.address ? [
        quotation.address.address1 ? `Address1: ${quotation.address.address1}` : '',
        quotation.address.address2 ? `Address2: ${quotation.address.address2}` : '',
        quotation.address.city ? `City: ${quotation.address.city}` : '',
        quotation.address.state ? `State: ${quotation.address.state}` : '',
        quotation.address.country ? `Country: ${quotation.address.country}` : '',
        quotation.address.pincode ? `Pincode: ${quotation.address.pincode}` : ''
      ].filter(Boolean).join(', ') : '',
    })));

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Quotations');

    const filename = 'quotations.xlsx';
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    res.send(buffer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cloneQuotation = async (req, res) => {
    try {
      const { id } = req.params;
  
      const originalQuotation = await Quotation.findById(id);
      if (!originalQuotation) {
        return res.status(404).json({ error: 'Quotation not found' });
      }
  
      const clonedQuotationData = originalQuotation.toObject();
      delete clonedQuotationData._id;
  
      // Generate a new quotation number or modify the existing one

      const quotationCount = await Quotation.countDocuments({
        userId: clonedQuotationData.userId,
      });
      clonedQuotationData.quotationNo = `QOUT-${quotationCount + 1}`;

  
      // Set other fields as necessary
      clonedQuotationData.isDeleted = false;
      
  
      const clonedQuotation = new Quotation(clonedQuotationData);
      await clonedQuotation.save();
  
      res.status(201).json({ message: 'Quotation cloned successfully', data: clonedQuotation });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

exports.wishlistQuotation = async (req,res) => {
    try {
        const id = req.params.id;
        const quotation = await Quotation.findById(id);
        if(!quotation){
            res.status(404).json({ error: "Quotation not found "});
        }
        const isWishlist = quotation.wishlist; 
        const quotationUpdated = await Quotation.findByIdAndUpdate(id, { wishlist: !isWishlist }, { new: true })
            .populate('customer', 'firstName lastName')
            .populate('user', 'userName');
        const message = !isWishlist ? "Quotation added to wishlist successfully" : "Quotation removed from wishlist successfully";
        res.status(200).json({ message, quotation: quotationUpdated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.downloadQuotation = async (req, res) => {
//     try {
//       const id = req.params.id;
      
//       const quotation = await Quotation.findOne({ _id: id, isDeleted: false })
//             .populate('customer')
//             .populate('user')
//             .populate('updatedId');
//       if (!quotation) {
//         return res.status(404).json({ error: 'Quotation not found' });
//       }
        
//       const ejsFilePath = path.join(__dirname, '../views/downloadQuotation.ejs');
  
//       const htmlContent = await ejs.renderFile(ejsFilePath, { quotation });
  
//       const browser = await puppeteer.launch({
//         headless: true,
//         args: ['--no-sandbox', '--disable-setuid-sandbox'] 
//       });
  
//       const page = await browser.newPage();
//       await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
  
//       const pdfBuffer = await page.pdf({
//         format: 'A4',
//         printBackground: true,
//       });
  
//       await browser.close();
  
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename=quotation-${id}.pdf`);
//       res.setHeader('Content-Length', pdfBuffer.length); 
      
//       res.setHeader('X-Status-Message', 'PDF generated successfully');
//       res.setHeader('X-Status-Code', '200');
  
//       return res.end(pdfBuffer); 
  
//     } catch (error) {
//       console.error('Error downloading quotation:', error);
//       return res.status(500).json({ error: 'An error occurred while generating the PDF.' });
//     }
// };
  

exports.downloadQuotation = async (req, res) => {
    try {
        const id = req.params.id;
        
        const quotation = await Quotation.findOne({ _id: id, isDeleted: false })
            .populate('customer')
            .populate('user')
            .populate('updatedId')
            .populate('bankDetails');
        
        if (!quotation) {
            return res.status(404).json({ error: 'Quotation not found' });
        }

        const totalAmountInWords = convertNumberToWords(quotation.grandTotal);

        const data = {
            quotationNumber: quotation.quotationNo,
            quotationDate: quotation.quotationDate,
            dueDate: quotation.dueDate,
            customer: quotation.customer,
            companyName: quotation.customer.companyName,
            billingAddress: quotation.address,
            shippingAddress: quotation.shippingAddress,
            items: quotation.ItemList,
            subTotal: quotation.totalAmountBeforeTax,
            roundoff: quotation.roundoff,
            taxAmount: quotation.ItemList.reduce((sum, item) => sum + (item.cgst + item.sgst) * item.taxable / 100, 0),
            totalAmount: quotation.grandTotal,
            totalAmountInWords: totalAmountInWords, 
            bankDetails: quotation.bankDetails,
            extracharges: quotation.addExtraCharges,
            GSTIN: quotation.customer.GSTIN || 'NA',
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

        const ejsFilePath = path.join(__dirname, '../views/downloadQuotation.ejs');

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
        res.setHeader('Content-Disposition', `attachment; filename=quotation-${id}.pdf`);
        res.setHeader('Content-Length', pdfBuffer.length);
        res.setHeader('X-Status-Message', 'PDF generated successfully');
        res.setHeader('X-Status-Code', '200');

        return res.end(pdfBuffer);

    } catch (error) {
        console.error('Error downloading quotation:', error);
        return res.status(500).json({ error: 'An error occurred while generating the PDF.' });
    }
};
function convertNumberToWords(number) {
    return numberToWords.toWords(number);
}

exports.undodeleteQuotation = async (req, res) => {
    try {
        const id = req.params.id;
        const quotation = await Quotation.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
        if (!quotation) return res.status(404).json({
            message: 'Quotation not found',
            status: 'fail'
        });

        res.status(200).json({
            status: 'success',
            message: 'Quotation retrieve successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}