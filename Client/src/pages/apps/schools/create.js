import React, { useState, useRef, useMemo, useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

const SchoolDetails = () => {
  const [selectedFile, setSelectedFile] = useState('');

  const [pincode, setpincode] = useState('');
  const [institutionemailId, setinstitutionemailId] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [address1, setaddress1] = useState('');
  const [address2, setaddress2] = useState('');
  const [city, setcity] = useState('');
  const [state, setstate] = useState('');
  const [country, setcountry] = useState('');
  const [UserName, setUserName] = useState('');
  const [contactpersonName, setcontactpersonName] = useState('');
  const [contactpersonphoneNumber, setcontactpersonPhonenumber] = useState('');
  const [contactpersonEmailid, setcontactpersonEmailid] = useState('');
  const [googlemaplink, setgooglemaplink] = useState('');
  const [sportsName, setSportsName] = React.useState([]);
  const [institutionid, setinstitutionId] = React.useState('');
  const [password, setpasssword] = React.useState('');
  const [schoolProfile, setschoolProfile] = React.useState('');
  const [AddRole, setAddRole] = useState('school');

  const [institutionNameError, setInstitutionNameError] = useState(false);
  const [UsernameError, setUsernameError] = useState(false);
  const [schoolProfileError, setschoolProfileError] = useState(false);
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
  const [Names, setNames] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [weekdayfrom, setweekdayfrom] = useState('');
  const [weekdayfromtime, setweekdayfromtime] = useState('');
  const [weekdayto, setweekdayto] = useState('');
  const [weekdaytotime, setweekdaytotime] = useState('');
  const [weekdayfromError, setweekdayfromError] = useState('');
  const [weekdaytoError, setweekdaytoError] = useState('');
  const [weekdayFromTime, setWeekdayFromTime] = useState('');
  const [Accesspassword, setAccesspasssword] = useState('')
    const [AccesspasswordError, setAccesspassswordError] = useState('');

  // const [weekdayfromtime, setweekdayfromtime] = useState('');
  // const [weekdaytotime, setweekdaytotime] = useState('');
  const [weekendfromtime, setweekendfromtime] = useState('');
  const [weekendtotime, setweekendtotime] = useState('');

  const [location, setLocation] = useState({
    city: '',
    state: '',
    country: '',
    error: ''
  });

  const server = process.env.REACT_APP_API_URL;

  let weekdays = ['Monday', 'TuesDay', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setpasssword(value);

    // Password validation criteria
    const isValidPassword =
      value.length >= 8 && // Minimum length of 8 characters
      /[a-z]/.test(value) && // At least one lowercase letter
      /[A-Z]/.test(value) && // At least one uppercase letter
      /\d/.test(value) && // At least one number
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(value); // At least one special character

    // Update error state based on validation result
    setpassswordError(!isValidPassword);
  };

  useEffect(() => {
    const fetchUsers = async () => {
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
            setNames(response.data);
            console.log('api dataamsdnasndam---', response.data);
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setschoolProfile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result);
      };
      // setschoolProfile(file)

      reader.readAsDataURL(file);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contactpersonphoneNumber.length !== 10) {
      setcontactpersonPhonenumberError(true);
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    if (!selectedFile) {
      toast.error('Please Upload School Profile Image');
      return;
    }

    // Check if required fields are empty
    if (
      !institutionName.trim() ||
      // !schoolProfile.trim() ||
      !address1.trim() ||
      // !address2.trim() ||
      // !city.trim() ||
      // !state.trim() ||
      // !country.trim() ||
      !pincode.trim() ||
      !UserName.trim() ||
      // !weekdayfrom.trim() ||
      // !weekdayto.trim() ||
      !institutionemailId.trim() ||
      !contactpersonName.trim() ||
      !contactpersonphoneNumber.trim() ||
      !contactpersonEmailid.trim() ||
      !googlemaplink.trim() ||
      !UserName.trim() ||
      sportsName.length === 0 || // Check if sportsName is empty
      !institutionid.trim() ||
      !password.trim()
    ) {
      setInstitutionNameError(!institutionName.trim());
      // setweekdayfrom(!weekdayfrom.trim());
      // setweekdayto(!weekdayto.trim());
      // setschoolProfileError(!schoolProfile.trim());
      setAddress1Error(!address1.trim());
      // setAddress2Error(!address2.trim());
      // setCityError(!city.trim());
      // setCountryError(!country.trim());
      // setStateError(!state.trim());
      setPincodeError(!pincode.trim());
      setInstitutionEmailIdError(!institutionemailId.trim());
      setContactPersonNameError(!contactpersonName.trim());
      setcontactpersonPhonenumberError(!contactpersonphoneNumber.trim());
      setcontactpersonEmailIdError(!contactpersonEmailid.trim());
      setgooglemaplinkError(!googlemaplink.trim());
      setUsernameError(!UserName.trim());
      setSportsNameError(sportsName.length === 0); // Set error if sportsName is empty
      setinstitutionIdError(!institutionid.trim());
      setpassswordError(!password.trim());

      if (passwordError || !password) {
        return;
      }

      toast.error('All Fields are required');
      return;
    }

    // Check password format
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!password.match(passwordRegex)) {
      setpassswordError(true);
      // toast.error(
      //   'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'
      // );
      return; // Add return statement to prevent further execution
    }

    const token = localStorage.getItem('token');

    if (!token) {
      // If no token is found, redirect to the login page
      // navigate('/');
    } else {
      const weekdayformatfromtime = formatTime(weekdayfromtime);
      const weekdayformattotime = formatTime(weekdaytotime);
      const weekendformatfromtime = formatTime(weekendfromtime);
      const weekendformattotime = formatTime(weekendtotime);
      console.log('weekdayformattimeformat======>', weekdayformatfromtime);
      console.log('weekdaytotimeformat--->', weekdayformattotime);

      const formattedWeekdayTime = `${weekdayformatfromtime} - ${weekdayformattotime}`;

      console.log('formatweekdaytime abhi dekho jra kaisa h------->', formattedWeekdayTime);
      const formattedWeekendTime = `${weekendformatfromtime} - ${weekendformattotime}`;

      const temp = {
        // weekdayfrom: weekdayfrom,
        weekdayfromtime: formattedWeekdayTime,
        // weekdayto: weekdayto,
        weekdaytotime: formattedWeekendTime
      };

      // console.log('temp---?>', temp);
      const formData = new FormData();

      // console.log('temstring----->', temp);
      const tempString = JSON.stringify(temp);
      // console.log('tempstring after stringify', tempString);

      formData.append('SchoolSchedule', tempString);

      // Append the string to FormData
      // formData.append('SchoolSchedule', tempString);
      formData.append('role', AddRole);
      formData.append('institutionName', institutionName);
      // formData.append('SchoolSchedule', temp);

      formData.append('schoolProfileImage', schoolProfile);
      formData.append('address1', address1);
      formData.append('address2', address2);
      formData.append('city', location.city);
      formData.append('state', location.state);
      formData.append('country', location.country);
      formData.append('pincode', pincode);
      formData.append('institutionemailId', institutionemailId);
      formData.append('contactpersonname', contactpersonName);
      formData.append('contactpersonphoneNumber', contactpersonphoneNumber);
      formData.append('contactpersonemailId', contactpersonEmailid);
      formData.append('googlemaplink', googlemaplink);
      formData.append('userName', UserName);
      sportsName.forEach((sports) => {
        formData.append(`sportsgrounds`, sports);
      });
      formData.append('institutionId', institutionid);
      formData.append('password', password);

      try {
        const response = await axios.post(`${server}/api/admin/create`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            "password": Accesspassword
          }
        });
        if (response.data) {
          console.log('School added:', response.data);
          toast('School added Successfully');
          setschoolProfile('');
          setSelectedFile('');
          setInstitutionName('');
          // setweekdayfrom('');
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
          setUserName('');
          setSportsName([]);
          setinstitutionId('');
          setpasssword('');
          console.log('This is the token', token);
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error(error?.response?.data?.message);
        console.log('responseerrordata', error.response?.data.message);

        // document.getElementById('SchoolForm').reset();
      } finally {
        console.log('Clearing the data...');
        // document.getElementById('SchoolForm').reset();
      }
    }
  };

  const handleInstitutionIdChange = (e) => {
    const value = e.target.value;
    setinstitutionId(value);
    setinstitutionIdError(false); // Reset error when user types
  };

  const handlePincodeChange = (e) => {
    setPincodeError(false); // Reset error when user types
    const { name, value } = e.target;
    setpincode(value);
    if (value.length === 6) {
      setLocation({ ...location, error: '' });
      axios
        .get(`https://api.postalpincode.in/pincode/${value}`)
        .then((res) => {
          setLocation({
            state: res.data[0].PostOffice[0].State,
            city: res.data[0].PostOffice[0].Block,
            district: res.data[0].PostOffice[0].District,
            country: res.data[0].PostOffice[0].Country,
            error: ''
          });
        })
        .catch((err) => {
          toast.error('Invalid Pincode');

          setLocation({ ...location, error: 'Invalid PIN Code' });
        });
    } else {
      setLocation({
        city: '',
        country: '',
        state: '',
        error: 'ZIP code must be of 6 digits'
      });
    }
  };

  const updateWeekdayTime = (type, value) => {
    if (type === 'from') {
      setweekdayfromtime(value);
    } else {
      setweekdaytotime(value);
    }
  };

  const updateWeekendTime = (type, value) => {
    if (type === 'from') {
      setweekendfromtime(value);
    } else {
      setweekendtotime(value);
    }
  };
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const formattedHour = hour % 12 || 12; // Handle 12:xx correctly
    const suffix = hour >= 12 ? 'PM' : 'AM';
    return `${formattedHour.toString().padStart(2, '0')}:${minutes}${suffix}`;
  };
  return (
    <Container maxWidth="420px">
      {/* <form className="space-y-4" onSubmit={handleSubmit}> */}
      <div>
        <form id="SchoolForm" className="space-y-4" onSubmit={(handleSubmit) => handleSubmit.target.reset()}>
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

            {/* School Details */}

            <Grid item xs={12} md={12}>
              <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardContent>
                  <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mb: 2, mt: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="h4">School Details</Typography>
                    </Grid>

                    <Grid item xs={6} className="flex items-center justify-center w-full h-[90px] mt-6">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-[30%] h-full order-2 px-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                      >
                        {selectedFile ? (
                          <img
                            src={selectedFile}
                            alt="Selected file"
                            className="w-full h-full object-fill object-center rounded-lg"
                            name="schoolProfileImage"
                            required
                            error={schoolProfileError ? 'true' : undefined} // Use 'true' as a string if error is true
                            helperText={schoolProfile && 'School Profile Image is required'}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Size</span> 56 x 51
                            </p>
                            <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">Only Jpeg & Png Files</p>
                          </div>
                        )}
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                      </label>
                    </Grid>
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Select
                        name="role"
                        id="role"
                        value={AddRole}
                        onChange={(e) => setAddRole(e.target.value)}
                        defaultValue="school"
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      >
                        {console.log('Role check-->', AddRole)}
                        <MenuItem value="school" name="role">
                          school
                        </MenuItem>
                      </Select>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        label="Name of Institution"
                        name="institutionName"
                        // onChange={(e) => setInstitutionName(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        onChange={(e) => {
                          setInstitutionName(e.target.value);
                          setInstitutionNameError(false); // Reset error when user types
                        }}
                        required
                        error={institutionNameError}
                        helperText={institutionNameError && 'Name of Institution is required'}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        label="Address line 1"
                        name="address1"
                        onChange={(e) => {
                          setaddress1(e.target.value);
                          setAddress1Error(false); // Reset error when user types
                        }}
                        required
                        error={address1Error}
                        helperText={address1Error && 'Address is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        label="Address line 2"
                        name="address2"
                        onChange={(e) => {
                          setaddress2(e.target.value);
                          // setAddress2Error(false); // Reset error when user types
                        }}
                        // required
                        // error={address2Error}
                        // helperText={address2Error && 'Address is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        label="City"
                        name="city"
                        value={location.city}
                        // onChange={(e) => setcity(e.target.value)}
                        onChange={(e) => {
                          setcity(e.target.value);
                          setCityError(false); // Reset error when user types
                        }}
                        required
                        error={CityError}
                        helperText={CityError && 'City is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        label="State"
                        name="state"
                        value={location.state}
                        onChange={(e) => {
                          setstate(e.target.value);
                          setStateError(false); // Reset error when user types
                        }}
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
                      <TextField
                        autocomplete="off"
                        type="number"
                        fullWidth
                        className="pincode"
                        label="Pincode"
                        name="pincode"
                        // onChange={(e) => {
                        //   setpincode(e.target.value);
                        //   setPincodeError(false); // Reset error when user types
                        // }}
                        onChange={handlePincodeChange}
                        required
                        error={PincodeError}
                        helperText={PincodeError && 'Pincode is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        value={location.country}
                        label="Country"
                        name="country"
                        onChange={(e) => {
                          setcountry(e.target.value);
                          setCountryError(false); // Reset error when user types
                        }}
                        required
                        error={CountryError}
                        helperText={CountryError && 'Country is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        label="Institution Id"
                        name="institutionId"
                        onChange={handleInstitutionIdChange}
                        value={institutionid}
                        required
                        error={institutionIdError}
                        helperText={institutionIdError && 'Institution Id is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>

                    {localStorage.getItem('role') === 'admin' && (
                      <Grid item xs={6}>
                        {/* <InputLabel className="mb-2">Access Password</InputLabel> */}
                        <TextField
                          label="Access Password"
                          autocomplete="off"
                          className="textfields"
                          fullWidth
                          name="password"
                          onChange={(e) => {
                            setAccesspasssword(e.target.value);
                            setAccesspassswordError(false); // Reset error when user types
                          }}
                          required
                          value={Accesspassword}
                          error={AccesspasswordError}
                          helperText={AccesspasswordError && 'Password is required'}
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

          <Grid item xs={12} md={12}>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Contact Details</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      autocomplete="off"
                      className="email"
                      fullWidth
                      label="Institution Email Id"
                      name="institutionemailId"
                      onChange={(e) => {
                        setinstitutionemailId(e.target.value);
                        setInstitutionEmailIdError(false); // Reset error when user types
                      }}
                      required
                      error={institutionemailIdError}
                      helperText={institutionemailIdError && 'Institution Email is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      label="Contact Person Name"
                      name="contactpersonname"
                      onChange={(e) => {
                        setcontactpersonName(e.target.value);
                        setContactPersonNameError(false); // Reset error when user types
                      }}
                      required
                      error={ContactPersonNameError}
                      helperText={ContactPersonNameError && 'Contact Person name is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      label="Contact Person Mobile Number"
                      name="contactpersonphoneNumber"
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        // Allow only numbers and ensure it's not more than 10 digits
                        if (/^[0-9]*$/.test(enteredValue) && enteredValue.length <= 10) {
                          setcontactpersonPhonenumber(enteredValue);
                          // Reset error when user types and when length is less than or equal to 10
                          if (enteredValue.length === 10) {
                            setcontactpersonPhonenumberError(false);
                          }
                        }
                      }}
                      required
                      error={ContactpersonPhonenumberError}
                      helperText={ContactpersonPhonenumberError && 'Mobile Number is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      autocomplete="off"
                      className="email"
                      fullWidth
                      label="Contact Person Email Id"
                      name="contactpersonemailId"
                      onChange={(e) => {
                        setcontactpersonEmailid(e.target.value);
                        setcontactpersonEmailIdError(false); // Reset error when user types
                      }}
                      required
                      error={ContactpersonEmailIdError}
                      helperText={ContactpersonEmailIdError && 'Emaill Id is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
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
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      label="Share Google Map Link Here"
                      name="googlemaplink"
                      onChange={(e) => {
                        setgooglemaplink(e.target.value);
                        setgooglemaplinkError(false); // Reset error when user types
                      }}
                      required
                      error={googlemaplinkError}
                      helperText={googlemaplinkError && 'Google Map Link is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Sports Ground Details */}

          <div>
            <Grid item xs={12} md={12}>
              <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 3 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h4">Sports Ground Details</Typography>
                    </Grid>

                    <Grid item xs={6}>
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
                        sx={{ width: '100%' }}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {console.log('sportsname map check-->', Names)}
                        {Names.map((name) => (
                          <MenuItem
                            // key={name}
                            value={name.name}
                            // style={getStyles(name, personName, theme)}
                          >
                            {name.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </div>

          <Grid item xs={12} md={12}>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Playing Hours (12 Hours Format Only)</Typography>
                  </Grid>

                  {/* Weekday (Monday-Friday) */}
                  <Grid item xs={4}>
                    <TextField
                      autoComplete="off"
                      className="font-bold mt-7"
                      fullWidth
                      label="Weekday (Monday-Friday)"
                      name="Weekday (Monday-Friday)"
                      variant="outlined"
                      size="small"
                      disabled
                      InputProps={{
                        style: {
                          color: 'rgba(0, 0, 0, 0.87)' // Match enabled text color
                        },
                        classes: {
                          notchedOutline: 'custom-notched-outline'
                        }
                      }}
                      InputLabelProps={{
                        style: {
                          color: 'rgba(0, 0, 0, 0.54)' // Match enabled label color
                        }
                      }}
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.23)' // Match enabled border color
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)' // Ensure compatibility across browsers
                        },
                        '& .MuiFormLabel-root.Mui-disabled': {
                          color: 'rgba(0, 0, 0, 0.54)' // Ensure the label appears enabled
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <InputLabel className="mb-2">From</InputLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type="time"
                        id="weekday-from-time"
                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        style={{ height: '38px' }}
                        onChange={(e) => updateWeekdayTime('from', e.target.value)}
                        required
                      />
                      {console.log('update weekdaytume--->', updateWeekdayTime)}
                    </div>
                  </Grid>

                  <Grid item xs={4}>
                    <InputLabel className="mb-2">To</InputLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type="time"
                        id="weekday-to-time"
                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        style={{ height: '38px' }}
                        onChange={(e) => updateWeekdayTime('to', e.target.value)}
                        required
                      />
                    </div>
                  </Grid>

                  {/* Display combined Weekday time */}
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      Weekday Hours: {weekdayfromtime} - {weekdaytotime}
                    </Typography>
                  </Grid>

                  {/* Weekend (Saturday-Sunday) */}
                  <Grid item xs={4}>
                    <TextField
                      autoComplete="off"
                      className="font-bold mt-7"
                      fullWidth
                      label="Weekend (Saturday-Sunday)"
                      name="Weekend (Saturday-Sunday)"
                      variant="outlined"
                      size="small"
                      disabled
                      InputProps={{
                        style: {
                          color: 'rgba(0, 0, 0, 0.87)' // Match enabled text color
                        },
                        classes: {
                          notchedOutline: 'custom-notched-outline'
                        }
                      }}
                      InputLabelProps={{
                        style: {
                          color: 'rgba(0, 0, 0, 0.54)' // Match enabled label color
                        }
                      }}
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.23)' // Match enabled border color
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)' // Ensure compatibility across browsers
                        },
                        '& .MuiFormLabel-root.Mui-disabled': {
                          color: 'rgba(0, 0, 0, 0.54)' // Ensure the label appears enabled
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <InputLabel className="mb-2">From</InputLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type="time"
                        id="weekend-from-time"
                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        style={{ height: '38px' }}
                        onChange={(e) => updateWeekendTime('from', e.target.value)}
                        required
                      />
                    </div>
                  </Grid>

                  <Grid item xs={4}>
                    <InputLabel className="mb-2">To</InputLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type="time"
                        id="weekend-to-time"
                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        style={{ height: '38px' }}
                        onChange={(e) => updateWeekendTime('to', e.target.value)}
                        required
                      />
                    </div>
                  </Grid>

                  {/* Display combined Weekend time */}
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      Weekend Hours: {weekendfromtime} - {weekendtotime}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Login Credentials */}

          <Grid item xs={12} md={12}>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Login Credentials</Typography>
                  </Grid>
                  {/*88888888888888888888888888888 2 */}

                  <Grid item xs={6}>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      label="username"
                      name="username"
                      onChange={(e) => {
                        setUserName(e.target.value);
                        setUsernameError(false); // Reset error when user types
                      }}
                      required
                      error={UsernameError}
                      helperText={UsernameError && 'Username Id is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>

                  {/* 2end88888888888888888888888888888888888888888888 */}

                  <Grid item xs={6}>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      label="Password"
                      // name="password"
                      // type="password"
                      onChange={handlePasswordChange}
                      required
                      error={passwordError}
                      helperText={
                        passwordError &&
                        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                      }
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

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
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default SchoolDetails;
