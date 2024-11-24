import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Card, CardContent, InputLabel, IconButton } from '@mui/material';

import MainCard from '../../../../components/MainCard';
import { useMediaQuery, Grid } from '@mui/material';

import { Stack } from '@mui/system';
import { useParams } from 'react-router-dom';
import GoBack from 'pages/apps/components/GoBack';
import { Eye } from 'iconsax-react';

const server = process.env.REACT_APP_API_URL;
const Coach_details = () => {
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  const [Coachdata, setCoachdata] = useState('');
  const [slotopen, setslotopen] = useState(false);

  const [schoolid, setschoolid] = useState('');
  const [schoolData, setschoolData] = useState('');
    const [decodedPass, setdecodedPass] = useState('');
      const [showpass, setshowpass] = useState(false);

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



    const handleShowHideClick = () => {
      setshowpass(!showpass);
    };
    const handleButtonClick = async (schoolId) => {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token is found, redirect to the login page
        // navigate('/');
      } else {
        try {
          console.log('id aaayyyii-->', schoolId);
          const response = await axios.get(`${server}/api/admin/decode-password/${schoolId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('response aaya passworddecide---->', response);

          console.log('user id for decode--->', schoolId);
          const decodedPass = response.data.password;
          console.log('decoded password-->', decodedPass);

          setdecodedPass(decodedPass);
        } catch (error) {
          console.error('Error decoding card number:', error);
        }
      }
    };

  function splitStringIntoArr(data) {
    console.log('this is data', data);
    const temp1 = data[0] ? data[0] : ''; //get data from the 0 index
    console.log('this is temp1', temp1);

    const temp2 = temp1.split(','); //split it based on comma and return it
    console.log('this is temp1', temp2);

    return temp2;
  }

  const timetable = [];
  Weekdays?.forEach((day) => {
    for (let i = 0; i < Time.length; i++) {
      timetable.push({
        dayOfWeek: day.Day,
        startTime: Time[i].startTime,
        endTime: Time[i].endTime,
        totalSlots: 0
      });
    }
  });

  useEffect(() => {
    const fetchCoachdetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate("/");
      } else {
        try {
          const response = await axios.get(`${server}/api/admin/user/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            setCoachdata(response.data.data);
            // setschoolid(response?.data?.data?.school);
            console.log('api data dfsaewdsdsdsdfs---', response.data.data);
            // console.log('schoolid ---', response.data.data.school);
          } else {
            console.error('Empty response data or unexpected format');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };
    fetchCoachdetails();
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
            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mb: 2, mt: 2 }}>
              <Grid item xs={6} className="flex">
                <GoBack />
                <Typography variant="h4">Coach Information</Typography>
              </Grid>
            </Stack>
            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
              <Typography variant="h4" className="text-sm">
                Personal Details
              </Typography>
            </Stack>

            <Grid container spacing={3} sx={{ marginTop: 0.2 }}>
              <Grid item xs={6}>
                <InputLabel>Institution Id</InputLabel>
                <Typography>{Coachdata?.institutionId || 'NA'}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Name</InputLabel>

                <Typography className="text-left">{Coachdata?.firstname + ' ' + Coachdata?.lastname || 'NA'}</Typography>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ marginTop: '5px' }}>
              <Grid item xs={6}>
                <InputLabel>Email</InputLabel>
                <Typography>{Coachdata?.email || 'NA'}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Contact No.</InputLabel>
                <Typography>{Coachdata?.phoneNumber || 'NA'}</Typography>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ marginTop: '5px' }}>
              <Grid item xs={6}>
                <InputLabel>Gender </InputLabel>
                <Typography color="secondary">{Coachdata?.gender || 'NA'}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Nationality </InputLabel>
                <Typography color="secondary">{Coachdata?.nationality || 'NA'}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Password </InputLabel>
                <Typography>
                  <Stack spacing={0.5}>
                    {showpass && <Typography>{decodedPass}</Typography>}
                    {/* {console.log('decoded password--->', decodedPass)} */}

                    <IconButton
                      color="success"
                      onClick={() => {
                        handleButtonClick(Coachdata?._id);
                        handleShowHideClick();
                      }}
                    >
                      <Eye />
                    </IconButton>
                  </Stack>
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Certifications View */}

      {/* Qualification & Certificatin and Experience Section   */}

      <Grid item xs={12} sx={{ marginTop: 3 }}>
        <MainCard title="Qualification/Certification And Experience">
          <Grid container spacing={matchDownMD ? 0.5 : 3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={0.5}>
                <Typography color="secondary">Total Year Of Experience</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={0.5}>
                <Typography color="secondary">{Coachdata?.yearsOfExperience + ' Years' || 'NA'}</Typography>
              </Stack>
            </Grid>
          </Grid>

          <Grid container spacing={matchDownMD ? 0.5 : 3}>
            <Grid item xs={12} md={6} sx={{ marginTop: 2 }}>
              <Stack spacing={0.5}>
                <Typography color="secondary">Professional Certification</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ marginTop: 2 }}>
              <Stack spacing={0.5}>
                <Typography color="secondary">
                  {console.log('coachdatacertificates-->', Coachdata?.certificates)}{' '}
                  <div className="flex flex-row items-start" style={{ marginTop: 4 }}>
                    {Coachdata?.certificates?.map((r) => (
                      <div key={r.id} className="mr-8">
                        <img src={r?.certificateUrl} className="w-[240px] h-[160px] rounded-md object-fill" />
                        <div className="flex justify-center">{r?.certificateName}</div>
                        {console.log('certification--->', r?.certificateName)}
                        <div className="flex justify-center">({r?.organizationName})</div>
                      </div>
                    ))}
                  </div>
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      {/*-------------------- Coach Specialities & Availablity Details ----------------------  */}

      <Grid item xs={12} sx={{ marginTop: 3 }}>
        <MainCard title="Coach Specialities ">
          <Grid container spacing={matchDownMD ? 0.5 : 3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={0.5}>
                <Typography color="secondary">Sports</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={0.5}>
                <Typography color="secondary" className="gap-2 flex flex-wrap">
                  {(Coachdata?.sportsgrounds &&
                    splitStringIntoArr(Coachdata?.sportsgrounds)?.map((r) => (
                      <div className="px-2 py-px bg-gray-50 border-gray-100 border-[1px] rounded-full w-fit "> {r}</div>
                    ))) ||
                    'NA'}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 3 }}>
        <MainCard title="Biographic And Achievemenets">
          <Grid container spacing={matchDownMD ? 0.5 : 3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={0.5}>
                <Typography color="secondary">Description</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={0.5}>
                <Typography color="secondary" className="rounded-xl border-[2px] border-gray-100 px-2 py-2 bg-gray-50">
                  {Coachdata?.description || 'NA'}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      {/* Location/Address */}

      <Grid item xs={12} sm={12} xl={12} sx={{ marginTop: 3 }}>
        <Grid container spacing={2.25}>
          <Grid item xs={12}>
            <MainCard title="Location/Address">
              {/* <List sx={{ py: 0 }}>
                <ListItem divider> */}
              <Grid container spacing={matchDownMD ? 0.5 : 3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">Primary Location</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">{Coachdata?.address1 || 'NA'}</Typography>
                    <Typography color="secondary">{Coachdata.address2 || 'NA'}</Typography>
                  </Stack>
                </Grid>
              </Grid>
              {/* </ListItem> */}
              {/* <ListItem divider> */}
              <Grid container spacing={matchDownMD ? 0.5 : 3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">Pincode</Typography>
                    {/* <Typography>2014-2017</Typography> */}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">{Coachdata?.pincode || 'NA'}</Typography>
                  </Stack>
                </Grid>
              </Grid>
              {/* </ListItem> */}

              {/* <ListItem divider> */}
              <Grid container spacing={matchDownMD ? 0.5 : 3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">State</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">{Coachdata.state || 'NA'}</Typography>
                  </Stack>
                </Grid>
              </Grid>
              {/* </ListItem> */}

              {/* <ListItem divider> */}
              <Grid container spacing={matchDownMD ? 0.5 : 3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">Country</Typography>
                    {/* <Typography>2014-2017</Typography> */}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">{Coachdata.country || 'NA'}</Typography>
                  </Stack>
                </Grid>
              </Grid>
              {/* </ListItem> */}
              {/* </List> */}
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Coach_details;
