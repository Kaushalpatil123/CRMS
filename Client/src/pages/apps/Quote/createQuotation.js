import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import AddCustomer from './addCustomer';
import SelectCustomer from './selectCustomer';
import EditAddress from './addressForCreateQuotation';
import ProductListPopup from './productListPopForCreateQuotation';
import { AiOutlineUpload } from 'react-icons/ai';
import { FaEdit, FaTrash, FaTrashAlt } from 'react-icons/fa';
import { createQuotation } from 'pages/utils/quotations/api';
import ObjectId from 'bson-objectid';
import EditItemPopup from './editItemForCreate';
import AdditemPopUp from '../invoice/AdditemPopUp';

import BankDetailsComponent from 'pages/apps/bank/bank';
import { Modal } from '@mui/material';
import { fetchCustomerAddresses, getAddressById } from 'pages/utils/address/api';
import toast, { Toaster } from 'react-hot-toast';


const CreateQuotation = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [salesCredit, setSalesCredit] = useState('');
  const [address, setAddress] = useState({
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    type: 'Home'
  });
  const [reference, setReference] = useState('');
  const [quotationDate, setQuotationDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [itemList, setItemList] = useState([]);
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [notes, setNotes] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [selectedBankId, setSelectedBankId] = useState('');
  const [extraChargesTotal, setExtraChargesTotal] = useState("0");
  const [discountAmount, setDiscountAmount] = useState(0);


  const [totalAmountBeforeTax, setTotalAmountBeforeTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [uploadFile, setUploadFile] = useState(null);
  const [status, setStatus] = useState("")


  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [editAddress, setEditAddress] = useState({}); // For editing address
  const [newAddress, setNewAddress] = useState({}); // For adding a new address
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);




  const [extraCharges, setExtraCharges] = useState([]); // Add this line
  const [extraChargeInput, setExtraChargeInput] = useState({ itemName: "", percentage: 0, amount: 0 });
  // const [addExtraCharges, setAddExtraCharges] = useState([]);
  // const [extraChargesTotal, setExtraChargesTotal] = useState(0);
  const [showExtraChargePopup, setShowExtraChargePopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track if editing
  const [currentChargeId, setCurrentChargeId] = useState(null); 

  // State for modals
  const [openAddCustomer, setOpenAddCustomer] = useState(false);
  const [openSelectCustomer, setOpenSelectCustomer] = useState(false);
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [openProductListPopup, setOpenProductListPopup] = useState(false);
  // const [showExtraChargePopup, setShowExtraChargePopup] = useState(false);
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  // const [extraChargeInput, setExtraChargeInput] = useState(0);
  const [discountInput, setDiscountInput] = useState(0);

  const [editItem, setEditItem] = useState(null); // State to track the item being edited
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSameAsBilling, setIsSameAsBilling] = useState(true); // For checkbox state
  const [showEditShippingModal, setShowEditShippingModal] = useState(false);
  const [editShippingAddress, setEditShippingAddress] = useState({});

  const [isRoundOffEnabled, setIsRoundOffEnabled] = useState(false); 
  const [addExtraCharges, setAddExtraCharges] = useState([{ itemName: '', percentage: 0, amount: 0, _id: '' }]);
  const [addDiscount, setAddDiscount] = useState({ itemName: '', percentage: 0, amount: 0 });

  const [roundoff, setRoundoff] = useState(0);


  // Modal handlers
  const handleOpenAddCustomer = () => setOpenAddCustomer(true);
  const handleCloseAddCustomer = () => setOpenAddCustomer(false);
  const handleOpenSelectCustomer = () => setOpenSelectCustomer(true);
  const handleCloseSelectCustomer = () => setOpenSelectCustomer(false);
  const handleOpenAddAddress = () => setOpenAddAddress(true);
  const handleCloseAddAddress = () => setOpenAddAddress(false);
  const handleOpenProductListPopup = () => setOpenProductListPopup(true);
  const handleCloseProductListPopup = () => setOpenProductListPopup(false);


  console.log("selectedBankIdselectedBankIdselectedBankIdselectedBankId", selectedBankId)
  


  useEffect(() => {
    console.log('Updated extra charges:', addExtraCharges);
  }, [addExtraCharges]);

  useEffect(() => {
    console.log('Updated discount:', addDiscount);
  }, [addDiscount]);


  const handleSubmit = async () => {
    console.log('Selected customer ID---------------->', selectedCustomerId);

    if (!selectedCustomerId === null) {
      console.error('Customer ID is required--------------->');
      return;
    }

    if (!selectedCustomerId) {
      toast.error('Customer is required ');
      return;
    }
  
    if (!contactPerson) {
      toast.error('Contact person is required');
      return;
    }

    if (!reference) {
      toast.error('reference is required');
      return;
    }
  
    if (!quotationDate) {
      toast.error('Quotation date is required');
      return;
    }
  
    if (!dueDate) {
      toast.error('Due date is required');
      return;
    }
  
    
  
    if (!selectedBankId) {
      toast.error('Bank details are required');
      return;
    }



    if (!address) {
      toast.error('address is required');
      return;
    }


    if (!Array.isArray(itemList) || itemList.length === 0) {
      toast.error('At least one item is required in the item list');
      return;
    }

    
    if (!status) {
      toast.error('status is required');
      return;
    }


    // if (!termsAndConditions) {
    //   toast.error('termsAndConditions is required');
    //   return;
    // }

    // if (!notes) {
    //   toast.error('notes is required');
    //   return;
    // }
    
  
    // Format the dates
    const formattedQuotationDate = quotationDate ? formatDateToDDMMYYYY(quotationDate) : formatDateToDDMMYYYY(new Date());
    const formattedDueDate = dueDate ? formatDateToDDMMYYYY(dueDate) : formatDateToDDMMYYYY(new Date());

    // Correctly structure the billingAddress
    const billingAddress = {
      address1: selectedAddress?.address1 || '',
      address2: selectedAddress?.address2 || '',
      city: selectedAddress?.city || '',
      state: selectedAddress?.state || '',
      country: selectedAddress?.country || '',
      pincode: selectedAddress?.pincode || '',
      type: selectedAddress?.type || 'Home',
    };


    if (!billingAddress.address1 || !billingAddress.city || !billingAddress.state || !billingAddress.country) {
      console.error('Billing address is required--------------->');
      toast.error('Billing address is required!');
      return;
    }

    // Format the shipping address correctly
    const formatShippingAddress = () => {
      if (shippingAddress && typeof shippingAddress === 'object') {
        const { address1, address2, city, state, country, pincode } = shippingAddress;
        return `${address1 || ''}, ${address2 || ''}, ${city || ''}, ${state || ''}, ${country || ''}, ${pincode || ''}`.trim();
      }
      return ''; // Return empty string if shippingAddress is not properly set
    };

    // Ensure valid item list and discount object
    const validItemList = Array.isArray(itemList) && itemList.length > 0 ? itemList : [];

    const validAddDiscount = typeof addDiscount === 'object'
      && addDiscount !== null ? addDiscount : {};

    // Ensure addExtraCharges is an array of objects

    const validAddExtraCharges = Array.isArray(addExtraCharges) && addExtraCharges.length > 0
      ? addExtraCharges.map((charge) => ({
        itemName: charge.itemName || 'Extra Charge',
        percentage: charge.percentage || 0,
        amount: charge.amount || 0,
        _id: ObjectId.isValid(charge._id) ? charge._id : new ObjectId().toString(), // Ensure valid ObjectId
      }))
      : [];




    const payload = {
      customer: selectedCustomerId,
      contactPerson: contactPerson || '',
      salesCredit: salesCredit === 'Yes' || salesCredit === 'No' ? salesCredit : 'No',
      address: JSON.stringify(billingAddress),
      shippingAddress: formatShippingAddress(shippingAddress),
      reference: reference || '',
      quotationDate: formattedQuotationDate,
      dueDate: formattedDueDate,
      ItemList: JSON.stringify(validItemList),
      termsAndConditions: termsAndConditions ? termsAndConditions : "not available",
      notes: notes ? notes : "not available",
      // bankDetails: typeof bankDetails === 'object' ? JSON.stringify(bankDetails) : bankDetails,
      bankDetails: selectedBankId,
      totalAmountBeforeTax: parseFloat(totalAmountBeforeTax) || 0,
      total: parseFloat(total) || 0,
      grandTotal: parseFloat(grandTotal) || 0,
      // roundoff: isRoundOffEnabled ? roundoff.toString() : '',  // Set roundoff as a string only if enabled
      roundoff: parseFloat(roundoff) || 0,
      addExtraCharges: JSON.stringify(validAddExtraCharges),  // Serialize to a JSON string
      addDiscount: JSON.stringify({
        itemName: validAddDiscount.itemName || 'Discount',
        percentage: validAddDiscount.percentage || 0,
        amount: validAddDiscount.amount || 0,
      }),
      status: status || '',
    };

    console.log('Payload being sent-------------->:', payload);

    try {
      const result = await createQuotation(payload, uploadFile);
      console.log('Quotation created:', result);
      navigate('/apps/quote');
    } catch (error) {
      toast.error('Failed to create quotation');
      console.error('Failed to create quotation:', error);
    }
  };

  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    setSelectedCustomerId(customer.customerId);
    setSelectedCustomerName(customer.customerName);
    handleCloseSelectCustomer();
  };
  

  const handleExtraChargeInputChange = (e) => {
    const { name, value } = e.target;
    setExtraChargeInput((prev) => ({ ...prev, [name]: value }));
  };

  const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

  const handleExtraChargeSubmit = () => {


    if (!extraChargeInput.itemName || parseFloat(extraChargeInput.amount) <= 0) {
      return; // Do not proceed if inputs are invalid
    }
    const newCharge = {
      itemName: extraChargeInput.itemName || "Extra Charge",
      percentage: parseFloat(extraChargeInput.percentage) || 0,
      amount: parseFloat(extraChargeInput.amount) || 0,
       _id: isEditing ? currentChargeId : generateId(), // Use current ID if editing
    };
  
    if (isEditing) {
      setAddExtraCharges((prevCharges) =>
        prevCharges.map((charge) => (charge._id === currentChargeId ? newCharge : charge))
      );
      setIsEditing(false); // Reset editing state
      setCurrentChargeId(null); // Reset current charge ID
    } else {
      setAddExtraCharges((prevCharges) => [...prevCharges, newCharge]);
    }
  
    setExtraChargeInput({ itemName: "", percentage: 0, amount: 0 }); // Clear inputs
    // setShowExtraChargePopup(false);
    updateTotals(); // Recalculate totals after adding/updating the extra charge
  };
  

  const handleDeleteExtraCharge = (id) => {
    setAddExtraCharges((prevCharges) => prevCharges.filter((charge) => charge._id !== id));
    updateTotals(); // Recalculate totals after deletion
  };

  const handleEditExtraCharge = (id) => {
    const chargeToEdit = addExtraCharges.find((charge) => charge._id === id);
    if (chargeToEdit) {
      setExtraChargeInput({
        itemName: chargeToEdit.itemName,
        percentage: chargeToEdit.percentage,
        amount: chargeToEdit.amount,
      });
      setIsEditing(true);
      setCurrentChargeId(id); // Store the ID of the charge being edited
      setShowExtraChargePopup(true); // Open popup for editing
    }
  };



  const handleDiscountSubmit = () => {
    const newDiscount = {
      itemName: discountInput.itemName || "Discount",
      percentage: parseFloat(discountInput.percentage) || 0,
      amount: parseFloat(discountInput.amount) || 0,
    };

    setAddDiscount(newDiscount); // Update discount state directly
    setDiscountInput({ itemName: "", percentage: 0, amount: 0 }); // Reset input field
    setShowDiscountPopup(false);
    updateTotals(); // Recalculate totals after setting the discount
  };

  const handleDiscountInputChange = (e) => {
    const { name, value } = e.target;
    setDiscountInput((prev) => ({ ...prev, [name]: value }));
  };



  // Helper function to format the date to dd-mm-yyyy
  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleOpenEditPopup = (item) => {
    setSelectedItem(item);
    setOpenEditPopup(true);
  };

  const handleCloseEditPopup = () => {
    setOpenEditPopup(false);
    setSelectedItem(null);
  };

  const handleSaveEditedItem = (editedItem) => {
    setItemList((prevItemList) =>
      prevItemList.map((item) =>
        item._id === editedItem._id ? editedItem : item
      )
    );
    updateTotals(); 
    setOpenEditPopup(false); // Ensure totals are updated after saving the edited item
  };


  const updateTotals = () => {
    const totalBeforeTax = itemList.reduce((sum, item) => sum + parseFloat(item.taxable), 0);
  
    // Total GST from the item list
    // const totalGST = itemList.reduce((sum, item) => {
    //   const validRate = parseFloat(item.rate) || 0;
    //   const validDiscount = parseFloat(item.discount) || 0;
    //   const validQuantity = parseFloat(item.quantity) || 1;
    //   const validGst = (parseFloat(item.cgst) + parseFloat(item.sgst)) || 0; // Combine CGST and SGST
  
    //   return sum + ((validRate - validDiscount) * (validGst / 100) * validQuantity);
    // }, 0);
    const totalTax = itemList.reduce((sum, item) => {
      const taxable = parseFloat(item.taxable || 0);
      const cgstPercentage = parseFloat(item.cgst || 0);
      const sgstPercentage = parseFloat(item.sgst || 0);
  
      // Calculate GST amount as per percentage
      const cgstAmount = (taxable * cgstPercentage) / 100;
      const sgstAmount = (taxable * sgstPercentage) / 100;
  
      return sum + cgstAmount + sgstAmount; // Add actual GST amounts
    }, 0);
  
    const totalAmount = totalBeforeTax + totalTax;
  
    // Sum extra charges
    // const extraChargesTotal = addExtraCharges.reduce((sum, charge) => sum + parseFloat(charge.amount), 0);

    const calculatedExtraChargesTotal = addExtraCharges.reduce((sum, charge) => sum + parseFloat(charge.amount), 0);
    setExtraChargesTotal(calculatedExtraChargesTotal.toFixed(2));

    const calculatedDiscountAmount = parseFloat(addDiscount.amount) || 0;
    setDiscountAmount(calculatedDiscountAmount.toFixed(2));

  
    // Deduct discount
    // const discountAmount = parseFloat(addDiscount.amount) || 0;
  
    // Calculate grand total
    const grandTotal = totalAmount + calculatedExtraChargesTotal -  calculatedDiscountAmount;
  
    // Round the grand total to the nearest integer
    const roundedGrandTotal = Math.round(grandTotal);

    const roundoffValue = Math.floor(roundedGrandTotal);
  
    // Update state with calculated values
    setTotalAmountBeforeTax(totalBeforeTax.toFixed(2));
    setTotal(totalAmount.toFixed(2));
    setGrandTotal(roundedGrandTotal.toFixed(2));
    setRoundoff(roundoffValue);
  };
  
  

  useEffect(() => {
    updateTotals();
  }, [itemList, addExtraCharges, addDiscount, grandTotal, roundoff, isRoundOffEnabled]);




  const calculateAmounts = (rate, gst, discount, quantity) => {
    // Ensure rate, gst, and discount are valid numbers
    const validRate = parseFloat(rate) || 0;
    const validGst = parseFloat(gst) || 0;
    const validDiscount = parseFloat(discount) || 0;
    const validQuantity = parseFloat(quantity) || 1;
  
    // Calculate discounted rate
    const discountedRate = validRate - validDiscount;
  
    // Calculate taxable amount
    const taxable = (discountedRate * validQuantity).toFixed(2);
  
    // GST is already in percentage, so no need to calculate the actual amount here
    // Show the CGST and SGST as half of the total GST percentage
    const cgst = (validGst / 2).toFixed(2);
    const sgst = (validGst / 2).toFixed(2);
  
    // Calculate total amount including GST
    const gstAmount = (discountedRate * (validGst / 100) * validQuantity).toFixed(2);
    const amount = (parseFloat(taxable) + parseFloat(gstAmount)).toFixed(2);
  
    return { taxable, cgst, sgst, amount };
  };
  

  // Handle product selection
  const handleProductSelect = (product) => {
    console.log('Product selected:', product);
    setItemList((prevItemList) => {
      const existingProductIndex = prevItemList.findIndex((item) => item._id === product._id);

      if (existingProductIndex !== -1) {
        const updatedItemList = [...prevItemList];
        const item = updatedItemList[existingProductIndex];

        // Increase quantity
        item.quantity += 1;

        // Recalculate amounts using helper function
        const { taxable, cgst, sgst, amount } = calculateAmounts(item.rate, product.gst, item.discount, item.quantity);

        // Update item values
        item.taxable = taxable;
        item.cgst = cgst;
        item.sgst = sgst;
        item.amount = amount;

        return updatedItemList;
      }

      // Ensure product.sellingprice is a valid number
      const sellingPrice = parseFloat(product.sellingprice) || 0;

      // Product is not in the list, add it with quantity 1
      const { taxable, cgst, sgst, amount } = calculateAmounts(sellingPrice, product.gst, 0, 1);

      return [
        ...prevItemList,
        {
          _id: product._id,
          itemandDescription: `${product.itemname} - ${product.description}`,
          hsnSac: product.hsn ? product.hsn : "N/A",
          unit: (product.unit && product.unit.trim() === "Piece") ? product.unit.trim() : "Piece",

          rate: sellingPrice.toFixed(2), // Ensure rate is a valid number and formatted
          discount: 0, // Assuming no discount initially
          gst: product.gst,
          taxable,
          cgst,
          sgst,
          amount,
          quantity: 1 // Default quantity
        }
      ];
    });

    handleCloseProductListPopup();
  };

  // Handle item removal
  const handleDeleteItem = (index) => {
    setItemList((prevItemList) => {
      return prevItemList.filter((_, i) => i !== index);
    });
  };


  useEffect(() => {
    const getAddresses = async () => {
      if (selectedCustomerId) {
        try {
          const data = await fetchCustomerAddresses(selectedCustomerId);
          setAddresses(data.addresses || []);
        } catch (error) {
          console.error('Error fetching customer addresses:', error);
        }
      }
    };

    getAddresses();
  }, [selectedCustomerId]);


  // Handle edit address submission
  const handleEditShippingSubmit = () => {
    setShippingAddress(editShippingAddress); // Update shipping address with the edited address
    setShowEditShippingModal(false); // Close modal
  };

  // Handle adding a new address
  const handleAddAddressSubmit = () => {
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses); // Add new address to the list
    setSelectedAddress(newAddress); // Set selected address to the newly added address
    setBillingAddress(newAddress); // Also update billingAddress
    setShowAddAddressModal(false); // Close the add address modal
  };


  useEffect(() => {
    // Synchronize shipping address with billing address when the checkbox is checked
    if (isSameAsBilling) {
      setShippingAddress(billingAddress);
    }
  }, [billingAddress, isSameAsBilling]); // Run this effect when billingAddress or checkbox state changes

 
  const handleAddressSelect = async (addressId) => {
    try {
      const data = await getAddressById(addressId);
      setBillingAddress(data.address);
      setSelectedAddress(data.address);
      if (isSameAsBilling) {
        setShippingAddress(data.address); // Copy billing address to shipping if checkbox is checked
      }
    } catch (error) {
      console.error('Failed to fetch address details:', error);
    }
  };

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsSameAsBilling(checked);

    if (checked) {
      setShippingAddress(billingAddress); // Copy billing address to shipping
    } else {
      setShippingAddress({}); // Reset shipping address when unchecked
    }
  };

  // Handle the submission of the edited address
  const handleEditAddressSubmit = () => {
    setSelectedAddress(editAddress); // Update selectedAddress with the edited address
    setBillingAddress(editAddress); // Update billing address
    if (isSameAsBilling) {
      setShippingAddress(editAddress); // Sync shipping address if checkbox is checked
    }
    setShowEditAddressModal(false);
  };

  const [isScrolling, setIsScrolling] = useState(false);
  const [allbanks, setAllBanks] = useState(false);


  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    // Check if scrolled down, set isScrolling state
    setIsScrolling(scrollTop > 0);
  };


