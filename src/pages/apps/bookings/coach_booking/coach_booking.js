import PropTypes from 'prop-types';
import { useMemo, Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Avatar from '../../../../components/@extended/Avatar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
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
import MainCard from '../../../../components/MainCard';
import ScrollX from '../../../../components/ScrollX';
import { renderFilterTypes } from 'utils/react-table';
import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';
import { Trash, Eye, Edit, AddCircle } from 'iconsax-react';
import makeData from 'data/react-table';
import { ThemeMode } from 'config';
// import IconButton from 'components/@extended/IconButton';
import IconButton from '../../../../components/@extended/IconButton';
import SearchBar from '../../components/Searchbar';
import PaginationComponent from '../../components/Pagination';
import Box from '@mui/material/Box';
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
  Chip,
  ListItemText
} from '@mui/material';

import SimpleBar from '../../../../components/third-party/SimpleBar';
import { EditLocation } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import Pagination from '../../components/Pagination/Pagination';

const server = process.env.REACT_APP_API_URL;
// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent, setcoachData, setUserData }) {
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

  const [AddcoachName, setaddcoachName] = useState();
  const [AddLocation, setaddLocation] = useState();
  const [AddPrice, setAddPrice] = useState();
  const [AddImage, setAddImage] = useState();
  //   const [AddRole, setAddRole] = useState('coach');
  const [AddFacility, setAddFacility] = useState();

  const [EditschoolcoachName, setEditschoolcoachName] = useState();

  const [EditInstitutionId, setEditInstitutionId] = useState();
  const [Editprice, setEditprice] = useState();
  const [Editrating, setEditrating] = useState();
  const [Editaddress1, setEditaddress1] = useState();
  const [Editaddress2, setEditaddress2] = useState();
  const [Editcity, setEditcity] = useState();
  const [Editstate, setEditstate] = useState();
  const [Editcountry, setEditcountry] = useState();
  const [editPincode, seteditPincode] = useState();

  const [schoolNames, setschoolNames] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState('');
  // const [EditschoolcoachName, setEditschoolcoachName] = useState('');
  const [EditschoolcoachNameError, setEditschoolcoachNameError] = useState(false);

  const [slotopen, setslotopen] = useState(false);

  const [timetableData, setTimetableData] = useState([]);
  const [institutionIdError, setinstitutionIdError] = useState(false);
  const [schoolid, setschoolid] = useState('');
  const [schoolData, setschoolData] = useState('');

  const handleSlotClose = () => {
    setslotopen(false);
    console.log('slot close hua?');
  };

  const Weekdays = [
    { id: 1, Day: 'Monday' },
    { id: 2, Day: 'Tuesday' },
    { id: 3, Day: 'Wednesday' },
    { id: 4, Day: 'Thursday' },
    { id: 5, Day: 'Friday' }
  ];

  const Time = [
    { id: 1, startTime: '10AM', endTime: '11AM' },
    { id: 2, startTime: '11AM', endTime: '12PM' },
    { id: 3, startTime: '12PM', endTime: '01PM' },
    { id: 4, startTime: '01PM', endTime: '02AM' },
    { id: 5, startTime: '03PM', endTime: '04PM' },
    { id: 6, startTime: '04PM', endTime: '05PM' },
    { id: 7, startTime: '05PM', endTime: '06PM' },
    { id: 8, startTime: '06PM', endTime: '07PM' },
    { id: 9, startTime: '07PM', endTime: '08PM' },
    { id: 10, startTime: '08PM', endTime: '09PM' },
    { id: 11, startTime: '09PM', endTime: '10PM' }
  ];

  // School coach Name

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate("/");
      } else {
        try {
          const response = await axios.get(`${server}/api/admin/schools`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            setschoolNames(response.data.data);
            console.log('api school  names---', response.data.data);
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

  const [value, setValue] = useState(dayjs('2022-04-17T15:30'));

  const handleClose = () => setOpen(false);

  const [viewModal, setViewModal] = useState({
    open: false,
    details: null,
    completeDetails: null
  });

  const [slotEditModal, setslotEditModal] = useState({
    open: false,
    details: null,
    completeDetails: null
  });

  const server = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleOpenViewModal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${server}/api/coach/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Assuming your raw body response is plain text
      const responseDataCart = response.data;
      const responseData = response.data.data;
      console.log('This is view response data', responseData);
      setschoolid(responseData?.school);

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

  const SchoolDetails = async (schoolid) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${server}/api/admin/user/${schoolid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Assuming your raw body response is plain text
      // const responseDataCart = response.data;
      const responseData = response.data.data;
      console.log('This response data particualr school details-->', responseData);
      //  setschoolid(responseData?.school);
      setschoolData(responseData);

      // Adjust this logic based on the actual format of your raw body response
      // For example, if your response is plain text, you might display it directly
      //  setOpen(true);
      //  setViewModal({
      //   //  details: responseData,
      //    completeDetails: responseDataCart // Adjust this line accordingly
      //  });
    } catch (error) {
      console.error('Error fetching User details:', error);
    }
  };

  useEffect(() => {
    if (schoolid) {
      SchoolDetails(schoolid);
    }
  }, [schoolid]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'backcoach.paper',
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
    return data?.filter((row) => Object.values(row)?.some((value) => value.toString().toLowerCase().includes(filterText.toLowerCase())));
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
        await axios.delete(`${server}/api/coach/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const updatedcoachs = data.filter((coach) => coach._id !== id);
        setUserData(updatedcoachs);
        console.log('Deleted coach of id -->', id);
        toast.success('Booking deleted Successfully');
        if (page > Math.ceil(updatedcoachs.length / rowsPerPage) - 1) {
          setPage(0);
        }
        // }
      } catch (error) {
        console.error('Error deleting coach:', error);
        toast.error('Error Deleting Record');
      }
    }
    setDeleteConfirmation({ open: false, id: null });
  };

  // add new coach

  const handleSaveNewcoach = async () => {
    try {
      // ---- IT's Working ------
      const requestData = {
        name: AddcoachName,
        location: AddLocation,
        price: AddPrice,
        image: AddImage,
        facility: AddFacility
      };

      const token = localStorage.getItem('token');
      console.log(token);
      const response = await axios.post(`${server}/api/coach/create`, requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });

      // Handle the response as needed
      console.log('Create API response:', response.data);

      if (response.status === 201) {
        // Close the add new modal after successful creation
        // setAddNewModal({ open: false });
        // setaddcoachName('');
        setaddcoachName('');
        setAddPrice('');
        setAddImage('');
        // setAddRole('');
        setAddFacility('');
        // setAddPassword('');

        try {
          const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/coach/getall`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setUserData(updatedData.data.data);
          console.log('record save successfully--->', updatedData);
          toast('New coach Added Successfully');
        } catch (error) {
          console.log('Error duing Updated DAta fetching', error);
        }
      } else {
        toast.error('Error Creating coach');
      }
    } catch (error) {
      console.error('Error creating coach:', error);

      toast.error('Error creating coach');
    }
  };

  // async function schoolDetails(schoolid) {
  //   const token = localStorage.getItem('token');
  //   const response = await axios.get(`${server}/api/admin/user/${schoolid}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   });

  //   // Assuming your raw body response is plain text
  //   // const responseDataCart = response.data;
  //   const responseData = response.data;
  //   // setschoolData(responseData?.school)

  //   console.log('This is response data coach--->', responseData);

  //   // // Adjust this logic based on the actual format of your raw body response
  //   // // For example, if your response is plain text, you might display it directly
  // }

  // useEffect(() => {
  //   schoolDetails(schoolid);
  // }, [schoolid]);

  const [addNewModal, setAddNewModal] = useState({
    open: false
  });

  const handleAddModalClose = () => {
    setAddNewModal({
      open: false
    });
  };

  const handleCheckboxChange = (value, isChecked) => {
    console.log('value , is checked--->', value, isChecked);
    if (isChecked) {
      setSelectedAmenities((prevValues) => (prevValues ? prevValues + ',' + value : value));
    } else {
      setSelectedAmenities((prevValues) =>
        prevValues
          .split(',')
          .filter((item) => item !== value)
          .join(',')
      );
    }
  };

  // Edit Plans

  //  Edit Plans

  const [editModal, setEditModal] = useState({
    open: false,
    details: null
  });

  // Edit Slot Management

  // -----------View Modal------------

  const AddSlot = (dayOfWeek, startTime, endTime, totalSlots) => {
    console.log('startedn-------->', startTime, endTime, dayOfWeek, totalSlots);

    const existingIndex = timetableData.findIndex(
      (item) => item.dayOfWeek === dayOfWeek && item.startTime === startTime && item.endTime === endTime
    );
    if (existingIndex !== -1) {
      // If an entry for this day and time already exists, update its value
      const newTimetableData = [...timetableData];
      console.log('newtimetabledata---->', newTimetableData);
      newTimetableData[existingIndex].totalSlots = totalSlots;
      setTimetableData(newTimetableData);
    } else {
      // If an entry for this day and time doesn't exist, create a new one
      setTimetableData((prevData) => [...prevData, { dayOfWeek, startTime, endTime, totalSlots }]);
    }

    console.log('Timetable data--->', timetableData);
  };

  const handleEditSlotManagement = async (id) => {
    try {
      // const token = localStorage.getItem('token');
      // const response = await axios.get(`${server}/api/admin/user/${id}`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });

      // // Assuming your raw body response is plain text
      // const responseDataCart = response.data;
      // const responseData = response.data.data;
      // console.log('This is view response data', responseData);

      // // Adjust this logic based on the actual format of your raw body response
      // // For example, if your response is plain text, you might display it directly
      setslotopen(true);
      setslotEditModal(true);
    } catch (error) {
      console.error('Error fetching User details:', error);
    }
  };

  const handleEdit = (details) => {
    setEditModal({
      open: true,
      details: { ...details }
    });
    console.log('edit details--->', details);

    // Set the initial values for editing
    setEditschoolcoachName(details?.name);
    setEditInstitutionId(details?.InstitutionId);
    console.log('details m name--->', details?.name);
    // seteditPincode(details?.actualPrice);
    setEditprice(details?.price);
    setEditrating(details?.rating);
    setEditaddress1(details?.address1);
    setEditaddress2(details?.address2);
    setEditcity(details?.city);
    setEditstate(details?.state);
    setEditcountry(details?.country);
    setSelectedAmenities(details?.amenities);

    seteditPincode(details?.pincode);

    console.log('Initializatin completed');
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
      const requestData = {
        name: EditschoolcoachName,
        // location: EditLocation,
        InstitutionId: EditInstitutionId,
        price: Editprice,
        rating: Editrating,
        address1: Editaddress1,
        address2: Editaddress2,
        city: Editcity,
        state: Editstate,
        country: Editcountry,
        pincode: editPincode,
        amenities: selectedAmenities,
        slots: JSON.stringify(timetableData)
      };

      const token = localStorage.getItem('token');
      const response = await axios.put(`${server}/api/coach/update/${editModal.details._id}`, requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });

      // Handle the response as needed

      if (response.status === 200) {
        // Close the edit modal after successful update
        setEditModal({ open: false, details: null });
        // setaddcoachName();
        setEditschoolcoachName();
        setEditprice();
        setEditrating();
        setEditInstitutionId();
        seteditPincode();

        // Fetch the updated data from the server and update the rowData state
        try {
          const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/coach/getall`, {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${token}`
            }
          });
          setUserData(updatedData.data.data);
          console.log('Updated rowData:', updatedData);
        } catch (error) {
          console.log('Error', error);
        }

        toast('Record updated Successfully');
      } else {
        toast.error('Record Not updated.. Try Again');
      }
    } catch (error) {
      console.error('Error updating record:', error);
      // Handle error and display a toast or error message to the user
      toast.error('Error updating record');
    }
  };

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
              onClick={() => navigate('/apps/create-coachs')}
              data-modal-toggle="add-modal"
            >
              Add New coach
            </Button>
          </Stack> */}
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
              // ?.filter((row) => row.isDeleted === false)
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
                  <TableCell className="text-center" style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                      {/* <Avatar variant="rounded" color="secondary" size="sm" src={`${row?.picture}`} /> */}

                      <Typography className='text-[12px]'>{row?.schoolId?.institutionId || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                      {/* <Avatar variant="rounded" color="secondary" size="sm" src={`${row?.picture}`} /> */}

                      <Typography className='text-[12px]'>{row?.schoolId?.institutionName || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className='text-center' style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                      <Typography className='text-[12px]'>{row?.userId?.userName || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className='text-center' style={{ width: '25%' }}>
                    <Stack direction="row" alignItems="center" justifyContent='center' className="flex flex-row flex-wrap gap-1 ">
                      {row?.coachId?.sportsgrounds?.map((r) => (
                        <Typography className="border-[2px] border-[#5f6368]/10 text-[12px] bg-gray-50 text-gray-600 rounded-full px-2 py-[2px] ">
                          {r}
                        </Typography>
                      )) || 'NA'}
                    </Stack>
                  </TableCell>

                  <TableCell className='text-center' style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                      <Typography className='text-[12px]'>{row?.totalPrice || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className='text-center' style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                      {row?.bookingDateTime === 'Invalid, time has ended' && <Chip label="Invalid" color="error" />}
                      {row?.bookingDateTime === 'Valid' && <Chip label="Valid" color="secondary" />}
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                      <Button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4" onClick={() => window.open(row?.url, '_blank')}>
                        View
                      </Button>
                    </Stack>
                  </TableCell>

                  <TableCell style={{ width: '25%' }}>
                    <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
                      {/* View */}

                      <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backcoachColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                              opacity: 0.9
                            }
                          }
                        }}
                        title="View"
                      >
                        <IconButton color="success" onClick={() => navigate(`/apps/coach-booking-details/${row._id}`)}>
                          <Eye />
                        </IconButton>
                      </Tooltip>

                      {/* <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backcoachColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                              opacity: 0.9
                            }
                          }
                        }}
                        title="Edit"
                      >
                        <IconButton
                          color="primary"
                          
                          onClick={() => navigate(`/apps/edit-coach/${row._id}`)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip> */}

                      <Dialog
                        open={open}
                        TransitionComponent={PopupTransition}
                        keepMounted
                        onClose={handleClose}
                        aria-describedby="alert-dialog-slide-description"
                        sx={{
                          '& .MuiDialog-paper': { width: 2048, maxWidth: 1, m: { xs: 1.75, sm: 2.5, md: 4 } },
                          backcoachColor: '#ffffff',
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
                                      //   alt={coach.fatherName}
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
                                    <Grid item xs={12}>
                                      <MainCard title="Details">
                                        <List sx={{ py: 0 }}>
                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Institution Id</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{schoolData?.institutionId || 'NA'}</Typography>
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
                                                  <Typography color="secondary">{viewModal?.details?.institutionName || 'NA'}</Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Sports</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{schoolData?.sportscoachs || 'NA'}</Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Amenities</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.amenities || 'NA'}</Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">City</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{schoolData?.city || 'NA'}</Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">State</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{schoolData?.state || 'NA'}</Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Country</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{schoolData?.country || 'NA'}</Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Pincode</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{schoolData?.pincode || 'NA'}</Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Google Map Link</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">
                                                    <Link
                                                      onClick={() => window.open(schoolData.googlemaplink, '_blank')}
                                                      View
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="cursor-pointer"
                                                    >
                                                      {schoolData?.googlemaplink || 'NA'}
                                                    </Link>
                                                  </Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Price</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.price || 'NA'}</Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Rating</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.rating || 'NA'}</Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Image</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  {/* <Typography color="secondary">{viewModal?.details?.rating || 'NA'}</Typography> */}
                                                  {/* {viewModal?.details?.images.map((name) => (
                                                  <img src={name} width="30px" height="30px" />
                                                ))} */}

                                                  <Grid container>
                                                    {viewModal?.details?.images?.map((image, index) => (
                                                      <Grid key={index} item xs={3}>
                                                        {image && (
                                                          <img
                                                            alt="Uploaded Image"
                                                            className="aspect-[4/3] w-full rounded-lg object-cover"
                                                            height={200}
                                                            src={image}
                                                            width={300}
                                                          />
                                                        )}
                                                      </Grid>
                                                    ))}
                                                  </Grid>

                                                  {/* <Typography color="secondary">{viewModal?.details?.rating || 'NA'}</Typography> */}
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
                                  backcoachColor: 'darkred' // Change this to the hover color you want
                                }
                              }}
                            >
                              Close
                            </Button>
                          </DialogActions>
                        </Box>

                        {/* VIewmodaljsxend */}
                      </Dialog>

                      {/* <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backcoachColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
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
                            handleDeleteConfirmation(row._id);
                          }}
                        >
                          <Trash />
                        </IconButton>
                      </Tooltip> */}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

            {/* Pagination */}
            {/* <PaginationComponent page={page} setPage={setPage} filteredData={filteredData} rowsPerPage={rowsPerPage} /> */}

            {/* <=====--------------- */}
          </TableBody>
        </Table>
        <div className="float-left mt-2 py-2 ">
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
          <div className="bg-white p-6 rounded-md max-w-md w-full mx-4 max-h-[75vh] overflow-y-auto">
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
                handleSaveNewcoach();

                e.preventDefault();
              }}
            >
              <h3 className="text-2xl font-medium text-gray-800 mb-4">Enter New coach Details</h3>

              <Select
                autocomplete="off"
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                name="sportscoachs"
                value={EditschoolcoachName}
                fullWidth
                onChange={(e) => {
                  setEditschoolcoachName(e.target.value);
                  setEditschoolcoachNameError(false); // Reset error when user types
                }}
                required
                error={EditschoolcoachNameError}
                helperText={EditschoolcoachNameError && 'Weekday is required'}
                variant="outlined"
                size="small"
                sx={{ width: '100%' }}
              >
                {schoolNames?.map((name) => (
                  <MenuItem value={name.institutionName}>{name.institutionName}</MenuItem>
                ))}
              </Select>

              <div>
                <label htmlFor="coachName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter coach Name"
                  required
                  onChange={(e) => setaddLocation(e.target.value)}
                  value={AddLocation}
                />
              </div>

              <div>
                <label htmlFor="discountpercentage" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Your Price"
                  required
                  onChange={(e) => setAddPrice(e.target.value)}
                  value={AddPrice}
                />
              </div>

              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900" for="small_size">
                  Image
                </label>
                <input name="image" id="image" type="file" onChange={(e) => setAddImage(e.target.value)} value={AddImage}></input>
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

      {/*  edit plans  */}
      {editModal.open && (
        <div className="fixed top-0 left-0 w-[100vw] h-full flex items-center justify-center align-middle  bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between p-2">
              <div className="div">
                <h3 className="text-2xl font-medium text-gray-800 mb-4">Edit coach Details</h3>
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
              {/* <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  coach Name
                </label>
                <input
                  type="text"
                  name="coachName"
                  id="coachName"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter coach Name"
                  required=""
                  onChange={(e) => setEditschoolcoachName(e.target.value)}
                  value={EditschoolcoachName}
                />
              </div> */}
              <Select
                autocomplete="off"
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                name="sportscoachs"
                value={EditschoolcoachName}
                fullWidth
                onChange={(e) => {
                  setEditschoolcoachName(e.target.value);
                  setEditschoolcoachNameError(false); // Reset error when user types
                }}
                // required
                error={EditschoolcoachNameError}
                helperText={EditschoolcoachNameError && 'Weekday is required'}
                variant="outlined"
                size="small"
                // value={EditschoolcoachName}
                sx={{ width: '100%' }}
              >
                {console.log('Selected coach--->', EditschoolcoachName)}
                {schoolNames?.map((name) => (
                  <MenuItem value={name.institutionName}>{name.institutionName}</MenuItem>
                ))}
              </Select>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Institution Id
                </label>
                <input
                  type="text"
                  name="InstitutionId"
                  id="InstitutionId"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter coach Name"
                  required=""
                  onChange={(e) => setEditInstitutionId(e.target.value)}
                  value={EditInstitutionId}
                />
              </div>

              <div>
                <label htmlFor="discountpercentage" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Price"
                  required=""
                  onChange={(e) => setEditprice(e.target.value)}
                  value={Editprice}
                />
              </div>

              <div>
                <label htmlFor="discountpercentage" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  id="rating"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Price"
                  required=""
                  onChange={(e) => setEditrating(e.target.value)}
                  value={Editrating}
                />
              </div>

              {/* address1 */}

              <div>
                <label htmlFor="discountpercentage" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Address 1
                </label>
                <input
                  type="text"
                  name="address1"
                  id="address1"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Price"
                  required=""
                  onChange={(e) => setEditaddress1(e.target.value)}
                  value={Editaddress1}
                />
              </div>

              {/* address2 */}

              <div>
                <label htmlFor="discountpercentage" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Address 2
                </label>
                <input
                  type="text"
                  name="address2"
                  id="address2"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Price"
                  required=""
                  onChange={(e) => setEditaddress2(e.target.value)}
                  value={Editaddress2}
                />
              </div>

              {/* city */}

              <div>
                <label htmlFor="discountpercentage" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Price"
                  required=""
                  onChange={(e) => setEditcity(e.target.value)}
                  value={Editcity}
                />
              </div>

              {/* state */}

              <div>
                <label htmlFor="discountpercentage" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Price"
                  required=""
                  onChange={(e) => setEditstate(e.target.value)}
                  value={Editstate}
                />
              </div>

              {/* country */}

              <div>
                <label htmlFor="discountpercentage" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Price"
                  required=""
                  onChange={(e) => setEditcountry(e.target.value)}
                  value={Editcountry}
                />
              </div>

              <div>
                <label htmlFor="actualPrice" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Pincode
                </label>
                <input
                  type="number"
                  name="actualPrice"
                  id="actualPrice"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter ActualPrice "
                  required=""
                  onChange={(e) => seteditPincode(e.target.value)}
                  value={editPincode}
                />
              </div>

              {/* Amenities */}

              <div>
                {' '}
                <label htmlFor="actualPrice" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Ammenities
                </label>
                <div className="flex justify-between">
                  <div className="flex items-center px-5">
                    <input
                      id="bordered-checkbox-1"
                      type="checkbox"
                      value="Shower"
                      name="bordered-checkbox"
                      className="w-4 h-4 text-blue-60"
                      onChange={(e) => handleCheckboxChange(e.target.value, e.target.checked)}
                      checked={selectedAmenities.includes('Shower')}
                    />
                    {console.log('selected aminities--->', selectedAmenities)}
                    <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                      Shower
                    </label>
                  </div>
                  <div className="flex items-center px-10">
                    <input
                      id="bordered-checkbox-1"
                      type="checkbox"
                      value="Parking"
                      name="bordered-checkbox"
                      className="w-4 h-4 text-blue-60"
                      onChange={(e) => handleCheckboxChange(e.target.value, e.target.checked)}
                      checked={selectedAmenities.includes('Parking')}
                    />
                    <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                      Parking
                    </label>
                  </div>
                </div>
                {/* 2 */}
                <div className="flex justify-between">
                  <div className="flex items-center px-5">
                    <input
                      id="bordered-checkbox-1"
                      type="checkbox"
                      value="Drinking Water"
                      name="bordered-checkbox"
                      className="w-4 h-4 text-blue-60"
                      onChange={(e) => handleCheckboxChange(e.target.value, e.target.checked)}
                      checked={selectedAmenities.includes('Drinking Water')}
                    />
                    {console.log('selected aminities--->', selectedAmenities)}
                    <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                      Drinking Water
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="bordered-checkbox-1"
                      type="checkbox"
                      value="Change Room"
                      name="bordered-checkbox"
                      className="w-4 h-4 text-blue-60"
                      onChange={(e) => handleCheckboxChange(e.target.value, e.target.checked)}
                      checked={selectedAmenities.includes('Change Room')}
                    />
                    <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                      Change Room
                    </label>
                  </div>
                </div>
                {/* 3 */}
                <div className="flex justify-between">
                  <div className="flex items-center px-5">
                    <input
                      id="bordered-checkbox-1"
                      type="checkbox"
                      value="CC TV's"
                      name="bordered-checkbox"
                      className="w-4 h-4 text-blue-60"
                      onChange={(e) => handleCheckboxChange(e.target.value, e.target.checked)}
                      checked={selectedAmenities.includes("CC TV's")}
                    />

                    <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                      CC TV's
                    </label>
                  </div>
                  <div className="flex items-center px-14">
                    <input
                      id="bordered-checkbox-1"
                      type="checkbox"
                      value="Toilet"
                      name="bordered-checkbox"
                      className="w-4 h-4 text-blue-60"
                      onChange={(e) => handleCheckboxChange(e.target.value, e.target.checked)}
                      checked={selectedAmenities.includes('Toilet')}
                    />
                    <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                      Toilet
                    </label>
                  </div>
                </div>
                {/* 4 */}
                <div className="flex justify-between">
                  <div className="flex items-center px-5">
                    <input
                      id="bordered-checkbox-1"
                      type="checkbox"
                      value="Night Lights"
                      name="bordered-checkbox"
                      className="w-4 h-4 text-blue-60"
                      onChange={(e) => handleCheckboxChange(e.target.value, e.target.checked)}
                      checked={selectedAmenities.includes('Night Lights')}
                    />

                    <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                      Night Lights
                    </label>
                  </div>
                  <div className="flex items-center px-10">
                    <input
                      id="bordered-checkbox-1"
                      type="checkbox"
                      value="Lockers"
                      name="bordered-checkbox"
                      className="w-4 h-4 text-blue-60"
                      onChange={(e) => handleCheckboxChange(e.target.value, e.target.checked)}
                      checked={selectedAmenities.includes('Lockers')}
                    />
                    <label for="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">
                      Lockers
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="actualPrice" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Slot
                </label>
                <Button onClick={(e) => handleEditSlotManagement()} className="bg-yellow-500 text-white">
                  Slot Management
                </Button>
              </div>

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

      {/* Edit SLot */}

      <Dialog
        open={slotopen}
        TransitionComponent={PopupTransition}
        keepMounted
        onClose={handleSlotClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          '& .MuiDialog-paper': { width: 1560, maxWidth: 1, m: { xs: 1.75, sm: 2.5, md: 4 } },
          backcoachColor: '#ffffff'
          // height: '0vh'
        }}
      >
        {/* Viewmodaljsx */}

        <Box id="PopupPrint" sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 1, height: '100vh' }}>
          <DialogActions>
            <Button
              color="error"
              variant="contained"
              onClick={handleSlotClose}
              className="bg-red-500 hover:bg-red-700"
              sx={{
                '&:hover': {
                  backcoachColor: 'darkred' // Change this to the hover color you want
                }
              }}
            >
              Close
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={handleSlotClose}
              className="bg-blue-500 hover:bg-red-700"
              sx={{
                '&:hover': {
                  backcoachColor: 'darkred' // Change this to the hover color you want
                }
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  renderRowSubComponent: PropTypes.any,
  handleAdd: PropTypes.func
};

// ==============================|| coach - LIST ||============================== //

const CoachBooking = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const data = useMemo(() => makeData(200), []);
  const [open, setOpen] = useState(false);
  const [coach, setcoach] = useState(null);
  const [coachDeleteId, setcoachDeleteId] = useState('');
  const [add, setAdd] = useState(false);
  const [userData, setUserData] = useState([]);

  const handleAdd = () => {
    setAdd(!add);
    if (coach && !add) setcoach(null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate("/");
      } else {
        try {
          const response = await axios.get(`${server}/api/booking/coach-bookings`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            setUserData(response.data.data);
            console.log('api data---', response.data.data);
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
      { Header: 'Institution ID', accessor: 'id', width: 100 },
      { Header: 'Institution Name', accessor: 'institutionName' },
      { Header: 'Username', accessor: 'userName' },
      // { Header: 'Rating', accessor: 'rating' },
      { Header: 'Sports', accessor: 'sports' },
      { Header: 'Price', accessor: 'price' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Invoice', accessor: 'invoice' },
      { Header: 'Actions', accessor: 'actions' }

      //   { Header: 'Status', accessor: 'status' }
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

export default CoachBooking;
