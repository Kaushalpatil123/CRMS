import React, { useState, useEffect, } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';

import { Button, Checkbox, FormControlLabel } from '@mui/material';
import EditAddress from './editAddress';
// import AddCustomer from './addCustomer';
// import SelectCustomer from './selectCustomer';
import ProductListPopup from './productListPopUp';
import { FaEllipsisV, FaEdit, FaTrash, FaTrashAlt } from 'react-icons/fa';
import EditItemPopup from './editItemPopUP';
import { fetchQuotationById, updateQuotationAPI } from 'pages/utils/quotations/api'; // Corrected import path
import { AiOutlineUpload } from 'react-icons/ai';
import BankDetailsComponent from '../bank/bank';
import toast, { Toaster } from 'react-hot-toast';
import {fetchBanks,fetchBankDetailsById,addBankDetails, deleteBankDetailsById} from 'pages/utils/bank/api'
import { fetchCustomerAddresses} from 'pages/utils/address/api';
import AdditemPopUp from '../invoice/AdditemPopUp';


const EditQuotation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("State--->",location.state)
  const [addresses,setAddresses]=useState([]);
  const { quotationId,quote } = location.state || {};
  // const [custId, setCustId] = useState(null);
  const custId=quote?.customer?._id;
  const [quotation, setQuotation] = useState({

    contactPerson: '',
    salesCredit: '',
    address: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      type: 'Home'
    },
    shippingAddress: '',
    reference: '',
    quotationDate: '',
    dueDate: '',
    ItemList: [],
    termsAndConditions: '',
    notes: '',
    bankDetails: '',
    totalAmountBeforeTax: 0,
    total: 0,
    grandTotal: 0,
    addExtraCharges: [], // Change to array of objects
    addDiscount: {
      itemName: "",
      percentage: 0,
      amount: 0
    },
    roundoff: "", // Store as a string
    status: "",
  });
  const [allBanks,setAllBanks]=useState([]);
  const [BankID,setBankID]=useState('');

  const [bankDetails, setBankDetails] = useState({});
  const handleOpenAddAddress = () => setOpenAddAddress(true);
  const handleCloseAddAddress = () => setOpenAddAddress(false);
  const handleExtraChargeInputChange = (e) => setExtraChargeInput(e.target.value);
  const handleDiscountInputChange = (e) => setDiscountInput(e.target.value);
  const [addExtraCharges, setAddExtraCharges] = useState(0);
  const [addDiscount, setAddDiscount] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);


  const [selectedBankIdd, setSelectedBankIdd] = useState(null);
  console.log("selectedBankIdd-------------------------------------------------------", selectedBankIdd)
  const [copyShippingAddress, setCopyShippingAddress] = useState(false);  // Initially checked
  const [isShippingEditMode, setIsShippingEditMode] = useState(false);
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [openProductPopup, setOpenProductPopup] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // Track which item is being edited
  const [NewBankID, setNewBankID] = useState('');


  const [showExtraChargePopup, setShowExtraChargePopup] = useState(false);
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  const [extraChargeInput, setExtraChargeInput] = useState({ itemName: '', percentage: 0, amount: 0 }); // Update state for extra charges
  const [discountInput, setDiscountInput] = useState({ itemName: '', percentage: 0, amount: 0 }); // Update state for discount
  const [applyRoundoff, setApplyRoundoff] = useState(false);
  const [editedShippingAddress, setEditedShippingAddress] = useState({
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    type: 'Home'
  });

  const handleOpenProductPopup = () => setOpenProductPopup(true);
  const handleCloseProductPopup = () => setOpenProductPopup(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = (index) => {
    setIsOpen(!isOpen === index ? null : index);
  };
  const [openEditItemPopup, setOpenEditItemPopup] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editedItemIndex, setEditedItemIndex] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedAddress, setEditedAddress] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  // const formatAddressToString = (address) => {
  //   return `${address.address1 || ''}, ${address.address2 || ''}, ${address.city || ''}, ${address.state || ''}, ${address.country || ''}, ${address.pincode || ''}`;
  // };
  const formatAddressToString = (address) => {
    return [
      address?.address1,
      address?.address2,
      address?.city,
      address?.state,
      address?.country,
      address?.pincode
  ].filter(Boolean).join(', ');
  };

  const getBanks = async () => {
    const response = await fetchBanks();
    
    setAllBanks(response)
    console.log(response,quotation)
//     if (particularInvoice?.bankDetails) {
//         const matchedBankId = response.filter(bank => bank._id === particularInvoice.bankDetails);
//         if(matchedBankId){
//         setSelectedBankId(matchedBankId);
//         }else{
//           setSelectedBankId('');
//         }
//  }

  if(quote?.bankDetails){
  const matchedBankId = response.find(bank => bank._id === quote.bankDetails);
  console.log(response);
  if(matchedBankId){
  setBankID(matchedBankId._id);
console.log("Bank--------------->",matchedBankId)
console.log("Bank id--------------->",BankID)
  }else{
    setBankID('');
  }
}


  



};
useEffect(() => {
  const getAddresses = async () => {
    if (custId) {
      try {
        const data = await fetchCustomerAddresses(custId);
        console.log("Adddata---->",data)
        setAddresses(data.addresses);
      } catch (error) {
        console.error('Error fetching customer addresses:', error);
      }
    }
  };

  getAddresses();
}, [custId]);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const data = await fetchQuotationById(quotationId);
        setSelectedBankIdd(data.bankDetails)
        const formatAddress = (address) => ({
          address1: address?.address1 || '',
          address2: address?.address2 || '',
          city: address?.city || '',
          state: address?.state || '',
          country: address?.country || '',
          pincode: address?.pincode || '',
          type: address?.type || 'Home'
        });

        const shippingAddress = data.shippingAddress
          ? (data.shippingAddress)
          : {
            address1: '',
            address2: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
          };

        const initialItemList = data.ItemList.map((item) => ({
          itemandDescription: item.itemandDescription || '',
          hsnSac: item.hsnSac || '',
          quantity: item.quantity || 1,
          unit: item.unit || 'Piece',
          rate: item.rate || 0,
          discount: item.discount || 0,
          taxable: item.taxable || 0, // Already provided by the API
          cgst: item.cgst || 0, // Already provided by the API
          sgst: item.sgst || 0, // Already provided by the API
          amount: item.amount || 0 // Already provided by the API
        }));

        // Use totals provided by the API
        const { totalAmountBeforeTax, total, grandTotal, roundoff } = data;

        setQuotation({
          customer: data.customer,
          contactPerson: data.contactPerson || '',
          salesCredit: data.salesCredit || '',
          address: formatAddress(data.address),
          shippingAddress,
          reference: data.reference || '',
          quotationDate: data.quotationDate,
          dueDate: data.dueDate,
          ItemList: initialItemList,
          termsAndConditions: data.termsAndConditions || '',
          notes: data.notes || '',
          // bankDetails: data.bankDetails || '',
          bankDetails: data.bankDetails || '',
          // totalAmountBeforeTax: parseFloat(totalAmountBeforeTax) || 0, // Ensure it's a number
          // total: parseFloat(total) || 0, // Ensure it's a number
          // grandTotal: parseFloat(grandTotal) || 0, // Ensure it's a number

          totalAmountBeforeTax: parseFloat(totalAmountBeforeTax) || 0, // Ensure it's a number
          total: parseFloat(total) || 0, // Ensure it's a number
          grandTotal: Math.round(parseFloat(grandTotal) || 0),
          addExtraCharges: data.addExtraCharges || [],
          addDiscount: data.addDiscount || {
            itemName: "",
            percentage: 0,
            amount: 0
          },
          roundoff: roundoff ? Math.round(roundoff) : '', // Show rounded roundoff
          quotationNo: data.quotationNo,
          status: data.status
        });

      } catch (error) {
        console.error('Error fetching quotation:', error);
      }
    };

    if (quotationId) {
      fetchQuotation();
    }
  }, [quotationId]);

  useEffect(()=>{
    console.log("selectedBankIdd--->",selectedBankIdd)
  }, [selectedBankIdd]) 

  const changeBankId = (id) => {
    setNewBankID(id)
    console.log("this is id from bank component=======>",id)
  }

 useEffect(()=>{
  console.log("Shipping--->",quotation.shippingAddress)
 },[])
  useEffect(() => {
    getBanks();
    }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the input field is a date input
    if (name === 'quotationDate' || name === 'dueDate') {
      // Format the date to dd-mm-yy
      const formattedDate = value.split('-').reverse().join('-');

      // Update the state with the formatted date
      setQuotation((prevState) => ({
        ...prevState,
        [name]: formattedDate
      }));
    } else {
      // For non-date fields, handle as normal
      setQuotation((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validate that address and shippingAddress are not empty

  //   if (!selectedAddress) {
  //     alert('Customer address is required');
  //     return; // Stop form submission if validation fails
  //   }
  //   console.log("ssetEditedShippingAddress--------", editedShippingAddress)


  //   // const addressSpilit = formatAddressToString(selectedAddress)
  //   // console.log("addressSpilit------------------>", addressSpilit)


  //   const formatAddress = (address) => {
  //     return `${address.address1 || ''}, ${address.address2 || ''}, ${address.city || ''}, ${address.state || ''}, ${address.country || ''}, ${address.pincode || ''}`;
  //   };

  //   const addressParts = selectedAddress.split(',').map(part => part.trim());

  //   console.log("selectedAddress------------------->:", typeof selectedAddress, selectedAddress);
  //   console.log("editedShippingAddress-------------->:", typeof editedShippingAddress, editedShippingAddress);


  //   console.log("addressPartsaddressPartsaddressParts", addressParts)

  //   const selectedAddressdetails = {
  //     address1: addressParts[0] || '',
  //     address2: addressParts[1] || '',
  //     city: addressParts[2] || '',
  //     state: addressParts[3] || '',
  //     country: addressParts[4] || '',
  //     pincode: addressParts[5] || '',
      
  //   };


  //   // Clean quotation object for submission
  //   const cleanQuotation = {
  //     customer: quotation.customer._id,
  //     contactPerson: quotation.contactPerson,
  //     salesCredit: quotation.salesCredit,
  //     // address: quotation.address,
  //     address:selectedAddressdetails,
  //     // shippingAddress: copyShippingAddress ? JSON.stringify(selectedAddress) : JSON.stringify( editedShippingAddress),
  //     shippingAddress: copyShippingAddress 
  //     ? selectedAddress
  //     : formatAddress(editedShippingAddress),
  //     // shippingAddress: quotation.shippingAddress,
  //     reference: quotation.reference,
  //     quotationDate: quotation.quotationDate,
  //     dueDate: quotation.dueDate,
  //     ItemList: quotation.ItemList.map((item) => ({
  //       itemandDescription: item.itemandDescription,
  //       hsnSac: item.hsnSac,
  //       quantity: item.quantity,
  //       unit: item.unit,
  //       rate: item.rate,
  //       discount: item.discount,
  //       taxable: item.taxable,
  //       cgst: item.cgst,
  //       sgst: item.sgst,
  //       amount: item.amount
  //     })),
  //     termsAndConditions: quotation.termsAndConditions,
  //     notes: quotation.notes,
  //     // bankDetails: quotation.bankDetails,
  //     bankDetails: selectedBankIdd,
  //     totalAmountBeforeTax: Number(quotation.totalAmountBeforeTax),
  //     total: Number(quotation.total),
  //     grandTotal: Number(quotation.grandTotal),
  //     addExtraCharges: Array.isArray(quotation.addExtraCharges) 
  //     ? quotation.addExtraCharges.map(({ itemName, percentage, amount }) => ({
  //         itemName,
  //         percentage,
  //         amount,
  //       }))
  //     : [],
    
  //   addDiscount: typeof quotation.addDiscount === 'object' ? quotation.addDiscount : {},
  //     roundoff: String(quotation.roundoff),
  //     status: quotation.status,
  //   };

  //   try {
  //     await updateQuotationById(quotationId, cleanQuotation);
  //     navigate('/apps/quote');
  //   } catch (error) {
  //     console.error('Error updating quotation:', error.response ? error.response.data : error);
  //   }
  // };
  

  // const updateQuotationById = async (quotationId, cleanQuotation) => {

  //   const addressParts = selectedAddress.split(',').map(part => part.trim());

  //   console.log("addressPartsaddressPartsaddressParts", addressParts)

  //   const selectedAddressdetails = {
  //     address1: addressParts[0] || '',
  //     address2: addressParts[1] || '',
  //     city: addressParts[2] || '',
  //     state: addressParts[3] || '',
  //     country: addressParts[4] || '',
  //     pincode: addressParts[5] || ''
  //   };

  //   console.log("Parsed Address Object:=========================================", selectedAddress);

  //   console.log("Clean Quotation Payload:", cleanQuotation);


  //   try {
  //     // Format the quotation object
  //     const formattedQuotation = {
  //       customer: cleanQuotation.customer, // Send customer ID
  //       contactPerson: cleanQuotation.contactPerson || '',
  //       salesCredit: cleanQuotation.salesCredit || '',

  //       address: selectedAddressdetails,
  //       shippingAddress:cleanQuotation.shippingAddress,

  //       reference: cleanQuotation.reference || '',
  //       quotationDate: cleanQuotation.quotationDate || '',
  //       dueDate: cleanQuotation.dueDate || '',
  //       ItemList: cleanQuotation.ItemList,
  //       termsAndConditions: cleanQuotation.termsAndConditions || '',
  //       notes: cleanQuotation.notes || '',
  //       bankDetails: cleanQuotation.bankDetails || '',
  //       totalAmountBeforeTax: cleanQuotation.totalAmountBeforeTax || 0,
  //       total: cleanQuotation.total || 0,
  //       grandTotal: cleanQuotation.grandTotal || 0,
  //       addExtraCharges: cleanQuotation.addExtraCharges,
  //       addDiscount: cleanQuotation.addDiscount,
  //       roundoff: cleanQuotation.roundoff || 0,
  //       // uploadFile: cleanQuotation.uploadFile || "", // Handle file uploads elsewhere
  //     };

  //     console.log('Formatted Quotation:', formattedQuotation);
  //     console.log('Formatted Quotation before API call:', JSON.stringify(formattedQuotation, null, 2));

      


  //     const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmU5MjQ4Y2RhNTAzOTgzYjM3NGFlNzUiLCJSb2xlIjoiQWRtaW4iLCJpYXQiOjE3Mjg5ODQ4MzEsImV4cCI6MTczMTU3NjgzMX0.IxFHDWXhx3t7fB7AT7eI2cObkDpcQOrJOmci8o-tZUA" ;

  //     // Call the API function
  //     const updatedQuotation = await updateQuotationAPI(quotationId, formattedQuotation, token);

  //     console.log('Quotation updated successfully', updatedQuotation);
  //     return updatedQuotation;
  //   } catch (error) {
  //     console.error('Error updating quotation:', error);
  //     throw error;
  //   }
  // };




const handleSubmit = async (e) => { 
  e.preventDefault();

  // if (!selectedAddress) {
  //   toast.error('Customer address is required');
  //   return; // Stop form submission if validation fails
  // }

  
  if (!quotation.status) {
    toast.error('Status is required');
    return; // Stop form submission if validation fails
  }

  if (!quotation.bankDetails) {
    toast.error('Bank selection is required');
    return; // Stop form submission if validation fails
  }

  const formatAddress = (address) => {
    return `${address.address1 || ''}, ${address.address2 || ''}, ${address.city || ''}, ${address.state || ''}, ${address.country || ''}, ${address.pincode || ''}`;
  };


  const addressToUse = selectedAddress ? selectedAddress : formatAddress(quotation.address);

  const addressParts = addressToUse.split(',').map(part => part.trim());

  // const addressParts = selectedAddress.split(',').map(part => part.trim());

  

  const selectedAddressdetails = {
    address1: addressParts[0] || '',
    address2: addressParts[1] || '',
    city: addressParts[2] || '',
    state: addressParts[3] || '',
    country: addressParts[4] || '',
    pincode: addressParts[5] || '',  
  };

  const cleanQuotation = {
    customer: quotation.customer._id,
    contactPerson: quotation.contactPerson,
    salesCredit: quotation.salesCredit,
    address: selectedAddressdetails,
    // shippingAddress: copyShippingAddress 
    //   ? selectedAddress 
    //   : formatAddress(editedShippingAddress),
      shippingAddress: copyShippingAddress 
      ? addressToUse 
      : formatAddress(editedShippingAddress),
    reference: quotation.reference,
    quotationDate: quotation.quotationDate,
    dueDate: quotation.dueDate,
    ItemList: quotation.ItemList.map((item) => ({
      itemandDescription: item.itemandDescription,
      hsnSac: item.hsnSac ? item.hsnSac : "N/A" ,
      quantity: item.quantity,
      unit: item.unit,
      rate: item.rate,
      discount: item.discount,
      taxable: item.taxable,
      cgst: item.cgst,
      sgst: item.sgst,
      amount: item.amount,
    })),
    termsAndConditions: quotation.termsAndConditions || "",
    notes: quotation.notes || "",
    // bankDetails: selectedBankIdd ? selectedBankIdd : quotation.bankDetails,
    bankDetails: NewBankID,
    totalAmountBeforeTax: Number(quotation.totalAmountBeforeTax),
    total: Number(quotation.total),
    grandTotal: Number(quotation.grandTotal),
    addExtraCharges: Array.isArray(quotation.addExtraCharges) 
      ? quotation.addExtraCharges.map(({ itemName, percentage, amount }) => ({
          itemName,
          percentage,
          amount,
        }))
      : [],
    addDiscount: typeof quotation.addDiscount === 'object' ? quotation.addDiscount : {},
    roundoff: String(quotation.roundoff),
    status: quotation?.status ? quotation?.status : "",

  };

  // Create a FormData object for multipart-formData
  const formData = new FormData();

  // Append each field to the FormData object
  // for (const key in cleanQuotation) {
  //   if (key === 'ItemList' || key === 'addExtraCharges') {
  //     // Convert arrays to JSON strings
  //     formData.append(key, JSON.stringify(cleanQuotation[key]));
  //   } else if (key === 'uploadFile' && cleanQuotation.uploadFile) {
  //     // Append file if exists
  //     formData.append(key, cleanQuotation.uploadFile);
  //   } else {
  //     // Append other fields
  //     formData.append(key, cleanQuotation[key]);
  //   }
  // }


  for (const key in cleanQuotation) {
    if (key === 'ItemList' || key === 'addExtraCharges') {
      // Convert arrays to JSON strings
      formData.append(key, JSON.stringify(cleanQuotation[key]));
    } else if (key === 'addDiscount' || key === 'address') {
      // Append JSON objects directly
      formData.append(key, JSON.stringify(cleanQuotation[key])); 
    } else {
      formData.append(key, cleanQuotation[key]);
    }
  }


  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase()); // Capitalizes the first letter of each word
  };


  try {
    await updateQuotationById(quotationId, formData);
    toast.success('Quotation updated successfully!');
    navigate('/apps/quote');
  

  } catch (err) {
    console.log(err)
    console.error('Error updating quotation:', err.response ? err.response.data : err);

    // Check for 'Quotation not found' error and show a toast
    // if (err.response && err.response.data.error === 'Quotation not found') {
    //   toast.error('Quotation not found');
    // } else {
    //   toast.error('An error occurred while updating the quotation');
    // }


    if (err.response && err.response.data.error) {
      // Display the exact error message from the backend
      toast.error(err.response.data.error);
      console.log(err.response.data.error);

    } else {
      toast.error('An error occurred while updating the quotation');
    }



  }
  

  
};

const updateQuotationById = async (quotationId, formData) => {
  try {
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmU5MjQ4Y2RhNTAzOTgzYjM3NGFlNzUiLCJSb2xlIjoiQWRtaW4iLCJpYXQiOjE3Mjg5ODQ4MzEsImV4cCI6MTczMTU3NjgzMX0.IxFHDWXhx3t7fB7AT7eI2cObkDpcQOrJOmci8o-tZUA" // Provide a valid token

    const token = localStorage.getItem('token'); // Ensure the token is stored under 'token' in localStorage

    if (!token) {
      throw new Error('Authorization token not found');
    }

    const updatedQuotation = await updateQuotationAPI(quotationId, formData, token);
    console.log('Quotation updated successfully', updatedQuotation);
    return updatedQuotation;
  } catch (error) {
    console.error('Error updating quotation:', error);
    throw error;
  }
};



  
  // // Function to update the quotation on the backend
  // const updateQuotation = async () => {
  //   const cleanQuotation = {
  //     ...quotation,
  //     ItemList: quotation.ItemList.map((item) => ({
  //       itemandDescription: item.itemandDescription,
  //       hsnSac: item.hsnSac,
  //       quantity: item.quantity,
  //       unit: item.unit,
  //       rate: item.rate,
  //       discount: item.discount,
  //       taxable: item.taxable,
  //       cgst: item.cgst,
  //       sgst: item.sgst,
  //       amount: item.amount
  //     }))
  //   };

  //   try {
  //     await updateQuotationById(quotationId, cleanQuotation);
  //     console.log('Quotation updated successfully');
  //   } catch (error) {
  //     console.error('Error updating quotation:', error.response ? error.response.data : error);
  //   }
  // };


  const calculateTotals = (itemList, addExtraCharges, addDiscount) => {
    if (!Array.isArray(itemList)) return {};
  
    // Calculate total before tax
    const totalBeforeTax = itemList.reduce((sum, item) => sum + parseFloat(item.taxable || 0), 0);
  
    // Calculate total GST (actual amount) based on taxable value and GST percentage
    const totalTax = itemList.reduce((sum, item) => {
      const taxable = parseFloat(item.taxable || 0);
      const cgstPercentage = parseFloat(item.cgst || 0);
      const sgstPercentage = parseFloat(item.sgst || 0);
  
      // Calculate GST amount as per percentage
      const cgstAmount = (taxable * cgstPercentage) / 100;
      const sgstAmount = (taxable * sgstPercentage) / 100;
  
      return sum + cgstAmount + sgstAmount; // Add actual GST amounts
    }, 0);
  
    // Calculate total amount (taxable + actual tax amount)
    const totalAmount = totalBeforeTax + totalTax;
  
    console.log('Total before tax----------->', totalBeforeTax);
    console.log('Total tax--------->', totalTax);
  
    // Calculate extra charges and discount
    const extraChargesTotal = addExtraCharges
      ? addExtraCharges.reduce((sum, charge) => sum + parseFloat(charge?.amount || 0), 0)
      : 0;
    const discountAmount = parseFloat(addDiscount?.amount || 0);

    
  
    // Calculate grand total (Total amount + Extra charges - Discount)
    const grandTotal = totalAmount + extraChargesTotal - discountAmount;
    const roundedGrandTotal = grandTotal;

    const roundoffValue = Math.floor(grandTotal);
  
    console.log('Grand total:-------->', grandTotal);
  
    return {
      totalAmountBeforeTax: totalBeforeTax.toFixed(2),
      total: totalAmount.toFixed(2),
      grandTotal: roundedGrandTotal.toFixed(2),
      roundoff: roundoffValue.toFixed(2),
      extraChargesTotal: extraChargesTotal.toFixed(2), // Add extra charges total
      discountAmount: discountAmount.toFixed(2),
    };
  };
  
  useEffect(() => {
    const totals = calculateTotals(quotation.ItemList, quotation.addExtraCharges, quotation.addDiscount);
  
    setQuotation((prevState) => ({
      ...prevState,
      totalAmountBeforeTax: totals.totalAmountBeforeTax,
      total: totals.total,
      grandTotal: totals.grandTotal,
      roundoff: totals.roundoff, // Update roundoff
      extraChargesTotal: totals.extraChargesTotal, // Update extra charges
      discountAmount: totals.discountAmount,
    }));
  }, [quotation.ItemList, quotation.addExtraCharges, quotation.addDiscount]);
  
  
  const handleSelectProduct = (product) => {
    const existingItemIndex = quotation.ItemList.findIndex(
      (item) => item.itemandDescription === `${product.itemname} - ${product.description}`
    );
  
    let updatedItemList;
  
    if (existingItemIndex !== -1) {
      // Update the existing item
      updatedItemList = quotation.ItemList.map((item, index) => {
        if (index === existingItemIndex) {
          const newQuantity = item.quantity + 1;
          const sellingPrice = parseFloat(item.rate) || 0;
          const discount = parseFloat(item.discount) || 0;
          const newTaxable = newQuantity * sellingPrice - discount;
  
          const cgstRate = parseFloat(item.cgstRate) || (product.gst / 2) || 0;
          const sgstRate = parseFloat(item.sgstRate) || (product.gst / 2) || 0;
  
          const newCgst = (newTaxable * cgstRate) / 100;
          const newSgst = (newTaxable * sgstRate) / 100;
          const newAmount = newTaxable + newCgst + newSgst;
  
          return {
            ...item,
            quantity: newQuantity,
            taxable: newTaxable,
            cgst: newCgst,
            sgst: newSgst,
            amount: newAmount,
          };
        }
        return item;
      });
    } else {
      // Add a new item
      const sellingPrice = parseFloat(product.sellingprice) || 0;
      const gst = parseFloat(product.gst/2) || 0;
  
      const newItem = {
        itemandDescription: `${product.itemname} - ${product.description}`,
        hsnSac: product.hsn ? product.hsn : "N/A" ,
        quantity: 1,
        unit: product.unit ? product.unit : "N/A",
        rate: sellingPrice,
        discount: 0,
        taxable: sellingPrice,
        cgstRate: (gst / 2).toFixed(2),
        sgstRate: (gst / 2).toFixed(2),
        cgst: (gst) ,
        sgst: (gst),
        amount: sellingPrice + (sellingPrice * (gst*2)) / 100,
      };
  
      updatedItemList = [...quotation.ItemList, newItem];
    }
  
    if (existingItemIndex === -1) {
      setQuotation((prevState) => ({
        ...prevState,
        ItemList: updatedItemList,
      }));
    } else {
      // Show a warning or popup message
      setPopupMessage('This product is already in the list!');
      setIsPopupVisible(true);
    }
  
    // Calculate totals after item list update
    const totals = calculateTotals(updatedItemList);
    
    setQuotation((prevState) => ({
      ...prevState,
      totalAmountBeforeTax: totals.totalAmountBeforeTax,
      total: totals.total,
      grandTotal: totals.grandTotal,
      roundoff: totals.roundoff, // Update roundoff
    }));
  };
   
  // Open Extra Charge Popup and Set Input


  const handleDiscountSubmit = (e) => {
    e.preventDefault();
    setQuotation(prev => ({
      ...prev,
      addDiscount: discountInput
    }));
    setDiscountInput({ itemName: '', percentage: 0, amount: 0 });
    setShowDiscountPopup(false);
  };


    // Open Discount Popup and Set Input
    const handleOpenDiscountPopup = () => {
      setDiscountInput(quotation.addDiscount || 0); // Pre-populate with existing value
      setShowDiscountPopup(true);
    };

  const handleDeleteItem = (index) => {
    const updatedItemList = quotation.ItemList.filter((_, i) => i !== index);
    setQuotation((prevState) => ({
      ...prevState,
      ItemList: updatedItemList
    }));
  };

  const handleEditItem = (item, index) => {
    setEditingItem(item);
    setEditedItemIndex(index);
    setOpenEditItemPopup(true);
  };

  const handleUpdateItem = async (updatedItem) => {
    const updatedItemList = quotation.ItemList.map((item, i) => {
      if (i === editedItemIndex) {
        return {
          ...item,
          ...updatedItem
        };
      }
      return item;
    });

    setQuotation((prevState) => ({
      ...prevState,
      ItemList: updatedItemList
    }));

    const cleanQuotation = {
      ...quotation,
      ItemList: updatedItemList.map((item) => ({
        itemandDescription: item.itemandDescription,
        hsnSac: item.hsnSac,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate,
        discount: item.discount,
        taxable: item.taxable,
        cgst: item.cgst,
        sgst: item.sgst,
        amount: item.amount
      }))
    };

    try {
      await updateQuotationById(quotationId, cleanQuotation);
    } catch (error) {
      console.error('Error updating quotation with edited item:', error.response ? error.response.data : error);
    }

    setOpenEditItemPopup(false);
  };

  // const handleEditChange = (e) => {
  //   setEditedAddress(e.target.value);
  // };

  const existingShippingAddress = {
    address1: '0',
    city: '',
    state: ''
  };

  const handleAddressUpdate = (updatedAddress) => {
    setQuotation((prevState) => ({
      ...prevState,
      address: updatedAddress,  // Update the full address object
    }));
    setOpenAddAddress(false);
  };

  const handleAddressChange = (e) => {
    const addressValue = e.target.value;
    console.log("addressValue", addressValue)
    setSelectedAddress(addressValue)
    setEditedAddress(addressValue)
  };

  

  // Handle checkbox change
  const handleAddressCheckboxChange = () => {
    setCopyShippingAddress((prev) => !prev);
    if (!copyShippingAddress) {
      // Reset shipping address when unchecking
      setEditedShippingAddress(formatAddressToString(quotation.shippingAddress));
    } else {
      // Copy billing address when checked
      setQuotation((prevState) => ({
        ...prevState,
        shippingAddress: formatAddressToString(prevState.address)
      }));
    }
  };

  const handleEditShippingClick = () => {
    const addressParts = quotation.shippingAddress.split(',');
 
    setEditedShippingAddress({
      address1: addressParts[0]?.trim() || '',
      address2: addressParts[1]?.trim() || '',
      city: addressParts[2]?.trim() || '',
      state: addressParts[3]?.trim() || '',
      country: addressParts[4]?.trim() || '',
      pincode: addressParts[5]?.trim() || '',
    });

    setIsShippingEditMode(true);
  };

  const handleShippingEditChange = (e) => {
    const { name, value } = e.target;
    setEditedShippingAddress((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // const handleSaveShippingAddress = () => {
  //   if (!editedShippingAddress.address1) {
  //     console.error('Address 1 is required');
  //     return; // Or show a notification to the user
  //   }

  //   const formattedAddress = [
  //     editedShippingAddress.address1 || '',
  //     editedShippingAddress.address2 || '',
  //     editedShippingAddress.city || '',
  //     editedShippingAddress.state || '',
  //     editedShippingAddress.country || '',
  //     editedShippingAddress.pincode || ''
  //   ].filter(Boolean).join(', ');

  //   setQuotation((prevState) => ({
  //     ...prevState,
  //     shippingAddress: formattedAddress
  //   }));
   
  //   setIsShippingEditMode(false); // Close modal after saving
  // };
  const handleSaveShippingAddress = () => {
    // Update the main quotation state
    setQuotation((prevState) => ({
      ...prevState,
      shippingAddress: formatAddressToString(editedShippingAddress), // Update with the new address
    }));

    // Close the modal
    setIsShippingEditMode(false);
  };

  useEffect(() => {
    if (isShippingEditMode) {
      setEditedShippingAddress({
        address1: quotation.shippingAddress.split(',')[0]?.trim() || '',
        address2: quotation.shippingAddress.split(',')[1]?.trim() || '',
        city: quotation.shippingAddress.split(',')[2]?.trim() || '',
        state: quotation.shippingAddress.split(',')[3]?.trim() || '',
        country: quotation.shippingAddress.split(',')[4]?.trim() || '',
        pincode: quotation.shippingAddress.split(',')[5]?.trim() || ''
      });
    }
  }, [isShippingEditMode, quotation.shippingAddress]);

  // To ensure the input value appears correctly when editing
  const formatForInput = (date) => {
    if (!date) return '';
    const parts = date.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // Revert to yyyy-mm-dd for input display
  };


  const handleEditChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from the event target
    setEditedAddress((prev) => ({
        ...prev,
        [name]: value // Update the specific property based on the input's name
    }));
};

const handleEditClick = () => {
    setEditedAddress({
        address1: quotation.address.address1 || '',
        address2: quotation.address.address2 || '',
        city: quotation.address.city || '',
        state: quotation.address.state || '',
        country: quotation.address.country || '',
        pincode: quotation.address.pincode || ''
    });
    setIsEditMode(true);
};

const handleSaveAddress = () => {
    setQuotation((prevState) => ({
        ...prevState,
        address: {
            ...prevState.address,
            ...editedAddress // Merge editedAddress into the existing address
        }
    }));
    setIsEditMode(false);
};

 

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    // Check if scrolled down, set isScrolling state
    setIsScrolling(scrollTop > 0);



  };


  const handleOpenExtraChargePopup = () => {
    setExtraChargeInput(quotation.addExtraCharges || 0); // Pre-populate with existing value
    setShowExtraChargePopup(true);
  };



  const handleExtraChargeSubmit = (e) => {
    e.preventDefault();
  
    // Validate input before submitting
    if (extraChargeInput.itemName && extraChargeInput.amount >= 0) {
      setQuotation(prev => {
        const updatedCharges = [...prev.addExtraCharges];
  
        if (isEditing && editIndex !== null) {
          // Update the existing charge at editIndex
          updatedCharges[editIndex] = {
            itemName: extraChargeInput.itemName,
            percentage: extraChargeInput.percentage,
            amount: extraChargeInput.amount,
          };
        } else {
          // Add a new charge if not editing
          updatedCharges.push({
            itemName: extraChargeInput.itemName,
            percentage: extraChargeInput.percentage,
            amount: extraChargeInput.amount,
          });
        }
  
        return {
          ...prev,
          addExtraCharges: updatedCharges,
        };
      });
  
      // Reset the input fields and editing states
      setExtraChargeInput({ itemName: '', percentage: 0, amount: 0 });
      setIsEditing(false); // Reset editing mode
      setEditIndex(null);   // Reset edit index
      // setShowExtraChargePopup(false);
    } else {
      // Handle validation error, show message to the user
      console.error('Invalid extra charge input');
    }
  };
  





  const updateExtraCharge = (index, newAmount) => {
    setQuotation((prevState) => {
      const updatedExtraCharges = [...prevState.addExtraCharges];
      updatedExtraCharges[index].amount = newAmount; // Update the amount
      return {
        ...prevState,
        addExtraCharges: updatedExtraCharges,
      };
    });
  };

  const deleteExtraCharge = (index) => {
    setQuotation((prevState) => {
      const updatedExtraCharges = prevState.addExtraCharges.filter((_, i) => i !== index); // Filter out the charge at the given index
      return {
        ...prevState,
        addExtraCharges: updatedExtraCharges,
      };
    });
  };

  const handleEditExtraCharge = (index) => {
    const selectedCharge = quotation.addExtraCharges[index];
    if (selectedCharge) {  // Ensure the selected charge exists
      setExtraChargeInput(selectedCharge);
      setEditIndex(index);
      setIsEditing(true); // Set editing state
      setShowExtraChargePopup(true);
    } else {
      console.error("Selected charge does not exist.");
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        <main className="flex-1 p-2 font-poppins">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold mb-4">Edit Quotation</h1>
            <div className="space-x-2">
              <Button
                className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white font-poppins p-2"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>

              <Button
                className="bg-lime-600 rounded-md text-white font-semibold hover:bg-lime-700 hover:text-white font-poppins p-2"
                onClick={handleSubmit}
              >
                Save
              </Button>
            </div>
          </div>
          <section className="space-y-4">
            <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
              <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
              <div className='flex items-center  w-auto'>
              <div className="w-auto">
                <div className="w-auto">
                  <div className="mr-4 ">
                    <label className='text-sm font-medium'
                    >
                      Customer Name:
                    </label>

                    <input
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-auto p-2.5"
                      id="customer"
                      value={`${quotation?.customer?.firstName || ''} ${quotation?.customer?.lastName || ''}`}
                      // Display customer name only customer name payload me nahi jana chaiye
                      placeholder="Customer Name"
                      readOnly
                    />
                  </div>
                  {/* <div className="flex items-center space-x-2">
                            
                                <Button
                                 
                                    className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white font-poppins p-2.5 "
                                    onClick={handleOpenSelectCustomer}> 
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        className="h-4 w-4"
                                    >
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.3-4.3"></path>
                                    </svg>
                                </Button>
                                <Button
                                   
                                    className="bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 hover:text-white font-poppins  p-2.5 "
                                  
                                     onClick={handleOpenAddCustomer}> 
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        className="h-4 w-4"
                                    >
                                        <path d="M5 12h14"></path>
                                        <path d="M12 5v14"></path>
                                    </svg>
                                </Button>
                            </div> */}
                </div>
                {/* <div>
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="copyFrom"
                            >
                                Copy from :
                            </label>
                            <div className="relative">
                                <select
                                    id="copyFrom"
                                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                                >
                                    <option value="none">None</option>
                                    <option value="option1">Option 1</option>
                                    <option value="option2">Option 2</option>
                                    <option value="option3">Option 3</option>
                                </select>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-chevron-down h-4 w-4 opacity-50 absolute top-1/2 right-1 transform -translate-y-1/2 pointer-events-none"
                                    aria-hidden="true"
                                >
                                    <path d="m6 9 6 6 6-6"></path>
                                </svg>
                            </div>
                        </div> */}
              </div>

              
              <div className="my-4">
                  <label
                    className="text-sm font-medium"
                    for="Quotation"
                  >
                    Quotation No.
                  </label><br />
                  <input
                    // className='text-sm w-auto font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 border border-1 border-gray-200 p-3 rounded-md'
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-auto p-2.5"


                    value={quotation.quotationNo} // Display customer name only customer name payload me nahi jana chaiye

                    readOnly
                  />
                </div>
                </div>
              {/* <SelectCustomer open={openSelectCustomer} handleClose={handleCloseSelectCustomer}  onCustomerSelect={handleCustomerSelect} /> */}
              {/* <AddCustomer open={openAddCustomer} handleClose={handleCloseAddCustomer} /> */}
            </div>
            <div className='grid grid-cols-[60%,40%] gap-4 pr-4'>
              <div className="rounded-md border bg-white text-card-foreground shadow-sm w-[100%] p-4">
                <h2 className="text-2xl font-semibold mb-4">Party Details</h2>

                <div className="grid grid-cols-2 gap-4">
                  {/* Contact Person */}
                  <div>
                    <label className="text-sm font-medium" htmlFor="contactPerson">
                      Contact Person:
                    </label>
                    <input
                      // className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:red-orange-700 block w-full p-2.5"
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                      id="contactPerson"
                      placeholder="Contact Person"
                      name="contactPerson"
                      value={quotation.contactPerson}
                      onChange={handleChange}
                    />
                  </div>
                 

                  {/* Sales Credit */}
                  {/* <div>
                    <label className="text-sm font-medium" htmlFor="salesCredit">
                      Sales Credit:
                    </label>
                    <div className="relative">
                      <select
                        id="salesCredit"
                        // className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 block w-full p-2.5"
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                        name="salesCredit"
                        value={quotation.salesCredit || 'none'}
                        onChange={handleChange}
                      >
                        <option value="none">Select Sales Credit</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>

                    </div>
                  </div> */}

                 {/* Address Selection */}


               {/* Address Selection */}
<div className="col-span-2">
  <div className="">
    {/* Dropdown for selecting address */}
    <div className='flex items-center justify-between gap-3'>
    <div className="w-[90%]">
      
      <label className="text-sm font-medium" htmlFor="address">
        Customer Address:
      </label>
      {console.log("===========================", selectedAddress)}
    
      <select
        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-500 focus:outline-none focus:border-red-500 block w-full p-2.5"
        name="address"
        value={selectedAddress}
        onChange={handleAddressChange}
        required
      >
        {/* <option value="">Select Customer Address</option> */}
        <option value={formatAddressToString(quotation.address)}>{formatAddressToString(quotation.address)}</option>
        {/* <option value={selectedAddress}>{selectedAddress}</option> */}
        {addresses &&
                addresses.map((address) => (
                  <option key={address._id} value={address._id}>
                    {formatAddressToString(address)}
                  </option>
                ))}
        {/* <option value={selectedAddress}>{selectedAddress}</option> */}
      </select>

      </div>

      <div className='mt-5 w-[10%]' >
            <Button
              // className="bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 w-full p-2"
              className="bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 hover:text-white font-inter  p-2.5 "

              onClick={() => setOpenAddAddress(true)}
            >
             <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M5 12h14"></path>
                        <path d="M12 5v14"></path>
                      </svg>
            </Button>
          </div>
          </div>
    

    {/* Show textarea and checkbox only if an address is selected */}
   
      <>
        {/* Textarea displaying the selected address */}
        <div className="relative w-full mt-4">
          <label className="text-sm font-medium" htmlFor="displayAddress">
            Selected Address:
          </label>
          <textarea
      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
      name="displayAddress"
      value={formatAddressToString(quotation.address)} // Ensure the updated address is displayed
      onChange={(e) => console.log("Textarea change detected")} // Debug if it's rerendering
      readOnly
    />
          {/* Edit icon */}
          <button className="absolute top-8 right-2 text-red-600 hover:text-red-700" onClick={handleEditClick}>
            <FaEdit className="" size={22} />
          </button>
        </div>

        {/* Add Address Button */}
        <div className="flex items-center col-span-2 justify-between w-[50%]">
         

          {/* Checkbox for copying shipping address */}
          <div>
            <div className="col-span-2 flex items-center mt-2">
              <input
                type="checkbox"
                checked={copyShippingAddress}
                onChange={handleAddressCheckboxChange}
                className="h-5 w-5 text-red-600 bg-gray-100 border-red-600 rounded-md focus:ring-red-500  accent-red-600 cursor-pointer "
              />
              <span className="text-gray-800 mx-2">Same as Billing address</span>
            </div>
          </div>
        </div>

        {/* Show shipping address textarea only if the checkbox is not checked */}
        {!copyShippingAddress && (
          <div className="relative w-full mt-4">
            <label className="text-sm font-medium" htmlFor="shippingAddress">
              Shipping Address:
            </label>
            <textarea
              className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              name="displayShippingAddress"
              //value={formatAddressToString(quotation.shippingAddress)}
              // value={quote.shippingAddress || formatAddressToString(quotation.shippingAddress)} // Use formatted shipping address
              //  // Use formatted shipping address
              // readOnly
              value={quotation.shippingAddress} // Use formatted shipping address
        //onChange={handleAddressChange}  
            />
            {/* Edit icon */}
            <button className="absolute top-8 right-2 text-red-600 hover:text-red-700" onClick={handleEditShippingClick}>
              <FaEdit size={22} />
            </button>
          </div>
        )}
      </>
  
  </div>
</div>









</div>


                {/* Address Edit Popup */}
                <EditAddress open={openAddAddress} handleClose={() => setOpenAddAddress(false)} handleAddressUpdate={handleAddressUpdate} />
              </div>
              <div className='w-[100%] grid grid-cols-1 gap-4 '>
              <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4 " data-v0-t="card">

                <h2 className="text-2xl font-semibold mb-4">Document Details</h2>


                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="reference"
                    >
                      Reference or Reference No. :
                    </label>
                    <input
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                      id="reference"
                      placeholder="Reference"
                      name="reference"
                      value={quotation.reference}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='flex items-center justify-between gap-4'>
                    <div className='w-full'>
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="orderDate"
                      >
                        Quotation Date :
                      </label>
                      <input
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                        id="quotationDate"
                        type="date"
                        name="quotationDate"
                        value={formatForInput(quotation.quotationDate)} // Format the value back to yyyy-mm-dd
                        onChange={handleChange}
                      />
                    </div>
                    <div className='w-full'>
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="dueDate"
                      >
                        Due Date :
                      </label>
                      <input
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                        id="dueDate"
                        type="date"
                        name="dueDate"
                        value={formatForInput(quotation.dueDate)} // Format the value back to yyyy-mm-dd
                        onChange={handleChange}
                        min={quotation.quotationDate}
                      />
                    </div>
                  </div>
                </div>
              </div>


              <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
              <h2 className="text-2xl font-semibold mb-4">Terms &amp; Conditions</h2>
              {/* <Button className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-poppins">
                        + Add Term / Condition
                    </Button> */}
              <textarea
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                placeholder="Terms & Conditions"
                name="termsAndConditions"
                value={quotation.termsAndConditions}
                onChange={handleChange}
              ></textarea>
            </div>
             
             
              </div>


            </div>
            <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
            <h2 className="text-2xl font-semibold mb-4">Item List</h2>
              <div className="relative  w-full max-h-[400px] overflow-y-auto" onScroll={handleScroll}>
                <table className="w-full caption-bottom text-sm border-separate border-spacing-0">
                  <thead className={`sticky top-0  transition-colors duration-200 ${isScrolling ? 'bg-lime-300 text-red-600' : ''
                    }`}>
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-10 px-4 text-center align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        No.
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        Item &amp; Description
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        HSN/SAC
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        Quantity
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        Unit
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        Rate(₹)
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        Discount(₹)
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        Taxable(₹)
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        CGST(%)
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        SGST(%)
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        Amount(₹)
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&amp;_tr:last-child]:border-b transition-colors hover:bg-muted/50">
                    {quotation.ItemList.map((item, index) => (
                      <tr key={index} className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">{index + 1}</td>
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">{item.itemandDescription}</td>
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">{item.hsnSac}</td>
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">
                          {' '}
                          <div class="mt-auto flex items-center gap-3">
                            <span class="font-bold text-sm leading-[18px]">{item.quantity}</span>
                          </div>
                        </td>
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">{item.unit}</td>
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">{item.rate}</td>
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">{item.discount}</td>
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">{item.taxable}</td>
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">{item.cgst}</td>
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">{item.sgst}</td>
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">{item.amount}</td>

                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">
                          <div className="flex items-center">
                            <button
                              className="flex items-center w-auto px-2 py-2 text-red-600 hover:bg-red-200 focus:outline-none"
                              onClick={() => handleDeleteItem(index)}
                            >
                              <FaTrash className="" size={16} />
                            </button>

                            <button
                              className="flex items-center w-auto px-2 py-2 text-lime-600 hover:bg-lime-200 focus:outline-none"
                              onClick={() => handleEditItem(item, index)}
                            >
                              <FaEdit className="" size={16} />
                            </button>
                          </div>

                          <div className="relative">
                            {/* Button */}

                            {/* <button onClick={() => toggleMenu(index)} className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none">
                              <FaEllipsisV size={20} />
                            </button> */}

                            {/* Popup Menu */}
                            {/* {isOpen === index && (
                              <div
                                ref={menuRef}
                                className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200"
                              >
                                <ul className="py-1">
                                  <li>
                                    <button
                                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
                                      onClick={() => handleEditItem(item, index)}
                                    >
                                      <FaEdit className="mr-2" /> Edit
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
                                      onClick={() => handleDeleteItem(index)}
                                    >
                                      <FaTrash className="mr-2" /> Delete
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )} */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <Button
                  className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-poppins"
                  onClick={handleOpenProductPopup}
                >
                  Add Item
                </Button>
              </div>
              <ProductListPopup open={openProductPopup} onClose={handleCloseProductPopup} onSelectProduct={handleSelectProduct} />
            </div>

           
            <div className="grid grid-cols-[64%,34%] gap-6">
              <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                <h2 className="text-2xl font-semibold mb-4">Notes</h2>
                <textarea
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  placeholder="Notes"
                  name="notes"
                  value={quotation.notes}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                <h2 className="text-2xl font-semibold mb-4">Status</h2>
                <select
                  id="status"
                  name="status"
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5 cursor-pointer"
                  value={quotation.status}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

            </div>
            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                <h2 className="text-2xl font-semibold mb-4">Bank Details</h2>

                <div>
                  {/* <label className="text-sm font-medium leading-none" htmlFor="uploadFile">
          Upload File :
      </label> */}
                  {/* <div className="flex items-center mt-2">
                    <input
                      type="file"
                      id="uploadFile"
                      className="hidden"
                      onChange={(e) => {
                        const fileInput = e.target.files[0];
                        console.log("Selected File:", fileInput);
                        // You can add any additional state handling for the file here if needed
                      }}
                    />
                    <label htmlFor="uploadFile" className="cursor-pointer">
                      <div className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                        <AiOutlineUpload />
                        <span>Upload File</span>
                      </div>
                    </label>
                  </div> */}

                  {/* <BankDetailsComponent
    setBankDetails={(bank) => setQuotation({ ...quotation, bankDetails: bank })} // Set the fetched bank details
    setSelectedBankIdd={setSelectedBankIdd}
    quotationId={quotationId} // Pass quotationId to fetch the specific bank details
/> */}


                  {/* <BankDetailsComponent
                    // matchedId={BankID}
                    setBankDetails={setBankDetails}
                    setSelectedBankIdd={setSelectedBankIdd}
                    BankIdd={selectedBankIdd}

                    // quotation={quotation} // Pass the entire quotation object if needed
                  /> */}
                  <BankDetailsComponent
                  setBankDetails={bankDetails}
                  BankIdd={selectedBankIdd}
                  changeBankId={changeBankId}
                  // matchedId={selectedBankIdd}
                />


                </div>
              </div>

              <div className="rounded-md border bg-white text-gray-800 shadow-sm p-4">
                <h2 className="text-2xl font-semibold mb-4">Total</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Amount before Tax :</span>
                    <span>₹ {Number(quotation.totalAmountBeforeTax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount :</span>
                    <span>₹ {Number(quotation.total || 0).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between ">
                  <span>Extra Charges :</span>
                  <span>₹ {Number(quotation.extraChargesTotal|| 0).toFixed(0)}</span> {/* Show rounded roundoff */}
                </div>

                  <div className="flex justify-between font-bold">
                    <span>Grand Total :</span>
                    <span>₹ {Number(quotation.grandTotal || 0).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Roundoff :</span>
                  <span>₹ {Number(quotation.roundoff || 0).toFixed(0)}</span> {/* Show rounded roundoff */}
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    className="bg-red-600 rounded-md text-white px-4 py-2 font-semibold hover:bg-red-700 transition duration-300 ease-in-out"
                    onClick={handleOpenExtraChargePopup}

                  >
                    + Add Extra Charge
                  </button>

                  {/* <button
                    className="bg-red-600 rounded-md text-white px-4 py-2 font-semibold hover:bg-red-700 transition duration-300 ease-in-out"
                    onClick={handleOpenDiscountPopup}
                  >
                    + Add Discount
                  </button> */}


                  {/* <button type="button" onClick={() => setShowExtraChargePopup(true)}>Add Extra Charge</button>
                  <button type="button" onClick={() => setShowDiscountPopup(true)}>Add Discount</button> */}
                </div>
              </div>
            </div>
          </section>
          <div className="mt-4 space-x-2">
            <Button
              className="bg-lime-600 text-white rounded-md font-semibold hover:bg-lime-700 hover:text-white font-poppins p-2 "
              onClick={handleSubmit}
            >
              Save
            </Button>
            {/* <Button className="bg-lime-600 text-white rounded-md font-semibold hover:bg-lime-700 hover:text-white font-poppins p-2 ">
                    Save & Enter Another
                </Button> */}
          </div>
        </main>



        {showExtraChargePopup && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-semibold text-center mb-4">Extra Charges</h2>
      
      {/* Display List of Extra Charges */}
      <div className="overflow-y-auto mb-4 max-h-[150px] border border-gray-300 rounded-md p-2">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="py-2 px-4 border-b font-bold">Item Name</th>
              <th className="py-2 px-4 border-b font-bold">Amount ₹</th>
              <th className="py-2 px-4 border-b font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotation.addExtraCharges.map((charge, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="text-center py-2 text-gray-800">{charge.itemName ? charge.itemName : "N/A"}</td>
                <td className="text-center py-2 text-gray-800">
                  {charge.amount ? charge.amount : 0}
                
                
                </td>
                <td className="text-center py-2">
                  <button
                   onClick={() => handleEditExtraCharge(index)}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteExtraCharge(index)}
                    className="text-red-600 hover:underline"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form to Add New Extra Charge */}
      <div className="border-t mt-4 pt-4">
        <h2 className="text-lg font-semibold text-center">Add Extra Charge</h2>
        <form onSubmit={handleExtraChargeSubmit}>
          <label className="block text-gray-700 mt-2">Item Name</label>
          <input
            className="bg-white border border-gray-300 text-gray-800 my-2 rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
            type="text"
            name="itemName"
            value={extraChargeInput.itemName}
            onChange={(e) => setExtraChargeInput({ ...extraChargeInput, itemName: e.target.value })}
            placeholder="Enter item name"
            required
          />
          
          <label className="block text-gray-700 mt-2">Amount</label>
          <input
            className="bg-white border border-gray-300 text-gray-800 my-2 rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
            type="number"
            name="amount"
            value={extraChargeInput.amount}
            onChange={(e) => setExtraChargeInput({ ...extraChargeInput, amount: parseFloat(e.target.value) })}
            placeholder="Enter amount"
            required
          />

          {/* Action Buttons */}
          <div className="flex justify-center mt-4">
            <button
              className="bg-lime-600 rounded-md text-white p-2 font-semibold hover:bg-lime-700 w-28"
              type="submit"
            >
              {isEditing ? "Save" : "Add"}
            </button>
            <button
              onClick={() => setShowExtraChargePopup(false)}
              className="bg-red-600 rounded-md text-white p-2 font-semibold hover:bg-red-700 w-28 ml-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}




        {showDiscountPopup && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-lg">

              <h2 className="text-lg font-semibold">Add Discount</h2>

              <form onSubmit={handleDiscountSubmit}>
                <label>Item Name:</label>
                <input
                  className="bg-white input-field border border-gray-300 text-gray-800 my-2 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-auto p-2.5"

                  type="text"
                  name="itemName"
                  value={discountInput.itemName}
                  onChange={(e) => setDiscountInput({ ...discountInput, itemName: e.target.value })}
                />
                {/* <label>Percentage:</label>
                <input
                  className="bg-white input-field border border-gray-300 text-gray-800 my-2 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-auto p-2.5"

                  type="number"
                  name="percentage"
                  value={discountInput.percentage}
                  onChange={(e) => setDiscountInput({ ...discountInput, percentage: parseFloat(e.target.value) })}
                /> */}
                <label>Amount:</label>
                <input
                  className="bg-white input-field border border-gray-300 text-gray-800 my-2 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-auto p-2.5"

                  type="number"
                  name="amount"
                  value={discountInput.amount}
                  onChange={(e) => setDiscountInput({ ...discountInput, amount: parseFloat(e.target.value) })}
                />
                <button
                  className="bg-lime-600 rounded-md text-white p-2 mr-2 btn-submit font-semibold hover:bg-lime-700 hover:text-white font-inter mt-2 px-4"
                  type="submit">Add</button>
                <button
                  className="bg-red-600 rounded-md text-white p-2 mr-2 btn-submit font-semibold hover:bg-red-700 hover:text-white font-inter mt-2 px-4"

                  onClick={() => setShowDiscountPopup(false)}>Cancel</button>
              </form>
            </div>
          </div>


        )}







        {/* Modal/Popup for editing the address */}
        {isEditMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
            <div className="bg-white p-8 w-1/3 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Edit Address</h3>
              <div className='my-2'>
                <label className="text-sm font-medium">Address 1:</label>
                <input
                  type="text"
                  name="address1"
                  value={editedAddress.address1}
                  onChange={handleEditChange}
                  className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                // className="block w-full border p-2 mb-2 bg-white"
                />
              </div>
              <div className='my-3'>
                <label className="text-sm font-medium">Address 2:</label>
                <input
                  type="text"
                  name="address2"
                  value={editedAddress.address2}
                  onChange={handleEditChange}
                  className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='my-3'>
                  <label className="text-sm font-medium">City:</label>
                  <input
                    type="text"
                    name="city"
                    value={editedAddress.city}
                    onChange={handleEditChange}
                    className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                  />
                </div>
                <div className='my-2'>
                  <label className="text-sm font-medium">State:</label>
                  <input
                    type="text"
                    name="state"
                    value={editedAddress.state}
                    onChange={handleEditChange}
                    className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                  />
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <div className='my-2'>
                  <label className="text-sm font-medium">Country:</label>
                  <input
                    type="text"
                    name="country"
                    value={editedAddress.country}
                    onChange={handleEditChange}
                    className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                  />
                </div >
                <div className='my-2'>
                  <label className="text-sm font-medium">Pincode:</label>
                  <input
                    type="text"
                    name="pincode"
                    value={editedAddress.pincode}
                    onChange={handleEditChange}
                    className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                  />
                </div>
              </div >
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  className="bg-red-600 rounded-md text-white p-2 px-3 font-semibold hover:bg-red-700 w-auto hover:text-white font-poppins mt-2"

                  onClick={() => setIsEditMode(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-lime-600 rounded-md text-white p-2 px-3 font-semibold hover:bg-lime-700 w-auto  hover:text-white font-poppins mt-2"

                  onClick={handleSaveAddress}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}



{/* 
        {openEditItemPopup && <EditItemPopup item={editingItem} onClose={() => setOpenEditItemPopup(false)} onSave={handleUpdateItem} />}

           */}
         {openEditItemPopup && (
                  <AdditemPopUp
            open={openEditItemPopup}      
            item={editingItem}
            onClose={() => setOpenEditItemPopup(false)}
         
            onSave={handleUpdateItem}
        
                  />
                )}

        {isPopupVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-auto max-w-lg p-6 text-center">
              <h1 className="text-xl font-semibold text-black mb-4">Duplicate Product</h1>
              <h2 className="text-red-600 mb-6">{popupMessage}</h2>
              <button
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={closePopup}
              >
                Close
              </button>
            </div>
          </div>
        )}



        {isShippingEditMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 w-1/3 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold">Edit Shipping Address</h3>
                <button
                  className="text-red-600 hover:text-red-700"
                  onClick={() => setIsShippingEditMode(false)} // Close modal
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className='my-2'>
                <label className="text-sm font-medium">Address 1:</label>
                <input
                  type="text"
                  name="address1"
                  value={editedShippingAddress.address1}
                  onChange={handleShippingEditChange}
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md block w-full p-2.5"
                />
              </div>

              <div className='my-3'>
                <label className="text-sm font-medium">Address 2:</label>
                <input
                  type="text"
                  name="address2"
                  value={editedShippingAddress.address2}
                  onChange={handleShippingEditChange}
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md block w-full p-2.5"
                />
              </div>
              <div className='flex items-center justify-between'>

                <div className='my-2'>
                  <label className="text-sm font-medium">Country:</label>
                  <input
                    type="text"
                    name="country"
                    value={editedShippingAddress.country}
                    onChange={handleShippingEditChange}
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md block w-full p-2.5"
                  />
                </div>

                <div className='my-2'>
                  <label className="text-sm font-medium">State:</label>
                  <input
                    type="text"
                    name="state"
                    value={editedShippingAddress.state}
                    onChange={handleShippingEditChange}
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md block w-full p-2.5"
                  />
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='my-3'>
                  <label className="text-sm font-medium">City:</label>
                  <input
                    type="text"
                    name="city"
                    value={editedShippingAddress.city}
                    onChange={handleShippingEditChange}
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md block w-full p-2.5"
                  />
                </div>

                <div className='my-3'>
                  <label className="text-sm font-medium">Pincode:</label>
                  <input
                    type="text"
                    name="pincode"
                    value={editedShippingAddress.pincode}
                    onChange={handleShippingEditChange}
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md block w-full p-2.5"
                  />
                </div>

              </div>

              <div className='mt-4 flex justify-end'>
                <button
                  className="bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 w-20 p-2"
                  onClick={handleSaveShippingAddress}
                >
                  Save
                </button>

              </div>
            </div>
          </div>
        )}




<Toaster position="top-right" reverseOrder={false} />

      </div>
    </>
  );
};

export default EditQuotation;
