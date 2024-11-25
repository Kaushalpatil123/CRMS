// import React, { useEffect } from 'react';
// import { useState } from 'react';

// import 'react-toastify/dist/ReactToastify.css';
// // material-ui
// import InputAdornment from '@mui/material/InputAdornment';
// import IconButton from '@mui/material/IconButton';
// import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
// import { Search, Save } from '@mui/icons-material';
// import {
//   Autocomplete,
//   Box,
//   Button,
//   Divider,
//   FormControl,
//   FormHelperText,
//   Grid,
//   InputLabel,
//   MenuItem,
//   Select,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControlLabel,
//   FormGroup,
//   Checkbox,
//   Paper,
//   Tooltip,
//   List,
//   ListItem,
//   ListItemText
// } from '@mui/material';

// // third-party
// import { v4 as UIDV4 } from 'uuid';

// // project-imports

// // assets
// import { Add, Additem, Edit } from 'iconsax-react';
// import { display, padding } from '@mui/system';
// import { getAllProducts } from '../../utils/invoices/api';



// export default function AdditemPopUp({ item, onClose, onSave }) {
//   console.log('Item details-->', item);

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
//     const taxable = quantityNum * rateNum - discountNum;

//     // Use user-entered CGST and SGST values or default to 0
//     const cgstNum = parseFloat(cgst) || 0;
//     const sgstNum = parseFloat(sgst) || 0;

//     // Calculate amount (taxable + cgst + sgst)
//     const amount = taxable + cgstNum + sgstNum;

//     // Update dynamic fields
//     setFormData((prevState) => ({
//       ...prevState,
//       taxable: taxable.toFixed(2),
//       amount: amount.toFixed(2)
//     }));
//   }, [formData.quantity, formData.rate, formData.discount, formData.cgst, formData.sgst]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleSave = () => {
//     onSave(formData);
//   };
 

//   return (
//     <>
//       <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { width: '90%', maxWidth: '800px' } }}>
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
//             <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
//               X
//             </button>
//             <h2 className="text-2xl font-semibold mb-4">Edit Item</h2>
//             <form>
//               <div className="flex space-x-4 mb-4">
//                 <div className="w-1/2">
//                   <label className="block text-gray-700">Description</label>
//                   <input
//                     type="text"
//                     value={formData.itemandDescription}
//                     name="itemandDescription"
//                     onChange={handleChange}
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//                 <div className="w-1/2">
//                   <label className="block text-gray-700">HSN/SAC</label>
//                   <input
//                     type="text"
//                     name="hsnSac"
//                     value={formData.hsnSac}
//                     onChange={handleChange}
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//               </div>

//               <div className="flex space-x-4 mb-4">
//                 <div className="w-1/3">
//                   <label className="block text-gray-700">Quantity</label>
//                   <input
//                     type="number"
//                     name="quantity"
//                     value={formData.quantity}
//                     onChange={handleChange}
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//                 <div className="w-1/3">
//                   <label className="block text-gray-700">Rate</label>
//                   <input
//                     type="number"
//                     name="rate"
//                     value={formData.rate}
//                     onChange={handleChange}
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//                 <div className="w-1/3">
//                   <label className="block text-gray-700">Discount</label>
//                   <input
//                     type="number"
//                     name="discount"
//                     value={formData.discount}
//                     onChange={handleChange}
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//               </div>

//               <div className="flex space-x-4 mb-4">
//                 <div className="w-1/3">
//                   <label className="block text-gray-700">Taxable</label>
//                   <input
//                     type="number"
//                     name="taxable"
//                     value={formData.taxable}
//                     readOnly
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//                 <div className="w-1/3">
//                   <label className="block text-gray-700">CGST</label>
//                   <input
//                     type="number"
//                     name="cgst"
//                     value={formData.cgst}
//                     onChange={handleChange} // Make this editable
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//                 <div className="w-1/3">
//                   <label className="block text-gray-700">SGST</label>
//                   <input
//                     type="number"
//                     name="sgst"
//                     value={formData.sgst}
//                     onChange={handleChange} // Make this editable
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//               </div>

//               <div className="flex space-x-4 mb-4">
//                 <div className="w-full">
//                   <label className="block text-gray-700">Amount</label>
//                   <input
//                     type="number"
//                     name="amount"
//                     value={formData.amount}
//                     readOnly
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//               </div>

//               <button type="button" onClick={handleSave} className="w-auto bg-lime-600 hover:bg-lime-700 text-white py-2 px-4 rounded">
//                 Save
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* <DialogTitle sx={{ borderBottom: '2px solid #f0f0f0' }}>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography className="text-2xl font-semibold mb-4">Add Billing Item</Typography>
//             <IconButton onClick={handleClose} className="text-red-600">
//               <CloseOutlinedIcon />
//             </IconButton>
//           </Box>
//         </DialogTitle> */}

