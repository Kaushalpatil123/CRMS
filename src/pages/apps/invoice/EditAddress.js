import React, { useState } from 'react';
import {
  Box,
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  styled
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import PrintIcon from '@mui/icons-material/Print';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';

const EditAddress = ({ open, handleClose, closeDialog, setAddress, setIsAddressSaved, address, setAddressList, addressList }) => {
  //   const TextField = styled(TextField)(({ theme }) => ({
  //     backgroundColor: 'white',
  //     borderRadius: '10px'
  //   }));

  const StyledSelect = styled(Select)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: '3px'
  }));
  const [newAddr, setNewAddr] = useState(address);

  const handleSave = () => {
    console.log('button dabela');
    setAddress(newAddr);
    let existingIndex = -1;
    existingIndex = addressList.findIndex((e) => e.type === newAddr.type);
    if (existingIndex != -1) {
      const arr = [...addressList];
      arr[existingIndex] = newAddr;
      setAddressList(arr);
      console.log('1');
    } else {
      console.log('2', existingIndex);
      setAddressList([...addressList, newAddr]);
    }
    setIsAddressSaved(true);
    closeDialog();
  };
  const handleChange = (event) => {
    setNewAddr({ ...newAddr, [event.target.name]: event.target.value });
  };
  const handleSelectChange = (event) => {
    setNewAddr({ ...newAddr, type: event.target.value });
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-address-popup-title"
        sx={{
          '& .MuiDialog-paper': { width: '30vw', maxWidth: '30vw', backgroundColor: '#E7E5E4' }
        }}
      >
        <DialogTitle id="edit-address-popup-title">
          <Grid container alignItems="center">
            <Grid item xs={8} lg={8}>
              <Typography className="font-semibold text-2xl">Edit Address</Typography>
            </Grid>

            <Grid item xs={1} lg={1}>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500]
                }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent dividers>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} marginBottom={2}>
                <Typography variant="body1" paddingBottom={1}>
                  Title
                </Typography>
                {/* <TextField
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  fullWidth
                  placeholder="Office"
                  name="type"
                  value={newAddr.type}
                  onChange={handleChange}
                /> */}
                <Select
                  label="Type"
                  value={newAddr?.type || ''}
                  onChange={handleSelectChange}
                  sx={{ backgroundColor: 'white', borderRadius: 1, width: '50%' }}
                >
                  <MenuItem key="Home" value="Home">
                    Home
                  </MenuItem>
                  <MenuItem key="Office" value="Office">
                    Office
                  </MenuItem>
                  <MenuItem key="Others" value="Others">
                    Others
                  </MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} marginBottom={2}>
                <Typography variant="body1" paddingBottom={1}>
                  Address
                </Typography>
                <TextField
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  fullWidth
                  placeholder="Line1"
                  className="mb-2"
                  name="address1"
                  value={newAddr.address1}
                  onChange={handleChange}
                />
                <TextField
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  fullWidth
                  placeholder="Line2"
                  name="address2"
                  value={newAddr.address2}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} lg={6} marginBottom={2}>
                <Typography variant="body1" paddingBottom={1}>
                  City
                </Typography>
                <TextField
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  fullWidth
                  name="city"
                  value={newAddr.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} lg={6} marginBottom={2}>
                <Typography variant="body1" paddingBottom={1}>
                  Country
                </Typography>
                <StyledSelect fullWidth name="country" value={newAddr.country} onChange={handleChange}>
                  <MenuItem value="India">India</MenuItem>
                </StyledSelect>
              </Grid>
              <Grid item xs={12} lg={6} marginBottom={2}>
                <Typography variant="body1" paddingBottom={1}>
                  State
                </Typography>
                <StyledSelect fullWidth name="state" value={newAddr.state} onChange={handleChange}>
                  <MenuItem value="Bihar">Bihar</MenuItem>
                </StyledSelect>
              </Grid>
              <Grid item xs={12} lg={6} marginBottom={5}>
                <Typography variant="body1" paddingBottom={1}>
                  Pincode
                </Typography>
                <TextField
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  fullWidth
                  name="pincode"
                  value={newAddr.pincode}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} lg={6} marginBottom={5}>
                <Typography variant="body1" paddingBottom={1}>
                  pincode
                </Typography>
                <TextField
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  fullWidth
                  name="pincode"
                  value={newAddr.pincode}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} lg={3} container alignItems="center" justifyContent="flex-start">
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<DoneIcon />}
                  size="small"
                  sx={{ ml: 0, px: 3, py: 1, borderRadius: '5px' }}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditAddress;
