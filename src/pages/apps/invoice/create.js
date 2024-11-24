import { useNavigate, useLocation, json, Navigate, useParams } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
// material-ui

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import { Search, Save } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import { FaTrash,FaEdit,FaTrashAlt } from 'react-icons/fa';

import BankDetailsComponent from 'pages/apps/bank/bank';

import {
  Autocomplete,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  FormGroup,
  
  Paper,
  Popper,
  ClickAwayListener,
  MenuList,
  Tooltip,

  
} from '@mui/material';
import CustomCheckbox from '../../../components/Checkbox'
import {fetchAddressById} from 'pages/utils/customers/api';
import { fetchCustomerAddresses, getAddressById } from 'pages/utils/address/api';


// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import * as yup from 'yup';
import { v4 as UIDV4 } from 'uuid';
import { format } from 'date-fns';
//import { FieldArray, Form, Formik } from 'formik';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
// project-imports
import {
  getAllCustomer,
  getInvoiceById,
  getCustomerById,
  getAllProducts,
  countTotal,
  getAddressBycustomerId
} from 'pages/utils/invoices/api';
import {fetchBanks,fetchBankDetailsById,addBankDetails, deleteBankDetailsById} from 'pages/utils/bank/api'
import MainCard from 'components/MainCard';
import InvoiceItem from 'sections/apps/invoice/InvoiceItem';
import AddressModal from 'sections/apps/invoice/AddressModal';
import InvoiceModal from 'sections/apps/invoice/InvoiceModal';
import stateData from './state.json';
import incrementer from 'utils/incrementer';
import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import invoice, {
  customerPopup,
  toggleCustomerPopup,
  selectCountry,
  getInvoiceInsert,
  reviewInvoicePopup,
  getInvoiceList
} from 'store/reducers/invoice';

// assets
import { Add, Additem, Edit } from 'iconsax-react';
import { display, padding } from '@mui/system';
import AdditemPopUp from './AdditemPopUp';
import EditAddress from './EditAddress';
import NewCustomers from 'sections/widget/data/NewCustomers';
import { set } from 'lodash';
import SelectCustomer from './selectCustomer';
import SelectProduct from './selectProduct';
import ObjectId from 'bson-objectid';
import AddCustomer from './addCustomer';
import { getAllExecutives } from 'pages/utils/orders/api';





const validationSchema = yup.object({
  date: yup.date().required('Invoice date is required'),
  due_date: yup
    .date()
    .when('date', (date, schema) => date && schema.min(date, "Due date can't be before invoice date"))
    .nullable()
    .required('Due date is required'),
  customerInfo: yup
    .object({
      name: yup.string().required('Invoice receiver information is required')
    })
    .required('Invoice receiver information is required'),
  status: yup.string().required('Status selection is required'),
  discount: yup
    .number()
    .typeError('Discount must specify a numeric value.')
    // @ts-ignore
    .test('rate', 'Please enter a valid discount value', (number) => /^\d+(\.\d{1,2})?$/.test(number)),
  tax: yup
    .number()
    .typeError('Tax must specify a numeric value.')
    // @ts-ignore
    .test('rate', 'Please enter a valid tax value', (number) => /^\d+(\.\d{1,2})?$/.test(number)),
  invoice_detail: yup
    .array()
    .required('Invoice details is required')
    .of(
      yup.object().shape({
        name: yup.string().required('Product name is required')
      })
    )
    .min(1, 'Invoice must have at least 1 items')
});

