import React, { useState, useEffect, useMemo, useRef } from 'react';
import AddItemPopUp from '../invoice/AdditemPopUp';
import { ToastContainer } from 'react-toastify';
import AddCustomer from '../Quote/addCustomer';


import {
  Box,
  Button,
  Checkbox as CheckboxMUI,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
  FormControl,
  Popper,
  Paper,
  MenuList,
  Menu,
  ClickAwayListener,
} from '@mui/material';
import SignatureCanvas from './signatureCanvas';
import AppLogo from '../../../assets/images/icons/appLogo.png';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Toaster, toast } from 'react-hot-toast';
import MainCard from 'components/MainCardWithoutTitle';
import { getAllProducts } from 'pages/utils/leads/api'
import { CreateReceipt, EditReceipt, getPaymentById } from 'pages/utils/payment_receipts/api';
import { fetchAddressById } from 'pages/utils/customers/api';
import { AddProduct } from 'pages/utils/products/api';
import CloseIcon from '@mui/icons-material/Close';
import { getAllExecutives } from 'pages/utils/leads/api';
import { fetchAllCustomers } from 'pages/utils/customers/api';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

const MoneyReceipt = () => {
  const location = useLocation();
  const { id } = useParams();
  const { state } = location;
  // console.log(state)
  const [customers, setCustomers] = useState([]);
  const [signaturePreview, setSignaturePreview] = useState('');
  const [openAddItemPopUp, setOpenAddItemPopUp] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productsList, setProductsList] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedOnlinePaymentMode, setSelectedOnlinePaymentMode] = useState("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [allExecutives, setAllExecutives] = useState([]);
  const [selectedExecutive, setSelectedExecutive] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const paymentModeOptions = ["CASH", "CHEQUE", "ONLINE"];
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [chequeData, setChequeData] = useState("");
  const [isSignatureLoaded, setIsSignatureLoaded] = useState(false);
  const [custAddressOpen, setCustAddressOpen] = useState(false);

  const handleCustAddressDropdownOpen = () => setCustAddressOpen(true);
  const handleCustAddressDropdownClose = () => setCustAddressOpen(false);

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
    setChequeDetails({ ...chequeDetails, address: formattedAddress });
    handleCustAddressDropdownClose();
  };

  const selectRef = useRef(null);
  const [openProduct, setOpenProduct] = useState(false);
  const openProductPopup = () => setOpenProduct(true);
  const closeProductPopup = (e) => {
    e.stopPropagation();
    setOpenProduct(false);
  }
  const [productData, setProductData] = useState({
    itemname: '',
    description: '',
    hsn: '',
    gst: 0,
    code: '',
    category: '',
    subcategory: '',
    actualprice: '',
    sellingprice: '',
  });

  const [custAddress, setCustAddress] = useState([]);
  const [chequeDetails, setChequeDetails] = useState({
    customer: {
      firstName: state?.customer?.firstName || '',
      lastName: state?.customer?.lastName || '',
    },
    address: state?.address || '',
    mobileNumber: state?.mobileNumber || '',
    alternateNumber: state?.alternateNumber || '',
    receiptDate: state?.receiptDate || '',

    dueDate: state?.dueDate || '',
    amountReceivedInFavourOf: state?.amountReceivedInFavourOf || '',
    totalDueAmount: state?.totalDueAmount || 0,
    balanceDue: state?.balanceDue || 0,
    amountPaid: state?.amountPaid || 0,
    description: state?.description || '',
    paymentMode: state?.paymentMode || '',
    amountReceived: state?.amountReceived || ''

  });
  const [openMode, setOpenMode] = useState(false);
  const [sign, setSign] = useState('');
  const [Image, setImage] = useState('');

  const addressRef = useRef(null);

  const selectModeRef = useRef(null);
  useEffect(() => {
    const fetchAllExecutives = async () => {
      const token = localStorage.getItem('token');
      const response = await getAllExecutives(token);
      // console.log(response.data)
      setAllExecutives(response?.data);
    }
    fetchAllExecutives();
  }, []);

  useEffect(() => {
    if (state?.customer?.firstName) {
      const matchedCustomer = filteredCustomers.find(
        customer =>
          customer.firstName === state.customer.firstName &&
          customer.lastName === state.customer.lastName
      );
      setSelectedCustomer(matchedCustomer ? matchedCustomer._id : '');
    }
  }, [state, filteredCustomers]);
  useEffect(() => {
    if (state?.products) {
      const matchedProduct = productsList.find(product => product.itemname === state.products);
      setSelectedProduct(matchedProduct ? matchedProduct.itemname : '');
    }
  }, [state, productsList]);
  useEffect(() => {
    if (state?.products) {
      const matchedExecutive = allExecutives.find(agent => agent === state.executive);
      setSelectedExecutive(matchedExecutive ? matchedExecutive : '');
    }
  }, [state, allExecutives]);

  useEffect(() => {
    if (state?.paymentMode) {
      const matchedPaymentMode = paymentModeOptions.find((mode) => mode === state.paymentMode);
      setSelectedPaymentMode(matchedPaymentMode ? matchedPaymentMode : '');
    }
  }, []);

  const navigate = useNavigate();

  const handleToggleMode = () => {
    setOpenMode(prevOpenMode => !prevOpenMode);
  };
  const handlePaymentModeSelect = (mode) => {
    setSelectedPaymentMode(mode);
    setOpenMode(false);
  };
  const flattenObject = (obj, parentKey = '') => {
    let result = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (value && typeof value === 'object') {
        if (Array.isArray(value)) {
          result[newKey] = value.join('; ');
        } else {
          result = { ...result, ...flattenObject(value, newKey) };
        }
      } else {
        result[newKey] = value;
      }
    }
    return result;
  };


  const formatDate = (date) => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };

 
  const createReceipt = async () => {
    // Perform validation checks
    if (!selectedCustomer) {
      toast.error("Customer is required");
      return;
    }
    if (!chequeDetails.address) {
      toast.error("Address is required");
      return;
    }
    if (!chequeDetails.alternateNumber) {
      toast.error("Alternate number is required");
      return;
    }
    if (!chequeDetails.receiptDate) {
      toast.error("Receipt date is required");
      return;
    }
    if (!chequeDetails.dueDate) {
      toast.error("Due date is required");
      return;
    }
    if (!chequeDetails.amountReceived) {
      toast.error("Amount received should not be empty");
      return;
    }
    if (!chequeDetails.amountReceivedInFavourOf) {
      toast.error("Amount received in favour of field should not be empty");
      return;
    }
    if (!selectedProduct) {
      toast.error("Product is required");
      return;
    }
    if (!selectedExecutive) {
      toast.error("Agent name is required");
      return;
    }
    if (!selectedPaymentMode) {
      toast.error("Payment mode is required");
      return;
    }
    if (!chequeDetails.description) {
      toast.error('Description required');
      return;
    }
    if (!sign) {
      toast.error('Authorized Signatory required');
      return;
    }

    // Check for specific payment modes
    if (selectedPaymentMode === "CHEQUE") {
      if (!chequeData) {
        toast.error("Cheque field is required");
        return;
      }
    }
    if (selectedPaymentMode === "ONLINE") {
      if (!selectedOnlinePaymentMode) {
        toast.error("Online payment mode is required");
        return;
      }
      if (!selectedBank) {
        toast.error("Please, select bank name");
        return;
      }
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append('authorizedSignatory', sign);
    formData.append('customer', selectedCustomer);
    formData.append('address', chequeDetails.address);
    formData.append('mobileNumber', chequeDetails.mobileNumber);
    formData.append('alternateNumber', chequeDetails.alternateNumber);
    formData.append('receiptDate', formatDate(chequeDetails.receiptDate));
    formData.append('dueDate', formatDate(chequeDetails.dueDate));
    formData.append('products', selectedProduct);
    formData.append('amountReceivedInFavourOf', chequeDetails.amountReceivedInFavourOf);
    formData.append('totalDueAmount', chequeDetails.totalDueAmount);
    formData.append('amountPaid', chequeDetails.amountPaid);
    formData.append('balanceDue', chequeDetails.balanceDue);
    formData.append('description', chequeDetails.description);
    formData.append('executive', selectedExecutive);
    formData.append('paymentMode', selectedPaymentMode);

    if (selectedPaymentMode === "ONLINE") {
      const onlinePaymentDetails = {
        mode: selectedOnlinePaymentMode,
        bank: selectedBank,
      };
      formData.append('onlinePaymentDetails', JSON.stringify(onlinePaymentDetails));
    }

    // Only append 'chequeDetails' for CHEQUE payment mode
    if (selectedPaymentMode === "CHEQUE" && chequeData) {
      formData.append('chequeDetails', chequeData);
    }

    // Append amountReceived if available
    if (chequeDetails.amountReceived) {
      formData.append('amountReceived', chequeDetails.amountReceived);
    }

    // Send request
    const token = localStorage.getItem('token');
    const response = await CreateReceipt(formData, token);

    if (response) {
      toast.success("Receipt created successfully...");
      setTimeout(() => {
        navigate('/apps/payment_receipts');
      }, 1000);    }
  };



  const editReceipt = async () => {

    if (!selectedCustomer) {
      toast.error('Customer required');
      return;
    } else if (!selectedProduct) {
      toast.error('Product required');
      return;
    } else if (!chequeDetails.address) {
      toast.error('Address required');
      return;
    }
    else if (!chequeDetails.mobileNumber) {
      toast.error('Mobile Number required');
      return;
    } else if (!chequeDetails.alternateNumber) {
      toast.error('Alternate Number required');
      return;
    } else if (!chequeDetails.receiptDate) {
      toast.error('Receipt Date required');
      return;
    } else if (!chequeDetails.dueDate) {
      toast.error('DueDate required');
      return;
    } else if (!chequeDetails.amountReceivedInFavourOf) {
      toast.error('Amount Received required');
      return;
    } else if (!chequeDetails.totalDueAmount) {
      toast.error('Total DueAmount required');
      return;
    } else if (!chequeDetails.amountPaid) {
      toast.error('Amount Paid required');
      return;
    } else if (!chequeDetails.balanceDue) {
      toast.error('Due Balance required');
      return;
    } else if (!selectedExecutive) {
      toast.error('Agent Name required');
      return;
    }
    // else if (!sign) {
    //   toast.error('Authorized Signatory required');
    //   return;
    // }
      
    else if (!chequeDetails.description) {
      toast.error('Description required');
      return;
    }

    const onlinePaymentDetails = {
      mode: selectedOnlinePaymentMode,
      bank: selectedBank,
    };


    const formData = new FormData();
    console.log("Sign format-->", sign)
    if (sign) {
      formData.append('authorizedSignatory', sign);
    }
    // formData.append('authorizedSignatory', sign || " String");
    formData.append('customer', selectedCustomer);
    formData.append('address', chequeDetails.address);
    formData.append('mobileNumber', chequeDetails.mobileNumber);
    formData.append('alternateNumber', chequeDetails.alternateNumber);
    formData.append('receiptDate', formatDate(chequeDetails.receiptDate));
    // formData.append('receiptNumber', chequeDetails.receiptNumber);
    formData.append('dueDate', formatDate(chequeDetails.dueDate));
    formData.append('products', selectedProduct);
    formData.append('amountReceivedInFavourOf', chequeDetails.amountReceivedInFavourOf);
    formData.append('totalDueAmount', chequeDetails.totalDueAmount);
    formData.append('amountPaid', chequeDetails.amountPaid);
    formData.append('balanceDue', chequeDetails.balanceDue);
    formData.append('description', chequeDetails.description);
    formData.append('executive', selectedExecutive);
    formData.append('paymentMode', selectedPaymentMode);
    if (selectedPaymentMode === "ONLINE") {
      formData.append('onlinePaymentDetails', JSON.stringify(onlinePaymentDetails) || " ");
    }
    if (selectedPaymentMode === "CHEQUE" && chequeData) {
      formData.append('chequeDetails', chequeData || " ");
    }
    if (chequeDetails.amountReceived) {
      formData.append('amountReceived', chequeDetails.amountReceived || " ");
    }    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }
    const token = localStorage.getItem('token');
    const response = await EditReceipt(id, formData, token);
    // console.log("Payment receipt updated-->",response);
    if (response) {
      toast.success("Receipt updated successfully...");
      setTimeout(() => {
        navigate('/apps/payment_receipts');
      }, 1000);    }
    else {
      toast.error("Something went wrong...");

    }

  }
  const handleChangeProductData = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };
  const handleSubmit = () => {

    if (!id) {
      createReceipt();
    }
    if (id) {
      editReceipt();
    }

  };
  const handleSubmitProductData = async () => {

    const token = localStorage.getItem('token');
    const productDetails = { ...productData };
    await AddProduct(productDetails, token);
    const productOptions = await getAllProducts(token);
    setProductsList(productOptions?.products);
    closeProductPopup();

  };
  const openMenu = (event) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleAgentSelection = (agent) => {
    setSelectedExecutive(agent);
    closeMenu();
  };
  const closeMenu = () => {
    setMenuAnchor(null);
  };
  useEffect(() => {
    const getProducts = async () => {
      const token = localStorage.getItem('token')
      const productOptions = await getAllProducts(token);
      console.log("this is all product----->", productOptions)
      setProductsList(productOptions?.products);
    }
    getProducts();
  }, [])
  useEffect(() => {
    fetchCustomers();
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('token')
    const getParticularPayment = async () => {
      const Paymentsign = await getPaymentById(id, token);
      console.log('Paymentsign from api', Paymentsign)

      if (Paymentsign?.authorizedSignatory) {
        const url = Paymentsign.authorizedSignatory;
        setImage(url)
        // Convert the image URL to a Blob and then a File
        // const file = await urlToFile(url, 'signature.png'); // Assuming the image is PNG, you can change the format if necessary
        // setSign(file); // Store the file instead of the URL
      }

      // setSign(URL.createObjectURL(Paymentsign?.authorizedSignatory))
      // setSign(Paymentsign?.authorizedSignatory);
      setIsSignatureLoaded(true);
    }
    if (id) {
      getParticularPayment();
    }
  }, [id])

  // const urlToFile = async (url, filename) => {
  //   // const response = await fetch(url );
  //   console.log(response); // Log the response details
  //   // const blob = await response.blob(); // Convert the response into a Blob
  //   // const file = new File([blob], filename, { type: blob.type },{ redirected: 'follow' }); // Convert Blob to File
  //   // return file;

  //   const response = await fetch(url, {
  //     redirect: 'manual'  // This will stop following redirects automatically
  //   });
    
  //   if (response.status === 302 || response.status === 301) {
  //     const redirectedURL = response.headers.get('Location');
  //     const finalResponse = await fetch(redirectedURL);
  //     const blob = await finalResponse.blob();
  //     const file = new File([blob], 'signature.png', { type: blob.type });
  //         return file;

  // };
  // const getObjectURL = (file) => {
  //   return URL.createObjectURL(file);
  // };

  const fetchCustomers = async () => {
    try {
      const res = await fetchAllCustomers();
      // console.log(res)
      setCustomers(res);
      setFilteredCustomers(res);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
    if (!open) {
      setSearchTerm('');
      setFilteredCustomers(customers);
    }
  };
  const handleCustomerSelect = async (customerId) => {
    const selectedCustomer = filteredCustomers.find(customer => customer._id === customerId);
    // console.log("Selected Customer: ", selectedCustomer);
    setSelectedCustomer(customerId);
    setOpen(false);
    const token = localStorage.getItem('token');
    const res = await fetchAddressById(customerId, token);
    // console.log(res);
    setCustAddress(res);
  };

  const handleAddSign = (e) => {
    const file = e.target.files[0]; // Get the uploaded file
    console.log('Image banner', file);

    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload only image files.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result);
        setIsSignatureLoaded(true);
      };
      reader.readAsDataURL(file);
      setSign(file);



    }

  };

  const renderDropdown = (width) => (
    <Popper open={open} anchorEl={selectRef.current} placement="bottom-start" sx={{ width }} disablePortal={false}>
      <Paper>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Customer"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ mb: 2, width: '100%' }}
        />
        <MenuList sx={{ maxHeight: '200px', overflow: 'auto' }}>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <MenuItem key={customer._id} onClick={() => handleCustomerSelect(customer._id)}>
                {customer.firstName} {customer.lastName}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No customers found</MenuItem>
          )}
        </MenuList>
      </Paper>
    </Popper>
  );
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = customers.filter((customer) =>
      `${customer.firstName} ${customer.lastName}`
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };
  const handleClickAway = (event) => {
    if (addressRef.current && !addressRef.current.contains(event.target)) {
      handleCustAddressDropdownClose();
    }
  };
  // console.log("CustAddress----->",custAddress);
  // const handleSignatureChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setSignaturePreview(reader.result); // Set the image preview URL
  //       setSign(file); // Store the file itself
  //       setIsSignatureLoaded(true); // Mark the signature as loaded
  //     };
  //     reader.readAsDataURL(file); // Read the file as a data URL
  //   }

  // };

  // Function to convert 'DD-MM-YYYY' to 'YYYY-MM-DD'
  const formatDateForInput = (dateString) => {
    if (!dateString) return ''; // Handle cases where the date might be null or undefined
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };

  // Effect to handle receipt date formatting if fetched from an API
  useEffect(() => {
    if (chequeDetails.receiptDate) {
      // Format the date only if it's present
      setChequeDetails((prevDetails) => ({
        ...prevDetails,
        receiptDate: formatDateForInput(prevDetails.receiptDate)
      }));
    }
  }, []);

  // Effect to handle receipt date formatting if fetched from an API
  useEffect(() => {
    if (chequeDetails.dueDate) {
      // Format the date only if it's present
      setChequeDetails((prevDetails) => ({
        ...prevDetails,
        dueDate: formatDateForInput(prevDetails.dueDate)
      }));
    }
  }, []);

  const formControlWidth = selectRef.current ? selectRef.current.offsetWidth : 'auto';
  const handleReset = () => {

    setChequeDetails({
      customer: {
        firstName: '',
        lastName: '',
      },
      address: '',
      mobileNumber: '',
      alternateNumber: '',
      receiptDate: '',

      dueDate: '',
      amountReceivedInFavourOf: '',
      totalDueAmount: 0,
      balanceDue: 0,
      amountPaid: 0,
      description: '',
      paymentMode: '',
      amountReceived: ''
    });
    setOpenMode(false);
    setSign('');
    setFile('');
    setImage(' ')
    setPreview('');
    setSignaturePreview('');
    setSelectedExecutive('');
    setSelectedCustomer('');
    setSelectedPaymentMode('')
  };

  return (
    <>
      <Box>
        <MainCard
          content={false}

        >
          {/* Body of template */}
          <Box className='flex flex-col gap-4 items-center justify-center'>
            <Box className="flex justify-center items-center gap-2 border border-black font-normal-400 text-black rounded font-inter px-2 py-1"
              sx={{ borderColor: 'rgba(0,0,0,0.35)' }}>
              <Typography>PAYMENT RECEIPT</Typography>
            </Box>

            <Box className='w-[99%] mx-auto'>
              <Box className='flex flex-col border border-rgba(0,0,0,0.6) items-center'>
                <Stack direction="row" className='flex w-full relative'>
                  <Box className="absolute top-5 left-5">
                    <Typography className='text-[20px]' sx={{ fontFamily: 'inter', fontWeight: 400, lineHeight: '17px' }}>GSTIN:07AWKPV4949H1ZT</Typography>

                  </Box>
                  <Box sx={{ backgroundColor: 'white', flexGrow: 1, padding: '10px' }}>
                    <Box className='flex justify-center' sx={{ marginBottom: '5px' }}>
                      <Box sx={{ height: '66px', width: '239px' }}>
                        <img src={AppLogo} alt="App Logo" className="w-full h-full object-contain" />
                      </Box>
                    </Box>
                    <Typography
                      className='text-center text-[15px]'
                      sx={{ fontFamily: 'inter', fontWeight: 400, lineHeight: '26px', marginBottom: '8px' }}
                    >
                      2nd Floor, E2-258, Above Petal Valley School, Shastri Nagar, New Delhi - 110052
                    </Typography>
                    <Divider
                      style={{ width: '30%', borderBottom: '3px solid rgb(174,174,174)', margin: '8px auto' }}
                    />
                    <Box className='flex gap-4 justify-center' sx={{ marginBottom: '8px' }}>
                      <Typography
                        className='text-center text-[13px]'
                        sx={{ fontFamily: 'inter', fontWeight: 400, lineHeight: '17px' }}
                      >
                        Mob: 91-7827677274 | Mob: 91-7827677274 | Landline: 011- 44723265
                      </Typography>
                    </Box>

                    <Box className='flex gap-4 justify-center'>
                      <Typography
                        className='text-center text-[13px]'
                        sx={{ fontFamily: 'inter', fontWeight: 400, lineHeight: '17px' }}
                      >
                        Email: sales@osmsturf.com | www.osmsturf.com
                      </Typography>
                    </Box>
                  </Box>


                </Stack>

              </Box>
              <Box className='border-x border-b border-rgba(0,0,0,0.3) flex py-4 px-2 gap-2'>
                <Box className='w-[35%] flex flex-col gap-4'>
                  <Stack className='w-full text-md border border-rgba(0,0,0,0.6)'>
                    <Typography className='w-1/3 text-white bg-[#5581b4] px-2 text-[18px]' sx={{ fontWeight: 500, fontFamily: 'inter' }}>Received From:</Typography>
                    <Box className='flex gap-1'>
                      <Box className='w-[58%] px-1 py-1 flex flex-col gap-1'>
                        <Box>
                          <FormControl fullWidth ref={selectRef}>
                            <Button
                              sx={{
                                border: '1px solid rgba(0,0,0,0.5)', fontWeight: 'inter', color: 'rgba(0,0,0,0.5)', fontWeight: 500,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingX: '10px',
                                height: '35px',

                              }}

                              onClick={handleToggle}
                              fullWidth
                            >

                              <Typography className='text-[11px]'>Select Customer</Typography>
                              <ArrowDropDownOutlinedIcon />
                            </Button>
                            {open && renderDropdown(formControlWidth)}
                          </FormControl>


                        </Box>
                        <Box>
                          <TextField className='w-full'
                            value={selectedCustomer
                              ? `${customers.find(customer => customer._id === selectedCustomer)?.firstName} ${customers.find(customer => customer._id === selectedCustomer)?.lastName}`
                              : ''}
                            sx={{
                              fontWeight: 'inter', color: 'rgba(0,0,0,0.5)', fontWeight: 500, fontSize: '12px',
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  border: '1px solid rgba(0,0,0,0.5)',
                                },
                              },
                            }}
                            InputProps={{
                              sx: {
                                height: '35px',
                                padding: '0',
                              },
                            }}

                          />
                        </Box>
                        <ClickAwayListener onClickAway={handleClickAway}>
                          <Box ref={addressRef} sx={{ position: 'relative' }}>
                            <TextField
                              className="w-full"
                              placeholder="Enter address"
                              multiline
                              rows={4}
                              value={chequeDetails.address || ''}
                              onChange={(e) => {
                                setChequeDetails({ ...chequeDetails, address: e.target.value });
                                handleCustAddressDropdownClose();
                              }}
                              sx={{
                                fontWeight: 'inter', color: 'rgba(0,0,0,0.5)', fontWeight: 500, fontSize: '11px',

                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    border: '1px solid rgba(0,0,0,0.5)',
                                  },
                                },
                              }}
                              onMouseEnter={handleCustAddressDropdownOpen}
                              onMouseLeave={(e) => {

                                if (addressRef.current && e.relatedTarget instanceof Node) {
                                  if (!addressRef.current.contains(e.relatedTarget)) {
                                    handleCustAddressDropdownClose();
                                  }
                                } else {
                                  handleCustAddressDropdownClose();
                                }
                              }}


                              InputProps={{
                                sx: {

                                  padding: '5px 10px',
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  fontFamily: 'inter'
                                },
                              }}
                            />
                            {
                              custAddressOpen && custAddress && custAddress.length > 0 && (
                                <Box

                                  sx={{
                                    position: "absolute",
                                    zIndex: 2000000,
                                    left: '100%',
                                    top: 0,
                                    backgroundColor: "white",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    maxHeight: "150px",
                                    overflowY: "auto",
                                    width: "500px",
                                    padding: "14px 8px",
                                  }}
                                >
                                  {custAddress.map((address) => (
                                    <Box
                                      onClick={() => handleSelectAddressDropdown(address)}

                                      sx={{
                                        cursor: 'pointer', padding: '16px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', width: '100%', padding: '4px',
                                        marginBottom: '5px',
                                        '&:hover': {
                                          backgroundColor: 'rgba(0,0,0,0.1)',
                                        }

                                      }}>
                                      <Typography className='font-semibold'>{address.type}</Typography>
                                      <Divider sx={{ width: '80%' }} />
                                      <Typography variant="body1">
                                        {
                                          [
                                            address.address1,
                                            address.address2,
                                            address.city,
                                            address.state,
                                            address.pincode,
                                            address.country
                                          ]
                                            .filter(part => part && part.trim() !== "")
                                            .join(", ")
                                        }
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              )
                            }
                          </Box>
                        </ClickAwayListener>
                        <Box className='flex gap-2'>
                          <Box className='w-1/2'>
                            <TextField className='w-full'
                              placeholder="Enter mobile number"
                              type="tel"
                              value={chequeDetails.mobileNumber || ''}
                              onChange={(e) => setChequeDetails({ ...chequeDetails, mobileNumber: e.target.value })}
                              sx={{
                                fontWeight: 'inter', color: 'rgba(0,0,0,0.5)', fontWeight: 500, fontSize: '11px',
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    border: '1px solid rgba(0,0,0,0.5)',
                                  },
                                },
                              }}
                              InputProps={{
                                sx: {
                                  height: '35px',
                                  padding: '0',
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  fontFamily: 'inter'
                                },
                                inputProps: {
                                  //maxLength: 10,
                                  pattern: '[0-9]*',
                                  inputMode: 'numeric',
                                }
                              }}
                            />

                          </Box>
                          <Box className='w-1/2'>
                            <TextField className='w-full'
                              placeholder="Alternate number"
                              type="tel"
                              sx={{
                                fontWeight: 'inter', color: 'rgba(0,0,0,0.5)', fontWeight: 500, fontSize: '11px',
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    border: '1px solid rgba(0,0,0,0.5)',
                                  },
                                },
                              }}
                              value={chequeDetails.alternateNumber || ''}
                              onChange={(e) => setChequeDetails({ ...chequeDetails, alternateNumber: e.target.value })}
                              InputProps={{
                                sx: {
                                  height: '35px',
                                  padding: '0',
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  fontFamily: 'inter'
                                },
                                inputProps: {
                                  maxLength: 10,
                                  pattern: '[0-9]*',
                                  inputMode: 'numeric',
                                }
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                      <Box className='flex-1 py-1'>
                        <Box className='flex justify-center mr-1'>
                          <Button className='w-full bg-[#6a89f8] text-white border border-black flex items-center gap-2'
                            onClick={() => setOpenAddItemPopUp(!openAddItemPopUp)}
                          >
                            <ControlPointOutlinedIcon sx={{ color: 'black' }} />
                            <Typography className='text-[12px]'>Add new customer</Typography>

                            <AddCustomer
                              open={openAddItemPopUp}
                              handleClose={() => setOpenAddItemPopUp(false)} />


                          </Button>
                        </Box>
                        <Box className='mt-4 mr-1'>
                          <Grid container alignItems="center">
                            <Grid container>
                              <Grid item xs={4}>
                                <Typography variant="body1" className='border border-rgba(0,0,0,0.5) h-[28px] flex items-center text-[12px] pl-1' sx={{ fontWeight: 500 }}>Date:</Typography>
                              </Grid>
                              <Grid item xs={8}>
                                <TextField
                                  type="date"
                                  fullWidth
                                  value={chequeDetails?.receiptDate || ''} // Show the formatted default date or empty string
                                  onChange={(e) => setChequeDetails({ ...chequeDetails, receiptDate: e.target.value })} // Handle date change
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      '&:hover fieldset': {
                                        border: '1px solid rgba(0,0,0,0.5)',
                                      },
                                    },
                                  }}
                                  InputProps={{
                                    sx: {
                                      padding: '0',
                                      borderRadius: 0,
                                      fontSize: '12px',
                                      fontWeight: 500,
                                    },
                                  }}
                                  inputProps={{
                                    style: {
                                      height: '26px',
                                      padding: '0 4px',
                                      border: '1px solid rgba(0,0,0,0.5)',
                                    },
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <Grid container>
                              <Grid item xs={4}>

                                <Typography variant="body1" mb={1} className='border border-rgba(0,0,0,0.5) h-[28px] flex items-center text-[12px] pl-1'>Due Date</Typography>
                              </Grid>
                              <Grid item xs={8}>
                                <TextField
                                  type="date"
                                  fullWidth
                                  value={chequeDetails?.dueDate || ''} // Show the formatted default due date or empty string
                                  onChange={(e) => setChequeDetails({ ...chequeDetails, dueDate: e.target.value })} // Handle date change
                                  InputProps={{
                                    sx: {
                                      padding: '0',
                                      borderRadius: 0,
                                      fontWeight: 500,
                                      fontSize: '12px',
                                    },
                                  }}
                                  inputProps={{
                                    style: {
                                      height: '26px',
                                      padding: '0 4px',
                                      border: '1px solid rgba(0,0,0,0.5)',
                                    },
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Box>
                  </Stack>
                  <Stack className='w-full text-md border border-rgba(0,0,0,0.6) h-full'>

                    <Box className='flex justify-between items-center w-1/2 text-white bg-[#5581b4] p-2 text-[14px]' sx={{ fontWeight: 500, fontFamily: 'inter' }}>
                      <Typography className='w-[70%]'>Amount received:</Typography>
                      <Box>
                        <TextField
                          className='w-full'
                          placeholder="Enter amount"
                          type="text"
                          sx={{
                            fontWeight: 'inter',
                            color: 'rgba(0,0,0,0.5)',
                            fontWeight: 500,
                            fontSize: '11px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': {
                                border: '1px solid rgba(0,0,0,0.5)',
                              },
                            },
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 0,
                            },
                          }}
                          value={chequeDetails.amountReceived || ''}
                          onChange={(e) => setChequeDetails({ ...chequeDetails, amountReceived: e.target.value })}
                          InputProps={{
                            sx: {
                              height: '25px',
                              padding: '0',
                              fontSize: '11px',
                              fontWeight: 500,
                              fontFamily: 'inter',
                              borderRadius: 0,
                            },
                            inputProps: {
                              maxLength: 10,
                              pattern: '[0-9]*',
                              inputMode: 'numeric',
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    <Box className='flex gap-1 px-2'>
                      <Box className='w-[50%] px-1 py-1 flex flex-col gap-1 my-auto'>
                        <Box className='flex justify-end'>
                          <Button className='bg-[#6a89f8] text-white border border-black flex gap-2 items-center'
                            onClick={openProductPopup}
                          >
                            <ControlPointOutlinedIcon sx={{ color: 'black' }} />
                            <Typography className='text-[12px]'>Add new product</Typography>
                            <Modal open={openProduct} onClose={(e) => closeProductPopup(e)}>
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  width: { xs: '90%', md: '500px' },
                                  bgcolor: 'background.paper',
                                  boxShadow: 24,
                                  p: 4,
                                  borderRadius: 2,
                                }}
                              >
                                <Typography variant="h3" component="h2" gutterBottom>
                                  Add Product
                                </Typography>
                                <IconButton
                                  aria-label="close"
                                  onClick={(e) => closeProductPopup(e)}
                                  sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: 'gray',
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                                <form>
                                  <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Item Name"
                                    name="itemname"
                                    value={productData.itemname}
                                    onChange={handleChangeProductData}
                                  />
                                  <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Description"
                                    name="description"
                                    value={productData.description}
                                    onChange={handleChangeProductData}
                                  />
                                  <TextField
                                    fullWidth
                                    margin="normal"
                                    label="HSN"
                                    name="hsn"
                                    value={productData.hsn}
                                    onChange={handleChangeProductData}
                                  />
                                  <TextField
                                    fullWidth
                                    margin="normal"
                                    label="GST"
                                    name="gst"
                                    type="number"
                                    value={productData.gst}
                                    onChange={handleChangeProductData}
                                  />
                                  <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Code"
                                    name="code"
                                    value={productData.code}
                                    onChange={handleChangeProductData}
                                  />
                                  <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Category"
                                    name="category"
                                    value={productData.category}
                                    onChange={handleChangeProductData}
                                  />
                                  <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Subcategory"
                                    name="subcategory"
                                    value={productData.subcategory}
                                    onChange={handleChangeProductData}
                                  />
                                  <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Actual Price"
                                    name="actualprice"
                                    value={productData.actualprice}
                                    onChange={handleChangeProductData}
                                  />
                                  <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Selling Price"
                                    name="sellingprice"
                                    value={productData.sellingprice}
                                    onChange={handleChangeProductData}
                                  />
                                  <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                                    <Button onClick={(e) => closeProductPopup(e)} variant="contained" className='border border-red-600 text-red-600'>
                                      Close
                                    </Button>
                                    <Button onClick={handleSubmitProductData} variant="contained" className='bg-[#779E40] text-white hover:bg-[#5F7E33]'>
                                      Add
                                    </Button>
                                  </Box>
                                </form>
                              </Box>
                            </Modal>
                          </Button>
                        </Box>
                        <Box>
                          <Select
                            className='w-full h-[35px]'
                            sx={{
                              fontWeight: 500,
                              color: 'rgba(0,0,0,0.5)',
                              fontSize: '12px',
                            }}
                            displayEmpty
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                          >
                            <MenuItem value="" disabled>
                              Select Product
                            </MenuItem>
                            {productsList.map((product) => (
                              <MenuItem key={product.id} value={product.itemname}>
                                {product.itemname}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>

                      </Box>
                      <Box className='flex-1 border border-rgba(0,0,0,0.6) -mt-3 mb-1'>
                        <Typography className='text-white bg-[#5581b4] px-2'
                          sx={{ fontWeight: 'inter', color: 'rgba(0,0,0,0.5)', fontWeight: 500, fontSize: '14px' }}
                        >Amount received in favour of:</Typography>
                        <TextField
                          fullWidth
                          placeholder="Write the internal notes here"
                          multiline
                          value={chequeDetails.amountReceivedInFavourOf || ''}
                          onChange={(e) => setChequeDetails({ ...chequeDetails, amountReceivedInFavourOf: e.target.value })}
                          rows={7}
                          InputProps={{
                            sx: {
                              padding: '0',
                              borderRadius: 0,
                              padding: '4px 6px',
                              fontSize: '12px'
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Stack>
                </Box>
                <Stack className='flex-1' sx={{ border: '1px solid rgba(0,0,0,0.3)' }}>
                  <Box className='flex w-full gap-4'>
                    {/* Account Details Section */}
                    <Box className='w-1/2 relative'>
                      <Typography className='w-3/4 text-white bg-[#5581b4] p-2'>Account Details</Typography>
                      <Box className='mt-4 px-1'>
                        <Grid container alignItems="center">
                          <Grid container>
                            <Grid item xs={6}>
                              <Typography variant="body1" className='h-[30px] flex items-center text-[12px] pl-1'
                                sx={{ fontWeight: 500, fontFamily: 'inter', border: '1px solid rgba(0,0,0,0.35)' }}
                              >
                                Total due amount:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={chequeDetails.totalDueAmount || ''}
                                onChange={(e) => setChequeDetails({ ...chequeDetails, totalDueAmount: e.target.value })}
                                InputProps={{
                                  sx: {
                                    height: '30px',
                                    padding: '0',
                                    borderRadius: 0,
                                    fontWeight: 500,
                                    fontFamily: 'inter',
                                    fontSize: '12px'
                                  },
                                }}
                              />
                            </Grid>
                          </Grid>
                          <Grid container>
                            <Grid item xs={6}>
                              <Typography variant="body1" className='h-[30px] flex items-center text-[12px] pl-1'
                                sx={{ fontWeight: 500, fontFamily: 'inter', border: '1px solid rgba(0,0,0,0.35)' }}
                              >
                                Amount Paid:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                value={chequeDetails.amountPaid || ''}
                                onChange={(e) => setChequeDetails({ ...chequeDetails, amountPaid: e.target.value })}
                                InputProps={{
                                  sx: {
                                    height: '30px',
                                    padding: '0',
                                    borderRadius: 0,
                                    fontWeight: 500,
                                    fontFamily: 'inter',
                                    fontSize: '12px'
                                  },
                                }}
                              />
                            </Grid>
                          </Grid>
                          <Grid container>
                            <Grid item xs={6}>
                              <Typography variant="body1" className='h-[30px] flex items-center text-[12px] pl-1'
                                sx={{ fontWeight: 500, fontFamily: 'inter', border: '1px solid rgba(0,0,0,0.35)' }}
                              >
                                Balance Due
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <TextField

                                fullWidth
                                variant="outlined"
                                value={chequeDetails.balanceDue || ''}
                                onChange={(e) => setChequeDetails({ ...chequeDetails, balanceDue: e.target.value })}
                                InputProps={{
                                  sx: {
                                    height: '30px',
                                    padding: '0',
                                    borderRadius: 0,
                                    fontWeight: 500,
                                    fontFamily: 'inter',
                                    fontSize: '12px'
                                  },
                                }}
                              />
                            </Grid>
                          </Grid>
                          <Grid container>
                            <TextField
                              className="w-full"
                              placeholder="Description"
                              value={chequeDetails.description || ''}
                              onChange={(e) => setChequeDetails({ ...chequeDetails, description: e.target.value })}
                              multiline
                              rows={4}
                              sx={{ color: 'black' }}
                              InputProps={{
                                sx: {
                                  padding: '5px',
                                  borderRadius: 0,
                                  fontSize: '12px',
                                  color: 'black'
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                        <Box className='flex flex-col gap-4 absolute bottom-1'>
                          <Box className='w-[140px]'>
                            <Button

                              fullWidth
                              sx={{
                                height: '35px',
                                padding: '0',
                                color: 'black',
                                border: '1px solid rgba(0,0,0,0.6)',
                                fontSize: '12px',
                                fontWeight: 500,
                                paddingX: '5px'
                              }}
                            >
                              Payment Received By:
                            </Button>
                          </Box>
                          <Box className='flex gap-2'>
                            <Box>
                              <Button
                                className='w-[130px] h-[35px] text-[12px]'
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  fontWeight: 500,
                                  border: '1px solid rgba(0,0,0,0.6)',
                                  color: selectedAgent ? 'black' : 'rgba(0,0,0,0.6)',
                                }}
                                onClick={openMenu}
                              >
                                <Typography className='text-[11px]'>Select Agent</Typography>
                                <ArrowDropDownOutlinedIcon />
                              </Button>
                              <Menu
                                anchorEl={menuAnchor}
                                open={Boolean(menuAnchor)}
                                onClose={closeMenu}
                                PaperProps={{
                                  style: { maxHeight: 180 },
                                }}
                              >
                                <MenuItem disabled>Select Agent</MenuItem>
                                {allExecutives && allExecutives.map((agent, index) => (
                                  <MenuItem key={index} onClick={() => handleAgentSelection(agent)}>
                                    {agent}
                                  </MenuItem>
                                ))}
                              </Menu>
                            </Box>
                            <Box className='w-[140px]'>
                              <TextField
                                fullWidth
                                value={selectedExecutive || ''}

                                variant="outlined"
                                size="small"
                                InputProps={{
                                  sx: {
                                    height: '35px',
                                    paddingX: '5px',
                                  },
                                }}

                              />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Payment Mode Section */}
                    <Box className='w-1/2 pr-1'>
                      <Typography className='w-3/4 text-white bg-[#5581b4] p-2'>Payment Mode</Typography>
                      <Box className='mt-4 flex flex-col gap-4'>
                        <Box>
                          <Box>
                            <FormControl fullWidth ref={selectModeRef}>
                              <Button
                                sx={{
                                  border: '1px solid rgba(0,0,0,0.5)',
                                  fontWeight: 'inter',
                                  color: 'rgba(0,0,0,0.5)',
                                  fontWeight: 500,
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  paddingX: '10px',
                                  height: '35px',
                                }}
                                onClick={handleToggleMode}
                                fullWidth
                              >

                                <Typography className="text-[11px]">
                                  {selectedPaymentMode || 'Select Payment Mode'}
                                </Typography>
                                <ArrowDropDownOutlinedIcon />
                              </Button>

                              {openMode && (
                                <Popper
                                  open={openMode}
                                  anchorEl={selectModeRef.current}
                                  placement="bottom-start"
                                  sx={{ width: formControlWidth }}
                                  disablePortal={false}
                                >
                                  <Paper>
                                    <MenuList sx={{ maxHeight: '200px', overflow: 'auto' }}>
                                      {/* Show paymentModeOptions in the dropdown */}
                                      {paymentModeOptions.length > 0 ? (
                                        paymentModeOptions.map((mode) => (
                                          <MenuItem
                                            key={mode}
                                            value={mode}
                                            onClick={() => handlePaymentModeSelect(mode)}
                                          >
                                            {mode}
                                          </MenuItem>
                                        ))
                                      ) : (
                                        <MenuItem disabled>No payment modes found</MenuItem>
                                      )}
                                    </MenuList>
                                  </Paper>
                                </Popper>
                              )}
                            </FormControl>
                          </Box>

                        </Box>

                        <Box className='flex gap-4'>
                          <Box className='w-[20%]'>
                            <Button
                              variant="outlined"
                              fullWidth
                              sx={{
                                height: '35px',
                                padding: '0',
                                color: 'black',
                                border: '1px solid rgba(0,0,0,0.6)',
                              }}
                            >
                              Cheque
                            </Button>
                          </Box>

                          <Box className='flex-1'>
                            <TextField
                              fullWidth
                              placeholder="cheque number and bank name"
                              value={chequeData}
                              onChange={(e) => setChequeData(e.target.value)}
                              InputProps={{
                                sx: {
                                  height: '35px',
                                  padding: '0',
                                },
                              }}
                              disabled={selectedPaymentMode !== 'CHEQUE'}
                            />
                          </Box>
                        </Box>

                        <Box className='flex gap-4'>
                          <Box className='w-[20%]'>
                            <Button
                              variant="outlined"
                              fullWidth
                              sx={{
                                height: '35px',
                                padding: '0',
                                color: 'black',
                                border: '1px solid rgba(0,0,0,0.6)',
                              }}

                            >
                              Online
                            </Button>
                          </Box>
                          <Box className='w-[80%] flex justify-between gap-4'>
                            <Box className='w-1/2'>
                              <Select
                                className='w-full h-[35px]'
                                displayEmpty
                                value={selectedOnlinePaymentMode}
                                onChange={(e) => setSelectedOnlinePaymentMode(e.target.value)}
                                sx={{ border: '1px solid rgba(0,0,0,0.6)' }}
                                disabled={selectedPaymentMode !== 'ONLINE'}
                              >
                                <MenuItem value="" disabled>
                                  Select Mode
                                </MenuItem>
                                <MenuItem value="Mode 1">Mode 1</MenuItem>
                                <MenuItem value="Mode 2">Mode 2</MenuItem>
                                <MenuItem value="Mode 3">Mode 3</MenuItem>
                              </Select>
                            </Box>

                            <Box className='w-1/2'>
                              <Select
                                className='w-full h-[35px]'
                                displayEmpty
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                                sx={{ border: '1px solid rgba(0,0,0,0.6)' }}
                                disabled={selectedPaymentMode !== 'ONLINE'}
                              >
                                <MenuItem value="" disabled>
                                  Select Bank
                                </MenuItem>
                                <MenuItem value="Bank 1">Bank 1</MenuItem>
                                <MenuItem value="Bank 2">Bank 2</MenuItem>
                                <MenuItem value="Bank 3">Bank 3</MenuItem>
                              </Select>
                            </Box>
                          </Box>
                        </Box>
                        <Box>
                          <Box className='h-[200px] relative' sx={{ border: '1px solid rgba(0,0,0,0.3)' }}>
                            <Box className='h-[75%] flex items-center justify-center' sx={{ borderBottom: '1px solid rgba(0,0,0,0.3)' }}>
                              {(isSignatureLoaded && (signaturePreview || Image)) && (
                                <img
                                  src={signaturePreview || Image} // Generate Object URL from File
                                  alt="Authorized Signatory"
                                  style={{
                                    display: 'block',
                                    margin: 'auto',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                  }}
                                />
                              )}
                            </Box>

                            {isSignatureLoaded && Image ? (
                              // Display existing signature when editing
                              <Box className='absolute bottom-3 pl-2'>
                                {console.log('default signature--->', sign)}

                                <Button onClick={() => setIsSignatureLoaded(false)}>Change Signature</Button>
                              </Box>
                            ) : (
                              // If no existing signature or user wants to change it, show Signature Canvas
                              // <SignatureCanvas onSignatureChange={   onChange={(e) => setImage(e.target.files[0])}} />

                              <input
                                className='absolute bottom-3 pl-2'
                                type="file"
                                name="authorizedSignatory"
                                id="sign"
                                onChange={handleAddSign}
                              />
                            )}
                            <Typography className='text-[12px] absolute bottom-3  right-2 pr-2'>Authorized Signatory</Typography>
                          </Box>

                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </Box>
              <Box className='my-8 flex justify-end gap-4'>
                <Button className='text-white bg-red-600 px-6 rounded-[5px]' onClick={handleReset}>RESET</Button>
                <Button className='text-white bg-green-600 px-6 rounded-[5px]' onClick={handleSubmit}>SAVE</Button>
              </Box>
            </Box>
          </Box>
        </MainCard>
        <Toaster position="top-right" reverseOrder={false} style={{ zIndex: 200000 }} />
      </Box>
    </>
  );
};

export default MoneyReceipt;
