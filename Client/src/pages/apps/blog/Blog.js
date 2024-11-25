import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// material-ui
import {
  Grid,
  Stack,
  useMediaQuery,
  Button,
  FormControl,
  Box,
  Dialog,
  Slide,
  Pagination
} from '@mui/material';

// project-imports
import { PopupTransition } from 'components/@extended/Transitions';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import BlogCard from 'sections/apps/blog/BlogCard'; // Updated import path
import AddBlog from 'sections/apps/blog/AddBlog';
import axios from 'axios';
import makeData from 'data/react-table';
import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';
// assets
import { Add } from 'iconsax-react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const server = process.env.REACT_APP_API_URL;


const Blog = () => {
  const data = useMemo(() => makeData(12), []);
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [add, setAdd] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [globalFilter, setGlobalFilter] = useState('');
  const [userCard, setUserCard] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [updateddata,setupdateddata] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    handleMenuClose();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAdd = () => {
    setAdd(!add);
  };

  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${server}/api/blogs`);

        if (response.data) {
          setRowData(response.data.blogs);
          console.log(response.data.blogs);
        } else {
          console.error("Empty response data or unexpected htmlFormat");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);




  // Rendering while updating the blogs
  useEffect(() => {
    if (updateddata) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs`);
          if (response.data) {
            setRowData(response.data.blogs);
            console.log("response data blogs", response.data.blogs);
            // toast.success('Blog updated successfully');
          } else {
            console.error("Empty response data or unexpected htmlFormat");
          }
        } catch (error) {
          console.error("Error fetching blogs:", error);
        }
      };
      fetchData();
      
      setupdateddata(false);
    }
  }, [updateddata]);
  





















  const filteredData = useMemo(() => {
    if (!Array.isArray(rowData)) {
      return [];
    }

    if (!filterText) return rowData;
    return rowData.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [rowData, filterText]);



  
// search
useEffect(() => {
    const newData = data.filter((value) => {
      if (globalFilter) {
        return value.fatherName.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setUserCard(newData);
  }, [globalFilter, data]);
  
  const PER_PAGE = 6;
  
  const count = Math.ceil(userCard.length / PER_PAGE);
  const _DATA = usePagination(userCard, PER_PAGE);
  
  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };
  
  
  

  return (
    <>
      {/* Rest of the code */}
      <Box sx={{ position: 'relative', marginBottom: 3 }}>
        <Stack direction="row" alignItems="center">
          <Stack
            direction={matchDownSM ? 'column' : 'row'}
            sx={{ width: '100%' }}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <GlobalFilter preGlobalFilteredRows={data} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                {/* <Select
                  value={sortBy}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography variant="subtitle1">Sort By</Typography>;
                    }

                    return <Typography variant="subtitle2">Sort by ({sortBy})</Typography>;
                  }}
                >
                  {allColumns.map((column) => {
                    return (
                      <MenuItem key={column.id} value={column.header}>
                        {column.header}
                      </MenuItem>
                    );
                  })}
                </Select> */}
              </FormControl>
              <Button variant="contained" className="bg-blue-500 text-white hover:bg-blue-600"  startIcon={<Add />} onClick={handleAdd} size="large">
                
                Add Blog
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {filteredData.length > 0 ? (
          filteredData.map((blog, index) => (
            <Slide key={index} direction="up" in={true} timeout={50}>
              <Grid item xs={12} sm={6} lg={4}>
                <BlogCard
                  blogcard={blog}
                  setupdateddata = {setupdateddata}
                />
              </Grid>
            </Slide>
          ))
        ) : (
          <EmptyUserCard title={'No blogs available.'} />
        )}
      </Grid>
      {/* Rest of the code */}

      {/* <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
        <Pagination
          count={count}
          size="medium"
          page={page}
          showFirstButton
          showLastButton
          variant="combined"
          color="primary"
          onChange={handleChangePage}
        />
      </Stack> */}

      {/* add customer dialog */}
      <Dialog
        maxWidth="sm"
        fullWidth
        TransitionComponent={PopupTransition}
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 } }}
      >
        <AddBlog setAdd={setAdd} setupdateddata={setupdateddata} customer={customer} onCancel={handleAdd} />
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


export default Blog;


