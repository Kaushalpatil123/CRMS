import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Link, Stack, Typography } from '@mui/material';

// ==============================|| MAIN LAYOUT - FOOTER ||============================== //

const Footer = () => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: '24px 16px 0px', mt: 'auto' }}>
    <Typography variant="caption">&copy; CRM</Typography>
    
  </Stack>
);

export default Footer;
