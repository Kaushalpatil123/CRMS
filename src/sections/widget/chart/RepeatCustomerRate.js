import { useState } from 'react';

// material-ui&&&&&&
import { Menu, MenuItem, Stack, Typography, Box, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

//projects &&&&&&&
import RepeatCustomerChart from './RepeatCustomerChart';
import MainCard from 'components/MainCard';



const RepeatCustomerRate = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("Last 12 months"); 
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null); 
  };

  const handleMenuItemClick = (filter) => {
    setSelectedFilter(filter);
    handleClose();
  };

  return (
    <MainCard>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Typography variant="h5" sx={{ fontSize: '1.125rem', fontWeight: 600 }} >Repeat Customer Rate</Typography>
        <Box>
          <Button
            variant="outlined"
            color="inherit"
            id="filter-button"
            aria-controls={open ? 'filter-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ border: '1px solid #E5E7EB', py: '0.5rem'}}
          
          >
            {selectedFilter}
          </Button>
          <Menu
            id="filter-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
           
            MenuListProps={{
              'aria-labelledby': 'filter-button',
              sx: { p: 1.25, minWidth: 150 }
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <MenuItem onClick={() => handleMenuItemClick('Last 3 months')}>Last 3 months</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Last 6 months')}>Last 6 months</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Last 12 months')}>Last 12 months</MenuItem>
          </Menu>
        </Box>
      </Stack>

      {/* Chart component repeatCustomerChart************************************/}
      <RepeatCustomerChart selectedFilter={selectedFilter} />
    </MainCard>
  );
};

export default RepeatCustomerRate;
