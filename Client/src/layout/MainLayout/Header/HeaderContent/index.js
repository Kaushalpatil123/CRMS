import { useMemo } from 'react';

// material-ui
import { Box, useMediaQuery, Button } from '@mui/material';

// project-imports
import Search from './Search';
import Message from './Message';
import Profile from './Profile';
import Localization from './Localization';
import Notification from './Notification';
import MobileSection from './MobileSection';
import MegaMenuSection from './MegaMenuSection';

import useConfig from 'hooks/useConfig';
import DrawerHeader from 'layout/MainLayout/Drawer/DrawerHeader';
import { MenuOrientation } from 'config';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { i18n, menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const localization = useMemo(() => <Localization />, [i18n]);

  const megaMenu = useMemo(() => <MegaMenuSection />, []);

  const server = process.env.REACT_APP_API_URL;

  const fetchDataFromApi = async () => {
    try {
      const response = await fetch(`${server}/api/exel/downloadExcel`); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('response blob-->', response.url);

      // Create a link element
      const link = document.createElement('a');
      link.href = response.url;
      link.download = 'data.csv'; // Specify a filename for the downloaded file
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      console.log('CSV file downloaded successfully');

      // Handle data processing or state update if needed
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error state or display error message to user
    }
  };

  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
      {!downLG && <Search />}

        {localStorage.getItem('role') === 'superadmin' && (
      <Button
        variant="gradient"
        className="flex items-center gap-3 bg-blue-500 hover:bg-blue-400 hover:text-white"
        onClick={fetchDataFromApi}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          style={{ height: '32px', width: '32px' }}
          className="text-white hover:text-white "
          
               
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
          />
        </svg>
        Export
      </Button>
        )}

      {/* {!downLG && megaMenu} */}
      {!downLG && localization}
      {/* {downLG && <Box sx={{ width: '100%', ml: 1 }} />} */}

      {/* <Notification /> */}
      {/* <Message /> */}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
};

export default HeaderContent;
