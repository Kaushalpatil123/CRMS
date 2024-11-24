import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TextFields } from '@mui/icons-material';
import { Button, Checkbox, TextField } from '@mui/material';
import EditAddress from './components/address';
import ProductListPopup from './components/productListPopup';
import SelectCustomer from './components/selectCustomer';
import { getParticularOrder, EditParticularOrder, getAllExecutives, getAddressOfCustomer } from 'pages/utils/orders/api';
import toast, { Toaster } from 'react-hot-toast';
import BankDetailsComponent from '../../apps/bank/bank';
import ShippingAddress from './components/shippingAddress';
import { fetchBanks } from 'pages/utils/bank/api';
import { FaEdit, FaTrash, FaTrashAlt } from 'react-icons/fa';
import EditItemPopup from './components/EditItemPopup';
import AdditemPopUp from '../invoice/AdditemPopUp';

const EditOrder = () => {
  const server = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [salesCredit, setSalesCredit] = useState('');
  const [reference, setReference] = useState('');
  const [OrdersDate, setOrdersDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [itemList, setItemList] = useState([]);
  const [termsAndConditions, setTermsAndConditions] = useState('');
  // const [notes, setNotes] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [selectedBankIdd, setSelectedBankIdd] = useState(null);

  const [totalAmountBeforeTax, setTotalAmountBeforeTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [addExtraCharges, setAddExtraCharges] = useState([{ itemName: '', percentage: 0, amount: 0, _id: '' }]);
  const [addDiscount, setAddDiscount] = useState(0);
  const [showExtraChargePopup, setShowExtraChargePopup] = useState(false);
  const [openSelectCustomer, setOpenSelectCustomer] = useState(false);
  const [OpenAddShippingAddress, setOpenAddShippingAddress] = useState(false);

  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  const [extraChargeItem, setExtraChargeItem] = useState('');
  const [extraChargePercentage, setExtraChargePercentage] = useState('');
  const [extraChargeAmount, setExtraChargeAmount] = useState('');
  // const [discountItem, setDiscountItem] = useState('');
  // const [discountPercentage, setDiscountPrecentage] = useState('');
  // const [discountAmount, setDiscountAmount] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [Executive, setExecutive] = useState('');
  const [Status, setStatus] = useState('');
  const [Executives, setExecutives] = useState([]);
  const [orderNo, setOrderNo] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [customerPONo, setCustomerPoNo] = useState('');
  // const [address1, setAddress1] = useState('');
  // const [address2, setAddress2] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [type, setType] = useState('');
  const [terms, setTerms] = useState('');
  const [notes, setNotes] = useState('');
  const [banks, setBanks] = useState([]);
  const [isSameAsBilling, setIsSameAsBilling] = useState(false); // Default is checked
  const [popupMessage, setPopupMessage] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [openProductPopup, setOpenProductPopup] = useState(false);
  const [openProductListPopup, setOpenProductListPopup] = useState(false);
  const [openEditItemPopup, setOpenEditItemPopup] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editedItemIndex, setEditedItemIndex] = useState(null);
  const [emailChecked, setEmailChecked] = useState(false);
  const [whatsappChecked, setWhatsappChecked] = useState(false);
  const [printChecked, setPrintChecked] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({});
  const [selectedAddress, setSelectedAddress] = useState({});
  const [billingAddress, setBillingAddress] = useState({});
  const [editAddress, setEditAddress] = useState({});
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [showEditShippingModal, setShowEditShippingModal] = useState(false);
  const [editShippingAddress, setEditShippingAddress] = useState({});
  const [editedAddress, setEditedAddress] = useState({});
  const [ExtraItem, setExtraItem] = useState('');
  const [ExtraAmount, setExtraAmount] = useState('');
  const [ExtraChargeList, setExtraChargeList] = useState([]);
  const [extraChargeInput, setExtraChargeInput] = useState({ itemName: '', percentage: 0, amount: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // Track which item is being edited
  const [extraChargesTotal, setExtraChargesTotal] = useState('0');
  const [BoxCheck, setBoxCheck] = useState(false);
  const [editBillingAddress, setEditBillingAddress] = useState(selectedAddress || {});
  const [showEditBillingAddressModal, setShowEditBillingAddressModal] = useState(false);
  const [NewBankID, setNewBankID] = useState('');
  const [openItemDialog, setOpenItemDialog] = useState(false);


  const formatAddressToString = (address) => {
    return [address?.address1, address?.address2, address?.city, address?.state, address?.country, address?.pincode]
      .filter(Boolean)
      .join(', ');
  };
  const handleAddressChange = (e) => {
    const addressValue = e.target.value;
    console.log('addressValue', addressValue);
    setSelectedAddress(addressValue);
    setEditedAddress(addressValue);
    handleAddressSelect(addressValue);
  };

  const handleOpenAddAddress = () => setOpenAddAddress(true);
  const handleCloseAddAddress = () => setOpenAddAddress(false);
  const handleOpenSelectCustomer = () => setOpenSelectCustomer(true);
  const handleCloseSelectCustomer = () => setOpenSelectCustomer(false);
  const handleOpenAddShippingAddress = () => setOpenAddShippingAddress(true);
  const handleCloseAddShippingAddress = () => setOpenAddShippingAddress(false);
  const handleExtraChargeItemName = (e) => setExtraChargeItem(e.target.value);
  const handleExtraChargePercentage = (e) => setExtraChargePercentage(e.target.value);
  const handleExtraChargeAmount = (e) => setExtraChargeAmount(e.target.value);
  // const handleDiscountItemChange = (e) => setDiscountItem(e.target.value);
  // const handleDiscountPercentageChange = (e) => setDiscountPrecentage(e.target.value);
  // const handleDiscountAmountChange = (e) => setDiscountAmount(e.target.value);
  const handleOpenProductListPopup = () => setOpenProductListPopup(true);
  const handleCloseProductListPopup = () => setOpenProductListPopup(false);
  const [currentChargeId, setCurrentChargeId] = useState(null);
  const [roundoff, setRoundoff] = useState(0);
  const [displayItem,setDisplayItem]=useState(null);


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

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const handleOpenExtraChargePopup = () => {
    setExtraChargeInput(addExtraCharges || 0); // Pre-populate with existing value
    setShowExtraChargePopup(true);
  };

  const [Orders, setOrders] = useState([]);
  // const [Orders, setOrders] = useState({
  // contactPerson: '',
  // salesCredit: '',
  // address: {
  //   address1: '',
  //   address2: '',
  //   city: '',
  //   state: '',
  //   country: '',
  //   pincode: '',
  //   type: 'Home'
  // },
  // shippingAddress: '',
  // OrderNo:'',
  // reference: '',
  // OrdersDate: '',
  // dueDate: '',
  // ItemList: [],
  // termsAndConditions: '',
  // notes: '',
  // bankDetails: '',
  // totalAmountBeforeTax: 0,
  // total: 0,
  // grandTotal: 0,
  // addExtraCharges: 0,
  // addDiscount: 0
  // OrdersNo: '',
  // });

  // Convert from YYYY-MM-DD to DD-MM-YYYY for display
  const formatDateFromInput = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };

  const formatDateToInput = (date) => {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  };

  // If the orderDate is in DD-MM-YYYY format, convert it
  useEffect(() => {
    if (orderDate && orderDate.includes('-')) {
      const formattedDate = formatDateToInput(orderDate);
      formatDateToInput(formattedDate);
      setOrderDate(formattedDate);
    }
  }, []);

  // order date

  // Handle date changes from the input
  const handleOrderDate = (e) => {
    const date = e.target.value; // This will be in YYYY-MM-DD format
    console.log('Changed date ===>', date);
    const formattedDate = formatDateFromInput(date); // Convert back to DD-MM-YYYY
    setOrderDate(formattedDate); // Set the order date in the correct format
  };

  // Handle date changes from the input
  const handleDueDate = (e) => {
    const date = e.target.value; // This will be in YYYY-MM-DD format
    console.log('Changed date ===>', date);
    const formattedDate = formatDateFromInput(date); // Convert back to DD-MM-YYYY
    setDueDate(formattedDate); // Set the order date in the correct format
  };
  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    console.log('customer--->', customer);
    setSelectedCustomerId(customer.customerId);
    setSelectedCustomerName(customer.customerName);
    handleCloseSelectCustomer();
  };

  const handleSearchCustomer = () => {
    setSearchCustomerModal({
      open: true
    });
  };

  // Handle item quantity increase
  const handleIncreaseQuantity = (index) => {
    setItemList((prevItemList) => {
      const updatedItemList = [...prevItemList];
      const item = updatedItemList[index];

      // Increase quantity
      item.quantity += 1;

      // Recalculate amounts using helper function
      const { taxable, cgst, sgst, amount } = calculateAmounts(item.rate, item.gst, item.discount, item.quantity);

      // Update item values
      item.taxable = taxable;
      item.cgst = cgst;
      item.sgst = sgst;
      item.amount = amount;

      return updatedItemList;
    });
  };

  // Handle item quantity decrease
  const handleDecreaseQuantity = (index) => {
    setItemList((prevItemList) => {
      const updatedItemList = [...prevItemList];
      const item = updatedItemList[index];

      if (item.quantity > 1) {
        // Decrease quantity
        item.quantity -= 1;

        // Recalculate amounts using helper function
        const { taxable, cgst, sgst, amount } = calculateAmounts(item.rate, item.gst, item.discount, item.quantity);

        // Update item values
        item.taxable = taxable;
        item.cgst = cgst;
        item.sgst = sgst;
        item.amount = amount;

        return updatedItemList;
      }

      // Remove the item if quantity is 1 and the button is clicked
      return updatedItemList.filter((_, i) => i !== index);
    });
  };

  // Handle item removal
  const handleDeleteItem = (index) => {
    setItemList((prevItemList) => {
      return prevItemList.filter((_, i) => i !== index);
    });
  };

  const handleAddressUpdate = (newAddress) => {
    setAddress(newAddress); // Update billing address
    // if (shippingAddress) {
    //   setShippingAddress(newAddress); // Sync shipping address with billing address
    // }
    handleCloseAddAddress(); // Close modal after updating
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

  const handleEditExtraCharge = (index) => {
    const selectedCharge = addExtraCharges[index];
    if (selectedCharge) {
      // Ensure the selected charge exists
      setExtraChargeInput(selectedCharge);
      setEditIndex(index);
      setIsEditing(true); // Set editing state
      setShowExtraChargePopup(true);
    } else {
      console.error('Selected charge does not exist.');
    }
  };

  // const deleteExtraCharge = (index) => {
  //   setAddExtraCharges((prevState) => {
  //     const updatedExtraCharges = prevState.addExtraCharges.filter((_, i) => i !== index); // Filter out the charge at the given index
  //     // return {
  //     //   ...prevState,
  //     //   addExtraCharges: updatedExtraCharges,
  //     // };
  //   });
  // };

  const deleteExtraCharge = (index) => {
    setAddExtraCharges((prevState) => {
      const updatedExtraCharges = prevState.filter((_, i) => i !== index); // Filter out the charge at the given index
      return updatedExtraCharges; // Return the updated state
    });
  };

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
          // itemDescription: `${product.itemname} - ${product.description}`,
          itemDescription: `${product.itemname}${product.description ? ' - ' + product.description : ''}`,
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

  const updateTotals = () => {
    const totalBeforeTax = itemList?.reduce((sum, item) => sum + parseFloat(item.taxable), 0);
    // const totalTax = itemList?.reduce((sum, item) => sum + (parseFloat(item.cgst) + parseFloat(item.sgst)), 0);
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

    console.log('Total before tax----------->', totalBeforeTax);
    console.log('Total tax--------->', totalTax);

    const extraChargesTotal = ExtraChargeList?.reduce((sum, charge) => sum + parseFloat(charge.amount), 0) || 0;

    const discount = parseFloat(addDiscount) || 0;

    // const roundoffValue = Math.floor(roundedGrandTotal);
    const calculatedExtraChargesTotal = addExtraCharges.reduce((sum, charge) => sum + parseFloat(charge.amount), 0);
    setExtraChargesTotal(calculatedExtraChargesTotal.toFixed(2));
    console.log('extra cahrge total--->', calculatedExtraChargesTotal);

    const grandTotal = totalAmount - discount + calculatedExtraChargesTotal;
    console.log('Grand total:-------->', grandTotal);
    const roundoffValue = Math.floor(grandTotal);

    setTotalAmountBeforeTax(totalBeforeTax?.toFixed(2));
    setTotal(totalAmount.toFixed(2));
    setGrandTotal(grandTotal.toFixed(2));
    setRoundoff(roundoffValue);
  };

  useEffect(() => {
    updateTotals();
  }, [itemList, addExtraCharges, addDiscount, grandTotal, roundoff]);

  const getOrder = async () => {
    const order = await getParticularOrder(id);
    console.log('this is the perticular order------>', order);
    setFirstName(order?.customer.firstName);
    // console.log('this is the perticular order------>', firstName);

    setLastName(order?.customer.lastName);
    setSelectedCustomerId(order?.customer._id);
    setContactPerson(order?.partyDetails.contactPerson);
    setSalesCredit(order?.partyDetails.salesCredit);
    setExecutive(order?.partyDetails.executive);
    setOrderNo(order?.documentDetails.orderNumber);
    setReference(order?.documentDetails.reference);
    setOrderDate(order?.documentDetails.orderDate);
    setDueDate(order?.documentDetails.dueDate);
    setCustomerPoNo(order?.documentDetails.customerPoNumber);
    setTerms(order?.termsConditions);
    setNotes(order?.notes);
    setTotal(order?.total);
    console.log('order grandtotal---->', order?.grandTotal);
    setGrandTotal(order?.grandTotal);
    setBankDetails(order?.bankDetails);
    setSelectedBankIdd(order?.bankDetails._id);
    console.log('this is the perticular bankDetails------>', bankDetails);
    console.log('this is the perticular selectedBankIdd------>', selectedBankIdd);

    setSelectedAddress(order?.address);
    setIsSameAsBilling(order?.partyDetails.shippingAddress);

    // setDiscountAmount(order?.addDiscount.amount);
    // setDiscountItem(order?.addDiscount.itemName);
    // setDiscountPrecentage(order?.addDiscount.percentage);
    setExtraChargeAmount(order?.addExtraCharges[0]?.amount);
    setExtraChargeItem(order?.addExtraCharges[0]?.itemName);
    setExtraChargePercentage(order?.addExtraCharges[0]?.percentage);
    setItemList(order?.itemList);
    setOrders(order?.itemList);
    console.log(
      'orderextracharges--->',
      order?.addExtraCharges?.reduce((sum, item) => sum + (item.amount || 0), 0)
    );
    const addextrachargetotal = order?.addExtraCharges?.reduce((sum, item) => sum + (item.amount || 0), 0);
    setExtraChargesTotal(order?.addExtraCharges?.reduce((sum, item) => sum + (item.amount || 0), 0));
  };

  useEffect(() => {
    if (isSameAsBilling) {
      setShippingAddress(billingAddress);
      setShippingAddress(billingAddress);
    }
  }, [billingAddress, isSameAsBilling]);

  useEffect(() => {
    console.log('this is the perticular bankDetails------>', bankDetails);
    console.log('this is the perticular selectedBankIdd------>', selectedBankIdd);
  }, [bankDetails, selectedBankIdd]);

  useEffect(() => {
    getOrder();
  }, []);
  const getBanks = async () => {
    const token = localStorage.getItem('token');
    const Banks = await fetchBanks(token);
    console.log('this is the all Banks------>', Banks);
    setBanks(Banks);
  };
  useEffect(() => {
    getBanks();
  }, []);
  useEffect(() => {
    console.log('this is the shippingAddress ------>', shippingAddress);
    console.log('this is the billingAddress ------>', billingAddress);
  }, [shippingAddress, billingAddress]);

  // Helper function to format the date to dd-mm-yyyy
  const formatDateToDDMMYYYY = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };

  const OrderSubmit = async () => {
    const token = localStorage.getItem('token');
    console.log('address came from address.js--->', address);
    console.log('Selected customer ID---------------->', selectedCustomerId);

    if (!selectedCustomerId) {
      console.error('Customer ID is required--------------->');
      return;
    }
    console.log('order ki datek format---->', orderDate);

    // Ensure that orderDate and dueDate are properly formatted to DD-MM-YYYY
    const formattedOrdersDate = orderDate;
    // ? formatDateToDDMMYYYY(orderDate)
    // : formatDateToDDMMYYYY(new Date().toISOString().split('T')[0]);
    const formattedDueDate = dueDate;

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

    const nextActions = {
      email: emailChecked, // true or false based on checkbox state
      whatsapp: whatsappChecked, // true or false based on checkbox state
      print: printChecked // true or false based on checkbox state
    };

    // Filter out empty values and join the remaining non-empty values with a comma
    const shippingAddressString = Object.values(shippingAdd)
      .filter((value) => value.trim() !== '') // Exclude empty strings or strings with only spaces
      .join(',');

    console.log('Shipping address string:', shippingAddressString);

    // Correctly structure the partyDetails
    const partyDetails = {
      contactPerson: contactPerson || '',
      salesCredit: salesCredit === 'Yes' || salesCredit === 'No' ? salesCredit : 'No',
      shippingAddress: shippingAddressString || 'Same as Billing Address',
      executive: Executive
    };

    // Correctly structure documentDetails
    const documentDetails = {
      orderNumber: orderNo,
      reference: reference || '',
      orderDate: formattedOrdersDate,
      dueDate: formattedDueDate,
      customerPoNumber: customerPONo
    };
    const validAddExtraCharges =
      Array.isArray(addExtraCharges) && addExtraCharges.length > 0
        ? addExtraCharges.map((charge) => ({
            itemName: charge.itemName || 'Extra Charge',
            percentage: charge.percentage || 0,
            amount: charge.amount || 0
            // _id: ObjectId.isValid(charge._id) ? charge._id : new ObjectId().toString(), // Ensure valid ObjectId
          }))
        : [];
    const addExtraChargesArray = validAddExtraCharges;
    // const addDiscount = {
    //   itemName: discountItem,
    //   percentage: discountPercentage,
    //   amount: discountAmount
    // };
    // Correctly structure the itemList
    console.log('itemlist---->', itemList);
    const formattedItemList = itemList.map((item) => ({
      itemDescription: item.itemandDescription || '',
      hsnSac: item.hsnSac || '',
      quantity: parseFloat(item.quantity) || 0,
      unit: item.unit || 0,
      rate: parseFloat(item.rate) || 0,
      discount: parseFloat(item.discount) || 0,
      taxable: parseFloat(item.taxable) || 0,
      cgst: parseFloat(item.cgst) || 0,
      sgst: parseFloat(item.sgst) || 0,
      amount: parseFloat(item.amount) || 0
    }));

    console.log('item list--->', formattedItemList);
    // Construct payload
    const payload = {
      customer: selectedCustomerId,
      ...(partyDetails && { partyDetails }), // Only include if not empty
      // ...(shippingAddressString && { shippingAddress: shippingAddressString }), // Only include if not empty
      ...(documentDetails && { documentDetails }), // Only include if not
      ...(nextActions && { nextActions }),
      ...(addExtraCharges && { addExtraCharges: addExtraChargesArray }),
      // ...(addDiscount && { addDiscount }),
      ...(formattedItemList && formattedItemList.length > 0 && { itemList: formattedItemList }), // Include if list is not empty
      ...(billingAddress && { address: billingAddress }), // Only include if not empty
      termsConditions: termsAndConditions ? termsAndConditions.split('\n') : ['Payment due in 30 days.', 'Warranty period: 1 year.'],
      ...(bankDetails && NewBankID && { bankDetails: NewBankID }), // Include if bankDetails._id exists
      ...(notes && { notes }), // Only include if not empty
      ...(total && parseFloat(total) > 0 && { total: parseFloat(total) }), // Include if total is greater than 0
      ...(grandTotal && parseFloat(grandTotal) > 0 && { grandTotal: parseFloat(grandTotal) }), // Include if grandTotal is greater than 0
      // addExtraCharges: [
      //   {
      //     itemName: itemInput || 'itemName',
      //     amount: parseFloat(amountInput) || 0
      //   }
      // ]
      // addDiscount: {
      //   itemName: discountAmountInput || 'itemName',
      //   amount: parseFloat(discountInput) || 0
      // },
      ...(Status && { status: Status }) // Only include if Status is not empty
    };

    console.log('Payload being sent:', payload);

    try {
      // const response = await EditParticularOrder(payload);
      const editedOrder = await EditParticularOrder(id, payload, token);
      // console.log('Order updated successfully:', editedOrder);
      toast.success('Order Updated Successfully');
      setTimeout(() => {
        navigate('/apps/list');
      }, 2000);
      // Uncomment if you want to navigate after success
    } catch (error) {
      toast.error('Error Updating Order');
      console.error('Failed to create order:', error);
    }
  };
  useEffect(() => {
    const fetchAllExecutives = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getAllExecutives(token);

        console.log('Executives data:', response?.data); // Log the data format

        // If response?.data is not an array, convert it or provide fallback
        setExecutives(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchAllExecutives();
  }, []);

  const handleOpenEditPopup = (item) => {
    setSelectedItem(item);
    setOpenEditPopup(true);
  };
  const handleCloseEditPopup = () => {
    setOpenEditPopup(false);
    setSelectedItem(null);
  };
  //  const handleEditItem = (item, index) => {
  //    setEditingItem(item);
  //    setEditedItemIndex(index);
  //    setOpenEditItemPopup(true);
  //  };

  const handleSaveEditedItem = (editedItem) => {
    setItemList((prevItemList) => prevItemList.map((item) => (item._id === editedItem._id ? editedItem : item)));
    updateTotals();
    setOpenItemDialog(false)
  };
  // const handleCheckboxChange = (e) => {
  //   setIsSameAsBilling(e.target.checked); // Update the state based on checkbox
  // };
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setBoxCheck(checked);
    setIsSameAsBilling(checked);
    if (!checked) {
      setShippingAddress(billingAddress);
    }
    console.log('this is address---->', billingAddress);
  };

  const handleGetShippingAddress = () => {
    handleOpenAddShippingAddress();
    fetchAddress();
  };
  const fetchAddress = async () => {
    const token = localStorage.getItem('token');
    console.log('selected customer id-->', selectedCustomerId);
    if (selectedCustomerId === null) {
      console.log('isme aaye--->');
      toast.error('Select Customer First');
    } else {
      const address = await getAddressOfCustomer(selectedCustomerId, token);
      // Logic to fetch address or perform any other task
      console.log('Fetching address by id...', address);
      setAddress(address);
    }
  };
  useEffect(() => {
    fetchAddress();
  }, []);

  const handleShippingAddressUpdate = (newAddress) => {
    console.log('final shipping address--->', newAddress);
    setShippingAddress(newAddress); // Update billing address
    handleCloseAddShippingAddress(); // Close modal after updating
  };
  const handleGetAddress = () => {
    handleOpenAddAddress();
    fetchAddress();
  };

  // useEffect(() => {
  //   console.log('Item List:', itemList);
  //   updateTotals();
  // }, [itemList, addExtraCharges, addDiscount]);

  // const handleUpdateItem = async (formData) => {
  //   // const updatedItemList = quotation.ItemList.map((item, i) => {
  //   //   if (i === editedItemIndex) {
  //   //     return {
  //   //       ...item,
  //   //       ...updatedItem
  //   //     };
  //   //   }
  //   //   return item;
  //   // })
  //   // setQuotation((prevState) => ({
  //   //   ...prevState,
  //   //   ItemList: updatedItemList
  //   // }));
  //   // const cleanQuotation = {
  //   //   ...quotation,
  //   //   ItemList: updatedItemList.map((item) => ({
  //   //     itemandDescription: item.itemandDescription,
  //   //     hsnSac: item.hsnSac,
  //   //     quantity: item.quantity,
  //   //     unit: item.unit,
  //   //     rate: item.rate,
  //   //     discount: item.discount,
  //   //     taxable: item.taxable,
  //   //     cgst: item.cgst,
  //   //     sgst: item.sgst,
  //   //     amount: item.amount
  //   //   }))
  //   // };

  //   // try {
  //   //   await updateQuotationById(quotationId, cleanQuotation);
  //   //   await EditParticularOrder(id, payload);
  //   // } catch (error) {
  //   //   console.error('Error updating quotation with edited item:', error.response ? error.response.data : error);
  //   // }
  //   // console.log('this is updated formdata------------>', formData);
  //   setOpenEditItemPopup(false);
  // };
  const handleAddAddressSubmit = () => {
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses); // Add new address to the list
    setSelectedAddress(newAddress); // Set selected address to the newly added address
    setBillingAddress(newAddress); // Also update billingAddress
    setShowAddAddressModal(false); // Close the add address modal
  };
  const handleEditShippingSubmit = () => {
    setShippingAddress(editShippingAddress); // Update shipping address with the edited address
    setShowEditShippingModal(false); // Close modal
  };

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
  const handleEditAddressSubmit = () => {
    setSelectedAddress(editAddress); // Update selectedAddress with the edited address
    setBillingAddress(editAddress); // Update billing address
    if (isSameAsBilling) {
      setShippingAddress(editAddress); // Sync shipping address if checkbox is checked
    }
    setShowEditAddressModal(false);
  };

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
    setBillingAddress(selectedAddress);
  }, [selectedAddress]);

  // const handleExtraChargeSubmit = () => {
  //   // Create a new object with the current ExtraItem and ExtraAmount
  //   const newCharge = {
  //     itemName: ExtraItem,
  //     amount: parseFloat(ExtraAmount) || 0 // Parse amount as number
  //   };
  //   console.log('this is new charge ---->', newCharge);
  //   // Add the new object to the ExtraChargeList
  //   setExtraChargeList((prevList) => [...prevList, newCharge]);

  //   // Reset input fields
  //   setExtraItem('');
  //   setExtraAmount('');
  //   // updateTotals();
  //   // Close the popup
  //   setShowExtraChargePopup(false);
  //   // updateTotals();
  // };

  const generateId = () => '_' + Math.random().toString(36).substr(2, 9);
  const handleExtraChargeSubmit = (e) => {
    e.preventDefault();

    if (!extraChargeInput.itemName || parseFloat(extraChargeInput.amount) <= 0) {
      return; // Do not proceed if inputs are invalid
    }
    const newCharge = {
      itemName: extraChargeInput.itemName || 'Extra Charge',
      percentage: parseFloat(extraChargeInput.percentage) || 0,
      amount: parseFloat(extraChargeInput.amount) || 0,
      _id: isEditing ? currentChargeId : generateId() // Use current ID if editing
    };

    if (isEditing) {
      setAddExtraCharges((prevCharges) => prevCharges.map((charge) => (charge._id === currentChargeId ? newCharge : charge)));
      setIsEditing(false); // Reset editing state
      setCurrentChargeId(null); // Reset current charge ID
    } else {
      setAddExtraCharges((prevCharges) => [...prevCharges, newCharge]);
    }

    setExtraChargeInput({ itemName: '', percentage: 0, amount: 0 }); // Clear inputs
    // setShowExtraChargePopup(false);
    updateTotals(); // Recalculate totals after adding/updating the extra charge
  };

  useEffect(() => {
    updateTotals();
    console.log('this is new ExtraChargeList ---->', ExtraChargeList);
  }, [ExtraChargeList]);

  const handleEditChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from the event target
    setEditedAddress((prev) => ({
      ...prev,
      [name]: value // Update the specific property based on the input's name
    }));
  };
  useEffect(() => {
    setEditedAddress({ ...selectedAddress });
  }, [selectedAddress]);

  const handleSaveAddress = () => {
    setSelectedAddress({ ...editedAddress });
    // setShowAddAddressModal(false);
    setShowEditAddressModal(false);
  };

  const handleEditBillingAddressSubmit = () => {
    setShippingAddress(editBillingAddress);
    setShowEditBillingAddressModal(false);
    console.log('this is edited address------->', editBillingAddress);
  };
  const changeBankId = (id) => {
    setNewBankID(id);
    console.log('this is id from bank component=======>', id);
  };
  const handleAddItem = (index) => {
    const particularItem=itemList.find((_,i)=>i===index)
    setDisplayItem(particularItem);
    setOpenItemDialog(true);
  };

  return (
    <>
      <div className="flex min-h-screen">
        <main className="flex-1 p-8 font-poppins">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold mb-4">Edit Sales Order</h1>
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
                      value={selectedCustomerName || `${firstName} ${lastName}`}
                      // placeholder={`${firstName} ${lastName}`}
                      onChange={(e) => setReference(e.target.value)}
                    />
                    <Button
                      className="bg-red-600 text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter p-2.5 "
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
                      className=" bg-red-600 text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter  p-2.5 "
                      onClick={handleAddCustomer}
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
                {/* <AddCustomer open={openAddCustomer} handleClose={handleCloseAddCustomer} /> */}
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <div className=" w-[50%] rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
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
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      // onChange={(e) => setSelectedExecutive(e.target.value)} // Update state on change
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center justify-between gap-3 ">
                      <div className="w-[90%]">
                        <label className="text-sm font-medium" htmlFor="address">
                          Customer Address:
                        </label>
                        {/* <select
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-500 focus:border-red-500 w-full p-2.5"
                        onChange={(e) => handleAddressSelect(e.target.value)}
                        onChange={handleAddressChange}

                        value={`${selectedAddress?.address1 || " "}, ${selectedAddress?.address2}, ${selectedAddress?.country}, ${selectedAddress?.state}, ${selectedAddress?.city}, ${selectedAddress?.pincode}`}

                        required
                      >
                        <option value="">Select Customer Address</option>
                        {addresses.map((address) => (
                          <option key={address._id} value={address._id}>
                            {address.type}
                          </option>
                        ))}
                      </select> */}
                        <select
                          className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-500 focus:outline-none focus:border-red-500 block w-full p-2.5"
                          name="address"
                          // value={`${selectedAddress?.address1 || " "}, ${selectedAddress?.address2}, ${selectedAddress?.country}, ${selectedAddress?.state}, ${selectedAddress?.city}, ${selectedAddress?.pincode}`}
                          onChange={handleAddressChange}
                          // onChange={(e) => handleAddressSelect(e.target.value)}
                          required
                        >
                          <option value={formatAddressToString(selectedAddress)}>{formatAddressToString(selectedAddress)}</option>

                          {/* <option value="">{`${selectedAddress.address1 || NA}, ${selectedAddress.address2 || NA}, ${selectedAddress.country || NA}, ${selectedAddress.state || NA}, ${selectedAddress.city || NA}, ${selectedAddress.pincode || NA}`}</option> */}
                          {addresses.map((address) => (
                            <option key={address._id} value={address._id}>
                              {/* {address} */}
                              {`${address?.address1 || 'NA'}, ${address?.address2 || 'NA'}, ${address?.country || 'NA'}, ${
                                address?.state || 'NA'
                              }, ${address?.city || 'NA'}, ${address?.pincode || 'NA'}`}
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

                    {selectedAddress && (
                      <div className="relative w-full mt-4">
                        <label className="text-sm font-medium" htmlFor="displayAddress">
                          Selected Address:
                        </label>
                        <textarea
                          className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-500 focus:border-red-500 w-full p-2.5"
                          name="displayAddress"
                          value={`${selectedAddress.address1 || 'NA'}, ${selectedAddress.address2 || 'NA'}, ${
                            selectedAddress.country || 'NA'
                          }, ${selectedAddress.state || 'NA'}, ${selectedAddress.city || 'NA'}, ${selectedAddress.pincode || 'NA'}`}
                          readOnly
                        />
                        <button
                          className="absolute top-8 right-2 text-red-600 hover:text-red-700"
                          onClick={() => {
                            setEditAddress(selectedAddress);
                            setShowEditAddressModal(true);
                            //  setShowAddAddressModal(true)
                          }}
                        >
                          <FaEdit size={22} />
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Shipping Address */}
                  {selectedAddress && (
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={BoxCheck}
                          onChange={handleCheckboxChange}
                          className="h-5 w-5 text-red-600 bg-gray-100 border-red-600 rounded-md focus:ring-red-500 accent-red-600 cursor-pointer"
                        />
                        <span className="text-gray-800">Same as Billing Address</span>
                      </div>

                      {!BoxCheck && (
                        <div className="flex items-center justify-between gap-3">
                          <div className="mt-4 w-[90%]">
                            <label className="text-sm font-medium" htmlFor="shippingAddress">
                              Shipping Address:
                            </label>
                            <div className="relative">
                              <textarea
                                className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-500 focus:border-red-500 w-full p-2.5"
                                name="shippingAddress"
                                value={formatAddressToString(shippingAddress) || formatAddressToString(billingAddress)}
                                readOnly
                              />
                              <button
                                className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                                onClick={() => {
                                  setEditBillingAddress(shippingAddress || billingAddress);
                                  console.log('this is the address====>', shippingAddress, billingAddress);
                                  setShowEditBillingAddressModal(true);
                                }}
                              >
                                <FaEdit size={22} />
                              </button>
                            </div>
                          </div>
                          <Button
                            className="bg-red-600 w-[10%] rounded-md mt-2 text-white p-2.5 font-semibold hover:bg-red-700 hover:text-white font-inter"
                            onClick={() => {
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
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
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
                      htmlFor="salesCredit"
                    >
                      Status:
                    </label>
                    <div className="relative">
                      <select
                        id="salesCredit"
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="Received">Received</option>
                        <option value="WIP">WIP</option>
                        <option value="Query">Query</option>
                        <option value="Packed">Packed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Done">Done</option>
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
                        value={Status}
                        onChange={(e) => setExecutive(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                      >
                        <option value="none">{Executive}</option>
                        {Array.isArray(Executives) && Executives.length > 0 ? (
                          Executives.map((addr, index) => (
                            <option key={index} value={addr.id}>
                              {addr.name || addr}
                            </option>
                          ))
                        ) : (
                          <option disabled>Loading...</option>
                        )}
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
              {/* <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
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
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    for="salesCredit"
                  >
                    Sales Credit :
                  </label>
                  <div className="relative">
                    <select
                      id="salesCredit"
                      onChange={(e) => setSalesCredit(e.target.value)}
                      value={salesCredit}
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
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
                <div>
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
                </div>
                <div>
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="samebillingaddress"
                  >
                    Shipping Address :
                  </label>

                  <Checkbox
                    type="checkbox"
                    role="checkbox"
                    aria-checked={isSameAsBilling}
                    checked={isSameAsBilling} 
                    onChange={handleCheckboxChange} 
                    id="samebillingaddress"
                  />
                  <span>Same as Billing address</span>

                  {!isSameAsBilling && ( 
                    <Button
                      className="bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter rounded-md font-semibold w-full p-2"
                      onClick={handleGetShippingAddress}
                    >
                      + Click here to add an address.
                    </Button>
                  )}
                </div>

                <EditAddress
                  open={openAddAddress}
                  address={address}
                  handleClose={handleCloseAddAddress}
                  handleAddressUpdate={handleAddressUpdate}
                  // setAddress={setAddress}
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
                      onChange={(e) => setExecutive(e.target.value)}
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                    >
                      <option value="none">{Executive}</option>
                      {Array.isArray(Executives) && Executives.length > 0 ? (
                        Executives.map((addr, index) => (
                          <option key={index} value={addr.id}>
                            {addr.name || addr}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading...</option> 
                      )}
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
            </div> */}
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
                      value={orderNo}
                      onChange={(e) => setOrderNo(e.target.value)}
                      // placeholder={orderNo}
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="reference"
                    >
                      Reference :
                    </label>
                    {/* <input
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                      id="reference"
                      // placeholder={reference}
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
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
                  <div className="flex gap-2 w-full">
                    <div className="w-[50%]">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="orderDate"
                      >
                        Order Date :
                      </label>
                      <input
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                        id="orderDate"
                        type="date"
                        value={orderDate ? formatDateToInput(orderDate) : ''}
                        onChange={handleOrderDate}
                      />
                      {console.log('ordeer date---->', orderDate)}
                    </div>
                    <div className="w-[50%]">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="dueDate"
                      >
                        Due Date :
                      </label>
                      <input
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                        id="dueDate"
                        type="date"
                        // value={dueDate}
                        value={dueDate ? formatDateToInput(dueDate) : ''}
                        onChange={handleDueDate}
                        // placeholder={dueDate}
                        // onChange={(e) => setDueDate(e.target.value)}
                      />
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
                      value={customerPONo}
                      // placeholder={customerPONo}
                      onChange={(e) => setCustomerPoNo(e.target.value)}
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
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">
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
                        Amt (₹)
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
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white"> {item.itemDescription}</td>
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">{item.hsnSac}</td>
                        <td className="p-2 text-left align-middle border border-gray-300 bg-white">{item.quantity}</td>
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
              <Button
                className="mt-4 bg-red-600 text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                // onClick={handleOpenProductListPopup}
                onClick={handleOpenProductListPopup}
              >
                + Add Item
              </Button>
            </div>

            {/* {openEditItemPopup && (
              <EditItemPopup item={editingItem} onClose={() => setOpenEditItemPopup(false)} onSave={handleUpdateItem} />
            )} */}

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
                // placeholder={terms}
                id="termsAndConditions"
                value={terms}
                onChange={(e) => setTermsAndConditions(e.target.value)}
              ></textarea>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                <h2 className="text-2xl font-semibold mb-4">Notes</h2>
                <textarea
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                  // placeholder={notes}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
              <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                <h2 className="text-2xl font-semibold mb-4">Bank Details</h2>
                <BankDetailsComponent
                  setBankDetails={bankDetails}
                  BankIdd={selectedBankIdd}
                  changeBankId={changeBankId}
                  // matchedId={selectedBankIdd}
                />
                {/* <div className="relative">
                  <select
                    id="copyFrom"
                    onChange={() => setBankDetails(bank.id)}
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                  >
                    <option value="none">{bankDetails}</option>
                    {banks.map((bank, index) => (
                      <option key={index} value={bank.id}
                      >
                        {bank.bankname}
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
                </div> */}
              </div>
              <div className="rounded-md border bg-white text-gray-800 shadow-sm p-4">
                <h2 className="text-2xl font-semibold mb-4">Total</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Amount before Tax :</span>
                    <span>₹ {Number(totalAmountBeforeTax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount :</span>
                    <span>₹ {Number(total || 0).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between ">
                    <span>Extra Charges :</span>
                    <span>₹ {Number(extraChargesTotal || 0).toFixed(0)}</span> {/* Show rounded roundoff */}
                  </div>

                  <div className="flex justify-between font-bold">
                    <span>Grand Total :</span>
                    <span>₹ {Number(grandTotal || 0).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Roundoff :</span>
                  <span>₹ {Number(roundoff || 0).toFixed(0)}</span> {/* Show rounded roundoff */}
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
            <div className="grid grid-cols-2 gap-4">
              {/* <div className="rounded-md border bg-white text-card-foreground shadow-sm p-4" data-v0-t="card">
                <h2 className="text-2xl font-semibold mb-4">Next Actions</h2>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      type="checkbox"
                      role="checkbox"
                      aria-checked="false"
                      data-state="unchecked"
                      value="on"
                      padding="checkbox"
                      id="shippingAddress"
                      onChange={handleEmailChange}
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
                      aria-checked="false"
                      data-state="unchecked"
                      value="on"
                      padding="checkbox"
                      id="shippingAddress"
                      onChange={handleWhatsappChange}
                    />
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="shareWhatsapp"
                    >
                      Share by Whatsapp
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      type="checkbox"
                      role="checkbox"
                      aria-checked="false"
                      data-state="unchecked"
                      value="on"
                      padding="checkbox"
                      id="shippingAddress"
                      onChange={handlePrintChange}
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
                          {addExtraCharges?.map((charge, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="text-center py-2 text-gray-800">{charge.itemName ? charge.itemName : 'N/A'}</td>
                              <td className="text-center py-2 text-gray-800">{charge.amount ? charge.amount : 0}</td>
                              <td className="text-center py-2">
                                <button onClick={() => handleEditExtraCharge(index)} className="text-blue-600 hover:underline mr-2">
                                  <FaEdit />
                                </button>
                                <button onClick={() => deleteExtraCharge(index)} className="text-red-600 hover:underline">
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
                          <button className="bg-lime-600 rounded-md text-white p-2 font-semibold hover:bg-lime-700 w-28" type="submit">
                            {isEditing ? 'Save' : 'Add'}
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

              {/* Discount Popup */}
              {/* {showDiscountPopup && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                    <h2 className="text-lg font-semibold">Add Discount</h2>
                    <label>Item Name:</label>
                    <input
                      type="text"
                      value={discountItem}
                      onChange={handleDiscountItemChange}
                      className="mt-1 w-full p-2.5 border border-gray-300 rounded-md text-gray-800 focus:ring-red-600 focus:border-red-600"
                    />
                    <label>Percentage:</label>
                    <input
                      type="number"
                      value={discountPercentage}
                      onChange={handleDiscountPercentageChange}
                      className="mt-1 w-full p-2.5 border border-gray-300 rounded-md text-gray-800 focus:ring-red-600 focus:border-red-600"
                    />
                    <label>Amount:</label>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={handleDiscountAmountChange}
                      className="mt-1 w-full p-2.5 border border-gray-300 rounded-md text-gray-800 focus:ring-red-600 focus:border-red-600"
                    />
                    <Button
                      onClick={() => setShowDiscountPopup(false)}
                      className="bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter px-8"
                    >
                      Save
                    </Button>
                    <button
                      onClick={() => setShowDiscountPopup(false)}
                      className="bg-red-600 rounded-md text-white p-2 font-semibold hover:bg-red-700 hover:text-white font-inter px-8 mt-2 ml-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )} */}
            </div>
          </section>
          <div className="mt-4 space-x-2">
            <Button
              onClick={OrderSubmit}
              className="bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter px-8"
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
      {addCustomerModal.open && (
        <div className="fixed top-0 left-0 w-[100vw] h-full flex items-center overflow-y-hidden justify-center bg-black bg-opacity-50 z-52">
          <div className="bg-white p-6 rounded-md w-[50vw] mt-12 h-[80vh] overflow-y-hidden font-poppins">
            <div className="flex justify-between items-center p-2.5">
              <h1 className="text-2xl font-semibold mb-4">Enter Customer</h1>
              <Button
                type="Button"
                className="text-gray-600 rounded-md bg-transparent hover:bg-gray-200 hover:text-gray-900 text-sm p-2 ml-auto inline-flex items-center"
                data-modal-toggle="authentication-modal"
                onClick={() => handleAddCustomerModalClose()}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
            </div>

            <form
              id="form"
              className="space-y-6 overflow-y-auto max-h-[65vh] pr-3"
              onSubmit={(e) => {
                handleAddCustomerModalClose();
                e.preventDefault();
              }}
            >
              <div>
                <label htmlFor="company" className="text-sm font-medium text-gray-800 block mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
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
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none p-1"
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
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-[42%] p-2.5"
                      placeholder="First Name"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-[42%] p-2.5"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>

                <div className="">
                  <label htmlFor="mobileNumber" className="text-sm font-medium text-gray-800 block mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">+91</span>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full pl-9 p-2.5"
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
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
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
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                    placeholder="Enter Website"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="industry" className="text-sm font-medium text-gray-800 block mb-2">
                  Industry & Segment
                </label>
                <input
                  type="text"
                  name="industry"
                  id="industry"
                  className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
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
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                    placeholder="Enter Country"
                    required
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
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                    placeholder="Enter State"
                    required
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
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                    placeholder="Enter City"
                    required
                  />
                </div>
              </div>

              <div className="flex w-full space-x-5">
                <div className=" w-[30%]">
                  <label htmlFor="receivables" className="text-sm font-medium text-gray-800 block mb-2">
                    Receivables
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full pl-6 p-2.5"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="flex-1" s>
                  <label htmlFor="receivableNotes" className="text-sm font-medium text-gray-800 block mb-2">
                    Receivable Notes
                  </label>
                  <input
                    type="text"
                    name="receivableNotes"
                    id="receivableNotes"
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                    placeholder="Enter Receivable Notes"
                  />
                </div>
              </div>

              <div className="flex w-full space-x-5">
                <div className="flex-1">
                  <label htmlFor="businessProspects" className="text-sm font-medium text-gray-800 block mb-2">
                    Business Prospects (Annual)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full pl-6 p-2.5"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label htmlFor="orderTarget" className="text-sm font-medium text-gray-800 block mb-2">
                    Order Target
                  </label>
                  <input
                    type="number"
                    name="orderTarget"
                    id="orderTarget"
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                    placeholder="Enter Order Target"
                  />
                </div>
              </div>

              <div className="flex w-full space-x-5">
                <div className="flex-1">
                  <label htmlFor="msmeNo" className="text-sm font-medium text-gray-800 block mb-2">
                    MSME No.
                  </label>
                  <input
                    type="text"
                    name="msmeNo"
                    id="msmeNo"
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                    placeholder="Enter MSME No."
                  />
                </div>

                <div className="flex-1">
                  <label htmlFor="panNo" className="text-sm font-medium text-gray-800 block mb-2">
                    PAN No.
                  </label>
                  <input
                    type="text"
                    name="panNo"
                    id="panNo"
                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                    placeholder="Enter PAN No."
                  />
                </div>
              </div>

              <div className="flex justify-center items-center ">
                <Button
                  type="submit"
                  className="bg-lime-600 rounded-md text-white font-semibold hover:bg-lime-700 hover:text-white font-poppins  p-2"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal for adding a new address */}
      {showAddAddressModal && (
        // <div className=" z-50">
        <div className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-[5000]">
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
      {showEditBillingAddressModal && (
        <div className="modal z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
            <div className="bg-white p-8 w-1/3 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Edit Address</h3>
              <div className="my-2">
                <label className="text-sm font-medium">Address 1:</label>
                <input
                  type="text"
                  name="address1"
                  value={editBillingAddress.address1 || ''}
                  onChange={(e) => setEditBillingAddress({ ...editBillingAddress, address1: e.target.value })}
                  className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                  // className="block w-full border p-2 mb-2 bg-white"
                />
              </div>
              <div className="my-3">
                <label className="text-sm font-medium">Address 2:</label>
                <input
                  type="text"
                  name="address2"
                  value={editBillingAddress.address2 || ''}
                  onChange={(e) => setEditBillingAddress({ ...editBillingAddress, address2: e.target.value })}
                  className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="my-3">
                  <label className="text-sm font-medium">City:</label>
                  <input
                    type="text"
                    name="city"
                    value={editBillingAddress.city}
                    onChange={(e) => setEditBillingAddress({ ...editBillingAddress, city: e.target.value })}
                    className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  />
                </div>
                <div className="my-2">
                  <label className="text-sm font-medium">State:</label>
                  <input
                    type="text"
                    name="state"
                    value={editBillingAddress.state}
                    onChange={(e) => setEditBillingAddress({ ...editBillingAddress, state: e.target.value })}
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
                    value={editBillingAddress.country}
                    onChange={(e) => setEditBillingAddress({ ...editBillingAddress, country: e.target.value })}
                    className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  />
                </div>
                <div className="my-2">
                  <label className="text-sm font-medium">Pincode:</label>
                  <input
                    type="text"
                    name="pincode"
                    value={editBillingAddress.pincode}
                    onChange={(e) => setEditBillingAddress({ ...editBillingAddress, pincode: e.target.value })}
                    className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  className="bg-red-600 rounded-md text-white p-2 px-3 font-semibold hover:bg-red-700 w-auto hover:text-white font-poppins mt-2"
                  onClick={() => setShowEditBillingAddressModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-lime-600 rounded-md text-white p-2 px-3 font-semibold hover:bg-lime-700 w-auto  hover:text-white font-poppins mt-2"
                  onClick={handleEditBillingAddressSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditShippingModal && (
        <div className=" ">
          <div className="fixed modal top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-[5000]">
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
      {/* Modal/Popup for editing the address */}
      {showEditAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
          <div className="bg-white p-8 w-1/3 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Edit Address</h3>
            <div className="my-2">
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
            <div className="my-3">
              <label className="text-sm font-medium">Address 2:</label>
              <input
                type="text"
                name="address2"
                value={editedAddress.address2}
                onChange={handleEditChange}
                className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="my-3">
                <label className="text-sm font-medium">City:</label>
                <input
                  type="text"
                  name="city"
                  value={editedAddress.city}
                  onChange={handleEditChange}
                  className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                />
              </div>
              <div className="my-2">
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
            <div className="flex items-center justify-between">
              <div className="my-2">
                <label className="text-sm font-medium">Country:</label>
                <input
                  type="text"
                  name="country"
                  value={editedAddress.country}
                  onChange={handleEditChange}
                  className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
                />
              </div>
              <div className="my-2">
                <label className="text-sm font-medium">Pincode:</label>
                <input
                  type="text"
                  name="pincode"
                  value={editedAddress.pincode}
                  onChange={handleEditChange}
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
                onClick={handleSaveAddress}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-auto max-w-lg p-6 text-center">
            <h1 className="text-xl font-semibold text-black mb-4">Duplicate Product</h1>
            <h2 className="text-red-600 mb-6">{popupMessage}</h2>
            <button className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditOrder;
