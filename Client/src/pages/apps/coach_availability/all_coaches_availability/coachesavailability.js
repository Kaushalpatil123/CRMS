import React from 'react';
import PropTypes from 'prop-types';
import { useMemo, Fragment, useEffect, useState } from 'react';
import axios from 'axios';

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
  TextField,
  TableContainer,
  Paper
} from '@mui/material';
import MainCard from '../../../../components/MainCard';
import ScrollX from '../../../../components/ScrollX';
import { CSVExport } from '../../../../components/third-party/ReactTable';
import { renderFilterTypes } from 'utils/react-table';

import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';
import { Trash, Eye, Edit } from 'iconsax-react';
import makeData from 'data/react-table';
import { ThemeMode } from 'config';
// import IconButton from 'components/@extended/IconButton';
import IconButton from '../../../../components/@extended/IconButton';
import SearchBar from '../../components/Searchbar';
import PaginationComponent from '../../components/Pagination';
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
  ListItemText
} from '@mui/material';

import SimpleBar from '../../../../components/third-party/SimpleBar';

import { useNavigate } from 'react-router';
import Pagination from '../../components/Pagination/Pagination';

const server = process.env.REACT_APP_API_URL;
// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent, handleAdd, setUserData }) {
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
  const handleClose = () => setOpen(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [DialogPasswordUserId, setDialogPasswordUserId] = useState('');

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

  const [viewModal, setViewModal] = useState({
    open: false,
    details: null,
    completeDetails: null
  });

  const navigate = useNavigate();
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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log('submit m aaye ho?');

    const role = localStorage.getItem('role');

    console.log('role btao', role);
    if (role === 'admin') {
      if (password) {
        console.log('deleteconfirmation hua kuch--->', deleteConfirmation);
        console.log('password----->', password);
        handlePasswordDialogClose();
        handleDeleteConfirmation(DialogPasswordUserId);
      } else {
        console.log('isme ni aaye???');

        toast.error('Incorrect Password, Try again');
      }
    }
  };

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

  //Pagination

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
    console.log('id aayi delet k liye', deleteConfirmation);
    if (id) {
      try {
        const token = localStorage.getItem('token');
        // if (!token) {
        // navigate("/");
        // } else {
        await axios.delete(`${server}/api/Coachavailibility/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "password": password
          }
        });
        console.log('api url', `${server}/api/Coachavailibility/${id}`);
        console.log('userdata--->', data);
        const updatedCustomers = data.filter((customer) => customer._id !== id);
        console.log('customer id-->customer._id-->', data);
        console.log('updatedcustomers------->', updatedCustomers);

        setUserData(updatedCustomers);
        console.log('Deleted customer of id -->', id);
        toast.success('Availability deleted Successfully');
        if (page > Math.ceil(updatedCustomers.length / rowsPerPage) - 1) {
          setPage(0);
        }
        // }
      } catch (error) {
        console.error('Error deleting customer:', error);
         toast.error(error?.response?.data?.message);

      }
    }
    setDeleteConfirmation({ open: false, id: null });
  };

  function splitStringIntoArr(data) {
    console.log('this is data', data);
    const temp1 = data[0] ? data[0] : ''; //get data from the 0 index
    console.log('this is temp1', temp1);

    const temp2 = temp1.split(','); //split it based on comma and return it
    console.log('this is temp1', temp2);

    return temp2;
  }

  function handleNavigate(Id) {
    navigate(`/apps/edit-coach-availability/${Id}`);
  }
const filteredData = useMemo(() => {
  // console.log("this is rowData", rowData);
  if (!filterText) return data; // Using rowData as initial data
  return data?.filter((row) => Object.values(row)?.some((value) => value.toString().toLowerCase().includes(filterText.toLowerCase())));
}, [data, filterText]);

  
  const paginatedData = useMemo(() => {
    // console.log("this is filteredData in useMemo",filteredData )
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return filteredData?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredData]);

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 0 }}>
          <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} />
          {/* <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              variant="contained"
              className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2"
              // startIcon={<Add />}
              // onClick={handleAddNew}
              onClick={() => navigate('/apps/create-coach')}
              data-modal-toggle="add-modal"
            >
              Add New Coach
            </Button>
          </Stack> */}

          {/* <Stack direction="row" alignItems="center" spacing={2}></Stack> */}
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
            {paginatedData?.map((row, index) => (
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
                <TableCell className='text-center' style={{ width: '20%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    <Typography className='text-[12px]'>{row?.name || 'NA'}</Typography>
                  </Stack>
                </TableCell>
                <TableCell className="text-center" style={{ width: '25%' }}>
                  {/* {columns.accessor === 'customerName' & */}
                  <Stack direction="row" alignItems="center" justifyContent='center' className="flex flex-col ">
                    {/* <Avatar variant="rounded" color="secondary" size="sm" src={`${row?.picture}`} /> */}

                    <Typography className="text-[12px]">{row?.coachId || 'NA'}</Typography>
                    {/* vhnvnv */}
                  </Stack>
                  {/* } */}
                </TableCell>

                <TableCell className='text-center' style={{ width: '20%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    <Typography className='text-[12px]'>{row?.schoolname || 'NA'}</Typography>
                  </Stack>
                </TableCell>

                <TableCell className='text-center' style={{ width: '25%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    <Typography className='text-[12px]'>{row?.institutionid || 'NA'}</Typography>
                  </Stack>
                </TableCell>

                {/* <TableCell style={{ width: '20%', alignContent: 'left' }}>
                    <Stack direction="row" alignItems="left" className="flex flex-row text-left items-left flex-wrap justify-start gap-1 ">
                      {(row?.sportsgrounds &&
                        splitStringIntoArr(row?.sportsgrounds)?.map((r) => (
                          <Typography className="border-[2px] border-[#5f6368]/10 text-[14px] bg-gray-50 items-left text-gray-600 rounded-full px-2 py-[2px] ">
                            {r}
                          </Typography>
                        ))) ||
                        'NA'}
                    </Stack>
                  </TableCell> */}

                {/* <TableCell style={{ width: '20%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography className="flex flex-col justify-start items-start align-middle">
                        {(row?.isverified && <div className="text-green-600  rounded-xl px-4 py-px ">True</div>) || (
                          <div className="text-red-600 font-semibold  text-[10px] bg-red-200 rounded-full px-4 py-[4px] ">False</div>
                        )}
                      </Typography>
                    </Stack>
                  </TableCell> */}

                {/* <TableCell style={{ width: '15%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography>{row?.workStatus || 'NA'}</Typography>
                    </Stack>
                  </TableCell> */}

                {/* <TableCell style={{ width: '15%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {row?.whatsApp ? (
                        <>
                       
                          <Chip color="info" label="Active" size="small" variant="light" />
                        </>
                      ) : (
                        <>
                         
                          <Chip color="success" label="Inactive" size="small" variant="light" />
                        </>
                      )}
                    </Stack>
                  </TableCell> */}

                <TableCell style={{ width: '10%' }}>
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                    {/* View */}

                    {/* <Tooltip
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
                      </Tooltip> */}

                    <Tooltip
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                            opacity: 0.9
                          }
                        }
                      }}
                      title="Edit"
                    >
                      <IconButton
                        color="primary"
                        onClick={() => {
                          handleNavigate(row._id);
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
                        '& .MuiDialog-paper': { width: 1560, maxWidth: 1, m: { xs: 1.75, sm: 2.5, md: 4 } },
                        backgroundColor: '#ffffff',
                        height: '100vh'
                      }}
                    >
                      {/* Viewmodaljsx */}

                      <Box id="PopupPrint" sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 1 }} className="">
                        {/* <DialogTitle sx={{ px: 0 }}>
                            <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
                              <Typography color="secondary" variant="" className="p-4">
                                Coach All Details
                              </Typography>
                            </Stack>
                          </DialogTitle> */}
                        <DialogContent dividers sx={{ px: 0 }}>
                          <SimpleBar sx={{ height: '75vh' }}>
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
                                    <MainCard title="Personal Details">
                                      <List sx={{ py: 0 }}>
                                        <ListItem divider>
                                          <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">Instituion ID</Typography>
                                              </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">{viewModal?.details?.institutionId || 'NA'}</Typography>
                                              </Stack>
                                            </Grid>
                                          </Grid>
                                        </ListItem>
                                        <ListItem divider>
                                          <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">Name</Typography>
                                              </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">
                                                  {viewModal?.details?.firstname + ' ' + viewModal?.details?.lastname || 'NA'}
                                                </Typography>
                                              </Stack>
                                            </Grid>
                                          </Grid>
                                        </ListItem>

                                        {/* <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Date Of Birth</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.DOB || 'NA'}</Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem> */}

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
                                                <Typography color="secondary"> {viewModal?.details?.email || 'NA'}</Typography>
                                                {/* <Typography>-</Typography> */}
                                              </Stack>
                                            </Grid>
                                          </Grid>
                                        </ListItem>

                                        <ListItem divider>
                                          <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">Contact No.</Typography>
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
                                                <Typography color="secondary">Gender</Typography>
                                                {/* <Typography>2014-2017</Typography> */}
                                              </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">{viewModal?.details?.gender || 'NA'}</Typography>
                                                {/* <Typography>-</Typography> */}
                                              </Stack>
                                            </Grid>
                                          </Grid>
                                        </ListItem>
                                        <ListItem divider>
                                          <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">Nationality</Typography>
                                                {/* <Typography>2014-2017</Typography> */}
                                              </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">{viewModal?.details?.nationality || 'NA'}</Typography>
                                                {/* <Typography>-</Typography> */}
                                              </Stack>
                                            </Grid>
                                          </Grid>
                                        </ListItem>
                                      </List>
                                    </MainCard>
                                  </Grid>

                                  {/* Qualification & Certificatin and Experience Section   */}

                                  <Grid item xs={12}>
                                    <MainCard title="Qualification/Certification And Experience">
                                      <List sx={{ py: 0 }}>
                                        <ListItem divider>
                                          <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">Total Year Of Experience</Typography>
                                              </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">
                                                  {viewModal?.details?.yearsOfExperience + ' Years' || 'NA'}
                                                </Typography>
                                              </Stack>
                                            </Grid>
                                          </Grid>
                                        </ListItem>

                                        {/* <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Academic Qualification</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">
                                                    {viewModal?.details?.qualificationsAndCertifications.academicQualifications.map((r) => (
                                                      <div>- {r}</div>
                                                    )) || 'NA'}
                                                  </Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem> */}

                                        <ListItem divider>
                                          <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">Professional Certification</Typography>
                                              </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">
                                                  {' '}
                                                  {viewModal?.details?.certificates.map((r) => (
                                                    <div>
                                                      <div className="">
                                                        <img
                                                          src={r?.certificateUrl}
                                                          className="w-[240px] h-[160px] rounded-md object-fill"
                                                        />
                                                      </div>
                                                      <div>
                                                        {r?.certificateName} - ({r?.organizationName}){' '}
                                                      </div>
                                                    </div>
                                                  )) || 'NA'}
                                                </Typography>
                                              </Stack>
                                            </Grid>
                                          </Grid>
                                        </ListItem>
                                      </List>
                                    </MainCard>
                                  </Grid>

                                  {/*-------------------- Coach Specialities & Availablity Details ----------------------  */}

                                  <Grid item xs={12}>
                                    <MainCard title="Coach Specialities ">
                                      <List sx={{ py: 0 }}>
                                        <ListItem divider>
                                          <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">Sports</Typography>
                                              </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary" className="gap-2 flex flex-wrap">
                                                  {(viewModal?.details?.sportsgrounds &&
                                                    splitStringIntoArr(viewModal?.details?.sportsgrounds)?.map((r) => (
                                                      <div className="px-2 py-px bg-gray-50 border-gray-100 border-[1px] rounded-full w-fit ">
                                                        {' '}
                                                        {r}
                                                      </div>
                                                    ))) ||
                                                    'NA'}
                                                </Typography>
                                              </Stack>
                                            </Grid>
                                          </Grid>
                                        </ListItem>

                                        {/* <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Level</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary" className="flex flex-wrap gap-2">
                                                    {viewModal?.details?.coachingSpecialties?.levels.map((r) => (
                                                      <div className="px-2 py-px bg-gray-50 border-gray-100 border-[1px] rounded-full w-fit">
                                                        {' '}
                                                        {r}
                                                      </div>
                                                    )) || 'NA'}
                                                  </Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Schedule & Availability</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary" className="flex flex-wrap gap-2">
                                                    {viewModal?.details?.availabilityAndSchedule?.daysAndTimes.map((r) => (
                                                      <div className="px-2 py-px bg-gray-50 border-gray-600 border-[1px] rounded-full text-black w-fit">
                                                        {' '}
                                                        {r}
                                                      </div>
                                                    )) || 'NA'}
                                                  </Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Recurring Availability</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">
                                                    {viewModal?.details?.availabilityAndSchedule.recurringAvailability == 1 ? (
                                                      <span className="text-green-800 ml-4  bg-green-200 rounded-full py-[4px] px-2 text-[12px] font-semibold">
                                                        True
                                                      </span>
                                                    ) : (
                                                      (
                                                        <span className="text-red-800 ml-4  bg-red-200 rounded-full py-[4px] px-2 text-[12px] font-semibold">
                                                          False
                                                        </span>
                                                      ) || 'NA'
                                                    )}
                                                  </Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem> */}
                                      </List>
                                    </MainCard>
                                  </Grid>
                                  {/* -----------Biographic Section -------------------*/}

                                  <Grid item xs={12}>
                                    <MainCard title="Biographic And Achievemenets">
                                      <List sx={{ py: 0 }}>
                                        <ListItem divider>
                                          <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">Description</Typography>
                                              </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography
                                                  color="secondary"
                                                  className="rounded-xl border-[2px] border-gray-100 px-2 py-2 bg-gray-50"
                                                >
                                                  {viewModal?.details?.description || 'NA'}
                                                </Typography>
                                              </Stack>
                                            </Grid>
                                          </Grid>
                                        </ListItem>

                                        {/* <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Achievemenets</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">
                                                    {viewModal?.details?.biographyAndBackground?.achievements.map((r) => (
                                                      <div>- {r}</div>
                                                    )) || 'NA'}
                                                  </Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem> */}
                                      </List>
                                    </MainCard>
                                  </Grid>

                                  {/* ---------------      Cart Section ----------------- */}

                                  {/* <Grid item xs={12}>
                                      <MainCard title="Pricing Table">
                                        <List sx={{ py: 0 }}>
                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Price Per Session (For Indivisual)</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">
                                                    INR {viewModal?.details?.ratesAndPricing?.ratesPerSession || 'NA'} /-
                                                  </Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Payment Methods</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary" className="flex flex-wrap gap-2">
                                                    {viewModal?.details?.paymentInformation?.methods.map((r) => (
                                                      <div className="px-2 py-px bg-gray-50 border-gray-100 border-[1px] rounded-full w-fit">
                                                        {' '}
                                                        {r}
                                                      </div>
                                                    )) || 'NA'}
                                                  </Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Tax Information</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary" className="flex flex-wrap gap-2">
                                                    {viewModal?.details?.paymentInformation?.taxInformation || 'NA'}
                                                  </Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>
                                        </List>
                                        <TableContainer component={Paper}>
                                          <Table sx={{ minWidth: 650 }} aria-label="caption table">
                                            <caption className="font-bold text-gray-900">
                                              {' '}
                                              *{viewModal?.details?.termsAndConditions}
                                            </caption>
                                            <TableHead>
                                              <TableRow>
                                                <TableCell align="center">Group Size</TableCell>
                                                <TableCell align="center">Price Per Session</TableCell>
                                             
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {viewModal?.details?.ratesAndPricing?.groupPricing?.map((row) => (
                                                <TableRow>
                                                  <TableCell component="th" scope="row" align="center">
                                                    {row.groupSize}
                                                  </TableCell>
                                                  <TableCell component="th" scope="row" align="center">
                                                    INR {row.rate}/-
                                                  </TableCell>
                                           
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </TableContainer>
                                      </MainCard>
                                    </Grid> */}
                                </Grid>
                              </Grid>
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
                                    <MainCard title="Location/Address">
                                      <List sx={{ py: 0 }}>
                                        <ListItem divider>
                                          <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">Primary Location</Typography>
                                              </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">{viewModal?.details?.address1 || 'NA'}</Typography>
                                                <Typography color="secondary">{viewModal?.details?.address2 || 'NA'}</Typography>
                                              </Stack>
                                            </Grid>
                                          </Grid>
                                        </ListItem>
                                        <ListItem divider>
                                          <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">Pincode</Typography>
                                                {/* <Typography>2014-2017</Typography> */}
                                              </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">{viewModal?.details?.pincode || 'NA'}</Typography>
                                              </Stack>
                                            </Grid>
                                          </Grid>
                                        </ListItem>

                                        <ListItem divider>
                                          <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">State</Typography>
                                                {/* <Typography>2014-2017</Typography> */}
                                              </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">{viewModal?.details?.state || 'NA'}</Typography>
                                                {/* <Typography>-</Typography> */}
                                              </Stack>
                                            </Grid>
                                          </Grid>
                                        </ListItem>

                                        {/* <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Institution Name</Typography>
                                                  <Typography>2014-2017</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.institutionName || 'NA'}</Typography>
                                                  <Typography>-</Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem> */}

                                        <ListItem divider>
                                          <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">Country</Typography>
                                                {/* <Typography>2014-2017</Typography> */}
                                              </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                              <Stack spacing={0.5}>
                                                <Typography color="secondary">{viewModal?.details?.country || 'NA'}</Typography>
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
      {/* <PaginationComponent page={page} setPage={setPage} filteredData={filteredData} rowsPerPage={rowsPerPage} /> */}

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

const Coachesavailability = () => {
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
          const response = await axios.get(`${server}/api/Coachavailibility/getall`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            setUserData(response.data.data);
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
      //   { Header: 'ID', accessor: 'id', width: 100  },

      // { Header: 'Institution ID', accessor: 'institutionId' },
      { Header: 'Coach Name', accessor: 'coachName' },
      { Header: 'Coach ID', accessor: 'coachId' },

      { Header: 'School Name', accessor: 'schoolName' },

      //   { Header: 'Phone', accessor: 'phone' },
      // { Header: 'Email', accessor: 'email' },
      // { Header: 'Sports', accessor: 'sports' },
      { Header: 'Institution ID', accessor: 'institutionId' },

      //   { Header: 'Social Media', accessor: 'socialMedia' },
      // { Header: 'IsVerified', accessor: 'isVerified' },
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

export default Coachesavailability;
