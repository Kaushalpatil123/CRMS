import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

const EditItemPopup = ({ open, handleClose, item, onSave }) => {
  
  const [editedItem, setEditedItem] = useState({ ...item });
  const [calculatedValues, setCalculatedValues] = useState({
    taxable: '0.00',
    amount: '0.00',
  });

  useEffect(() => {
    setEditedItem({ ...item });
  }, [item]);
  console.log("Item to be edited-->",item);
  useEffect(() => {
    const { rate, cgst, sgst, discount, quantity } = editedItem;
    const newValues = calculateAmounts(rate, cgst, sgst, discount, quantity);
    setCalculatedValues(newValues);
  }, [editedItem]);

  const calculateAmounts = (rate, cgst, sgst, discount, quantity) => {
    const validRate = parseFloat(rate) || 0;
    const validCgst = parseFloat(cgst) || 0;
    const validSgst = parseFloat(sgst) || 0;
    const validDiscount = parseFloat(discount) || 0;
    const validQuantity = parseFloat(quantity) || 1;

    const discountedRate = validRate - validDiscount;
    const taxable = (discountedRate * validQuantity).toFixed(2);
    const gstTotal = ((validCgst + validSgst) / 100 * discountedRate * validQuantity).toFixed(2);
    const amount = (parseFloat(taxable) + parseFloat(gstTotal)).toFixed(2);

    return { taxable, amount };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const updatedItem = {
      ...editedItem,
      ...calculatedValues,
    };

    onSave(updatedItem);
    handleClose();
  };

  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-md shadow-lg w-[450px]">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Edit Item</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Item & Description</label>
              <input
                type="text"
                name="itemandDescription"
                value={editedItem.itemandDescription || ''}
                onChange={handleChange}
                readOnly
                className="bg-white border border-gray-300 text-gray-800 mt-1 rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">HSN/SAC</label>
              <input
                type="text"
                name="hsnSac"
                value={editedItem.hsnSac || ''}
                onChange={handleChange}
               // readOnly
                className="bg-white border border-gray-300 text-gray-800 mt-1 rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={editedItem.quantity || 0}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-800 mt-1 rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rate (₹)</label>
                <input
                  type="number"
                  name="rate"
                  value={editedItem.rate || 0}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-800 mt-1 rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount (₹)</label>
                <input
                  type="number"
                  name="discount"
                  value={editedItem.discount || 0}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-800 mt-1 rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CGST (%)</label>
                <input
                  type="number"
                  name="cgst"
                  value={editedItem.cgst || 0}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-800 mt-1 rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">SGST (%)</label>
                <input
                  type="number"
                  name="sgst"
                  value={editedItem.sgst || 0}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-800 mt-1 rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount (₹)</label>
                <input
                  type="text"
                  value={calculatedValues.amount}
                  readOnly
                  className="bg-white border border-gray-300 text-gray-800 mt-1 rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Button
              className="bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 hover:text-white px-4 py-2"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-lime-600 text-white rounded-md font-semibold hover:bg-lime-700 hover:text-white px-4 py-2"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditItemPopup;
