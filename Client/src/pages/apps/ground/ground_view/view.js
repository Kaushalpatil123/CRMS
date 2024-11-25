import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  IconButton,
  Typography,
  CardMedia,
  CardActions,
  TextField,
  Container,
  Card,
  CardContent,
  Select,
  MenuItem,
  Button,
  InputLabel
} from '@mui/material';
import {
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';






import { PopupTransition } from '../../../../components/@extended/Transitions';



import { Stack, height, width } from '@mui/system';
import { useNavigate, useParams } from 'react-router-dom';
import GoBack from 'pages/apps/components/GoBack';

const server = process.env.REACT_APP_API_URL;
const Ground_details = () => {
  const [BookingData, setBookingData] = useState('');
    const [open, setOpen] = useState(false);
  const [Grounddata, setGrounddata] = useState('');
    const [slotopen, setslotopen] = useState(false);

  const [timetableData, setTimetableData] = useState([]);
  const [institutionIdError, setinstitutionIdError] = useState(false);
  const [schoolid, setschoolid] = useState('');
  const [schoolData, setschoolData] = useState('');

  const { id } = useParams();




  
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

    const fetchSlots = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${server}/api/booking/slots/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('slots details--->', response.data.data);

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

  useEffect(() => {
    const fetchBookingGround = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate("/");
      } else {
        try {
          const response = await axios.get(`${server}/api/ground/get/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            setGrounddata(response.data.data);
            setschoolid(response?.data?.data?.school);
            console.log('api data---', response.data.data);
            console.log('schoolid ---', response.data.data.school);
          } else {
            console.error('Empty response data or unexpected format');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };
    fetchBookingGround();
  }, []);

  const SchoolDetails = async (schoolid) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${server}/api/admin/user/${schoolid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = response.data.data;
      console.log('This response data particualr school details-->', responseData);
      setschoolData(responseData);
    } catch (error) {
      console.error('Error fetching User details:', error);
    }
  };

  useEffect(() => {
    if (schoolid) {
      SchoolDetails(schoolid);
    }
  }, [schoolid]);







//   Slots View
  const handleClose = async () => {
    console.log('close clicked');
    setOpen(false);
  };

 const handleEditSlotManagement = async (id) => {
   try {
     // const token = localStorage.getItem('token');
     // const response = await axios.get(`${server}/api/admin/user/${id}`, {
     //   headers: {
     //     Authorization: `Bearer ${token}`
     //   }
     // });

     // // Assuming your raw body response is plain text
     // const responseDataCart = response.data;
     // const responseData = response.data.data;
     // console.log('This is view response data', responseData);

     // // Adjust this logic based on the actual format of your raw body response
     // // For example, if your response is plain text, you might display it directly
     setOpen(true);
    //  setslotEditModal(true);
   } catch (error) {
     console.error('Error fetching User details:', error);
   }
 };
  return (
    <>
      <Grid item xs={12} md={12}>
        <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardContent>
            <Stack spacing={1} sx={{ mb: 2, mt: 2 }}>
              <Grid item xs={2} className='flex'>
                <GoBack/>
                <Typography variant="h4">Ground Information</Typography>
              </Grid>
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <InputLabel>Institution Id</InputLabel>
                <Typography>{schoolData?.institutionId}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Username</InputLabel>
                <Typography>{schoolData?.institutionName}</Typography>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ marginTop: '5px' }}>
              <Grid item xs={6}>
                <InputLabel>Sports</InputLabel>
                <Typography>{schoolData?.sportsgrounds}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Ammenities</InputLabel>
                <Typography>{Grounddata?.amenities}</Typography>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ marginTop: '5px' }}>
              <Grid item xs={6}>
                <InputLabel>City </InputLabel>
                <Typography color="secondary">{schoolData?.city || 'NA'}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>State </InputLabel>
                <Typography color="secondary">{schoolData?.state || 'NA'}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Country </InputLabel>
                <Typography color="secondary">{schoolData?.country || 'NA'}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Pincode </InputLabel>
                <Typography color="secondary">{schoolData?.pincode || 'NA'}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Googlemaplink</InputLabel>
                <Typography>
                  {console.log('schooldata googlemaplink->', schoolData?.googlemaplink)}
                  <a
                    href={schoolData?.googlemaplink}
                    className="flex items-center cursor-pointer text-blue-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className='truncate'>{schoolData?.googlemaplink}</span>
                    {/* <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded">View on Map</button> */}
                  </a>
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Price </InputLabel>
                <Typography color="secondary">{Grounddata?.price || 'NA'}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Rating </InputLabel>
                <Typography color="secondary">{Grounddata?.rating || 'NA'}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={12}>
        <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Typography variant="h4">Images</Typography>
              </Grid>
            </Stack>

            <Grid container spacing={3}>
              {Grounddata?.images?.map((image, index) => (
                <Grid key={index} item xs={3}>
                  {image && (
                    <img
                      alt="Uploaded Image"
                      className="aspect-[4/3] w-full rounded-lg object-cover mt-4"
                      height={200}
                      src={image.imageUrl}
                      width={250}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Slots View */}

      <Grid item xs={12} md={12}>
        <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Typography variant="h4">Slots</Typography>
              </Grid>
            </Stack>

            <Grid container>
              <div>
                {/* <label htmlFor="actualPrice" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Slot 
                </label> */}
                <Button onClick={(e) => handleEditSlotManagement()} className="bg-yellow-500 text-white mt-4">
                  Slot Management
                </Button>
              </div>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Slot Open */}

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
                        className="text-bold"
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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

            {/* <Button
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
            </Button> */}
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default Ground_details;
