import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCustomer } from 'pages/utils/customers/api';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    website: '',
    industrySegment: '',
    country: '',
    state: '',
    city: '',
    receivables: 0,
    receivablesNotes: '',
    businessProspect: 0,
    orderTarget: 0,
    msmeNo: '',
     GSTIN: "",
    panNo: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.receivables <= 0) {
      newErrors.receivables = 'Receivables must be a positive number';
    }
    if (formData.businessProspect <= 0) {
      newErrors.businessProspect = 'Business prospect must be a positive number';
    }
    if (formData.orderTarget <= 0) {
      newErrors.orderTarget = 'Order target must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await addCustomer(formData);
      navigate(-1); // Navigate back to the last page after successful submission
    } catch (error) {
      console.error('Error adding customer:', error.response.data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-md w-[60%] mt-4 mb-10 h-auto overflow-y-auto font-poppins">
        <h1 className="text-2xl font-semibold mb-4">Enter Customer</h1>
        <form id="form" className="space-y-6" onSubmit={handleSubmit}>
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="text-sm font-medium text-gray-800 block mb-2">Company</label>
            <input
              type="text"
              name="companyName"
              id="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              placeholder="Enter Company Name"
              required
            />
          </div>
          {/* Name */}
          <div className='flex justify-between space-x-5'>
            <div className='w-[80%]'>
              <label className="text-sm font-medium text-gray-800 block mb-2">Name</label>
              <div className="flex space-x-2">
                <select
                  name="salutation"
                  id="salutation"
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none p-1"
                  required
                >
                  <option value="Mr."> Mr.</option>
                  <option value="Mrs."> Mrs.</option>
                  <option value="Miss"> Miss</option>
                  <option value="Ms."> Ms.</option>
                  <option value="Dr."> Dr.</option>
                </select>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-[42%] p-2.5"
                  placeholder="First Name"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-[42%] p-2.5"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>
            {/* Mobile Number */}
            <div>
              <label htmlFor="mobile" className="text-sm font-medium text-gray-800 block mb-2">Mobile Number</label>
              <div className='relative'>
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">+91</span>
                <input
                  type="text"
                  name="mobile"
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full pl-9 p-2.5"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className='flex w-full space-x-5'>
            <div className='flex-1'>
              <label htmlFor="email" className="text-sm font-medium text-gray-800 block mb-2">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                placeholder="Enter Email"
                required
              />
            </div>
            {/* Website */}
            <div className='flex-1'>
              <label htmlFor="website" className="text-sm font-medium text-gray-800 block mb-2">Website</label>
              <input
                type="url"
                name="website"
                id="website"
                value={formData.website}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                placeholder="Enter Website"
              />
            </div>
          </div>

          {/* Industry & Segment */}
          <div>
            <label htmlFor="industrySegment" className="text-sm font-medium text-gray-800 block mb-2">Industry & Segment</label>
            <input
              type="text"
              name="industrySegment"
              id="industrySegment"
              value={formData.industrySegment}
              onChange={handleChange}
              className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              placeholder="Enter Industry & Segment"
            />
          </div>

          {/* Address Information */}
          <div className='flex w-full space-x-5'>
            <div className='flex-1'>
              <label htmlFor="country" className="text-sm font-medium text-gray-800 block mb-2">Country</label>
              <input
                type="text"
                name="country"
                id="country"
                value={formData.country}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                placeholder="Enter Country"
              />
            </div>
            <div className='flex-1'>
              <label htmlFor="state" className="text-sm font-medium text-gray-800 block mb-2">State</label>
              <input
                type="text"
                name="state"
                id="state"
                value={formData.state}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                placeholder="Enter State"
              />
            </div>
            <div className='flex-1'>
              <label htmlFor="city" className="text-sm font-medium text-gray-800 block mb-2">City</label>
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                placeholder="Enter City"
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className='flex space-x-5'>
            <div className='flex-1'>
              <label htmlFor="receivables" className="text-sm font-medium text-gray-800 block mb-2">Receivables</label>
              <input
                type="number"
                name="receivables"
                id="receivables"
                value={formData.receivables}
                onChange={handleChange}
                className={`bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5 ${errors.receivables ? 'border-red-500' : ''}`}
                placeholder="Enter Receivables"
              />
              {errors.receivables && <p className="text-red-500 text-sm">{errors.receivables}</p>}
            </div>
            <div className='flex-1'>
              <label htmlFor="businessProspect" className="text-sm font-medium text-gray-800 block mb-2">Business Prospect</label>
              <input
                type="number"
                name="businessProspect"
                id="businessProspect"
                value={formData.businessProspect}
                onChange={handleChange}
                className={`bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5 ${errors.businessProspect ? 'border-red-500' : ''}`}
                placeholder="Enter Business Prospect"
              />
              {errors.businessProspect && <p className="text-red-500 text-sm">{errors.businessProspect}</p>}
            </div>

            <div className='flex-1'>
              <label htmlFor="orderTarget" className="text-sm font-medium text-gray-800 block mb-2">Order Target</label>
              <input
                type="number"
                name="orderTarget"
                id="orderTarget"
                value={formData.orderTarget}
                onChange={handleChange}
                className={`bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5 ${errors.orderTarget ? 'border-red-500' : ''}`}
                placeholder="Enter Order Target"
              />
              {errors.orderTarget && <p className="text-red-500 text-sm">{errors.orderTarget}</p>}
            </div>
            
            <div className='flex-1'>
              <label htmlFor="orderTarget" className="text-sm font-medium text-gray-800 block mb-2">GSTIN</label>
              <input
                type="text"
                name="GSTIN"
                id="GSTIN"
                value={formData.GSTIN}
                onChange={handleChange}
                className={`bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5 ${errors.orderTarget ? 'border-red-500' : ''}`}
                placeholder="GSTIN"
              />
            
            </div>
          </div>

          {/* MSME & PAN */}
          <div className='flex space-x-5'>
            <div className='flex-1'>
              <label htmlFor="msmeNo" className="text-sm font-medium text-gray-800 block mb-2">MSME No.</label>
              <input
                type="text"
                name="msmeNo"
                id="msmeNo"
                value={formData.msmeNo}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                placeholder="Enter MSME No."
              />
            </div>
            <div className='flex-1'>
              <label htmlFor="panNo" className="text-sm font-medium text-gray-800 block mb-2">PAN No.</label>
              <input
                type="text"
                name="panNo"
                id="panNo"
                value={formData.panNo}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                placeholder="Enter PAN No."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
