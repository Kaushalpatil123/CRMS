import React, { useState, useRef, useMemo, useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Typography,
  CardMedia,
  CardActions,
  TextField,
  Grid,
  Container,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';

import Chip from '@mui/material/Chip';
import { Stack } from '@mui/system';

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

const GroundDetails = () => {
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [selectedFile, setSelectedFile] = useState('');

  const [pincode, setpincode] = useState('');
  const [institutionemailId, setinstitutionemailId] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [address1, setaddress1] = useState('');
  const [address2, setaddress2] = useState('');
  const [city, setcity] = useState('');
  const [state, setstate] = useState('');
  const [country, setcountry] = useState('');
  const [contactpersonName, setcontactpersonName] = useState('');
  const [contactpersonphoneNumber, setcontactpersonPhonenumber] = useState('');
  const [contactpersonEmailid, setcontactpersonEmailid] = useState('');
  const [googlemaplink, setgooglemaplink] = useState('');
  const [sportsName, setSportsName] = React.useState([]);
  const [institutionid, setinstitutionId] = useState('');
  const [password, setpasssword] = React.useState('');
  const [GroundProfile, setGroundProfile] = React.useState('');
  const [Names, setNames] = useState([]);
  const [schoolNames, setschoolNames] = useState([]);
  const [AddRole, setAddRole] = useState('Ground');
  const [schoolGroundName, setschoolGroundName] = useState('');
  const [price, setprice] = useState('');
  const [rating, setrating] = useState('');

  const [institutionNameError, setInstitutionNameError] = useState(false);
  const [GroundProfileError, setGroundProfileError] = useState(false);
  const [address1Error, setAddress1Error] = useState(false);
  const [address2Error, setAddress2Error] = useState(false);
  const [CityError, setCityError] = useState(false);
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
  const [passwordError, setpassswordError] = useState(false);
  const [schoolGroundNameError, setschoolGroundNameError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [priceError, setpriceError] = useState(false);
  const [ratingError, setratingError] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState('');
  const [images, setImages] = useState([]);

  const [open, setOpen] = useState(false);
  const [schoolgroundId, setschoolGroundId] = useState('');
  const [location, setlocation] = useState('');
  const [locationError, setlocationError] = useState(false);

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

  useEffect(() => {
    if (schoolgroundId) {
      console.log('schoolground id hai isme toh fetchdetails call ho-->', schoolgroundId);
      fetchDetails(schoolgroundId);
    }
  }, [schoolgroundId]);

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
    const ratingStr = rating.toString();
    if (rating > 5 || rating < 0 || (ratingStr.length > 1 && ratingStr.startsWith('0'))) {
      setratingError(true);
      toast.error('Rating must be 0 - 5');
      return;
    }

    // Check if required fields are empty
    if (
      // !password.trim() ||
      !price.trim() ||
      !location.trim() ||
      !rating.trim() ||
      sportsName.length === 0 ||
      selectedAmenities.length === 0
    ) {
      // setpassswordError(!password.trim());
      setlocationError(!location.trim());
      setpriceError(!price.trim());
      setratingError(!rating.trim());
      setSportsNameError(sportsName.length === 0);
      if (selectedAmenities.length === 0) {
        // Check if no amenities are selected
        setAmenitiesError(true);
        // hasErrors = true;
      }

      toast.error('All Fields are required');
      return;
    }

    const token = localStorage.getItem('token');
    console.log('images aare h--->', images);

    if (!token) {
      // If no token is found, redirect to the login page
      navigate('/');
    } else {
      const formData = new FormData();
      console.log('images---->', images);
      if (images.length === 0) {
        toast.error('Add at least 1 Image');
        return;
      }

      console.log('timetabledata------>', timetableData);
      formData.append('name', schoolGroundName);
      formData.append('InstitutionId', institutionid);
      // formData.append('sport_name', sportsName);
      // sportsName.forEach((sports) => {
        formData.append(`sport_name`, sportsName);
      // });
      formData.append('address1', address1);
      formData.append('address2', address2);
      formData.append('city', city);
      formData.append('state', state);
      formData.append('country', country);
      formData.append('pincode', pincode);
      formData.append('googlemaplink', googlemaplink);
      formData.append('price', price);
      formData.append('rating', rating);
      formData.append('schoolId', schoolgroundId);
      formData.append('location', location);

      images.forEach((image) => {
        formData.append('images', image);
      });

      formData.append('amenities', selectedAmenities);

      formData.append('slots', JSON.stringify(timetableData));

      try {
        const response = await axios.post(`${server}/api/ground/create`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            password: password
          }
        });
        if (response.data) {
          console.log('this is formdata---->', formData);

          console.log('Ground added:', response.data);
          toast('Ground added Successfully');
          setschoolGroundName('');
          setlocation('');
          AddSlot('');
          setpasssword('');
          setGroundProfile('');
          setSelectedFile('');
          setInstitutionName('');
          setaddress1('');
          setaddress2('');
          setcity('');
          setstate('');
          setcountry('');
          setpincode('');
          setinstitutionemailId('');
          setcontactpersonName('');
          setcontactpersonPhonenumber('');
          setcontactpersonEmailid('');
          setgooglemaplink('');
          setSportsName([]);
          setinstitutionId('');
          setImages([]);
          setTimetableData([]);
          // setpasssword('');
          // window.location.reload();
        }
      } catch (error) {
        console.error('Error uploading file:', error.response.data);

        if (error.response.data.message.includes('File size too large')) {
          toast.error('File size too large , Upload another File');
          setImages([]);
        } else {
          if (error?.response?.data?.message == 'A ground for sport Cricket,Swimming,Badminton already exists for the school') {
            toast.error('Sports already exists for the School');
          } else if (selectedAmenities.length === 0) {
            // Check if no amenities are selected
            setAmenitiesError(true);
          } else {
            // toast.error('Error Submitting Form');
            toast.error(error.response.data.message);
          }
        }
      } finally {
        console.log('Clearing the data...');
        document.getElementById('GroundForm').reset();
      }
    }
  };

  const handleCheckboxChange = (value, isChecked) => {
    console.log('value , is checked--->', value, isChecked);
    if (isChecked) {
      setSelectedAmenities((prevValues) => (prevValues ? prevValues + ',' + value : value));
    } else {
      setSelectedAmenities((prevValues) =>
        prevValues
          .split(',')
          .filter((item) => item !== value)
          .join(',')
      );
    }
  };

  return (
    <Container maxWidth="420px">
      {/* <form className="space-y-4" onSubmit={handleSubmit}> */}
      <div>
        <form id="GroundForm" className="space-y-4" onSubmit={(handleSubmit) => handleSubmit.target.reset()}>
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

            {/* Ground Details */}

            <Grid item xs={12} md={12}>
              <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardContent>
                  <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mb: 2, mt: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="h4">Add Playground</Typography>
                    </Grid>
                  </Stack>

                  <Grid container spacing={3} className="mt-5">
                    <Grid container spacing={3} marginLeft={0.3}>
                      <Grid item xs={6}>
                        <InputLabel className="mb-2">Select Ground(Schools Name)</InputLabel>
                        <Select
                          autocomplete="off"
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          name="sportsgrounds"
                          value={schoolGroundName}
                          fullWidth
                          // onChange={(e) => {
                          //   setschoolGroundName(e.target.value);
                          //   setschoolGroundNameError(false); // Reset error when user types
                          // }}

                          onChange={(e) => {
                            const selectedName = e.target.value; // Get the selected name
                            const selectedId = schoolNames.find((name) => name.institutionName === selectedName)?._id; // Find the corresponding ID
                            console.log('selectediddd------->', selectedId);
                            setschoolGroundName(selectedName);
                            setschoolGroundId(selectedId); // Set the ID in the state
                            setschoolGroundNameError(false); // Reset error when user types
                          }}
                          required
                          error={schoolGroundNameError}
                          helperText={schoolGroundNameError && 'Weekday is required'}
                          variant="outlined"
                          size="small"
                          sx={{ width: '100%' }}
                          MenuProps={MenuProps}
                        >
                          {schoolNames
                            ?.filter((row) => row.isDeleted === false)
                            .map((name) => (
                              <MenuItem value={name.institutionName}>{name.institutionName}</MenuItem>
                            ))}
                        </Select>
                      </Grid>

                      <Grid item xs={6}>
                        <InputLabel className="mb-2">Institution Id</InputLabel>
                        <TextField
                          autocomplete="off"
                          className="textfields"
                          // type="number"
                          fullWidth
                          // label="Instituion Id"
                          name="institutionId"
                          onChange={(e) => {
                            setinstitutionId(e.target.value);
                            setinstitutionIdError(false); // Reset error when user types
                          }}
                          value={institutionid}
                          required
                          error={institutionIdError}
                          helperText={institutionIdError && 'Institution Id is required'}
                          variant="outlined"
                          size="small"
                          sx={{ width: '100%' }}
                          disabled
                        />
                      </Grid>
                    </Grid>
                    {/* <Grid item xs={6}>
                      <InputLabel className="mb-2">Select Sport</InputLabel>

                      <Select
                        autocomplete="off"
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        name="sportsgrounds"
                        fullWidth
                        multiple
                        value={sportsName}
                        onChange={(e) => {
                          setSportsName(e.target.value);
                          setSportsNameError(false); // Reset error when user types
                        }}
                        required
                        error={SportsNameError}
                        helperText={SportsNameError && 'Sports Name is required'}
                        variant="outlined"
                        size="small"
                        // sx={{ width: '100%', height: '38px' }}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {console.log('sportsname aara h isse-->', sportsName)}
                        {Names.map((name) => (
                          <MenuItem value={name}>{name}</MenuItem>
                        ))}
                      </Select>
                    </Grid> */}

                    <Grid item xs={6}>
                      <InputLabel className="mb-2">Select Sport</InputLabel>

                      <Select
                        autocomplete="off"
                        labelId="demo-single-chip-label"
                        id="demo-single-chip"
                        name="sportsgrounds"
                        fullWidth
                        value={sportsName}
                        onChange={(e) => {
                          setSportsName(e.target.value);
                          setSportsNameError(false); // Reset error when user types
                        }}
                        required
                        error={SportsNameError}
                        helperText={SportsNameError && 'Sports Name is required'}
                        variant="outlined"
                        size="small"
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            <Chip label={selected} />
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {Names.map((name) => (
                          <MenuItem key={name} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    {/* location */}

                    <Grid item xs={6}>
                      <InputLabel className="mb-2">location</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        // label="Address line 1"
                        name="location"
                        onChange={(e) => {
                          setlocation(e.target.value);
                          setlocationError(false); // Reset error when user types
                        }}
                        value={location}
                        required
                        error={locationError}
                        helperText={locationError && 'Location is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <InputLabel className="mb-2">Address line 1</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        // label="Address line 1"
                        name="address1"
                        onChange={(e) => {
                          setaddress1(e.target.value);
                          setAddress1Error(false); // Reset error when user types
                        }}
                        value={address1}
                        required
                        error={address1Error}
                        helperText={address1Error && 'Address is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel className="mb-2">Address line 2</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        // label="Address line 2"
                        name="address2"
                        onChange={(e) => {
                          setaddress2(e.target.value);
                          setAddress2Error(false); // Reset error when user types
                        }}
                        value={address2}
                        required
                        error={address2Error}
                        helperText={address2Error && 'Address is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel className="mb-2">City</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        // label="City"
                        name="city"
                        // onChange={(e) => setcity(e.target.value)}
                        onChange={(e) => {
                          setcity(e.target.value);
                          setCityError(false); // Reset error when user types
                        }}
                        value={city}
                        error={CityError}
                        helperText={CityError && 'City is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <InputLabel className="mb-2">State</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        // label="State"
                        name="state"
                        onChange={(e) => {
                          setstate(e.target.value);
                          setStateError(false); // Reset error when user types
                        }}
                        value={state}
                        required
                        error={StateError}
                        helperText={StateError && 'Address is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>

                    {/* pincode */}

                    <Grid item xs={6}>
                      <InputLabel className="mb-2">Pincode</InputLabel>
                      <TextField
                        autocomplete="off"
                        type="number"
                        fullWidth
                        // label="Pincode"
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
                        disabled
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <InputLabel className="mb-2">Country</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        // label="Country"
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
                        disabled
                      />
                    </Grid>
                    {localStorage.getItem('role') === 'admin' && (
                      <Grid item xs={6}>
                        <InputLabel className="mb-2">Access Password</InputLabel>
                        <TextField
                          autocomplete="off"
                          className="textfields"
                          fullWidth
                          name="password"
                          onChange={(e) => {
                            setpasssword(e.target.value);
                            setpassswordError(false); // Reset error when user types
                          }}
                          required
                          value={password}
                          error={passwordError}
                          helperText={passwordError && 'Password is required'}
                          variant="outlined"
                          size="small"
                          sx={{ width: '100%' }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* <br /> */}

          <Grid item xs={12} md={12}>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Geolocation Details</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Share Google Map Link Here</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      name="googlemaplink"
                      onChange={(e) => {
                        setgooglemaplink(e.target.value);
                        setgooglemaplinkError(false); // Reset error when user types
                      }}
                      value={googlemaplink}
                      error={googlemaplinkError}
                      helperText={googlemaplinkError && 'Google Map Link is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                      disabled
                    />
                  </Grid>

                  {/* Pricing */}

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Enter Price</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      type="number"
                      fullWidth
                      // label="Enter Price"
                      name="price"
                      onChange={(e) => {
                        setprice(e.target.value);
                        setpriceError(false); // Reset error when user types
                      }}
                      required
                      error={priceError}
                      helperText={priceError && 'Price is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>

                  {/* Rating */}

                  <Grid item xs={6}>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      type="number"
                      fullWidth
                      label="Enter Rating"
                      name="rating"
                      onChange={(e) => {
                        setrating(e.target.value);
                        setratingError(false); // Reset error when user types
                      }}
                      required
                      error={ratingError}
                      helperText={ratingError && 'Rating is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                      inputProps={{ min: 0, max: 5 }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    {/* <Link to="/apps/slots"> */}
                    <Button onClick={(e) => handleOpenViewModal()} className="bg-yellow-500 text-white">
                      Slot Management
                    </Button>
                    {/* </Link> */}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Amenities */}

          <Grid item xs={12} md={12}>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Ammenities*</Typography>
                  </Grid>

                  <Grid item xs={3}>
                    <div className="flex items-center ps-4 border border-gray-200 rounded ">
                      <input
                        id="bordered-checkbox-1"
                        type="checkbox"
                        value="Shower"
                        name="bordered-checkbox"
                        className="w-4 h-4 text-blue-60"
                        onChange={(e) => {
                          handleCheckboxChange(e.target.value, e.target.checked);

                          setAmenitiesError(false);
                        }}
                        error={AmenitiesError}
                        helperText={AmenitiesError && 'Amenities is required'}
                      />
                      <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                        Shower
                      </label>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className="flex items-center ps-4 border border-gray-200 rounded ">
                      <input
                        id="bordered-checkbox-1"
                        type="checkbox"
                        value="Parking"
                        name="bordered-checkbox"
                        className="w-4 h-4 text-blue-60"
                        onChange={(e) => {
                          handleCheckboxChange(e.target.value, e.target.checked);
                          setAmenitiesError(false);
                        }}
                        error={AmenitiesError}
                        helperText={AmenitiesError && 'Amenities is required'}
                      />
                      <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                        Parking
                      </label>
                    </div>
                  </Grid>

                  <Grid item xs={3}>
                    <div className="flex items-center ps-4 border border-gray-200 rounded ">
                      <input
                        id="bordered-checkbox-1"
                        type="checkbox"
                        value="Drinking Water"
                        name="bordered-checkbox"
                        className="w-4 h-4 text-blue-60"
                        onChange={(e) => {
                          handleCheckboxChange(e.target.value, e.target.checked);
                          setAmenitiesError(false);
                        }}
                        error={AmenitiesError}
                        helperText={AmenitiesError && 'Amenities is required'}
                      />
                      <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                        Drinking Water
                      </label>
                    </div>
                  </Grid>

                  <Grid item xs={3}>
                    <div className="flex items-center ps-4 border border-gray-200 rounded ">
                      <input
                        id="bordered-checkbox-1"
                        type="checkbox"
                        value="Change Room"
                        name="bordered-checkbox"
                        className="w-4 h-4 text-blue-60"
                        onChange={(e) => {
                          handleCheckboxChange(e.target.value, e.target.checked);
                          setAmenitiesError(false);
                        }}
                        error={AmenitiesError}
                        helperText={AmenitiesError && 'Amenities is required'}
                      />
                      <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                        Change Room
                      </label>
                    </div>
                  </Grid>

                  <Grid item xs={3}>
                    <div className="flex items-center ps-4 border border-gray-200 rounded ">
                      <input
                        id="bordered-checkbox-1"
                        type="checkbox"
                        value="CC TV's"
                        name="bordered-checkbox"
                        className="w-4 h-4 text-blue-60"
                        onChange={(e) => {
                          handleCheckboxChange(e.target.value, e.target.checked);

                          setAmenitiesError(false);
                        }}
                        error={AmenitiesError}
                        helperText={AmenitiesError && 'Amenities is required'}
                      />
                      <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                        CC TV's
                      </label>
                    </div>
                  </Grid>

                  <Grid item xs={3}>
                    <div className="flex items-center ps-4 border border-gray-200 rounded ">
                      <input
                        id="bordered-checkbox-1"
                        type="checkbox"
                        value="Toilet"
                        name="bordered-checkbox"
                        className="w-4 h-4 text-blue-60"
                        onChange={(e) => {
                          handleCheckboxChange(e.target.value, e.target.checked);

                          setAmenitiesError(false);
                        }}
                        error={AmenitiesError}
                        helperText={AmenitiesError && 'Amenities is required'}
                      />
                      <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                        Toilet
                      </label>
                    </div>
                  </Grid>

                  <Grid item xs={3}>
                    <div className="flex items-center ps-4 border border-gray-200 rounded ">
                      <input
                        id="bordered-checkbox-1"
                        type="checkbox"
                        value="Night Lights"
                        name="bordered-checkbox"
                        className="w-4 h-4 text-blue-60"
                        onChange={(e) => {
                          handleCheckboxChange(e.target.value, e.target.checked);
                          setAmenitiesError(false);
                        }}
                        error={AmenitiesError}
                        helperText={AmenitiesError && 'Amenities is required'}
                      />
                      <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                        Night Lights
                      </label>
                    </div>
                  </Grid>

                  <Grid item xs={3}>
                    <div className="flex items-center ps-4 border border-gray-200 rounded ">
                      <input
                        id="bordered-checkbox-1"
                        type="checkbox"
                        value="Lockers"
                        name="bordered-checkbox"
                        className="w-4 h-4 text-blue-60"
                        onChange={(e) => {
                          handleCheckboxChange(e.target.value, e.target.checked);

                          setAmenitiesError(false);
                        }}
                        error={AmenitiesError}
                        helperText={AmenitiesError && 'Amenities is required'}
                      />
                      <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                        Lockers
                      </label>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Images section */}
          <Grid item xs={12} md={12}>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 3 }}>
              <CardContent>
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Images</Typography>
                  </Grid>{' '}
                  {images.map((image, index) => (
                    <Grid key={index} item xs={3}>
                      {image && (
                        <img
                          alt="Uploaded Image"
                          className="aspect-[4/3] w-full rounded-lg object-cover"
                          height={200}
                          // src={image}
                          src={URL.createObjectURL(image)}
                          width={300}
                        />
                      )}
                    </Grid>
                  ))}
                  <Grid item xs={3}>
                    <div className="flex justify-center items-center h-full border-dashed border-2 border-gray-300 rounded-lg">
                      <label className="cursor-pointer" htmlFor="file-upload">
                        <span>Upload a file</span>
                        <input className="sr-only" id="file-upload" onChange={handleaddgroundImage} type="file" />
                      </label>
                    </div>
                  </Grid>
                </Grid>
                <div className="mt-6 flex justify-center">
                  <label
                    className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary-600"
                    htmlFor="file-upload"
                  >
                    <span>Upload a file</span>
                    <input className="sr-only" id="file-upload" multiple name="file-upload" type="file" />
                  </label>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* --------------- */}

          <Grid container spacing={2} className="mt-2 mb-2">
            <Grid item>
              <Button className="w-24 h-10 rounded bg-blue-500 text-white hover:bg-blue-700 hover:text-white">Cancel</Button>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                className="w-24 h-10 rounded bg-blue-500 text-white hover:bg-blue-700 hover:text-white"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Grid>
          </Grid>

          <Dialog
            open={open}
            TransitionComponent={PopupTransition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{
              '& .MuiDialog-paper': { width: 1560, maxWidth: 1, m: { xs: 1.75, sm: 2.5, md: 4 } },
              backgroundColor: '#ffffff'
              // height: '0vh'
            }}
          >
            {/* Viewmodaljsx */}

            <Box id="PopupPrint" sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 1, height: '100vh' }}>
              <DialogTitle sx={{ px: 0 }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                  <List sx={{ width: 1, p: 0 }}>
                    <ListItem disablePadding>
                      <ListItemAvatar sx={{ mr: 0.75, p: 2 }} className="flex justify-center align-center">
                        {/* <Avatar
                          //   alt={customer.fatherName}
                          size="lg"
                          src={viewModal?.details?.picture}
                        /> */}
                        <Typography variant="h4">Slot Management</Typography>
                        {/* <Typography color="secondary" variant="" className="p-4">
                          {viewModal?.details?.userName}
                        </Typography> */}
                      </ListItemAvatar>
                      {console.log('viewmodal----name--->', viewModal)}
                    </ListItem>
                  </List>
                </Stack>
              </DialogTitle>
              <DialogContent dividers sx={{ px: 0 }}>
                <div className="p-6">
                  <table className="w-full border-collapse h-full">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 dark:border-gray-700 py-3 px-4 text-left font-medium">Time</th>
                        {Weekdays.map((row) => {
                          return <th className="border border-gray-300 dark:border-gray-700 py-3 px-4 text-left font-medium">{row.Day}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-gray-100 ">
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4 font-medium">10:00 AM - 11:00 AM</td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Monday', '10:00AM', '11:00AM', e.target.value);
                            }}
                            required
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Tuesday', '10:00AM', '11:00AM', e.target.value);
                            }}
                            // value={timetableData}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Wednesday', '10:00AM', '11:00AM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Thursday', '10:00AM', '11:00AM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Friday', '10:00AM', '11:00AM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Saturday', '10:00AM', '11:00AM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Sunday', '10:00AM', '11:00AM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                      </tr>
                      <tr className="bg-gray-100 ">
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4 font-medium">11:00 AM - 12:00 PM</td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Monday', '11:00AM', '12:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Tuesday', '11:00AM', '12:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Wednesday', '11:00AM', '12:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Thursday', '11:00AM', '12:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Friday', '11:00AM', '12:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Saturday', '11:00AM', '12:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Sunday', '11:00AM', '12:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                      </tr>
                      <tr className="bg-gray-100 ">
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4 font-medium">12:00 AM - 01:00 PM</td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Monday', '12:00PM', '01:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Tuesday', '12:00PM', '01:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Wednesday', '12:00PM', '01:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Thursday', '12:00PM', '01:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Friday', '12:00PM', '01:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Saturday', '12:00PM', '01:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Sunday', '12:00PM', '01:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                      </tr>
                      <tr className="bg-gray-100 ">
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4 font-medium">01:00 PM - 02:00 PM</td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Monday', '01:00PM', '02:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Tuesday', '01:00PM', '02:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Wednesday', '01:00PM', '02:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Thursday', '01:00PM', '02:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Friday', '01:00PM', '02:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Saturday', '01:00PM', '02:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Sunday', '01:00PM', '02:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                      </tr>
                      <tr className="bg-gray-100 ">
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4 font-medium">02:00 PM - 03:00 PM</td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Monday', '02:00PM', '03:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Tuesday', '02:00PM', '03:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Wednesday', '02:00PM', '03:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Thursday', '02:00PM', '03:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Friday', '02:00PM', '03:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Saturday', '02:00PM', '03:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Sunday', '02:00PM', '03:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                      </tr>
                      <tr className="bg-gray-100 ">
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4 font-medium">03:00 PM - 04:00 PM</td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Monday', '03:00PM', '04:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Tuesday', '03:00PM', '04:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Wednesday', '03:00PM', '04:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Thursday', '03:00PM', '04:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Friday', '03:00PM', '04:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Saturday', '03:00PM', '04:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Sunday', '03:00PM', '04:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                      </tr>

                      <tr className="bg-gray-100 ">
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4 font-medium">04:00 PM - 05:00 PM</td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Monday', '04:00PM', '05:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Tuesday', '04:00PM', '05:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Wednesday', '04:00PM', '05:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Thursday', '04:00PM', '05:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Friday', '04:00PM', '05:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Saturday', '04:00PM', '05:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Sunday', '04:00PM', '05:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                      </tr>

                      {/* 5 to 6 */}

                      <tr className="bg-gray-100 ">
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4 font-medium">05:00 PM - 06:00 PM</td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Monday', '05:00PM', '06:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Tuesday', '05:00PM', '06:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Wednesday', '05:00PM', '06:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Thursday', '05:00PM', '06:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Friday', '05:00PM', '06:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Saturday', '05:00PM', '06:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Sunday', '05:00PM', '06:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                      </tr>

                      {/* 6 to 7 */}

                      <tr className="bg-gray-100 ">
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4 font-medium">06:00 PM - 07:00 PM</td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Monday', '06:00PM', '07:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Tuesday', '06:00PM', '07:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Wednesday', '06:00PM', '07:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Thursday', '06:00PM', '07:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Friday', '06:00PM', '07:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Saturday', '06:00PM', '07:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Sunday', '06:00PM', '07:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                      </tr>

                      {/* 7 to 8 */}

                      <tr className="bg-gray-100 ">
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4 font-medium">07:00 PM - 08:00 PM</td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Monday', '07:00PM', '08:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Tuesday', '07:00PM', '08:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Wednesday', '07:00PM', '08:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Thursday', '07:00PM', '08:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Friday', '07:00PM', '08:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Saturday', '07:00PM', '08:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Sunday', '07:00PM', '08:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                      </tr>

                      {/* 8 to 9 */}

                      <tr className="bg-gray-100 ">
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4 font-medium">08:00 PM - 09:00 PM</td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Monday', '08:00PM', '09:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Tuesday', '08:00PM', '09:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Wednesday', '08:00PM', '09:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Thursday', '08:00PM', '09:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Friday', '08:00PM', '09:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Saturday', '08:00PM', '09:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Sunday', '08:00PM', '09:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                      </tr>

                      {/* 9 to 10 */}

                      <tr className="bg-gray-100 ">
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4 font-medium">09:00 PM - 10:00 PM</td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Monday', '09:00PM', '10:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Tuesday', '09:00PM', '10:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Wednesday', '09:00PM', '10:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Thursday', '09:00PM', '10:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Friday', '09:00PM', '10:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Saturday', '09:00PM', '10:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>

                        <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                          <TextField
                            autocomplete="off"
                            className="textfields"
                            fullWidth
                            name="institutionId"
                            onChange={(e) => {
                              AddSlot('Sunday', '09:00PM', '10:00PM', e.target.value);
                            }}
                            required
                            error={institutionIdError}
                            helperText={institutionIdError && 'Institution Id is required'}
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </DialogContent>

              <DialogActions>
                <Button
                  color="error"
                  variant="contained"
                  onClick={handleClose}
                  className="bg-red-500 hover:bg-red-700"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'darkred' // Change this to the hover color you want
                    }
                  }}
                >
                  Close
                </Button>

                <Button
                  color="error"
                  variant="contained"
                  onClick={handleClose}
                  className="bg-blue-500 hover:bg-red-700"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'darkred' // Change this to the hover color you want
                    }
                  }}
                >
                  Save
                </Button>
              </DialogActions>
            </Box>
          </Dialog>

          {/* VIewmodaljsxend */}
        </form>
      </div>
    </Container>
  );
};

export default GroundDetails;