//         {/* <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Item"
//                 variant="outlined"
//                 value={itemDetails?.itemandDescription}
//                 name="itemandDescription"
//                 onChange={handleChange}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         size="small"
//                         className="mr-2 text-green-900 border border-[#C7DBA0] bg-[#C7DBA0] hover:bg-[#779E40] rounded-sm font-inter py-0.5"
//                         onClick={handleSearchClick}
//                       >
//                         <Search />
//                       </IconButton>
//                       <IconButton
//                         size="small"
//                         className="text-green-900 border border-[#C7DBA0] bg-[#C7DBA0] hover:bg-[#779E40] rounded-sm font-inter py-0.5"
//                       >
//                         <Add />
//                       </IconButton>
//                     </InputAdornment>
//                   )
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography
//                 className="inline-block text-green-900 border border-[#C7DBA0] bg-[#C7DBA0] hover:bg-[#779E40] rounded-sm font-inter py-0.5 cursor-pointer underline"
//                 onClick={() => setShowDiscription((prev) => !prev)}
//               >
//                 + Add Description
//               </Typography>
//             </Grid>

//             {showDiscription && (
//               <Grid item xs={12}>
//                 <TextField fullWidth multiline rows={3} label="Description" variant="outlined" name="description" />
//               </Grid>
//             )}

//             <Grid item xs={12} sm={4}>
//               <TextField
//                 fullWidth
//                 label="Quantity"
//                 type="number"
//                 variant="outlined"
//                 name="quantity"
//                 value={editItem.quantity}
//                 onChange={handleChange}
//                 InputProps={{
//                   style: { height: '35px', borderRadius: '3px' }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel>Select unit</InputLabel>
//                 <Select
//                   label="Select unit"
//                   value={editItem.unit || ''}
//                   name="unit"
//                   onChange={(e) => handleChange(e)}
//                   style={{ height: '35px', borderRadius: '3px' }}
//                 >
//                   {unitArray &&
//                     unitArray.map((unit) => (
//                       <MenuItem key={unit} value={unit}>
//                         {unit}
//                       </MenuItem>
//                     ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={4}>
//               <TextField
//                 fullWidth
//                 label="Rate"
//                 type="number"
//                 variant="outlined"
//                 value={editItem.rate}
//                 name="rate"
//                 onChange={handleChange}
//                 InputProps={{
//                   startAdornment: <InputAdornment position="start">₹</InputAdornment>,
//                   endAdornment: <InputAdornment position="end">{editItem.unit || ''}</InputAdornment>,
//                   style: { height: '35px', borderRadius: '3px' }
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Discount"
//                 type="number"
//                 variant="outlined"
//                 name="discount"
//                 value={editItem.discount}
//                 onChange={handleChange}
//                 InputProps={{
//                   startAdornment: <InputAdornment position="start">₹</InputAdornment>,
//                   endAdornment: <Typography>{discountPercent}%</Typography>,
//                   style: { height: '35px', borderRadius: '3px' }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Lead Time"
//                 variant="outlined"
//                 InputProps={{
//                   style: { height: '35px', borderRadius: '3px' }
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="HSN/SAC"
//                 variant="outlined"
//                 value={editItem.hsnSac}
//                 name="hsnSac"
//                 onChange={handleChange}
//                 InputProps={{
//                   style: { height: '35px', borderRadius: '3px' }
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="GST(in %)"
//                 type="number"
//                 variant="outlined"
//                 name="gst"
//                 value={editItem.gst}
//                 onChange={handleChange}
//                 InputProps={{
//                   endAdornment: <InputAdornment position="end">%</InputAdornment>,
//                   style: { height: '35px', borderRadius: '3px' }
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
//               <Paper
//                 elevation={2}
//                 className="w-[45%] p-2 flex items-center text-green-900 border bg-[#C7DBA0] rounded-md font-inter py-1.5"
//               >
//                 <Typography variant="subtitle1">Taxable: ₹ {editItem.taxable}</Typography>
//               </Paper>
//               <Paper
//                 elevation={2}
//                 className="w-[45%] p-2 flex items-center text-green-900 border bg-[#C7DBA0] rounded-md font-inter py-1.5"
//               >
//                 <Typography variant="subtitle1">Amount: ₹{editItem.amount}</Typography>
//               </Paper>
//             </Grid>
//           </Grid>
//         </DialogContent> */}

