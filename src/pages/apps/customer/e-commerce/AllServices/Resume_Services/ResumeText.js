import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  Fade,
  Grid,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';
import { PDFDownloadLink } from '@react-pdf/renderer';

// project-imports
// import CustomerPreview from 'sections/apps/customer/CustomerPreview';
// import CustomerPreview from './CustomerPreview';
// import AlertCustomerDelete from './AlertCustomerDelete';

import AddCustomer from 'sections/apps/customer/AddCustomer';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { PopupTransition } from 'components/@extended/Transitions';
// import ListSmallCard from './export-pdf/ListSmallCard';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// assets
import { CallCalling, Link2, Location, More, Sms } from 'iconsax-react';
import axios from 'axios'
import { Edit } from '@mui/icons-material';
const avatarImage = require.context('assets/images/users', true);

// ==============================|| CUSTOMER - CARD ||============================== //
const server = process.env.REACT_APP_API_URL;

const ResumeText = () => {
    const customer ={
        about:'this is about',
        country:"india",
        firstName:'nandkishore',
        lastname:'chhimpa',
        fatherName:'ratan lal ji chhimpa',
        skills:["C++","C++","C++","C++","C++","C++",],
        time:"200 yrs ago",
        role:'softwaare develoer',
        email:'nkempire@gmail.com',
        contact:'+98551513232',
        avatar:'sadfasdfasd',
    





    }
  const [open, setOpen] = useState(false);
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(false);

    // Edit Code starting from here
    const [editPrice, setEditPrice] = useState();
    const [editId, setEditId] = useState()
    const [editPlanName, setEditPlanName]= useState();
    const [editPlanArray, setEditPlanArray] = useState([]);
    // Define a state variable to track whether data has been updated
    const [dataUpdated, setDataUpdated] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState();
    const [selectedPlanName, setSelectedPlanName] = useState();
    const [serviceKey, setServiceKey]= useState('')
    const [currentPlanPrice, setCurrentPlanPrice] = useState('');


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    handleMenuClose();
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [add, setAdd] = useState(false);
  const handleAdd = () => {
    setAdd(!add);
  };

  //Fetch Data 
  useEffect(() => {
    const getService = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${server}/api/buytextresumeservice/plans`);
        if (response.data.status !== "success") {
          throw new Error();
        }
        setService(response.data?.plans);
        setEditPlanArray(response.data?.plans);
        console.log(response.data);
      } catch (error) {
        toast.error('Error occured');
        console.log('ERROR IN TEXTRESUME .....', error);
      }
      setLoading(false);
    }
    getService();  
  }, [])

  //Handle Edit Submit
 async function handleSubmit(e){
    const token = localStorage.getItem('token');
    console.log("this is token ",token);
    e.preventDefault();
   console.log('this is the ID of Plan', editId)
    // console.log('this is Price', editPrice);
    // console.log('this is plan Name/Option Name', editPlanName);

    const requestData = {
      price:currentPlanPrice
    }
    console.log("this is request|Data in Highlight resume", requestData);
    console.log('this is serviceKey', serviceKey)

    try {
      const response = await axios.put(`${server}/api/buytextresumeservice/update/${serviceKey}/${editId}`,requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status !== 200) {
        throw new Error();
      }

      toast.success("Price Updated Successfully");

         handleAdd();
         setTimeout(() => {
           window.location.reload();
         }, 4000);
         
      console.log("this the response", response);
    } catch (error) {
      toast.error('Error occured');
      console.log('ERROR IN TEXTRESUME .....', error);
    }
  // Close the dialog box
  // handleAdd(); 
  // fetchUpdatedData();
  }


  // Fetch Updated Data
//   const fetchUpdatedData = async()=>{

//     try {
//       const response = await axios.get(`${server}/api/buytextresumeservice/plans`);
//       if (response.status !== 200) {
//         throw new Error();
//       }
//       setService(response.data?.plans);
//       setEditPlanArray(response.data?.plans);
//       console.log(response.data);
//     } catch (error) {
//       toast.error('Error occured');
//       console.log('ERROR IN TEXTRESUME .....', error);
//     }


// }
  function findPrice(serviceLevelName, planName) {

    console.log("Service Level Name Parameter value", serviceLevelName);
    console.log("Plan Name Parameter value", planName);
    // Format the service level name to match the serviceName in editPlanArray
    const formattedServiceName = serviceLevelName.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word).join('');
    setServiceKey(formattedServiceName);
    console.log("formattedServicName", formattedServiceName);
    // Find the service by its name

    const serviceLevel = editPlanArray?.find(service => service.serviceName === serviceLevelName);
    console.log("Service Level", serviceLevel); // Print serviceLevel to console
    if (serviceLevel && serviceLevel.plans) { 
      // Check if the planName exists in the plans object of the service
      const plan = serviceLevel.plans[formattedServiceName];
      if (plan && plan.length > 0) {
        // Get the first plan price from the array of plans (assuming there could be multiple plans with the same name)
        const planPrice = plan.find(plan => plan.planName === planName)?.price;
        const planId = plan.find(plan => plan.planName === planName)?._id;


        if (planPrice) {
          // Update the price
          setCurrentPlanPrice(planPrice);
          setEditId(planId);
          console.log("Plan Price", planPrice);
        } else {
          console.log("Plan not found for the given name");
        }
      } else {
        console.log("No plans found for the given service level");
      }
    } else {
      console.log("Service level not found");
    }
  }
  
  



 
  
  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton edge="end" aria-label="comments" color="secondary"  onClick={()=>{
                    // setEditPrice(service?.price);
                      // setEditPlanName(service?.serviceName);
                      setEditId(service?._id);
                      handleAdd();

                  }}>
                    <div className='py-[3px] px-4 border-[2px] border-gray-200 rounded-md cursor-pointer hover:shadow' 
                    onClick={()=>{
                      // setEditPrice(service?.price);
                      // setEditPlanName(service?.serviceName);
                      setEditId(service?._id);
                      handleAdd();
                    }
                    }>
              Edit
            </div>
                  </IconButton>
                }
              >
                {/* <ListItemAvatar>
                  <Avatar alt={customer.fatherName} src={avatarImage(`./avatar-${!customer.avatar ? 1 : customer.avatar}.png`)} />
                </ListItemAvatar> */}
                <ListItemText
                  primary={<Typography variant="h4" className='text-orange-600'>Text Resume Services</Typography>}
                //   secondary={<Typography color="text.secondary">{customer.role}</Typography>}
                />
              </ListItem>
              <ListItemText
                  primary={<Typography variant="h4">{service?.price}</Typography>}
                //   secondary={<Typography color="text.secondary">{customer.role}</Typography>}
                />
          
            </List>
             
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {/* <Grid item xs={12}>
            <Typography>Hello, {customer.about}</Typography>
          </Grid> */}
          <Grid item xs={12}>
            <Grid container spacing={1} direction={{ xs: 'column', md: 'row' }}>
              {/* <Grid item xs={12}>
              <Typography variant="h5">Plan Details:-</Typography>
              <List
                component="nav"
                sx={{
                    py: 0,
                    '& .MuiListItemButton-root': {
                    '& .MuiListItemSecondaryAction-root': { position: 'relative' }
                    }
                }}
                >
                
                   {service?.plans?.map((plan,index)=>(

                    <div className="w-full mt-2 px-2 h-auto flex flex-col   justify-between border-[1px] text-[16px] rounded-md border-gray-100 py-2 mx-2 ">
                      <div className="w-full flex flex-row justify-between align-middle items-center">
                        <div>{plan.planName}</div>
                        <div className='hover:underline text-[14px] text-gray-400 px-[4px] rounded-md border-[1px] hover:shadow cursor-pointer py-[2px] '  onClick={handleAdd}>Edit</div>
                      </div>
                      <div>INR {plan.price}/-</div>  

                    </div>

                      
                     ))
                   }          
               
                </List>
              </Grid> */}


        <table className=' text-[13px]'>
            <thead className='bg-gray-200 '>
              <tr>
                <th className='text-left py-2   pl-1'>Level</th>
                <th className='text-center py-2 px-1'>Regular</th>
                <th className='text-center py-2 px-1'>Express</th>
                <th className='text-center py-2 px-1'>Super Express</th>
              </tr>
            </thead>
            <tbody>
            {service.map((item, index) => (
      <tr key={item._id} class="border-b border-blue-gray-200 ">
        <td className='text-left py-2 '>{item.serviceName}</td>
        {/* Regular */}
        <td className='text-center py-2'>
          INR {item.plans[item.serviceName.replace(/\s+/g, '').toLowerCase()[0].toLowerCase() + item.serviceName.replace(/\s+/g, '').slice(1)]?.find(plan => plan.planName === 'Regular')?.price}/-
        </td>
        {/* Express */}
        <td className='text-center py-2 '> 
          INR {item.plans[item.serviceName.replace(/\s+/g, '').toLowerCase()[0].toLowerCase() + item.serviceName.replace(/\s+/g, '').slice(1)]?.find(plan => plan.planName === 'Express')?.price}/-
        </td>
        {/* Super Express */}
        <td className='text-center py-2'>
          INR {item.plans[item.serviceName.replace(/\s+/g, '').toLowerCase()[0].toLowerCase() + item.serviceName.replace(/\s+/g, '').slice(1)]?.find(plan => plan.planName === 'Super Express')?.price}/-
        </td>
      </tr>
    ))}
         </tbody>
        </table>

             
            </Grid>
          </Grid>
         
        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
        >
          <Typography variant="caption" color="text.secondary">
            {/* Last Updated {service?.updatedAt}  */}
          </Typography>
         
        </Stack>
      </MainCard>

      {/* edit customer dialog */}
      <Dialog
        maxWidth="sm"
        fullWidth
        TransitionComponent={PopupTransition}
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 } }}
      >
              <div>

          <DialogTitle>Edit Pricing</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
            <form onSubmit={handleSubmit}>

            <Grid container spacing={3}>

              <Grid item xs={12} >
                
                {/* Map over the entryLevel array of each service to display plan details */}
             
                  <Stack spacing={1.25} >
            
                  <InputLabel id="demo-simple-select-label">Select Level Name</InputLabel>
                  <Select labelId="demo-simple-select-label" id="demo-simple-select"  placeholder="Select Level "
                   onChange={(e)=>setSelectedLevel(e.target.value)}
                   >
                    <MenuItem value="Entry Level" name="Entry Level">Entry Level</MenuItem>
                    <MenuItem value="Middle Level" name="Middle Level">Middle Level</MenuItem>
                    <MenuItem value="Senior Level" name="Senior Level">Senior Level</MenuItem>
                    <MenuItem value="Executive Level" name="Executive Level">Executive Level</MenuItem>
          
                  </Select>
    
                  </Stack>
                  <Stack spacing={1.25} >
            
                  <InputLabel id="demo-simple-select-label">Select Plan Name</InputLabel>
                  <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  placeholder="Select Plan Name"
                  onChange={(e) => {
                    setSelectedPlanName(e.target.value);
                    findPrice(selectedLevel, e.target.value); // Pass selectedLevel and planName
                  }}
                >
                  <MenuItem value="Regular" name="Regular">Regular</MenuItem>
                  <MenuItem value="Express" name="Express">Express</MenuItem>
                  <MenuItem value="Super Express" name="Super Express">Super Express</MenuItem>
                </Select>
    
                  </Stack>
                  <Stack spacing={1.25}>
                  <InputLabel htmlFor="customer-name">Enter New Price</InputLabel>
                  <TextField
                    fullWidth
                    id="customer-name"
                    placeholder="Enter price of plan"
                    onChange={(e) => setCurrentPlanPrice(e.target.value)}
                    value={currentPlanPrice}
                  />
                </Stack>


                
                
              </Grid>
          
                
            </Grid>

          <Grid container justifyContent="space-between" alignItems="center" className="mt-2">
          <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button color="error" onClick={handleAdd}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" className="bg-blue-600 text-white hover:text-blue-600 hover:bg-white ">
                    Save
                  </Button>
                </Stack>
              </Grid>
          </Grid>
            </form>

            </DialogContent>
              </div>
             
        {/* <AddCustomer service={service} onCancel={handleAdd} /> */}
      </Dialog>

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
        style={{ color: '#fff' }}
      />
      
    </>
  );
};


export default ResumeText;
