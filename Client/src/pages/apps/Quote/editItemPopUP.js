// import React, { useState, useEffect } from 'react';

// const EditItemPopup = ({ item, onClose, onSave }) => {
//   const [formData, setFormData] = useState({
//     ...item,
    
//     quantity: item.quantity || 0,
//     rate: item.rate || 0,
//     discount: item.discount || 0,
//     taxable: item.taxable || 0,
//     cgst: item.cgst || 0,
//     sgst: item.sgst || 0,
//     amount: item.amount || 0
//   });

//   useEffect(() => {
//     setFormData((prevState) => ({
//       ...prevState,
//       quantity: item.quantity || 0,
//       rate: item.rate || 0,
//       discount: item.discount || 0
//     }));
//   }, [item]);

//   // Update dynamic fields based on user input
//   useEffect(() => {
//     const { quantity, rate, discount, cgst, sgst } = formData;

//     // Ensure values are numbers
//     const quantityNum = parseFloat(quantity) || 0;
//     const rateNum = parseFloat(rate) || 0;
//     const discountNum = parseFloat(discount) || 0;

//     // Calculate taxable value (quantity * rate - discount)
//     const taxable = (quantityNum * rateNum) - discountNum;

//     // Use user-entered CGST and SGST values or default to 0
//     const cgstNum = parseFloat(cgst) || 0;
//     const sgstNum = parseFloat(sgst) || 0;

//     // Calculate amount (taxable + cgst + sgst)
//     const amount = taxable + cgstNum + sgstNum;

//     // Update dynamic fields
//     setFormData((prevState) => ({
//       ...prevState,
//       taxable: taxable.toFixed(2),
//       amount: amount.toFixed(2),
//     }));
//   }, [formData.quantity, formData.rate, formData.discount, formData.cgst, formData.sgst]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSave = () => {
//     onSave(formData);
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
//         <button
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//           onClick={onClose}
//         >
//           X
//         </button>
//         <h2 className="text-2xl font-semibold mb-4">Edit Item</h2>
//         <form>
//           {/* Row 1 */}
//           <div className="flex space-x-4 mb-4">
//             <div className="w-1/2">
//               <label className="block text-gray-700">Description</label>
//               <input
//                 type="text"
//                 name="itemandDescription"
//                 value={formData.itemandDescription}
//                 readOnly
//                 className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//               />
//             </div>
//             <div className="w-1/2">
//               <label className="block text-gray-700">HSN/SAC</label>
//               <input
//                 type="text"
//                 name="hsnSac"
//                 value={formData.hsnSac}
//                 onChange={handleChange}
//                 // readOnly
//                 className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//               />
//             </div>
//           </div>

//           {/* Row 2 */}
//           <div className="flex space-x-4 mb-4">
//             <div className="w-1/3">
//               <label className="block text-gray-700">Quantity</label>
//               <input
//                 type="number"
//                 name="quantity"
//                 value={formData.quantity}
//                 onChange={handleChange}
//                 className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//               />
//             </div>
//             <div className="w-1/3">
//               <label className="block text-gray-700">Rate</label>
//               <input
//                 type="number"
//                 name="rate"
//                 value={formData.rate}
//                 onChange={handleChange}
//                 className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//               />
//             </div>
//             <div className="w-1/3">
//               <label className="block text-gray-700">Discount</label>
//               <input
//                 type="number"
//                 name="discount"
//                 value={formData.discount}
//                 onChange={handleChange}
//                 className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//               />
//             </div>
//           </div>

//           {/* Dynamic Fields Row */}
//           <div className="flex space-x-4 mb-4">
//             <div className="w-1/3">
//               <label className="block text-gray-700">Taxable</label>
//               <input
//                 type="number"
//                 name="taxable"
//                 value={formData.taxable}
//                 readOnly
//                 className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//               />
//             </div>
//             <div className="w-1/3">
//               <label className="block text-gray-700">CGST</label>
//               <input
//                 type="number"
//                 name="cgst"
//                 value={formData.cgst}
//                 onChange={handleChange} // Make this editable
//                 className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//               />
//             </div>
//             <div className="w-1/3">
//               <label className="block text-gray-700">SGST</label>
//               <input
//                 type="number"
//                 name="sgst"
//                 value={formData.sgst}
//                 onChange={handleChange} // Make this editable
//                 className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//               />
//             </div>
//           </div>

