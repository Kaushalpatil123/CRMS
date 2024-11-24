import React, { useState, useEffect } from "react";
import axios from "axios";
import { updateBankDetailsById } from "pages/utils/bank/api";

const EditPopup = ({ bankDetails, onClose, onSave, bankId }) => {
  const [formData, setFormData] = useState({
    accountname: bankDetails.accountname || "",
    bankname: bankDetails.bankname || "",
    branch: bankDetails.branch || "",
    accountnumber: bankDetails.accountnumber || "",
    IFSC: bankDetails.IFSC || "",
  });

  // Control body scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Prevent scrolling
    return () => {
      document.body.style.overflow = "auto"; // Restore scrolling on unmount
    };
  }, []);

  // Handle input changes for all fields
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
        // Use the imported updateBankDetailsById function to make the PUT request
        const updatedData = await updateBankDetailsById(bankId, formData);

        // After a successful API call, pass the updated details back to the parent component
        onSave(updatedData);
        onClose(); // Close the popup
    } catch (error) {
        console.error("Error updating bank details", error);
    }
};

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-[5000]">
      <div className="bg-white p-6 rounded-md shadow-md w-[650px]">
        <h3 className="text-2xl font-bold mb-6 text-center">Edit Bank Details</h3>

        {/* Grid Container for Input Fields and Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Input fields go here... */}
          <div>
            <label className="block mb-2 font-medium">Account Name</label>
            <input
              type="text"
              name="accountname"
              value={formData.accountname}
              onChange={handleInputChange}
              className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              placeholder="Account Name"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Bank Name</label>
            <input
              type="text"
              name="bankname"
              value={formData.bankname}
              onChange={handleInputChange}
              className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              placeholder="Bank Name"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              placeholder="Branch"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Account Number</label>
            <input
              type="text"
              name="accountnumber"
              value={formData.accountnumber}
              onChange={handleInputChange}
              className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              placeholder="Account Number"
            />
          </div>

          {/* IFSC Code Field */}
          <div>
            <label className="block mb-2 font-medium">IFSC Code</label>
            <input
              type="text"
              name="IFSC"
              value={formData.IFSC}
              onChange={handleInputChange}
              className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              placeholder="IFSC Code"
            />
          </div>

          {/* Buttons aligned next to IFSC Code */}
          <div className="flex justify-end mt-7 items-center space-x-2">
            <button
              className="bg-red-600 rounded-md text-white px-3 py-2 font-semibold hover:bg-red-700 hover:text-white font-inter"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-lime-600 rounded-md text-white px-3 py-2 font-semibold hover:bg-lime-700 hover:text-white font-inter"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;
