import React from 'react'
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GoBack = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
      navigate(-1);
    };
  return (
    <div className='items-center align-middle mr-3 pt-1'>
      <button onClick={handleGoBack}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" className="stroke-black">
          <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" d="M11 6L5 12M5 12L11 18M5 12H19"></path>
        </svg>
      </button>
      {/* <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
          <button
            onClick={handleGoBack}
            className="flex items-center text-black"
            style={{
              backgroundColor: 'white',
              // width: '100px',
              padding: '5px',
              color: 'black',
            //   boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              textTransform: 'none'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" className="stroke-black mr-1">
              <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" d="M11 6L5 12M5 12L11 18M5 12H19"></path>
            </svg>
            
          </button>
      </FormControl> */}
    </div>
  );
}

export default GoBack