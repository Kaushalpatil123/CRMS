import React, { useState } from 'react';

const EditAddress = ({ open, handleClose, handleAddressUpdate }) => {
  const [address, setAddress] = useState({
    title: '',
    line1: '',
    line2: '',
    city: '',
    country: '',
    state: '',
    pincode: '',
    gstin: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Structure the address object as required by the API
    const addressPayload = {
      address1: address.line1,
      address2: address.line2,
      city: address.city,
      state: address.state,
      country: address.country,
      pincode: address.pincode,
      type: address.title || 'Home',  // Use title as type or default to 'Home'
    };

    // Pass the structured address to the parent component
    handleAddressUpdate(addressPayload);

    handleClose();
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} justify-center items-center bg-gray-800 bg-opacity-50`}>
      <div className="bg-white w-3/4 max-w-lg p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Add New Address</h2>
          <button onClick={handleClose} className="text-red-600 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
        <div>
  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">Type</label>
  <select
    id="title"
    name="title"
    value={address.title}
    onChange={handleChange}
    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
  >
    <option value="" disabled>Select Title</option>
    <option value="Home">Home</option>
    <option value="Office">Office</option>
  </select>
</div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="line1">Address Line 1</label>
            <input
              type="text"
              id="line1"
              name="line1"
              value={address.line1}
              onChange={handleChange}
              className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5 mb-2"
              placeholder="Address Line 1"
            />
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="line2">Address Line 2</label>

            <input
              type="text"
              id="line2"
              name="line2"
              value={address.line2}
              onChange={handleChange}
              className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              placeholder="Address Line 2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={address.city}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={address.state}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                placeholder="State"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={address.country}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                placeholder="Country"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="pincode">Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                placeholder="Pincode"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="gstin">GSTIN</label>
            <input
              type="text"
              id="gstin"
              name="gstin"
              value={address.gstin}
              onChange={handleChange}
              className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              placeholder="GSTIN"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAddress;