//         {/* <DialogActions sx={{ justifyContent: 'space-between', p: 2, borderTop: '1px solid #f0f0f0' }}>
//           <Button
//             onClick={handleSave}
//             variant="contained"
//             className="text-white border border-[#C7DBA0] bg-[#779E40] hover:bg-green-900 rounded-md font-inter"
//           >
//             Save
//           </Button>
//           <Button
//             onClick={handleClose}
//             variant="outlined"
//             className="text-green-900 border border-green-900 hover:bg-[#779E40] hover:text-white hover:border-white rounded-md font-inter"
//           >
//             Cancel
//           </Button>
//         </DialogActions> */}
//       </Dialog>

//       {/* <Dialog open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         fullWidth maxWidth="sm">
//         <DialogTitle>Select a Product</DialogTitle>
//         <DialogContent>
//           {loading ? (
//             <Typography>Loading products...</Typography>
//           ) : (
//             <List>
//               {products.map((product) => (
//                 <ListItem button key={product._id} onClick={() => handleProductSelect(product)}>
//                   <ListItemText primary={product.itemname} secondary={product.description} />
//                 </ListItem>
//               ))}
//             </List>
//           )}
//         </DialogContent>
//         <Button onClick={() => setOpenDialog(false)}>Close</Button>
//       </Dialog> */}
//     </>
//   );
// }

// import React, { useEffect, useState } from 'react';
// import {
//   Dialog,
//   InputAdornment,
//   TextField,
//   Button,
// } from '@mui/material';

// export default function AdditemPopUp({ item, onClose, onSave }) {
//   const [formData, setFormData] = useState({
//     ...item,
//     quantity: item.quantity || 0,
//     rate: item.rate || 0,
//     discount: item.discount || 0,
//     taxable: item.taxable || 0,
//     gst: item.gst || 0, // Added GST field
//     amount: item.amount || 0
//   });

//   useEffect(() => {
//     setFormData((prevState) => ({
//       ...prevState,
//       quantity: item.quantity || 0,
//       rate: item.rate || 0,
//       discount: item.discount || 0,
//       gst: item.gst || 0 // Initialize GST if needed
//     }));
//   }, [item]);

//   // Update dynamic fields based on user input
//   useEffect(() => {
//     const { quantity, rate, discount, gst } = formData;

//     // Ensure values are numbers
//     const quantityNum = parseFloat(quantity) || 0;
//     const rateNum = parseFloat(rate) || 0;
//     const discountNum = parseFloat(discount) || 0;
//     const gstNum = parseFloat(gst) || 0;

//     // Calculate taxable value (quantity * rate - discount)
//     const taxable = quantityNum * rateNum - discountNum;

//     // Calculate CGST and SGST as half of GST applied to the taxable amount
//     const cgst = ((gstNum / 2) / 100) * taxable;
//     const sgst = ((gstNum / 2) / 100) * taxable;

//     // Calculate amount (taxable + cgst + sgst)
//     const amount = taxable + cgst + sgst;

//     // Update dynamic fields
//     setFormData((prevState) => ({
//       ...prevState,
//       taxable: taxable.toFixed(2),
//       cgst: cgst.toFixed(2),
//       sgst: sgst.toFixed(2),
//       amount: amount.toFixed(2)
//     }));
//   }, [formData.quantity, formData.rate, formData.discount, formData.gst]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleSave = () => {
//     onSave(formData);
//   };

//   return (
//     <>
//       <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { width: '90%', maxWidth: '800px' } }}>
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
//             <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
//               X
//             </button>
//             <h2 className="text-2xl font-semibold mb-4">Edit Item</h2>
//             <form>
//               <div className="flex space-x-4 mb-4">
//                 <div className="w-1/2">
//                   <label className="block text-gray-700">Description</label>
//                   <input
//                     type="text"
//                     value={formData.itemandDescription}
//                     name="itemandDescription"
//                     onChange={handleChange}
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//                 <div className="w-1/2">
//                   <label className="block text-gray-700">HSN/SAC</label>
//                   <input
//                     type="text"
//                     name="hsnSac"
//                     value={formData.hsnSac}
//                     onChange={handleChange}
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//               </div>

//               <div className="flex space-x-4 mb-4">
//                 <div className="w-1/3">
//                   <label className="block text-gray-700">Quantity</label>
//                   <input
//                     type="number"
//                     name="quantity"
//                     value={formData.quantity}
//                     onChange={handleChange}
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//                 <div className="w-1/3">
//                   <label className="block text-gray-700">Rate</label>
//                   <input
//                     type="number"
//                     name="rate"
//                     value={formData.rate}
//                     onChange={handleChange}
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//                 <div className="w-1/3">
//                   <label className="block text-gray-700">Discount</label>
//                   <input
//                     type="number"
//                     name="discount"
//                     value={formData.discount}
//                     onChange={handleChange}
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//               </div>

