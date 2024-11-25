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

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GoBack from '../components/GoBack';

const SchoolDetails = () => {
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
  const [institutionid, setinstitutionId] = React.useState('');
  const [password, setpasssword] = React.useState('');
  const [schoolProfile, setschoolProfile] = React.useState('');
  const [AddRole, setAddRole] = useState('coach');
  const [certificateName, setcertificateName] = React.useState('');

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
  const [certificateNameError, setcertificateNameError] = useState(false);
  // const [organizationNameError, setorganizationNameError] = useState(false);

  const [SportsNameError, setSportsNameError] = useState(false);
  const [institutionIdError, setinstitutionIdError] = useState(false);
  const [passwordError, setpassswordError] = useState(false);
  const [Names, setNames] = useState([]);

  const [GenderError, setGenderError] = useState('');
  const [NationalityError, setNationalityError] = useState('');
  const [fileName, setFileName] = useState('');
  const [editcertifications, setEditCertifications] = useState([{ certificateName: '', organizationName: '', fileName: '', file: null }]);
  const [rating, setrating] = useState('');
  const [coachSubscriptionprice, setcoachSubscriptionprice] = useState('');
  const [ratingError, setratingError] = useState(false);
  const [coachSubscriptionpriceError, setcoachSubscriptionpriceError] = useState(false);

  const [certifications, setCertifications] = useState([]);
  const [imageaddBlobUrl, setimageaddBlogUrl] = useState([]);
  const [imageupdateBlobUrl, setimageupdateBlogUrl] = useState('');

  const [deleteCertificateDetailsIdd, setdeleteCertificateDetailsId] = useState('');
  const [location, setLocation] = useState({
    city: '',
    state: '',
    country: '',
    error: ''
  });
  const { id } = useParams();

  const handleFileChangeUpdate = (e, index) => {
    const files = e.target.files;
    const imageurl = URL.createObjectURL(files[0]);
    setimageupdateBlogUrl(imageurl);

    setEditCertifications((prevState) =>
      prevState.map((certification, i) =>
        i === index ? { ...certification, fileName: formatFileName(files[0]?.name), file: files[0], imageurl: imageurl } : certification
      )
    );
  };

  const handleFileChange = (e, index) => {
    const files = e.target.files;
    // console.log('image blob url add new image--->',files[0])
    const imageurl = URL.createObjectURL(files[0]);
    let CertificateImage = [...imageaddBlobUrl];
    CertificateImage[index] = imageurl;
    setimageaddBlogUrl(CertificateImage);

    console.log('imagebloburl--->', imageaddBlobUrl);

    console.log('image k blog url--->', imageurl);
    console.log('File change:', files);
    setCertifications((prevState) =>
      prevState.map((certification, i) =>
        i === index ? { ...certification, fileName: formatFileName(files[0]?.name), file: files[0] } : certification
      )
    );
  };

  const addCertification = () => {
    setCertifications((prevState) => [...prevState, { certificateName: '', organizationName: '', fileName: '', file: null }]);
  };

  const EditremoveCertification = (index) => {
    const certificateDetailstoDelete = editcertifications[index];

    console.log('certification k count delete m pta h--->', editcertifications.length);
    if (certificateDetailstoDelete._id) {
      setdeleteCertificateDetailsId((prevIds) => [...prevIds, certificateDetailstoDelete._id]);
    }
    setEditCertifications((prevState) => prevState.filter((_, i) => i !== index));
  };
  const removeCertification = (index) => {
    setCertifications((prevState) => prevState.filter((_, i) => i !== index));
  };

  const formatFileName = (name) => {
    const parts = name.split(' ');
    const firstPart = parts[0];
    console.log('file k nbame firstpart--->', firstPart);
    if (firstPart.length > 10) {
      console.log('firstPart.slice(0, 10) + ', firstPart.slice(0, 10) + '...');
      return firstPart?.slice(0, 10) + '...';
    } else {
      console.log('firstname--->', firstPart);
      return firstPart;
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

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${server}/api/admin/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Assuming your raw body response is plain text
      const responseDataCart = response.data;
      const responseData = response.data.data;
      console.log('This is view response data', responseData);

      setfirstName(responseData.firstname);
      setlastName(responseData.lastname);
      setGender(responseData.gender);
      setNationality(responseData.nationality);
      setrating(responseData?.coachRating);
      setcoachSubscriptionprice(responseData?.coachSubscriptionprice);

      // setweekdayfrom('');
      setaddress1(responseData.address1);
      setaddress2(responseData.address2);
      setcity(responseData.city);
      setstate(responseData.state);
      setcountry(responseData.country);
      setpincode(responseData.pincode);
      //   setinstitutionemailId(responseData.institutionId);
      setcontactpersonName(responseData.firstname);
      let phoneNumber = responseData?.phoneNumber;
      if (phoneNumber.startsWith('91')) {
        phoneNumber = phoneNumber?.slice(2);
      }
      setPhonenumber(responseData.phoneNumber);
      setEmailId(responseData.email);
      setExperience(responseData.yearsOfExperience);
      setExperienceDescription(responseData.description);
      const sportnameTemp = await responseData.sportsgrounds;
      console.log('sports ke names--->,', responseData.sportsgrounds);
      // console.log("this is sportnameTop varialbe ",sportnameTemp)
      setSportsName(sportnameTemp);
      setinstitutionId(responseData.institutionId);
      //   setpasssword('');
      //   setNames([]);
      // setCertifications(responseData.certificates);
      setEditCertifications(responseData.certificates);
      setLocation({
        city: responseData.city,
        state: responseData.state,
        country: responseData.country,
        error: ''
      });
      // Adjust this logic based on the actual format of your raw body response
      // For example, if your response is plain text, you might display it directly
    } catch (error) {
      console.error('Error fetching User details:', error);
    }
  };

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
    fetchUsers();
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    let formattedPhoneNumber = Phonenumber;
    let phoneNumberWithoutPrefix = formattedPhoneNumber;
    const token = localStorage.getItem('token');
    if (formattedPhoneNumber.startsWith('91')) {
      phoneNumberWithoutPrefix = formattedPhoneNumber?.slice(2);
    }

    // Validate the length of the phone number (excluding '91' prefix)
    if (phoneNumberWithoutPrefix.length !== 10) {
      setPhonenumberError(true);
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      // !password.trim() ||
      // !Phonenumber.trim() ||
      !EmailId.trim() ||
      !Gender.trim() ||
      !Nationality.trim() ||
      // !weekdayfrom.trim() ||
      // !schoolProfile.trim() ||
      !Gender.trim() ||
      !address1.trim() ||
      // !address2.trim() ||
      !city.trim() ||
      !state.trim() ||
      !country.trim() ||
      !pincode.trim() ||
      // !weekdayto.trim() ||
      // !Experience.trim() ||
      sportsName.length === 0 || // Check if sportsName is empty
      !ExperienceDescription.trim() ||
      !coachSubscriptionprice.trim() ||
      !rating.trim()
      // !institutionemailId.trim() ||
      // !contactpersonName.trim() ||
      // !Phonenumber.trim() ||
      // !userName.trim() ||
      // !password.trim()
    ) {
      setfirstNameError(!firstName.trim());
      setlastNameError(!lastName.trim());
      // setpassswordError(!password.trim());
      setratingError(!rating.trim());
      setcoachSubscriptionpriceError(!coachSubscriptionprice.trim());
      // setPhonenumber(!Phonenumber.trim())
      setGenderError(!Gender.trim());
      setNationalityError(!Nationality.trim());

      // setweekdayfrom(!weekdayfrom.trim());
      // setweekdayto(!weekdayto.trim());
      // setschoolProfileError(!schoolProfile.trim());
      setAddress1Error(!address1.trim());
      // setAddress2Error(!address2.trim());
      setCityError(!city.trim());
      setCountryError(!country.trim());
      setStateError(!state.trim());
      setPincodeError(!pincode.trim());
      setInstitutionEmailIdError(!institutionemailId.trim());
      setContactPersonNameError(!contactpersonName.trim());
      setPhonenumberError(!Phonenumber.trim());
      setEmailIdError(!EmailId.trim());
      // setExperienceError(!Experience.trim());
      setExperienceDescriptionError(!ExperienceDescription.trim());
      setSportsNameError(sportsName.length === 0); // Set error if sportsName is empty
      // setuserNameError(!userName.trim());
      // setpassswordError(!password.trim());

      // if (passwordError || !password) {
      //   return;
      // }
      toast.error('All Fields are required');
      return;
    }

    if (!token) {
      // If no token is found, redirect to the login page
      navigate('/');
    } else {
      const formData = new FormData();
      formData.append('role', AddRole);
      formData.append('firstname', firstName);
      formData.append('lastname', lastName);
      let formattedPhoneNumber = Phonenumber;
      if (!formattedPhoneNumber.startsWith('91')) {
        formattedPhoneNumber = '91' + formattedPhoneNumber;
      }
      formData.append('phoneNumber', formattedPhoneNumber);
      formData.append('email', EmailId);
      formData.append('gender', Gender);
      formData.append('coachRating', rating);
      formData.append('nationality', Nationality);
      formData.append('address1', address1);
      formData.append('address2', address2);
      formData.append('city', city);
      formData.append('state', state);
      formData.append('pincode', pincode);
      formData.append('country', country);
      formData.append('yearsOfExperience', Experience);
      sportsName.forEach((sports) => {
        formData.append(`sportsgrounds`, sports);
      });
      formData.append('description', ExperienceDescription);
      console.log('certifications formdadta m--->', certifications);
      console.log('edit certification', editcertifications);

      editcertifications.forEach((certification, index) => {
        if (certification.file) {
          formData.append('certificateId', certification._id);
          formData.append(`certificateName`, certification.certificateName);
          formData.append(`organizationName`, certification.organizationName);
          console.log('certification file name--->', certification.fileName);
          // if (certification.file) {
          // formData.append('certificateId', certification._id);
          formData.append(`certificates`, certification.file);
          // }
        }
      });

      if (deleteCertificateDetailsIdd) {
        deleteCertificateDetailsIdd.forEach((id) => {
          formData.append('deleteCertificate', id);
        });
      }

      certifications.forEach((certification, index) => {
        console.log('isme check kiya certifications--->', certification);
        if (certification.file) {
          //  formData.append('certificateId', certification._id);
          formData.append(`addCertificateName`, certification.certificateName);
          formData.append(`addOrganizationName`, certification.organizationName);
          console.log('certification file name--->', certification.fileName);
          formData.append(`addCertificates`, certification.file);
          // formData.append('deleteCertificate', certificatixon._id);
        }
        // formData.append(`certificates`, certificates);
      });

      console.log('this is formData', formData);

      try {
        const response = await axios.put(`${server}/api/admin/update/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/json',

            Authorization: `Bearer ${token}`,
            password: password
          }
        });
        if (response.data) {
          // console.log('response data update k liye--->', response.data);
          toast('Coach Updaed Successfully');
          // console.log('Coach added:', response.data);
          // console.log('This is the token', token);
        }
      } catch (error) {
        // toast.error('Error Submitting details', error);
        toast.error(error.response.data.message);
        console.log('Error uploading file:', error);

        document.getElementById('SchoolForm').reset();
      } finally {
      }
    }
  };

  function stringIntoArray(value) {
    // console.log("this is value", value)
    let output = value[0].split(',');
    // console.log('this is outpou', output)
    return output;
  }

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
      <div>
        <form
          id="SchoolForm"
          className="space-y-4"
          
        
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
            
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
                    <Grid item xs={6} className="flex">
                      <GoBack />
                      <Typography variant="h4">Personal Information</Typography>
                    </Grid>
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <TextField
                        autoFocus
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => {
                          setfirstName(e.target.value);
                          setfirstNameError(false); // Reset error when user types
                        }}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        required
                        error={firstNameError}
                        helperText={firstNameError && 'First Name is required'}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        autoFocus
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                        value={lastName}
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
                        autoFocus
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        label="Mobile Number"
                        name="Phonenumber"
                        // variant="filled"
                        value={Phonenumber}
                        onChange={(e) => {
                          setPhonenumber(e.target.value);
                          setPhonenumberError(false); // Reset error when user types
                        }}
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
                        autoFocus
                        className="email"
                        type="email"
                        fullWidth
                        label="Email Id"
                        name="EmailId"
                        value={EmailId}
                        onChange={(e) => {
                          const email = e.target.value;
                          setEmailId(email);
                          setEmailIdError(false); // Reset error when user types
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
                        style={{ marginBottom: 3 }}
                        name="gender"
                        id="gender"
                        // label="Gender"
                        value={Gender}
                        error={GenderError}
                        onChange={(e) => {
                          setGender(e.target.value);
                          setGenderError(false); // Reset error when user types
                        }}
                        helperText={GenderError && 'Select a valid email address'}
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
                        autoFocus
                        autocomplete="off"
                        className="textfields"
                        fullWidth
                        // label="Nationality"
                        name="nationality"
                        value={Nationality}
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
                        value={rating}
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
                        value={coachSubscriptionprice}
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
                        <InputLabel className="mb-2">Password</InputLabel>
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

          <Grid item xs={12} md={12}>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Address Information</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      autoFocus
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      label="Address line 1"
                      name="address1"
                      value={address1}
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
                      autoFocus
                      value={address2}
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
                      autoFocus
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
                      autoFocus
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
                      helperText={StateError && 'State is required'}
                      variant="outlined"
                      size="small"
                      sx={{ width: '100%' }}
                      disabled
                    />
                  </Grid>

                  {/* pincode */}

                  <Grid item xs={6}>
                    <TextField
                      autoFocus
                      autocomplete="off"
                      type="number"
                      fullWidth
                      label="Pincode"
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
                    <TextField
                      autoFocus
                      autocomplete="off"
                      className="textfields"
                      fullWidth
                      label="Country"
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
                      autoFocus
                      autocomplete="off"
                      className="textfields"
                      type="number"
                      fullWidth
                      // label="Years of coaching experience"
                      name="Experience"
                      value={Experience}
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
                      // sx={{ width: '100%', height: '38px' }}
                      //   input={<OutlinedInput id="select-multiple-chip" label="Sports Name" />}
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
                      autoFocus
                      size="lg"
                      fullWidth
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300   focus:outline-none dark:placeholder-gray-400 dark:text-black"
                      id="large-input"
                      value={ExperienceDescription}
                      onChange={(e) => {
                        setExperienceDescription(e.target.value);
                        setExperienceDescriptionError(false); // Reset error when user types
                      }}
                      error={ExperienceDescriptionError}
                      helperText={ExperienceDescriptionError && 'Experience brief is required'}
                      variant="outlined"
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
                    <Typography variant="h4">Certifications</Typography>
                  </Grid>

                  {editcertifications.map((certification, index) => (
                    <React.Fragment key={index}>
                      <Grid item xs={3}>
                        <Typography variant="h7" className="mb-2">
                          Certification Name
                        </Typography>
                        <TextField
                          autoFocus
                          autoComplete="off"
                          className="textfields"
                          fullWidth
                          name="certificateName"
                          value={certification.certificateName}
                          onChange={(e) => {
                            setEditCertifications((prevState) =>
                              prevState.map((cert, i) => (i === index ? { ...cert, certificateName: e.target.value } : cert))
                            );
                          }}
                          required
                          variant="outlined"
                          size="small"
                          sx={{ width: '100%' }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="h7" className="mb-2">
                          Certifying Organisation
                        </Typography>
                        <TextField
                          autoFocus
                          autoComplete="off"
                          className="textfields"
                          fullWidth
                          name="organizationName"
                          value={certification.organizationName}
                          onChange={(e) => {
                            setEditCertifications((prevState) =>
                              prevState.map((cert, i) => (i === index ? { ...cert, organizationName: e.target.value } : cert))
                            );
                          }}
                          required
                          variant="outlined"
                          size="small"
                          sx={{ width: '100%' }}
                        />
                      </Grid>
                      {(certification.imageurl || certification.certificateUrl) && (
                        <Grid item xs={2}>
                          <img
                            alt="Uploaded Image"
                            className="aspect-[4/3] w-full rounded-lg object-cover"
                            height={180}
                            src={certification.imageurl || certification.certificateUrl}
                            width={240}
                          />
                          {console.log('imageupdateblogurl--->', imageupdateBlobUrl)}
                        </Grid>
                      )}

                      <Grid item xs={2}>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id={`file-input-${index}`}
                          type="file"
                          onChange={(e) => handleFileChangeUpdate(e, index)}
                        />
                        <label htmlFor={`file-input-${index}`}>
                          <Button
                            component="span"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '250px' }}
                          >
                            {certification.fileName ? certification.fileName : 'Change file'}
                          </Button>
                        </label>
                      </Grid>
                      <Grid item xs={2}>
                        <Button onClick={() => EditremoveCertification(index)} className="bg-yellow-500 text-white w-[100px]">
                          Remove
                        </Button>
                      </Grid>
                    </React.Fragment>
                  ))}

                  {certifications.map((certification, index) => (
                    <React.Fragment key={index}>
                      <Grid item xs={3}>
                        <TextField
                          autoComplete="off"
                          className="textfields"
                          fullWidth
                          label="Certification Name"
                          name="certificateName"
                          value={certification.certificateName}
                          onChange={(e) => {
                            setCertifications((prevState) =>
                              prevState.map((cert, i) => (i === index ? { ...cert, certificateName: e.target.value } : cert))
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
                          name="organizationName"
                          value={certification.organizationName}
                          onChange={(e) => {
                            setCertifications((prevState) =>
                              prevState.map((cert, i) => (i === index ? { ...cert, organizationName: e.target.value } : cert))
                            );
                          }}
                          required
                          variant="outlined"
                          size="small"
                          sx={{ width: '100%' }}
                        />
                      </Grid>

                      {imageaddBlobUrl ? (
                        <Grid item xs={2}>
                          <img
                            alt="Uploaded Image"
                            className="aspect-[4/3] w-full rounded-lg object-cover"
                            height={180}
                            src={imageaddBlobUrl[index]}
                            width={240}
                          />
                        </Grid>
                      ) : (
                        <></>
                      )}

                      <Grid item xs={2}>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id={`file-input-new-${index}`}
                          type="file"
                          onChange={(e) => handleFileChange(e, index)}
                        />
                        <label htmlFor={`file-input-new-${index}`}>
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
                      <Grid item xs={2}>
                        <Button onClick={() => removeCertification(index)} className="bg-yellow-500 text-white w-[100px]">
                          Remove
                        </Button>
                      </Grid>
                    </React.Fragment>
                  ))}

                  <Grid item xs={3}>
                    <Button onClick={addCertification} className="bg-yellow-500 text-white w-[100px]">
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Login Credentials */}

          {/* <Grid item xs={12} md={12}>
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
                      label="Instituion Id"
                      name="institutionId"
                      onChange={(e) => {
                        setinstitutionId(e.target.value);
                        setinstitutionIdError(false); // Reset error when user types
                      }}
                      required
                      error={institutionIdError}
                      helperText={institutionIdError && 'Institution Id is required'}
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
          </Grid> */}

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
        </form>
      </div>
    </Container>
  );
};

export default SchoolDetails;
