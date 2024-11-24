import React, { useState } from 'react';

import { addCustomer } from 'pages/utils/customers/api';
import { Toaster, toast } from 'react-hot-toast';

const AddCustomer = ({ open, handleClose }) => {
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
    city:'',
    receivables: 0,
    receivablesNotes: '',
    businessProspect: 0,
    orderTarget: 0,
    msmeNo: '',
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
      await addCustomer(formData);;
      toast.success('Customer Added Successfully');
      handleClose(); // Close the modal on successful submission
    } catch (error) {
        toast.error('Error Adding New Customer')
      console.error('Error adding customer:', error.response.data);
    }
  };

  return (
    <div className={`${open ? 'block' : 'hidden'} fixed inset-0 z-50 overflow-y-auto`}>
      <div className="fixed top-0 left-0 w-[100vw] h-full flex items-center overflow-y-hidden justify-center bg-black bg-opacity-50 z-52">
        <div className="bg-white p-6 rounded-md w-[50vw] mt-12 h-[80vh] overflow-y-hidden font-poppins">
          <div className="flex justify-between items-center ">
            <h1 className="text-2xl font-semibold mb-4">Enter Customer</h1>
            <button
              type="button"
              className="text-red-600 rounded-md bg-transparent hover:bg-red-200 hover:text-red-700 rounded-md text-sm p-2 ml-auto inline-flex items-center"
              onClick={() => handleClose()}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <form
            id="form"
            className="space-y-6 overflow-y-auto max-h-[65vh] pr-3"
            onSubmit={handleSubmit}
          >
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



            

          
              <div>
                <label htmlFor="receivables" className="text-sm font-medium text-gray-800 block mb-2">Receivables</label>
                <input
                  type="number"
                  name="receivables"
                  id="receivables"
                  value={formData.receivables}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  placeholder="Receivables"
                  required
                />
                {errors.receivables && (
                  <p className="text-red-500 text-sm mt-1">{errors.receivables}</p>
                )}
              </div>

              <div>
              <label htmlFor="receivablesNotes" className="text-sm font-medium text-gray-800 block mb-2">Receivables Notes</label>
              <textarea
                name="receivablesNotes"
                id="receivablesNotes"
                value={formData.receivablesNotes}
                onChange={handleChange}
                rows="3"
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                placeholder="Enter Receivables Notes"
              />
            </div>
            

            <div className='flex justify-between space-x-5'>
              <div>
                <label htmlFor="businessProspect" className="text-sm font-medium text-gray-800 block mb-2">Business Prospect</label>
                <input
                  type="number"
                  name="businessProspect"
                  id="businessProspect"
                  value={formData.businessProspect}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  placeholder="Business Prospect"
                  required
                />
                {errors.businessProspect && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessProspect}</p>
                )}
              </div>

              <div>
                <label htmlFor="orderTarget" className="text-sm font-medium text-gray-800 block mb-2">Order Target</label>
                <input
                  type="number"
                  name="orderTarget"
                  id="orderTarget"
                  value={formData.orderTarget}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  placeholder="Order Target"
                  required
                />
                {errors.orderTarget && (
                  <p className="text-red-500 text-sm mt-1">{errors.orderTarget}</p>
                )}
              </div>
            </div>

            <div className='flex w-full space-x-5'>
              <div className='flex-1'>
                <label htmlFor="msmeNo" className="text-sm font-medium text-gray-800 block mb-2">MSME No</label>
                <input
                  type="text"
                  name="msmeNo"
                  id="msmeNo"
                  value={formData.msmeNo}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  placeholder="MSME No"
                />
              </div>

              <div className='flex-1'>
                <label htmlFor="panNo" className="text-sm font-medium text-gray-800 block mb-2">PAN No</label>
                <input
                  type="text"
                  name="panNo"
                  id="panNo"
                  value={formData.panNo}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  placeholder="PAN No"
                />
              </div>
            </div>

            <div className='flex justify-between items-center'>
              <button
                type="submit"
                className=" text-white bg-lime-600 hover:bg-lime-700 focus:ring-4 focus:ring-orange-300 font-medium rounded-md text-sm px-5 py-2.5 text-center"
              >
                Submit
              </button>
              
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default AddCustomer;
