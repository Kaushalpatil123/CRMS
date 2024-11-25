import PropTypes from 'prop-types';
import { useMemo, Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Select, Option } from '@material-tailwind/react';

// project-imports
import Avatar from '../../../../components/@extended/Avatar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Tooltip,
  Button,
  TableContainer,
  Paper
} from '@mui/material';
import MainCard from '../../../../components/MainCard';
import ScrollX from '../../../../components/ScrollX';
import { CSVExport } from '../../../../components/third-party/ReactTable';
import { renderFilterTypes } from 'utils/react-table';

import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';
import { Trash, Eye } from 'iconsax-react';
import makeData from 'data/react-table';
import { ThemeMode } from 'config';
// import IconButton from 'components/@extended/IconButton';
import IconButton from '../../../../components/@extended/IconButton';
import SearchBar from '../../components/Searchbar';
import PaginationComponent from '../../components/Pagination';
// import Pagination from '../../components/Pagination/Pagination'
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import { PatternFormat } from 'react-number-format';
// import { PopupTransition } from 'components/@extended/Transitions';
import { PopupTransition } from '../../../../components/@extended/Transitions';

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
  DialogContentText,
  ListItemText,
  TextField
} from '@mui/material';

import SimpleBar from '../../../../components/third-party/SimpleBar';
import Pagination from 'pages/apps/components/Pagination/Pagination';

