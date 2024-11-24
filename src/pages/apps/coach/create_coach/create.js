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
import { Stack, height, padding, width } from '@mui/system';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { Textarea } from '@material-tailwind/react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

const SchoolDetails = () => {
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
  const [contactpersonName, setcontactpersonName] = useState('');
  const [Phonenumber, setPhonenumber] = useState('');
  const [EmailId, setEmailId] = useState('');
  const [Experience, setExperience] = useState('');
  const [ExperienceDescription, setExperienceDescription] = useState('');
  const [sportsName, setSportsName] = React.useState([]);
  const [userName, setuserName] = React.useState('');
  const [password, setpasssword] = React.useState('');
  const [schoolProfile, setschoolProfile] = React.useState('');
  const [AddRole, setAddRole] = useState('coach');
  const [CertificationName, setCertificationName] = React.useState('');

  const [CertifyingOrg, setCertifyingOrg] = React.useState('');

  const [firstNameError, setfirstNameError] = useState(false);
  const [lastNameError, setlastNameError] = useState(false);
  const [schoolProfileError, setschoolProfileError] = useState(false);
  const [address1Error, setAddress1Error] = useState(false);
  const [address2Error, setAddress2Error] = useState(false);
  const [CityError, setCityError] = useState(false);
  const [StateError, setStateError] = useState(false);
  const [CountryError, setCountryError] = useState(false);
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
  const [userNameError, setuserNameError] = useState(false);
  const [passwordError, setpassswordError] = useState(false);
  const [Names, setNames] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [weekdayfrom, setweekdayfrom] = useState('');
  const [weekdayfromtime, setweekdayfromtime] = useState('');
  const [weekdayto, setweekdayto] = useState('');
  const [weekdaytotime, setweekdaytotime] = useState('');
  const [weekdayfromError, setweekdayfromError] = useState('');
  const [weekdaytoError, setweekdaytoError] = useState('');
  const [GenderError, setGenderError] = useState('');
  const [NationalityError, setNationalityError] = useState('');
  const [fileName, setFileName] = useState('');
  const [rating, setrating] = useState('');
  const [coachSubscriptionprice, setcoachSubscriptionprice] = useState('');
  const [ratingError, setratingError] = useState(false);
  const [coachSubscriptionpriceError, setcoachSubscriptionpriceError] = useState(false);

 const [accessPassword, setaccessPassword] = useState('')
 const [accessPasswordError, setaccessPasswordError] = useState('')

  const [certifications, setCertifications] = useState([{ CertificationName: '', CertifyingOrg: '', fileName: '', file: null }]);
  const [location, setLocation] = useState({
    city: '',
    state: '',
    country: '',
    error: ''
  });
  // const validNumberPattern = /^[1-9]*$/;

  const handleFileChange = (e, index) => {
    const files = e.target.files;
    setCertifications((prevState) =>
      prevState.map((certification, i) =>
        i === index ? { ...certification, fileName: formatFileName(files[0].name), file: files[0] } : certification
      )
    );
  };

  const addCertification = () => {
    setCertifications([...certifications, { CertificationName: '', CertifyingOrg: '', fileName: '', file: null }]);
  };

  const removeCertification = (index) => {
    setCertifications((prevState) => prevState.filter((_, i) => i !== index));
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setFileName(formatFileName(file.name));
  //     // setFileName(file.name);
  //   } else {
  //     setFileName('');
  //   }
  // };

  const formatFileName = (name) => {
    const parts = name.split(' ');
    const firstPart = parts[0];
    console.log('file k nbame firstpart--->', firstPart);
    if (firstPart.length > 10) {
      console.log('firstPart.slice(0, 10) + ', firstPart.slice(0, 10) + '...');
      return firstPart.slice(0, 10) + '...';
    } else {
      console.log('firstname--->', firstPart);
      return firstPart;
    }
  };
  const server = process.env.REACT_APP_API_URL;

  let weekdays = ['Monday', 'TuesDay', 'Wednesday', 'Thursday', 'Friday'];

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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Phonenumber.length !== 10) {
      console.log('phone number length-->', Phonenumber.length);
      setPhonenumberError(true);
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    // Check if required fields are empty
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      // !Phonenumber.trim() ||
      !EmailId.trim() ||
      !Gender.trim() ||
      !Nationality.trim() ||
      // !weekdayfrom.trim() ||
      // !schoolProfile.trim() ||
      !address1.trim() ||
      // !address2.trim() ||
      // !city.trim() ||
      // !state.trim() ||
      // !country.trim() ||
      !pincode.trim() ||
      // !weekdayto.trim() ||
      !Experience.trim() ||
      sportsName.length === 0 || // Check if sportsName is empty
      !ExperienceDescription.trim() ||
      !coachSubscriptionprice.trim() ||
      !rating.trim() ||
      // !institutionemailId.trim() ||
      // !contactpersonName.trim() ||
      // !Phonenumber.trim() ||
      // !userName.trim() ||
      !password.trim()
    ) {
      setfirstNameError(!firstName.trim());
      setlastNameError(!lastName.trim());
      setratingError(!rating.trim());
      setcoachSubscriptionpriceError(!coachSubscriptionprice.trim());
      // setPhonenumber(!Phonenumber.trim())
      setGenderError(!Gender.trim());
      setNationalityError(!Nationality.trim());

      // setweekdayfrom(!weekdayfrom.trim());
      // setweekdayto(!weekdayto.trim());
      // setschoolProfileError(!schoolProfile.trim());
      setAddress1Error(!address1.trim());
      setAddress2Error(!address2.trim());
      // setCityError(!city.trim());
      // setCountryError(!country.trim());
      // setStateError(!state.trim());
      setPincodeError(!pincode.trim());
      setInstitutionEmailIdError(!institutionemailId.trim());
      setContactPersonNameError(!contactpersonName.trim());
      setPhonenumberError(!Phonenumber.trim());
      setEmailIdError(!EmailId.trim());
      setExperienceError(!Experience.trim());
      setExperienceDescriptionError(!ExperienceDescription.trim());
      setSportsNameError(sportsName.length === 0); // Set error if sportsName is empty
      // setuserNameError(!userName.trim());
      setpassswordError(!password.trim());

      if (passwordError || !password) {
        return;
      }

      toast.error('All Fields are required');

      console.log(
        'data--->',
        firstName,
        lastName,
        Phonenumber,
        EmailId,
        Gender,
        Nationality,
        address1,
        address2,
        city,
        state,
        pincode,
        country,
        Experience,
        sportsName,
        ExperienceDescription,
        CertificationName,
        CertifyingOrg,
        certifications,
        // userName,
        password
      );
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
      navigate('/');
    } else {
      // const temp = {
      //   weekdayfrom: weekdayfrom,
      //   weekdayfromtime: weekdayfromtime,
      //   weekdayto: weekdayto,
      //   weekdaytotime: weekdaytotime
      // };

      //  const temp = certifications.map((certification) => ({
      //  certificateName: certification.CertificationName,
      //  organizationName: certification.CertifyingOrg,
      //  certificates: certification.fileName // Assuming you want to send the file name
      //  }));
      const formData = new FormData();
      certifications?.forEach((certification, index) => {
        formData.append(`certificateName`, certification.CertificationName);
        formData.append(`organizationName`, certification.CertifyingOrg);
        formData.append(`certificates`, certification.file);
      });
      console.log('certification m kya h--->', certifications);

      // const tempString = JSON.stringify(temp);
      console.log('phone number dedkho jra--->', Phonenumber);

      formData.append('role', AddRole);
      formData.append('coachSubscriptionprice', coachSubscriptionprice);
      formData.append('firstname', firstName);
      formData.append('lastname', lastName);
      formData.append('phoneNumber', '91' + Phonenumber);
      formData.append('email', EmailId);
      formData.append('gender', Gender);
      formData.append('coachRating', rating);
      formData.append('nationality', Nationality);
      formData.append('address1', address1);
      formData.append('address2', address2);
      formData.append('city', location.city);
      formData.append('state', location.state);
      formData.append('pincode', pincode);
      formData.append('country', location.country);

      formData.append('yearsOfExperience', Experience);
      // console.log('sportsground--->', sportsground);
       sportsName?.forEach((sports) => {
         formData.append(`sportsgrounds`, sports);
        
       });
      // formData.append('sportsgrounds', sportsName);
      formData.append('description', ExperienceDescription);

      // formData.append('userName', userName);
      formData.append('password', password);

      try {
        const response = await axios.post(`${server}/api/admin/create`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            "password": accessPassword,
            // token: token
          }
        });
        if (response.data) {
          console.log('Coach added:', response.data);
          toast('Coach added Successfully');
          document.getElementById('SchoolForm').reset();
          // setschoolProfile('');
          // setSelectedFile('');
          setfirstName('');
          setlastName('');
          setGender('');
          setNationality('');
          // setweekdayfrom('');
          setaddress1('');
          setaddress2('');
          setcity('');
          setstate('');
          setcountry('');
          setpincode('');
          setinstitutionemailId('');
          setcontactpersonName('');
          setPhonenumber('');
          setEmailId('');
          setExperience('');
          setExperienceDescription('');
          setSportsName([]);
          // setuserName('');
          setpasssword('');
          setNames([]);
          setCertifications([]);
          console.log('This is the token', token);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
        console.log('Error uploading file:', error?.response?.data?.message);
      } finally {
        // console.log('Clearing the data...');
        // document.getElementById('SchoolForm').reset();
      }
    }
  };

  const handlePhoneNumberChange = (e) => {
    const enteredValue = e.target.value;
    const validNumberPattern = enteredValue.split('').every((char) => char >= '0' && char <= '9');
    if (validNumberPattern || enteredValue === '') {
      setPhonenumber(enteredValue);
      setPhonenumberError(false); // Reset error when user types a valid number
    } else {
      setPhonenumberError(true); // Set error when the input is not valid
    }
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
                    {/* <Grid item xs={6}>
                      <Select
                        name="role"
                        id="role"
                        value={AddRole}
                        onChange={(e) => setAddRole(e.target.value)}
                        defaultValue="coach"
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      >
                        {console.log('Role check-->', AddRole)}
                        <MenuItem value="coach" name="role">
                          coach
                        </MenuItem>
                      </Select>
                    </Grid> */}

                    <Grid item xs={6}>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        label="First Name"
                        name="firstName"
                        // onChange={(e) => setfirstName(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        onChange={(e) => {
                          setfirstName(e.target.value);
                          setfirstNameError(false); // Reset error when user types
                        }}
                        required
                        error={firstNameError}
                        helperText={firstNameError && 'First Name is required'}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        onChange={(e) => {
                          setlastName(e.target.value);
                          setlastNameError(false); // Reset error when user types
                        }}
                        required
                        error={lastNameError}
                        helperText={lastNameError && 'Last Name is required'}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        autocomplete="off"
                        className="number"
                        fullWidth
                        label="Mobile Number"
                        name="Phonenumber"
                        onChange={handlePhoneNumberChange}
                        value={Phonenumber}
                        required
                        error={PhonenumberError}
                        helperText={PhonenumberError && 'Mobile Number is required'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        autoComplete="off"
                        className="email"
                        type="email"
                        fullWidth
                        label="Email Id"
                        name="EmailId"
                        onChange={(e) => {
                          const email = e.target.value;
                          setEmailId(email);
                          setEmailIdError(false); // Reset error when user types
                          const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                          if (!isValidEmail) {
                            setEmailIdError(true);
                          }
                        }}
                        required
                        error={EmailIdError}
                        helperText={EmailIdError && 'Enter a valid email address'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <InputLabel htmlFor="gender" sx={{ marginBottom: 1 }}>
                        Gender
                      </InputLabel>
                      <Select
                        // style={{ marginBottom: 3 }}
                        name="gender"
                        id="gender"
                        // label="Gender"
                        value={Gender}
                        error={GenderError}
                        onChange={(e) => {
                          setGender(e.target.value);
                          setGenderError(false); // Reset error when user types
                        }}
                        helperText={GenderError && 'Select a valid Gender'}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      >
                        <MenuItem value="Male" name="Male">
                          Male
                        </MenuItem>
                        <MenuItem value="Female" name="Female">
                          Female
                        </MenuItem>
                      </Select>
                    </Grid>

                    <Grid item xs={6}>
                      <InputLabel htmlFor="gender" sx={{ marginBottom: 1 }}>
                        Nationality
                      </InputLabel>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        // label="Nationality"
                        name="nationality"
                        onChange={(e) => {
                          setNationality(e.target.value);
                          setNationalityError(false); // Reset error when user types
                        }}
                        required
                        error={NationalityError}
                        helperText={NationalityError && 'Nationality is required'}
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
                          const value = e.target.value;
                          if (value >= 0 && value <= 5) {
                            setrating(value);
                            setratingError(false); // Reset error when user types within range
                          }
                        }}
                        required
                        error={ratingError}
                        helperText={ratingError && 'Rating is required and must be between 0 and 5'}
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, max: 5 }}
                        sx={{ width: '100%' }}
                      />
                    </Grid>

                    {/* Coach Subscription Price */}

                    <Grid item xs={6}>
                      <TextField
                        autocomplete="off"
                        className="textfields"
                        type="number"
                        fullWidth
                        label="Enter Subscription Price"
                        name="coachSubscriptionprice"
                        onChange={(e) => {
                          setcoachSubscriptionprice(e.target.value);
                          setcoachSubscriptionpriceError(false); // Reset error when user types
                        }}
                        required
                        error={coachSubscriptionpriceError}
                        helperText={coachSubscriptionpriceError && 'Coach Subscription Price is required'}
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
          </Grid>

          <Grid item xs={12} md={12}>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Address Information</Typography>
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
                        setAddress2Error(false); // Reset error when user types
                      }}
                      required
                      error={address2Error}
                      helperText={address2Error && 'Address is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel sx={{ marginBottom: 1 }}>City</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      // label="City"
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
                    <InputLabel sx={{ marginBottom: 1 }}>State</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      // label="State"
                      name="state"
                      value={location.state}
                      onChange={(e) => {
                        setstate(e.target.value);
                        setStateError(false); // Reset error when user types
                      }}
                      required
                      error={StateError}
                      helperText={StateError && 'State is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                      disabled
                    />
                  </Grid>

                  {/* pincode */}

                  <Grid item xs={6}>
                    <InputLabel sx={{ marginBottom: 1 }}>Pincode</InputLabel>
                    <TextField
                      autocomplete="off"
                      type="number"
                      fullWidth
                      // label="Pincode"
                      name="pincode"
                      // onChange={(e) => {
                      //   setpincode(e.target.value);
                      //   setPincodeError(false); // Reset error when user types
                      // }}
                      required
                      onChange={handlePincodeChange}
                      error={PincodeError}
                      helperText={PincodeError && 'Pincode is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel sx={{ marginBottom: 1 }}>Country</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      // label="Country"
                      name="country"
                      value={location.country}
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
                    <Typography variant="h4">Experience and Background</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel className="mb-2">Years of coaching experience</InputLabel>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      type="number"
                      fullWidth
                      // label="Years of coaching experience"
                      name="Experience"
                      onChange={(e) => {
                        setExperience(e.target.value);
                        setExperienceError(false); // Reset error when user types
                      }}
                      required
                      error={ExperienceError}
                      helperText={ExperienceError && 'Experience is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
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

                  {/* Brief Experience */}
                  <Grid item xs={12}>
                    <InputLabel className="mb-2">Please provide a brief summary of your coaching experience</InputLabel>

                    {/* <TextField type="text" fullWidth id="large-input" class="block w-full p-4 border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:focus:ring-blue-50" style={{height:'20vh'}}/> */}
                    <textarea
                      size="lg"
                      fullWidth
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300   focus:outline-none dark:placeholder-gray-400 dark:text-black"
                      id="large-input"
                      onChange={(e) => {
                        setExperienceDescription(e.target.value);
                        setExperienceDescriptionError(false); // Reset error when user types
                      }}
                      // required
                      error={ExperienceDescriptionError}
                      helperText={ExperienceDescriptionError && 'Experience brief is required'}
                      variant="outlined"
                      // sx={{padding:'20px'}}
                      style={{ paddingLeft: '5px', height: '30vh' }}

                      // other props
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Certifications */}

          <Grid item xs={12} md={12}>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Certificatons</Typography>
                  </Grid>

                  {/* <Grid container spacing={3}> */}
                  {certifications.map((certification, index) => (
                    <React.Fragment key={index}>
                      <Grid item xs={3}>
                        <TextField
                          autoComplete="off"
                          className="textfields"
                          fullWidth
                          label="Certification Name"
                          name="CertificationName"
                          value={certification.CertificationName}
                          onChange={(e) => {
                            setCertifications((prevState) =>
                              prevState.map((cert, i) => (i === index ? { ...cert, CertificationName: e.target.value } : cert))
                            );
                          }}
                          required
                          variant="outlined"
                          size="small"
                          sx={{ width: '100%' }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          autoComplete="off"
                          className="textfields"
                          fullWidth
                          label="Certifying Organisation"
                          name="CertifyingOrg"
                          value={certification.CertifyingOrg}
                          onChange={(e) => {
                            setCertifications((prevState) =>
                              prevState.map((cert, i) => (i === index ? { ...cert, CertifyingOrg: e.target.value } : cert))
                            );
                          }}
                          required
                          variant="outlined"
                          size="small"
                          sx={{ width: '100%' }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id={`file-input-${index}`}
                          type="file"
                          onChange={(e) => handleFileChange(e, index)}
                        />
                        <label htmlFor={`file-input-${index}`}>
                          <Button
                            component="span"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            style={{
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              maxWidth: '250px',
                              border: '2px solid'
                            }}
                          >
                            {certification.fileName ? certification.fileName : 'Upload file'}
                          </Button>
                        </label>
                      </Grid>
                      <Grid item xs={3}>
                        <Button onClick={() => removeCertification(index)} className="bg-yellow-500  text-white w-[100px]">
                          Remove
                        </Button>
                      </Grid>
                    </React.Fragment>
                  ))}
                  <Grid item xs={3}>
                    <Button onClick={addCertification} className="bg-yellow-500  text-white w-[100px]">
                      Add
                    </Button>
                  </Grid>
                </Grid>
                {/* </Grid> */}
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

                  <Grid item xs={6}>
                    <TextField
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      label="Mobile Number"
                      name="Phonenumber"
                      onChange={handlePhoneNumberChange}
                      value={Phonenumber}
                      required
                      error={PhonenumberError}
                      helperText={PhonenumberError && 'Mobile Number is required'}
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