//               <div className="flex space-x-4 mb-4">
//                 <div className="w-1/3">
//                   <label className="block text-gray-700">Taxable</label>
//                   <input
//                     type="number"
//                     name="taxable"
//                     value={formData.taxable}
//                     readOnly
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//                 <div className="w-1/3">
//                   <label className="block text-gray-700">GST (%)</label>
//                   <input
//                     type="number"
//                     name="gst"
//                     value={formData.gst}
//                     onChange={handleChange}
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//                 <div className="w-1/3">
//                   <label className="block text-gray-700">Amount</label>
//                   <input
//                     type="number"
//                     name="amount"
//                     value={formData.amount}
//                     readOnly
//                     className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
//                   />
//                 </div>
//               </div>

//               <button type="button" onClick={handleSave} className="w-auto bg-lime-600 hover:bg-lime-700 text-white py-2 px-4 rounded">
//                 Save
//               </button>
//             </form>
//           </div>
//         </div>
//       </Dialog>
//     </>
//   );
// }


import React, { useEffect, useState } from 'react';
import {
  Dialog,
  InputAdornment,
  TextField,
  Button,
  Select,
  MenuItem,
} from '@mui/material';

export default function AdditemPopUp({ item, onClose, onSave }) {
  const unitArray = ["Piece", "kg", "liter"]; 

  const [formData, setFormData] = useState({
    ...item,
    quantity: item.quantity || 1,
    rate: item.rate || 0,
    discount: item.discount || 0,
    taxable: item.taxable || 0,
    gst: item.gst || 0, // Added GST field
    amount: item.amount || 0,
    unit: item.unit || unitArray[0] // Default to first unit if not set
  });

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      quantity: item.quantity || 0,
      rate: item.rate || 0,
      discount: item.discount || 0,
      gst: item.gst || 0,
      unit: item.unit || unitArray[0]
    }));
  }, [item]);

  // Update dynamic fields based on user input
  useEffect(() => {
    const { quantity, rate, discount, gst } = formData;

    // Ensure values are numbers
    const quantityNum = parseFloat(quantity) || 0;
    const rateNum = parseFloat(rate) || 0;
    const discountNum = parseFloat(discount) || 0;
    const gstNum = parseFloat(gst) || 0;

    // Calculate taxable value (quantity * rate - discount)
    const taxable = quantityNum * rateNum - discountNum;

    // Calculate CGST and SGST as half of GST applied to the taxable amount
    // const cgst = ((gstNum / 2) / 100) * taxable;
    // const sgst = ((gstNum / 2) / 100) * taxable;
    const cgst = (gstNum / 2);
    const sgst = (gstNum / 2);

    // Calculate amount (taxable + cgst + sgst)
    const amount = taxable + (gstNum/100)*taxable;

    // Update dynamic fields
    setFormData((prevState) => ({
      ...prevState,
      taxable: taxable.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      amount: amount.toFixed(2)
    }));
  }, [formData.quantity, formData.rate, formData.discount, formData.gst]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUnitChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      unit: event.target.value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { width: '90%', maxWidth: '800px' } }}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
              X
            </button>
            <h2 className="text-2xl font-semibold mb-4">Edit Item</h2>
            <form>
              {/* Full width for Description */}
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  value={formData.itemandDescription}
                  name="itemandDescription"
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                />
              </div>

              <div className="flex space-x-4 mb-4">
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
                  <Select
                    value={formData.unit}
                    onChange={handleUnitChange}
                    displayEmpty
                    style={{ height: '45px',}}
                    className="flex items-center bg-white border border-gray-300 hover:border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 w-full p-2.5"
                    // inputProps={{
                    //   style: {
                    //     padding: '8px 10px', // Adjust padding to match the input element
                    //   },
                    // }}
                  >
                    {unitArray.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex space-x-4 mb-4">
                <div className="w-1/3">
                  <label className="block text-gray-700">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-gray-700">Rate</label>
                  <input
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-gray-700">Discount</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mb-4">
                <div className="w-1/3">
                  <label className="block text-gray-700">Taxable</label>
                  <input
                    type="number"
                    name="taxable"
                    value={formData.taxable}
                    readOnly
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-gray-700">GST (%)</label>
                  <input
                    type="number"
                    name="gst"
                    value={formData.gst}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-gray-700">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    readOnly
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  />
                </div>
              </div>
              <div className='flex justify-end gap-3'>
              <button type="button" onClick={handleClose} className="w-auto border border-red-600 py-2 px-4 rounded text-red-600">
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="w-auto bg-lime-600 hover:bg-lime-700 text-white py-2 px-4 rounded">
                Save
              </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
}
