import { TextField } from '@mui/material';
import {
  AddCategory,
  AddProduct,
  AddSubcategory,
  EditParticularProduct,
  fetchCategories,
  getParticularProduct
} from 'pages/utils/products/api';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router';
import {useNavigate } from 'react-router';


const Create = () => {
  const [formData, setFormData] = useState({
    itemname: '',
    code: '',
    category: '',
    subcategory: '',
    actualprice: '',
    sellingprice: '',
    hsn: '',
    gst: '',
    description: '',
    unit: ''
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const navigate = useNavigate();

  const { id } = useParams();
  // Get categories

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  const getProducts = async () => {
    const product = await getParticularProduct(id);
    setFormData({
      itemname: product.itemname || '', // Prefill the fields with product details
      code: product.code || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      actualprice: product.actualprice || '',
      sellingprice: product.sellingprice || '',
      hsn: product.hsn || '',
      gst: product.gst || '',
      description: product.description || '',
      unit: product.unit || ''
    });
    console.log('products--->', product?.category);
    const selectedCategory = categories.find((category) => category._id === product?._id);
    // const selectedCategory = categories.find((category) => category?.category === product.category);
    setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleCategoryChange = (e) => {
    console.log('e target value--->', e);
    const selectedCategory = categories.find((category) => category._id === e.target.value);
    console.log('selectedcategory---->', selectedCategory);
    setFormData({ ...formData, category: selectedCategory?.name, subcategory: '' });
    setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === 'actualprice' || id === 'sellingprice') {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('formdata check--->', formData);
    if (!formData?.itemname) {
      toast.error('Item name is required');
      return;
    }
    if (!formData?.code) {
      toast.error('Code is required');
      return;
    }
    if (!formData?.category) {
      toast.error('Category is required');
      return;
    }
    if (!formData?.subcategory) {
      toast.error('Sub-Category is required');
      return;
    }
    if (!formData?.actualprice) {
      toast.error('Actual-Price is required in numbers');
      return;
    }
    if (!formData?.sellingprice) {
      toast.error('Selling-Price is required in numbers');
      return;
    }
    if (!formData?.hsn) {
      toast.error('Hsn is required');
      return;
    }

    if (!formData?.gst) {
      toast.error('Gst is required in numbers ');
      return;
    }

    if (!formData.description) {
      toast.error('Description are required!');
      return;
    }

    if (formData?.gst > 100) {
      toast.error('Gst Must be less than 100');
      return;
    }
    if (formData?.unit <= 0) {
      toast.error('Unit is required');
      return;
    }

    const selectedCategory = categories.find((category) => category._id === formData.category);
    const selectedSubcategory = subcategories.find((subcategory) => subcategory._id === formData.subcategory);

    const category = selectedCategory ? selectedCategory.name : formData.category;
    const subcategory = selectedSubcategory ? selectedSubcategory.name : formData.subcategory;
    const productData = {
      itemname: formData.itemname,
      code: formData.code,
      category: category,
      subcategory: subcategory,
      actualprice: formData.actualprice,
      sellingprice: formData.sellingprice,
      hsn: formData.hsn,
      gst: formData.gst,
      description: formData.description,
      unit: formData.unit 
      // }),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await EditParticularProduct(id, productData, token);
      console.log('Product updated successfully:', response);
      toast.success('Product Updated Successfully');
      setTimeout(() => {
        navigate('/apps/product');
      }, 1000);

      // if (response) {
      // const data = await response.json();
      // console.log('Success:', data);
      // setFormData({
      //   itemname: '',
      //   code: '',
      //   category: '',
      //   subcategory: '',
      //   actualprice: '',
      //   sellingprice: '',
      //   hsn: '',
      //   gst: '',
      //   description: ''
      // });
      // }
      //  else {
      // const errorData = await response.json();
      // console.error('Error:', errorData);
      // }
    } catch (error) {
      console.error('Error rrririiir:', error);
      console.log('error', error?.response?.data?.error);
      toast.error('Error Submitting Form');
    }
  };

  const handleAddCategory = async () => {
    try {
      const requestdata = {
        name: newCategory
      };
      const addedCategory = await AddCategory(JSON.stringify(requestdata)); // Call the addCategory function
      console.log('add category--->', addedCategory);
      setCategories([...categories, addedCategory]);
      setIsCategoryModalOpen(false);
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleAddSubcategory = async () => {
    try {
      const requestdata = {
        name: newSubcategory
      };
      console.log('request data--->', requestdata);
      const updatedCategory = await AddSubcategory(formData.category, JSON.stringify(requestdata));
      console.log('selected subcategory===->', updatedCategory);

      // Update category list with the updated category and subcategories
      const updatedCategories = categories.map((category) => (category._id === updatedCategory._id ? updatedCategory : category));

      setCategories(updatedCategories);
      setSubcategories(updatedCategory.subcategories); // Update subcategories for the selected category
      setIsSubcategoryModalOpen(false);
      setNewSubcategory('');
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };

  return (
    <div className="">
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">Edit Item</h3>
      {/* <div className="flex justify-between py-6">
       
      </div> */}
      {/* <hr className="h-[1px] bg-gray-300 my-4" /> */}
      <div className="bg-white rounded-lg shadow-md p-4 flex-grow overflow-auto pb-6">
        <div className="grid grid-cols-2 gap-4 mb-4 py-2">
          <div>
            <label htmlFor="itemname" className="block text-gray-700 font-medium mb-2">
              Item Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="itemname"
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none  h-[45px]"
              value={formData.itemname}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-gray-700 font-medium mb-2">
              Code<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="code"
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none  h-[45px]"
              value={formData.code}
              onChange={handleChange}
              required
            />
            <p className="text-gray-500 text-sm mt-1">Prev. Code: 13mm CCG</p>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-[50%]">
            {/* Added relative to handle dropdown position */}
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Category<span className="text-red-500">*</span>
            </label>
            <div className="flex justify-between items-center align-middle w-full">
              <select
                id="category"
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none m-auto  h-[45px]" // Added z-10 for proper layering
                value={formData.category}
                onChange={handleCategoryChange}
                required
              >
                {console.log('category------->', formData?.category)}
                <option value={formData.category || ''}>{formData.category || 'Select Category'}</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="ml-2 bg-red-600 text-white px-4 py-2 rounded-sm m-auto hover:text-blue-700 h-[45px]"
                onClick={() => setIsCategoryModalOpen(true)}
              >
                +
              </button>
            </div>
          </div>

          <div className="w-[50%]">
            <label htmlFor="subcategory" className="block text-gray-700 font-medium mb-2">
              Sub-Category<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <select
                id="subcategory"
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none  h-[45px]"
                value={formData.subcategory}
                onChange={handleChange}
                required
              >
                <option value={formData.subcategory || ''}>{formData.subcategory || 'Select'}</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory?.name}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="ml-2 bg-red-600 text-white px-4 py-2 rounded-sm hover:text-blue-700 h-[45px]"
                onClick={() => setIsSubcategoryModalOpen(true)}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-[50%]">
            <label htmlFor="actualprice" className="block text-gray-700 font-medium mb-2">
              Actual Price
            </label>
            <div className="flex gap-3">
              <button type="button" className="bg-white border rounded-md border-gray-300 text-orange-700 px-4 py-2">
                ₹
              </button>
              <input
                type="number"
                id="actualprice"
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none  h-[45px]"
                value={formData.actualprice}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="w-[50%]">
            <label htmlFor="sellingprice" className="block text-gray-700 font-medium mb-2">
              Selling Price
            </label>
            <div className="flex gap-3">
              <button type="button" className="bg-white border rounded-md border-gray-300 text-orange-700 px-4 py-2">
                ₹
              </button>
              <input
                type="number"
                id="sellingprice"
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none  h-[45px]"
                value={formData.sellingprice}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-[50%]">
            <label htmlFor="hsn" className="block text-gray-700 font-medium mb-2">
              HSN/SAC
            </label>
            <input
              type="text"
              id="hsn"
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none  h-[45px]"
              value={formData.hsn}
              onChange={handleChange}
            />
          </div>

          <div className="w-[50%]">
            <label htmlFor="gst" className="block text-gray-700 font-medium mb-2">
              GST
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="gst"
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none  h-[45px]"
                value={formData.gst}
                onChange={handleChange}
              />
              <h1 className="font-bold text-center px-2">%</h1>
            </div>
          </div>
        </div>

        <div className="gap-4 w-full flex mb-4">
          <div className="w-[50%]">
            <label htmlFor="hsn" className="block text-gray-700 font-medium mb-2">
              Unit
            </label>
            <input
              id="unit"
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none  h-[45px]"
              value={formData.unit}
              onChange={handleChange}
            />
          </div>

          <div className="w-[50%]">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <input
              id="description"
              rows="4"
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none h-[45px]"
              value={formData.description}
              onChange={handleChange}
            ></input>
          </div>
        </div>
        <div className="flex justify-start">
          <button
            type="submit"
            className="w-[8vw] mx-auto flex justify-center text-white  bg-[#779E40] hover:bg-[#5F7E33] font-semibold rounded-md text-base py-2 mt-6"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>

      {isCategoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">Add Category</h2>
            <input
              type="text"
              className="border border-gray-300 rounded-sm p-2 w-full mb-4"
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <div className="flex justify-end">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 mr-2" onClick={handleAddCategory}>
                Add
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-sm hover:bg-gray-600"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isSubcategoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">Add Sub-Category</h2>
            <input
              type="text"
              className="border border-gray-300 rounded-sm p-2 w-full mb-4"
              placeholder="Sub-Category Name"
              value={newSubcategory}
              onChange={(e) => setNewSubcategory(e.target.value)}
            />
            <div className="flex justify-end">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 mr-2" onClick={handleAddSubcategory}>
                Add
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-sm hover:bg-gray-600"
                onClick={() => setIsSubcategoryModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <Toaster position="bottom-center" reverseOrder={false} /> */}
      <Toaster position="top-right" style={{ zIndex: 200000 }} reverseOrder={false} />
    </div>
  );
};

export default Create;
