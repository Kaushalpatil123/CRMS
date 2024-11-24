import { useEffect, useState, useRef } from 'react';

const EditAddressModal = ({ show, handleClose, handleSave, editAddress, setEditAddress }) => {
    if (!show) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-1/3">
          <h2 className="text-xl font-bold mb-4">Edit Address</h2>
          {/* Add your input fields here */}
          <textarea
            className="w-full p-2 border rounded-md"
            value={editAddress}
            onChange={(e) => setEditAddress(e.target.value)}
          />
          <div className="flex justify-end mt-4">
            <button onClick={handleClose} className="mr-2 px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-red-600 text-white rounded-md">Save</button>
          </div>
        </div>
      </div>
    );
  };


  export default EditAddressModal