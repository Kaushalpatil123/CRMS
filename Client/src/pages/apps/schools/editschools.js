import React, { useState, useRef, useMemo, useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
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
import { Stack, height, width } from '@mui/system';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import GoBack from '../components/GoBack';

const Editschools = () => {
  const [setInstitutionName, InstitutionName] = useState('');
  //   const [InstitutionId, setInstitutionId] = useState('');
  const [editinstitutionEmail, seteditInstitutionEmail] = useState();
  const [editinstitutionName, seteditInstitutionName] = useState();
  const [editinstitutionId, seteditinstitutionId] = useState();
  const [editcontactpersonEmailId, seteditcontactpersonEmailId] = useState();
  const [editcontactpersonName, seteditcontactpersonName] = useState();
  const [editcontactpersonPhoneNumber, seteditcontactpersonPhoneNumber] = useState();
  const [editaddress1, seteditaddress1] = useState();
  const [editaddress2, seteditaddress2] = useState();
  const [editState, seteditState] = useState();
  const [editCity, seteditCity] = useState();
  const [editCountry, seteditCountry] = useState();
  const [editGoogleMapLink, seteditGoogleMapLink] = useState();
  const [editSportsdGroundName, seteditSportsdGroundName] = useState();
  const [editweekdayfromtime, seteditweekdayfromtime] = useState();
  const [editweekdaytotime, seteditweekdaytotime] = useState();
  const [editweekendfromtime, seteditweekendfromtime] = useState();
  const [editweekendtotime, seteditweekendtotime] = useState();
  const [InstitutionNameError, setInstitutionNameError] = useState(false);
  const [editInstitutionEmailError, seteditInstitutionEmailError] = useState(false);
  const [editInstitutionIdError, seteditInstitutionIdError] = useState(false);
  const [editaddress1Error, seteditaddress1Error] = useState(false);
  const [editaddress2Error, seteditaddress2Error] = useState(false);
  const [editCityError, seteditCityError] = useState(false);
  const [editStateError, seteditStateError] = useState(false);
  const [editCountryError, seteditCountryError] = useState(false);
  const [CountryError, setCountryError] = useState(false);
  const [GoogleMapLinkError, setGoogleMapLinkError] = useState(false);

  const [editcontactpersonNameError, seteditcontactpersonNameError] = useState(false);
  const [editcontactpersonEmailIdError, seteditcontactpersonEmailIdError] = useState(false);

  const [editcontactpersonPhoneNumberError, seteditcontactpersonPhoneNumberError] = useState(false);
  const [editSportsGroundNameError, seteditSportsGroundNameError] = useState(false);
  const [PincodeError, setPincodeError] = useState(false);
  const [Accesspassword, setAccesspassword] = useState('');
  const [AccesspasswordError, setAccesspasswordError] = useState('');
  const [Names, setNames] = useState([]);
  const [sportsName, setSportsName] = React.useState([]);
  const [SportsNameError, setSportsNameError] = useState(false);
  const [location, setLocation] = useState({
    city: '',
    state: '',
    country: '',
    error: ''
  });
  const [pincode, setpincode] = useState('');

  const server = process.env.REACT_APP_API_URL;

  const { id } = useParams();

  const getSchoolDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${server}/api/admin/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Assuming your raw body response is plain text
      const responseData = response.data.data;
      seteditinstitutionId(responseData?.institutionId);
      //   const responseData = response.data.data;
      console.log('This is view response data for edit', responseData);
      seteditInstitutionName(responseData.institutionName);
      seteditInstitutionEmail(responseData.institutionemailId);
      seteditcontactpersonName(responseData.contactpersonname);
      seteditcontactpersonEmailId(responseData.contactpersonemailId);
      seteditcontactpersonPhoneNumber(responseData.contactpersonphoneNumber);
      seteditaddress1(responseData.address1);
      seteditaddress2(responseData.address2);
      setSportsName(responseData.sportsgrounds);
      // setNames(responseData?.sportsgrounds)
      // seteditCity(responseData.city);
      // seteditState(responseData.state);
      // seteditCountry(responseData.country);
      setLocation({
        city: responseData.city,
        state: responseData.state,
        country: responseData.country,
        error: ''
      });
      seteditGoogleMapLink(responseData.googlemaplink);
      seteditSportsdGroundName(responseData.sportsgrounds);
      setpincode(responseData?.pincode);

      console.log('Monday-Fri weekdayfromtime--->', responseData?.SchoolSchedule?.weekdaytotime);
      const apiTimeWeekday = responseData?.SchoolSchedule?.weekdayfromtime;
      if (apiTimeWeekday) {
        const [from, to] = apiTimeWeekday.split('-').map((time) => time.trim());
        const convertTo24Hour = (time) => {
          const [hours, minutes, period] = time.match(/(\d{2}):(\d{2})([APM]{2})/i).slice(1, 4);
          const hours24 = (parseInt(hours) % 12) + (period.toUpperCase() === 'PM' ? 12 : 0);
          return `${hours24.toString().padStart(2, '0')}:${minutes}`;
        };
        seteditweekdayfromtime(convertTo24Hour(from));
        seteditweekdaytotime(convertTo24Hour(to));
      }

      const apiTimeWeekend = responseData?.SchoolSchedule?.weekdaytotime;
      if (apiTimeWeekend) {
        const [from, to] = apiTimeWeekend.split('-').map((time) => time.trim());
        const convertTo24Hour = (time) => {
          const [hours, minutes, period] = time.match(/(\d{2}):(\d{2})([APM]{2})/i).slice(1, 4);
          const hours24 = (parseInt(hours) % 12) + (period.toUpperCase() === 'PM' ? 12 : 0);
          return `${hours24.toString().padStart(2, '0')}:${minutes}`;
        };
        seteditweekendfromtime(convertTo24Hour(from));
        seteditweekendtotime(convertTo24Hour(to));
      }

      //   setOpen(true);
    } catch (error) {
      console.error('Error fetching User details:', error);
    }
  };

  useEffect(() => {
    getSchoolDetails();
  }, []);

  async function sportDropdown() {
    try {
      const token = localStorage.getItem('token');

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

  useEffect(() => {
    sportDropdown();
  }, []);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const formattedHour = hour % 12 || 12; // Handle 12:xx correctly
    const suffix = hour >= 12 ? 'PM' : 'AM';
    return `${formattedHour.toString().padStart(2, '0')}:${minutes}${suffix}`;
  };

  // Pincode Change
  const handlePincodeChange = (e) => {
    setPincodeError(false); // Reset error when user types
    const { value } = e.target;
    setpincode(value);
    if (value.length === 6) {
      setLocation({ ...location, error: '' });
      axios
        .get(`https://api.postalpincode.in/pincode/${value}`)
        .then((res) => {
          const postOffice = res.data[0].PostOffice[0];
          setLocation({
            state: postOffice.State,
            city: postOffice.Block,
            country: postOffice.Country,
            error: ''
          });
          seteditState(postOffice.State);
          seteditCity(postOffice.Block);
          seteditCountry(postOffice.Country);
        })
        .catch((err) => {
          toast.error('Invalid Pincode');
          setLocation({ ...location, error: 'Invalid PIN Code' });
        });
    } else {
      setLocation({
        city: '',
        state: '',
        country: '',
        error: 'ZIP code must be of 6 digits'
      });
    }
  };

  // Calling the update api
  const handleSaveEdit = async () => {
    try {
      if (editcontactpersonPhoneNumber.length !== 10) {
        seteditcontactpersonPhoneNumberError(true);
        toast.error('Phone number must be exactly 10 digits');

        return;
      }
      if (
        // !Phonenumber.trim() ||
        !editcontactpersonEmailId.trim() ||
        !editaddress1.trim() ||
        // !editaddress2.trim() ||
        // !editCity.trim() ||
        // !editState.trim() ||
        // !editCountry.trim() ||
        !editGoogleMapLink.trim() ||
        !editcontactpersonName.trim() ||
        !editcontactpersonEmailId.trim() ||
        !editcontactpersonPhoneNumber.trim() ||
        editSportsdGroundName.length === 0

        // !institutionemailId.trim() ||
        // !contactpersonName.trim() ||
        // !Phonenumber.trim() ||
        // !userName.trim() ||
        // !password.trim()
      ) {
        seteditaddress1Error(!editaddress1.trim());
        //  seteditaddress2Error(!editaddress2.trim())
        seteditCityError(!editCity.trim());
        seteditStateError(!editState.trim());
        seteditcontactpersonEmailIdError(!editcontactpersonEmailId.trim());
        seteditcontactpersonNameError(!editcontactpersonName.trim());
        seteditCountryError(!editCountry.trim());
        setGoogleMapLinkError(!editGoogleMapLink.trim());
        seteditcontactpersonPhoneNumberError(!editcontactpersonPhoneNumber.trim());
        seteditSportsGroundNameError(!editSportsGroundNameError.length === 0);

        toast.error('All Fields are required');
        return;
      }

      const weekdayformatfromtime = formatTime(editweekdayfromtime);
      const weekdayformattotime = formatTime(editweekdaytotime);
      const weekendformatfromtime = formatTime(editweekendfromtime);
      const weekendformattotime = formatTime(editweekendtotime);

      const formattedWeekdayTime = `${weekdayformatfromtime} - ${weekdayformattotime}`;

      console.log('formatweekdaytime abhi dekho jra kaisa h------->', formattedWeekdayTime);
      const formattedWeekendTime = `${weekendformatfromtime} - ${weekendformattotime}`;

      const temp = {
        weekdayfromtime: formattedWeekdayTime,

        weekdaytotime: formattedWeekendTime
      };

      // const tempString = JSON.stringify(temp);

      const requestData = {
        institutionId: editinstitutionId,
        institutionName: editinstitutionName,
        institutionemailId: editinstitutionEmail,
        contactpersonname: editcontactpersonName,
        contactpersonemailId: editcontactpersonEmailId,
        contactpersonphoneNumber: editcontactpersonPhoneNumber,
        address1: editaddress1,
        address2: editaddress2,
        city: editCity,
        state: editState,
        country: editCountry,
        googlemaplink: editGoogleMapLink,
        sportsgrounds: sportsName,
        SchoolSchedule: temp,
        pincode: pincode
      };
      //  sportsgrounds: sportsName.forEach((sports) => {
      //     requestData.append('sportsgrounds', sports);
      //   });

      const token = localStorage.getItem('token');
      const response = await axios.put(`${server}/api/admin/update/${id}`, requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          password: Accesspassword
        }
      });

      // Handle the response as needed

      if (response.status === 200) {
        // Close the edit modal after successful update
        // setEditModal({ open: false, details: null });

        toast('School updated Successfully');
      } else {
        toast.error('Record Not updated.. Try Again');
      }
    } catch (error) {
      console.error('Error updating record:', error);
      // Handle error and display a toast or error message to the user
      toast.error('Error updating record');
    }
  };

  return (
    <Container maxWidth="420px">
      {/* <form className="space-y-4" onSubmit={handleSubmit}> */}
      <div>
        <form
          id="SchoolForm"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();

            handleSaveEdit();
          }}
        >
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
                    <Grid item xs={6} className='flex'>
                      <GoBack/>
                      <Typography variant="h4">Personal Information</Typography>
                    </Grid>
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <InputLabel className="mb-2">Institution Id</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        // label="Institution Id"
                        name="InstitutionId"
                        // onChange={(e) => seteditinstitutionId(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        value={editinstitutionId}
                        onChange={(e) => {
                          seteditinstitutionId(e.target.value);
                          seteditInstitutionIdError(false); // Reset error when user types
                        }}
                        // required
                        error={editInstitutionIdError}
                        helperText={editInstitutionIdError && 'Institution Id is required'}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <InputLabel className="mb-2">Institution Name</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        // label="Institution Name"
                        name="InstitutionName"
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        value={editinstitutionName}
                        onChange={(e) => {
                          seteditInstitutionName(e.target.value);
                          setInstitutionNameError(false); // Reset error when user types
                        }}
                        // required
                        error={InstitutionNameError}
                        helperText={InstitutionNameError && 'Last Name is required'}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <InputLabel className="mb-2">Institution Email</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="number"
                        fullWidth
                        // label="Institution Email"
                        name="institutionemailId"
                        onChange={(e) => {
                          seteditInstitutionEmail(e.target.value);
                          seteditInstitutionEmailError(false); // Reset error when user types
                        }}
                        value={editinstitutionEmail}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        error={editInstitutionEmailError}
                        helperText={editInstitutionEmailError && 'Last Name is '}
                      />
                    </Grid>

                    {/* Address 1 */}

                    <Grid item xs={6}>
                      <InputLabel className="mb-2">Address 1</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        type="text"
                        fullWidth
                        // label="Address 2"
                        name="address1"
                        value={editaddress1}
                        onChange={(e) => {
                          seteditaddress1(e.target.value);
                          seteditaddress1Error(false); // Reset error when user types
                        }}
                        // required
                        error={editaddress1Error}
                        helperText={editaddress1Error && 'Address 1 is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>

                    {/* {/* Address 2 */}

                    <Grid item xs={6}>
                      <InputLabel className="mb-2">Address 2</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        type="text"
                        fullWidth
                        // label="Address 2"
                        name="address2"
                        value={editaddress2}
                        onChange={
                          (e) => {
                            seteditaddress2(e.target.value);
                            // seteditaddress2Error(false);
                          }
                          //   setratingError(false); // Reset error when user types
                        }
                        required
                        // error={editaddress2Error}
                        // helperText={editaddress2Error && 'Address 2 is required'}
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
                        type="text"
                        fullWidth
                        // label="City"
                        name="city"
                        value={location.city}
                        onChange={(e) => {
                          seteditCity(e.target.value);
                          seteditCityError(false); // Reset error when user types
                        }}
                        // required
                        error={editCityError}
                        helperText={editCityError && 'City is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>

                    {/* State */}

                    <Grid item xs={6}>
                      <InputLabel className="mb-2">State</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        type="text"
                        fullWidth
                        // label="State"
                        name="state"
                        value={location.state}
                        onChange={(e) => {
                          seteditState(e.target.value);
                          seteditStateError(false); // Reset error when user types
                        }}
                        // required
                        error={editStateError}
                        // value={editState}
                        helperText={editStateError && 'State is required'}
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
                        className="pincode"
                        // label="Pincode"
                        name="pincode"
                        value={pincode}
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
                      <InputLabel className="mb-2">Country</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        // label="Country"
                        name="country"
                        value={location.country}
                        onChange={(e) => {
                          seteditCountry(e.target.value);
                          seteditCountryError(false); // Reset error when user types
                        }}
                        // required
                        error={editCountryError}
                        helperText={editCountryError && 'Country is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <InputLabel className="mb-2">Share Google Map Link Here</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        // label="Share Google Map Link Here"
                        name="googlemaplink"
                        value={editGoogleMapLink}
                        onChange={(e) => {
                          seteditGoogleMapLink(e.target.value);
                          setGoogleMapLinkError(false); // Reset error when user types
                        }}
                        // required
                        error={GoogleMapLinkError}
                        helperText={GoogleMapLinkError && 'Google Map Link is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
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
                            setAccesspassword(e.target.value);
                            setAccesspasswordError(false); // Reset error when user types
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
                    <Typography variant="h4">Contact Information </Typography>

                    {/* Infor */}
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Contact Person Name</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      //   label="Contact Person Name"
                      name="contactpersonname"
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                      value={editcontactpersonName}
                      onChange={(e) => {
                        seteditcontactpersonName(e.target.value);
                        seteditcontactpersonNameError(false); // Reset error when user types
                      }}
                      // required
                      error={editcontactpersonNameError}
                      helperText={editcontactpersonNameError && 'Contact Person Name is required'}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Contact Person Email</InputLabel>
                    <TextField
                      autoComplete="off"
                      className="email"
                      type="email"
                      fullWidth
                      //   label="Contact Person Email"
                      name="EmailId"
                      onChange={(e) => {
                        const email = e.target.value;
                        seteditcontactpersonEmailId(email);
                        seteditcontactpersonEmailIdError(false); // Reset error when user types
                        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                        if (!isValidEmail) {
                          seteditcontactpersonEmailIdError(true);
                        }
                      }}
                      value={editcontactpersonEmailId}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                      error={editcontactpersonEmailIdError}
                      helperText={editcontactpersonEmailIdError && 'Contact Person Email Id is required'}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Contact Person Phone Number</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      //   label="Contact Person Phone Number"
                      name="contactpersonPhoneNumber"
                      value={editcontactpersonPhoneNumber}
                      onChange={(e) => {
                        seteditcontactpersonPhoneNumber(e.target.value);
                        seteditcontactpersonPhoneNumberError(false); // Reset error when user types
                      }}
                      // required
                      error={editcontactpersonPhoneNumberError}
                      helperText={editcontactpersonPhoneNumberError && 'Phone Number is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>

                  {/* SportsGRound */}

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Sports you are training for</InputLabel>

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
                      //   input={<OutlinedInput id="select-multiple-chip" label="Sports Name" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      // MenuProps={MenuProps}
                    >
                      {console.log('sportsname map check-->', Names)}
                      {Names?.filter((row) => row.deleted === false).map((name) => (
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

          {/* Playing Hours */}

          <Grid item xs={12} md={12}>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Playing Hours (12 Hours Format Only)</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel className="mb-2">From - Weekday (Mon-Fri)</InputLabel>

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
                        value={editweekdayfromtime}
                        onChange={(e) => {
                          console.log('now check e', e);
                          seteditweekdayfromtime(e && e.target.value);
                        }}
                        required
                      />
                      {console.log('update weekdaytume--->', editweekdayfromtime)}
                    </div>
                  </Grid>

                  <Grid item xs={6}>
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
                        value={editweekdaytotime}
                        onChange={(e) => {
                          console.log('now check e', e);
                          seteditweekdaytotime(e.target.value);
                        }}
                        required
                      />
                    </div>
                  </Grid>

                  {/* Weekend Time */}
                  <Grid container spacing={2} sx={{ margin: 1 }}>
                    <Grid item xs={6}>
                      <InputLabel className="mb-2">From- (Sat-Sun)</InputLabel>

                      <div class="relative">
                        <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                          <svg
                            class="w-4 h-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="time"
                          id="time"
                          class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          style={{ height: '38px' }}
                          value={editweekendfromtime}
                          onChange={(e) => {
                            console.log('now check e', e);
                            seteditweekendfromtime(e && e.target.value);
                          }}
                          required
                        />
                      </div>
                    </Grid>

                    <Grid item xs={6}>
                      <InputLabel className="mb-2">To</InputLabel>

                      <div class="relative">
                        <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                          <svg
                            class="w-4 h-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="time"
                          id="time"
                          class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          style={{ height: '38px' }}
                          value={editweekendtotime}
                          onChange={(e) => {
                            console.log('now check e', e);
                            seteditweekendtotime(e && e.target.value);
                          }}
                          required
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* <br /> */}

          <Grid container spacing={2} className="mt-2 mb-2">
            <Grid item>
              <Button className="w-24 h-10 rounded bg-blue-500 text-white hover:bg-blue-700 hover:text-white">Cancel</Button>
            </Grid>
            <Grid item>
              <Button type="submit" className="w-24 h-10 rounded bg-blue-500 text-white hover:bg-blue-700 hover:text-white">
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Editschools;