const Create = () => {
  const theme = useTheme();
  const server=process.env.REACT_APP_API_URL;

  const navigate = useNavigate();
  const notesLimit = 500;
  const location = useLocation();
  const state=location.state
  console.log("Initial values on editing---->",state)
  // if(state){
  //   setCustomerId(state.customer)
  // }
 
  const [selectedAddId, setSelectedAddId] = useState('');

  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [openSelectCustomer, setOpenSelectCustomer] = useState(false);
  const [openSelectProduct, setOpenSelectProduct] = useState(false);
  const [totalAmountBeforeTax, setTotalAmountBeforeTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [roundTotal, setRoundTotal] = useState(0);
  const [particularInvoice, setParticularInvoice] = useState(null);
  const [itemList,setItemList]=useState(state?.itemList || []);
  console.log("State---->",state)
  const [selectedAddress, setSelectedAddress] = useState({});
  const [editableAddress,setEditableAddress]=useState('');
  const [editedAddress, setEditedAddress] = useState({});
  const [totalExtra, setTotalExtra] = useState("0");
  const [selectedBankIdd, setSelectedBankIdd] = useState(null);
  const [bankDetails, setBankDetails] = useState('');


  const [isSameAsBilling, setIsSameAsBilling] = useState(state? false:true);
  
  const [isEditing, setIsEditing] = useState(false); // Track if editing
  const [currentChargeId, setCurrentChargeId] = useState(null); 

  const [grandTotal, setGrandTotal] = useState(0);
  //const [addExtraCharges, setAddExtraCharges] = useState(0);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [openAddressDropdown, setOpenAddressDropdown] = useState(false);
 const {id}=useParams();
 console.log(id)
  const [projectName, setProjectName] = useState('');
  // const formatAddressToString = (address) => {
  //   return `${address?.address1 || ''}, ${address?.address2 || ''}, ${address?.city || ''}, ${address?.state || ''}, ${address?.country || ''}, ${address?.pincode || ''}`;
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
  const [addresses, setAddresses] = useState([]);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [showEditBillingAddressModal, setShowEditBillingAddressModal] = useState(false);

  const [editAddress, setEditAddress] = useState({}); 
  const [editBillingAddress, setEditBillingAddress] = useState(selectedAddress || {}); 

  const [billingAddress, setBillingAddress] = useState({});

  const [addExtraCharges, setAddExtraCharges] = useState([{ itemName: '', percentage: 0, amount: 0,_id:''}]);
 // const [addDiscount, setAddDiscount] = useState({ itemName: '', percentage: 0, amount: 0 });
  const [addDiscount, setAddDiscount] = useState(0);

  const [address, setAddress] = useState({}); // an object of address
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [custId, setCustId] = useState('');
  const { open, isCustomerOpen, countries, country, lists, isOpen } = useSelector((state) => state.invoice);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Unpaid');

  const [termsAndConditions, setTermsAndConditions] = useState(state?.termsAndConditions || '');
  const [notes, setNotes] = useState(state?.notes || '');
  const [allBanks, setAllBanks] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerId,setCustomerId]=useState('');
  const [showExtraChargePopup, setShowExtraChargePopup] = useState(false);
  const [showEditShippingModal, setShowEditShippingModal] = useState(false);
  const [editShippingAddress, setEditShippingAddress] = useState({});
  const [newAddress, setNewAddress] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});
  //const [discountInput, setDiscountInput] = useState(0);
  const [discountInput, setDiscountInput] = useState({
    itemName:'',
    amount:''
  });
    const [NewBankID, setNewBankID] = useState('');
    const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  const handleAddressChange = (e) => {
    const addressValue = e.target.value;
    console.log("addressValue", addressValue)
    // setSelectedAddress(addressValue);
    handleAddressSelect(addressValue);
    // setEditedAddress(addressValue)
  };

  //const [addDiscount, setAddDiscount] = useState(0);
  //const [extraChargeInput, setExtraChargeInput] = useState(0);
  const [extraChargeInput, setExtraChargeInput] = useState({
    itemName: "",
    percentage:0,
    amount: 0,
  });
  const [extraCharges, setExtraCharges] = useState([]);
  // const handleDiscountInputChange = (e) => setDiscountInput(e.target.value);
  const handleDiscountInputChange = (e) => {
    const { name, value } = e.target;
    setDiscountInput((prev) => ({ ...prev, [name]: value }));
  };
  const handleExtraChargeInputChange = (e) => {
    const { name, value } = e.target;
    setExtraChargeInput((prev) => ({ ...prev, [name]: value }));
  };
  
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
  const handleEditAddressSubmit = () => {
    
    setSelectedAddress(editAddress);
    setBillingAddress(editAddress);
    if (isSameAsBilling) {
      setShippingAddress(editAddress);
    }
    setShowEditAddressModal(false);
  };
  const handleEditBillingAddressSubmit = () => {
    setShippingAddress(editBillingAddress);
    setShowEditBillingAddressModal(false);
    
  };
  useEffect(()=>{
    setEditAddress(selectedAddress);
    setBillingAddress(selectedAddress);
    if (isSameAsBilling) {
      setShippingAddress(selectedAddress);
    }
  },[selectedAddress])
  // useEffect(() => {
  //   setEditAddress({...selectedAddress});
  // }, [selectedAddress]);

  //party-details
  const [partyDetails, setPartyDetails] = useState({
    contactPerson: '',
    // salesCredit: '',
    shippingAddress: address,
    billingAddress: address
  });

  //form values
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
    website: '',
    company: '',
    mobile: '',
    industry: '',
    country: '',
    state: '',
    receivable: '',
    receivableNotes: ''
  });
  const handleIncreaseQuantity = (index) => {
    setItemList((prevItemList) => {
      const updatedItemList = [...prevItemList];
      const item = updatedItemList[index];
      item.quantity += 1;
      const { taxable, cgst, sgst, amount } = calculateAmounts(item.rate, item.gst, item.discount, item.quantity);
      item.taxable = taxable;
      item.cgst = cgst;
      item.sgst = sgst;
      item.amount = amount;
      return updatedItemList;
    });
  };
  const handleDecreaseQuantity = (index) => {
    setItemList((prevItemList) => {
      const updatedItemList = [...prevItemList];
      const item = updatedItemList[index];
      if (item.quantity > 1) {
        item.quantity -= 1;
        const { taxable, cgst, sgst, amount } = calculateAmounts(item.rate, item.gst, item.discount, item.quantity);
        item.taxable = taxable;
        item.cgst = cgst;
        item.sgst = sgst;
        item.amount = amount;
        return updatedItemList;
      }
      return updatedItemList.filter((_, i) => i !== index);
    });
  };
  const handleExtraChargeSubmit = () => {


    if (!extraChargeInput.itemName || parseFloat(extraChargeInput.amount) <= 0) {
      return;
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
      setIsEditing(false);
      setCurrentChargeId(null);
    } else {
      setAddExtraCharges((prevCharges) => [...prevCharges, newCharge]);
    }
  
    setExtraChargeInput({ itemName: "", percentage: 0, amount: 0 }); 
  
    updateTotals();
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
  const [reference, setReference] = useState('');
  const [countriesName, setcountriesName] = useState([]);
  const [isIndia, setIsIndia] = useState(false);
  const [states, setStates] = useState([]);
  const [displayItem,setDisplayItem]=useState(null);
  const [customerData, setCustomerData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    website: '',
    industrySegment: '',
    country: '',
    state: '',
    receivables: 0,
    receivablesNotes: '',
    businessProspect: 0,
    orderTarget: 0,
    msmeNo: '',
    panNo: '',
  });
  // to Upload file from user
  // to add feilds on button click
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [showExtraChargeInput, setShowExtraChargeInput] = useState(false);

  const [showChargeInput, setshowChargeInput] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  // const [amount, setAmount] = useState(0);
  // let totalAmount = 0;
  // let tax = 0;
  // invoiceDetails.forEach((item) => {
  //   totalAmount += item.qty * (item.rate - item.discount);
  //   tax += item.qty * (item.rate - item.discount) * ((1 + item.cgst) / 100);
  // });

  // for customer list
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  
  
  const [customerList, setCustomerList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setselectedOption] = useState('');
  const [filteredCustomerList, setFilteredcustomerList] = useState([]);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCountry,setSelectedCountry]=useState('');
  const handleOpenSelectCustomer = () => setOpenSelectCustomer(true);
  const handleCloseSelectCustomer = () => setOpenSelectCustomer(false);
  const handleOpenSelectProduct = () => setOpenSelectProduct(true);
  const handleCloseSelectProduct = () => setOpenSelectProduct(false);
  const [roundoff, setRoundoff] = useState(0);
  const [Executives, setExecutives] = useState();


 
  const calculateAmounts = (rate, gst, discount, quantity) => {
    const validRate = parseFloat(rate) || 0;
    const validGst = parseFloat(gst) || 0;
    const validDiscount = parseFloat(discount) || 0;
    const validQuantity = parseFloat(quantity) || 1;
    const discountedRate = validRate - validDiscount;
    const taxable = (discountedRate * validQuantity).toFixed(2);
    const gstTotal = (discountedRate * (validGst / 100) * validQuantity).toFixed(2);
    const cgst = (parseFloat(gstTotal) / 2).toFixed(2);
    const sgst = (parseFloat(gstTotal) / 2).toFixed(2);
    const amount = (parseFloat(taxable) + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);
    return { taxable, cgst, sgst, amount };
  };
  const handleShippingAddressChange = (event) => {
    if (event.target.checked) {
      setShippingAddress(address); // Copy billing address to shipping address
    } 
    // else {
    //   setShippingAddress({}); // Reset shipping address
    // }
  };
  const handleCustomerSelect = (customer) => {
    // Debugging log
    console.log('Customer Selected:', customer);
  
    setSelectedCustomer(customer);
    setCustomerId(customer._id);

    

    console.log("Selected customer---------->",customer)
    setCustomerData(prevDetails=>({
      ...prevDetails,
      companyName:customer?.companyName,
      firstName:customer?.firstName,
      lastName:customer?.lastName,
      email:customer?.email,
      mobile:customer?.mobile,
      website:customer?.website,
      industrySegment: customer?.industrySegment,
      country:customer?.country,
      state:customer?.state,
      receivables: customer?.receivables,
      receivablesNotes:customer?.receivablesNotes,
      businessProspect:customer?.businessProspect,
      orderTarget: customer?.orderTarget,
      msmeNo: customer?.msmeNo,
      panNo:customer?.panNo,
      
    }));
    
    // Ensure customerName is correctly set from customer object
   // const customerName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
  
    // if (onCustomerSelect) {
    //   console.log('Calling onCustomerSelect with:', {
    //     customerId: customer._id,
    //     customerName: customerName,
    //   }); 
    //   onCustomerSelect({
    //     customerId: customer._id,
    //     customerName: customerName,
    //   });
    // }
  
    handleCloseSelectCustomer();
  };
  // const handleCustomerSelect = async (customer) => {
  //   setSelectedCustomerId(customer.customerId);
  //   const addresses = await getAddressBycustomerId(customer.customerId);
  //   if (addresses) {
  //     console.log('address aya hai ', addresses);
  //     setAddressList(addresses);
  //     setAddress(addresses[0]);
  //   }
  //   setCustId(customer.customerId);
  //   setSelectedCustomerName(customer.customerName);
  //   setProjectName(customer.project);
  //   setCustomerData({ ...customerData, companyName: customer?.customerName });
  //   handleCloseSelectCustomer();
  // };
  const handleCloseProductListPopup = () => {
    setOpenSelectProduct(false);
  };
    const handleUpdateItem = async (updatedItem) => {
    
   console.log('this is the updated itemDate------------->', updatedItem);
    setItemList((prevItemList) => prevItemList.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
    updateTotals();

    

    // setOpenEditItemPopup(false);
    setOpenItemDialog(false);
  };

  
  const handleProductSelect = (product) => {
    console.log('Product selected:', product);
    setItemList((prevItemList) => {
      const existingProductIndex = prevItemList.findIndex((item) => item._id === product._id);
      if (existingProductIndex !== -1) {
        const updatedItemList = [...prevItemList];
        const item = updatedItemList[existingProductIndex];
        item.quantity += 1;
        const { taxable, cgst, sgst, amount } = calculateAmounts(item.rate, product.gst, item.discount, item.quantity);
        item.taxable = taxable;
        item.cgst = cgst;
        item.sgst = sgst;
        item.amount = amount;
  
        return updatedItemList;
      }
      const sellingPrice = parseFloat(product.sellingprice) || 0;
      const discount = product.discount || 0;
      const quantity = 1;
      const gst = product.gst || 0;
      const { taxable, cgst, sgst, amount } = calculateAmounts(sellingPrice, gst, discount, quantity);
      return [
        ...prevItemList,
        {
          _id: product._id,
          itemandDescription: (product.itemname || product.description) 
          ? `${product.itemname || ''}${product.itemname && product.description ? ' - ' : ''}${product.description || ''}` 
          : '',
          hsnSac: product.hsn || 'N/A', // Default HSN/SAC as 'N/A' if not provided
          unit: product.unit || 'Piece', // Default unit as 'Piece' if not provided
          rate: sellingPrice, // Ensure the rate is a valid number and formatted to 2 decimal places
          discount: discount, // Format discount to 2 decimal places
          gst: gst,
          taxable: taxable, // Format taxable amount
          cgst: cgst, // Format CGST amount
          sgst: sgst, // Format SGST amount
          amount: amount, // Format total amount
          quantity: quantity, // Default quantity is 1
        }
      ];
    });
  
    handleCloseProductListPopup();
  };
  
  // const handleProductSelect = (product) => {
  //   setInvoiceDetails((prevDetails) => [
  //     ...prevDetails,
  //     {
  //       id: product._id, // Assuming _id is a unique identifier
  //       name: product.itemname,
  //       itemDescription: product.description || 'No description available', // Default description if missing
  //       qty: 1, // Default quantity, can be updated later
  //       rate: product.rate || 0, // Default rate if missing
  //       unit: product.unit || 'pcs', // Default unit if missing
  //       discount: 0, // Default discount
  //       cgst: 0, // Default CGST
  //       sgst: 0, // Default SGST
  //       taxable: true // Default taxable status
  //     }
  //   ]);
  //   handleCloseSelectProduct(); // Close the product popup
  // };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('File uploaded:', file);
  };
  const CustomerDialogClose = () => {
    setCustomerDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleCustomerChange = (e) => {
    console.log('thing changes');
    setSearchTerm(e.target.value);
    console.log('customerList', customerList);
    let value = e.target.value;
    const filtered = customerList.filter((customer) => customer.companyName.toLowerCase().includes(value.toLowerCase()));
    setFilteredcustomerList(filtered);
    setCustomerDialogOpen(true);
  };


  const handleAddItem = (index) => {
    const particularItem=itemList.find((_,i)=>i===index)
    setDisplayItem(particularItem);
    setOpenItemDialog(true);
  };

  const removeItem = (index) => {
    setItemList((prevDetails) => prevDetails.filter((_, i) => i !== index));
  };
  const handleClose = () => {
    setFormValues({
      name: '',
      email: '',
      company: '',
      address: '',
      website: '',
      company: '',
      mobile: '',
      industry: '',
      country: '',
      state: '',
      receivable: '',
      receivableNotes: ''
    });
    // Close the dialog
    setDialogOpen(false);
    setOpenAddressDialog(false);
  };
  const handlePartyDetailsForm = (field, value) => {
    setPartyDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value
    }));
  };
  const formatToDDMMYYYY = (date) => {
    if (!date) return '00-00-0000';
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };
  const handleDeleteExtraCharge = (id) => {
    setAddExtraCharges((prevCharges) => prevCharges.filter((charge) => charge._id !== id));
    updateTotals(); // Recalculate totals after deletion
  };
  // const handleDiscountSubmit = () => {
  //   if (discountInput.itemName === "" || discountInput.amount === "") {
  //     toast.error("Please fill both Item name and amount");
  //     return;
  //   }
  //   const newCharge = {
  //     itemName: extraChargeInput.itemName,
  //     amount: parseFloat(extraChargeInput.amount),
  //   };
  //   setAddDiscount(discountInput.amount);
  //   // setDiscountInput({ itemName: "", amount: 0 });
  //   updateTotals();
  //   setShowDiscountPopup(false);
    
  // };
  // const changeBankId=(id)=>{
  //   setSelectedBankId(id);
  // }

  const handleFinalSave = async () => {
    try {
      if (!selectedCustomer) {
        toast.error('Customer is required ');
        return;
      }
    
      
      if (!projectName) {
        toast.error('Project name is required');
        return;
      }
      if (!partyDetails.contactPerson) {
        toast.error('Contact person is required');
        return;
      }
     
     
      if (!reference) {
        toast.error('reference is required');
        return;
      }
    
      if (!invoiceDate) {
        toast.error('Invoice date is required');
        return;
      }
    
      if (!dueDate) {
        toast.error('Due date is required');
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
      if (!NewBankID) {
        toast.error('Bank details are required');
        return;
      }
      if (!notes) {
        toast.error('Notes should not be empty');
        return;
      }
  
      
      // if (!status) {
      //   toast.error('status is required');
      //   return;
      // }
  
      
      const formattedItemList = itemList.map((item, index) => {
        console.log(item);
        return {
               
                no: index + 1,
                itemDescription: item.itemandDescription ? String(item.itemandDescription) : '',

                qty: Number(item.quantity || 1),
                unit: String(item.unit || 'Piece'), // Assuming a default unit or modify accordingly
                rate: Number(item.rate || 0),
                
                taxable: Number(item.taxable || 0),
                discount: Number(item.discount || 0),
                amount: Number(item.amount || (Number(item.quantity || 0) * Number(item.rate || 0))),
                hsn: String(item.hsnSac || ''), // Assuming a default HSN or modify accordingly
                SGST: Number(item.sgst || 0),
                CGST: Number(item.cgst || 0)
              }});
  
      // Prepare document details with proper formatting
      const documentDetails = {
      
        reference: reference,
        invoiceDate: formatToDDMMYYYY(invoiceDate),
        dueDate: formatToDDMMYYYY(dueDate),
        
      };
  
      // Use itemList directly if it already has the correct format
      const finalTotal = countTotal(itemList); // Assuming countTotal correctly calculates the final total
  
      // Format address details properly
      // const formattedAddress = {
      //   address1: address?.address1,
      //   address2: address?.address2,
      //   city: address?.city,
      //   state: address?.state,
      //   country: address?.country,
      //   pincode: address?.pincode,
      //   type: address?.type || 'Home'
      // };
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
      const validAddDiscount = typeof addDiscount === 'object'
      && addDiscount !== null ? addDiscount : {};

    // Ensure addExtraCharges is an array of objects

    const validAddExtraCharges = Array.isArray(addExtraCharges) && addExtraCharges.length > 0
      ? addExtraCharges.map((charge) => ({
        itemName: charge.itemName || 'Extra Charge',
        percentage: charge.percentage || 0,
        amount: charge.amount || 0,
        // _id: ObjectId.isValid(charge._id) ? charge._id : new ObjectId().toString(), // Ensure valid ObjectId
      }))
      : [];
      const formattedPartyDetails = {
        contactPerson: String(partyDetails.contactPerson),
        billingAddress: String(billingAddress),

        //billingAddress: JSON.stringify(partyDetails.billingAddress),
        // salesCredit: Number(partyDetails.salesCredit) || 0,
        //shippingAddress: JSON.stringify(partyDetails.billingAddress),
        shippingAddress: formatShippingAddress(),

        
        shippingDetails: String(partyDetails.shippingDetails || 'xyz details')
      };
  
      const invoiceData = {
        type: 'party invoice',
        //customer: selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : '', 
        customer:customerId,
        copyFrom: 'any-one',
        partyDetails: formattedPartyDetails,
        documentDetails,
        itemList:formattedItemList, 
        status: 'Paid', 
        finalTotal: String(finalTotal), 
        amount: String(finalTotal),
        roundoff: '0',
        // extracharges: String(addExtraCharge) || '0',
        // discount: String(addDiscount) || '0',
        extracharges: validAddExtraCharges,  // Serialize to a JSON string
        discount: {
        itemName: validAddDiscount.itemName || 'Discount',
        percentage: validAddDiscount.percentage || 0,
        amount: validAddDiscount.amount || 0,
      },
        paidAmount: '0',
        balanceAmount: String(finalTotal),
        project: projectName || '',
        note:notes || '',
        status:status || '',
        // GSTIN: '1234ABC5678DEF',
        //address: formattedAddress,
        address: billingAddress,
        // ...(state && invoiceNumber ?`invoiceId: ${invoiceNumber }` : ''),
        // ...(bankDetails && NewBankID && { bankDetails: NewBankID }), // Include if bankDetails._id exists
        bankDetails:NewBankID
      };
      console.log("Payload before hit------>",invoiceData);
  
      // Fetch the token from local storage for authorization
      const token = localStorage.getItem('token');
      if (state?._id) {
        // Update existing invoice
        const updateResponse = await axios.put(`${server}/api/invoice/${state._id}`, invoiceData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
  
        toast.success('Invoice updated successfully!');
      console.log("Payload after hit------>",invoiceData);

        console.log("Updated Invoice-->", updateResponse.data);
      } else {
      // Make the POST request to save the invoice data
      const response = await axios.post(`${server}/api/invoice`, invoiceData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
  
      // Notify success and redirect user
      toast.success('Invoice created successfully!');
      console.log("ParticularInvoice-->", response.data);
    }
  
      // Close any dialog if open and navigate to the invoice list page
      setDialogOpen(false);
      navigate('/apps/invoice/list');
    } catch (error) {
      // Log the error and notify the user
      toast.error('Error occurred while creating invoice.');
      console.error('Error occurred:', error.response ? error.response.data : error);
    }
  };
  
  
  const getBanks = async () => {
            const response = await fetchBanks();
            console.log("Response",response,"Invoice Info",particularInvoice);
            setAllBanks(response)
        //     if (particularInvoice?.bankDetails) {
        //         const matchedBankId = response.filter(bank => bank._id === particularInvoice.bankDetails);
        //         if(matchedBankId){
        //         setSelectedBankId(matchedBankId);
        //         }else{
        //           setSelectedBankId('');
        //         }
        //  }
        if (state?.bankDetails) {
          const matchedBankId = response.find(bank => bank._id === state.bankDetails._id);
          console.log(response);
          if(matchedBankId){
          setNewBankID(matchedBankId._id);
  console.log("Bank--------------->",matchedBankId)
  console.log("Bank id--------------->",selectedBankId)
          }
  

          
   }
       
    
};
useEffect(() => {
  getBanks();
}, []);


useEffect(()=>{
  const fetchParticularInvoice=async(invoiceId)=>{
    const res = await getInvoiceById(invoiceId);
    console.log('Particular invoice by id----> ', res);
    setInvoiceNumber(res?.invoiceId || '')
    
  }
  if(state?._id){
   fetchParticularInvoice(state._id);
  }
},[])

  
  const handleAddCustomer = (event) => {
    setCustomerData({ ...customerData, [event.target.name]: event.target.value });
    if (event.target.name === 'state' || event.target.name === 'country') {
      setAddress({ ...address, [event.target.name]: event.target.value });
      setPartyDetails({ ...partyDetails, billingAddress: { [event.target.name]: event.target.value } });
    }
    console.log('customer datas is ', customerData);
  };
  const updateTotals = () => {
    const totalBeforeTax = itemList.reduce((sum, item) => sum + parseFloat(item.taxable), 0);
   // const totalTax = itemList.reduce((sum, item) => sum + (parseFloat(item.cgst) + parseFloat(item.sgst)), 0);
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
    const extraChargesTotal = addExtraCharges.reduce((sum, charge) => sum + parseFloat(charge.amount), 0);
    setTotalExtra(extraChargesTotal.toFixed(2));
    // Deduct discount
    const discountAmount = parseFloat(addDiscount.amount) || 0;

    // Calculate grand total
    const grandTotal = totalAmount + extraChargesTotal - discountAmount;

    // Round the grand total to the nearest integer
    const roundedGrandTotal = Math.round(grandTotal);


    const roundoffValue = (roundedGrandTotal).toFixed(2);
    //const roundoffValue=Math.round(totalAmount);

    // Update state with calculated values
    setTotalAmountBeforeTax(totalBeforeTax.toFixed(2));
    setTotal(totalAmount.toFixed(2));
    setGrandTotal(roundedGrandTotal.toFixed(2));
    setRoundoff(roundoffValue);
  };
  const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

  // const updateTotals = () => {
  //   const totalBeforeTax = itemList.reduce((sum, item) => sum + parseFloat(item.taxable), 0);
  //   const totalTax = itemList.reduce((sum, item) => sum + (parseFloat(item.cgst) + parseFloat(item.sgst)), 0);
  //   const totalAmount = totalBeforeTax + totalTax;

  //   console.log('Total before tax----------->', totalBeforeTax);
  //   console.log('Total tax--------->', totalTax);

  //   const extraCharges = parseFloat(addExtraCharge) || 0;
  //   const discount = parseFloat(addDiscount) || 0;

  //   const grandTotal = totalAmount + extraCharges - discount;

  //   console.log('Grand total:-------->', grandTotal);
  //   const integralTotal=Math.round(totalAmount);
  //   setTotalAmountBeforeTax(totalBeforeTax.toFixed(2));
  //   setTotal(totalAmount.toFixed(2));
  //   setRoundTotal(integralTotal);

  //   setGrandTotal(grandTotal.toFixed(2));
  // };
  useEffect(() => {
    updateTotals();
  }, [itemList, addExtraCharges, addDiscount, grandTotal, roundoff]);

 useEffect(()=>{
  const handleAllAddresses = async(customerId) => {
    
    const token=localStorage.getItem('token');
    const res=await fetchAddressById(customerId,token);
    console.log("All addresses--->",res);
    if(res){
    setAddresses(res);
    }
    // setCustAddress(res);
  };
  if(customerId){
  handleAllAddresses(customerId);
  }
 },[customerId])
  const handleSave = async () => {
    try {
      const responce = await axios.post(`${server}/api/customer`, customerData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setAddress({ state: customerData.state, country: customerData.country });
      console.log('the responxe data is ', responce);
      setPartyDetails({ billingAddress: { state: customerData.state, country: customerData.country } });

      toast.success('customers created successfully!');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Error', error.responce);
      if (error.responce) {
        console.log('tyhe responce from the server is the ', error.responce);
      } else if (error.request) {
        console.log('no responce recieved', error.request);
      } else {
        console.log('eroor message', error.message);
      }
    }
  };

  const formatDate = (date) => {
    console.log('date is ', date);
    if (!date) return '';
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  };
  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsSameAsBilling(checked);
    console.log(billingAddress);
    // setShippingAddress(billingAddress);
    if (checked) {
      setShippingAddress(billingAddress); // Copy billing address to shipping
    }
    //  else {
    //   setShippingAddress({}); // Reset shipping address when unchecked
    // }
  };
  useEffect(() => {
    
    
    setBillingAddress(selectedAddress);
  
}, [selectedAddress]);
  useEffect(() => {
    
    if(isSameAsBilling){
      setShippingAddress(billingAddress);
    }
    
  }, [billingAddress,isSameAsBilling]);
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const result = await getAllCustomer();
        console.log('responce is', result);
        setCustomerList(result);
      } catch (error) {
        console.log('error is ', error.message);
      }
    };
   
  }, [searchTerm, customerList.length, location.search]);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        // Extract the names of the countries from the response
        const countryNames = response.data.map((country) => country.name.common);
        setcountriesName(countryNames);
  
        // Prefill if customerData?.country is available
        if (customerData?.country && countryNames.includes(customerData.country)) {
          setSelectedCountry(customerData.country);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
  
    fetchCountries();
  }, [customerData]);
  const handleSelectAddressDropdown = (address) => {
    const formattedAddress = [
      address.address1,
      address.address2,
      address.city,
      address.state,
      address.pincode,
      address.country
    ]
      .filter(part => part && part.trim() !== "")
      .join(", ");
    setAddress(formattedAddress);
    // handleCustAddressDropdownClose();
    setOpenAddressDropdown(false);
  };
  console.log("ParticularInvoice-->",particularInvoice)
 
  useEffect(() => {
    if (state) {
      // Set initial values from the state object
      setSelectedCustomer(state.customer)
      setCustomerId(state.customer?._id);
      setNotes(state.note);
      const formattedItemList = state?.itemList.map((item, index) => ({
        no: index + 1, // Unique number starting from 1
        itemandDescription: item.itemDescription, // Assuming this is how you want to use it
        quantity: item.qty || 1, // Default to 1 if qty is not provided
        unit: item.unit || 'Piece', // Default unit
        rate: item.rate || 0,
        taxable: item.taxable || 0,
        discount: item.discount || 0,
        amount: item.amount || (item.qty * item.rate), // Default calculation
        hsnSac: item.hsn || '',
        sgst: item.SGST || 0,
        cgst: item.CGST || 0,
      }));
      setItemList(formattedItemList);
      setTermsAndConditions(state.termsAndConditions);
      setProjectName(state.project);
      setBankDetails(state.bankDetails);
      setSelectedBankIdd(state.bankDetails._id);
      setNewBankID(state.bankDetails._id);
      setStatus(state.status);



      setPartyDetails(state.partyDetails || {
        contactPerson: '',
        // salesCredit: '',
        shippingAddress: {},
        billingAddress: {}
      });
      // setDocumentDetails(state.documentDetails || {
      //   invoiceNo: '',
      //   reference: '',
      //   invoiceDate: '',
      //   dueDate: ''
      // });
      // setInvoiceNumber(state.documentDetails.invoiceNo);
      
      setReference(state.documentDetails.reference);
      setAddress(state.address || {});
      setSelectedCustomerId(state.customer?._id || null);
      // setDiscount(state.discount || { itemName: '', percentage: 0, amount: 0 });
      // setExtraCharges(state.extracharges || []);
      setInvoiceDate(formatDate(state.documentDetails.invoiceDate));
      setDueDate(formatDate(state.documentDetails.dueDate));
    }
  }, [state]);
  useEffect(() => {
    console.log('Updated extra charges:', addExtraCharges);
  }, [addExtraCharges]);

  useEffect(() => {
    console.log('Updated discount:', addDiscount);
  }, [addDiscount]);
  // useEffect(()=>{
  //   console.log(addresses);
  //   const matchedAddress=addresses.find(item=>item.formatAddressToString() === state.address.formatAddressToString());
  //   console.log(matchedAddress);
  //   setSelectedAddress(matchedAddress);
  // },[])
  useEffect(() => {
    if (state?.address) {
      // setEditAddress(state.address);
      setSelectedAddress(state.address);
    }
  }, [state?.address]);
  // useEffect(() => {
  //   if (selectedAddress) {
  //     // setEditAddress(state.address);
  //     setSelectedAddress(editAddress);
  //   }
  // }, [editAddress]);
  const changeBankId = (id) => {
    setNewBankID(id)
    console.log("this is id from bank component=======>",id)
  }
