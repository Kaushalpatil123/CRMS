import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Collapse, Box, Button, Modal } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableChartIcon from '@mui/icons-material/TableChart';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import PeopleIcon from '@mui/icons-material/People';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import CancelIcon from '@mui/icons-material/Cancel';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import LandscapeIcon from '@mui/icons-material/Landscape';
import SchoolIcon from '@mui/icons-material/School';
import PaymentIcon from '@mui/icons-material/Payment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useLocation, useNavigate } from 'react-router';
import ProfilePic from '../assets/images/profile/profilePic.jpg';
import AppLogo from '../assets/images/icons/appLogo.png';
import ClockIcon from '../assets/images/icons/clockIcon.png';
import LogsOut from '../assets/images/icons/logsOut.png';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import toast from 'react-hot-toast';

import axios from 'axios';
const server = process.env.REACT_APP_API_URL;

const Sidebar = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('Dashboard');
  const [time, setTime] = useState(0); // Timer in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [pauseTime, setPauseTime] = useState(0); // Timer for how long it's paused
  const [isPauseTimerActive, setIsPauseTimerActive] = useState(false); // To control the pause timer
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []); // Empty dependency array ensures this runs only once

  console.log(role);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    switch (true) {
      case path.includes('/dashboard/default'):
        setSelectedMenuItem('Dashboard');
        break;
      // case path.includes('/apps/kanban'):
      //   setSelectedMenuItem('Kanban');
      //   break;
      case path.includes('/apps/lead'):
        setSelectedMenuItem('Lead');
        break;
      case path.includes('/apps/quote'):
        setSelectedMenuItem('Quotation');
        break;
      case path.includes('/apps/payment_receipts'):
        setSelectedMenuItem('Payment_Receipts');
        break;
      case path.includes('/apps/invoice'):
        setSelectedMenuItem('Invoice');
        break;

      case path.includes('/apps/user_sessions'):
        setSelectedMenuItem('User_Sessions');
        break;

      case path.includes('/apps/orders/list'):
        setSelectedMenuItem('Order');
        break;

      case path.includes('/apps/users'):
        setSelectedMenuItem('User_Management');
        break;
      case path.includes('/apps/product'):
        setSelectedMenuItem('Products');
        break;

      default:
        setSelectedMenuItem('Dashboard');
        break;
    }
  }, [location.pathname]);

  const handleMenuItemClick = (menuItem) => {
    // Prevent navigation if the page is paused
    if (isPaused) {
      setOpenModal(true);
      return;
    }

    setSelectedMenuItem(menuItem);

    switch (menuItem) {
      case 'Dashboard':
        navigate(`/dashboard/default`);
        break;
      case 'Lead':
        navigate(`/apps/lead`);
        break;
      case 'Quotation':
        navigate(`/apps/quote`);
        break;
      case 'Payment_Receipts':
        navigate('/apps/payment_receipts');
        break;
      case 'Invoice':
        navigate('/apps/invoice/list');
        break;
      case 'User_Sessions':
        navigate('/apps/user_sessions');
        break;
      case 'Order':
        navigate('/apps/orders/list');
        break;
      case 'User_Management':
        navigate('/apps/users');
        break;
      case 'Products':
        navigate('/apps/product');
        break;
      // case 'Purchase':
      //   navigate('/apps/purchase');
      //   break;
      default:
        navigate(`/dashboard/default`);
        break;
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Call the logout activity API first
        const LogoutActivity = await axios.post(
          `${server}/api/userActivity/logout`,
          {},
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('Logout Activity data--->', LogoutActivity?.data);

        // Clean up local storage and provide feedback after successful API call
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        toast.success('Logged out successfully');

        // Optionally reload the window to reset the state
        window.location.reload();
      } catch (error) {
        // Handle any errors from the API call
        console.error('Error during logout activity:', error);
        toast.error('Logout failed. Please try again.');
      }
    }
  };

  // For  Timer

  // Original timer (increments every second unless paused)
  useEffect(() => {
    let timerInterval;
    if (!isPaused) {
      timerInterval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isPaused]);

  // Pause timer (counts how long the user has been in pause mode)
  useEffect(() => {
    let pauseInterval;
    if (isPauseTimerActive) {
      pauseInterval = setInterval(() => {
        setPauseTime((prevPauseTime) => prevPauseTime + 1);
      }, 1000);
    }
    return () => clearInterval(pauseInterval);
  }, [isPauseTimerActive]);

  // Warn the user when they try to reload or close the tab
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isPaused) {
        e.preventDefault();
        e.returnValue = ''; // This triggers the browser's confirmation dialog.
      }
    };

    // Disable page reload (via both manual and keyboard methods)
    const handleKeydown = (e) => {
      if (isPaused && (e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault(); // Disable reload shortcut
      }
    };

    // Add event listeners when paused
    if (isPaused) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('keydown', handleKeydown);
    } else {
      // Remove event listeners when not paused
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeydown);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [isPaused]);

  // Function to handle when the user clicks "Pause"
  const handlePause = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Call the pause activity API first
        const PauseActivity = await axios.post(
          `${server}/api/userActivity/start-break`,
          {},
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('Pause Activity data--->', PauseActivity?.data);

        // After successful API call, proceed with pausing the timer and showing the modal
        setIsPaused(true); // Stop the original timer
        setOpenModal(true); // Show the pause modal
        setPauseTime(0); // Reset the pause timer
        setIsPauseTimerActive(true); // Start the pause timer
      } catch (error) {
        // Handle any errors from the API call
        console.error('Error during pause activity:', error);
        toast.error('Failed to start the break. Please try again.');
      }
    }
  };

  // Function to handle when the user clicks "End Pause"
  const handleEndPause = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Call the pause activity API first
        const EndPauseActivity = await axios.post(
          `${server}/api/userActivity/end-break`,
          {},
          {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('End Pause Activity data--->', EndPauseActivity?.data);

        // After successful API call, proceed with pausing the timer and showing the modal
        setIsPaused(false); // Resume the original timer
        setOpenModal(false); // Close the modal
        setIsPauseTimerActive(false); // Stop the pause timer
      } catch (error) {
        // Handle any errors from the API call
        console.error('Error during End pause activity:', error);
        toast.error('Failed to End the break. Please try again.');
      }
    }
  };

  // Helper function to format time in mm:ss format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'red' }}>
      <Drawer
        variant="permanent"
        sx={{
          backgroundColor: 'white',
          width: 270,
          flexShrink: 0,

          '& .MuiDrawer-paper': {
            width: 270,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0,0,0,0.25)',
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f0f0f0'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#d0d0d0',
              borderRadius: '10px'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#b0b0b0'
            }
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
          className="w-full h-full"
        >
          <Box className="w-full flex items-center justify-center h-[60px] bg-white">
            <Box sx={{ height: '80%', width: '100%' }}>
              <img src={AppLogo} alt="App Logo" className="w-full h-full object-contain" />
            </Box>
          </Box>
          <Box className="flex flex-col items-center justify-center bg-stone-100 py-2">
            <Box className="w-[100px] h-[100px] m-2 p-4 rounded-[50%] overflow-hidden border border-inherit">
              <img src={ProfilePic} alt="Selected" className="object-cover h-full w-full rounded-[50%]" />
            </Box>
            <Box className="px-2">
              <Typography className="text-xl">Hi, Sarbjeet Singh</Typography>
            </Box>

            {/* Timer-------- */}
            <Box className="flex items-center mt-4">
              <Typography className="text-lg">{formatTime(time)}</Typography>

              {/* <Button
                sx={{ borderRadius: '5px' }}
                className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-semibold hover:bg-red-700 hover:text-white font-poppins ml-4"
                onClick={handlePause}
              >
                <Typography>PAUSE</Typography>
              </Button> */}
            </Box>
            <div>
              {isPaused && (
                <div
                  className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
                  style={{ pointerEvents: 'auto' }} // This ensures that only the modal is clickable
                >
                  {/* Disable all clicks outside of modal */}
                </div>
              )}
              {/* Modal that shows when paused */}
              <Modal open={openModal} onClose={() => {}} className="flex items-center justify-center">
                <Box className="bg-white p-4 rounded-md shadow-lg text-center">
                  <Typography variant="h6">Paused</Typography>
                  <Typography className="mt-2 text-lg">{formatTime(pauseTime)}</Typography> {/* Show pause timer */}
                  <Button variant="contained" color="secondary" onClick={handleEndPause} className="mt-4">
                    End Pause
                  </Button>
                </Box>
              </Modal>
            </div>

            {/* -------- */}
          </Box>
          <Box className="bg-white">
            <Typography variant="h6" sx={{ padding: '0.5rem 0', fontWeight: 'bold' }} className="pl-2 mt-6">
              MAIN MENU
            </Typography>
            <List sx={{ padding: 0 }} className="flex flex-col gap-2">
              <ListItem
                button
                onClick={() => handleMenuItemClick('Dashboard')}
                sx={{
                  padding: '15px 0 15px 12px',

                  color: selectedMenuItem === 'Dashboard' ? 'white' : 'inherit',

                  backgroundColor: selectedMenuItem === 'Dashboard' ? '#779E40' : 'rgb(247,247,247)',
                  '&:hover': {
                    backgroundColor: selectedMenuItem === 'Dashboard' ? '#779E40' : 'rgba(247,247,247)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selectedMenuItem === 'Dashboard' ? '#779E40' : 'inherit',
                    backgroundColor: selectedMenuItem === 'Dashboard' ? '#779E40' : 'inherit',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '0.5rem',
                    borderRadius: '5px',
                    width: '30px',
                    height: '30px'
                  }}
                >
                  <DashboardIcon
                    className={`${selectedMenuItem === 'Dashboard' ? 'text-black' : 'bg-stone-100'}`}
                    sx={{ fontSize: '20px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="DASHBOARD" />
              </ListItem>
            </List>
          </Box>
          <Box className="bg-white">
            {/* <Box className='pl-2'> */}
            <Typography variant="h6" sx={{ padding: '0.5rem 0', fontWeight: 'bold' }} className="pl-2 mt-5">
              CRM
            </Typography>
            <List sx={{ padding: '0 18px 0 6px', backgroundColor: 'rgba(247,247,247)' }} className="flex flex-col gap-2">
              <ListItem
                button
                onClick={() => handleMenuItemClick('Lead')}
                sx={{
                  borderRadius: '5px',
                  padding: 0,
                  marginLeft: '8px',
                  color: 'inherit',
                  backgroundColor: selectedMenuItem === 'Lead' ? '#C7DBA0' : 'rgba(247,247,247)',
                  '&:hover': {
                    backgroundColor: selectedMenuItem === 'Lead' ? '#C7DBA0' : 'rgba(247,247,247)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selectedMenuItem === 'Lead' ? '#779E40' : 'inherit',
                    backgroundColor: selectedMenuItem === 'Lead' ? '#779E40' : 'inherit',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '0.5rem',
                    borderRadius: '5px',
                    width: '30px',
                    height: '30px'
                  }}
                >
                  <TrendingUpIcon className={`${selectedMenuItem === 'Lead' ? 'text-white' : 'bg-stone-100'}`} sx={{ fontSize: '20px' }} />
                </ListItemIcon>
                <ListItemText primary="ALL LEADS" />
              </ListItem>
             
            </List>
          </Box>
          <Box className="mb-8">
            <Typography variant="h6" sx={{ padding: '0.5rem 0', fontWeight: 'bold' }} className="pl-2">
              ORDERS
            </Typography>
            <List sx={{ padding: '0 18px 0 6px', backgroundColor: 'rgba(247,247,247)' }} className="flex flex-col gap-2">
              <ListItem
                button
                onClick={() => handleMenuItemClick('Order')}
                sx={{
                  borderRadius: '5px',
                  marginLeft: '8px',
                  padding: 0,
                  color: 'inherit',
                  backgroundColor: selectedMenuItem === 'Order' ? '#C7DBA0' : 'rgba(247,247,247)',
                  '&:hover': {
                    backgroundColor: selectedMenuItem === 'Order' ? '#C7DBA0' : 'rgba(247,247,247)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selectedMenuItem === 'Order' ? '#779E40' : 'inherit',
                    backgroundColor: selectedMenuItem === 'Order' ? '#779E40' : 'inherit',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '0.5rem',
                    borderRadius: '5px',
                    width: '30px',
                    height: '30px'
                  }}
                >
                  <EmojiPeopleIcon
                    className={`${selectedMenuItem === 'Order' ? 'text-white' : 'bg-stone-100'}`}
                    sx={{ fontSize: '20px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="ALL ORDERStyu" />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ padding: '0.5rem 0', fontWeight: 'bold' }} className="pl-2 mt-5">
              ALL USERS
            </Typography>
            <List sx={{ padding: '0 18px 0 6px', backgroundColor: 'rgba(247,247,247)' }} className="flex flex-col gap-2">
              <ListItem
                button
                onClick={() => handleMenuItemClick('User_Management')}
                sx={{
                  borderRadius: '5px',
                  marginLeft: '8px',
                  padding: 0,
                  color: 'inherit',
                  backgroundColor: selectedMenuItem === 'User_Management' ? '#C7DBA0' : 'rgba(247,247,247)',
                  '&:hover': {
                    backgroundColor: selectedMenuItem === 'User_Management' ? '#C7DBA0' : 'rgba(247,247,247)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selectedMenuItem === 'User_Management' ? '#779E40' : 'inherit',
                    backgroundColor: selectedMenuItem === 'User_Management' ? '#779E40' : 'inherit',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '0.5rem',
                    borderRadius: '5px',
                    width: '30px',
                    height: '30px'
                  }}
                >
                  <EmojiPeopleIcon
                    className={`${selectedMenuItem === 'User_Management' ? 'text-white' : 'bg-stone-100'}`}
                    sx={{ fontSize: '20px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="User Management" />
              </ListItem>
            </List>

            {/* Products */}

            <Typography variant="h6" sx={{ padding: '0.5rem 0', fontWeight: 'bold' }} className="pl-2 mt-5">
              ALL Products
            </Typography>
            <List sx={{ padding: '0 18px 0 6px', backgroundColor: 'rgba(247,247,247)' }} className="flex flex-col gap-2">
              <ListItem
                button
                onClick={() => handleMenuItemClick('Products')}
                sx={{
                  borderRadius: '5px',
                  marginLeft: '8px',
                  padding: 0,
                  color: 'inherit',
                  backgroundColor: selectedMenuItem === 'Products' ? '#C7DBA0' : 'rgba(247,247,247)',
                  '&:hover': {
                    backgroundColor: selectedMenuItem === 'Products' ? '#C7DBA0' : 'rgba(247,247,247)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selectedMenuItem === 'Products' ? '#779E40' : 'inherit',
                    backgroundColor: selectedMenuItem === 'Products' ? '#779E40' : 'inherit',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '0.5rem',
                    borderRadius: '5px',
                    width: '30px',
                    height: '30px'
                  }}
                >
                  <EmojiPeopleIcon
                    className={`${selectedMenuItem === 'Products' ? 'text-white' : 'bg-stone-100'}`}
                    sx={{ fontSize: '20px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Products" />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ padding: '0.5rem 0', fontWeight: 'bold' }} className="pl-2 mt-5">
              FINANCE
            </Typography>
            <List sx={{ padding: '0 18px 0 6px', backgroundColor: 'rgb(247,247,247)' }} className="flex flex-col gap-2">
              <ListItem
                button
                onClick={() => handleMenuItemClick('Invoice')}
                sx={{
                  borderRadius: '5px',
                  marginLeft: '8px',
                  padding: 0,
                  color: 'inherit',
                  backgroundColor: selectedMenuItem === 'Invoice' ? '#C7DBA0' : 'rgb(247,247,247)',
                  '&:hover': {
                    backgroundColor: selectedMenuItem === 'Invoice' ? '#C7DBA0' : 'rgb(247,247,247)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selectedMenuItem === 'Invoice' ? '#779E40' : 'inherit',
                    backgroundColor: selectedMenuItem === 'Invoice' ? '#779E40' : 'inherit',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '0.5rem',
                    borderRadius: '5px',
                    width: '30px',
                    height: '30px'
                  }}
                >
                  <EmojiPeopleIcon
                    className={`${selectedMenuItem === 'Invoice' ? 'text-white' : 'bg-stone-100'}`}
                    sx={{ fontSize: '20px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="INVOICE" />
              </ListItem>
              <ListItem
                button
                onClick={() => handleMenuItemClick('Quotation')}
                sx={{
                  borderRadius: '5px',
                  marginLeft: '8px',
                  padding: 0,
                  color: 'inherit',
                  backgroundColor: selectedMenuItem === 'Quotation' ? '#C7DBA0' : 'rgb(247,247,247)',
                  '&:hover': {
                    backgroundColor: selectedMenuItem === 'Quotation' ? '#C7DBA0' : 'rgb(247,247,247)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selectedMenuItem === 'Quotation' ? '#779E40' : 'inherit',
                    backgroundColor: selectedMenuItem === 'Quotation' ? '#779E40' : 'inherit',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '0.5rem',
                    borderRadius: '5px',
                    width: '30px',
                    height: '30px'
                  }}
                >
                  <RequestQuoteIcon
                    className={`${selectedMenuItem === 'Quotation' ? 'text-white' : 'bg-stone-100'}`}
                    sx={{ fontSize: '20px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="QUOTATION" />
              </ListItem>
              <ListItem
                button
                onClick={() => handleMenuItemClick('Payment_Receipts')}
                sx={{
                  borderRadius: '5px',
                  marginLeft: '8px',
                  padding: 0,
                  color: 'inherit',
                  backgroundColor: selectedMenuItem === 'Payment_Receipts' ? '#C7DBA0' : 'rgb(247,247,247)',
                  '&:hover': {
                    backgroundColor: selectedMenuItem === 'Payment_Receipts' ? '#C7DBA0' : 'rgb(247,247,247)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selectedMenuItem === 'Payment_Receipts' ? '#779E40' : 'inherit',
                    backgroundColor: selectedMenuItem === 'Payment_Receipts' ? '#779E40' : 'inherit',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '0.5rem',
                    borderRadius: '5px',
                    width: '30px',
                    height: '30px'
                  }}
                >
                  <RequestQuoteIcon
                    className={`${selectedMenuItem === 'Payment_Receipts' ? 'text-white' : 'bg-stone-100'}`}
                    sx={{ fontSize: '20px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="PAYMENT RECEIPTS" />
              </ListItem>
            </List>

            {role === '"Admin"' && (
              <>
                <Typography variant="h6" sx={{ padding: '0.5rem 0', fontWeight: 'bold' }} className="pl-2 mt-5">
                  USER WORKING SESSIONS
                </Typography>
                <List sx={{ padding: '0 18px 0 6px', backgroundColor: 'rgb(247,247,247)' }} className="flex flex-col gap-2">
                  <ListItem
                    button
                    onClick={() => handleMenuItemClick('User_Sessions')}
                    sx={{
                      borderRadius: '5px',
                      marginLeft: '8px',
                      padding: 0,
                      color: 'inherit',
                      backgroundColor: selectedMenuItem === 'User_Sessions' ? '#C7DBA0' : 'rgb(247,247,247)',
                      '&:hover': {
                        backgroundColor: selectedMenuItem === 'User_Sessions' ? '#C7DBA0' : 'rgb(247,247,247)'
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: selectedMenuItem === 'User_Sessions' ? '#779E40' : 'inherit',
                        backgroundColor: selectedMenuItem === 'User_Sessions' ? '#779E40' : 'inherit',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: '0.5rem',
                        borderRadius: '5px',
                        width: '30px',
                        height: '30px'
                      }}
                    >
                      <EmojiPeopleIcon
                        className={`${selectedMenuItem === 'User_Sessions' ? 'text-white' : 'bg-stone-100'}`}
                        sx={{ fontSize: '20px' }}
                      />
                    </ListItemIcon>
                    <ListItemText primary="USER WORKING SESSIONS" />
                  </ListItem>
                </List>
              </>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '20px',
              justifyContent: 'flex-end',
              paddingY: '30px',
              marginTop: 'auto'
            }}
          >
            <Box
              sx={{
                width: '75%',
                margin: 'auto',
                paddingX: '2px',
                height: '35px',
                backgroundColor: '#f38866',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                borderRadius: '10px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#e0785d'
                }
              }}
              onClick={handlePause}
            >
              <Box className="h-[40px] w-[40px] bg-white rounded-[50%] p-1 flex items-center justify-center ml-1">
                <img src={ClockIcon} alt="clock" className="rounded-[50%] h-full w-full object-contain" />
              </Box>
              <Typography className="font-[450]">BREAK</Typography>
              <Box className="h-[25px] w-[25px] bg-white rounded-[50%] p-2 flex items-center justify-center mr-5">
                <Box>
                  <ExpandCircleDownOutlinedIcon sx={{ color: 'gray', padding: '2px' }} />
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                width: '75%',
                margin: 'auto',
                paddingX: '2px',
                height: '35px',
                backgroundColor: '#f63642',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
              onClick={handleLogout}
            >
              <Box className="h-[40px] w-[40px] bg-white rounded-[50%] p-2 flex items-center justify-center ml-1">
                <img src={LogsOut} alt="logout" className="rounded-[50%] h-full w-full object-contain" />
              </Box>
              <Typography className="font-[450] text-white">LOG OUT</Typography>

              <Box className="mr-10"></Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