const changeBankId=(id)=>{
  setSelectedBankId(id);
}

  const addExtraCharge = (description, amount) => {
    const newCharge = {
      id: Date.now(), // Unique ID for the charge
      description,
      amount: parseFloat(amount) || 0,
    };
    setExtraCharges([...extraCharges, newCharge]);
  };

  // Function to update an existing extra charge
  const updateExtraCharge = (id, newAmount) => {
    setExtraCharges((prevCharges) =>
      prevCharges.map((charge) =>
        charge.id === id ? { ...charge, amount: parseFloat(newAmount) || 0 } : charge
      )
    );
  };

  // Function to delete an extra charge
  const deleteExtraCharge = (id) => {
    setExtraCharges((prevCharges) => prevCharges.filter((charge) => charge.id !== id));
  };


  return (
    <>
      <div className="flex min-h-screen">
        <main className="flex-1 p-2 font-inter">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold mb-4">Create Quotation</h1>
            <div className="space-x-2">
              <Button className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button className="bg-lime-600 rounded-md text-white font-semibold hover:bg-lime-700 p-2 hover:text-white" onClick={handleSubmit}>
                Save
              </Button>
            </div>
          </div>

          <section className="space-y-4">
            <div className="rounded-md border bg-white shadow-sm p-4">
              <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Customer :</label>
                  <div className="flex items-center space-x-2">
                    <input
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-auto p-2.5"
                      id="customer"
                      value={selectedCustomerName} // Display customer name only customer name payload me nahi jana chaiye
                      placeholder="Customer Name"
                      readOnly
                    />

                    <Button
                      className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white font-inter p-2.5 "
                      onClick={handleOpenSelectCustomer}
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
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </Button>

                    <Button
                      className="bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 hover:text-white font-inter  p-2.5 "
                      onClick={handleOpenAddCustomer}

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

              </div>

              <SelectCustomer open={openSelectCustomer} handleClose={handleCloseSelectCustomer} onCustomerSelect={handleCustomerSelect} />
              <AddCustomer open={openAddCustomer} handleClose={handleCloseAddCustomer} />
            </div>
            <div className='grid grid-cols-[60%,40%] gap-4 pr-4 '>
              <div className="rounded-md border bg-white shadow-sm p-4 w-[100%] ">
                <h2 className="text-2xl font-semibold mb-4">Party Details</h2>
                <div className="grid grid-cols-1 ">
                  <div>
                    <label className="text-sm font-medium">Contact Person :</label>
                    <input
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      required
                    />
                  </div>
                  {/* <div>
                    <label htmlFor="salesCredit" className="text-sm font-medium cursor-pointer">
                      Sales Credit:
                    </label>
                    <select
                      id="salesCredit"
                      name="salesCredit"
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5 cursor-pointer"
                      value={salesCredit}
                      onChange={(e) => setSalesCredit(e.target.value)}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>

                  </div> */}


                  {/* Dropdown for selecting billing address */}
                  <div className="col-span-2 mt-4">

                    <div className='flex items-center justify-between gap-3 '>
                      <div className='w-[90%]'>
                        <label className="text-sm font-medium" htmlFor="address">
                          Customer Address:
                        </label>
                        <select
                          className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-500 focus:border-red-500 w-full p-2.5"
                          onChange={(e) => handleAddressSelect(e.target.value)}
                          required
                        >
                          <option value="">Select Customer Address</option>
                          {addresses.map((address) => (
                            <option key={address._id} value={address._id}>
                              {address.type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className='mt-5 w-[10%]' >
                        <Button
                          className="bg-red-600 rounded-md text-white p-2.5 font-semibold hover:bg-red-700 hover:text-white font-inter"
                          onClick={() => setShowAddAddressModal(true)}
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

                    {/* Conditionally render the textarea only if selectedAddress is set */}
                    {selectedAddress && (<>
                      <div className="relative w-full mt-4">
                        <label className="text-sm font-medium" htmlFor="displayAddress">
                          Selected Address:
                        </label>
                        <textarea
                          className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-500 focus:border-red-500 w-full p-2.5"
                          name="displayAddress"
                          value={`${selectedAddress.address1}, ${selectedAddress.address2}, ${selectedAddress.country}, ${selectedAddress.state}, ${selectedAddress.city}, ${selectedAddress.pincode}`}
                          readOnly
                        />
                        <button
                          className="absolute top-8 right-2 text-red-600 hover:text-red-700"
                          onClick={() => { setEditAddress(selectedAddress); setShowEditAddressModal(true); }}
                        >
                          <FaEdit size={22} />
                        </button>
                      </div>

                    <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isSameAsBilling}
                      onChange={handleCheckboxChange}
                      className="h-5 w-5 text-red-600  bg-gray-100 border-red-600 rounded-md focus:ring-red-500 accent-red-600 cursor-pointer"
                    />
                    <span className="text-gray-800">Shipping Address Same as Billing Address</span>
                    </div>  </>

                      
                    )}


                    {/* Checkbox and Shipping Address section */}


                  </div>

                  <div className="col-span-2 mt-4">
                    


                    {/* Conditionally render shipping address textarea and edit button */}
                    {!isSameAsBilling && (
                      <div className='flex items-center justify-between gap-3 '>

                        <div className="mt-4 w-[90%]">
                          <label className="text-sm font-medium" htmlFor="shippingAddress">
                            Shipping Address:
                          </label>
                          {/* <textarea
                            className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-500 focus:border-red-500 w-full p-2.5"
                            name="shippingAddress"
                            value={`${shippingAddress.address1 || ''},${shippingAddress.address2 || ''},${shippingAddress.country || ''},${shippingAddress.state || ''},${shippingAddress.city || ''},${shippingAddress.pincode || ''}`}
                            readOnly
                          /> */}

                          <textarea
                            className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-500 focus:border-red-500 w-full p-2.5"
                            name="shippingAddress"
                            value={[
                              shippingAddress.address1,
                              shippingAddress.address2,
                              shippingAddress.country,
                              shippingAddress.state,
                              shippingAddress.city,
                              shippingAddress.pincode
                            ]
                              .filter(Boolean)  // Filter out empty or undefined values
                              .join(', ')}      // Join with a comma and space
                            readOnly
                          />
                        </div>
                        <Button
                          className="bg-red-600 w-[10%] rounded-md mt-2 text-white p-2.5 font-semibold hover:bg-red-700 hover:text-white font-inter"
                          onClick={() => {
                            // setEditShippingAddress(shippingAddress);  // Ensure shipping address is set for editing
                            setShowEditShippingModal(true);  // Open modal
                          }}
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
                    )}

                  </div>



                </div>

              </div>

              {/* ///document and terms and conditions */}


              <div className='w-[100%] grid grid-cols-1 gap-4 '>

                <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4 " data-v0-t="card">
                  <h2 className="text-2xl font-semibold mb-4">Document Details</h2>
                  <div className="grid grid-cols-1 gap-4">

                    <div>
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="reference"
                      >
                        Reference :
                      </label>
                      <input
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                        id="reference"
                        placeholder="Reference"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        reference
                        required
                      />
                    </div>
                    <div className='items-center justify-between grid grid-cols-2 gap-4'>
                      <div className=''>
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          for="orderDate"
                        >
                          Quotation Date :
                        </label>
                        <input
                          className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                          placeholder=""
                          type="date"
                          id="orderDate"
                          value={quotationDate}
                          onChange={(e) => setQuotationDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className=' '>
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          for="dueDate"
                        >
                          Due Date :
                        </label>
                        <input
                          className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                          placeholder=""
                          type="date"
                          id="dueDate"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          required
                          min={quotationDate}
                          
                        />
                      </div>
                    </div>


                  </div>

                </div>


                <div className="rounded-md border  bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                  <h2 className="text-2xl font-semibold mb-4">Terms &amp; Conditions</h2>
                  <textarea
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                    placeholder="termsAndConditions"
                    id="termsAndConditions"
                    value={termsAndConditions}
                    onChange={(e) => setTermsAndConditions(e.target.value)}
                  ></textarea>
                </div>

              </div>


            </div>

            {/*item list */}

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
                        Rate (₹)
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        Discount (₹)
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        Taxable (₹)
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        CGST (%)
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        SGST (%)
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        Amount (₹)
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="[&amp;_tr:last-child]:border-b transition-colors hover:bg-muted/50 ">
                    {itemList.map((item, index) => (
                      <tr key={item._id} className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">{index + 1}</td>
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white"> {item.itemandDescription}</td>
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">{item.hsnSac}</td>
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">
                          <div className="mt-auto flex items-center gap-3">
                            {/* <button
                              type="button"
                              className="flex items-center justify-center w-5 h-5 bg-red-600 outline-none rounded-full"
                              onClick={() => handleDecreaseQuantity(index)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-2 fill-white" viewBox="0 0 124 124">
                                <path
                                  d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                                  data-original="#000000"
                                ></path>
                              </svg>
                            </button> */}
                            <span className=" text-sm leading-[18px]">{item.quantity}</span>
                            {/* <button
                              type="button"
                              className="flex items-center justify-center w-5 h-5 bg-red-600 outline-none rounded-full"
                              onClick={() => handleIncreaseQuantity(index)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-2 fill-white" viewBox="0 0 42 42">
                                <path
                                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                                  data-original="#000000"
                                ></path>
                              </svg>
                            </button> */}
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

                              // onClick={() => handleOpenEditItemPopup(item)}
                              onClick={() => handleOpenEditPopup(item)}
                            >
                              <FaEdit className="" size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <Button
                  className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-inter"
                  onClick={handleOpenProductListPopup}
                >
                  Add Item
                </Button>
              </div>
            </div>
            {/* Edit Item Popup */}
            {/* <EditItemPopup
              open={openEditPopup}
              handleClose={handleCloseEditPopup}
              item={selectedItem}
              onSave={handleSaveEditedItem}
            /> */}

{openEditPopup && (
                  <AdditemPopUp
            open={openEditPopup}      
            item={selectedItem}
            onClose={handleCloseEditPopup}
         
            onSave={handleSaveEditedItem}
        
                  />
                )}





            {openProductListPopup && (

              // {/* <ProductListPopup
              // open={isProductPopupOpen}
              // onClose={handleCloseProductPopup}
              // onSelectProduct={handleProductSelect}
              // itemList={itemList}  // Pass the current itemList as a prop
              // /> */}
              <ProductListPopup open={openProductListPopup} onClose={handleCloseProductListPopup} onSelectProduct={handleProductSelect} itemList={itemList} />
            )}



            {/* <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
              <h2 className="text-2xl font-semibold mb-4">Terms &amp; Conditions</h2>
              <textarea
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                placeholder="termsAndConditions"
                id="termsAndConditions"
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
              ></textarea>
            </div> */}
            <div className="grid grid-cols-[65%,35%] gap-4 pr-2 ">
              <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                <h2 className="text-2xl font-semibold mb-4">Notes</h2>
                <textarea
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes"
                ></textarea>
              </div>
              {/* <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                <h2 className="text-2xl font-semibold mb-4">Bank Details</h2>
                <BankDetailsComponent setBankDetails={setBankDetails} />
              </div> */}

              <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                <h2 className="text-2xl font-semibold mb-4">Status</h2>
                <select
                  id="status"
                  name="status"
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5 cursor-pointer"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
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
                {/* <h2 className="text-2xl font-semibold mb-4">Upload File</h2>

                <div>
                  <div className="flex items-center  mt-2">
                    <input type="file" id="uploadFile" className="hidden" onChange={(e) => setUploadFile(e.target.files[0])} />
                    <label htmlFor="uploadFile" className="cursor-pointer">
                      <div className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                        <AiOutlineUpload />
                        <span>Upload File</span>
                      </div>
                    </label>
                  </div>
                </div> */}


                {/* <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card"> */}
                <h2 className="text-2xl font-semibold mb-4">Bank Details</h2>
                <BankDetailsComponent setBankDetails={setBankDetails} setSelectedBankIdd={setSelectedBankId} changeBankId={changeBankId}/>
                {/* </div> */}

              </div>
              <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                <h2 className="text-2xl font-semibold mb-4">Total</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Amount before Tax :</span>
                    <span>₹ {totalAmountBeforeTax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total amount including tax :</span>
                    <span>₹ {total}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Extra Charge :</span>
                    <span>₹ {extraChargesTotal}</span>
                  </div>

                  {/* <div className="flex justify-between">
                    <span>Add Discount :</span>
                    <span>₹ {discountAmount}</span>
                  </div> */}

                  <div className="flex justify-between font-bold">
                    <span>Grand Total :</span>
                    <span>₹ {grandTotal}</span>
                  </div>
                </div>

                <div className="flex justify-between font-bold">
                  <span>Roundoff Value:</span>
                  <span>₹ {roundoff}</span>
                </div>




                <div className="flex space-x-2 mt-4">
                  <button
                    className="bg-red-600 rounded-md text-white p-2 font-semibold hover:bg-red-700 hover:text-white font-inter "
                    onClick={() => setShowExtraChargePopup(true)}
                  >
                    + Add Extra Charge
                  </button>
                  {/* <button
                    className="bg-red-600 rounded-md text-white p-2 font-semibold hover:bg-red-700 hover:text-white font-inter "
                    onClick={() => setShowDiscountPopup(true)}
                  >
                    + Add Discount
                  </button> */}
                </div>
              </div>





            </div>
          </section>
          <div className="mt-4 space-x-2 z-10">
            <Button
              className="bg-lime-600 text-white rounded-md font-semibold hover:bg-lime-700 hover:text-white font-inter p-2 "
              onClick={handleSubmit}
            >
              Save
            </Button>
            {/* <Button className="bg-lime-600 text-white rounded-md font-semibold hover:bg-lime-700 hover:text-white font-inter p-2 ">
                          Save & Enter Another
                      </Button> */}
          </div>






          {/* Modal for editing address */}
          {showEditAddressModal && (
            <div className="modal z-50">
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
                <div className="bg-white p-8 w-1/3 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-semibold mb-4">Edit Address</h3>
                  <div className='my-2'>
                    <label className="text-sm font-medium">Address 1:</label>
                    <input
                      type="text"
                      name="address1"
                      value={editAddress.address1 || ''}
                      onChange={(e) => setEditAddress({ ...editAddress, address1: e.target.value })}
                      className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                    // className="block w-full border p-2 mb-2 bg-white"
                    />
                  </div>
                  <div className='my-3'>
                    <label className="text-sm font-medium">Address 2:</label>
                    <input
                      type="text"
                      name="address2"
                      value={editAddress.address2 || ''}
                      onChange={(e) => setEditAddress({ ...editAddress, address2: e.target.value })}
                      className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='my-3'>
                      <label className="text-sm font-medium">City:</label>
                      <input
                        type="text"
                        name="city"
                        value={editAddress.city}
                        onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })}

                        className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                      />
                    </div>
                    <div className='my-2'>
                      <label className="text-sm font-medium">State:</label>
                      <input
                        type="text"
                        name="state"
                        value={editAddress.state}
                        onChange={(e) => setEditAddress({ ...editAddress, state: e.target.value })}

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
                        value={editAddress.country}
                        onChange={(e) => setEditAddress({ ...editAddress, country: e.target.value })}

                        className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                      />
                    </div >
                    <div className='my-2'>
                      <label className="text-sm font-medium">Pincode:</label>
                      <input
                        type="text"
                        name="pincode"
                        value={editAddress.pincode}
                        onChange={(e) => setEditAddress({ ...editAddress, pincode: e.target.value })}

                        className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                      />
                    </div>
                  </div >
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      className="bg-red-600 rounded-md text-white p-2 px-3 font-semibold hover:bg-red-700 w-auto hover:text-white font-poppins mt-2"

                      onClick={() => setShowEditAddressModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-lime-600 rounded-md text-white p-2 px-3 font-semibold hover:bg-lime-700 w-auto  hover:text-white font-poppins mt-2"

                      onClick={handleEditAddressSubmit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

            </div>

          )}

          {/* Modal for adding a new address */}
          {showAddAddressModal && (
            <div className="modal z-50">
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
                <div className="bg-white w-3/4 max-w-lg p-6 rounded-lg shadow-lg max-h-[90vh]">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Add New Address</h2>
                    <button onClick={() => setShowAddAddressModal(false)} className="text-red-600 hover:text-red-700">
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
                        value={newAddress.title}
                        onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}

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
                        value={newAddress.address1}
                        onChange={(e) => setNewAddress({ ...newAddress, address1: e.target.value })}

                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5 mb-2"
                        placeholder="Address Line 1"
                      />
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="line2">Address Line 2</label>

                      <input
                        type="text"
                        id="line2"
                        name="line2"
                        value={newAddress.address2}
                        onChange={(e) => setNewAddress({ ...newAddress, address2: e.target.value })}

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
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}

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
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}

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
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}

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
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}

                          className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                          placeholder="Pincode"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleAddAddressSubmit}
                        className="bg-lime-600 text-white px-4 py-2 rounded-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          )}


          {showEditShippingModal && (
            <div className="modal z-50">
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
                <div className="bg-white p-8 w-1/3 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-semibold mb-4">Add Shipping Address</h3>
                  <form onSubmit={handleEditShippingSubmit}>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="address1">
                        Address Line 1
                      </label>
                      <input
                        id="address1"
                        type="text"
                        className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                        value={editShippingAddress.address1 || ''}
                        onChange={(e) => setEditShippingAddress({ ...editShippingAddress, address1: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="address2">
                        Address Line 2
                      </label>
                      <input
                        id="address2"
                        type="text"
                        className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                        value={editShippingAddress.address2 || ''}
                        onChange={(e) => setEditShippingAddress({ ...editShippingAddress, address2: e.target.value })}
                      />
                    </div>
                    <div className='flex items-center justify-between'>


                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="country">
                          Country
                        </label>
                        <input
                          id="country"
                          type="text"
                          className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                          value={editShippingAddress.country || ''}
                          onChange={(e) => setEditShippingAddress({ ...editShippingAddress, country: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="state">
                          State
                        </label>
                        <input
                          id="state"
                          type="text"
                          className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                          value={editShippingAddress.state || ''}
                          onChange={(e) => setEditShippingAddress({ ...editShippingAddress, state: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className='flex items-center justify-between'>

                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="city">
                          City
                        </label>
                        <input
                          id="city"
                          type="text"
                          className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                          value={editShippingAddress.city || ''}
                          onChange={(e) => setEditShippingAddress({ ...editShippingAddress, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="pincode">
                          Pincode
                        </label>
                        <input
                          id="pincode"
                          type="text"
                          className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                          value={editShippingAddress.pincode || ''}
                          onChange={(e) => setEditShippingAddress({ ...editShippingAddress, pincode: e.target.value })}
                          required
                        />
                      </div>

                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        // className="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400"
                        className="bg-red-600 rounded-md text-white p-2 px-3 font-semibold hover:bg-red-700 w-auto  hover:text-white font-poppins mt-2"

                        onClick={() => setShowEditShippingModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        // className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                        className="bg-lime-600 rounded-md text-white p-2 px-3 font-semibold hover:bg-lime-700 w-auto  hover:text-white font-poppins mt-2"

                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}


{showExtraChargePopup && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-semibold text-center mb-4">Add Extra Charge</h2>
      
      <div className="overflow-y-auto mb-4 max-h-[150px]">
  <table className="min-w-full bg-white border border-gray-300">
    <thead>
      <tr className="bg-gray-100 text-gray-600">
        <th className="py-2 px-4 border-b font-bold">Item Name</th>
        <th className="py-2 px-4 border-b font-bold">Amount ₹</th>
        <th className="py-2 px-4 border-b font-bold">Actions</th>
      </tr>
    </thead>
    <tbody>
      {addExtraCharges.map((charge) => (
        <tr key={charge._id} className="border-b hover:bg-gray-50">
          <td className="text-center py-2 text-gray-800">{charge.itemName ? charge.itemName : "N/A"}</td>
          <td className="text-center py-2 text-gray-800"> {charge.amount }</td>
          <td className="text-center py-2">
            <button
              onClick={() => handleEditExtraCharge(charge._id)}
              className="text-blue-600 hover:underline mr-2"
            >
            <FaEdit />
            </button>
            <button
              onClick={() => handleDeleteExtraCharge(charge._id)}
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


      <label className="block mb-2 text-sm font-medium text-gray-700">Item Name</label>
      <input
        name="itemName"
        // className="bg-white border border-gray-300 text-gray-800 mb-4 rounded-md focus:ring-red-600 focus:border-red-600 block w-full p-2"
        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

        type="text"
        value={extraChargeInput.itemName}
        onChange={handleExtraChargeInputChange}
        placeholder="Enter item name"
        required
      />

      <label className="block mb-2 text-sm font-medium text-gray-700">Amount</label>
      <input
        name="amount"
        type="number"
        value={extraChargeInput.amount}
        onChange={handleExtraChargeInputChange}
        // className="bg-white border border-gray-300 text-gray-800 mb-4 rounded-md focus:ring-red-600 focus:border-red-600 block w-full p-2"
        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

        placeholder="Enter amount"
        required

      />

<div className="flex items-center justify-center mt-3">
  <button
    onClick={handleExtraChargeSubmit}
    className="bg-lime-600 rounded-md text-white p-2 px-4 font-semibold hover:bg-lime-700"
  >
    {isEditing ? "Save" : "Add"} {/* Change button text based on editing state */}
  </button>
  <button
    onClick={() => setShowExtraChargePopup(false)}
    className="bg-red-600 rounded-md text-white p-2 px-4 font-semibold hover:bg-red-700 ml-2"
  >
    Cancel
  </button>
</div>
    </div>
  </div>
)}


          {showDiscountPopup && (



            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-lg font-semibold">Add Discount</h2>
                <input
                  name="itemName"
                  type="text"
                  value={discountInput.itemName}
                  onChange={handleDiscountInputChange}
                  className="bg-white input-field border border-gray-300 text-gray-800 my-2 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-auto p-2.5"
                  placeholder="Item Name"
                />
                {/* <input
                  name="percentage"
                  type="number"
                  value={discountInput.percentage}
                  onChange={handleDiscountInputChange}
                  className="bg-white input-field border border-gray-300 text-gray-800 my-2 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-auto p-2.5"
                  placeholder="Discount percentage"
                /> */}
                <input
                  name="amount"
                  type="number"
                  value={discountInput.amount}
                  onChange={handleDiscountInputChange}
                  className="bg-white input-field border border-gray-300 text-gray-800 my-2 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-auto p-2.5"
                  placeholder="Discount amount"
                />
                <button
                  onClick={handleDiscountSubmit}
                  className="bg-red-600 rounded-md text-white p-2 btn-submit font-semibold hover:bg-red-700 hover:text-white font-inter mt-2 px-4"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowDiscountPopup(false)}
                  className="bg-red-600 btn-cancel rounded-md text-white p-2 btn-submit font-semibold hover:bg-red-700 hover:text-white font-inter mt-2 ml-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </main>

        <Toaster position="top-right" reverseOrder={false} />

      </div>
    </>
  );
};

export default CreateQuotation;