//   useEffect(()=>{
//     if(NewBankID){
//       changeBankId(NewBankID)
//     }
// console.log("New BankID---->",NewBankID);
//   },[NewBankID])
  console.log("New Bankid--->", NewBankID)
  
  useEffect(() => {
    const fetchAllExecutives = async () => {
      const token = localStorage.getItem('token');
      const response = await getAllExecutives(token);
      console.log(response?.data);
      setExecutives(response?.data);
    };
    fetchAllExecutives();
  }, []);

          return (
            <Box>
              <Box className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold mb-4">{state?'Edit Invoice':'Create Invoice'}</h1>
            <Box className="space-x-2">
              <Button className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button className="bg-lime-600 rounded-md text-white font-semibold hover:bg-lime-700 p-2 hover:text-white" onClick={handleFinalSave}>
                Save
              </Button>
            </Box>
          </Box>
            <Box className="grid grid-cols-1 max-w-[7xl] lg:grid-cols-3 gap-4">
              <div className="col-span-1 lg:col-span-3 bg-white shadow rounded p-4">
                <h1 className="text-2xl font-semibold mb-4">Basic Information</h1>
                <Grid container justifyContent="space-between" alignItems="center">
                <Grid item xs={12} sm={6} md={'auto'}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <InputLabel sx={{ width: '145px', fontWeight: '900' }}>Customer :</InputLabel>
                    <FormControl sx={{ width: '100%' }}>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          required
                          type="text"
                          name="companyName"
                          id="companyName"
                         // value={selectedCustomerName || customerData?.companyName}
                         value={selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : ''}
                          onChange={handleCustomerChange}
                          sx={{ width: '370px' }}
                          onFocus={(event) => setAnchorEl(event.currentTarget)}
                          onClick={handleOpenSelectCustomer}
                          // InputProps={{
                          //   readOnly: true,
                          //   style:{height:'35px',borderRadius:'3px'}
                          // }}
                        />
                        <IconButton className='p-0 text-white border border-[#c1d0a3] bg-red-600 hover:bg-red-700 rounded-md font-inter h-12 w-12' variant="solid" onClick={handleOpenSelectCustomer}>
                          <SearchOutlinedIcon />
                        </IconButton>

                        <IconButton className='text-white border border-[#c1d0a3] bg-red-600 hover:bg-red-700 rounded-md font-inter py-0.5 h-12 w-12' variant="solid" onClick={handleDialogOpen}>
                          <Add />
                        </IconButton>
                      </Stack>

                    </FormControl>
                  </Stack>
                </Grid>
               {/* Select customer and add customer */}
                <Grid item xs={12} sm={6} md={'auto'}>
                  <Stack direction={'row'} spacing={1} alignItems="center">
                    <InputLabel variant="h4" sx={{ width: '145px', fontWeight: '900' }}>
                      Project Name:
                    </InputLabel>
                    <FormControl sx={{ width: '100%' }}>
                        <TextField
                          required
                          type="text"
                          variant="outlined"
                          label="Project Name"
                          name="project"
                          id="project"
                          value={projectName || ''}
                          onChange={(e)=>setProjectName(e.target.value)}
                          sx={{ width: '370px' }}
                          onFocus={(event) => setAnchorEl(event.currentTarget)}
                        //   InputLabelProps={{
                        //     style: { 
                        //       marginTop:'-4px',
                          
                        //     }
                        // }}
                        //   InputProps={{
                        //     style:{height:'35px',borderRadius:'3px'}
                        //   }}
                        />
                    </FormControl>
                  </Stack>
                </Grid>
                </Grid>
                
              </div>

              {/* Party Details */}
              <div className="col-span-1 lg:col-span-2 bg-white shadow rounded p-4">
                <h1 className="text-2xl font-semibold mb-4">Party Details</h1>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contact Person"
                      variant="outlined"
                      name="contactPerson"
                      value={partyDetails?.contactPerson || ''}
                      onChange={(e) => {
                        handlePartyDetailsForm('contactPerson', e.target.value);
                      }}
                      className="bg-white border border-gray-300 text-black sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full"
                     
                   
                    />
                  </Grid>
                 
                  {/* <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Sales Credit"
                      type="text"
                      value={partyDetails?.salesCredit || ''}
                      name="salesCredit"
                      onChange={(e) => {
                        handlePartyDetailsForm('salesCredit', e.target.value);
                      }}
                      InputLabelProps={{
                        style: { 
                          marginTop:'-4px',
                      
                        }
                    }}
                      InputProps={{
                        style: { height: '35px', borderRadius: '3px' },
                      }}
                    />
                  </Grid> */}

<Grid item xs={12}>
  
  <div className="col-span-2">
    <div className="flex items-center justify-between gap-3">
      <div className="w-[90%]">
        <label className="text-sm font-medium" htmlFor="address">
          Customer Address:
        </label>
        
          {state ? (
            <select
            className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-500 focus:border-red-500 w-full p-2.5"
            onChange={handleAddressChange}
            required
          >
            <option value={formatAddressToString(selectedAddress)}>{formatAddressToString(selectedAddress)}</option>
              
              {addresses &&
                addresses.map((address) => (
                  <option key={address._id} value={address._id}>
                    {formatAddressToString(address)}
                  </option>
                ))}
            </select>
          ) : (
            <select
          className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-500 focus:border-red-500 w-full p-2.5"
          onChange={(e) => handleAddressSelect(e.target.value)}
          required
        >
              <option value="">Select Customer Address</option>
              {addresses &&
                addresses.map((address) => (
                  <option key={address._id} value={address._id}>
                    {formatAddressToString(address)}
                  </option>
                ))}
            </select>
          )}
      
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
    </div>

    {/* Unified Selected Address Section */}
    {selectedAddress && (
      <div className="relative w-full mt-4">
        <label className="text-sm font-medium" htmlFor="displayAddress">
          Selected Address:
        </label>
        <textarea
          className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
          name="displayAddress"
          value={formatAddressToString(selectedAddress)}
          readOnly
        />
        <button
          className="absolute top-8 right-2 text-red-600 hover:text-red-700"
          onClick={() => {
            setEditedAddress(selectedAddress);
            setShowEditAddressModal(true);
          }}
        >
          <FaEdit size={22} />
        </button>
      </div>
    )}

    {/* Checkbox and Shipping Address section */}
    {/* <div className="flex items-center space-x-2 mt-4">
      <input
        type="checkbox"
        checked={isSameAsBilling}
        onChange={handleCheckboxChange}
        className="h-5 w-5 text-red-600 bg-gray-100 border-red-600 rounded-md focus:ring-red-500 accent-red-600 cursor-pointer"
      />
      <span className="text-gray-800">Shipping Address Same as Billing Address</span>
    </div> */}
  </div>

  {/* Conditionally render shipping address textarea and edit button */}
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

                      {!isSameAsBilling && (
                        <div className="flex items-center justify-between gap-3 ">
                          <div className="mt-4 w-[90%] relative">
                            <label className="text-sm font-medium" htmlFor="shippingAddress">
                              Shipping Address:
                            </label>
                            <textarea
                              className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-500 focus:border-red-500 w-full p-2.5"
                              name="shippingAddress"
                              value={formatAddressToString(shippingAddress) || formatAddressToString(billingAddress)}
                              readOnly
                            />
                            <button
                              className="absolute top-8 right-2 text-red-600 hover:text-red-700"
                              onClick={() => {
                                setEditBillingAddress(shippingAddress || billingAddress);
                                setShowEditBillingAddressModal(true);
                              }}
                            >
                              <FaEdit size={22} />
                            </button>
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
</Grid>

                  {openAddressDialog && (
                    <EditAddress
                      open={openAddressDialog}
                      handleClose={handleClose}
                      setAddress={setAddress}
                      closeDialog={() => setOpenAddressDialog(false)}
                      setIsAddressSaved={setIsAddressSaved}
                      address={address}
                      setAddressList={setAddresses}
                      addressList={addresses}
                    />
                  )}
                  {/* <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <CustomCheckbox checked={shippingAddress === address}
                        onChange={handleShippingAddressChange}
                  />
                      }
                      label="Shipping Address: Same as Billing address"
                    />
                  </Grid> */}
                </Grid>
                <br />
              </div>
              {/* documents details  */}
              <div className="col-span-1 lg:col-span-1 bg-white shadow rounded p-4">
                <h1 className="text-2xl font-semibold mb-4">Document Details</h1>
                <Grid container spacing={2} direction="column">
                {state && (<Grid item>
                    <TextField
                      fullWidth
                      label="Invoice ID"
                      variant="outlined"
                      value={invoiceNumber}
                      // onChange={(e) => setInvoiceNumber(e.target.value)}
                      readOnly
                    //   InputLabelProps={{
                    //     style: { 
                    //       marginTop:'-4px',
                      
                    //     }
                    // }}
                    //   InputProps={{
                          
                    //     style:{height:'35px',borderRadius:'3px'}
                    //   }}
                    />
                  </Grid>)}
                  <Grid item>
                    {/* <TextField
                      fullWidth
                      label="Reference"
                      variant="outlined"
                      value={reference || ''}
                      onChange={(e) => setReference(e.target.value)}
                    
                      /> */}
                      <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="reference"
                    >
                     Agent Reference :
                    </label>
                      <select
                        id="copyFrom"
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-3"
                        value={reference || ''} // Bind state to the select element
                        onChange={(e) => setReference(e.target.value)} // Update state on change
                      >
                        {Array.isArray(Executives) &&
                          Executives.map((addr, index) => (
                            <option key={index} value={addr}>
                              {addr}
                            </option>
                          ))}
                      </select>
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      label="Invoice Date"
                      variant="outlined"
                      type="date"
                      value={invoiceDate || ''}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                    }}
                    //   InputProps={{
                      
                    //     style:{height:'35px',borderRadius:'3px'}
                    //   }}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      label="Due Date"
                      variant="outlined"
                      type="date"
                      value={dueDate || ''}
                      onChange={(e) => setDueDate(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                    }}
                    //   InputProps={{
                      
                    //     style:{height:'35px',borderRadius:'3px'}
                    //   }}
                    inputProps={{
                      min: invoiceDate,
                    }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      Status
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel id="status-label">Select an option</InputLabel>
                      <Select
                        labelId="status-label"
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        label="Select an option"
                        variant="outlined"
                      >
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Partially Paid">Partially Paid</MenuItem>
                        <MenuItem value="Overdue">Overdue</MenuItem>
                        <MenuItem value="Unpaid">Unpaid</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </div> 
              <div className="col-span-1 lg:col-span-3 bg-white shadow rounded px-4 pt-4">
                <h1 className="text-2xl font-semibold mb-4">Details</h1>
                <br />
                <Grid
      sx={{
        backgroundColor: 'white',
        
        
        marginTop: '-18px',
        marginBottom: '15px',
      
      }}
    >
      <TableContainer sx={{ backgroundColor: 'white' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell className="h-10 px-4 text-center align-middle font-medium text-muted-foreground border border-gray-300 bg-white">#</TableCell>
              <TableCell className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">Item & Description</TableCell>
              <TableCell className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">HSN/SAC</TableCell>
              <TableCell className="h-10 px-4 text-center align-middle font-medium text-muted-foreground border border-gray-300 bg-white">Quantity</TableCell>
              <TableCell className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">Rate(₹)</TableCell>
              <TableCell className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">Unit</TableCell>
              <TableCell className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">Discount(₹)</TableCell>
              <TableCell className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">CGST(%)</TableCell>
              <TableCell className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">SGST(%)</TableCell>
              <TableCell className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">Taxable(₹)</TableCell>
              <TableCell className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border border-gray-300 bg-white">Amount(₹)</TableCell>
              <TableCell className="h-10 px-4 text-center align-middle font-medium text-muted-foreground border border-gray-300 bg-white">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {itemList && itemList.map((item, index) => (
              <TableRow key={item._id} className="transition-colors hover:bg-muted/50">
                <TableCell sx={{ alignItems: 'justify-center', border: '1px solid #d1d5db' }}>{index + 1}</TableCell>
                <TableCell sx={{ alignItems: 'justify-center', border: '1px solid #d1d5db' }}>{item.itemandDescription}</TableCell>
                <TableCell sx={{ alignItems: 'justify-center', border: '1px solid #d1d5db' }}>{item.hsnSac}</TableCell>
                <TableCell sx={{ alignItems: 'justify-center', border: '1px solid #d1d5db' }}>
                  <div className="mt-auto flex items-center gap-3 justify-center">
                    <span className="font-bold text-sm leading-[18px]">{item.quantity}</span>
                  </div>
                </TableCell>
                <TableCell sx={{ alignItems: 'justify-center', border: '1px solid #d1d5db' }}>{item.rate}</TableCell>
                <TableCell sx={{ alignItems: 'justify-center', border: '1px solid #d1d5db' }}>{item.unit}</TableCell>
                <TableCell sx={{ alignItems: 'justify-center', border: '1px solid #d1d5db' }}>{item.discount}</TableCell>
                <TableCell sx={{ alignItems: 'justify-center', border: '1px solid #d1d5db' }}>{item.cgst}</TableCell>
                <TableCell sx={{ alignItems: 'justify-center', border: '1px solid #d1d5db' }}>{item.sgst}</TableCell>
                <TableCell sx={{ alignItems: 'justify-center', border: '1px solid #d1d5db' }}>{item.taxable}</TableCell>
                <TableCell sx={{ alignItems: 'justify-center', border: '1px solid #d1d5db' }}>{item.amount}</TableCell>
                <TableCell className='flex items-center justify-center'>
                  <Button onClick={() => removeItem(index)} className='text-[#dc2626]'>
                    <FaTrash />
                  </Button>
                  <Button onClick={() => handleAddItem(index)} className='text-[#779E40]'>
                    <FaEdit />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider />

      <Grid item xs={12} md={8}>
        <Box sx={{ pt: 2.5 }}>
          <Button
            className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-inter"
            startIcon={<Add />}
            onClick={handleOpenSelectProduct}
          >
            Add Item
          </Button>
          {/* Assuming SelectProduct is defined elsewhere */}
          <SelectProduct open={openSelectProduct} onClose={handleCloseSelectProduct} onSelectProduct={handleProductSelect} itemList={itemList} />
        </Box>
      </Grid>
    </Grid>

                {openItemDialog && (
                  <AdditemPopUp
            open={openItemDialog}      
            item={displayItem}
            onClose={() => setOpenItemDialog(false)}
         
            onSave={handleUpdateItem}
        
                  />
                )}
              </div>
              <div className="col-span-1 lg:col-span-1 bg-white shadow rounded px-4 pt-4">
                <h1 className="text-2xl font-semibold mb-4">Notes</h1>
                <Stack spacing={1} flex={1} paddingBottom="30px">
                  <TextField
                    placeholder="Enter additional notes"
                    multiline
                    rows={3}
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    inputProps={{
                      maxLength: 500,
                      
                    }}
                   
                    sx={{
                      width: '100%',
                      '& .MuiFormHelperText-root': {
                        mr: 0,
                        display: 'flex',
                        justifyContent: 'flex-end'
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '3px',
                      },
                    }}
                  />
              
                </Stack>
              </div>
              {/* Bank Details */}
              <div className="col-span-1 lg:col-span-1 bg-white shadow px-4 pt-4">
                <h1 className="text-2xl font-semibold mb-4">Bank Details</h1>
                {/* <Stack spacing={1} flex={1}>
                <FormControl sx={{ width: '100%' }}>
                    <Select
                      sx={{borderRadius:'3px',height:'35px'}}
                      displayEmpty
                      name="option"
                      id="option"
                      value={selectedBankId}
                      onChange={(e)=>setSelectedBankId(e.target.value)}
                     
                    >
                       <MenuItem value='' disabled>Select Bank</MenuItem>
                       {allBanks && allBanks.map((bank) => (
                        <MenuItem key={bank._id} value={bank._id}>
                            {bank.accountname} - {bank.bankname}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack> */}
                {/* <BankDetailsComponent matchedId={selectedBankId} changeBankId={changeBankId} setBankDetails={state.bankDetails}
                /> */}
                <BankDetailsComponent
                matchedId={state?.bankDetails?._id}
                  setBankDetails={bankDetails}
                  BankIdd={selectedBankIdd}
                  changeBankId={changeBankId}
                  // quotation={Orders}
                />

              </div>
              <div className="col-span-1 lg:col-span-1 row-span-3 bg-white shadow rounded p-4 h-fit">
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="textSecondary">Total Amount before Tax:</Typography>
                    {/* <Typography>{country?.prefix + subtotal.toFixed(2)}</Typography> */}
                    <Typography>₹{totalAmountBeforeTax}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="textSecondary">Total Amount:</Typography>
                    <Typography>₹{total}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="textSecondary">Extra Charge:</Typography>
                    <Typography>₹{totalExtra}</Typography>

                 </Stack>
                  
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle1">Grand Total:</Typography>
                    <Typography variant="subtitle1">₹{grandTotal}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="textSecondary">Include Round off:</Typography>
                    <Typography variant="h6" color="success">
                      {/* ₹{roundTotal} */}
                      ₹{roundoff}
                    </Typography>
                  </Stack>

                  <Grid container spacing={2}>
                    
                    <Grid item>
                      <Button
                        variant="solid"
                        className="bg-red-600 rounded-md text-white p-2 font-semibold hover:bg-red-700 hover:text-white font-inter"
                        fullWidth
                       
                      onClick={() => setShowExtraChargePopup(true)}

                      >
                        + Add Extra Charge
                      </Button>
                    </Grid>
                  </Grid>
                
                  {/* {showDiscountInput && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-4 rounded shadow-lg">
                    <h2 className="text-lg font-semibold">Add Discount</h2>
                    <input
                      type="number"
                      value={discountInput}
                      onChange={handleDiscountInputChange}
                      className="border p-2 w-full mt-2"
                      placeholder="Enter amount"
                    />
                    <button
                      onClick={handleDiscountSubmit}
                      className="bg-red-600 rounded-md text-white p-2 font-semibold hover:bg-red-700 hover:text-white font-poppins mt-2"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowDiscountInput(false)}
                      className="bg-red-600 rounded-md text-white p-2 font-semibold hover:bg-red-700 hover:text-white font-poppins mt-2 ml-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )} */}

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
        
                </Stack>
              </div>

              <br />
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
                      onChange={(e) => setEditAddress({ ...editAddress, address1:e.target.value })}
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
                      onChange={(e) => setEditAddress({ ...editAddress, address2:e.target.value  })}
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
                        onChange={(e) => setEditAddress({ ...editAddress, city:e.target.value  })}

                        className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                      />
                    </div>
                    <div className='my-2'>
                      <label className="text-sm font-medium">State:</label>
                      <input
                        type="text"
                        name="state"
                        value={editAddress.state}
                        onChange={(e) => setEditAddress({ ...editAddress, state:e.target.value  })}

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
                        onChange={(e) => setEditAddress({ ...editAddress, country:e.target.value  })}

                        className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                      />
                    </div >
                    <div className='my-2'>
                      <label className="text-sm font-medium">Pincode:</label>
                      <input
                        type="text"
                        name="pincode"
                        value={editAddress.pincode}
                        onChange={(e) => setEditAddress({ ...editAddress, pincode:e.target.value })}

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
             {showEditBillingAddressModal && (
            <div className="modal z-50">
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
                <div className="bg-white p-8 w-1/3 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-semibold mb-4">Edit Address</h3>
                  <div className='my-2'>
                    <label className="text-sm font-medium">Address 1:</label>
                    <input
                      type="text"
                      name="address1"
                      value={editBillingAddress.address1 || ''}
                      onChange={(e) => setEditBillingAddress({ ...editBillingAddress, address1:e.target.value })}
                      className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                    // className="block w-full border p-2 mb-2 bg-white"
                    />
                  </div>
                  <div className='my-3'>
                    <label className="text-sm font-medium">Address 2:</label>
                    <input
                      type="text"
                      name="address2"
                      value={editBillingAddress.address2 || ''}
                      onChange={(e) => setEditBillingAddress({ ...editBillingAddress, address2:e.target.value  })}
                      className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='my-3'>
                      <label className="text-sm font-medium">City:</label>
                      <input
                        type="text"
                        name="city"
                        value={editBillingAddress.city}
                        onChange={(e) => setEditBillingAddress({ ...editBillingAddress, city:e.target.value  })}

                        className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                      />
                    </div>
                    <div className='my-2'>
                      <label className="text-sm font-medium">State:</label>
                      <input
                        type="text"
                        name="state"
                        value={editBillingAddress.state}
                        onChange={(e) => setEditBillingAddress({ ...editBillingAddress, state:e.target.value  })}

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
                        value={editBillingAddress.country}
                        onChange={(e) => setEditBillingAddress({ ...editBillingAddress, country:e.target.value  })}

                        className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                      />
                    </div >
                    <div className='my-2'>
                      <label className="text-sm font-medium">Pincode:</label>
                      <input
                        type="text"
                        name="pincode"
                        value={editBillingAddress.pincode}
                        onChange={(e) => setEditBillingAddress({ ...editBillingAddress, pincode:e.target.value })}

                        className="bg-white border border-gray-300  text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"

                      />
                    </div>
                  </div >
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
       
              
          <SelectCustomer open={openSelectCustomer} handleClose={handleCloseSelectCustomer} onCustomerSelect={handleCustomerSelect}handleDialogOpen={handleDialogOpen} />
          <AddCustomer open={dialogOpen} handleClose={handleClose} />
            </Box>
             <Box>
                <Stack direction="row" spacing={2} justifyContent="flex-start" sx={{ height: '100%'}}>
                  <Button variant="outlined" onClick={handleFinalSave} className="bg-lime-600 text-white rounded-md font-semibold hover:bg-lime-700 hover:text-white font-inter p-2 border-0">
                    Save
                  </Button>
                </Stack>
              </Box>
        <Toaster position="top-right" reverseOrder={false} style={{ zIndex: 2000000 }} />
            </Box>
          );
        }


export default Create;

