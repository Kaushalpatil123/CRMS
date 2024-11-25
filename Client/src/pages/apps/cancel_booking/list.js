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
import MainCard from '../../../components/MainCard';
import ScrollX from '../../../components/ScrollX';
import { renderFilterTypes } from 'utils/react-table';
import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';
import { Trash, Eye, Edit, AddCircle } from 'iconsax-react';
import makeData from 'data/react-table';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
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
import { EditLocation } from '@mui/icons-material';
import dayjs from 'dayjs';
import Pagination from '../components/Pagination/Pagination';

import { useNavigate } from 'react-router';
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

  const [schoolNames, setschoolNames] = useState([]);
  const [openPasswordAcceptDialog, setopenPasswordAcceptDialog] = useState(false);
  const [openPasswordRejectDialog, setopenPasswordRejectDialog] = useState(false);
  const [DialogPasswordAcceptUserId, setDialogPasswordAcceptUserId] = useState('');
  const [DialogPasswordRejectUserId, setDialogPasswordRejectUserId] = useState('');

  const [slotopen, setslotopen] = useState(false);
  const [password, setPassword] = useState();

  const [schoolid, setschoolid] = useState('');
  const [schoolData, setschoolData] = useState('');

  const handlePasswordDialogAcceptOpen = (id) => {
    // console.log('id aari h passworddialog m-->', id);
    setDialogPasswordAcceptUserId(id);
    setopenPasswordAcceptDialog(true);
    if (localStorage.getItem('role') === 'superadmin') {
      handleacceptConfirmation(id);
    }
  };

  const handlePasswordDialogRejectOpen = (id) => {
    setDialogPasswordRejectUserId(id);
    setopenPasswordRejectDialog(true);
    if (localStorage.getItem('role') === 'superadmin') {
      handlerejectConfirmation(id);
    }
  };
  const handlePasswordDialogAcceptClose = () => {
    setopenPasswordAcceptDialog(false);
  };

  const handlePasswordDialogRejectClose = () => {
    setopenPasswordRejectDialog(false);
  };

  const handlePasswordAcceptSubmit = (e) => {
    e.preventDefault();
    console.log('submit m aaye ho?');

    const role = localStorage.getItem('role');

    console.log('role btao', role);
    if (role === 'admin') {
      if (password) {
        handlePasswordDialogAcceptClose();
        handleacceptConfirmation(DialogPasswordAcceptUserId);
      } else {
        toast.error('Incorrect Password, Try again');
      }
    }
  };

  const handlePasswordRejectSubmit = (e) => {
    e.preventDefault();
    console.log('submit m aaye ho?');

    const role = localStorage.getItem('role');

    console.log('role btao', role);
    if (role === 'admin') {
      if (password) {
        handlePasswordDialogRejectClose();
        handleCrossClick(DialogPasswordRejectUserId);
      } else {
        toast.error('Incorrect Password, Try again');
      }
    }
  };

  const PasswordChange = (e) => {
    setPassword(e.target.value);
  };

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

  const [acceptconfirmation, setacceptconfirmation] = useState({
    open: false,
    id: null
  });

  const [rejectconfirmation, setrejectconfirmation] = useState({
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

  const handleacceptConfirmation = (id) => {
    setacceptconfirmation({ open: true, id });
  };

  const handlerejectConfirmation = (id) => {
    setrejectconfirmation({ open: true, id });
  };

  //  Edit Plans

  const [editModal, setEditModal] = useState({
    open: false,
    details: null
  });

  // Edit Slot Management

  // -----------View Modal-----------

  const handleDoneClick = async (id) => {
    // const { id } = acceptconfirmation; // Assuming this 'id' is different from 'bookingId'
    const url = `${server}/api/booking/cancellation-requests/${DialogPasswordAcceptUserId}`;

    const token = localStorage.getItem('token');
    const payload = {
      action: 'accept'
    };

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          password: password
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        toast('Request Accepted Successfully');
        const updatedbookings = userData.filter((booking) => booking._id !== DialogPasswordAcceptUserId);
        setUserData(updatedbookings);
        console.log('accepted customer of id -->', id);
        setDialogPasswordAcceptUserId('');
      } else {
        console.error('Error:');
        toast.error('Error, Request Not Accepted');
        // Handle error - e.g., show an error message
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
      // Handle error - e.g., show an error message
    }
    setacceptconfirmation({ open: false, id: null });
  };

  const handleCrossClick = async (id) => {
    const token = localStorage.getItem('token');
    const url = `${server}/api/booking/cancellation-requests/${DialogPasswordRejectUserId}`;
    const payload = {
      action: 'reject'
    };

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          password: password
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        toast.success('Request Rejected Successfully');
        const updatedbookings = userData.filter((booking) => booking._id !== DialogPasswordRejectUserId);
        setUserData(updatedbookings);
        setDialogPasswordAcceptUserId('');
      } else {
        console.error('Error:');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error - e.g., show an error message
    }
    setrejectconfirmation({ open: false, id: null });
  };

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 0 }}>
          <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} />
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
                      <Avatar variant="rounded" color="secondary" size="sm" src={`${row?.picture}`} />

                      <Typography className="text-[12px]">{row?.groundId?.institutionName || 'NA'}</Typography>

                      {/* vhnvnv */}
                    </Stack>
                    {/* } */}
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      <Typography className="text-[12px]">{row?.userId?.userName || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '25%' }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" className="flex flex-row flex-wrap gap-1 ">
                      {row?.groundId?.sport_name?.map((r) => (
                        <Typography className="text-center border-[2px] border-[#5f6368]/10 text-[12px] bg-gray-50 text-gray-600 rounded-full px-2 py-[2px] ">
                          {r}
                        </Typography>
                      )) || 'NA'}
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      <Typography className="text-[12px]">{row?.totalPrice || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      <Typography className="text-[12px]">{row?.status || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '25%' }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                      {/* Tick */}
                      {row.status !== 'Confirmed' && row.status !== 'Cancelled' && (
                        <Tooltip
                          componentsProps={{
                            tooltip: {
                              sx: {
                                backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                                opacity: 0.9
                              }
                            }
                          }}
                          title="Accept"
                        >
                          {/* <IconButton color="success" onClick={() => handleDoneClick(row._id)}> */}
                          <IconButton color="success" onClick={() => handlePasswordDialogAcceptOpen(row._id)}>
                            <DoneIcon />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Cross */}
                      {row.status !== 'Confirmed' && row.status !== 'Cancelled' && (
                        <Tooltip
                          componentsProps={{
                            tooltip: {
                              sx: {
                                backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                                opacity: 0.9
                              }
                            }
                          }}
                          title="Reject"
                        >
                          {/* <IconButton color="error" onClick={() => handleCrossClick(row._id)}> */}
                          <IconButton color="success" onClick={() => handlePasswordDialogRejectOpen(row._id)}>
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      )}

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
                        <IconButton color="success" onClick={() => navigate(`/apps/cancel-booking-details/${row._id}`)}>
                          <Eye />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>

                  <TableCell className="" style={{ width: '33%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
                        onClick={() => window.open(row?.invoiceUrl, '_blank')}
                      >
                        View
                      </Button>
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

      {/* Accept confirmation  */}

      <Dialog open={openPasswordAcceptDialog && localStorage.getItem('role') == 'admin'} onClose={handlePasswordDialogAcceptClose}>
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
          <form
            id="form"
            className="space-y-6"
            onSubmit={(e) => {
              handlePasswordAcceptSubmit(e);
            }}
          >
            <TextField label="Password" type="password" fullWidth value={password} onChange={PasswordChange} />
            <DialogActions>
              <Button onClick={handlePasswordDialogAcceptClose}>Cancel</Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openPasswordRejectDialog && localStorage.getItem('role') == 'admin'} onClose={handlePasswordDialogRejectClose}>
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
          <form
            id="form"
            className="space-y-6"
            onSubmit={(e) => {
              handlePasswordRejectSubmit(e);
            }}
          >
            <TextField label="Password" type="password" fullWidth value={password} onChange={PasswordChange} />
            <DialogActions>
              <Button onClick={handlePasswordDialogRejectClose}>Cancel</Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {acceptconfirmation.open && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md">
            <p className="mb-4">Are you sure you want to accept this request?</p>
            <div className="flex justify-end">
              <button className="bg-red-500 text-white px-4 py-2 rounded-md mr-4" onClick={handleDoneClick}>
                Confirm
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                onClick={() => setacceptconfirmation({ open: false, id: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectconfirmation.open && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md">
            <p className="mb-4">Are you sure you want to reject this request?</p>
            <div className="flex justify-end">
              <button className="bg-red-500 text-white px-4 py-2 rounded-md mr-4" onClick={handleCrossClick}>
                Confirm
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                onClick={() => setrejectconfirmation({ open: false, id: null })}
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

const CancelBooking = () => {
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
          const response = await axios.get(`${server}/api/booking/cancellation-requests`, {
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
      { Header: 'Institution Name', accessor: 'institutionName' },
      { Header: 'Username', accessor: 'userName' },
       { Header: 'Sports', accessor: 'sports' },
      // { Header: 'Rating', accessor: 'rating' },
      { Header: 'Price', accessor: 'price' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Actions', accessor: 'actions' },
      { Header: 'Invoice', accessor: 'invoice' },


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

export default CancelBooking;
