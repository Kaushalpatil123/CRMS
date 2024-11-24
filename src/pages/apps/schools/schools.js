import PropTypes from 'prop-types';
import { useMemo, Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Avatar from '../../../components/@extended/Avatar';
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
  Typography,
  Tooltip,
  Button,
  FormControl,
  InputLabel,
  TextField
} from '@mui/material';
import MainCard from '../../../components/MainCard';
import ScrollX from '../../../components/ScrollX';
import { renderFilterTypes } from 'utils/react-table';
import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';
import { Trash, Eye, Edit, AddCircle } from 'iconsax-react';
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
import SimpleBar from '../../../components/third-party/SimpleBar';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import Pagination from '../components/Pagination/Pagination';

const server = process.env.REACT_APP_API_URL;

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent, setSchoolData, setschoolData }) {
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

  const [AddInstitutionName, setaddInstitutionName] = useState();
  const [AddAddress1, setAddAddress1] = useState();
  const [AddPrice, setAddPrice] = useState();
  const [AddImage, setAddImage] = useState();
  //   const [AddRole, setAddRole] = useState('School');
  const [AddFacility, setAddFacility] = useState();

  const [editInstitutionId, seteditInstitutionId] = useState();
  const [Editprice, setEditprice] = useState();
  const [EditactualPrice, setEditactualPrice] = useState();
  const [value, setValue] = useState(dayjs('2022-04-17T15:30'));
  const [editinstitutionName, seteditInstitutionName] = useState();
  const [editinstitutionEmail, seteditInstitutionEmail] = useState();
  const [editcontactpersonEmailId, seteditcontactpersonEmailId] = useState();
  const [editcontactpersonName, seteditcontactpersonName] = useState();
  const [editcontactpersonPhoneNumber, seteditcontactpersonPhoneNumber] = useState();
  const [editaddress1, seteditaddress1] = useState();
  const [editaddress2, seteditaddress2] = useState();
  const [editState, seteditState] = useState();
  const [editCity, seteditCity] = useState();
  const [editCountry, seteditCountry] = useState();
  const [editGoogleMapLink, seteditGoogleMapLink] = useState();
  const [editSportsdGroundName, seteditSportsdGroundName] = useState();

  const [editweekdayfrom, seteditweekdayfrom] = useState();
  const [editweekdayto, seteditweekdayto] = useState();
  const [editweekdayfromtime, seteditweekdayfromtime] = useState();
  const [editweekdaytotime, seteditweekdaytotime] = useState();
  const [editweekendfromtime, seteditweekendfromtime] = useState();
  const [editweekendtotime, seteditweekendtotime] = useState();

  const [AddinstitutionemailId, setaddinstitutionemailId] = useState();
  const [AddAddress2, setAddAddress2] = useState();
  const [AddCountry, setAddCountry] = useState();
  const [AddCity, setAddCity] = useState();
  const [AddState, setAddState] = useState();
  const [AddPincode, setAddPincode] = useState();
  const [Addcontactpersonname, setAddcontactpersonname] = useState();
  const [Addcontactpersonemail, setAddcontactpersonemail] = useState();
  const [AddinstitutionPassword, setaddinstitutionPassword] = useState();
  const [Addgoglemaplink, setaddgooglemaplink] = useState();
  const [AddInstitutionId, setaddInstitutionId] = useState();
  const [AddRole, setAddRole] = useState('school');
  const [editcontactpersonPhoneNumberError, seteditcontactpersonPhoneNumberError] = useState('');
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [DialogPasswordUserId, setDialogPasswordUserId] = useState('');

  const handlePasswordDialogOpen = (id) => {
    setDialogPasswordUserId(id);
    setOpenPasswordDialog(true);
    if (localStorage.getItem('role') === 'superadmin') {
      handleDeleteConfirmation(id);
    }
  };

  const handlePasswordDialogClose = () => {
    setOpenPasswordDialog(false);
    // setPassword('');
    // setErrorMessage('');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    const role = localStorage.getItem('role');

    if (role === 'admin') {
      if (password) {
        handlePasswordDialogClose();
        handleDeleteConfirmation(DialogPasswordUserId);
      } else {
        toast.error('Incorrect Password, Try again');
      }
    }
  };

  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const [viewModal, setViewModal] = useState({
    open: false,
    details: null,
    completeDetails: null
  });

  const server = process.env.REACT_APP_API_URL;

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

  const filteredData = useMemo(() => {
    // console.log("this is rowData", rowData);
    if (!filterText) return data; // Using rowData as initial data
    return data?.filter((row) => Object.values(row)?.some((value) => value.toString().toLowerCase().includes(filterText.toLowerCase())));
  }, [data, filterText]);

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

    if (id) {
      try {
        const token = localStorage.getItem('token');
        // if (!token) {
        // navigate("/");
        // } else {
        await axios.delete(`${server}/api/admin/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            password: password
          }
        });

        const updatedsubscriptions = data.filter((subscription) => subscription._id !== id);
        setschoolData(updatedsubscriptions);

        toast.success('Record deleted Successfully');
        if (page > Math.ceil(updatedsubscriptions.length / rowsPerPage) - 1) {
          setPage(0);
        }
        // }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
    setDeleteConfirmation({ open: false, id: null });
  };

  // add new school

  const handleSaveNewSchool = async () => {
    try {
      // ---- IT's Working ------
      const requestData = {
        // institutionName: AddInstitutionName,
        // address1: AddAddress1,
        // price: AddPrice,
        // image: AddImage,
        // facility: AddFacility
        role: AddRole,
        institutionId: AddInstitutionId,
        institutionName: AddInstitutionName,
        institutionemailId: AddinstitutionemailId,
        institutionemailId: AddinstitutionemailId,

        password: AddinstitutionPassword,
        address1: AddAddress1,
        address2: AddAddress2,
        country: AddCountry,
        city: AddCity,
        state: AddState,
        pincode: AddPincode,
        contactpersonname: Addcontactpersonname,
        contactpersonemailId: Addcontactpersonemail,
        googlemaplink: Addgoglemaplink
      };

      const token = localStorage.getItem('token');

      const response = await axios.post(`${server}/api/admin/create`, requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });

      // Handle the response as needed

      if (response.status === 201) {
        // Close the add new modal after successful creation
        // setAddNewModal({ open: false });
        // setaddInstitutionName('');
        setaddInstitutionId('');
        setaddInstitutionName('');
        setaddinstitutionemailId('');
        setaddinstitutionPassword('');
        setAddAddress1('');
        setAddAddress2('');
        setAddCity('');
        setAddCountry('');
        setaddinstitutionPassword('');
        setaddgooglemaplink('');
        setAddcontactpersonemail('');
        setAddcontactpersonname('');

        try {
          const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/admin/allusers`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setschoolData(updatedData.data.data);
          // console.log('record save successfully--->', updatedData);
          toast('New School Added Successfully');
        } catch (error) {
          toast.error(error?.response?.data?.message);
          // console.log('Error duing Updated DAta fetching', error);
        }
      } else {
        toast.error('Error Creating School');
      }
    } catch (error) {
      console.error('Error creating School:', error);

      toast.error('Error creating School');
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

  // Api call to Password decrypt

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

        setdecodedPass(decodedPass);
      } catch (error) {
        console.error('Error decoding card number:', error);
      }
    }
  };

  const [editModal, setEditModal] = useState({
    open: false,
    details: null
  });

  const handleEdit = (details) => {
    setEditModal({
      open: true,
      details: { ...details }
    });

    // Set the initial values for editing
    seteditInstitutionId(details.institutionId);
    seteditInstitutionName(details.institutionName);
    seteditInstitutionEmail(details.institutionemailId);
    seteditcontactpersonName(details.contactpersonname);
    seteditcontactpersonEmailId(details.contactpersonemailId);
    seteditcontactpersonPhoneNumber(details.contactpersonphoneNumber);
    seteditaddress1(details.address1);
    seteditaddress2(details.address2);
    seteditCity(details.city);
    seteditState(details.state);
    seteditCountry(details.country);
    seteditGoogleMapLink(details.googlemaplink);
    seteditSportsdGroundName(details.sportsgrounds);

    // seteditweekdayfrom(details?.SchoolSchedule?.weekdayfrom);
    console.log('Monday-Fri weekdayfromtime--->', details?.SchoolSchedule?.weekdaytotime);
    const apiTimeWeekday = details?.SchoolSchedule?.weekdayfromtime;
    if (apiTimeWeekday) {
      const [from, to] = apiTimeWeekday.split('-').map((time) => time.trim());
      const convertTo24Hour = (time) => {
        const [hours, minutes, period] = time.match(/(\d{2}):(\d{2})([APM]{2})/i).slice(1, 4);
        const hours24 = (parseInt(hours) % 12) + (period.toUpperCase() === 'PM' ? 12 : 0);
        return `${hours24.toString().padStart(2, '0')}:${minutes}`;
      };
      seteditweekdayfromtime(convertTo24Hour(from));
      seteditweekdaytotime(convertTo24Hour(to));
    }

    const apiTimeWeekend = details?.SchoolSchedule?.weekdaytotime;
    if (apiTimeWeekend) {
      const [from, to] = apiTimeWeekend.split('-').map((time) => time.trim());
      const convertTo24Hour = (time) => {
        const [hours, minutes, period] = time.match(/(\d{2}):(\d{2})([APM]{2})/i).slice(1, 4);
        const hours24 = (parseInt(hours) % 12) + (period.toUpperCase() === 'PM' ? 12 : 0);
        return `${hours24.toString().padStart(2, '0')}:${minutes}`;
      };
      seteditweekendfromtime(convertTo24Hour(from));
      seteditweekendtotime(convertTo24Hour(to));
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const formattedHour = hour % 12 || 12; // Handle 12:xx correctly
    const suffix = hour >= 12 ? 'PM' : 'AM';
    return `${formattedHour.toString().padStart(2, '0')}:${minutes}${suffix}`;
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
      if (editcontactpersonPhoneNumber.length !== 10) {
        seteditcontactpersonPhoneNumberError(true);
        toast.error('Phone number must be exactly 10 digits');

        return;
      }

      const weekdayformatfromtime = formatTime(editweekdayfromtime);
      const weekdayformattotime = formatTime(editweekdaytotime);
      const weekendformatfromtime = formatTime(editweekendfromtime);
      const weekendformattotime = formatTime(editweekendtotime);

      const formattedWeekdayTime = `${weekdayformatfromtime} - ${weekdayformattotime}`;

      console.log('formatweekdaytime abhi dekho jra kaisa h------->', formattedWeekdayTime);
      const formattedWeekendTime = `${weekendformatfromtime} - ${weekendformattotime}`;

      const temp = {
        weekdayfromtime: formattedWeekdayTime,

        weekdaytotime: formattedWeekendTime
      };

      // const tempString = JSON.stringify(temp);
      const requestData = {
        institutionId: editInstitutionId,
        institutionName: editinstitutionName,
        institutionemailId: editinstitutionEmail,
        contactpersonname: editcontactpersonName,
        contactpersonemailId: editcontactpersonEmailId,
        contactpersonphoneNumber: editcontactpersonPhoneNumber,
        address1: editaddress1,
        address2: editaddress2,
        city: editCity,
        state: editState,
        country: editCountry,
        googlemaplink: editGoogleMapLink,
        sportsgrounds: editSportsdGroundName,
        SchoolSchedule: temp
      };

      const token = localStorage.getItem('token');
      const response = await axios.put(`${server}/api/admin/update/${editModal.details._id}`, requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });

      // Handle the response as needed

      if (response.status === 200) {
        // Close the edit modal after successful update
        setEditModal({ open: false, details: null });
        setaddInstitutionName();
        setaddInstitutionId();
        setaddinstitutionemailId();
        setaddinstitutionPassword();
        setAddcontactpersonname();
        setAddcontactpersonemail();
        setAddAddress1();
        setAddAddress2();
        setAddCity();
        setAddState();
        setAddCountry();
        setaddgooglemaplink();

        // Fetch the updated data from the server and update the rowData state
        try {
          const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/admin/allusers`, {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${token}`
            }
          });
          const filteredData = updatedData.data.data.filter((user) => user.role === 'school' && user.isDeleted === false);
          setschoolData(filteredData);
          //    console.log('api dataamsdnasndam---', filteredData);
          // setschoolData(updatedData.data.data);
          // console.log('Updated rowData:', updatedData.data.data);
        } catch (error) {
          toast.error(error?.response?.data?.message);
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

          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              variant="contained"
              className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2"
              // startIcon={<Add />}
              // onClick={handleAddNew}
              onClick={() => navigate('/apps/create-schools')}
              data-modal-toggle="add-modal"
            >
              Add New School
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
              ?.filter((row) => row.role === 'school' && row.isDeleted === false)
              ?.map((row,index) => (
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

                      <Typography className='text-[12px]'>{row?.institutionId || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className='text-center' style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                      <Typography className='text-[12px]'>{row?.institutionName || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className='text-center' style={{ width: '25%' }}>
                    <Stack direction="row" alignItems="left" className="flex flex-row text-left items-left flex-wrap justify-start gap-1 ">
                      {row?.sportsgrounds?.map((r) => (
                        <Typography className="border-[2px] border-[#5f6368]/10 text-[12px] bg-gray-50 items-left text-gray-600 rounded-full px-2 py-[2px] ">
                          {r}
                        </Typography>
                      )) || 'NA'}
                    </Stack>
                  </TableCell>

                  <TableCell className='text-center' style={{ width: '15%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                      <Typography className='text-[12px]'>{row?.institutionemailId || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className='text-center' style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                      <Typography className='text-[12px]'>{row?.city || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className='text-center' style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                      <Typography className='text-[12px]'>{row?.state || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className='text-center' style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                      <Typography className='text-[12px]'>{row?.country || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  {/* <TableCell style={{ width: '25%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography>{row?.role || 'NA'}</Typography>
                  </Stack>
                </TableCell> */}

                  <TableCell style={{ width: '25%' }}>
                    <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
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
                        <IconButton color="success" onClick={() => navigate(`/apps/view-schools/${row._id}`)}>
                          <Eye />
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backSchoolColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                              opacity: 0.9
                            }
                          }
                        }}
                        title="View"
                      >
                        <IconButton
                          color="primary"
                          // onClick={(e) => {
                          // e.stopPropagation();
                          // handleClose();
                          // handleEdit(row);
                          onClick={() => navigate(`/apps/edit-school/${row._id}`)}
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
                          backSchoolColor: '#ffffff',
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
                                                  <Typography color="secondary">Institution Id</Typography>
                                                  {/* <Typography>2014-2017</Typography> */}
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.institutionId || 'NA'}</Typography>
                                                  {/* <Typography>-</Typography> */}
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Institution Name</Typography>
                                                  {/* <Typography>2014-2017</Typography> */}
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.institutionName || 'NA'}</Typography>
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
                                                  <Typography color="secondary">
                                                    {viewModal?.details?.institutionemailId || 'NA'}
                                                  </Typography>
                                                  {/* <Typography>-</Typography> */}
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
                                                  <Typography color="secondary">{viewModal?.details?.country || 'NA'}</Typography>
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
                                                  <Typography color="secondary">{viewModal?.details?.state || 'NA'}</Typography>
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
                                                  <Typography color="secondary">{viewModal?.details?.pincode || 'NA'}</Typography>
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
                                                  <Typography color="secondary">{viewModal?.details?.city || 'NA'}</Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Address 1</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.address1 || 'NA'}</Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Address 2</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.address2 || 'NA'}</Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Contact Person Name</Typography>
                                                  {/* <Typography>2014-2017</Typography> */}
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.contactpersonname || 'NA'}</Typography>
                                                  {/* <Typography>-</Typography> */}
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Contact Person Email</Typography>
                                                  {/* <Typography>2014-2017</Typography> */}
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">
                                                    {viewModal?.details?.contactpersonemailId || 'NA'}
                                                  </Typography>
                                                  {/* <Typography>-</Typography> */}
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Contact Person Phone Number</Typography>
                                                  {/* <Typography>2014-2017</Typography> */}
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">
                                                    {viewModal?.details?.contactpersonphoneNumber || 'NA'}
                                                  </Typography>
                                                  {/* <Typography>-</Typography> */}
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Geolocation</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">{viewModal?.details?.googlemaplink || 'NA'}</Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </ListItem>

                                          <ListItem divider>
                                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                  <Typography color="secondary">Password</Typography>
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
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
                                  backSchoolColor: 'darkred' // Change this to the hover color you want
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
                              backSchoolColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
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

      {/* Delete confirmation  */}

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
                handleSaveNewSchool();

                e.preventDefault();
              }}
            >
              <h3 className="text-2xl font-medium text-gray-800 mb-4">Add New School</h3>
              <div className="relative w-full lg:max-w-sm">
                <label htmlFor="InstitutionName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Role
                </label>
                <select
                  className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
                  name="role"
                  id="role"
                  value={AddRole}
                  onChange={(e) => setAddRole(e.target.value)}
                  defaultValue="school"
                >
                  <option value="school" name="role">
                    school
                  </option>
                  {/* Add other options here if needed */}
                </select>
              </div>

              <div>
                <label htmlFor="InstitutionName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Institution Id
                </label>
                <input
                  type="text"
                  name="institutionId"
                  id="institutionId"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Institution Id"
                  required
                  onChange={(e) => setaddInstitutionId(e.target.value)}
                  value={AddInstitutionId}
                />
              </div>
              <div>
                <label htmlFor="InstitutionName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  School Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter School Name"
                  required
                  onChange={(e) => setaddInstitutionName(e.target.value)}
                  value={AddInstitutionName}
                />
              </div>
              <div>
                <label htmlFor="InstitutionName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  School Email
                </label>
                <input
                  type="text"
                  name="institutionemailId"
                  id="institutionemailId"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter School Name"
                  required
                  onChange={(e) => setaddinstitutionemailId(e.target.value)}
                  value={AddinstitutionemailId}
                />
              </div>
              <div>
                <label htmlFor="InstitutionName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Password
                </label>
                <input
                  type="text"
                  name="password"
                  id="password"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter School Name"
                  required
                  onChange={(e) => setaddinstitutionPassword(e.target.value)}
                  value={AddinstitutionPassword}
                />
              </div>
              <div>
                <label htmlFor="InstitutionName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Address 1
                </label>
                <input
                  type="text"
                  name="address1"
                  id="address1"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter School Address 1"
                  required
                  onChange={(e) => setAddAddress1(e.target.value)}
                  value={AddAddress1}
                />
              </div>
              <div>
                <label htmlFor="InstitutionName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Address 2
                </label>
                <input
                  type="text"
                  name="address2"
                  id="address2"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Address 2"
                  required
                  onChange={(e) => setAddAddress2(e.target.value)}
                  value={AddAddress2}
                />
              </div>
              <div>
                <label htmlFor="InstitutionName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Address 2"
                  required
                  onChange={(e) => setAddCountry(e.target.value)}
                  value={AddCountry}
                />
              </div>
              <div>
                <label htmlFor="InstitutionName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter School City"
                  required
                  onChange={(e) => setAddCity(e.target.value)}
                  value={AddCity}
                />
              </div>
              <div>
                <label htmlFor="InstitutionName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter School State"
                  required
                  onChange={(e) => setAddState(e.target.value)}
                  value={AddState}
                />
              </div>
              <div>
                <label htmlFor="discountpercentage" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Pincode
                </label>
                <input
                  type="number"
                  name="picode"
                  id="picode"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter School Pincode"
                  required
                  onChange={(e) => setAddPincode(e.target.value)}
                  value={AddPincode}
                />
              </div>
              <div>
                <label htmlFor="InstitutionName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  name="contactpersonname"
                  id="contactpersonname"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Contact Person Name"
                  required
                  onChange={(e) => setAddcontactpersonname(e.target.value)}
                  value={Addcontactpersonname}
                />
              </div>
              <div>
                <label htmlFor="InstitutionName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Contact Person Email
                </label>
                <input
                  type="text"
                  name="contactpersonemailId"
                  id="contactpersonemailId"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Contact Person Email"
                  required
                  onChange={(e) => setAddcontactpersonemail(e.target.value)}
                  value={Addcontactpersonemail}
                />
              </div>
              <div>
                <label htmlFor="InstitutionName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Google Map Link
                </label>
                <input
                  type="text"
                  name="googlemaplink"
                  id="googlemaplink"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Google Map Lik"
                  required
                  onChange={(e) => setaddgooglemaplink(e.target.value)}
                  value={Addgoglemaplink}
                />
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
                <h3 className="text-2xl font-medium text-gray-800 mb-4">Edit School Details</h3>
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
                  Institution Id
                </label>
                <input
                  type="text"
                  name="institutionId"
                  id="institutionId"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Institution Id"
                  required=""
                  onChange={(e) => seteditInstitutionId(e.target.value)}
                  value={editInstitutionId}
                />
              </div>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Institution Name
                </label>
                <input
                  type="text"
                  name="institutionName"
                  id="institutionName"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Institution Name"
                  required=""
                  onChange={(e) => seteditInstitutionName(e.target.value)}
                  value={editinstitutionName}
                />
              </div>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Institution Email
                </label>
                <input
                  type="text"
                  name="institutionemailId"
                  id="institutionemailId"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Institution Email"
                  required=""
                  onChange={(e) => seteditInstitutionEmail(e.target.value)}
                  value={editinstitutionEmail}
                />
              </div>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  name="contactpersonname"
                  id="contactpersonname"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Contact Person Name"
                  required=""
                  onChange={(e) => seteditcontactpersonName(e.target.value)}
                  value={editcontactpersonName}
                />
              </div>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Contact Person Email
                </label>
                <input
                  type="text"
                  name="contactpersonemailId"
                  id="contactpersonemailId"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Contact Person Email"
                  required=""
                  onChange={(e) => seteditcontactpersonEmailId(e.target.value)}
                  value={editcontactpersonEmailId}
                />
              </div>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Contact Person Phone Number
                </label>
                <input
                  type="text"
                  name="contactpersonphoneNumber"
                  id="contactpersonphoneNumber"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Contact Person Email"
                  required=""
                  onChange={(e) => seteditcontactpersonPhoneNumber(e.target.value)}
                  value={editcontactpersonPhoneNumber}
                />
              </div>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Address 1
                </label>
                <input
                  type="text"
                  name="address1"
                  id="address1"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Address 1 "
                  required=""
                  onChange={(e) => seteditaddress1(e.target.value)}
                  value={editaddress1}
                />
              </div>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Address 2
                </label>
                <input
                  type="text"
                  name="address2"
                  id="address2"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Address 2"
                  required=""
                  onChange={(e) => seteditaddress2(e.target.value)}
                  value={editaddress2}
                />
              </div>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter City"
                  required=""
                  onChange={(e) => seteditCity(e.target.value)}
                  value={editCity}
                />
              </div>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter State"
                  required=""
                  onChange={(e) => seteditState(e.target.value)}
                  value={editState}
                />
              </div>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Country"
                  required=""
                  onChange={(e) => seteditCountry(e.target.value)}
                  value={editCountry}
                />
              </div>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Google Map Link
                </label>
                <input
                  type="text"
                  name="googlemaplink"
                  id="googlemaplink"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Paste Google Map link"
                  required=""
                  onChange={(e) => seteditGoogleMapLink(e.target.value)}
                  value={editGoogleMapLink}
                />
              </div>

              <div>
                <label htmlFor="header" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Sports Ground
                </label>
                <input
                  type="text"
                  name="sportsgrounds"
                  id="sportsgrounds"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Sports Ground"
                  required=""
                  onChange={(e) => seteditSportsdGroundName(e.target.value)}
                  value={editSportsdGroundName}
                />
              </div>

              <Grid container spacing={2}>
                {/* <div> */}
                <Grid item xs={6}>
                  <InputLabel className="mb-2">From - Weekday (Mon-Fri)</InputLabel>

                  <div class="relative">
                    <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                      <svg
                        class="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="time"
                      id="time"
                      class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      style={{ height: '38px' }}
                      value={editweekdayfromtime}
                      onChange={(e) => {
                        seteditweekdayfromtime(e && e.target.value);
                      }}
                      required
                    />
                  </div>
                </Grid>

                <Grid item xs={6}>
                  <InputLabel className="mb-2">To</InputLabel>

                  <div class="relative">
                    <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                      <svg
                        class="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="time"
                      id="time"
                      class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      style={{ height: '38px' }}
                      value={editweekdaytotime}
                      onChange={(e) => {
                        seteditweekdaytotime(e.target.value);
                      }}
                      required
                    />
                  </div>
                </Grid>
                {/* </div> */}
              </Grid>

              {/* To time */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <InputLabel className="mb-2">From- (Sat-Sun)</InputLabel>

                  <div class="relative">
                    <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                      <svg
                        class="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="time"
                      id="time"
                      class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      style={{ height: '38px' }}
                      value={editweekendfromtime}
                      onChange={(e) => {
                        seteditweekendfromtime(e && e.target.value);
                      }}
                      required
                    />
                  </div>
                </Grid>

                <Grid item xs={6}>
                  <InputLabel className="mb-2">To</InputLabel>

                  <div class="relative">
                    <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                      <svg
                        class="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="time"
                      id="time"
                      class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      style={{ height: '38px' }}
                      value={editweekendtotime}
                      onChange={(e) => {
                        seteditweekendtotime(e && e.target.value);
                      }}
                      required
                    />
                  </div>
                </Grid>
              </Grid>

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

const SchoolsList = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const data = useMemo(() => makeData(200), []);
  const [open, setOpen] = useState(false);
  const [subscription, setsubscription] = useState(null);
  const [subscriptionDeleteId, setsubscriptionDeleteId] = useState('');
  const [add, setAdd] = useState(false);
  const [schoolData, setschoolData] = useState([]);

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
          const response = await axios.get(`${server}/api/admin/allusers`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          // console.log('api users----------->', response.data);

          if (response.data) {
            const filteredData = response.data.data.filter((user) => user.role === 'school' && user.isDeleted === false);
            setschoolData(filteredData);
            // console.log('api dataamsdnasndam---', filteredData);
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
      { Header: 'Institution Id', accessor: 'institutionid' },
      { Header: 'Institution Name', accessor: 'institutionname' },
      { Header: 'Sports', accessor: 'sports' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'City', accessor: 'city' },
      { Header: 'State', accessor: 'state' },
      { Header: 'country', accessor: 'country' },

      { Header: 'Actions', accessor: 'actions' }

      //   { Header: 'Status', accessor: 'status' }
    ],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={schoolData} setschoolData={setschoolData} />
        {/* <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} /> */}
      </ScrollX>
    </MainCard>
  );
};

// Function to handle closing the delete dialog

export default SchoolsList;
