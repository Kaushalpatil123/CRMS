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

import Chip from '@mui/material/Chip';
import { Stack, height, width } from '@mui/system';

import { PopupTransition } from '../../../../components/@extended/Transitions';
import GoBack from 'pages/apps/components/GoBack';
const CoachAvailability = () => {
  const [pincode, setpincode] = useState('');
  const [institutionemailId, setinstitutionemailId] = useState('');
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [Gender, setGender] = useState('');
  const [Nationality, setNationality] = useState('');
  const [address1, setaddress1] = useState('');
  const [address2, setaddress2] = useState('');
  const [city, setcity] = useState('');
  const [state, setstate] = useState('');
  const [country, setcountry] = useState('');
  const [googlemaplink, setgooglemaplink] = useState('');
  const [contactpersonName, setcontactpersonName] = useState('');
  const [Phonenumber, setPhonenumber] = useState('');
  const [EmailId, setEmailId] = useState('');
  const [Experience, setExperience] = useState('');
  const [ExperienceDescription, setExperienceDescription] = useState('');
  const [sportsName, setSportsName] = React.useState([]);
  const [institutionid, setinstitutionId] = React.useState('');
  const [schoolNames, setschoolNames] = useState([]);
  const [trainerName, settrainerName] = useState([]);
  const [schoolGroundName, setschoolGroundName] = useState('');
  const [address1Error, setAddress1Error] = useState(false);
  const [address2Error, setAddress2Error] = useState(false);
  const [StateError, setStateError] = useState(false);
  const [schoolGroundNameError, setschoolGroundNameError] = useState(false);
  const [googlemaplinkError, setgooglemaplinkError] = useState(false);
  const [PincodeError, setPincodeError] = useState(false);
  const [SportsNameError, setSportsNameError] = useState(false);
  const [institutionIdError, setinstitutionIdError] = useState(false);
  const [Names, setNames] = useState([]);
  const [weekdayfrom, setweekdayfrom] = useState('');
  const [weekdayfromtime, setweekdayfromtime] = useState('');
  const [weekdayto, setweekdayto] = useState('');
  const [weekdaytotime, setweekdaytotime] = useState('');
  const [schoolgroundId, setschoolGroundId] = useState('');
  const [selectTrainer, setselectTrainer] = useState('');
  const [selectTrainerId, setselectTrainerId] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [open, setOpen] = useState(false);
  const [CoachId, setCoachId] = useState('');
  const [selectTrainerError, setselectTrainerError] = useState('');
  const [timetableData, setTimetableData] = useState([]);
  const [CoachesName, setCoachesName] = useState('');
  const [editweekdayfromtime, seteditweekdayfromtime] = useState();
  const [editweekdaytotime, seteditweekdaytotime] = useState();

  const [accessPassword, setaccessPassword] = useState('');
  const [accessPasswordError, setaccessPasswordError] = useState('');
  const [WeekdaysError, setWeekdaysError] = useState('');
  const [certifications, setCertifications] = useState([{ CertificationName: '', CertifyingOrg: '', fileName: '', file: null }]);
const [Weekdays, setWeekdays] = useState([]);

const WeekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


  const { id } = useParams();
  //using
  const fetchDefaultDetails = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // navigate("/");
    } else {
      try {
        const response = await axios.get(`${server}/api/Coachavailibility/get/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data) {
          console.log('response data trainer--->', response?.data?.data);
          // setCoachesName(response?.data?.data?.name);
          setschoolGroundName(response?.data?.data?.schoolname); //school name stored
          setselectTrainer(response.data?.data?.name); //coach name stored
          setschoolGroundId(response.data.data.schoolId);
          setSchoolId(response.data.data.schoolId); //school id stored for further reference
          setWeekdays(response.data?.data?.days)
          seteditweekdayfromtime(response?.data?.data?.starttime);
          seteditweekdaytotime(response?.data?.data?.endtime)
          // setTimetableData(response.data?.data?.slots); //slot store in
          // setavailabilityStartTime(response.data?.data?.starttime);

          console.log('Monday-Fri weekdayfromtime--->', response.data.data?.starttime);
          const apiTimeWeekday = response.data.data?.starttime;
          if (apiTimeWeekday) {
            const [from, to] = apiTimeWeekday.split('-').map((time) => time.trim());
            console.log(
              'apitimestartime split-->',
              apiTimeWeekday.split('-').map((time) => time.trim())
            );
            const convertTo24Hour = (time) => {
              const [hours, minutes, period] = time.match(/(\d{2}):(\d{2})([APM]{2})/i).slice(1, 4);
              const hours24 = (parseInt(hours) % 12) + (period.toUpperCase() === 'PM' ? 12 : 0);
              return `${hours24.toString().padStart(2, '0')}:${minutes}`;
            };
            console.log('fromtime---->', from);
            seteditweekdayfromtime(convertTo24Hour(from));
            //  seteditweekdaytotime(convertTo24Hour(to));
          }

          console.log('Monday-Fri weekdayfromtime--->', response.data.data?.endtime);
          const apiTimeWeekdays = response.data.data?.endtime;
          if (apiTimeWeekdays) {
            const [from, to] = apiTimeWeekdays.split('-').map((time) => time.trim());
            console.log(
              'apitimestartime split-->',
              apiTimeWeekdays.split('-').map((time) => time.trim())
            );
            const convertTo24Hour = (time) => {
              const [hours, minutes, period] = time.match(/(\d{2}):(\d{2})([APM]{2})/i).slice(1, 4);
              const hours24 = (parseInt(hours) % 12) + (period.toUpperCase() === 'PM' ? 12 : 0);
              return `${hours24.toString().padStart(2, '0')}:${minutes}`;
            };
            console.log('fromtime---->', from);
            // seteditweekdayfromtime(convertTo24Hour(from));
            seteditweekdaytotime(convertTo24Hour(from));
          }
        } else {
          console.error('Empty response data or unexpected format');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  };

  // const Weekdays = [
  //   { id: 1, Day: 'Monday' },
  //   { id: 2, Day: 'Tuesday' },
  //   { id: 3, Day: 'Wednesday' },
  //   { id: 4, Day: 'Thursday' },
  //   { id: 5, Day: 'Friday' }
  // ];

  // const AddSlot = (dayofweek, starttime, endtime, totalslot) => {
  //   console.log('startedn-------->', starttime, endtime, dayofweek, totalslot);

  //   const existingIndex = timetableData?.findIndex(
  //     (item) => item.dayofweek === dayofweek && item.starttime === starttime && item.endtime === endtime
  //   );
  //   if (existingIndex !== -1) {
  //     // If an entry for this day and time already exists, update its value
  //     const newTimetableData = [...timetableData];
  //     console.log('newtimetabledata---->', newTimetableData);
  //     newTimetableData[existingIndex].totalslot = totalslot;
  //     setTimetableData(newTimetableData);
  //   } else {
  //     // If an entry for this day and time doesn't exist, create a new one
  //     setTimetableData((prevData) => [...prevData, { dayofweek, starttime, endtime, totalslot }]);
  //   }

  //   console.log('Timetable data--->', timetableData);
  // };

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

  // fetch trainers
  //using
  const fetchAllTrainers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // navigate("/");
    } else {
      try {
        const response = await axios.get(`${server}/api/admin/allcoach`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data) {
          const filteredData = response?.data?.formattedCoaches?.filter(
            (user) => user?.role === 'coach' && user?.isDeleted === false && user?.name === selectTrainer
          );
          console.log('response data trainer a,emmqenwmnermwermn--->', filteredData);
          const output = await stringIntoArray(
            filteredData[0]?.sportsgrounds ? filteredData[0]?.sportsgrounds : filteredData?.sportsgrounds
          );
          console.log('this is sports ', output);
          setNames(output);
          // setselectTrainerId(response?.data?.formattedCoaches?._id);
          // setSchoolId(response?.data?.formattedCoaches?.schoolId);
        } else {
          console.error('Empty response data or unexpected format');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  };

  useEffect(() => {
    fetchDefaultDetails();
  }, []);

  useEffect(() => {
    fetchAllTrainers();
  }, [selectTrainer]);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const formattedHour = hour % 12 || 12; // Handle 12:xx correctly
    const suffix = hour >= 12 ? 'PM' : 'AM';
    return `${formattedHour.toString().padStart(2, '0')}:${minutes}${suffix}`;
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    // e.preventDefault();

    // Check if required fields are empty
    if (!city.trim() ) {
      setselectTrainerError(!selectTrainer.trim());
      // setaccessPassword(!accessPassword.trim());
      // setfirstNameError(!firstName.trim());
      // setlastNameError(!lastName.trim());
      // setGenderError(!Gender.trim());
      // setNationalityError(!Nationality.trim());
      // setgooglemaplinkError(!googlemaplink.trim());

      // setweekdayfrom(!weekdayfrom.trim());
      // setweekdayto(!weekdayto.trim());
      // setschoolProfileError(!schoolProfile.trim());
      // setAddress1Error(!address1.trim());
      // setAddress2Error(!address2.trim());
      // setCityError(!city.trim());
      // setCountryError(!country.trim());
      // setStateError(!state.trim());
      // setPincodeError(!pincode.trim());
      // setInstitutionEmailIdError(!institutionemailId.trim());
      // setContactPersonNameError(!contactpersonName.trim());
      // setPhonenumberError(!Phonenumber.trim());
      // setSportsNameError(sportsName.length === 0); // Set error if sportsName is empty
      // setschoolGroundNameError(!schoolGroundName.trim());
      // setinstitutionIdError(!institutionid.trim());

      // if (accessPasswordError || !accessPassword) {
      //   toast.error('Password is Required');
      //   return;
      // }

      toast.error('All Fields are required');
      return;
    }

    // Check password format

    const token = localStorage.getItem('token');

    if (!token) {
      // If no token is found, redirect to the login page
      navigate('/');
    } else {
      // console.log('temp---?>', temp);
      const formData = new FormData();

      // formData.append('starttime', formatTime(editweekdayfromtime));
      // formData.append('endtime', formatTime(editweekdaytotime));

      // Append the string to FormData

      // formData.append('coachId', CoachId);
      // formData.append('schoolId', schoolgroundId);
       const requestData = {
         starttime: editweekdayfromtime,
         endtime: editweekdaytotime,
         days: Weekdays,
         coachId: CoachId,
         schoolId: schoolgroundId
       };
       console.log('starttime ho gya--->',editweekdayfromtime)
      try {
        const response = await axios.put(`${server}/api/Coachavailibility/update/${id}`, requestData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            password: accessPassword
          }
        });
        if (response.data) {
          console.log('Coach added:', response.data);
          toast('Coach Details Updated Successfully');

          setaccessPassword('');

          console.log('This is the token', token);
        }
      } catch (error) {
        // console.error('Error uploading file:', error);
        toast.error(error.response.data.message);

        document.getElementById('SchoolForm')?.reset();
      } finally {
        console.log('Clearing the data...');
        setTimeout(() => {
          // navigate('/apps/all-coaches-availability');
        }, 3000);
        document.getElementById('SchoolForm')?.reset();
      }
    }
  };

  //Not using
  const fetchTrainerDetails = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // navigate("/");
    } else {
      try {
        console.log('selected trainer k id for pi call--->', id);
        const response = await axios.get(`${server}/api/Coachavailibility/get/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data) {
          console.log('response data trainerwwwsw--->', response.data.data);
          setCoachId(response?.data?.data?.coachId);
        } else {
          console.error('Empty response data or unexpected format');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  };

  useEffect(() => {
    // if (selectTrainerId) {
    fetchTrainerDetails();
    // }
  }, []);

  // useEffect(() => {
  //   if (selectTrainerId) {
  //     fetchTrainerDetails();
  //   }
  // }, [selectTrainerId]);

  // School Ground Name

  //Fetch Ground or School Details
  const fetchDetails = async () => {
    console.log('fetchdetails m schoolid-->', schoolgroundId);
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`${server}/api/admin/user/${schoolgroundId ? schoolgroundId : id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('after school api call-->', schoolgroundId);
      // Assuming your raw body response is plain text
      const responseDat = response?.data?.data;
      console.log('school data', responseDat);
      setschoolGroundId(responseDat?._id);
      setinstitutionId(responseDat?.institutionId);
      setaddress1(responseDat?.address1);
      setaddress2(responseDat?.address2);
      setcity(responseDat?.city);
      setstate(responseDat?.state);
      setcountry(responseDat?.country);
      setpincode(responseDat?.pincode);
      setgooglemaplink(responseDat?.googlemaplink);
    } catch (error) {
      console.error('Error fetching User details:', error);
    }
  };

  useEffect(() => {
    // if (schoolgroundId) {
    console.log('school k ground k id--->', schoolgroundId);
    fetchDetails();
    // }
  }, [schoolgroundId]);

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

  useEffect(() => {
    fetchDetails();
    fetchUsers();
  }, []);

  // -----------View Modal------------

  const [viewModal, setViewModal] = useState({
    open: false,
    details: null,
    completeDetails: null
  });

  function stringIntoArray(value) {
    // console.log("this is value", value)
    let output = value[0]?.split(',');
    // console.log('this is outpou', output)
    return output;
  }

  return (
    <Container maxWidth="420px">
      {/* <form className="space-y-4" onSubmit={handleSubmit}> */}
      <div>
        <form
          id="SchoolForm"
          className="space-y-4"
          // onSubmit={(handleSubmit) => handleSubmit.target.reset()}

          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}

          //   onSubmit={(e) => {
          //     e.preventDefault();
          //     onSubmit={(handleSubmit) => handleSubmit.target.reset()}}}
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
                    <Grid item xs={6} className="flex">
                      <GoBack />
                      <Typography variant="h4">Personal Information</Typography>
                    </Grid>
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <InputLabel className="mb-2">Trainer Name</InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        name="trainername"
                        // onChange={(e) => {
                        //   setinstitutionId(e.target.value);
                        // }}
                        value={selectTrainer}
                        required
                        error={selectTrainerError}
                        helperText={selectTrainerError && 'Trainer Name  is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <InputLabel className="mb-2">Sports you are training for</InputLabel>
                      <Select
                        autocomplete="off"
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        name="sportsgrounds"
                        fullWidth
                        multiple
                        value={Names}
                        onChange={(e) => {
                          setSportsName(e.target.value);
                          setSportsNameError(false); // Reset error when user types
                        }}
                        required
                        error={SportsNameError}
                        helperText={SportsNameError && 'Sports Name is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%', height: '38px' }}
                        // input={<OutlinedInput id="select-multiple-chip" label="Sports Name" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} className="text-black  bg-slate-50" />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                        disabled
                      >
                        {console.log('sportsname map check-->', Names)}
                        {Names?.map((name) => (
                          <MenuItem
                            // key={name}
                            value={name}
                            // style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
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
                    <Typography variant="h4">Ground Information</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Ground Name</InputLabel>
                    <Select
                      autocomplete="off"
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      name="sportsgrounds"
                      value={schoolGroundName}
                      fullWidth
                      onChange={(e) => {
                        const selectedName = e.target.value; // Get the selected name
                        const selectedId = schoolNames?.find((name) => name.institutionName === selectedName)?._id; // Find the
                        setschoolGroundName(selectedName);
                        setschoolGroundId(selectedId); // Set the ID in the state
                        console.log('selected id--->', selectedId);
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
                        ?.filter((row) => row?.isDeleted === false)
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
                      fullWidth
                      name="institutionId"
                      onChange={(e) => {
                        setinstitutionId(e.target.value);
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

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Address line 1</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
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
                      helperText={StateError && 'Address is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Address 2</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      name="address2"
                      onChange={(e) => {
                        setaddress2(e.target.value);
                        setAddress2Error(false); // Reset error when user types
                      }}
                      value={address2}
                      error={address2Error}
                      helperText={address2Error && 'Address is required'}
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
                      name="pincode"
                      onChange={(e) => {
                        setpincode(e.target.value);
                        setPincodeError(false); // Reset error when user types
                      }}
                      value={pincode}
                      error={PincodeError}
                      helperText={PincodeError && 'Pincode is required'}
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
                      name="city"
                      onChange={(e) => {
                        setcity(e.target.value);
                      }}
                      value={city}
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
                      name="country"
                      onChange={(e) => {
                        setcountry(e.target.value);
                      }}
                      value={country}
                      disabled
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
                        name="accessPassword"
                        onChange={(e) => {
                          setaccessPassword(e.target.value);
                          // setaccessPasswordError(false); // Reset error when user types
                        }}
                        required
                        // value={accessPassword}
                        // error={accessPasswordError}
                        // helperText={accessPasswordError && 'Password is required'}
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
                      // label="Share Google Map Link Here"
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

                  <Grid item xs={12} md={12}>
                    <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '90%', marginTop: 3 }}>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="h4">Playing Hours (12 Hours Format Only)</Typography>
                          </Grid>

                          {/* Weekday (Monday-Friday) */}
                          <Grid item xs={12}>
                            <InputLabel className="mb-2">Weekdays (Monday-Sunday)</InputLabel>
                            <Select
                              autocomplete="off"
                              labelId="demo-multiple-chip-label"
                              id="demo-multiple-chip"
                              name="sportsgrounds"
                              fullWidth
                              multiple
                              value={Weekdays}
                              onChange={(e) => {
                                setWeekdays(e.target.value);
                                setWeekdaysError(false); // Reset error when user types
                                console.log('e--->', e.target.value);
                                console.log('setweekdays--->', Weekdays);
                              }}
                              required
                              error={WeekdaysError}
                              helperText={WeekdaysError && 'Weekday is required'}
                              variant="outlined"
                              size="small"
                              // sx={{ width: '100%' ,height:'38px'}}
                              renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                  ))}
                                </Box>
                              )}
                              MenuProps={MenuProps}
                            >
                              {console.log('sportsname map check-->', WeekdayNames)}
                              {WeekdayNames?.map((name) => (
                                <MenuItem
                                  // key={name}
                                  value={name}
                                  // style={getStyles(name, personName, theme)}
                                >
                                  {name}
                                </MenuItem>
                              ))}
                            </Select>
                          </Grid>
                          <br />

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
                                onChange={(e) => {
                                  console.log('now check e', e);
                                  seteditweekdayfromtime(e && e.target.value);
                                }}
                                required
                                value={editweekdayfromtime}
                              />
                              {console.log('availability start time--->', editweekdayfromtime)}
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
                                onChange={(e) => {
                                  console.log('now check e', e);
                                  seteditweekdaytotime(e && e.target.value);
                                }}
                                required
                                value={editweekdaytotime}
                              />

                              {console.log('availability end time--->', editweekdaytotime)}
                            </div>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
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
                // onClick={handleSubmit}
              >
                Save
              </Button>
            </Grid>
          </Grid>

          {/* VIewmodaljsxend */}
        </form>
      </div>
    </Container>
  );
};

export default CoachAvailability;
