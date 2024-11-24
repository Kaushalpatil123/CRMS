import { TextFields } from '@mui/icons-material';
import { Button, Checkbox, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import EditAddress from './components/address';
import ShippingAddress from './components/shippingAddress';
import ProductListPopup from './components/productListPopup';
import { FaEdit, FaTrash, FaTrashAlt } from 'react-icons/fa';
import SelectCustomer from './components/selectCustomer';

import { Toaster, toast } from 'react-hot-toast';
import { createOrder, getAddressOfCustomer, getAllExecutives } from 'pages/utils/orders/api';
import { ArrowDropDownIcon, DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EditItemPopup from './components/EditItemPopup';
import CreateQuotation from '../Quote/createQuotation';
import BankDetailsComponent from '../bank/bank';
import axios from 'axios';
import { json, useNavigate } from 'react-router';
import { addCustomer } from 'pages/utils/customers/api';
import ObjectId from 'bson-objectid';
import AdditemPopUp from '../invoice/AdditemPopUp';




const EnterOrder = ({ addressState }) => {
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [OpenAddShippingAddress, setOpenAddShippingAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [salesCredit, setSalesCredit] = useState('');
  const [Status, setStatus] = useState('Received');
  const [reference, setReference] = useState('');
  const [quotationDate, setQuotationDate] = useState('');
  const [newAddress, setNewAddress] = useState({}); // For adding a new address
  const [customerPoNumber, setcustomerPoNumber] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [itemList, setItemList] = useState([]);
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [notes, setNotes] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [totalAmountBeforeTax, setTotalAmountBeforeTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [addExtraCharges, setAddExtraCharges] = useState([{ itemName: '', percentage: 0, amount: 0, _id: '' }]);
  const [addDiscount, setAddDiscount] = useState(0);
  const [showExtraChargePopup, setShowExtraChargePopup] = useState(false);
  const [openSelectCustomer, setOpenSelectCustomer] = useState(false);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  const [extraChargeInput, setExtraChargeInput] = useState(0);
  const [discountInput, setDiscountInput] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editAddress, setEditAddress] = useState({}); // For editing address
  
  const handleOpenAddCustomer = () => setOpenAddCustomer(true);
  
  const [isSameAsBilling, setIsSameAsBilling] = useState(true); // Default is checked
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState({});
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showEditShippingModal, setShowEditShippingModal] = useState(false);
  const [openProductListPopup, setOpenProductListPopup] = useState(false);
  const [openAddCustomer, setOpenAddCustomer] = useState(false);
  const handleOpenAddAddress = () => setOpenAddAddress(true);
  const handleOpenAddShippingAddress = () => setOpenAddShippingAddress(true);
  const handleCloseAddCustomer = () => setOpenAddCustomer(false);
  const handleCloseAddAddress = () => setOpenAddAddress(false);
  const handleCloseAddShippingAddress = () => setOpenAddShippingAddress(false);
  const handleOpenSelectCustomer = () => setOpenSelectCustomer(true);
  const handleCloseSelectCustomer = () => setOpenSelectCustomer(false);
  const [editShippingAddress, setEditShippingAddress] = useState({});
  const handleOpenProductListPopup = () => setOpenProductListPopup(true);
  const handleCloseProductListPopup = () => setOpenProductListPopup(false);
  // const handleExtraChargeInputChange = (e) => setExtraChargeInput(e.target.value);
  const handleDiscountInputChange = (e) => setDiscountInput(e.target.value);
  const [ExtraItem, setExtraItem] = useState('');
  const [ExtraAmount, setExtraAmount] = useState('');
  const [ExtraChargeList, setExtraChargeList] = useState([]);
  const [selectedBankIdd, setSelectedBankIdd] = useState('');
  const [extraChargesTotal, setExtraChargesTotal] = useState("0");
  const [displayItem, setDisplayItem] = useState(null);
  const [openItemDialog, setOpenItemDialog] = useState(false);


  
  const [roundoff, setRoundoff] = useState(0);


  const [Dates, setDates] = useState({
    nextActionDate: null,
    nextActionTime: null,
    editNextAction: ''
  });

  const [nextAction, setNextAction] = useState({
    email: false,
    whatsapp: false,
    print: false
  });

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
    city: '',
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
      [name]: value
    });
  };
  const token = localStorage.getItem('token');
  const [Executives, setExecutives] = useState();
  const [SelectedExecutive, setSelectedExecutive] = useState('');
  const [itemInput, setItemInput] = useState('');
  const [percentInput, setPercentInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  // State for discount popup
  const [discountItemInput, setDiscountItemInput] = useState('');
  const [discountPercentInput, setDiscountPercentInput] = useState('');
  const [discountAmountInput, setDiscountAmountInput] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Track if editing
  const [currentChargeId, setCurrentChargeId] = useState(null); 
  const [OrderNumber, setOrderNumber] = useState('');
  const server = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  // Handlers for discount inputs
  const handleDiscountItemInputChange = (e) => {
    setDiscountItemInput(e.target.value);
  };




  useEffect(() => {
    console.log('Updated extra charges:', addExtraCharges);
  }, [addExtraCharges]);


  const handleAddressSelect = async (addressId) => {
    try {
      const response = await fetch(`${server}/api/invoice/getAddressById/${addressId}`);
      const data = await response.json();
      setBillingAddress(data.address);
      setSelectedAddress(data.address);
      if (isSameAsBilling) {
        setShippingAddress(data.address); // Copy billing address to shipping if checkbox is checked
      }
    } catch (error) {
      console.error('Failed to fetch address details:', error);
    }
  };




 
  // Search Customer Modal
  const [searchCustomerModal, setSearchCustomerModal] = useState({
    open: false
  });

  // Add Customer Modal
  const [addCustomerModal, setAddCustomerModal] = useState({
    open: false
  });
  const handleSearchCustomerModalClose = () => {
    setSearchCustomerModal({
      open: false
    });
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

  // Handle edit address submission
  const handleEditShippingSubmit = () => {
    setShippingAddress(editShippingAddress); // Update shipping address with the edited address
    setShowEditShippingModal(false); // Close modal
  };

  const handleOpenEditPopup = (item) => {
    setSelectedItem(item);
    setOpenEditPopup(true);
  };

  const handleCheckboxChange = (e) => {
    setIsSameAsBilling(e.target.checked); // Update the state based on checkbox
  };

  // const handleSaveEditedItem = (editedItem) => {
  //   setItemList((prevItemList) => prevItemList.map((item) => (item._id === editedItem._id ? editedItem : item)));
  //   updateTotals(); // Ensure totals are updated after saving the edited item
  // };

  const handleCloseEditPopup = () => {
    setOpenEditPopup(false);
    setSelectedItem(null);
  };

  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    setSelectedCustomerId(customer.customerId);
    setSelectedCustomerName(customer.customerName);
    handleCloseSelectCustomer();
  };

  // Function to check if all fields are filled
  const checkFormValidity = (date) => {
    if (date) {
      setIsFormValid(true);
      // setErrorMessage('');
    } else {
      setIsFormValid(false);
    }
  };



  // Handle item removal
  const handleDeleteItem = (index) => {
    setItemList((prevItemList) => {
      return prevItemList.filter((_, i) => i !== index);
    });
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


  const handleExtraChargeInputChange = (e) => {
    const { name, value } = e.target;
    setExtraChargeInput((prev) => ({ ...prev, [name]: value }));
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


  const handleAddressUpdate = (newAddress) => {
    console.log('final address--->', newAddress);
    setAddress(newAddress); // Update billing address

    // if (shippingAddress) {
    //   setShippingAddress(newAddress); // Sync shipping address with billing address
    // }
    handleCloseAddAddress(); // Close modal after updating
  };

  const handleShippingAddressUpdate = (newAddress) => {
    console.log('final shipping address--->', newAddress);
    setShippingAddress(newAddress); // Update billing address
    handleCloseAddShippingAddress(); // Close modal after updating
  };

  const handleAddCustomerModalClose = () => {
    setAddCustomerModal({
      open: false
    });
  };

  const handleAddCustomer = () => {
    setAddCustomerModal({
      open: true
    });
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

    // const calculatedDiscountAmount = parseFloat(addDiscount.amount) || 0;
    // setDiscountAmount(calculatedDiscountAmount.toFixed(2));

  
    // Deduct discount
    // const discountAmount = parseFloat(addDiscount.amount) || 0;
  
    // Calculate grand total
    const grandTotal = totalAmount + calculatedExtraChargesTotal;
  
    // Round the grand total to the nearest integer
    const roundedGrandTotal = grandTotal;

    const roundoffValue = Math.floor(roundedGrandTotal);
  
    // Update state with calculated values
    setTotalAmountBeforeTax(totalBeforeTax.toFixed(2));
    setTotal(totalAmount.toFixed(2));
    setGrandTotal(roundedGrandTotal.toFixed(2));
    setRoundoff(roundoffValue);
  };

  useEffect(() => {
    console.log('Item List:', itemList);
    updateTotals();
  }, [itemList, addExtraCharges, addDiscount]);

  //  calculate amounts based on rate, gst, discount, and quantity
  const calculateAmounts = (rate, gst, discount, quantity) => {
    // Ensure rate, gst, and discount vlid number ho
    const validRate = parseFloat(rate) || 0;
    const validGst = parseFloat(gst) || 0;
    const validDiscount = parseFloat(discount) || 0;
    const validQuantity = parseFloat(quantity) || 1;

    // Calculate discounted rate
    const discountedRate = validRate - validDiscount;

    // Calculate taxable amount
    const taxable = (discountedRate * validQuantity).toFixed(2);

    // Calculate GST total for the item
    const gstTotal = (discountedRate * (validGst / 100) * validQuantity).toFixed(2);

    // Split GST into CGST and SGST
    const cgst = (parseFloat(gstTotal) / 2).toFixed(2);
    const sgst = (parseFloat(gstTotal) / 2).toFixed(2);

    // Calculate total amount including GST
    const amount = (parseFloat(taxable) + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);

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
          hsnSac: product.hsn,
          unit: 'Piece',
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

  const formatShippingAddress = () => {
    if (shippingAddress && typeof shippingAddress === 'object') {
      const { address1, address2, city, state, country, pincode } = shippingAddress;
      return `${address1 || ''}, ${address2 || ''}, ${city || ''}, ${state || ''}, ${country || ''}, ${pincode || ''}`.trim();
    }
    return ''; // Return empty string if shippingAddress is not properly set
  };

  // handle get Address
  // const handleGetAddress = () => {
  //   handleOpenAddAddress();
  //   fetchAddress();
  // };

  // Helper function to format the date to dd-mm-yyyy
  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Handle adding a new address
  const handleAddAddressSubmit = () => {
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses); // Add new address to the list
    setSelectedAddress(newAddress); // Set selected address to the newly added address
    setBillingAddress(newAddress); // Also update billingAddress
    setShowAddAddressModal(false); // Close the add address modal
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

  const handleAddCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      await addCustomer(formData);
      toast.success('Customer Added Successfully');
      setFormData({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        website: '',
        industrySegment: '',
        country: '',
        state: '',
        city: '',
        receivables: 0,
        receivablesNotes: '',
        businessProspect: 0,
        orderTarget: 0,
        msmeNo: '',
        panNo: ''
      });
      handleAddCustomerModalClose(); // Close the modal on successful submission
    } catch (error) {
      toast.error('Customer Not Created');
      console.error('Error adding customer:', error.response.data);
    }
  };
  useEffect(() => {
    // Synchronize shipping address with billing address when the checkbox is checked
    if (selectedBankIdd) {
      console.log('Bank Details ------>', selectedBankIdd);
    }
  }, [selectedBankIdd]); 

  const handleSubmit = async () => {
   
    console.log('address came from address.js--->', address);
    console.log('Selected customer itemList---------------->', itemList);
    if (!contactPerson) {
      toast.error('Contact Person required');
      return;
    } else if (!selectedAddress) {
      toast.error('Selected Address required');
      return;
    } else if (!OrderNumber) {
      toast.error('Order Number required');
      return;
    } else if (!reference) {
      toast.error('Reference required');
      return;
    } else if (!orderDate) {
      toast.error('OrderDate required');
      return;
    } else if (!dueDate) {
      toast.error('DueDate required');
      return;
    } else if (!customerPoNumber) {
      toast.error('Customer Po Number required');
      return;
    } else if (itemList.length === 0) {
      toast.error('Item List required');
      return;
    } else if (itemList.amount < 1) {
      toast.error('Item List Amount required');
      return;
    } else if (itemList.cgst < 1) {
      toast.error('Item List cgst required');
      return;
    } else if (itemList.discount < 1) {
      toast.error('Item List Discount required');
      return;
    }
    // else if (itemList.hsnSac !== " ") {
    //   toast.error('itemList hsnSac required');
    // }
    // else if (itemList.itemDescription = " ") {
    //   toast.error('itemList itemDescription required');
    // }
    else if (itemList.quantity <= 1) {
      toast.error('Item List quantity required');
      return;
    } else if (itemList.rate < 1) {
      toast.error('Item List rate required');
      return;
    } else if (itemList.sgst < 1) {
      toast.error('Item List sgst required');
      return;
    } else if (itemList.taxable < 1) {
      toast.error('Item List taxable required');
      return;
    } else if (itemList.unit < 1) {
      toast.error('Item List unit required');
      return;
    } else if (!termsAndConditions) {
      toast.error('Terms And Conditions required');
      return;
    } else if (!notes) {
      toast.error('Notes required');
      return;
    } else if (!selectedBankIdd) {
      toast.error('Bank Details required');
      return;
    } else if (total <= 1) {
      toast.error('Total required');
      return;
    } else if (grandTotal <= 1) {
      toast.error('Grand Total required');
      return;
    } else if (!selectedCustomerId) {
      console.error('Customer ID is required--------------->');
      toast.error('Customer is Required');
      return;
    }

    // Format the dates
    const formattedQuotationDate = orderDate ? formatDateToDDMMYYYY(orderDate) : formatDateToDDMMYYYY(new Date());
    const formattedDueDate = dueDate ? formatDateToDDMMYYYY(dueDate) : formatDateToDDMMYYYY(new Date());

    // Correctly structure the billing address
    const billingAddress = {
      address1: selectedAddress?.address1 || '',
      address2: selectedAddress?.address2 || '',
      city: selectedAddress?.city || '',
      state: selectedAddress?.state || '',
      country: selectedAddress?.country || '',
      pincode: selectedAddress?.pincode || '',
      type: selectedAddress?.type || 'Home'
    };
    console.log('billing addresss--->', billingAddress);

    const shippingAdd = {
      address1: shippingAddress?.address1 || '',
      address2: shippingAddress?.address2 || '',
      city: shippingAddress?.city || '',
      state: shippingAddress?.state || '',
      country: shippingAddress?.country || '',
      pincode: shippingAddress?.pincode || ''
    };

    // Filter out empty values and join the remaining non-empty values with a comma
    const shippingAddressString = Object.values(shippingAdd)
      .filter((value) => value.trim() !== '') // Exclude empty strings or strings with only spaces
      .join(',');

    console.log('Shipping address string:', shippingAddressString);

    // Correctly structure the partyDetails
    const partyDetails = {
      contactPerson: contactPerson || '',
      // salesCredit: salesCredit,
      shippingAddress: shippingAddressString || '',
      executive: SelectedExecutive || 'Sarabjeet Singh'
    };

    // Correctly structure documentDetails
    const documentDetails = {
      reference: reference || '',
      orderDate: formattedQuotationDate,
      dueDate: formattedDueDate,
      customerPoNumber: customerPoNumber
    };
    const nextActions = {
      email: nextAction.email,
      whatsapp: nextAction.whatsapp,
      print: nextAction.print
    };
    const validAddExtraCharges = Array.isArray(addExtraCharges) && addExtraCharges.length > 0
      ? addExtraCharges.map((charge) => ({
        itemName: charge.itemName || 'Extra Charge',
        percentage: charge.percentage || 0,
        amount: charge.amount || 0,
        // _id: ObjectId.isValid(charge._id) ? charge._id : new ObjectId().toString(), // Ensure valid ObjectId
      }))
      : [];


    // Correctly structure the itemList
    console.log('itemlist---->', itemList);
    const formattedItemList = itemList.map((item) => ({
      itemDescription: item.itemDescription || 'String',
      hsnSac: item.hsnSac || 'String',
      quantity: parseFloat(item.quantity) || 1,
      unit: item.unit || 'Pieces',
      rate: parseFloat(item.rate) || 1,
      discount: parseFloat(item.discount) || 1,
      taxable: parseFloat(item.taxable) || 1,
      cgst: parseFloat(item.cgst) || 1,
      sgst: parseFloat(item.sgst) || 1,
      amount: parseFloat(item.amount) || 1
    }));
    // const ExtraCharges = ExtraChargeList;

    // Construct payload
    const payload = {
      customer: selectedCustomerId,
      ...(partyDetails && { partyDetails }), // Only include if not empty
      // ...(shippingAddressString && { shippingAddress: shippingAddressString }), // Only include if not empty
      ...(documentDetails && { documentDetails }), // Only include if not empty
      ...(nextActions && { nextActions }), // Only include if not empty
      ...(formattedItemList && formattedItemList.length > 0 && { itemList: formattedItemList }), // Include if list is not empty
      ...(billingAddress && { address: billingAddress }), // Only include if not empty
      termsConditions: termsAndConditions ? termsAndConditions.split('\n') : ['Payment due in 30 days.', 'Warranty period: 1 year.'],
      // ...(bankDetails && selectedBankIdd && { bankDetails: selectedBankIdd }), // Include if bankDetails._id exists
      ...(notes && { notes }), // Only include if not empty
      ...(total && parseFloat(total) > 0 && { total: parseFloat(total) }), // Include if total is greater than 0
      ...(grandTotal && parseFloat(grandTotal) > 0 && { grandTotal: parseFloat(grandTotal) }), // Include if grandTotal is greater than 0
      // addExtraCharges: [
      //   {
      //     itemName: itemInput || 'itemName',
      //     amount: parseFloat(amountInput) || 0
      //   }
      // ],
      bankDetails: selectedBankIdd,
      // addExtraCharges: ExtraCharges,
      // addExtraCharges: JSON.stringify(validAddExtraCharges),
      addExtraCharges: validAddExtraCharges,

      // addDiscount: {
      //   itemName: discountItemInput || 'itemName',
      //   amount: parseFloat(discountInput) || 0
      // },
      ...(Status && { status: Status }) // Only include if Status is not empty
    };

    console.log('Constructed payload:', payload);

    console.log('Payload being sent:', payload);

    try {
      const response = await createOrder(payload);
      console.log('Order created successfully:', response);
      toast.success('Order created successfully');

      // toast.success('Order Created Successfully');
      setTimeout(() => {
        navigate('/apps/orders/list');
      }, 1000);

      setSelectedCustomerName('');
      setSelectedDate('');
      setSelectedExecutive('');
      setSelectedAddress('');
      setContactPerson('');
      setReference('');
      setItemList([]);
      setOrderNumber('');
      setReference('');
      setSelectedAddress('');
      setDueDate('');
      setOrderDate('');
      setBankDetails('');
      setTermsAndConditions('');
      setcustomerPoNumber('');
      setNextAction({
        email: false,
        whatsapp: false,
        print: false
      });
    } catch (error) {
      // toast.error('Error Creating Order');
      console.error('Failed to create order:', error);
    }
  };

  const handleGetShippingAddress = () => {
    handleOpenAddShippingAddress();
    // fetchAddress();
  };

  // useEffect(() => {
  //   const fetchAddresses = async () => {
  //     if (selectedCustomerId) {
  //       try {
  //         const response = await getAddressOfCustomer(selectedCustomerId, token);
  //         const data = await response.json();
  //         console.log('fetch address--->',data)
  //         setAddresses(data || []);
  //       } catch (error) {
  //         console.error('Failed to fetch addresses:', error);
  //       }
  //     }
  //   };
  //   fetchAddresses();
  // }, [selectedCustomerId]);
  // Fetch addresses when customer is selected
  useEffect(() => {
    const fetchAddresses = async () => {
      if (selectedCustomerId) {
        try {
          const response = await fetch(`${server}/api/invoice/getCustomerAddresses/${selectedCustomerId}`);
          const data = await response.json();
          setAddresses(data.addresses || []);
        } catch (error) {
          console.error('Failed to fetch addresses:', error);
        }
      }
    };
    fetchAddresses();
  }, [selectedCustomerId]);

  useEffect(() => {
    const fetchAllExecutives = async () => {
      const token = localStorage.getItem('token');
      const response = await getAllExecutives(token);
      console.log(response?.data);
      setSalesCredit(response?.data);
      setExecutives(response?.data);
    };
    fetchAllExecutives();
  }, []);

  useEffect(() => {
    // Synchronize shipping address with billing address when the checkbox is checked
    if (isSameAsBilling) {
      setShippingAddress(billingAddress);
    }
  }, [billingAddress, isSameAsBilling]); // Run this effect when billingAddress or checkbox state changes

  const changeBankId = (id) => {
    console.log("this is the bank id----->",id)
    setSelectedBankIdd(id);
  }
  const handleAddItem = (index) => {
    const particularItem=itemList.find((_,i)=>i===index)
    setDisplayItem(particularItem);
    setOpenItemDialog(true);
  };
  const handleSaveEditedItem = (editedItem) => {
    setItemList((prevItemList) => prevItemList.map((item) => (item._id === editedItem._id ? editedItem : item)));
    updateTotals();
    setOpenItemDialog(false)
  };


  return (
    <>
      <div className="flex min-h-screen">
        <main className="flex-1 p-8 font-poppins">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold mb-4">Create Sales Order</h1>
          </div>
          <section className="space-y-4">
            <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
              <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    for="customer"
                  >
                    Customer :
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                      id="customer"
                      value={selectedCustomerName}
                      placeholder="Customer Name"
                    />
                    <Button
                      className="bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter p-2.5 "
                      //   onClick={handleSearchCustomer}
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
                      className=" bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter  p-2.5 "
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
                <SelectCustomer open={openSelectCustomer} handleClose={handleCloseSelectCustomer} onCustomerSelect={handleCustomerSelect} />
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <div className="w-[50%] rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                <h2 className="text-2xl font-semibold mb-4">Party Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="contactPerson"
                    >
                      Contact Person :
                    </label>
                    <input
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                      id="contactPerson"
                      placeholder="Contact Person"
                      onChange={(e) => setContactPerson(e.target.value)}
                      // onChange={(e) => setSelectedExecutive(e.target.value)} // Update state on change
                    />
                  </div>

                  {/* <div>
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    for="address"
                  >
                    Address :
                  </label>
                  <Button
                    className="mt-5 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter rounded-md font-semiboldfont-poppins w-full p-2"
                  
                    onClick={handleGetAddress}
                  >
                    + Click here to add an address.
                  </Button>
                </div> */}

                  <div className="col-span-2">
                    <div className="flex items-center justify-between gap-3 ">
                      <div className="w-[90%]">
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

                      <div className="mt-5 w-[10%]">
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
                    {selectedAddress && (
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
                          onClick={() => {
                            setEditAddress(selectedAddress);
                            setShowEditAddressModal(true);
                          }}
                        >
                          <FaEdit size={22} />
                        </button>
                      </div>
                    )}

                    {/* Checkbox and Shipping Address section */}
                  </div>
                  {/* Shipping Address */}
                  {selectedAddress && (
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isSameAsBilling}
                          onChange={handleCheckboxChange}
                          className="h-5 w-5 text-red-600 bg-gray-100 border-red-600 rounded-md focus:ring-red-500 accent-red-600 cursor-pointer"
                        />
                        <span className="text-gray-800">Same as Billing Address</span>
                      </div>

                      {/* Conditionally render shipping address textarea and edit button */}
                      {!isSameAsBilling && (
                        <div className="flex items-center justify-between gap-3 ">
                          <div className="mt-4 w-[90%]">
                            <label className="text-sm font-medium" htmlFor="shippingAddress">
                              Shipping Address:
                            </label>
                            <textarea
                              className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-500 focus:border-red-500 w-full p-2.5"
                              name="shippingAddress"
                              value={`${shippingAddress.address1 || ''},${shippingAddress.address2 || ''},${
                                shippingAddress.country || ''
                              },${shippingAddress.state || ''},${shippingAddress.city || ''},${shippingAddress.pincode || ''}`}
                              readOnly
                            />
                          </div>
                          <Button
                            className="bg-red-600 w-[10%] rounded-md mt-2 text-white p-2.5 font-semibold hover:bg-red-700 hover:text-white font-inter"
                            onClick={() => {
                              // setEditShippingAddress(shippingAddress);  // Ensure shipping address is set for editing
                              setShowEditShippingModal(true); // Open modal
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
                  )}

                  {/* Status */}
                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="salesCredit" // Changed `for` to `htmlFor`
                    >
                      Status:
                    </label>
                    <div className="relative">
                      <select
                        id="salesCredit" // Ensure the ID matches
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="Received">Received</option>
                        <option value="WIP">WIP</option>
                        <option value="Query">Query</option>
                        <option value="Packed">Packed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Done">Done</option>
                        {/* Add other options as needed */}
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
                  </div>

                  <EditAddress
                    open={openAddAddress}
                    address={address}
                    handleClose={handleCloseAddAddress}
                    handleAddressUpdate={handleAddressUpdate}
                  />

                  <ShippingAddress
                    open={OpenAddShippingAddress}
                    shippingAddress={shippingAddress}
                    handleClose={handleCloseAddShippingAddress}
                    handleShippingAddressUpdate={handleShippingAddressUpdate}
                  />

                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="executive"
                    >
                      Executive :
                    </label>
                    <div className="relative">
                      <select
                        id="copyFrom"
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                        value={SelectedExecutive} // Bind state to the select element
                        onChange={(e) => setSelectedExecutive(e.target.value)} // Update state on change
                      >
                        {Array.isArray(Executives) &&
                          Executives.map((addr, index) => (
                            <option key={index} value={addr}>
                              {addr}
                            </option>
                          ))}
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
                  </div>
                </div>
              </div>
              <div className="w-[50%] rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                <h2 className="text-2xl font-semibold mb-4">Document Details</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="orderNo"
                    >
                      Order No. :
                    </label>
                    <input
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                      id="orderNo"
                      // placeholder="1"
                      onChange={(e) => setOrderNumber(e.target.value)} // Update state on change
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="reference"
                    >
                     Agent Reference :
                    </label>
                    {/* <input
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                      id="reference"
                      placeholder="Reference"
                      onChange={(e) => setReference(e.target.value)} // Update state on change
                    /> */}
                     <select
                        id="copyFrom"
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                        value={reference} // Bind state to the select element
                        onChange={(e) => setReference(e.target.value)} // Update state on change
                      >
                        {Array.isArray(Executives) &&
                          Executives.map((addr, index) => (
                            <option key={index} value={addr}>
                              {addr}
                            </option>
                          ))}
                      </select>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-row items-center space-x-4 mb-3">
                      <div className="w-[20vw]">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          for="orderDate"
                        >
                          Order Date :
                        </label>
                        <input
                          className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                          placeholder=""
                          type="date"
                          id="orderDate"
                          onChange={(e) => setOrderDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="w-[20vw]">
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
                        />
                      </div>
                      {/* <d */}
                    </div>
                  </div>

                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="customerPONo"
                    >
                      Customer PO No. :
                    </label>
                    <input
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                      id="customerPONo"
                      placeholder="Customer PO No."
                      onChange={(e) => setcustomerPoNumber(e.target.value)} // Update state on change
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
              <h2 className="text-2xl font-semibold mb-4">Item List</h2>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&amp;_tr]:border-b">
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
                        Qty
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
                        CGST (₹)
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        SGST (₹)
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        Amount (₹)
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&amp;_tr:last-child]:border-b transition-colors hover:bg-muted/50">
                    {itemList?.map((item, index) => (
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
                              // onClick={() => handleOpenEditPopup(item)}
                              onClick={() => handleAddItem(index)}

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
            {/* <EditItemPopup open={openEditPopup} handleClose={handleCloseEditPopup} item={selectedItem} onSave={handleSaveEditedItem} /> */}
            {/* Edit Item Popup */}
            {/* <EditItemPopup open={openEditPopup} handleClose={handleCloseEditPopup} item={selectedItem} onSave={handleSaveEditedItem} /> */}
            
            {openItemDialog && (
              <AdditemPopUp open={openEditPopup}
              item={displayItem}
            onClose={() => setOpenItemDialog(false)}
            onSave={handleSaveEditedItem} />
           )} 
            
            {openProductListPopup && (
              <ProductListPopup
                open={openProductListPopup}
                onClose={handleCloseProductListPopup}
                onSelectProduct={handleProductSelect}
                itemList={itemList}
              />
            )}

            <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
              <h2 className="text-2xl font-semibold mb-4">Terms &amp; Conditions</h2>
              <textarea
                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                placeholder="termsAndConditions"
                id="termsAndConditions"
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
              ></textarea>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                <h2 className="text-2xl font-semibold mb-4">Notes</h2>
                <textarea
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                  placeholder="Notes"
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                <h2 className="text-2xl font-semibold mb-4">Bank Details</h2>
                <BankDetailsComponent matchedId={selectedBankIdd} changeBankId={changeBankId}/>


                {/* <BankDetailsComponent setBankDetails={bankDetails} BankIdd={selectedBankIdd} /> */}
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
            <div className="grid grid-cols-2 gap-4">
              {/* <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                <h2 className="text-2xl font-semibold mb-4">Next Actions</h2>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      type="checkbox"
                      role="checkbox"
                      value="on"
                      padding="checkbox"
                      id="shippingAddress"
                      aria-checked={nextAction.email}
                      data-state={nextAction.email ? 'checked' : 'unchecked'}
                      checked={nextAction.email} // Bind checkbox to state
                      onChange={handleNextActionCheckboxChange('email')} // Handle change
                    />
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="shareEmail"
                    >
                      Share by Email
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      type="checkbox"
                      role="checkbox"
                      // aria-checked="false"
                      // data-state="unchecked"
                      value="on"
                      padding="checkbox"
                      id="shippingAddress"
                      aria-checked={nextAction.whatsapp}
                      data-state={nextAction.whatsapp ? 'checked' : 'unchecked'}
                      checked={nextAction.whatsapp} // Bind checkbox to state
                      onChange={handleNextActionCheckboxChange('whatsapp')} // Handle change
                    />
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="printDocument"
                    >
                      Share by Whatsapp
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      type="checkbox"
                      role="checkbox"
                      // aria-checked="false"
                      // data-state="unchecked"
                      value="on"
                      padding="checkbox"
                      id="shippingAddress"
                      aria-checked={nextAction.print}
                      data-state={nextAction.print ? 'checked' : 'unchecked'}
                      checked={nextAction.print} // Bind checkbox to state
                      onChange={handleNextActionCheckboxChange('print')} // Handle change
                    />
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="printDocument"
                    >
                      Print Document after Saving
                    </label>
                  </div>
                </div>
              </div> */}

              {/* Extra Charge Popup */}
              {/* Extra Charge Popup */}
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
      {console.log('extra charges map---.',addExtraCharges)}
      {addExtraCharges
  .filter(charge => !(charge.itemName === '' && charge.amount === 0 && charge._id === 0))
  .map(charge => (
    <tr key={charge._id} className="border-b hover:bg-gray-50">
      <td className="text-center py-2 text-gray-800">{charge.itemName ? charge.itemName : "N/A"}</td>
      <td className="text-center py-2 text-gray-800">{charge.amount}</td>
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

              {/* Discount Popup */}
              {/* Discount Popup */}
          
            </div>
          </section>
          <div className="mt-4 space-x-2">
            <Button
              className="  bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter px-8"
              onClick={handleSubmit}
            >
              Save
            </Button>
            {/* <Button className= "bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter">
              Save & Enter Another
            </Button> */}
          </div>
        </main>
      </div>

      {/*  Search Customer Modal  */}

      {/*  Add Customer Modal  */}
      {openAddCustomer && (
        // <div className="fixed top-0 left-0 w-[100vw] h-full flex items-center overflow-y-hidden justify-center bg-black bg-opacity-50 z-52">
        //   <div className="bg-white p-6 rounded-md w-[50vw] mt-12 h-[80vh] overflow-y-hidden font-poppins">
        //     <div className="flex justify-between items-center p-2.5">
        //       <h1 className="text-2xl font-semibold mb-4">Enter Customer</h1>
        //       <Button
        //         type="Button"
        //         className="text-gray-600 rounded-md bg-transparent hover:bg-gray-200 hover:text-gray-900 text-sm p-2 ml-auto inline-flex items-center"
        //         data-modal-toggle="authentication-modal"
        //         onClick={() => handleAddCustomerModalClose()}
        //       >
        //         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        //           <path
        //             fillRule="evenodd"
        //             d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        //             clipRule="evenodd"
        //           ></path>
        //         </svg>
        //       </Button>
        //     </div>

        //     <form
        //       id="form"
        //       className="space-y-6 overflow-y-auto max-h-[65vh] pr-3"
        //       onSubmit={(e) => {
        //         e.preventDefault();
        //         e.stopPropagation();
        //         handleSubmit();
        //         handleAddCustomerModalClose();
        //       }}
        //     >
        //       <div>
        //         <label htmlFor="company" className="text-sm font-medium text-gray-800 block mb-2">
        //           Company
        //         </label>
        //         <input
        //           type="text"
        //           name="company"
        //           id="company"
        //           className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
        //           placeholder="Enter Company Name"
        //           required
        //         />
        //       </div>

        //       <div className="flex justify-between space-x-5">
        //         <div className="w-[80%]">
        //           <label className="text-sm font-medium text-gray-800 block mb-2">Name</label>
        //           <div className="flex space-x-2">
        //             <select
        //               name="salutation"
        //               id="salutation"
        //               className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none p-1"
        //               required
        //             >
        //               <option value="Mr."> Mr.</option>
        //               <option value="Mrs."> Mrs.</option>
        //               <option value="Miss"> Miss</option>
        //               <option value="Ms."> Ms.</option>
        //               <option value="Dr."> Dr.</option>
        //             </select>
        //             <input
        //               type="text"
        //               name="firstName"
        //               id="firstName"
        //               className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-[42%] p-2.5"
        //               placeholder="First Name"
        //               required
        //             />
        //             <input
        //               type="text"
        //               name="lastName"
        //               id="lastName"
        //               className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-[42%] p-2.5"
        //               placeholder="Last Name"
        //               required
        //             />
        //           </div>
        //         </div>

        //         <div className="">
        //           <label htmlFor="mobileNumber" className="text-sm font-medium text-gray-800 block mb-2">
        //             Mobile Number
        //           </label>
        //           <div className="relative">
        //             <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">+91</span>
        //             <input
        //               type="text"
        //               name="price"
        //               id="price"
        //               className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full pl-9 p-2.5"
        //               required
        //             />
        //           </div>
        //         </div>
        //       </div>

        //       <div className="flex w-full space-x-5">
        //         <div className="flex-1">
        //           <label htmlFor="email" className="text-sm font-medium text-gray-800 block mb-2">
        //             Email
        //           </label>
        //           <input
        //             type="email"
        //             name="email"
        //             id="email"
        //             className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
        //             placeholder="Enter Email"
        //             required
        //           />
        //         </div>

        //         <div className="flex-1">
        //           <label htmlFor="website" className="text-sm font-medium text-gray-800 block mb-2">
        //             Website
        //           </label>
        //           <input
        //             type="url"
        //             name="website"
        //             id="website"
        //             className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
        //             placeholder="Enter Website"
        //           />
        //         </div>
        //       </div>

        //       <div>
        //         <label htmlFor="industry" className="text-sm font-medium text-gray-800 block mb-2">
        //           Industry & Segment
        //         </label>
        //         <input
        //           type="text"
        //           name="industry"
        //           id="industry"
        //           className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
        //           placeholder="Enter Industry & Segment"
        //         />
        //       </div>

        //       <div className="flex w-full space-x-5">
        //         <div className="flex-1">
        //           <label htmlFor="country" className="text-sm font-medium text-gray-800 block mb-2">
        //             Country
        //           </label>
        //           <input
        //             type="text"
        //             name="country"
        //             id="country"
        //             className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
        //             placeholder="Enter Country"
        //             required
        //           />
        //         </div>

        //         <div className="flex-1">
        //           <label htmlFor="state" className="text-sm font-medium text-gray-800 block mb-2">
        //             State
        //           </label>
        //           <input
        //             type="text"
        //             name="state"
        //             id="state"
        //             className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
        //             placeholder="Enter State"
        //             required
        //           />
        //         </div>

        //         <div className="flex-1">
        //           <label htmlFor="city" className="text-sm font-medium text-gray-800 block mb-2">
        //             City
        //           </label>
        //           <input
        //             type="text"
        //             name="city"
        //             id="city"
        //             className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
        //             placeholder="Enter City"
        //             required
        //           />
        //         </div>
        //       </div>

        //       <div className="flex w-full space-x-5">
        //         <div className=" w-[30%]">
        //           <label htmlFor="receivables" className="text-sm font-medium text-gray-800 block mb-2">
        //             Receivables
        //           </label>
        //           <div className="relative">
        //             <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
        //             <input
        //               type="number"
        //               name="price"
        //               id="price"
        //               className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full pl-6 p-2.5"
        //               placeholder="0"
        //               required
        //             />
        //           </div>
        //         </div>

        //         <div className="flex-1" s>
        //           <label htmlFor="receivableNotes" className="text-sm font-medium text-gray-800 block mb-2">
        //             Receivable Notes
        //           </label>
        //           <input
        //             type="text"
        //             name="receivableNotes"
        //             id="receivableNotes"
        //             className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
        //             placeholder="Enter Receivable Notes"
        //           />
        //         </div>
        //       </div>

        //       <div className="flex w-full space-x-5">
        //         <div className="flex-1">
        //           <label htmlFor="businessProspects" className="text-sm font-medium text-gray-800 block mb-2">
        //             Business Prospects (Annual)
        //           </label>
        //           <div className="relative">
        //             <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
        //             <input
        //               type="number"
        //               name="price"
        //               id="price"
        //               className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full pl-6 p-2.5"
        //               placeholder="0"
        //               required
        //             />
        //           </div>
        //         </div>

        //         <div className="flex-1">
        //           <label htmlFor="orderTarget" className="text-sm font-medium text-gray-800 block mb-2">
        //             Order Target
        //           </label>
        //           <input
        //             type="number"
        //             name="orderTarget"
        //             id="orderTarget"
        //             className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
        //             placeholder="Enter Order Target"
        //           />
        //         </div>
        //       </div>

        //       <div className="flex w-full space-x-5">
        //         <div className="flex-1">
        //           <label htmlFor="msmeNo" className="text-sm font-medium text-gray-800 block mb-2">
        //             MSME No.
        //           </label>
        //           <input
        //             type="text"
        //             name="msmeNo"
        //             id="msmeNo"
        //             className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
        //             placeholder="Enter MSME No."
        //           />
        //         </div>

        //         <div className="flex-1">
        //           <label htmlFor="panNo" className="text-sm font-medium text-gray-800 block mb-2">
        //             PAN No.
        //           </label>
        //           <input
        //             type="text"
        //             name="panNo"
        //             id="panNo"
        //             className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
        //             placeholder="Enter PAN No."
        //           />
        //         </div>
        //       </div>

        //       {/* <div className="flex justify-center items-center "> */}
        //       <Button
        //         type="submit"
        //         className="bg-lime-600 rounded-md text-white font-semibold hover:bg-lime-700 hover:text-white font-poppins p-2"
        //         onClick={(e) => {
        //           e.preventDefault(); // Prevents the default form submission behavior
        //           handleSubmit(); // Calls your submit function
        //         }}
        //       >
        //         Save
        //       </Button>
        //     </form>
        //   </div>
        // </div>

        <div className={`fixed inset-0 z-50 overflow-y-auto`}>
          <div className="fixed top-0 left-0 w-[100vw] h-full flex items-center overflow-y-hidden justify-center bg-black bg-opacity-50 z-52">
            <div className="bg-white p-6 rounded-md w-[50vw] mt-12 h-[80vh] overflow-y-hidden font-poppins">
              <div className="flex justify-between items-center ">
                <h1 className="text-2xl font-semibold mb-4">Enter Customer</h1>
                <button
                  type="button"
                  className="text-red-600 bg-transparent hover:bg-red-200 hover:text-red-700 rounded-md text-sm p-2 ml-auto inline-flex items-center"
                  onClick={() => handleCloseAddCustomer()}
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

              <form id="form" className="space-y-6 overflow-y-auto max-h-[65vh] pr-3" onSubmit={handleAddCustomerSubmit}>
                <div>
                  <label htmlFor="companyName" className="text-sm font-medium text-gray-800 block mb-2">
                    Company
                  </label>
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

                <div className="flex justify-between space-x-5">
                  <div className="w-[80%]">
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
                    <label htmlFor="mobile" className="text-sm font-medium text-gray-800 block mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
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

                <div className="flex w-full space-x-5">
                  <div className="flex-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-800 block mb-2">
                      Email
                    </label>
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

                  <div className="flex-1">
                    <label htmlFor="website" className="text-sm font-medium text-gray-800 block mb-2">
                      Website
                    </label>
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
                  <label htmlFor="industrySegment" className="text-sm font-medium text-gray-800 block mb-2">
                    Industry & Segment
                  </label>
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

                <div className="flex w-full space-x-5">
                  <div className="flex-1">
                    <label htmlFor="country" className="text-sm font-medium text-gray-800 block mb-2">
                      Country
                    </label>
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

                  <div className="flex-1">
                    <label htmlFor="state" className="text-sm font-medium text-gray-800 block mb-2">
                      State
                    </label>
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

                  <div className="flex-1">
                    <label htmlFor="city" className="text-sm font-medium text-gray-800 block mb-2">
                      City
                    </label>
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
                  <label htmlFor="receivables" className="text-sm font-medium text-gray-800 block mb-2">
                    Receivables
                  </label>
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
                  {errors.receivables && <p className="text-red-500 text-sm mt-1">{errors.receivables}</p>}
                </div>

                <div>
                  <label htmlFor="receivablesNotes" className="text-sm font-medium text-gray-800 block mb-2">
                    Receivables Notes
                  </label>
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

                <div className="flex justify-between space-x-5">
                  <div>
                    <label htmlFor="businessProspect" className="text-sm font-medium text-gray-800 block mb-2">
                      Business Prospect
                    </label>
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
                    {errors.businessProspect && <p className="text-red-500 text-sm mt-1">{errors.businessProspect}</p>}
                  </div>

                  <div>
                    <label htmlFor="orderTarget" className="text-sm font-medium text-gray-800 block mb-2">
                      Order Target
                    </label>
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
                    {errors.orderTarget && <p className="text-red-500 text-sm mt-1">{errors.orderTarget}</p>}
                  </div>
                </div>

                <div className="flex w-full space-x-5">
                  <div className="flex-1">
                    <label htmlFor="msmeNo" className="text-sm font-medium text-gray-800 block mb-2">
                      MSME No
                    </label>
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

                  <div className="flex-1">
                    <label htmlFor="panNo" className="text-sm font-medium text-gray-800 block mb-2">
                      PAN No
                    </label>
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

                <div className="flex justify-between items-center">
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
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                    Type
                  </label>
                  <select
                    id="title"
                    name="title"
                    value={newAddress.title}
                    onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  >
                    <option value="" disabled>
                      Select Title
                    </option>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="line1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    id="line1"
                    name="line1"
                    value={newAddress.address1}
                    onChange={(e) => setNewAddress({ ...newAddress, address1: e.target.value })}
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5 mb-2"
                    placeholder="Address Line 1"
                  />
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="line2">
                    Address Line 2
                  </label>

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
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="city">
                      City
                    </label>
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
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="state">
                      State
                    </label>
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
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="country">
                      Country
                    </label>
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
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="pincode">
                      Pincode
                    </label>
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
                <div className="flex items-center justify-between">
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

                <div className="flex items-center justify-between">
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
      {/* Modal for editing address */}
      {showEditAddressModal && (
        <div className="modal z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
            <div className="bg-white p-8 w-1/3 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Edit Address</h3>
              <div className="my-2">
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
              <div className="my-3">
                <label className="text-sm font-medium">Address 2:</label>
                <input
                  type="text"
                  name="address2"
                  value={editAddress.address2 || ''}
                  onChange={(e) => setEditAddress({ ...editAddress, address2: e.target.value })}
                  className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="my-3">
                  <label className="text-sm font-medium">City:</label>
                  <input
                    type="text"
                    name="city"
                    value={editAddress.city}
                    onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })}
                    className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  />
                </div>
                <div className="my-2">
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
              <div className="flex items-center justify-between">
                <div className="my-2">
                  <label className="text-sm font-medium">Country:</label>
                  <input
                    type="text"
                    name="country"
                    value={editAddress.country}
                    onChange={(e) => setEditAddress({ ...editAddress, country: e.target.value })}
                    className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  />
                </div>
                <div className="my-2">
                  <label className="text-sm font-medium">Pincode:</label>
                  <input
                    type="text"
                    name="pincode"
                    value={editAddress.pincode}
                    onChange={(e) => setEditAddress({ ...editAddress, pincode: e.target.value })}
                    className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  />
                </div>
              </div>
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

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default EnterOrder;
