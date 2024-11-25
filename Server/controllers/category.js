// controllers/category.js
const Category = require('../models/category');

exports.addCategory = async (req, res) => {
    try {
        const { name, description, subcategories } = req.body;
        const category = new Category({ name, description, subcategories });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Category name already exists' });
        }
        res.status(400).json({ error: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, description } = req.body;
        const category = await Category.findByIdAndUpdate(
            categoryId,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Category name already exists' });
        }
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findByIdAndDelete(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully', category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addSubcategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, description } = req.body;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        category.subcategories.push({ name, description });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateSubcategory = async (req, res) => {
    try {
        const { categoryId, subcategoryId } = req.params;
        const { name, description } = req.body;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const subcategory = category.subcategories.id(subcategoryId);

        if (!subcategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }

        subcategory.name = name;
        subcategory.description = description;
        await category.save();

        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteSubcategory = async (req, res) => {
    try {
        const { categoryId, subcategoryId } = req.params;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const subcategory = category.subcategories.id(subcategoryId);

        if (!subcategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }

        category.subcategories.pull(subcategory);
        await category.save();

        res.status(200).json({ message: 'Subcategory deleted successfully', category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSubcategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId);
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        res.status(200).json(category.subcategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};