const server = process.env.REACT_APP_API_URL;
// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent, setadminData, setUserData }) {
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

  const [addAdminName, setaddAdminName] = useState();
  const [AddUserName, setAddUserName] = useState();
  const [AddEmail, setAddEmail] = useState();
  const [AddRole, setAddRole] = useState('admin');
  const [AddPhoneNumber, setAddPhoneNumber] = useState();
  const [AddPassword, setAddPassword] = useState();
  const [autoChangeAdminPass, setautoChangeAdminPass] = useState('');
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [password, setPassword] = useState('');
  const [DialogPasswordUserId, setDialogPasswordUserId] = useState('')

  const [passwordOpen, setPasswordOpen] = useState(false);

  const handleAdminautoChangePasswordOpen = async () => {
    setPasswordOpen(true);

    const token = localStorage.getItem('token');

    if (!token) {
      // If no token is found, redirect to the login page
      // navigate('/');
    } else {
      try {
        const response = await axios.get(`${server}/api/password/password`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // console.log('response aaya passworddecide---->', response);

        // console.log('user id for decode--->', id);
        console.log('data admin password--->', response.data);
        setautoChangeAdminPass(response.data.password);

        // console.log('decoded password-->',decodedPass)

        setdecodedPass(decodedPass);
      } catch (error) {
        console.error('Error decoding Password:', error);
      }
    }
  };

  const handlePasswordClose = () => {
    setPasswordOpen(false);
  };

  const handleClose = () => setOpen(false);

  const [viewModal, setViewModal] = useState({
    open: false,
    details: null,
    completeDetails: null
  });

  const server = process.env.REACT_APP_API_URL;

  const handleOpenViewModal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${server}/api/admin/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Assuming your raw body response is plain text
      const responseDataCart = response.data;
      const responseData = response.data.data;
      // console.log('This is view response data', responseData);

      // Adjust this logic based on the actual format of your raw body response
      // For example, if your response is plain text, you might display it directly
      setOpen(true);
      setViewModal({
        details: responseData,
        completeDetails: responseDataCart // Adjust this line accordingly
      });
    } catch (error) {
      console.error('Error fetching User details:', error);
    }
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

  // const handleClose = () => {
  //   setOpen(!open);
  // };

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

  
  const paginatedData = useMemo(() => {
    // console.log("this is filteredData in useMemo",filteredData )
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return filteredData?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredData]);

  // const paginatedData = useMemo(() => {
  //   return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  // }, [filteredData, page, rowsPerPage]);

  const handleSearchChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const { id } = deleteConfirmation;
    // console.log('id aayi delet k liye', deleteConfirmation);
    if (id) {
      try {
        const token = localStorage.getItem('token');
        // if (!token) {
        // navigate("/");
        // } else {
        await axios.delete(`${server}/api/admin/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // console.log('api url', `${server}/api/user/${id}`);

        const updatedCustomers = data.filter((customer) => customer._id !== id);
        setUserData(updatedCustomers);
        // console.log('Deleted customer of id -->', id);
        toast.success('Admin deleted Successfully');
        if (page > Math.ceil(updatedCustomers.length / rowsPerPage) - 1) {
          setPage(0);
        }
        // }
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
    setDeleteConfirmation({ open: false, id: null });
  };

  // View decoded Pass

  const handleShowHideClick = () => {
    setshowpass(!showpass);
  };

  const handleButtonClick = async (id) => {
    const token = localStorage.getItem('token');

    if (!token) {
      // If no token is found, redirect to the login page
      // navigate('/');
    } else {
      try {
        const response = await axios.get(`${server}/api/admin/decode-password/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // console.log('response aaya passworddecide---->', response);

        // console.log('user id for decode--->', id);
        const decodedPass = response.data.password;
        // console.log('decoded password-->',decodedPass)

        setdecodedPass(decodedPass);
      } catch (error) {
        console.error('Error decoding card number:', error);
      }
    }
  };

  // add new admin

  const handleSaveNewadmin = async () => {
    try {
      // ---- IT's Working ------
      const requestData = {
        name: addAdminName,
        userName: AddUserName,
        role: AddRole,
        phoneNumber: AddPhoneNumber,
        email: AddEmail,
        password: AddPassword
      };

      const token = localStorage.getItem('token');

      const response = await axios.post(`${server}/api/admin/create`, requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });

      // Handle the response as needed
      // console.log('Create API response:', response.data);

      if (response.status === 201) {
        // Close the add new modal after successful creation
        setAddNewModal({ open: false });
        setaddAdminName('');
        setAddUserName('');
        setAddEmail('');
        // setAddRole('');
        setAddPhoneNumber('');
        setAddPassword('');

        try {
          const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/admin/allusers`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
            const filteredUsers = updatedData.data.data.filter((row) => row.role === 'admin' || row.role === 'superadmin');
            setUserData(filteredUsers);

         

          // console.log('record save successfully--->',updatedData)
          toast('New Admin Added Successfully');
        } catch (error) {
          console.log('Error duing Updated DAta fetching', error);
        }
      } else {
        toast.error('Error Creating Admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);

      toast.error('Error creating admin');
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


 const handlePasswordDialogOpen = (id) => {
  console.log('id aari h passworddialog m-->',id)
  setDialogPasswordUserId(id)
   setOpenPasswordDialog(true);
 };



   const handlePasswordDialogClose = () => {
     setOpenPasswordDialog(false);
     setPassword('');
     // setErrorMessage('');
   };




 const handlePasswordSubmit = (e) => {
   e.preventDefault();
   const role = localStorage.getItem('role')
  if(role==='admin'){
     if (password === autoChangeAdminPass) {
       console.log('deleteconfirmation hua kuch--->', deleteConfirmation);
       handlePasswordDialogClose();
       handleDeleteConfirmation(DialogPasswordUserId);
     } else {
       toast.error('Incorrect Password, Try again');
     }


  }
  else{
      handlePasswordDialogClose();
     handleDeleteConfirmation(DialogPasswordUserId);

  }
  
 };



  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 0 }}>
          <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} />

          <Stack direction="row" alignItems="center" spacing={2}>
            <div>
              <Button
                variant="contained"
                className="bg-gray-800 text-white hover:bg-blue-600 w-[120px] h-[50px]"
                onClick={handleAdminautoChangePasswordOpen}
              >
                Check Password
              </Button>
              <Dialog open={passwordOpen} onClose={handlePasswordClose}>
                <DialogTitle>Password</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Your password is: <strong>{autoChangeAdminPass}</strong>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handlePasswordClose} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            <Button
              variant="contained"
              className="bg-blue-500 text-white hover:bg-blue-600 w-[120px] h-[50px]"
              // startIcon={<Add />}
              onClick={handleAddNew}
              data-modal-toggle="add-modal"
            >
              Create Admin
            </Button>
          </Stack>
        </Stack>
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  className="bg-[#4c81f4] text-white text-center"
                  key={column.Header}
                  sx={{ fontSize: '10px', width: column.Header === 'ID' ? '40px' : 'auto' }}
                >
                  {column.Header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData
              ?.filter((row) => row.isDeleted === false)

              .map((row, index) => (
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
                  <TableCell className="text-center" style={{ width: '25%' }}>
                    {/* {columns.accessor === 'customerName' & */}
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      {/* <Avatar variant="rounded" color="secondary" size="sm" src={`${row?.picture}`} /> */}

                      <Typography className="text-[12px]">{row?.userName || 'NA'}</Typography>
                      {/* vhnvnv */}
                    </Stack>
                    {/* } */}
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      <Typography className="text-[12px]">{row?.phoneNumber || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      <Typography className="text-[12px]">{row?.email || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      <Typography className="text-[12px]">{row?.role || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '25%' }}>
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
                        <IconButton color="success" onClick={(e) => handleOpenViewModal(row._id)}>
                          <Eye />
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
                                      //   alt={customer.fatherName}
                                      size="lg"
                                      src={viewModal?.details?.picture}
                                    />
                                    <Typography color="secondary" variant="h5" className="p-4">
                                      {viewModal?.details?.userName}
                                    </Typography>
                                  </ListItemAvatar>
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

                                                  <IconButton
                                                    color="success"
                                                    onClick={() => {
                                                      handleButtonClick(viewModal?.details?._id);
                                                      handleShowHideClick();
                                                    }}
                                                  >
                                                    <Eye />
                                                  </IconButton>
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
                            // handleDeleteConfirmation(row._id);
                            handleDeleteConfirmation(row._id);
                            // handlePasswordDialogOpen(row._id);
                          }}
                        >
                          <Trash />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

            {/* <=====--------------- */}
          </TableBody>
        </Table>
      </Stack>
      {/* Pagination */}
      {/* <PaginationComponent page={page} setPage={setPage} filteredData={filteredData} rowsPerPage={rowsPerPage} /> */}
      <div className="float-right mt-2 mb-2">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={filteredData.length}
          pageSize={rowsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

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
      {/* 
      <form
        id="form"
        className="space-y-6"
        onSubmit={(e) => {
          handlePasswordSubmit(e);
        }}
      > */}

      <Dialog open={openPasswordDialog && localStorage.getItem('role') !== 'superadmin'} onClose={handlePasswordDialogClose}>
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
          <form
            id="form"
            className="space-y-6"
            onSubmit={(e) => {
              handlePasswordSubmit(e);
            }}
          >
            <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
            <DialogActions>
              <Button onClick={handlePasswordDialogClose}>Cancel</Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* </form> */}

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

      {/* Add new modal */}

      {/*  add new admin  */}
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
                handleSaveNewadmin();

                e.preventDefault();
              }}
            >
              <h3 className="text-2xl font-medium text-gray-800 mb-4">Enter New admin Details</h3>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Admin Name"
                  required
                  onChange={(e) => setaddAdminName(e.target.value)}
                  value={addAdminName}
                />
              </div>
              <div>
                <label htmlFor="userName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="userName"
                  id="userName"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Admin Username"
                  required
                  onChange={(e) => setAddUserName(e.target.value)}
                  value={AddUserName}
                />
              </div>

              <div>
                <label htmlFor="discountpercentage" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Admin Email"
                  required
                  onChange={(e) => setAddEmail(e.target.value)}
                  value={AddEmail}
                />
              </div>

              <div>
                <label htmlFor="limit" className=" text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Role
                </label>

                {/* {ReactHtmlParser(addNewDescription)} */}
                {/* <div className="max-h-40 overflow-y-auto">
                  <input
                    type="text"
                    name="role"
                    id="role"
                    className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                    placeholder="Enter Role"
                    required=""
                    onChange={(e) => setAddRole(e.target.value)}
                    value={AddRole}
                  />
                </div> */}
                <div className="relative w-full lg:max-w-sm">
                  <select
                    className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
                    name="role"
                    id="role"
                    value={AddRole}
                    onChange={(e) => setAddRole(e.target.value)}
                  >
                    <option>admin</option>
                    <option>superadmin</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="expiryDate" className=" text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Phone Number
                </label>
                <div className="max-h-40 overflow-y-auto">
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                    placeholder="Enter Phone Number"
                    required
                    onChange={(e) => setAddPhoneNumber(e.target.value)}
                    value={AddPhoneNumber}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="expiryDate" className=" text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Password
                </label>
                <div className="max-h-40 overflow-y-auto">
                  <input
                    type="text"
                    name="password"
                    id="password"
                    className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                    placeholder="Enter Password"
                    required
                    onChange={(e) => setAddPassword(e.target.value)}
                    value={AddPassword}
                  />
                </div>
              </div>

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
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  renderRowSubComponent: PropTypes.any,
  handleAdd: PropTypes.func
};

// ==============================|| CUSTOMER - LIST ||============================== //

const CustomerListPage = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const data = useMemo(() => makeData(200), []);
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [customerDeleteId, setCustomerDeleteId] = useState('');
  const [add, setAdd] = useState(false);
  const [userData, setUserData] = useState([]);

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate("/");
      } else {
        try {
          const response = await axios.get(`${server}/api/admin/allusers`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            const filteredUsers = response.data.data.filter((row) => row.role === 'admin' || row.role === 'superadmin');
            setUserData(filteredUsers);
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
      { Header: 'User Name', accessor: 'userName' },
      { Header: 'Contact', accessor: 'contact' },
      { Header: 'Email', accessor: 'email' },
      // { Header: 'DOB', accessor: 'dateofbirth' },
      { Header: 'Role', accessor: 'role' },
      // { Header: 'Whatsapp', accessor: 'whatsapp' },
      { Header: 'Actions', accessor: 'actions' }
      // { Header: 'Status', accessor: 'status' }
    ],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={userData} setUserData={setUserData} />
        {/* <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} /> */}
      </ScrollX>
    </MainCard>
  );
};

// Function to handle closing the delete dialog

export default CustomerListPage;
