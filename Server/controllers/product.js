const Product = require('../models/product');
const Category = require('../models/category')
const User = require('../models/user');
const {productSchema} = require('../validations/product')

exports.createproduct = async (req, res) => {
    try {
        const {error} = productSchema.validate(req.body)
        if(error){
            return res.status(400).json({ error: error.details[0].message });
        }
        const body = req.body;
        const categoryObj =await Category.findOne({name : body.category})
        if (!categoryObj){
            return res.status(400).json({error : "Category is Not exist"})
        }
    
        if (body.subcategory){
            const checkSubCategories = categoryObj.subcategories.find((data) => data.name === body.subcategory)
            if (!checkSubCategories){
                return res.status(400).json({error : "Sub Category is Not belongs to specified Category"})
            }
        }

        const product = new Product(body);

        // product.discountAmount = (product.rate * product.quantity * product.discount) / 100;
        // // console.log(product.discountAmount)

        // product.taxable = (product.rate * product.quantity) - product.discountAmount;

        // product.amount = product.taxable + (product.taxable * product.gst / 100);

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        Object.keys(updates).forEach((key) => {
            product[key] = updates[key];
        });

        // product.discountAmount = (product.rate * product.quantity * product.discount) / 100;
        // product.taxable = (product.rate * product.quantity) - product.discountAmount;
        // product.amount = product.taxable + (product.taxable * product.gst / 100);

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getAllProducts = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize); // Default to 10 items per page if not provided
        const skip = (page - 1) * pageSize; // Calculate how many items to skip

        const products = await Product.find({isdeleted: false}).sort({ createdAt: -1 }).skip(skip).limit(pageSize);
        const totalProducts = await Product.countDocuments({isdeleted: false})

        const hasPreviousPage = page > 1;
        const hasNextPage = skip + pageSize < totalProducts;

        res.status(200).json({
            products,
            currentPage: page,
            pageSize: pageSize,
            hasPreviousPage,
            hasNextPage,
            totalProducts
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getadminproduct = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize); 
        const skip = (page - 1) * pageSize;
        const isWishlist = req.query.isWishlist;
        
        const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

        let query = {};
        if (user.Role !== "Admin") {
            query.isdeleted = false;
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

        if (isWishlist !== undefined) {
            query.wishlist = isWishlist === 'true';
        }

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize);
        
        const totalProducts = await Product.countDocuments(query);

        const hasPreviousPage = page > 1;
        const hasNextPage = skip + pageSize < totalProducts;

        res.status(200).json({
            products,
            currentPage: page,
            pageSize: pageSize,
            hasPreviousPage,
            hasNextPage,
            totalProducts
        });
    } catch (error) {
        console.error("Error in getAllProducts:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ _id: id });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        product.isdeleted = true;
        await product.save();
        
        res.status(200).json({ message: 'Product deleted successfully', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.undodeleteproduct = async (req, res) => {
    try {
        const id = req.params.id;
        const Products = await Product.findByIdAndUpdate(id, { isdeleted: false }, { new: true });
        if (!Products) return res.status(404).json({
            message: 'Product not found',
            status: 'fail'
        });
console.log(Products)
        res.status(200).json({
            status: 'success',
            message: 'Product retrieve successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.wishlistproduct = async (req,res) => {
    try {
      const id = req.params.id;
      const product = await Product.findById(id);
      if(!product){
        return res.status(404).json({ error: 'user not found' });
      }
      const isWishlist = product.wishlist;
      const productUpdated = await Product.findByIdAndUpdate(id, { wishlist: !isWishlist }, { new: true});
      const message = !isWishlist ? "Product added to wishlist successfully" : "Product removed from wishlist successfully";
      res.status(200).json({ message, product:productUpdated });
    } catch (error) {
      res.status(500).json({ error: error.message })    
    }
  };
