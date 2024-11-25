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
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeMode } from 'config';
// import IconButton from 'components/@extended/IconButton';
import IconButton from '../../../../components/@extended/IconButton';
import SearchBar from '../../components/Searchbar'
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

import { EditLocation } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
// import Pagination from './../components/Pagination/Pagination';
import Pagination from '../../components/Pagination/Pagination';


const server = process.env.REACT_APP_API_URL;
// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent, setgroundData, setUserData, userData }) {
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

  const handleSlotClose = () => {
    setslotopen(false);
    console.log('slot close hua?');
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
      const response = await axios.get(`${server}/api/ground/get/${id}`, {
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
        await axios.delete(`${server}/api/ground/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const updatedgrounds = data.filter((ground) => ground._id !== id);
        setUserData(updatedgrounds);
        console.log('Deleted ground of id -->', id);
        toast.success('Coach Earning deleted Successfully');
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

  //  Edit Plans

  const [editModal, setEditModal] = useState({
    open: false,
    details: null
  });

  // Edit Slot Management

  // -----------View Modal-----------

  const handleDoneClick = async (id) => {
    const url = `${server}/api/booking/cancellation-requests/${id}`;
    const payload = {
      action: 'accept'
    };

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        toast('Request Accepted Successfully');
        const updatedbookings = userData.filter((booking) => booking._id !== id);
        setUserData(updatedbookings);
        console.log('Deleted customer of id -->', id);
      } else {
        console.error('Error:');
        // Handle error - e.g., show an error message
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error - e.g., show an error message
    }
  };

  const handleCrossClick = async (id) => {
    const url = `${server}/api/booking/cancellation-requests/${id}`;
    const payload = {
      action: 'reject'
    };

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        toast.success('Request Rejected Successfully');
        const updatedbookings = userData.filter((booking) => booking._id !== id);
        setUserData(updatedbookings);
      } else {
        console.error('Error:');
        // Handle error - e.g., show an error message
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error - e.g., show an error message
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
              onClick={() => navigate('/apps/create-grounds')}
              data-modal-toggle="add-modal"
            >
              Add New Ground
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
                    {/* {columns.accessor === 'groundName' & */}
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      {/* <Avatar variant="rounded" color="secondary" size="sm" src={`${row?.picture}`} /> */}

                      <Typography className="text-[12px]">{row?.name || 'NA'}</Typography>

                      {/* vhnvnv */}
                    </Stack>
                    {/* } */}
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      <Typography className="text-[12px]">{row?.phone || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      <Typography className="text-[12px]">{row?.totalEarning || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      <Typography className="text-[12px]">{row?.totalBooking || 'NA'}</Typography>
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

      {/* Edit SLot */}

      <Dialog
        open={slotopen}
        TransitionComponent={PopupTransition}
        keepMounted
        onClose={handleSlotClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          '& .MuiDialog-paper': { width: 1560, maxWidth: 1, m: { xs: 1.75, sm: 2.5, md: 4 } },
          backgroundColor: '#ffffff'
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
                  backgroundColor: 'darkred' // Change this to the hover color you want
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
                  backgroundColor: 'darkred' // Change this to the hover color you want
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

// ==============================|| ground - LIST ||============================== //

const CoachEarning = () => {
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
          const response = await axios.get(`${server}/api/booking/coachEarnings`, {
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
      { Header: 'Name', accessor: 'name' },
      { Header: 'Phone', accessor: 'phone' },
      // { Header: 'Rating', accessor: 'rating' },
      { Header: 'Total Earning', accessor: 'totalearning' },
      { Header: 'Total Booking', accessor: 'totalbooking' },
      // { Header: 'Actions', accessor: 'actions' }

      //   { Header: 'Status', accessor: 'status' }
    ],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={userData} setUserData={setUserData} userData={userData} />
        {/* <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} /> */}
      </ScrollX>
    </MainCard>
  );
};

// Function to handle closing the delete dialog

export default CoachEarning;
