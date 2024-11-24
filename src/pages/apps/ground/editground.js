import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Card,
  CardContent,
  Tooltip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  IconButton
} from '@mui/material';

import {
  Box,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  Paper,
  TableContainer
} from '@mui/material';
import Chip from '@mui/material/Chip';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { PopupTransition } from '../../../../components/@extended/Transitions';
import { PopupTransition } from '../../../components/@extended/Transitions';

import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GoBack from '../components/GoBack';

const server = process.env.REACT_APP_API_URL;

const Editground = () => {
  const [EditschoolgroundName, setEditschoolgroundName] = useState();

  const [EditInstitutionId, setEditInstitutionId] = useState();
  const [Editprice, setEditprice] = useState('');
  const [priceError, setpriceError] = useState(false);
  const [locationError, setlocationError] = useState(false);
  const [ratingError, setratingError] = useState(false);
  const [Editrating, setEditrating] = useState();
  const [Editaddress1, setEditaddress1] = useState();
  const [Editaddress2, setEditaddress2] = useState();
  const [Editcity, setEditcity] = useState();
  const [Editstate, setEditstate] = useState();
  const [Editcountry, setEditcountry] = useState();
  const [editPincode, seteditPincode] = useState();
  const [Editlocation, setEditlocation] = useState();
  const [schoolgroundId, setschoolGroundId] = useState('');
  const [EditschoolgroundNameError, setEditschoolgroundNameError] = useState(false);
  const [schoolNames, setschoolNames] = useState([]);
  const [schoolGroundName, setschoolGroundName] = useState('');
  // const [Names, setNames] = useState([]);
  const [images, setImages] = useState([]);
  const [ImageId, setImageId] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [slotopen, setslotopen] = useState(false);

  // const [timetableData, setTimetableData] = useState([]);
  const [institutionIdError, setinstitutionIdError] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [imageFiles, setImageFiles] = useState({});
  const [imageIdsToDelete, setImageIdsToDelete] = useState([]);
  const [AmenitiesError, setAmenitiesError] = useState(false);
  const [sportsName, setSportsName] = React.useState([]);
  const [SportsNameError, setSportsNameError] = useState(false);
  const [Names, setNames] = useState([]);
    const [password, setPassword] = useState('');

  const { id } = useParams();

  const fileInputRefs = useRef([]);

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


  const [timetableData, setTimetableData] = useState(timetable);
  const handleEditClick = (index) => {
    
    fileInputRefs.current[index].click();
  };

  const handleImageChange = (event, id, index) => {
    const file = event.target.files[0];
    // console.log('file change huiii image--->', file);
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create URL for display
      console.log('imageurl--->', imageUrl);

      const updatedImages = images.map((img, idx) =>
        (id !== undefined && img._id === id) || (id === undefined && idx === index)
          ? { ...img, imageUrl: imageUrl, file: file } // Use imageUrl for display
          : img
      );
      // console.log('image updated change-->', updatedImages);

      setImages(updatedImages);
      setImageFiles((prevFiles) => ({
        ...prevFiles,
        [id !== undefined ? id : index]: file
      }));

      // Update the imageId state if the current image is being updated
      if (ImageId === (id !== undefined ? id : index)) {
        setImageId(id !== undefined ? id : index);
      }
    }
  };

  const handleDeleteImage = (index) => {
    const imageToDelete = images[index];

    // console.log('images k count delete m pta h--->', images.length);
    if (imageToDelete._id) {
      setImageIdsToDelete((prevIds) => [...prevIds, imageToDelete._id]);
    }
    setImages((prevImages) => prevImages.filter((_, idx) => idx !== index));
  };

  const handleCheckboxChange = (value, isChecked) => {
    // console.log('value , is checked--->', value, isChecked);
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

  const fetchDetails = async (schoolgroundId) => {
    // console.log('fetchdetails m schoolid-->', schoolgroundId);
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`${server}/api/admin/user/${schoolgroundId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    
      // Assuming your raw body response is plain text
      const responseDat = response?.data?.data;
      // console.log('school data', responseDat);
      setEditschoolgroundName(responseDat?.institutionName);
      setEditInstitutionId(responseDat?.institutionId);
      setEditaddress1(responseDat?.address1);
      setEditaddress2(responseDat?.address2);
      setEditcity(responseDat?.city);
      setEditstate(responseDat?.state);
      setEditcountry(responseDat?.country);
      setNames(responseDat?.sportsgrounds);

      seteditPincode(responseDat?.pincode);
    } catch (error) {
      console.error('Error fetching User details:', error);
    }
  };

  const fetchGrounds = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${server}/api/ground/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Assuming your raw body response is plain text

      const responseData = response.data.data;
      // console.log('This is view response data abc', responseData);
      // setEditschoolgroundName(responseData.institutionName);
      setschoolGroundId(responseData?.school);
      setEditprice(String(responseData?.price));
      setEditlocation(responseData?.location);
      setEditrating(String(responseData?.rating));
      setSelectedAmenities(responseData?.amenities);
      setSportsName(responseData?.sport_name);
      console.log('sports k nams--->',responseData?.sport_name)
      // console.log('responsedata sportsname--->', responseData);

      setImages(responseData?.images);
    } catch (error) {
      console.error('Error fetching User details:', error);
    }
  };

  async function sportDropdown() {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`${server}/api/admin/schools`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // console.log('api schools----------->', response.data.data);

      if (response.data) {
        setschoolNames(response.data.data);

        // console.log('api dataamsdnasndam---', response.data);
      } else {
        console.error('Empty response data or unexpected format');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  useEffect(() => {
    sportDropdown();
    fetchGrounds();
  }, []);

  useEffect(() => {
    if (schoolgroundId) {
      fetchDetails(schoolgroundId);
    }
  }, [schoolgroundId]);

  const [viewModal, setViewModal] = useState({
    open: false,
    details: null,
    completeDetails: null
  });

  const handleOpenViewModal = async (id) => {
    try {
      setOpen(true);
      setViewModal(true);
    } catch (error) {
      console.error('Error fetching User details:', error);
    }
  };

  const AddSlot = (dayOfWeek, startTime, endTime, totalSlots) => {
    // console.log('startedn-------->', startTime, endTime, dayOfWeek, totalSlots);

    const existingIndex = timetableData.findIndex(
      (item) => item.dayOfWeek === dayOfWeek && item.startTime === startTime && item.endTime === endTime
    );
    if (existingIndex !== -1) {
      // If an entry for this day and time already exists, update its value
      const newTimetableData = [...timetableData];
      // console.log('newtimetabledata---->', newTimetableData);
      newTimetableData[existingIndex].totalSlots = totalSlots;
      setTimetableData(newTimetableData);
    } else {
      // If an entry for this day and time doesn't exist, create a new one
      setTimetableData((prevData) => [...prevData, { dayOfWeek, startTime, endTime, totalSlots }]);
    }

    // console.log('Timetable data--->', timetableData);
  };

  // const handleClose = () => setOpen(false);
  const handleClose = async () => {
    // console.log('close clicked');
    setOpen(false);
  };






  const PasswordChange = (e) => {
    setPassword(e.target.value);
  };






  // Calling the update api
  const handleSaveEdit = async () => {
    //  if (!Editprice.trim()) {
    //       setpriceError(true);
    //       toast.error('All Fields are required');
    //       return;
    //     }

    // Convert the rating to a string to check for leading zeros
    const ratingStr = Editrating.toString();

    // Check for leading zeros and handle invalid inputs
    if (Editrating > 5 || Editrating < 0 || (ratingStr.length > 1 && ratingStr.startsWith('0'))) {
      toast.error('Rating must be 0 - 5');
      return;
    }
    if (!Editprice?.trim() || !Editlocation?.trim() || !Editrating?.trim()) {
      // console.log('edit rating btao--->', Editrating);
      setpriceError(!Editprice?.trim());
      setratingError(!Editrating?.trim());
      setlocationError(!Editlocation?.trim());
      // setSportsNameError(sportsName.length === 0);
      if (selectedAmenities === '') {
        // Check if no amenities are selected
        setAmenitiesError(true);
        // hasErrors = true;
      }

      toast.error('All Fields are required');
      return;
    }

    try {
      const formData = new FormData();
      // console.log('images---->', images);

      // console.log('timetabledata------>', timetableData);
      formData.append('name', schoolGroundName);
      formData.append('InstitutionId', EditInstitutionId);
      // formData.append('sport_name', sportsn);
      // sportsName.forEach((sports) => {
        formData.append(`sport_name`, sportsName);
      // });
      formData.append('address1', Editaddress1);
      formData.append('address2', Editaddress2);
      formData.append('city', Editcity);
      formData.append('state', Editstate);
      formData.append('country', Editcountry);
      formData.append('pincode', editPincode);
      formData.append('location', Editlocation);
      // formData.append('googlemaplink', editgoo);
      formData.append('price', Editprice);
      formData.append('rating', Editrating);
      formData.append('schoolId', schoolgroundId);

      // console.log('image m add kya hua h??--->', imageFiles);

      // Append images
      images.forEach((image, idx) => {
        // console.log('image file m check krna jra aaya bhi h kuch0-->',imageFiles)
        if (imageFiles[image._id]) {
          // console.log('image files m dekho jra--->', imageFiles[image._id]);
          // Append new image files
          formData.append('image', imageFiles[image._id]);
          // Append image ID to delete
          formData.append('imageIdsToDelete', image._id);
        }

        imageIdsToDelete.forEach((id) => {
          formData.append('imageIdsToDelete', id);
        });

        // else {
        //   console.log('idx m y aara h bro--->', idx);
        // const ImageFilter = images.filter((item => item instanceof File));
        // formData.append('image', ImageFilter);
        // console.log('image file m check krna jra aaya bhi h kuch0-->', ImageFilter);

        // }
      });
      // console.log('images k length dekho--->', images.length);
      if (images.length <= 4) {
       

        images.forEach((image) => {
          formData.append('image', image);
        });
      }

      formData.append('amenities', selectedAmenities);
      const updatedTimetable = [...timetableData];
      updatedTimetable.forEach((item) => {
        if (item.totalSlots === '') {
          item.totalSlots = 0;
        }
      });
      // setTimetableData(updatedTimetable)

      formData.append('slots', JSON.stringify(updatedTimetable));
      // console.log('updated timetabledata--->', updatedTimetable);

      formData.forEach((value, key) => {
        // console.log('formdata----->', key, value);
      });

      if (images.length < 1) {
        toast.error('At least one image is required.');
        return; // Prevent further execution
      }
      if (selectedAmenities === '' || selectedAmenities === null) {
        setAmenitiesError(true);
        toast.error('Ammenities is required');
        return;
      }
      const token = localStorage.getItem('token');
      const response = await axios.put(`${server}/api/ground/update/${id}`, formData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          "password": password
        }
      });

      let showtoast = true;
      // Handle the response as needed

      if (response.status === 200) {
        setIsLoading(true);
        

        toast('Ground updated Successfully');
        setPassword('')
      } else {
        toast.error('Ground Not updated.. Try Again');
      }
    } catch (error) {
      if (error?.response?.data?.message.includes('File size too large')) {
        toast.error('File size too large , Upload another File');
        setImages([]);
      } else {
        if (error?.response?.data?.message == 'A ground for sport Cricket,Swimming,Badminton already exists for the school') {
          toast.error('Sports already exists for the School');
        }
      }
      console.error('Error updating record:', error);
      toast.error(error?.response?.data?.message);
    }
  };

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${server}/api/booking/slots/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // console.log('slots details--->', response.data.data);

      const data = response.data.data;

      const newArray = data?.map((item) => {
        return {
          dayOfWeek: item.dayOfWeek,
          startTime: item.startTime,
          endTime: item.endTime,
          totalSlots: item.totalSlots
        };
      });

      setTimetableData(newArray);
    } catch (error) {
      console.error('Error fetching User details:', error);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

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
            // console.log('api school  names---', response.data.data);
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

          // console.log('api users----------->', response.data);

          if (response.data) {
            // setNames(response.data);
            // console.log('api dataamsdnasndam---', response.data);
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

  return (
    <div>
      <form
        className="space-y-6"
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

          <Grid item xs={12} md={12}>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent>
                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mb: 2, mt: 2 }}>
                  <Grid item xs={6} className="flex">
                    <GoBack />
                    <Typography variant="h4">Edit Ground</Typography>
                  </Grid>
                </Stack>

                <Grid container spacing={3} className="mt-5">
                  <Grid container spacing={3} marginLeft={0.3}>
                    <Grid item xs={4}>
                      <InputLabel className="mb-2">Select Ground(Schools Name)</InputLabel>
                      {schoolNames && EditschoolgroundName && (
                        <Select
                          autocomplete="off"
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          name="sportsgrounds"
                          defaultValue={EditschoolgroundName}
                          fullWidth
                          onChange={(e) => {
                            const selectedName = e.target.value; // Get the selected name
                            const selectedId = schoolNames.find((name) => name.institutionName === selectedName)?._id; // Find the
                            setEditschoolgroundName(selectedName);
                            setschoolGroundId(selectedId); // Set the ID in the state
                          }}
                          variant="outlined"
                          size="small"
                          sx={{ width: '100%' }}
                        >
                          {/* {console.log('Selected ground--->', EditschoolgroundName)} */}

                          {schoolNames
                            ?.filter((row) => row.isDeleted === false)
                            ?.map((name) => (
                              <MenuItem value={name.institutionName}>{name.institutionName}</MenuItem>
                            ))}
                        </Select>
                      )}
                    </Grid>

                    <Grid item xs={4}>
                      <InputLabel htmlFor="gender" sx={{ marginBottom: 1 }}>
                        Institution Id
                      </InputLabel>
                      <TextField
                        autoFocus
                        autocomplete="off"
                        type="text"
                        name="InstitutionId"
                        id="InstitutionId"
                        onChange={(e) => setEditInstitutionId(e.target.value)}
                        value={EditInstitutionId}
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <InputLabel htmlFor="price" sx={{ marginBottom: 1 }}>
                        Price
                      </InputLabel>
                      <TextField
                        autoFocus
                        autocomplete="off"
                        type="text"
                        name="price"
                        id="price"
                        onChange={(e) => {
                          setEditprice(e.target.value);
                          setpriceError(false);
                        }}
                        value={Editprice}
                        error={priceError}
                        helperText={priceError && 'Price is required'}
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <InputLabel htmlFor="rating" sx={{ marginBottom: 1 }}>
                        Rating
                      </InputLabel>
                      <TextField
                        autoFocus
                        autocomplete="off"
                        type="text"
                        name="rating"
                        id="rating"
                        onChange={(e) => {
                          setEditrating(e.target.value);
                          setratingError(false);
                        }}
                        value={Editrating}
                        error={ratingError}
                        inputProps={{ min: 0, max: 5 }}
                        helperText={ratingError && 'Rating is required'}
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <InputLabel className="mb-2">Select Sport</InputLabel>
                      {console.log('sports Names--->', Names)}
                      <Select
                        autocomplete="off"
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        name="sportsgrounds"
                        fullWidth
                        // multiple
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
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.1 }}>
                            {/* {selected.flatMap((value) => value.split(',').map((word) => <Chip key={word} label={word} />))} */}
                            {/* {console.log('selected flatmap--->',selected.fka)} */}
                            {/* {selected.map((value) => ( */}
                            {/* <Chip key={value} label={value} /> */}
                            <Chip label={selected} />
                            {/* ))} */}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {Names.map((name) => (
                          // <MenuItem key={name.name} value={name.name} selected={sportsName?.includes(name.name)}>
                          //   {name.name}
                          // </MenuItem>
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

                    <Grid item xs={4}>
                      <InputLabel htmlFor="location" sx={{ marginBottom: 1 }}>
                        Location
                      </InputLabel>
                      <TextField
                        autoFocus
                        autocomplete="off"
                        type="text"
                        name="location"
                        id="location"
                        onChange={(e) => {
                          setEditlocation(e.target.value);
                          setlocationError(false);
                        }}
                        error={locationError}
                        helperText={locationError && 'Location is required'}
                        value={Editlocation}
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <InputLabel htmlFor="address1" sx={{ marginBottom: 1 }}>
                        Address 1
                      </InputLabel>
                      <TextField
                        autoFocus
                        autocomplete="off"
                        type="text"
                        name="address1"
                        id="address1"
                        onChange={(e) => setEditaddress1(e.target.value)}
                        value={Editaddress1}
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <InputLabel htmlFor="address2" sx={{ marginBottom: 1 }}>
                        Address 2
                      </InputLabel>
                      <TextField
                        autoFocus
                        autocomplete="off"
                        type="text"
                        name="address2"
                        id="address2"
                        onChange={(e) => setEditaddress2(e.target.value)}
                        value={Editaddress2}
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <InputLabel htmlFor="city" sx={{ marginBottom: 1 }}>
                        City
                      </InputLabel>
                      <TextField
                        autoFocus
                        autocomplete="off"
                        type="text"
                        name="city"
                        id="city"
                        onChange={(e) => setEditcity(e.target.value)}
                        value={Editcity}
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <InputLabel htmlFor="state" sx={{ marginBottom: 1 }}>
                        State
                      </InputLabel>
                      <TextField
                        autoFocus
                        autocomplete="off"
                        type="text"
                        name="state"
                        id="state"
                        onChange={(e) => setEditstate(e.target.value)}
                        value={Editstate}
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <InputLabel htmlFor="country" sx={{ marginBottom: 1 }}>
                        Country
                      </InputLabel>
                      <TextField
                        autoFocus
                        autocomplete="off"
                        type="text"
                        name="country"
                        id="country"
                        onChange={(e) => setEditcountry(e.target.value)}
                        value={Editcountry}
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <InputLabel htmlFor="pincode" sx={{ marginBottom: 1 }}>
                        Pincode
                      </InputLabel>
                      <TextField
                        autoFocus
                        autocomplete="off"
                        type="text"
                        // label="Pincode"
                        name="pincode"
                        id="pincode"
                        onChange={(e) => seteditPincode(e.target.value)}
                        value={editPincode}
                        size="small"
                        sx={{ width: '100%' }}
                        disabled
                      />
                    </Grid>
                    {localStorage.getItem('role') === 'admin' && (
                      <Grid item xs={4}>
                        <InputLabel htmlFor="password" sx={{ marginBottom: 1 }}>
                          Password
                        </InputLabel>
                        <TextField
                          autoFocus
                          autocomplete="off"
                          type="text"
                          // label="Pincode"
                          name="password"
                          id="password"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                          size="small"
                          sx={{ width: '100%' }}
                        />
                      </Grid>
                    )}

                    <Grid item xs={4} sx={{ marginTop: 3.5 }}>
                      {/* <Link to="/apps/slots"> */}
                      <Button onClick={(e) => handleOpenViewModal()} className="bg-yellow-500 text-white">
                        Slot Management
                      </Button>
                      {/* </Link> */}
                    </Grid>
                  </Grid>
                </Grid>

                {/* </form> */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 2 */}
        {/* Amenities */}

        <Grid item xs={12} md={12}>
          <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h4">Ammenities</Typography>
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
                      checked={selectedAmenities.includes('Shower')}
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
                      checked={selectedAmenities.includes('Parking')}
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
                      checked={selectedAmenities.includes('Drinking Water')}
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
                      checked={selectedAmenities.includes('Change Room')}
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
                      checked={selectedAmenities.includes("CC TV's")}
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
                      checked={selectedAmenities.includes('Toilet')}
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
                      checked={selectedAmenities.includes('Night Lights')}
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
                      checked={selectedAmenities.includes('Lockers')}
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

        {/* 3 */}

        <Grid container spacing={2}>
          {images?.map((image, index) => (
            <Grid key={index} item xs={3} position="relative">
              {image && (
                <div style={{ position: 'relative' }}>
                  <img
                    alt="Uploaded Image"
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                    height={200}
                    src={image.imageUrl ? image.imageUrl : URL.createObjectURL(image)}
                    width={300}
                  />
                  <IconButton
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      backgroundColor: 'white',
                      zIndex: 1
                    }}
                    onClick={() => handleEditClick(image._id ? image._id : index)}
                  >
                    {/* {console.log('image id--->', image._id ? image._id : index)} */}
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    style={{
                      position: 'absolute',
                      marginTop: '40px',
                      top: 5,
                      right: 5,
                      backgroundColor: 'white',
                      zIndex: 1
                    }}
                    onClick={() => handleDeleteImage(index)}
                  >
                    <DeleteIcon />
                  </IconButton>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageChange(event, image._id ? image._id : index)}
                    style={{ display: 'none' }}
                    ref={(el) => (fileInputRefs.current[image._id ? image._id : index] = el)}
                  />
                </div>
              )}
            </Grid>
          ))}

          {/* {console.log('images k length bolo jra--->', images)} */}
          {images?.length < 4 && (
            <Grid item xs={3}>
              <div className="flex justify-center items-center h-full border-dashed border-2 border-gray-300 rounded-lg">
                <label className="cursor-pointer" htmlFor="file-upload">
                  <span>Upload a file</span>
                  <input className="sr-only" id="file-upload" onChange={handleaddgroundImage} type="file" />
                </label>
              </div>
            </Grid>
          )}
        </Grid>

        {/* submit */}

        <Grid container spacing={2} className="mt-2 mb-2">
          <Grid item>
            <Button className="w-24 h-10 rounded bg-blue-500 text-white hover:bg-blue-700 hover:text-white">Cancel</Button>
          </Grid>
          <Grid item>
            <Button type="submit" className="w-24 h-10 rounded bg-blue-500 text-white hover:bg-blue-700 hover:text-white">
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
          {/* edit slot modal jsx */}

          <Box id="PopupPrint" sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 1, height: '100vh' }}>
            <DialogTitle sx={{ px: 0 }}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                <List sx={{ width: 1, p: 0 }}>
                  <ListItem disablePadding>
                    <ListItemAvatar sx={{ mr: 0.75, p: 2 }} className="flex justify-center align-center">
                      <Typography variant="h4">Slot Management</Typography>
                    </ListItemAvatar>
                    {/* {console.log('viewmodal----name--->', viewModal)} */}
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
                            AddSlot('Monday', '10:00 AM', '11:00 AM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Monday' && slot.startTime === '10:00 AM' && slot.endTime === '11:00 AM'
                            )?.totalSlots
                          }
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
                            AddSlot('Tuesday', '10:00 AM', '11:00 AM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Tuesday' && slot.startTime === '10:00 AM' && slot.endTime === '11:00 AM'
                            )?.totalSlots
                          }
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
                            AddSlot('Wednesday', '10:00 AM', '11:00 AM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Wednesday' && slot.startTime === '10:00 AM' && slot.endTime === '11:00 AM'
                            )?.totalSlots
                          }
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
                            AddSlot('Thursday', '10:00 AM', '11:00 AM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Thursday' && slot.startTime === '10:00 AM' && slot.endTime === '11:00 AM'
                            )?.totalSlots
                          }
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
                            AddSlot('Friday', '10:00 AM', '11:00 AM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Friday' && slot.startTime === '10:00 AM' && slot.endTime === '11:00 AM'
                            )?.totalSlots
                          }
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
                            AddSlot('Saturday', '10:00 AM', '11:00 AM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Saturday' && slot.startTime === '10:00 AM' && slot.endTime === '11:00 AM'
                            )?.totalSlots
                          }
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
                            AddSlot('Sunday', '10:00 AM', '11:00 AM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Sunday' && slot.startTime === '10:00 AM' && slot.endTime === '11:00 AM'
                            )?.totalSlots
                          }
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
                            AddSlot('Monday', '11:00 AM', '12:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Monday' && slot.startTime === '11:00 AM' && slot.endTime === '12:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Tuesday', '11:00 AM', '12:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Tuesday' && slot.startTime === '11:00 AM' && slot.endTime === '12:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Wednesday', '11:00 AM', '12:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Wednesday' && slot.startTime === '11:00 AM' && slot.endTime === '12:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Thursday', '11:00 AM', '12:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Thursday' && slot.startTime === '11:00 AM' && slot.endTime === '12:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Friday', '11:00 AM', '12:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Friday' && slot.startTime === '11:00 AM' && slot.endTime === '12:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Saturday', '11:00 AM', '12:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Saturday' && slot.startTime === '11:00 AM' && slot.endTime === '12:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Sunday', '11:00 AM', '12:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Sunday' && slot.startTime === '11:00 AM' && slot.endTime === '12:00 PM'
                            )?.totalSlots
                          }
                          error={institutionIdError}
                          helperText={institutionIdError && 'Institution Id is required'}
                          variant="outlined"
                          size="small"
                          sx={{ width: '100%' }}
                        />
                      </td>
                    </tr>
                    <tr className="bg-gray-100 ">
                      <td className="border border-gray-300 dark:border-gray-700 py-3 px-4 font-medium">12:00 PM - 01:00 PM</td>
                      <td className="border border-gray-300 dark:border-gray-700 py-3 px-4">
                        <TextField
                          autocomplete="off"
                          className="textfields"
                          fullWidth
                          name="institutionId"
                          onChange={(e) => {
                            AddSlot('Monday', '12:00 PM', '01:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Monday' && slot.startTime === '12:00 PM' && slot.endTime === '01:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Tuesday', '12:00 PM', '01:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Tuesday' && slot.startTime === '12:00 PM' && slot.endTime === '01:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Wednesday', '12:00 PM', '01:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Wednesday' && slot.startTime === '12:00 PM' && slot.endTime === '01:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Thursday', '12:00 PM', '01:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Thursday' && slot.startTime === '12:00 PM' && slot.endTime === '01:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Friday', '12:00 PM', '01:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Friday' && slot.startTime === '12:00 PM' && slot.endTime === '01:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Saturday', '12:00 PM', '01:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Saturday' && slot.startTime === '12:00 PM' && slot.endTime === '01:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Sunday', '12:00 PM', '01:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Sunday' && slot.startTime === '12:00 PM' && slot.endTime === '01:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Monday', '01:00 PM', '02:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Monday' && slot.startTime === '01:00 PM' && slot.endTime === '02:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Tuesday', '01:00 PM', '02:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Tuesday' && slot.startTime === '01:00 PM' && slot.endTime === '02:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Wednesday', '01:00 PM', '02:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Wednesday' && slot.startTime === '01:00 PM' && slot.endTime === '02:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Thursday', '01:00 PM', '02:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Thursday' && slot.startTime === '01:00 PM' && slot.endTime === '02:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Friday', '01:00 PM', '02:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Friday' && slot.startTime === '01:00 PM' && slot.endTime === '02:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Saturday', '01:00 PM', '02:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Saturday' && slot.startTime === '01:00 PM' && slot.endTime === '02:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Sunday', '01:00 PM', '02:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Sunday' && slot.startTime === '01:00 PM' && slot.endTime === '02:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Monday', '02:00 PM', '03:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Monday' && slot.startTime === '02:00 PM' && slot.endTime === '03:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Tuesday', '02:00 PM', '03:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Tuesday' && slot.startTime === '02:00 PM' && slot.endTime === '03:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Wednesday', '02:00 PM', '03:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Wednesday' && slot.startTime === '02:00 PM' && slot.endTime === '03:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Thursday', '02:00 PM', '03:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Thursday' && slot.startTime === '02:00 PM' && slot.endTime === '03:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Friday', '02:00 PM', '03:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Friday' && slot.startTime === '02:00 PM' && slot.endTime === '03:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Saturday', '02:00 PM', '03:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Saturday' && slot.startTime === '02:00 PM' && slot.endTime === '03:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Sunday', '02:00 PM', '03:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Sunday' && slot.startTime === '02:00 PM' && slot.endTime === '03:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Monday', '03:00 PM', '04:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Monday' && slot.startTime === '03:00 PM' && slot.endTime === '04:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Tuesday', '03:00 PM', '04:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Tuesday' && slot.startTime === '03:00 PM' && slot.endTime === '04:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Wednesday', '03:00 PM', '04:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Wednesday' && slot.startTime === '03:00 PM' && slot.endTime === '04:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Thursday', '03:00 PM', '04:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Thursday' && slot.startTime === '03:00 PM' && slot.endTime === '04:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Friday', '03:00 PM', '04:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Friday' && slot.startTime === '03:00 PM' && slot.endTime === '04:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Saturday', '03:00 PM', '04:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Saturday' && slot.startTime === '03:00 PM' && slot.endTime === '04:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Sunday', '03:00 PM', '04:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Sunday' && slot.startTime === '03:00 PM' && slot.endTime === '04:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Monday', '04:00 PM', '05:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Monday' && slot.startTime === '04:00 PM' && slot.endTime === '05:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Tuesday', '04:00 PM', '05:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Tuesday' && slot.startTime === '04:00 PM' && slot.endTime === '05:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Wednesday', '04:00 PM', '05:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Wednesday' && slot.startTime === '04:00 PM' && slot.endTime === '05:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Thursday', '04:00 PM', '05:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Thursday' && slot.startTime === '04:00 PM' && slot.endTime === '05:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Friday', '04:00 PM', '05:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Friday' && slot.startTime === '04:00 PM' && slot.endTime === '05:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Saturday', '04:00 PM', '05:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Saturday' && slot.startTime === '04:00 PM' && slot.endTime === '05:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Sunday', '04:00 PM', '05:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Sunday' && slot.startTime === '04:00 PM' && slot.endTime === '05:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Monday', '05:00 PM', '06:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Monday' && slot.startTime === '05:00 PM' && slot.endTime === '06:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Tuesday', '05:00 PM', '06:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Tuesday' && slot.startTime === '05:00 PM' && slot.endTime === '06:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Wednesday', '05:00 PM', '06:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Wednesday' && slot.startTime === '05:00 PM' && slot.endTime === '06:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Thursday', '05:00 PM', '06:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Thursday' && slot.startTime === '05:00 PM' && slot.endTime === '06:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Friday', '05:00 PM', '06:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Friday' && slot.startTime === '05:00 PM' && slot.endTime === '06:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Saturday', '05:00 PM', '06:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Saturday' && slot.startTime === '05:00 PM' && slot.endTime === '06:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Sunday', '05:00 PM', '06:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Sunday' && slot.startTime === '05:00 PM' && slot.endTime === '06:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Monday', '06:00 PM', '07:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Monday' && slot.startTime === '06:00 PM' && slot.endTime === '07:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Tuesday', '06:00 PM', '07:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Tuesday' && slot.startTime === '06:00 PM' && slot.endTime === '07:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Wednesday', '06:00 PM', '07:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Wednesday' && slot.startTime === '06:00 PM' && slot.endTime === '07:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Thursday', '06:00 PM', '07:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Thursday' && slot.startTime === '06:00 PM' && slot.endTime === '07:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Friday', '06:00 PM', '07:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Friday' && slot.startTime === '06:00 PM' && slot.endTime === '07:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Saturday', '06:00 PM', '07:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Saturday' && slot.startTime === '06:00 PM' && slot.endTime === '07:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Sunday', '06:00 PM', '07:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Sunday' && slot.startTime === '06:00 PM' && slot.endTime === '07:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Monday', '07:00 PM', '08:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Monday' && slot.startTime === '07:00 PM' && slot.endTime === '08:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Tuesday', '07:00 PM', '08:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Tuesday' && slot.startTime === '07:00 PM' && slot.endTime === '08:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Wednesday', '07:00 PM', '08:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Wednesday' && slot.startTime === '07:00 PM' && slot.endTime === '08:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Thursday', '07:00 PM', '08:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Thursday' && slot.startTime === '07:00 PM' && slot.endTime === '08:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Friday', '07:00 PM', '08:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Friday' && slot.startTime === '07:00 PM' && slot.endTime === '08:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Saturday', '07:00 PM', '08:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Saturday' && slot.startTime === '07:00 PM' && slot.endTime === '08:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Sunday', '07:00 PM', '08:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Sunday' && slot.startTime === '07:00 PM' && slot.endTime === '08:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Monday', '08:00 PM', '09:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Monday' && slot.startTime === '08:00 PM' && slot.endTime === '09:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Tuesday', '08:00 PM', '09:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Tuesday' && slot.startTime === '08:00 PM' && slot.endTime === '09:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Wednesday', '08:00 PM', '09:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Wednesday' && slot.startTime === '08:00 PM' && slot.endTime === '09:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Thursday', '08:00 PM', '09:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Thursday' && slot.startTime === '08:00 PM' && slot.endTime === '09:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Friday', '08:00 PM', '09:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Friday' && slot.startTime === '08:00 PM' && slot.endTime === '09:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Saturday', '08:00 PM', '09:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Saturday' && slot.startTime === '08:00 PM' && slot.endTime === '09:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Sunday', '08:00 PM', '09:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Sunday' && slot.startTime === '08:00 PM' && slot.endTime === '09:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Monday', '09:00 PM', '10:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Monday' && slot.startTime === '09:00 PM' && slot.endTime === '10:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Tuesday', '09:00 PM', '10:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Tuesday' && slot.startTime === '09:00 PM' && slot.endTime === '10:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Wednesday', '09:00 PM', '10:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Wednesday' && slot.startTime === '09:00 PM' && slot.endTime === '10:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Thursday', '09:00 PM', '10:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Thursday' && slot.startTime === '09:00 PM' && slot.endTime === '10:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Friday', '09:00 PM', '10:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Friday' && slot.startTime === '09:00 PM' && slot.endTime === '10:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Saturday', '09:00 PM', '10:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Saturday' && slot.startTime === '09:00 PM' && slot.endTime === '10:00 PM'
                            )?.totalSlots
                          }
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
                            AddSlot('Sunday', '09:00 PM', '10:00 PM', e.target.value);
                          }}
                          value={
                            timetableData.find(
                              (slot) => slot.dayOfWeek === 'Sunday' && slot.startTime === '09:00 PM' && slot.endTime === '10:00 PM'
                            )?.totalSlots
                          }
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
      </form>
    </div>
  );
};

export default Editground;
