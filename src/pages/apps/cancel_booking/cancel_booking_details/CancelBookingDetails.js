import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Grid, Container, Card, CardContent, InputLabel } from '@mui/material';
import { Stack } from '@mui/system';
import { useParams } from 'react-router-dom';
import GoBack from 'pages/apps/components/GoBack';

const server = process.env.REACT_APP_API_URL;
const CancelBookingDetails = () => {
  const [BookingData, setBookingData] = useState('');

  const { id } = useParams();

  useEffect(() => {
    const fetchBookingGround = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate("/");
      } else {
        try {
          const response = await axios.get(`${server}/api/booking/ground-bookings/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            setBookingData(response.data.data);
            console.log('api data---', response.data.data);
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

  return (
    <>
      <Grid item xs={12} md={12}>
        <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardContent>
            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mb: 2, mt: 2 }}>
              <Grid item xs={6} className="flex">
                <GoBack />
                <Typography variant="h4">Ground Information</Typography>
              </Grid>
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <InputLabel>Institution Name</InputLabel>
                <Typography>{BookingData?.groundId?.institutionName}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Username</InputLabel>
                <Typography>{BookingData?.userId?.userName}</Typography>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ marginTop: '5px' }}>
              <Grid item xs={6}>
                <InputLabel>Price</InputLabel>
                <Typography>{BookingData?.totalPrice}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>No. of Booked Users</InputLabel>
                <Typography>{BookingData?.totalCount}</Typography>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ marginTop: '5px' }}>
              <Grid item xs={6}>
                <InputLabel>Slot (Start Time)</InputLabel>
                <Typography>
                  {BookingData?.dayOfWeek}
                  {BookingData?.startTime}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Slot (End Time)</InputLabel>
                <Typography>{BookingData?.endTime}</Typography>
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
                <Typography variant="h4">Booked Slots User Info</Typography>
              </Grid>
            </Stack>

            <Grid container spacing={3} sx={{ marginTop: 1 }}>
              {console.log('booking users emnrbwmnrbwmnb-->', BookingData?.users)}
              {BookingData?.users?.map((user, userIndex) => (
                <Grid item xs={12} key={`user-${userIndex}`}>
                  <Grid sx={{ display: 'flex' }}>
                    <Grid item xs={6}>
                      <Typography>Username:</Typography>
                      <Typography>Phone Number</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ marginLeft: 4 }}>
                      <InputLabel>
                        {user?.firstName}&nbsp;
                        {user?.lastName}
                      </InputLabel>
                      <InputLabel>{user?.phoneNumber}</InputLabel>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default CancelBookingDetails;
