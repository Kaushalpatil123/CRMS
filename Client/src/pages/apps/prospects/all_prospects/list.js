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
  FormHelperText,
  Chip
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
  ListItemText
} from '@mui/material';

import SimpleBar from '../../../../components/third-party/SimpleBar';
// import { Download, EditLocation } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import SwitchButton from '../../../../components/SwitchButton';
import Pagination from '../../components/Pagination/Pagination';


const server = process.env.REACT_APP_API_URL;
// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent, setgroundData, setUserData }) {
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

  const [AddGroundName, setaddGroundName] = useState();
  const [AddLocation, setaddLocation] = useState();
  const [AddPrice, setAddPrice] = useState();
  const [AddImage, setAddImage] = useState();
  //   const [AddRole, setAddRole] = useState('ground');
  const [AddFacility, setAddFacility] = useState();

  const [EditschoolgroundName, setEditschoolgroundName] = useState();

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
  // const [EditschoolgroundName, setEditschoolgroundName] = useState('');
  const [EditschoolgroundNameError, setEditschoolgroundNameError] = useState(false);

  const [slotopen, setslotopen] = useState(false);

  const [timetableData, setTimetableData] = useState([]);
  const [institutionIdError, setinstitutionIdError] = useState(false);
  const [schoolid, setschoolid] = useState('');
  const [schoolData, setschoolData] = useState('');
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [DialogPasswordUserId, setDialogPasswordUserId] = useState('');

  const [selected, setSelected] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [prospects, setProspects] = useState([]);

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
    // setPassword('');
    // setErrorMessage('');
  };

  // Autochange password matching

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

  // School Ground Name

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
            // console.log('api school  names---', response.data.data);
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
      // console.log('This response data particualr school details-->', responseData);
      //  setschoolid(responseData?.school);
      setschoolData(responseData);
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

    const [importModal, setimportModal] = useState({
      open: false,
      details: null
    });
    
  const handleSearchChange = (event) => {
    setFilterText(event.target.value);
  };
  const CSVExport = (data, filename) => {
    if (!data.length) {
      console.error('No data available for export.');
      return;
    }

    // Extract headers
    const headers = Object.keys(data[0]).join(',');
    // Convert data rows to CSV string
    const csvContent = data.map((item) => Object.values(item).join(',')).join('\n');
    // Combine headers and rows
    const csvData = `${headers}\n${csvContent}`;

    // Create a Blob from the CSV content
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);

    // Append the link to the document and trigger the click
    document.body.appendChild(link);
    link.click();
    // Remove the link element from the document
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    const dataToExport = selectedValue.length > 0 ? selectedValue : prospects;
    CSVExport(dataToExport, 'prospects.csv');
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation({ open: true, id });
  };
  const handleImportModal = (importdetails) => {
    setimportModal({
      open: true,
      importdetails: { ...importdetails }
    });
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
        await axios.delete(`${server}/api/ground/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const updatedgrounds = data.filter((ground) => ground._id !== id);
        setUserData(updatedgrounds);
        // console.log('Deleted ground of id -->', id);
        toast.success('Record deleted Successfully');
        if (page > Math.ceil(updatedgrounds.length / rowsPerPage) - 1) {
          setPage(0);
        }
        // }
      } catch (error) {
        console.error('Error deleting ground:', error);
        toast.error('Error Deleting Record');
      }
    }
    setDeleteConfirmation({ open: false, id: null });
  };

  // add new ground

  const handleSaveNewground = async () => {
    try {
      // ---- IT's Working ------
      const requestData = {
        name: AddGroundName,
        location: AddLocation,
        price: AddPrice,
        image: AddImage,
        facility: AddFacility
      };

      const token = localStorage.getItem('token');

      const response = await axios.post(`${server}/api/ground/create`, requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });

      // Handle the response as needed
      // console.log('Create API response:', response.data);

      if (response.status === 201) {
        // Close the add new modal after successful creation
        // setAddNewModal({ open: false });
        // setaddgroundName('');
        setaddGroundName('');
        setAddPrice('');
        setAddImage('');
        // setAddRole('');
        setAddFacility('');
        // setAddPassword('');

        try {
          const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/ground/getall`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setUserData(updatedData.data.data);
          // console.log('record save successfully--->', updatedData);
          toast('New ground Added Successfully');
        } catch (error) {
          console.log('Error duing Updated DAta fetching', error);
        }
      } else {
        toast.error('Error Creating ground');
      }
    } catch (error) {
      console.error('Error creating ground:', error);

      toast.error('Error creating ground');
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

  const handleCheckboxChange = (value, isChecked) => {
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

  const PasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const [editModal, setEditModal] = useState({
    open: false,
    details: null
  });

  // Edit Slot Management

  // -----------View Modal------------

  const AddSlot = (dayOfWeek, startTime, endTime, totalSlots) => {
    // console.log('startedn-------->', startTime, endTime, dayOfWeek, totalSlots);

    const existingIndex = timetableData.findIndex(
      (item) => item.dayOfWeek === dayOfWeek && item.startTime === startTime && item.endTime === endTime
    );
    if (existingIndex !== -1) {
      // If an entry for this day and time already exists, update its value
      const newTimetableData = [...timetableData];
      // console.log('newtimetabledata---->', newTimetableData);
      newTimetableData[existingIndex].totalSlots = totalSlots;
      setTimetableData(newTimetableData);
    } else {
      // If an entry for this day and time doesn't exist, create a new one
      setTimetableData((prevData) => [...prevData, { dayOfWeek, startTime, endTime, totalSlots }]);
    }

    // console.log('Timetable data--->', timetableData);
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
        name: EditschoolgroundName,
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
      const response = await axios.put(`${server}/api/ground/update/${editModal.details._id}`, requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });

      // Handle the response as needed

      if (response.status === 200) {
        // Close the edit modal after successful update
        setEditModal({ open: false, details: null });
        // setaddGroundName();
        setEditschoolgroundName();
        setEditprice();
        setEditrating();
        setEditInstitutionId();
        seteditPincode();

        // Fetch the updated data from the server and update the rowData state
        try {
          const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/ground/getall`, {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${token}`
            }
          });
          setUserData(updatedData.data.data);
          // console.log('Updated rowData:', updatedData);
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
    <MainCard
      content={false}
      title="Prospects"
      secondary={
        <>
          <div>
            <div className="flex justify-between items-center mb-4 px-4 gap-4">
              {console.log('filtertext--->', filterText)}

              <SearchBar
                filterText={filterText}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
                handleSearchChange={handleSearchChange}
              />

              <Button
                variant="outlined"
                className="hover:bg-orange-400 hover:text-white font-semibold"
                // onClick={handleExportCSV}
                sx={{
                  borderColor: 'orange',
                  color: 'orange',
                  '&:hover': {
                    borderColor: 'darkorange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)'
                  }
                }}
              >
                Export
                <ArrowUpward />
              </Button>
              <Button
                variant="outlined"
                // onClick={handleImportCSV}
                className="hover:bg-orange-400 hover:text-white font-semibold"
                sx={{
                  borderColor: 'orange',
                  color: 'orange',
                  '&:hover': {
                    borderColor: 'darkorange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)'
                  }
                }}
                // onClick={() => handleImportModal()} //
              >
                Import
                <Download className="ml-2 h-4 w-4" />
              </Button>
              <Button
                // onClick={handleAddLead}
                // onClick={handleAddNew}
                onClick={() => navigate(`/apps/create-prospects`)}
                className="bg-orange-400 text-white font-semibold hover:bg-orange-300 hover:text-white"
              >
                Add New Prospects
              </Button>
            </div>
          </div>
        </>
      }
    ></MainCard>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 0 }}>

          <Stack direction="row" alignItems="center" spacing={2}>
          </Stack>
        </Stack>
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.Header}
                  className="bg-[#fb8c00] text-white text-center"
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
                  <TableCell className="text-center" style={{ width: '15%' }}>
                    {/* {columns.accessor === 'groundName' & */}
                    <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
                      {/* <Avatar variant="rounded" color="secondary" size="sm" src={`${row?.picture}`} /> */}

                      <Typography className="text-[12px]">{row?.institutionName || 'NA'}</Typography>

                      {/* vhnvnv */}
                    </Stack>
                    {/* } */}
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '15%' }}>
                    <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
                      <Typography className="text-[12px]">{row?.school?.city || 'NA'}</Typography>
                      {console.log('city k dekhna jra--->', row)}
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '15%' }}>
                    <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
                      <Typography className="text-[12px]">{row?.rating || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '15%' }}>
                    <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
                      <Typography className="text-[12px]">{row?.price || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
                      <Typography className="flex justify-center text-center w-full gap-2  ">
                        {row?.sport_name?.map((r) => (
                          <span className="border-[2px] border-[#5f6368]/10 text-[14px] bg-gray-50 text-gray-600 rounded-full px-2 py-[2px]">
                            {r}
                          </span>
                        )) || 'NA'}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '15%' }}>
                    <Stack direction="row" justifyContent="center" spacing={1.5} alignItems="center">
                      <Typography>
                        <SwitchButton id={row._id} />
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell style={{ width: '25%' }} className="">
                    <Stack direction="row" justifyContent="center" spacing={0}>
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
                        <IconButton color="success" onClick={() => navigate(`/apps/view-ground/${row._id}`)}>
                          <Eye />
                        </IconButton>
                      </Tooltip>

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
                          // onClick={(e) => {
                          //   e.stopPropagation();
                          //   handleClose();
                          //   handleEdit(row);
                          // }}
                          onClick={() => navigate(`/apps/edit-ground/${row._id}`)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>

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
                handleSaveNewground();

                e.preventDefault();
              }}
            >
              <h3 className="text-2xl font-medium text-gray-800 mb-4">Enter New ground Details</h3>

              {/* <div>
                <label htmlFor="GroundName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Ground Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Ground Name"
                  required
                  onChange={(e) => setaddGroundName(e.target.value)}
                  value={AddGroundName}
                />
              </div> */}

              <Select
                autocomplete="off"
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                name="sportsgrounds"
                value={EditschoolgroundName}
                fullWidth
                onChange={(e) => {
                  setEditschoolgroundName(e.target.value);
                  setEditschoolgroundNameError(false); // Reset error when user types
                }}
                required
                error={EditschoolgroundNameError}
                helperText={EditschoolgroundNameError && 'Weekday is required'}
                variant="outlined"
                size="small"
                sx={{ width: '100%' }}
              >
                {schoolNames?.map((name) => (
                  <MenuItem value={name.institutionName}>{name.institutionName}</MenuItem>
                ))}
              </Select>

              <div>
                <label htmlFor="GroundName" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Ground Name"
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
                <h3 className="text-2xl font-medium text-gray-800 mb-4">Edit Ground Details</h3>
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
                  Ground Name
                </label>
                <input
                  type="text"
                  name="GroundName"
                  id="GroundName"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Ground Name"
                  required=""
                  onChange={(e) => setEditschoolgroundName(e.target.value)}
                  value={EditschoolgroundName}
                />
              </div> */}
              <Select
                autocomplete="off"
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                name="sportsgrounds"
                value={EditschoolgroundName}
                fullWidth
                onChange={(e) => {
                  setEditschoolgroundName(e.target.value);
                  setEditschoolgroundNameError(false); // Reset error when user types
                }}
                // required
                error={EditschoolgroundNameError}
                helperText={EditschoolgroundNameError && 'Weekday is required'}
                variant="outlined"
                size="small"
                // value={EditschoolgroundName}
                sx={{ width: '100%' }}
              >
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
                  placeholder="Enter Ground Name"
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
                    {/* {console.log('selected aminities--->', selectedAmenities)} */}
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
                    {/* {console.log('selected aminities--->', selectedAmenities)} */}
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
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  renderRowSubComponent: PropTypes.any,
  handleAdd: PropTypes.func
};

// ==============================|| ground - LIST ||============================== //

const ProspectslListPage = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const data = useMemo(() => makeData(200), []);
  const [open, setOpen] = useState(false);
  const [ground, setground] = useState(null);
  const [groundDeleteId, setgroundDeleteId] = useState('');
  const [add, setAdd] = useState(false);
  const [userData, setUserData] = useState([]);

  const handleAdd = () => {
    setAdd(!add);
    if (ground && !add) setground(null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate("/");
      } else {
        try {
          const response = await axios.get(`${server}/api/ground/getall`, {
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
      // { Header: 'ID', accessor: 'id', width: 100  },
      { Header: 'New', accessor: 'new' },
      { Header: 'Discussion', accessor: 'discussion' },
      { Header: 'Sample Given', accessor: 'sample-given' },
      { Header: 'Estimate Shared', accessor: 'estimate-shared' },
      { Header: 'Done', accessor: 'done' }

      // { Header: 'Recommended', accessor: 'recommended' },
      // { Header: 'Actions', accessor: 'actions' }

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

export default ProspectslListPage;
