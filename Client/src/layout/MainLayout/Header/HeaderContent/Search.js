import React from 'react';
import { Box, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 2 } }}>
      {/* <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
        <div className="flex">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-500"
            style={{
              backgroundColor: 'white',
              width: '100px',
              padding: '5px',
              color: 'black',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              textTransform: 'none'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" className="stroke-blue-300 mr-1">
              <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" d="M11 6L5 12M5 12L11 18M5 12H19"></path>
            </svg>
            Go Back
          </button>
        </div>
      </FormControl> */}
    </Box>
  );
};

export default Search;
