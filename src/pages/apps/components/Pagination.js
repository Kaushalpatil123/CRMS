

import { Box, Button, IconButton } from '@mui/material';
import React, { useMemo } from 'react';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import { DRAWER_WIDTH } from 'config';


// const Pagination = ({ currentPage, totalCount, handleChangePage, rowsPerPage, handleRowsPerPageChange }) => {
//   // Calculate total pages
//   const totalPages = Math.ceil(totalCount / rowsPerPage);

//   // Memoize the pages array to avoid recalculating on every render
//   const pages = useMemo(() => {


    
//     const pagesArray = [];
//     for (let i = 1; i <= totalPages; i++) {
//       pagesArray.push(i);
//     }
//     return pagesArray;
//   }, [totalCount, rowsPerPage]);

//   const handlePrevious = () => {
//     if (currentPage > 1) {
//       handleChangePage(currentPage - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       handleChangePage(currentPage + 1);
//     }
//   };

//   return (
//     <>
//       <Box sx={{
//          display: 'flex',
//          justifyContent: 'space-between',
//          alignItems: 'center',
//          py: 2,
//          position: 'sticky',
//          bottom: 0,
//          zIndex: 1000,
//          width: '100%',
//          backgroundColor:'#f7f6fb' 
//       }}>
//         <Box>
//           {[10, 25, 50, 100].map((size) => (
//             <Button
//               key={size}
//               value={size}
//               sx={{
//                 border: '1px solid #0000004d',
//                 color: size === rowsPerPage ? 'white' : 'black',
//                 backgroundColor: size === rowsPerPage ? '#3F3F3F' : 'white',
//                 borderRadius: 0,
//                 padding: '2px 8px',
//                 minWidth: '36px', 
//                 '&:hover': {
//                   borderColor: '#3F3F3F',
//                   color: 'white',
//                   backgroundColor: '#3F3F3F',
//                 },
//               }}
//               onClick={() => {
//                 handleChangePage(1); // Reset to first page
//                 handleRowsPerPageChange(size);
//               }}
//             >
//               {size}
//             </Button>
//           ))}
//         </Box>
//         <Box sx={{ marginRight: '30px' }}>
//           <Button
//             onClick={handlePrevious}
//             disabled={currentPage === 1}
//             sx={{
//               borderRadius: 0,
//               border: '1px solid #0000004d',
//               color: 'black',
//               backgroundColor: 'white',
//               padding: '2px 8px',
//               minWidth: '36px',
             
//               '&:hover': {
//                 border: '1px solid #3F3F3F',
//                 color: 'white',
//                 backgroundColor: '#3F3F3F',
//               },
//               '&:disabled': {
//                 color: '#0000004d',
//                 border: '1px solid #0000004d',
//               },
//             }}
//           >
//             <Box>
//             <KeyboardArrowLeftRoundedIcon />
//             </Box>
//           </Button>
//           {pages.map((page) => (
//             <Button
//               key={page}
//               onClick={() => handleChangePage(page)}
//               sx={{
//                 borderRadius: 0,
//                 borderColor: '#0000004d',
//                 color: page === currentPage ? 'white' : 'black',
//                 backgroundColor: page === currentPage ? '#3F3F3F' : 'white',
//                 padding: '2px 8px',
//                 minWidth: '36px',
//                 borderWidth: 1,
//                 borderStyle: 'solid',
//                 '&:hover': {
//                   borderColor: '#3F3F3F',
//                   color: 'white',
//                   backgroundColor: '#3F3F3F',
//                 },
//               }}
//             >
//               {page}
//             </Button>
//           ))}
//           <Button
//             onClick={handleNext}
//             disabled={currentPage === totalPages}
//             sx={{
//               borderRadius: 0,
//               border: '1px solid #0000004d',
//               color: 'black',
//               backgroundColor: 'white',
//               padding: '2px 8px',
//               minWidth: '36px',
//               '&:hover': {
//                 border: '1px solid #3F3F3F',
//                 color: 'white',
//                 backgroundColor: '#3F3F3F',
//               },
//               '&:disabled': {
//                 color: '#0000004d',
//                 border: '1px solid #0000004d',
//               },
//             }}
//           >
//             <Box>
//             <KeyboardArrowRightRoundedIcon />
//             </Box>
//           </Button>
//         </Box>
//       </Box>
//     </>
//   );
// };

