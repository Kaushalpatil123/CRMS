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
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

import { PopupTransition } from '../../../../components/@extended/Transitions';
const CoachAvailability = () => {
  const [selectedFile, setSelectedFile] = useState('');

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
  const [password, setpasssword] = React.useState('');
  const [schoolProfile, setschoolProfile] = React.useState('');
  const [AddRole, setAddRole] = useState('coach');
  const [CertificationName, setCertificationName] = React.useState('');
  const [schoolNames, setschoolNames] = useState([]);
  const [trainerName, settrainerName] = useState([]);
  const [schoolGroundName, setschoolGroundName] = useState('');
  const [CertifyingOrg, setCertifyingOrg] = React.useState('');

  const [firstNameError, setfirstNameError] = useState(false);
  const [lastNameError, setlastNameError] = useState(false);
  const [schoolProfileError, setschoolProfileError] = useState(false);
  const [address1Error, setAddress1Error] = useState(false);
  const [address2Error, setAddress2Error] = useState(false);
  const [CityError, setCityError] = useState(false);
  const [StateError, setStateError] = useState(false);
  const [CountryError, setCountryError] = useState(false);
  const [schoolGroundNameError, setschoolGroundNameError] = useState(false);
  const [googlemaplinkError, setgooglemaplinkError] = useState(false);
  const [PincodeError, setPincodeError] = useState(false);
  const [institutionemailIdError, setInstitutionEmailIdError] = useState(false);
  const [ContactPersonNameError, setContactPersonNameError] = useState(false);
  const [PhonenumberError, setPhonenumberError] = useState(false);
  const [EmailIdError, setEmailIdError] = useState(false);
  const [ExperienceError, setExperienceError] = useState(false);
  const [ExperienceDescriptionError, setExperienceDescriptionError] = useState(false);
  const [CertificationNameError, setCertificationNameError] = useState(false);
  const [CertifyingOrgError, setCertifyingOrgError] = useState(false);

  const [SportsNameError, setSportsNameError] = useState(false);
  const [institutionIdError, setinstitutionIdError] = useState(false);
  const [passwordError, setpassswordError] = useState(false);
  const [Names, setNames] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [weekdayfrom, setweekdayfrom] = useState('');
  // const [weekdayfromtime, setweekdayfromtime] = useState('');
  // const [weekdayto, setweekdayto] = useState('');
  // const [weekdaytotime, setweekdaytotime] = useState('');
  const [weekdayfromError, setweekdayfromError] = useState('');
  const [weekdaytoError, setweekdaytoError] = useState('');
  const [GenderError, setGenderError] = useState('');
  const [NationalityError, setNationalityError] = useState('');
  const [fileName, setFileName] = useState('');
  const [schoolgroundId, setschoolGroundId] = useState('');
  const [selectTrainer, setselectTrainer] = useState('');
  const [selectTrainerId, setselectTrainerId] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [open, setOpen] = useState(false);
  const [weekdayfromtime, setweekdayfromtime] = useState('');
  const [weekdayto, setweekdayto] = useState('');
  const [weekdaytotime, setweekdaytotime] = useState('');
  // const [weekdayfromError, setweekdayfromError] = useState('');
  // const [weekdaytoError, setweekdaytoError] = useState('');
  const [weekdayFromTime, setWeekdayFromTime] = useState('');
  // const [weekdayfromtime, setweekdayfromtime] = useState('');
  // const [weekdaytotime, setweekdaytotime] = useState('');
  const [weekendfromtime, setweekendfromtime] = useState('');
  const [weekendtotime, setweekendtotime] = useState('');

  const [CoachId, setCoachId] = useState('');
  const [selectTrainerError, setselectTrainerError] = useState('');
  const [timetableData, setTimetableData] = useState([]);

  const [accessPassword, setaccessPassword] = useState('');
  const [accessPasswordError, setaccessPasswordError] = useState('');
  const [validationError, setValidationError] = useState('');
const [WeekdaysError, setWeekdaysError] = useState('');
  const [certifications, setCertifications] = useState([{ CertificationName: '', CertifyingOrg: '', fileName: '', file: null }]);
const [Weekdays, setWeekdays] = useState([]);

const WeekdayNames = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

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
          console.log('response data trainer coach--->', response.data.formattedCoaches);
          const filteredData = response.data.formattedCoaches.filter((user) => user.role === 'coach' && user.isDeleted === false);
          console.log('filtereddata coach-->', filteredData);
          settrainerName(filteredData);
          // setselectTrainerId(filteredData._id);
          // setSchoolId(filteredData.schoolId);
        } else {
          console.error('Empty response data or unexpected format');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  };

  useEffect(() => {
    fetchAllTrainers();
  }, []);

  const updateWeekdayTime = (type, value) => {
    if (type === 'from') {
      setweekdayfromtime(value);
    } 
    if(type==='to') {
      setweekdaytotime(value);
    }
  };

  // const updateWeekendTime = (type, value) => {
  //   if (type === 'from') {
  //     setweekendfromtime(value);
  //   } else {
  //     setweekendtotime(value);
  //   }
  // };
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const formattedHour = hour % 12 || 12; // Handle 12:xx correctly
    const suffix = hour >= 12 ? 'PM' : 'AM';
    return `${formattedHour.toString().padStart(2, '0')}:${minutes}${suffix}`;
  };

  // remove above api call if not needed
  const navigate = useNavigate();



  const validateTimes = (type, value) => {
    const fromTime = type === 'from' ? value : weekdayfromtime;
    const toTime = type === 'to' ? value : weekdaytotime;

    if (!fromTime) {
      setValidationError('From time is required.');
      return false;
    }
    
    if (!toTime) {
      setValidationError('To time is required.');
      return false;
    }

    if (toTime && fromTime >= toTime) {
      setValidationError('From time should be earlier than To time.');
      return false;
    }

    setValidationError('');
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('from time hee-->',weekdayfromtime)
    console.log('weekday to time-->',weekdaytotime)
      if (!validateTimes('from', weekdayfromtime) || !validateTimes('to', weekdaytotime)) {
        toast.error('Time is required');
        return;
      }

    // Check if required fields are empty
    if (
      // selectTrainer.trim() ||
      // !firstName.trim() ||
      // !lastName.trim() ||
      // // !schoolProfile.trim() ||
      // !address1.trim() ||
      // !address2.trim() ||
      !city.trim()
      // !state.trim() ||
      // !country.trim() ||
      // !pincode.trim()
      //  !googlemaplink.trim()

      // !Nationality.trim() ||
      // !weekdayfrom.trim() ||
      // !weekdayto.trim() ||
      // !institutionemailId.trim() ||
      // !contactpersonName.trim() ||
      // !Phonenumber.trim() ||
      // !EmailId.trim() ||
      // !Experience.trim() ||
      // !ExperienceDescription.trim() ||
      // sportsName.length === 0 || // Check if sportsName is empty
      // !institutionid.trim() ||
      // !password.trim()
    ) {
      setselectTrainerError(!selectTrainer.trim());
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
      // setEmailIdError(!EmailId.trim());
      // setExperienceError(!Experience.trim());
      // setExperienceDescriptionError(!ExperienceDescription.trim());
      // setSportsNameError(sportsName.length === 0); // Set error if sportsName is empty
      setschoolGroundNameError(!schoolGroundName.trim());
       setWeekdaysError(Weekdays.length === 0);
      // setinstitutionIdError(!institutionid.trim());
      // setpassswordError(!password.trim());

      // if (passwordError || !password) {
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
      const weekdayformatfromtime = formatTime(weekdayfromtime);
      const weekdayformattotime = formatTime(weekdaytotime);
      // const weekendformatfromtime = formatTime(weekendfromtime);
      // const weekendformattotime = formatTime(weekendtotime);
      // console.log('weekdayformattimeformat======>', weekdayformatfromtime);
      // console.log('weekdaytotimeformat--->', weekdayformattotime);

      const formattedWeekdayTime = `${weekdayformatfromtime} - ${weekdayformattotime}`;

      console.log('formatweekdaytime abhi dekho jra kaisa h------->', formattedWeekdayTime);

    
         const requestData = {
           starttime: weekdayformatfromtime,
           endtime: weekdayformattotime,
           days: Weekdays,
           coachId: CoachId,
           schoolId: schoolgroundId
         };


      // formData.append('starttime', weekdayformatfromtime);
      // formData.append('endtime', weekdayformattotime);
      // Weekdays?.forEach((day) => {
        // formData.append(`days`, day);
        //  formData.append('days', Weekdays);
      // });
        // Weekdays.forEach((day) => {
        //   formData.append('days', day);
        // });
        

      // formData.append('coachId', CoachId);
      // formData.append('schoolId', schoolgroundId);
      try {
        const response = await axios.post(`${server}/api/Coachavailibility/create`, requestData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            password: accessPassword
          }
        });
        if (response.data) {
          console.log('Coach added:', response.data);
          toast('Coach added Successfully');
          // setschoolProfile('');
          // setSelectedFile('');
          setfirstName('');
          setlastName('');
          setGender('');
          setNationality('');
          setweekdayfrom('');
          setaddress1('');
          setaddress2('');
          setcity('');
          setstate('');
          setcountry('');
          setpincode('');
          setinstitutionemailId('');
          setcontactpersonName('');
          setschoolGroundName('');
          setPhonenumber('');
          setgooglemaplink('');
          setEmailId('');
          setExperience('');
          setExperienceDescription('');
          setSportsName([]);
          setWeekdays([])
          setinstitutionId('');
          setpasssword('');
          console.log('This is the token', token);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);

        document.getElementById('SchoolForm').reset();
      } finally {
        console.log('Clearing the data...');
        document.getElementById('SchoolForm').reset();
      }
    }
  };

  const fetchTrainerDetails = async (selectTrainerId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // navigate("/");
    } else {
      try {
        console.log('selected trainer k id for pi call--->', selectTrainerId);
        const response = await axios.get(`${server}/api/admin/coach/${selectTrainerId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data) {
          console.log('response data trainerwww--->', response.data.data);
          setCoachId(response?.data?.data?._id);

          setNames(response?.data?.data?.sportsgrounds);
        } else {
          console.error('Empty response data or unexpected format');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  };

  useEffect(() => {
    if (selectTrainerId) {
      fetchTrainerDetails(selectTrainerId);
    }
  }, [selectTrainerId]);

  // School Ground Name

  // useEffect(() => {
  const fetchDetails = async (schoolgroundId) => {
    console.log('fetchdetails m schoolid-->', schoolgroundId);
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`${server}/api/admin/user/${schoolgroundId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('after school api call-->');
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
    if (schoolgroundId) {
      fetchDetails(schoolgroundId);
    }
  }, [schoolgroundId]);

  useEffect(() => {
    // fetchDetails()
    fetchUsers();
  }, []);

  // api for selected coach coachId details

  // useEffect(() => {
  // const fetchCoachDetails = async (CoachId) => {
  //   console.log('coahid api k baad aayi yha m coachid-->', CoachId);
  //   try {
  //     const token = localStorage.getItem('token');

  //     const response = await axios.get(`${server}/api/admin/user/${CoachId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });

  //     // Assuming your raw body response is plain text
  //     const responseDat = response?.data?.data;
  //     console.log('particular coach details data', responseDat);
  //     setNames(responseDat?.sportsgrounds);

  //     // setschoolGroundId(responseDat?._id);
  //     // setinstitutionId(responseDat?.institutionId);
  //     // setaddress1(responseDat?.address1);
  //     // setaddress2(responseDat?.address2);
  //     // setcity(responseDat?.city);
  //     // setstate(responseDat?.state);
  //     // setcountry(responseDat?.country);
  //     // setpincode(responseDat?.pincode);
  //     // setgooglemaplink(responseDat?.googlemaplink);
  //   } catch (error) {
  //     console.error('Error fetching User details:', error);
  //   }
  // };

  // useEffect(() => {
  //   if (CoachId) {
  //     fetchCoachDetails(CoachId);
  //   }
  // }, [CoachId]);

  // handle Open Slot Modal

  // -----------View Modal------------

  const [viewModal, setViewModal] = useState({
    open: false,
    details: null,
    completeDetails: null
  });

  const handleOpenViewModal = async (id) => {
    try {
      console.log('yha pahuche');
      setOpen(true);
      setViewModal(true);
    } catch (error) {
      console.error('Error fetching User details:', error);
    }
  };

  const handleClose = () => setOpen(false);
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
                      <Typography variant="h4">Personal Information</Typography>
                    </Grid>
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <InputLabel className="mb-2">Select Trainer</InputLabel>
                      <Select
                        autoComplete="off"
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        name="sportsgrounds"
                        fullWidth
                        value={selectTrainer}
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          setselectTrainer(selectedName);
                          const selectedId = trainerName.find((trainer) => trainer.name === selectedName)?._id;
                          console.log('selected id check-->', selectedId);
                          setselectTrainerId(selectedId);
                        }}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        error={selectTrainerError}
                        helperText={selectTrainerError && 'Trainer Name is required'}
                      >
                        {console.log('trainers list---->', trainerName)}
                        {trainerName.map((trainer) => (
                          <MenuItem key={trainer._id} value={trainer.name}>
                            {trainer.name}
                          </MenuItem>
                        ))}
                        disabled
                      </Select>
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
                              <Chip key={value} label={value} />
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
                      // onChange={(e) => {
                      //   setschoolGroundName(e.target.value);
                      //   setschoolGroundNameError(false); // Reset error when user types
                      // }}

                      onChange={(e) => {
                        const selectedName = e.target.value; // Get the selected name
                        const selectedId = schoolNames.find((name) => name.institutionName === selectedName)?._id; // Find the
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
                          setaccessPasswordError(false); // Reset error when user types
                        }}
                        required
                        value={accessPassword}
                        error={accessPasswordError}
                        helperText={accessPasswordError && 'Password is required'}
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
                    <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 3 }}>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="h4">Playing Hours (12 Hours Format Only)</Typography>
                          </Grid>

                          {/* Weekday (Monday-Friday) */}
                          {/* <Grid item xs={4}>
                            <TextField
                              autoComplete="off"
                              className="font-bold mt-7"
                              fullWidth
                              label="Weekday (Monday-Sunday)"
                              name="Weekday (Monday-Sunday)"
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
                          </Grid> */}

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
                          </Grid><br/>

                          <Grid item xs={6}>
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
                                required
                                onChange={(e) => updateWeekdayTime('from', e.target.value)}
                                error={validationError}
                                // helperText={validationError && 'Trainer Name is required'}
                              />
                              {console.log('update weekdaytume--->', updateWeekdayTime)}
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
                                required
                                onChange={(e) => updateWeekdayTime('to', e.target.value)}
                                error={validationError}
                              />
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

export default CoachAvailability;
