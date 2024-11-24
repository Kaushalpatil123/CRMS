import React, { useState, useEffect } from 'react';

const EditShippingAddress = ({ open, handleClose, handleShippingAddressUpdate, shippingAddress }) => {
  const [addressState, setAddressState] = useState({
    address1: '',
    address2: '',
    city: '',
    country: '',
    state: '',
    pincode: '',
    gstin: ''
  });

  const [selectedAddress, setSelectedAddress] = useState('');

  // Ensure the effect hook is at the top level and always runs when dependencies change
  useEffect(() => {
    if (selectedAddress && shippingAddress) {
      console.log('selected shipping address address se--->', shippingAddress);
      
      const selected = shippingAddress.find((addr) => addr.address1 === selectedAddress);
      if (selected) {
        setAddressState({
          address1: selected.address1,
          address2: selected.address2 || '',
          city: selected.city || '',
          state: selected.state || '',
          country: selected.country || '',
          pincode: selected.pincode || '',
          gstin: selected.gstin || ''
        });
      }
    }
  }, [selectedAddress, shippingAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddressSelect = (e) => {
    const selectedValue = e.target.value;
    setSelectedAddress(selectedValue);
  };

  const handleSave = () => {
    const combinedAddress = `${addressState.address1}, ${addressState.address2 ? `${addressState.address2}, ` : ''}${addressState.city}, ${addressState.state}, ${addressState.country} - ${addressState.pincode}`;

    handleShippingAddressUpdate({ ...addressState, combinedAddress });
    console.log('address proper--->', combinedAddress);
    handleClose();
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} justify-center items-center bg-gray-800 bg-opacity-50`}>
      <div className="bg-white w-3/4 max-w-lg p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Edit Shipping Address</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Dropdown to select existing address */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="addressDropdown">
            Select Address
          </label>
          <select
            id="addressDropdown"
            value={selectedAddress}
            onChange={handleAddressSelect}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Enter New Address</option>
            {Array.isArray(shippingAddress) && shippingAddress.map((addr, index) => (
              <option key={index} value={addr.address1}>
                {addr.address1}
              </option>
            ))}
          </select>
        </div>

        {/* Address Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address1">
              Address Line 1
            </label>
            <input
              type="text"
              id="address1"
              name="address1"
              value={addressState.address1}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-6"
              placeholder="Line 1"
            />
            <input
              type="text"
              id="address2"
              name="address2"
              value={addressState.address2}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Line 2"
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={addressState.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={addressState.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={addressState.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pincode">
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={addressState.pincode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gstin">
              GSTIN
            </label>
            <input
              type="text"
              id="gstin"
              name="gstin"
              value={addressState.gstin}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditShippingAddress;
