import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';

// project-imports
import DrawerHeader from './DrawerHeader';
import DrawerContent from './DrawerContent';
import MiniDrawerStyled from './MiniDrawerStyled';

import { DRAWER_WIDTH } from 'config';
import { dispatch, useSelector } from 'store';
import { openDrawer } from 'store/reducers/menu';

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

const MainDrawer = ({ window }) => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('md'));

  const { drawerOpen } = useSelector((state) => state.menu);

  // responsive drawer container
  const container = window !== undefined ? () => window().document.body : undefined;

  // header content
  const drawerContent = useMemo(() => <DrawerContent />, []);
  const drawerHeader = useMemo(() => <DrawerHeader open={drawerOpen} />, [drawerOpen]);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1200 }} aria-label="mailbox folders">
      {!downLG ? (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          {drawerHeader}
          {drawerContent}
        </MiniDrawerStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={drawerOpen}
          onClose={() => dispatch(openDrawer(!drawerOpen))}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundImage: 'none',
              boxShadow: 'inherit'
            }
          }}
        >
          {drawerHeader}
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

MainDrawer.propTypes = {
  open: PropTypes.bool,
  window: PropTypes.object,
  handleDrawerToggle: PropTypes.func
};

export default MainDrawer;