//           {/* Row 4 */}
//           <div className="flex space-x-4 mb-4">
//             <div className="w-full">
//               <label className="block text-gray-700">Amount</label>
//               <input
//                 type="number"
//                 name="amount"
//                 value={formData.amount}
//                 readOnly
//                 className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//               />
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={handleSave}
//             className="w-auto bg-lime-600 hover:bg-lime-700 text-white py-2 px-4 rounded"
//           >
//             Save
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditItemPopup;


import React, { useState, useEffect } from 'react';

const EditItemPopup = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ...item,
    quantity: item.quantity || 0,
    rate: item.rate || 0,
    discount: item.discount || 0,
    cgst: item.cgst || 0,
    sgst: item.sgst || 0,
  });

  const [calculatedValues, setCalculatedValues] = useState({
    taxable: '0.00',
    cgstAmount: '0.00',
    sgstAmount: '0.00',
    amount: '0.00',
  });

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      quantity: item.quantity || 0,
      rate: item.rate || 0,
      discount: item.discount || 0,
    }));
  }, [item]);

  useEffect(() => {
    const { rate, cgst, sgst, discount, quantity } = formData;
    const newValues = calculateAmounts(rate, cgst, sgst, discount, quantity);
    setCalculatedValues(newValues);
  }, [formData]);

  const calculateAmounts = (rate, cgst, sgst, discount, quantity) => {
    const validRate = parseFloat(rate) || 0;
    const validCgstRate = parseFloat(cgst) || 0; // GST percentages
    const validSgstRate = parseFloat(sgst) || 0;
    const validDiscount = parseFloat(discount) || 0;
    const validQuantity = parseFloat(quantity) || 1;

    const discountedRate = validRate - validDiscount;
    const taxable = (discountedRate * validQuantity).toFixed(2);

    // Calculate GST amounts based on percentages of taxable value
    const cgstAmount = ((validCgstRate / 100) * taxable).toFixed(2);
    const sgstAmount = ((validSgstRate / 100) * taxable).toFixed(2);
    const amount = (parseFloat(taxable) + parseFloat(cgstAmount) + parseFloat(sgstAmount)).toFixed(2);

    return { taxable, cgstAmount, sgstAmount, amount };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const updatedItem = {
      ...formData,
      ...calculatedValues,
    };
    
    onSave(updatedItem); // Ensure this updates the item in the itemList in the parent
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-2xl font-semibold mb-4">Edit Item</h2>
        <form>
          {/* Row 1 */}
       
            <div className="w-full">
              <label className="block text-gray-700">Description</label>
              <input
                type="text"
                name="itemandDescription"
                value={formData.itemandDescription}
                readOnly
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              />
            </div>
            <div className='flex items-center justify-between my-4 gap-4'>
            <div className="w-1/2">
              <label className="block text-gray-700">HSN/SAC</label>
              <input
                type="text"
                name="hsnSac"
                value={formData.hsnSac}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700">Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              />
            </div>
            </div>
         

          {/* Row 2 */}
          <div className='flex items-center justify-between my-4 gap-4'>
            <div className="w-full">
              <label className="block text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700">Rate</label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              />
            </div>
           
          </div>

          {/* Dynamic Fields Row */}
          <div className='flex items-center justify-between my-4 gap-4'>


          <div className="w-full">
              <label className="block text-gray-700">Discount</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700">CGST (%)</label>
              <input
                type="number"
                name="cgst"
                value={formData.cgst}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              />
            </div>
          </div>

          <div className='flex items-center justify-between my-4 gap-4'>

          <div className="w-full">
              <label className="block text-gray-700">SGST (%)</label>
              <input
                type="number"
                name="sgst"
                value={formData.sgst}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700">Total Amount (₹)</label>
              <input
                type="text"
                value={calculatedValues.amount}
                readOnly
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              />
            </div>
            </div>


        </form>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 hover:text-white px-4 py-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-lime-600 text-white rounded-md font-semibold hover:bg-lime-700 hover:text-white px-4 py-2"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditItemPopup;

