import PropTypes from 'prop-types';
import { useMemo, Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Avatar from '../../../components/@extended/Avatar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, Tooltip, Button, TextField } from '@mui/material';
import MainCard from '../../../components/MainCard';
import ScrollX from '../../../components/ScrollX';
import { renderFilterTypes } from 'utils/react-table';
import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';
import { Trash, Eye, Edit } from 'iconsax-react';
import makeData from 'data/react-table';
import { ThemeMode } from 'config';
// import IconButton from 'components/@extended/IconButton';
import IconButton from '../../../components/@extended/IconButton';
import SearchBar from '../components/Searchbar';
import PaginationComponent from '../components/Pagination';
import Box from '@mui/material/Box';
import { PopupTransition } from '../../../components/@extended/Transitions';
import {
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import Pagination from '../components/Pagination/Pagination';
import SimpleBar from '../../../components/third-party/SimpleBar';

const server = process.env.REACT_APP_API_URL;
// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent, setplanData, setSportsData }) {
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const theme = useTheme();
  const mode = theme.palette.mode;
  const filterTypes = useMemo(() => renderFilterTypes, []);

  const [sortBy, setSortBy] = useState('');
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [decodedPass, setdecodedPass] = useState('');
  const [showpass, setshowpass] = useState(false);

  const [addplanName, setaddplanName] = useState();
  const [Name, setName] = useState();
  const [Image, setImage] = useState('');
  //   const [AddRole, setAddRole] = useState('plan');
  const [AddActualPrice, setAddActualPrice] = useState();

  const [EditName, setEditName] = useState();
  const [EditImage, setEditImage] = useState();
  const [EditactualPrice, setEditactualPrice] = useState();
  const [DisplayImageName, setDisplayImageName] = useState('');
  const [password, setPassword] = useState();
  const [editPassword, setEditPassword] = useState();
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [DialogPasswordUserId, setDialogPasswordUserId] = useState('');

  const handleClose = () => setOpen(false);

  const [viewModal, setViewModal] = useState({
    open: false,
    details: null,
    completeDetails: null
  });

  const server = process.env.REACT_APP_API_URL;

  const handlePasswordDialogOpen = (id) => {
    console.log('id aari h passworddialog m-->', id);
    setDialogPasswordUserId(id);
    setOpenPasswordDialog(true);
    if (localStorage.getItem('role') === 'superadmin') {
      handleDeleteConfirmation(id);
    }
  };

  const handlePasswordDialogClose = () => {
    setOpenPasswordDialog(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log('submit m aaye ho?');

    const role = localStorage.getItem('role');

    console.log('role btao', role);
    if (role === 'admin') {
      if (password) {
        handlePasswordDialogClose();
        handleDeleteConfirmation(DialogPasswordUserId);
      } else {
        toast.error('Incorrect Password, Try again');
      }
    }
  };

  const PasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };

  const {
    getTableProps,
    visibleColumns,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize, expanded },
    preGlobalFilteredRows,
    setGlobalFilter,
    // setSortBy,
    selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['avatar', 'email'], sortBy: [sortBy] }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null
  });

  // SearchBar
  // SearchBar
  // const filteredData = useMemo(() => {
  //   if (!filterText) return data; // Using rowData as initial data
  //   return data.filter((row) => {
  //     return Object.values(row).some((value) => {
  //       if (value === null || value === undefined) return false; // Handle null or undefined values
  //       return value.toString().toLowerCase().includes(filterText.toLowerCase());
  //     });
  //   });
  // }, [data, filterText]);

    const filteredData = useMemo(() => {
      // console.log("this is rowData", rowData);
      if (!filterText) return data; // Using rowData as initial data
      return data?.filter((row) =>
        Object.values(row)?.some((value) => value.toString().toLowerCase().includes(filterText.toLowerCase()))
      );
    }, [data, filterText]);

  //Pagination

  // const paginatedData = useMemo(() => {
  //   return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  // }, [filteredData, page, rowsPerPage]);


  const paginatedData = useMemo(() => {
    // console.log("this is filteredData in useMemo",filteredData )
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return filteredData?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredData]);

  const handleSearchChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const { id } = deleteConfirmation;
    console.log('id aayi delet k liye', deleteConfirmation);
    if (id) {
      try {
        const token = localStorage.getItem('token');
        // if (!token) {
        // navigate("/");
        // } else {
        await axios.delete(`${server}/api/sport/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            password: password
          }
        });
        console.log('api url', `${server}/api/user/${id}`);
        console.log('userdata--->', data);
        const updatedsubscriptions = data.filter((subscription) => subscription._id !== id);
        setSportsData(updatedsubscriptions);
        console.log('Deleted subscription of id -->', id);
        toast('Record deleted Successfully');
        if (page > Math.ceil(updatedsubscriptions.length / rowsPerPage) - 1) {
          setPage(0);
        }
        // }
      } catch (error) {
    
      toast.error(error.response.data.message);
      }
    }
    setDeleteConfirmation({ open: false, id: null });
  };

  // add new plan

  const handleSaveNewSport = async () => {
    try {
      // ---- IT's Working ------
      const formData = new FormData();
      formData.append('name', Name);
      formData.append('file', Image);

      const token = localStorage.getItem('token');
      console.log(token);
      const response = await axios.post(`${server}/api/sport/create`, formData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          password: password
        }
      });

      // Handle the response as needed
      console.log('Create API response:', response.data);

      if (response.status === 201) {
        // Close the add new modal after successful creation
        // setaddplanName('');
        setName('');
        setImage('');

        try {
          const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/sport/getll`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setSportsData(updatedData.data);
          console.log('record save successfully--->', updatedData);
          toast('New Sport Added Successfully');
        } catch (error) {
          console.log('Error duing Updated DAta fetching', error);
        }
      } else {
      
         toast.error('Error Adding Sports');
      }
    } catch (error) {
     

      toast.error(error.response.data.message);
    }
  };

  const [addNewModal, setAddNewModal] = useState({
    open: false
  });

  const handleAddModalClose = () => {
    setAddNewModal({
      open: false
    });
  };

  const handleAddNew = () => {
    setAddNewModal({
      open: true
    });
  };

  // Edit Plans

  //  Edit Plans

  const [editModal, setEditModal] = useState({
    open: false,
    details: null
  });

  function extractImageFileName(url) {
    console.log('url m kuch aaya--->', url);
    const parts = url.split('.com/');
    console.log('parts--->', parts);
    if (parts.length === 3) {
      console.log('part k if m aaye ho');
      const imageName = parts[2].split('?')[0];
      setDisplayImageName(imageName);
      // console.log('imagename aara h--->',imageName)

      return imageName;
    }
    return null;
  }

  const handleEdit = (details) => {
    setEditModal({
      open: true,
      details: { ...details }
    });

    setEditName(details.name);
    // const imageDisplayName = extractImageFileName(details.imageUrl);
    // console.log('iamgedisplayname--->', imageDisplayName);
    setEditImage(extractImageFileName(details.imageUrl));

    // setEditImage(details.imageUrl);
  };

  const handleEditModalClose = () => {
    setEditModal({
      open: false
      // blog: { ...blog },
    });
  };

  // Calling the update api
  const handleSaveEdit = async () => {
    try {
      // const requestData = {
      //   name: EditName,
      //   // actualPrice: EditactualPrice,
      //   file: EditImage
      // };
      const formData = new FormData();
      formData.append('name', EditName);
      formData.append('file', EditImage);

      const token = localStorage.getItem('token');
      const response = await axios.put(`${server}/api/sport/update/${editModal.details._id}`, formData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          password: editPassword
        }
      });

      // Handle the response as needed

      if (response.status === 200) {
        // Close the edit modal after successful update
        setEditModal({ open: false, details: null });
        setName();
        setImage();

        // Fetch the updated data from the server and update the rowData state
        try {
          const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/sport/getll`, {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${token}`
            }
          });
          setSportsData(updatedData.data);
          console.log('Updated rowData:', updatedData);
        } catch (error) {
          console.log('Error', error);
        }

        toast('Sports updated Successfully');
      } else {
        toast.error('Sports Not updated.. Try Again');
      }
    } catch (error) {
      console.error('Error updating record:', error);
      // Handle error and display a toast or error message to the user
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 0 }}>
          <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} />

          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              variant="contained"
              className="bg-blue-500 text-white hover:bg-blue-600 w-[120px] h-[50px]"
              // startIcon={<Add />}
              onClick={handleAddNew}
              data-modal-toggle="add-modal"
            >
              Add Sports
            </Button>
          </Stack>
        </Stack>
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.Header}
                  className="bg-[#4c81f4] text-white text-center"
                  sx={{ fontSize: '10px', width: column.Header === 'ID' ? '40px' : 'auto' }}
                >
                  {column.Header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData
              ?.filter((row) => row.deleted === false)
              ?.map((row, index) => (
                // {paginatedData.map((row, i) => (

                <TableRow
                  key={row._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#f0f0f0' : 'white',
                    '&:hover': {
                      backgroundColor: 'gray'
                    }
                  }}
                >
                  <TableCell className="text-center" style={{ width: '30%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      <img
                        className="w-[40px] h-[6vh] object-fill object-center rounded-lg"
                        src={row?.imageUrl}
                        // width="100px"
                        // height="100px"
                      />
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '30%' }}>
                    {/* {columns.accessor === 'subscriptionName' & */}
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      {/* <Avatar variant="rounded" color="secondary" size="sm" src={`${row?.picture}`} /> */}

                      <Typography className="text-[12px]">{row?.name || 'NA'}</Typography>
                    </Stack>
                    {/* } */}
                  </TableCell>

                  {/* <TableCell style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography>{row?.price || 'NA'}</Typography>
                    </Stack>
                  </TableCell> */}
                  {/* 
                  <TableCell style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography>{row?.actualPrice || 'NA'}</Typography>
                    </Stack>
                  </TableCell> */}

                  {/* <TableCell style={{ width: '25%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography>{row?.role || 'NA'}</Typography>
                  </Stack>
                </TableCell> */}

                  <TableCell className="text-center text-[12px]" style={{ width: '30%' }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                      {/* View */}

                      <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                              opacity: 0.9
                            }
                          }
                        }}
                        title="View"
                      >
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                            handleEdit(row);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>

                      <Dialog
                        open={open}
                        TransitionComponent={PopupTransition}
                        keepMounted
                        onClose={handleClose}
                        aria-describedby="alert-dialog-slide-description"
                        sx={{
                          '& .MuiDialog-paper': { width: 2048, maxWidth: 1, m: { xs: 1.75, sm: 2.5, md: 4 } },
                          backgroundColor: '#ffffff',
                          height: '100vh'
                        }}
                      >
                        {/* Viewmodaljsx */}

                        <Box id="PopupPrint" sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 1, height: '70vh' }}>
                          <DialogTitle sx={{ px: 0 }}>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                              <List sx={{ width: 1, p: 0 }}>
                                <ListItem disablePadding>
                                  <ListItemAvatar sx={{ mr: 0.75 }} className="flex justify-center align-center">
                                    <Avatar
                                      //   alt={subscription.fatherName}
                                      size="lg"
                                      src={viewModal?.details?.picture}
                                    />
                                    <Typography color="secondary" variant="h5" className="p-4">
                                      {viewModal?.details?.userName}
                                    </Typography>
                                  </ListItemAvatar>
                                  {console.log('viewmodal----name--->', viewModal)}
                                </ListItem>
                              </List>
                            </Stack>
                          </DialogTitle>
                          <DialogContent dividers sx={{ px: 0 }}>
                            <SimpleBar sx={{ height: 'calc(100vh - 430px)' }}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} xl={12}>
                                  <Grid container spacing={2.25}>
                                    {/* <Grid item xs={12}>
                                      <MainCard title="About me">
                                        <Typography>
                                          Hello, Myself Rohan Shridhar, I’m Software Developer in international company,
                                        </Typography>

                                        <Typography>
                                          Hello, Myself Rohan Sanghwan, I’m Ui/Ux developer in international company, amndasbd
                                        </Typography>
                                      </MainCard>
                                    </Grid> */}
                                    <Grid item xs={12}>
                                      <MainCard title="Details">
                                        <List sx={{ py: 0 }}>
                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Name</Typography>
                                                  {/* <Typography>2014-2017</Typography> */}
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.name || 'NA'}</Typography>
                                                  {/* <Typography>-</Typography> */}
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Role</Typography>
                                                  {/* <Typography>2014-2017</Typography> */}
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.role || 'NA'}</Typography>
                                                  {/* <Typography>-</Typography> */}
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Email</Typography>
                                                  {/* <Typography>2014-2017</Typography> */}
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.email || 'NA'}</Typography>
                                                  {/* <Typography>-</Typography> */}
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Contact No</Typography>
                                                  {/* <Typography>2014-2017</Typography> */}
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.phoneNumber || 'NA'}</Typography>
                                                  {/* <Typography>-</Typography> */}
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Password</Typography>
                                                  {/* <Typography>2014-2017</Typography> */}
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  {/* <Typography color="secondary">{viewModal?.details?.password || 'NA'}</Typography> */}
                                                  {showpass && <Typography>{decodedPass}</Typography>}
                                                  {console.log('decoded password--->', decodedPass)}
                                                  {/* 
                                                <IconButton
                                                  color="success"
                                                  onClick={() => {
                                                    handleButtonClick(viewModal?.details?._id);
                                                    handleShowHideClick();
                                                  }}
                                                >
                                                  <Eye />
                                                </IconButton> */}
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>
                                        </List>
                                      </MainCard>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </SimpleBar>
                          </DialogContent>

                          <DialogActions>
                            <Button
                              color="error"
                              variant="contained"
                              onClick={handleClose}
                              className="bg-red-500 hover:bg-red-700"
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'darkred' // Change this to the hover color you want
                                }
                              }}
                            >
                              Close
                            </Button>
                          </DialogActions>
                        </Box>

                        {/* VIewmodaljsxend */}
                      </Dialog>

                      <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                              opacity: 0.9
                            }
                          }
                        }}
                        title="Delete"
                      >
                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                            handlePasswordDialogOpen(row._id);
                            // handleDeleteConfirmation(row._id);
                          }}
                        >
                          <Trash />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

            {/* Pagination */}
            {/* <PaginationComponent page={page} setPage={setPage} filteredData={filteredData} rowsPerPage={rowsPerPage} /> */}

            {/* <=====--------------- */}
          </TableBody>
        </Table>
        <div className="float-left mt-2 py-2">
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={filteredData.length}
            pageSize={rowsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </Stack>

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

      {/* deleting  confirmation box */}

      <Dialog open={openPasswordDialog && localStorage.getItem('role') == 'admin'} onClose={handlePasswordDialogClose}>
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
          <form
            id="form"
            className="space-y-6"
            onSubmit={(e) => {
              handlePasswordSubmit(e);
            }}
          >
            <TextField label="Password" type="password" fullWidth value={password} onChange={PasswordChange} />
            <DialogActions>
              <Button onClick={handlePasswordDialogClose}>Cancel</Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation  */}

      {deleteConfirmation.open && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md">
            <p className="mb-4">Are you sure you want to delete this record?</p>
            <div className="flex justify-end">
              <button className="bg-red-500 text-white px-4 py-2 rounded-md mr-4" onClick={handleConfirmDelete}>
                Confirm
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                onClick={() => setDeleteConfirmation({ open: false, id: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  adding new Plans Modal  */}
      {addNewModal.open && (
        <div className="fixed top-0 left-0 w-[100vw] h-full flex items-center overflow-y-auto justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-end p-2">
              <button
                type="button"
                className="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                data-modal-toggle="authentication-modal"
                onClick={() => handleAddModalClose()}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            <form
              id="form"
              className="space-y-6"
              onSubmit={(e) => {
                handleAddModalClose();
                handleSaveNewSport();

                e.preventDefault();
              }}
            >
              <h3 className="text-2xl font-medium text-gray-800 mb-4">Add New Sport</h3>

              <div>
                <label htmlFor="Name" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="Name"
                  id="Name"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Name"
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={Name}
                />
              </div>

              <div>
                <label htmlFor="discountpercentage" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Image
                </label>
                <input
                  type="file"
                  name="file"
                  id="price"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Price"
                  required
                  onChange={(e) => setImage(e.target.files[0])}
                  // value={Image}
                />
              </div>

              {localStorage.getItem('role') === 'admin' && (
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                    Password
                  </label>
                  <input
                    type="text"
                    name="password"
                    id="password"
                    className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                    placeholder="Enter Password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/*  edit plans  */}
      {editModal.open && (
        <div className="fixed top-0 left-0 w-[100vw] h-full flex items-center justify-center align-middle  bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between p-2">
              <div className="div">
                <h3 className="text-2xl font-medium text-gray-800 mb-4">Edit Sports Details</h3>
              </div>

              <div className="">
                <button
                  type="button"
                  className="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-toggle="authentication-modal"
                  onClick={() => handleEditModalClose()}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleEditModalClose();
                handleSaveEdit();
              }}
            >
              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="Name"
                  id="Name"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Plan Type"
                  // required=""
                  onChange={(e) => setEditName(e.target.value)}
                  value={EditName}
                />
              </div>

              <div>
                <label htmlFor="discountpercentage" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Image
                </label>

                <input
                  type="file"
                  name="file"
                  id="price"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Price"
                  // required
                  onChange={(e) => setEditImage(e.target.files[0])}
                  //   value={DisplayImageName}
                />
              </div>

              {localStorage.getItem('role') === 'admin' && (
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                    Password
                  </label>
                  <input
                    type="text"
                    name="password"
                    id="password"
                    className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                    placeholder="Enter Password"
                    required
                    onChange={(e) => setEditPassword(e.target.value)}
                    value={editPassword}
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800r"
                // disabled={
                //   editTitle === originalTitle &&
                //   editDescription === originalDescription &&
                //   BoolImage === false
                // }
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  renderRowSubComponent: PropTypes.any,
  handleAdd: PropTypes.func
};

// ==============================|| subscription - LIST ||============================== //

const SportsListPage = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const data = useMemo(() => makeData(200), []);
  const [open, setOpen] = useState(false);
  const [subscription, setsubscription] = useState(null);
  const [subscriptionDeleteId, setsubscriptionDeleteId] = useState('');
  const [add, setAdd] = useState(false);
  const [userData, setSportsData] = useState([]);

  const handleAdd = () => {
    setAdd(!add);
    if (subscription && !add) setsubscription(null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate("/");
      } else {
        try {
          const response = await axios.get(`${server}/api/sport/getll`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            setSportsData(response.data);
            console.log('api data---', response.data);
          } else {
            console.error('Empty response data or unexpected format');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };
    fetchUsers();
  }, []);

  const columns = useMemo(
    () => [
      // { Header: 'ID', accessor: 'id', width: 100  },

      //   { Header: 'Price', accessor: 'contact' },
      { Header: 'Sports Image', accessor: 'sportsimage' },
      { Header: 'Sports Name', accessor: 'actualPrice' },
      { Header: 'Actions', accessor: 'actions' }

      //   { Header: 'Status', accessor: 'status' }
    ],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={userData} setSportsData={setSportsData} />
        {/* <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} /> */}
      </ScrollX>
    </MainCard>
  );
};

// Function to handle closing the delete dialog

export default SportsListPage;
