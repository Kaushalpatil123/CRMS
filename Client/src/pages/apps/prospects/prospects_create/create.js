import React, { useState, useRef, useMemo, useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, TextField, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import Container from '@mui/material/Container';

import Chip from '@mui/material/Chip';
import { Stack } from '@mui/system';
// import { useForm } from 'react-hook-form';

import {
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ListItem,
  ListItemAvatar,
  Paper,
  TableContainer
} from '@mui/material';
import { PopupTransition } from '../../../../components/@extended/Transitions';

import SimpleBar from '../../../../components/third-party/SimpleBar';
import MainCard from '../../../../components/MainCard';
import ScrollX from '../../../../components/ScrollX';
import Avatar from '../../../../components/@extended/Avatar';
import { LocationOnSharp } from '@mui/icons-material';

const ProspectsDetails = () => {
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [selectedFile, setSelectedFile] = useState('');

  const [pincode, setpincode] = useState('');
  const [institutionemailId, setinstitutionemailId] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [address1, setaddress1] = useState('');
  const [address2, setaddress2] = useState('');
  const [industry, setIndustry] = useState('');
  const [city, setcity] = useState('');
  const [state, setstate] = useState('');
  const [country, setcountry] = useState('');
  const [contactpersonName, setcontactpersonName] = useState('');
  const [contactpersonphoneNumber, setcontactpersonPhonenumber] = useState('');
  const [contactpersonEmailid, setcontactpersonEmailid] = useState('');
  const [googlemaplink, setgooglemaplink] = useState('');
  const [sportsName, setSportsName] = React.useState([]);
  const [institutionid, setinstitutionId] = useState('');
  const [company, setCompany] = useState('');
  const [password, setpasssword] = React.useState('');
  const [GroundProfile, setGroundProfile] = React.useState('');
  const [Names, setNames] = useState([]);
  const [schoolNames, setschoolNames] = useState([]);
  const [AddRole, setAddRole] = useState('Ground');
  const [schoolGroundName, setschoolGroundName] = useState('');
  const [title, setTitle] = useState('');
  const [price, setprice] = useState('');
  const [rating, setrating] = useState('');

  const [institutionNameError, setInstitutionNameError] = useState(false);
  const [GroundProfileError, setGroundProfileError] = useState(false);
  const [address1Error, setAddress1Error] = useState(false);
  const [industryError, setIndustryError] = useState(false);
  const [address2Error, setAddress2Error] = useState(false);
  const [CityError, setCityError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [mnoError, setMnoError] = useState(false);
  const [StateError, setStateError] = useState(false);
  const [CountryError, setCountryError] = useState(false);
  const [PincodeError, setPincodeError] = useState(false);
  const [institutionemailIdError, setInstitutionEmailIdError] = useState(false);
  const [ContactPersonNameError, setContactPersonNameError] = useState(false);
  const [ContactpersonPhonenumberError, setcontactpersonPhonenumberError] = useState(false);
  const [ContactpersonEmailIdError, setcontactpersonEmailIdError] = useState(false);
  const [googlemaplinkError, setgooglemaplinkError] = useState(false);
  const [SportsNameError, setSportsNameError] = useState(false);
  const [institutionIdError, setinstitutionIdError] = useState(false);
  const [companyError, setCompanyError] = useState(false);
  const [passwordError, setpassswordError] = useState(false);
  const [schoolGroundNameError, setschoolGroundNameError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [priceError, setpriceError] = useState(false);
  const [ratingError, setratingError] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState('');
  const [images, setImages] = useState([]);

  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setlocation] = useState('');
  const [mno, setMno] = useState('');
  const [website, setWebsite] = useState('');
  const [locationError, setlocationError] = useState(false);
  const [websiteError, setWebsiteError] = useState(false);
  const [showProspect, setShowProspect] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);

  // Handler functions
  const [showProspects, setShowProspects] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);
  const [product, setProduct] = useState('');
  const [productError, setProductError] = useState(false);
  const [executive, setExecutive] = useState('');
  const [executiveError, setExecutiveError] = useState(false);
  const [bp, setBp] = useState('');
  const [bpError, setBpError] = useState(false);
  const [ot, setOt] = useState('');
  const [otError, setOtError] = useState(false);
  const [productStage, setProductStage] = useState('');
  const [productStageError, setProductStageError] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [CustomerNameError, setCustomerNameError] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [BusinessNameError, setBusinessNameError] = useState(false);
  const [customerID, setCustomerId] = useState('');
  const [CustomerIdError, setCustomerIdError] = useState(false);
  const [productExecutiveName, setProductExecutiveName] = useState('');
  const [ProductExecutiveNameError, setProductExecutiveNameError] = useState(false);
  // customer section
  const [receivable, setReceivable] = useState('');
  const [receivableError, setReceivableError] = useState(false);

  const [receivableNote, setReceivableNote] = useState('');
  const [receivableNoteError, setReceivableNoteError] = useState(false);

  const [businessProspect, setBusinessProspect] = useState('');
  const [businessProspectError, setBusinessProspectError] = useState(false);

  const [orderTarget, setOrderTarget] = useState('');
  const [orderTargetError, setOrderTargetError] = useState(false);

  const [msmeNo, setMsmeNo] = useState('');
  const [msmeNoError, setMsmeNoError] = useState(false);

  const [panNo, setPanNo] = useState('');
  const [panNoError, setPanNoError] = useState(false);

  const handleProspectsChange = (event) => {
    setShowProspects(event.target.checked);
  };

  const handleCustomersChange = (event) => {
    setShowCustomers(event.target.checked);
  };

  const [AmenitiesError, setAmenitiesError] = useState(false);

  const handleClose = () => setOpen(false);

  const Weekdays = [
    { id: 1, Day: 'Monday' },
    { id: 2, Day: 'Tuesday' },
    { id: 3, Day: 'Wednesday' },
    { id: 4, Day: 'Thursday' },
    { id: 5, Day: 'Friday' },
    { id: 6, Day: 'Saturday' },
    { id: 7, Day: 'Sunday' }
  ];

  const Time = [
    { id: 1, startTime: '10:00AM', endTime: '11:00AM' },
    { id: 2, startTime: '11:00AM', endTime: '12:00PM' },
    { id: 3, startTime: '12:00PM', endTime: '01:00PM' },
    { id: 4, startTime: '01:00PM', endTime: '02:00PM' },
    { id: 5, startTime: '02:00PM', endTime: '03:00PM' },
    { id: 6, startTime: '03:00PM', endTime: '04:00PM' },
    { id: 7, startTime: '04:00PM', endTime: '05:00PM' },
    { id: 8, startTime: '05:00PM', endTime: '06:00PM' },
    { id: 9, startTime: '06:00PM', endTime: '07:00PM' },
    { id: 10, startTime: '07:00PM', endTime: '08:00PM' },
    { id: 11, startTime: '08:00PM', endTime: '09:00PM' },
    { id: 12, startTime: '09:00PM', endTime: '10:00PM' }
  ];

  const timetable = [];
  Weekdays.forEach((day) => {
    for (let i = 0; i < Time.length; i++) {
      timetable.push({
        dayOfWeek: day.Day,
        startTime: Time[i].startTime,
        endTime: Time[i].endTime,
        totalSlots: 0
      });
    }
  });
  console.log('empty timetable fields--->', timetable);
  const [timetableData, setTimetableData] = useState(timetable);

  const AddSlot = (dayOfWeek, startTime, endTime, totalSlots) => {
    console.log('startedn-------->', startTime, endTime, dayOfWeek, totalSlots);

    const existingIndex = timetableData.findIndex(
      (item) => item.dayOfWeek === dayOfWeek && item.startTime === startTime && item.endTime === endTime
    );
    if (existingIndex !== -1) {
      // If an entry for this day and time already exists, update its value
      const newTimetableData = [...timetableData];
      console.log('newtimetabledata---->', newTimetableData);
      newTimetableData[existingIndex].totalSlots = totalSlots;
      setTimetableData(newTimetableData);
    } else {
      // If an entry for this day and time doesn't exist, create a new one
      setTimetableData((prevData) => [...prevData, { dayOfWeek, startTime, endTime, totalSlots }]);
    }

    console.log('Timetable data--->', timetableData);
  };

  const handleaddgroundImage = (e) => {
    const fileDataarray = [...images]; // Copy the existing images array
    const file = e.target.files[0];

    if (file) {
      // Check if the file format is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload only image files.');
        return;
      }

      // Check if the number of images is less than four
      if (fileDataarray.length < 4) {
        setImages([...images, file]);
      } else {
        alert('You can upload up to four images only.');
      }
    }
  };

  const server = process.env.REACT_APP_API_URL;

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  const [viewModal, setViewModal] = useState({
    open: false,
    details: null,
    completeDetails: null
  });

  // -----------View Modal------------

  const handleOpenViewModal = async (id) => {
    try {
      setOpen(true);
      setViewModal(true);
    } catch (error) {
      console.error('Error fetching User details:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate("/");
      } else {
        try {
          const response = await axios.get(`${server}/api/admin/schools`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            setschoolNames(response.data.data);
            console.log('api school  names---', response.data.data);
          } else {
            console.error('Empty response data or unexpected format');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchSports = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate("/");
      } else {
        try {
          const response = await axios.get(`${server}/api/sport/getlladmin`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          console.log('api users----------->', response.data);

          if (response.data) {
            // setNames(response.data);
            console.log('api dataamsdnasndam---', response.data);
          } else {
            console.error('Empty response data or unexpected format');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };
    fetchSports();
  }, []);

  // School Ground Name

  // useEffect(() => {
  const fetchDetails = async (schoolGroundId) => {
    console.log('fetchdetails m schoolid-->', schoolGroundId);
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`${server}/api/admin/user/${schoolGroundId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('after school api call-->');
      // Assuming your raw body response is plain text
      const responseDat = response?.data?.data;
      console.log('school data', responseDat);
      //  setEditschoolgroundName(responseDat?.institutionName);
      setinstitutionId(responseDat?.institutionId);
      console.log('responsedata institution id---->', responseDat?.institutionId);
      setaddress1(responseDat?.address1);
      setaddress2(responseDat?.address2);
      setcity(responseDat?.city);
      setstate(responseDat?.state);
      setcountry(responseDat?.country);
      setpincode(responseDat?.pincode);
      setNames(responseDat?.sportsgrounds);
      setgooglemaplink(responseDat?.googlemaplink);
    } catch (error) {
      console.error('Error fetching User details:', error);
    }
  };
  // fetchDetails();
  // }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setGroundProfile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result);
      };
      // setGroundProfile(file)

      reader.readAsDataURL(file);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if required fields are filled
    if (
      !company.trim() ||
      !title.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !mno.trim() ||
      !website.trim() ||
      !industry.trim() ||
      !city.trim() ||
      !state.trim() ||
      !country.trim()
    ) {
      // Set error states for the empty fields
      setCompanyError(!company.trim());
      setTitleError(!title.trim());
      setFirstNameError(!firstName.trim());
      setLastNameError(!lastName.trim());
      setEmailError(!email.trim());
      setMnoError(!mno.trim());
      setWebsiteError(!website.trim());
      setIndustryError(!industry.trim());
      setCityError(!city.trim());
      setStateError(!state.trim());
      setCountryError(!country.trim());

      toast.error('Please fill in all the required fields');
      return;
    }
    if (!['Mr.', 'Mrs.', 'Ms.'].includes(title)) {
      setTitleError(true);
      toast.error('Invalid title');
      return;
    }

    // Create the prospect data object
    const prospectData = {
      company,
      title,
      firstName,
      lastName,
      mobile: mno,
      email,
      website,
      industrySegment: industry,
      country,
      state,
      city,
      product: product,
      executive: executive,
      businessProspectAnnual:Number(bp),
      orderTarget:Number(ot),
      // receivables: Number(receivable) || 0, // Map to receivables
      // receivablesnotes: receivableNote || '', // Map to receivablesnotes
      // msmenumber: msmeNo || '', // Map to msmenumber
      // pannumber: panNo || '', // Map to pannumber
      prospectStage: productStage
    };

    console.log('Prospect Data:', prospectData); // Debugging line

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token is found, redirect to the login page
        navigate('/');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/prospect/create-prospect`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(prospectData)
      });

      const responseData = await response.json(); // Parse response body
      console.log('Response Data:', responseData); // Debugging line

      if (response.ok) {
        console.log('Prospect created successfully!');
        toast.success('Prospect created successfully!');
        // Reset the form fields
        setCompany('');
        setTitle('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setMno('');
        setWebsite('');
        setIndustry('');
        setcity('');
        setstate('');
        setcountry('');
        setaddress1('');
        setaddress2('');
        setpincode('');
        setProduct('');
        setOrderTarget('');
        setExecutive('');
        setBp('');
        setOt('');
        setProductStage('');
      } else {
        console.error('Error creating prospect:', response.status, responseData);
        toast.error('Error creating prospect. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    // <Container maxWidth="420px">
    <div className="container mx-auto">
      <form id="prospectForm" className="space-y-4" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

          {/* Prospects Details */}
          <Grid item xs={12} md={12}>
            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Add Prospects</h3>
              </Grid>
            </Stack>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent>
                <Grid item xs={6}>
                  <InputLabel className="mb-2">Company</InputLabel>
                  <TextField
                    autocomplete="off"
                    className="textfields"
                    fullWidth
                    name="company"
                    onChange={(e) => {
                      setCompany(e.target.value);
                      setCompanyError(false); // Reset error when user types
                    }}
                    value={company}
                    required
                    error={companyError}
                    helperText={companyError && 'Company is required'}
                    variant="outlined"
                    size="small"
                    sx={{ width: '100%' }}
                  />
                </Grid>

                <Grid container spacing={3} className="mt-5">
                  <Grid container spacing={3} marginLeft={0.3}>
                    <Grid item xs={4}>
                      <InputLabel className="mb-2">Title</InputLabel>
                      <Select
                        autocomplete="off"
                        labelId="title-label"
                        id="title-select"
                        name="title"
                        value={title}
                        fullWidth
                        onChange={(e) => {
                          const selectedTitle = e.target.value;
                          setTitle(selectedTitle);
                          setTitleError(false); // Reset error when user types
                        }}
                        required
                        error={titleError}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      >
                        <MenuItem value="Mr.">Mr.</MenuItem>
                        <MenuItem value="Mrs.">Mrs.</MenuItem>
                        <MenuItem value="Ms.">Ms.</MenuItem>
                      </Select>
                    </Grid>

                    <Grid item xs={4}>
                      <InputLabel className="mb-2">First Name</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        name="first-name"
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          setFirstNameError(false); // Reset error when user types
                        }}
                        value={firstName}
                        required
                        error={firstNameError}
                        helperText={firstNameError && 'First Name is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <InputLabel className="mb-2">Last Name</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        name="last-name"
                        onChange={(e) => {
                          setLastName(e.target.value);
                          setLastNameError(false); // Reset error when user types
                        }}
                        value={lastName}
                        required
                        error={lastNameError}
                        helperText={lastNameError && 'Last Name is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Email</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      name="email"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(false); // Reset error when user types
                      }}
                      value={email}
                      required
                      error={emailError}
                      helperText={emailError && 'Email is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>

                  {/* location */}

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Mobile No.</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      name="mobile-No"
                      onChange={(e) => {
                        setMno(e.target.value);
                        setMnoError(false); // Reset error when user types
                      }}
                      value={mno}
                      required
                      error={mnoError}
                      helperText={mnoError && 'Mobile Number is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Website</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      name="website"
                      onChange={(e) => {
                        setWebsite(e.target.value);
                        setWebsiteError(false); // Reset error when user types
                      }}
                      value={website}
                      required
                      error={websiteError}
                      helperText={websiteError && 'Website is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Industry and Segment</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      name="industry"
                      onChange={(e) => {
                        setIndustry(e.target.value);
                        setIndustryError(false); // Reset error when user types
                      }}
                      value={industry}
                      required
                      error={industryError}
                      helperText={industryError && 'Industry is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel className="mb-2">City</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      name="city"
                      onChange={(e) => {
                        setcity(e.target.value);
                        setCityError(false); // Reset error when user types
                      }}
                      value={city}
                      required
                      error={CityError}
                      helperText={CityError && 'City is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">State</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      name="state"
                      onChange={(e) => {
                        setstate(e.target.value);
                        setStateError(false); // Reset error when user types
                      }}
                      value={state}
                      required
                      error={StateError}
                      helperText={StateError && 'State is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>

                  {/* pincode */}

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Pincode</InputLabel>
                    <TextField
                      autocomplete="off"
                      type="number"
                      fullWidth
                      name="pincode"
                      onChange={(e) => {
                        setpincode(e.target.value);
                        setPincodeError(false); // Reset error when user types
                      }}
                      value={pincode}
                      required
                      error={PincodeError}
                      helperText={PincodeError && 'Pincode is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Country</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      name="country"
                      onChange={(e) => {
                        setcountry(e.target.value);
                        setCountryError(false); // Reset error when user types
                      }}
                      required
                      value={country}
                      error={CountryError}
                      helperText={CountryError && 'Country is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Prospects and Customers Section */}
          <Grid item xs={12} md={12}>
            <Card
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                marginTop: '40px'
              }}
            >
              <CardContent>
                <Typography variant="h4">Prospect Details</Typography>

                <Grid container spacing={3} className="mt-1">
                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Product</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      name="product"
                      onChange={(e) => {
                        setProduct(e.target.value);
                        setProductError(false);
                      }}
                      value={product}
                      error={productError}
                      helperText={productError && 'Product Link is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Executive</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      name="executive"
                      onChange={(e) => {
                        setExecutive(e.target.value);
                        setExecutiveError(false);
                      }}
                      required
                      error={executiveError}
                      helperText={executiveError && 'Executive is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      type="number"
                      fullWidth
                      label="Business Prospect (Annual)"
                      name="business-prospect"
                      onChange={(e) => {
                        setBp(e.target.value);
                        setBpError(false);
                      }}
                      required
                      error={bpError}
                      helperText={bpError && 'This is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                      inputProps={{ min: 0, max: 5 }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      type="number"
                      fullWidth
                      label="Order Target"
                      name="order-target"
                      onChange={(e) => {
                        setOt(e.target.value);
                        setOtError(false);
                      }}
                      required
                      error={otError}
                      helperText={otError && 'This is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                      inputProps={{ min: 0, max: 5 }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Product Stage</InputLabel>
                    <Select
                      autocomplete="off"
                      labelId="product-label"
                      id="product-select"
                      name="product-stage"
                      value={productStage}
                      fullWidth
                      onChange={(e) => {
                        const selectedProductStage = e.target.value;
                        setProductStage(selectedProductStage);
                        setProductStageError(false);
                      }}
                      required
                      error={productStageError}
                      helperText={productStageError && 'Product Stage is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="Discussion">Discussion</MenuItem>
                      <MenuItem value="Sample Given">Sample Given</MenuItem>
                      <MenuItem value="Estimate Share">Estimate Share</MenuItem>
                      <MenuItem value="Done">Done</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: 'orange',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'darkorange'
                }
              }}
              fullWidth
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
    // </Container>
  );
};
export default ProspectsDetails;