const Pagination = ({ currentPage, totalCount, handleChangePage, rowsPerPage, handleRowsPerPageChange }) => {
  // Calculate total pages
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  // Memoize the pages array to avoid recalculating on every render
  const pages = useMemo(() => {
    const pagesArray = [];
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }, [totalCount, rowsPerPage]);

  // Logic for showing only 3 page numbers at a time
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, currentPage + 1);
  const visiblePages = pages.slice(startPage - 1, endPage); // Slice the pages for the current window

  const handlePrevious = () => {
    if (currentPage > 1) {
      handleChangePage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handleChangePage(currentPage + 1);
    }
  };

  return (
    <>
      <Box sx={{
         display: 'flex',
         justifyContent: 'space-between',
         alignItems: 'center',
         py: 2,
         position: 'sticky',
         bottom: 0,
         zIndex: 1000,
         width: '100%',
         backgroundColor: '#f7f6fb',
      }}>
        <Box>
          {[10, 25, 50, 100].map((size) => (
            <Button
              key={size}
              value={size}
              sx={{
                border: '1px solid #0000004d',
                color: size === rowsPerPage ? 'white' : 'black',
                backgroundColor: size === rowsPerPage ? '#3F3F3F' : 'white',
                borderRadius: 0,
                padding: '2px 8px',
                minWidth: '36px',
                '&:hover': {
                  borderColor: '#3F3F3F',
                  color: 'white',
                  backgroundColor: '#3F3F3F',
                },
              }}
              onClick={() => {
                handleChangePage(1); // Reset to first page
                handleRowsPerPageChange(size);
              }}
            >
              {size}
            </Button>
          ))}
        </Box>

        <Box sx={{ marginRight: '30px' }}>
          <Button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            sx={{
              borderRadius: 0,
              border: '1px solid #0000004d',
              color: 'black',
              backgroundColor: 'white',
              padding: '2px 8px',
              minWidth: '36px',
              '&:hover': {
                borderColor: '#3F3F3F',
                color: 'white',
                backgroundColor: '#3F3F3F',
              },
              '&:disabled': {
                color: '#0000004d',
                border: '1px solid #0000004d',
              },
            }}
          >
            <Box>
              <KeyboardArrowLeftRoundedIcon />
            </Box>
          </Button>

          {/* Render visible pages */}
          {visiblePages.map((page) => (
            <Button
              key={page}
              onClick={() => handleChangePage(page)}
              sx={{
                borderRadius: 0,
                borderColor: '#0000004d',
                color: page === currentPage ? 'white' : 'black',
                backgroundColor: page === currentPage ? '#3F3F3F' : 'white',
                padding: '2px 8px',
                minWidth: '36px',
                borderWidth: 1,
                borderStyle: 'solid',
                '&:hover': {
                  borderColor: '#3F3F3F',
                  color: 'white',
                  backgroundColor: '#3F3F3F',
                },
              }}
            >
              {page}
            </Button>
          ))}

          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            sx={{
              borderRadius: 0,
              border: '1px solid #0000004d',
              color: 'black',
              backgroundColor: 'white',
              padding: '2px 8px',
              minWidth: '36px',
              '&:hover': {
                borderColor: '#3F3F3F',
                color: 'white',
                backgroundColor: '#3F3F3F',
              },
              '&:disabled': {
                color: '#0000004d',
                border: '1px solid #0000004d',
              },
            }}
          >
            <Box>
              <KeyboardArrowRightRoundedIcon />
            </Box>
          </Button>
        </Box>
      </Box>
    </>
  );
};

// export default Pagination;


export default Pagination;

