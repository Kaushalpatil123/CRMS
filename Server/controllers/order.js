const Order = require("../models/Order.js");
const User = require("../models/user");
const Address = require('../models/address.js');
const { extractJWTDetails } = require("../middlewares/token");
const xlsx = require('xlsx');
const Lead=require('../models/leadModel.js')
const BankDetail = require('../models/bankdetail'); 
const Product = require("../models/product.js");
// Create a new sale order
exports.createOrder = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = extractJWTDetails(token);

    if (!decodedToken || !decodedToken._id) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate bank detail
    const bankDetail = await BankDetail.findById(req.body.bankDetails);
    if (!bankDetail) {
      return res.status(400).json({ error: "Invalid bank detail ID" });
    }
    
    const orderCount = await Order.countDocuments({
      userId: decodedToken._id,
    });


    const newOrderNumber = `ORDER-${orderCount + 1}`;
    const documentDetailsWithOrderNo = {
      orderNo: newOrderNumber
    };
    const order = new Order({
      ...req.body,
      user: user._id,
      updatedId:decodedToken._id,

    });
    order.documentDetails.orderNumber = newOrderNumber
    await order.save();

    const address = req.body.address;
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

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Get all sale orders
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page if not provided
    const isWishlist = req.query.isWishlist;
    const status = req.query.status;
    const skip = (page - 1) * pageSize; // Calculate how many items to skip
    const executive = req.query.executive;
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1; 

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = extractJWTDetails(token);

    if (!decodedToken || !decodedToken._id) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    let query = {};

    if(user.Role != 'Admin'){
      query.isDeleted = false;
    }

    if (startDate && endDate) {
      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    if(isWishlist !== undefined){
      query.wishlist = isWishlist === 'true';
    }

    if(status!=undefined){
      query.status = status;
    }

    if(executive!=undefined){
      query['partyDetails.executive'] = executive;
    }

    // const orders = await Order.find(query)
    //   .populate("customer", "firstName lastName")
    //   .skip(skip)
    //   .limit(pageSize)
    //   .populate("updatedId", "userName")
    //   .sort({ createdAt: -1 });

    const totalOrders = await Order.countDocuments(query);

    const orderIds = await Order.find(query)
         .sort({ createdAt: -1 }) 
         .skip(skip)
         .limit(pageSize)
         .select('_id');

    const orders = await Order.find({ _id: { $in: orderIds.map(order => order._id) } })
         .sort({ createdAt: sortOrder }) 
         .populate('updatedId', 'userName')
         .populate('bankDetails')
         .lean();

    const hasPreviousPage = page > 1;
    const hasNextPage = skip + pageSize < totalOrders;

    res.status(200).json({
      status: "success",
      message: "Orders fetched successfully",
      data: {
        orders,
        currentPage: page,
        pageSize: pageSize,
        hasPreviousPage,
        hasNextPage,
        totalOrders,
        sortOrder: sortOrder === 1 ? 'asc' : 'desc'
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single sale order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id })
      .populate("customer", "firstName lastName")
      .populate("updatedId", "userName")
      .populate('bankDetails');
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const {id} = req.params;
    const {
      customer,
      copyFrom,
      partyDetails,
      documentDetails,
      itemList,
      address,
      termsConditions,
      bankDetails,
      notes,
      total,
      grandTotal,
      addExtraCharges,
      addDiscount,
      status,
      nextActions,
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

    if (req.body.bankDetails) {
      const bankDetail = await BankDetail.findById(req.body.bankDetails);
      if (!bankDetail) {
        return res.status(400).json({ error: "Invalid bank details" });
      }
    }

    console.log(req.user._id)
    const updatedId = decodedToken._id;

    const existingOrder = await Order.findOne({_id: id, isDeleted: false});

    if(!existingOrder){
      return res.status(404).json({ error: 'Invoice not found'})
    }

    const updatedNextActions = {...existingOrder.nextActions,...nextActions}

    const updatedAddress = {...existingOrder.address, ...address};

    const updatedData = {
      customer,
      copyFrom,
      partyDetails,
      documentDetails,
      itemList,
      address:updatedAddress,
      termsConditions,
      bankDetails,
      notes,
      total,
      grandTotal,
      addExtraCharges,
      addDiscount,
      updatedId,
      nextActions:updatedNextActions,
    };

    if(status != undefined){
      updatedData.status = status;
    }

    // Updating the invoice in the database
    const order = await Order.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true }).populate('updatedId', 'userName');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Sending the updated invoice, updatedId, and updated userName in the response
    res.status(200).json({
      status: 'success',
      message: 'Order updated successfully',
      data: order,
      updatedBy: {
        updatedId: order.updatedId,
        userName: user.userName
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Delete a sale order
exports.deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!order)
      return res.status(404).json({
        message: "Order not found",
        status: "fail",
      });

    res.status(200).json({
      status: "success",
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.cloneOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const originalOrder = await Order.findById(id);
    if (!originalOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const clonedOrderData = originalOrder.toObject();

    delete clonedOrderData._id;

    
    clonedOrderData.isDeleted = false;
    clonedOrderData.reason = '';

    const clonedOrder = new Order(clonedOrderData);
    await clonedOrder.save();

    res.status(201).json({
      status: 'success',
      message: 'Order cloned successfully',
      data: clonedOrder,});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
exports.exportOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'firstName lastName') // Populate customer details
      .populate('user', 'userName') // Populate user details
      .populate('updatedId', 'userName'); // Populate updated user details

    // Create a new workbook
    const workbook = xlsx.utils.book_new();

    // Convert the orders into a sheet-friendly format
    const worksheet = xlsx.utils.json_to_sheet(orders.map(order => ({
      "Order No": order.documentDetails.orderNumber,
      "Reference": order.documentDetails.reference,
      "Customer": order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : '',
      "User": order.user ? order.user.userName : '',
      "Contact Person": order.partyDetails.contactPerson,
      "Sales Credit": order.partyDetails.salesCredit,
      "Address": order.partyDetails.address,
      "Shipping Address": order.partyDetails.shippingAddress,
      "Executive": order.partyDetails.executive,
      "Order Date": order.documentDetails.orderDate ? new Date(order.documentDetails.orderDate).toLocaleDateString() : '',
      "Due Date": order.documentDetails.dueDate ? new Date(order.documentDetails.dueDate).toLocaleDateString() : '',
      "Customer PO Number": order.documentDetails.customerPoNumber,
      "Item List": order.itemList.map(item => `
        Item: ${item.itemDescription}, 
        HSN/SAC: ${item.hsnSac}, 
        Quantity: ${item.quantity}, 
        Unit: ${item.unit}, 
        Rate: ${item.rate}, 
        Discount: ${item.discount}, 
        Taxable: ${item.taxable}, 
        CGST: ${item.cgst}, 
        SGST: ${item.sgst}, 
        Amount: ${item.amount}`
      ).join('\n'), // Join items into a single string with new lines separating each
      "Terms & Conditions": order.termsConditions.join(', '),
      "Bank Details": order.bankDetails,
      "Notes": order.notes || '',
      "Total Amount": order.total,
      "Grand Total": order.grandTotal,
      "Extra Charges": order.addExtraCharges,
      "Discount": order.addDiscount,
      "Last Updated By": order.updatedId ? order.updatedId.userName : '',
    })));

    // Append worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Orders');

    // Convert the workbook to a buffer
    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');

    // Send the file buffer as a response
    res.send(buffer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }  
};

exports.wishlistOrder = async (req,res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id);
    if(!order){
      res.status(404).json({ error: "Order not found" });
    }
    const isWishlist = order.wishlist;
    const orderUpdated = await Order.findByIdAndUpdate(id, { wishlist: !isWishlist }, { new: true });
    const message = !isWishlist ? "Order added to wishlist successfully" : "Order removed from wishlist successfully";
    res.status(200).json({ message, order: orderUpdated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findOne({ _id: id, isDeleted: false });
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = extractJWTDetails(token);

    if (!decodedToken || !decodedToken._id) {
      return res.status(401).json({ error: "Invalid or missing token" });
    }

    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(user._id);
    // Example: Add products to the order
    // const products = await Product.find({ _id: { $in: lead.productIds } });
    // console.log(products);
    // const itemList = products.map(product => ({
    //   product: product._id,
    //   quantity: lead.items[product._id]?.quantity || 1, // Assuming 'items' in lead has quantities
    //   rate: product.sellingprice,
    //   discount: 0, // Adjust discount logic as needed
    //   taxable: 0, // Calculate based on quantity and rate
    //   cgst: 0,
    //   sgst: 0,
    //   amount: 0, // Calculate based on quantities, rates, and taxes
    // }));

    const newOrder = new Order({
      customer: lead.customer,
      user: user._id,
      partyDetails: {
        contactPerson: lead.contacts[0].firstName + ' ' + lead.contacts[0].lastName,
        salesCredit: 'No',
        executive: lead.executive,
      },
      documentDetails: {
        orderNumber: 'ORD-' + new Date().getTime(),
        orderDate: Date.now(),
        dueDate: Date.now(),
        customerPoNumber: lead.customerPoNumber || '',
      },
      itemList:[],// Use the itemList created from products
      total: lead.totalAmount || 0,
      grandTotal: lead.grandTotal || 0,
      // bankDetails: lead.bankDetails || 'Bank Details Here',
      notes: lead.notes || '',
      updatedId: user._id,
      lead: lead._id,
    });

    await newOrder.save();

    lead.order = true;
    await lead.save();

    res.status(201).json({
      message: 'Lead successfully converted to Order',
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Undelete sale order
exports.undeleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
    if (!order)
      return res.status(404).json({
        message: "Order not found",
        status: "fail",
      });

    res.status(200).json({
      status: "success",
      message: "Order Undeleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
