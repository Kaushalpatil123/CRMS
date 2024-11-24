import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Stack, Typography, InputLabel, Card, CardContent, Grid } from '@mui/material';
import { Trash, Eye} from 'iconsax-react';
import IconButton from '../../../components/@extended/IconButton';
import { Link } from 'react-router-dom';
import GoBack from '../components/GoBack';

const server = process.env.REACT_APP_API_URL;

const SchoolDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [decodedPass, setdecodedPass] = useState('');
  const [open, setOpen] = useState(false);
  const [showpass, setshowpass] = useState(false);

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



  useEffect(() => {
    const handleOpenViewModal = async (id) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${server}/api/admin/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('response open view--->', response);

        // Assuming your raw body response is plain text
        const responseDataCart = response.data;
        const responseData = response.data.data;
        setDetails(responseData);

        console.log('This is view response data', responseData);
      } catch (error) {
        console.error('Error fetching User details:', error);
      }
    };
    handleOpenViewModal(id);
  }, [id]);
  return (
    <>
      <Grid item xs={12} md={12}>
        <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardContent>
            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mb: 2, mt: 2 }}>
              <Grid item xs={6} className="flex">
                <GoBack/>
                <Typography variant="h4">School Information</Typography>
              </Grid>
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <InputLabel>Institution Id</InputLabel>
                <Typography>{details?.institutionId}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Institution Name</InputLabel>
                <Typography>{details?.institutionName}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Username</InputLabel>
                <Typography>{details?.userName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Email</InputLabel>
                <Typography>{details?.institutionemailId}</Typography>
              </Grid>
            </Grid>

           
            <Grid container spacing={3} sx={{ marginTop: '5px' }}>
              <Grid item xs={6}>
                <InputLabel>City</InputLabel>
                <Typography>{details?.city}</Typography>
              </Grid>
              <Grid item xs={6}>
                <InputLabel>State</InputLabel>
                <Typography>{details?.state}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Country </InputLabel>
                <Typography>{details?.country}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Pincode </InputLabel>
                <Typography>{details?.pincode}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Address 1 </InputLabel>
                <Typography>{details?.address1}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Address 2</InputLabel>
                <Typography>{details?.address2}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Contact Person Name</InputLabel>
                <Typography>{details?.contactpersonname}</Typography>
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Contact Person Email </InputLabel>
                <Typography>{details?.contactpersonemailId}</Typography>
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Contact Person Phone Number </InputLabel>
                <Typography>{details?.contactpersonphoneNumber}</Typography>
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Geolocation</InputLabel>
                <Typography>
                  <Link to={details?.googlemaplink} className="flex items-center" target="_blank">
                    <span className="truncate">{details?.googlemaplink}</span>
                    {/* <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded">View on Map</button> */}
                  </Link>
                </Typography>
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
                        handleButtonClick(details?._id);
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
    </>
  );
};

export default SchoolDetails;
