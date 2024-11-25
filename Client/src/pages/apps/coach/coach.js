import PropTypes from 'prop-types';
import { useMemo, Fragment, useEffect, useState } from 'react';
import axios from 'axios';

// project-imports
import Avatar from '../../../components/@extended/Avatar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, Tooltip, Button, TextField } from '@mui/material';
import MainCard from '../../../components/MainCard';
import ScrollX from '../../../components/ScrollX';
import { CSVExport } from '../../../components/third-party/ReactTable';
import { renderFilterTypes } from 'utils/react-table';

import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';
import { Trash, Eye, Edit } from 'iconsax-react';
import makeData from 'data/react-table';
import { ThemeMode } from 'config';
// import IconButton from 'components/@extended/IconButton';
import IconButton from '../../../components/@extended/IconButton';
import SearchBar from '../components/Searchbar';
import PaginationComponent from '../components/Pagination';
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import { PatternFormat } from 'react-number-format';
// import { PopupTransition } from 'components/@extended/Transitions';
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
import SwitchButton from '../../../components/SwitchButton';

import { useNavigate } from 'react-router';
import Pagination from '../components/Pagination/Pagination';

const server = process.env.REACT_APP_API_URL;
// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent, handleAdd, setUserData }) {
  const [currentPage, setCurrentPage] = useState(1);

  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const theme = useTheme();
  const mode = theme.palette.mode;
  const filterTypes = useMemo(() => renderFilterTypes, []);

  const [sortBy, setSortBy] = useState('');
  const [filterText, setFilterText] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [DialogPasswordUserId, setDialogPasswordUserId] = useState('');
  const handleClose = () => setOpen(false);

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

  const [viewModal, setViewModal] = useState({
    open: false,
    details: null,
    completeDetails: null
  });

  const navigate = useNavigate();

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
  const filteredData = useMemo(() => {
    if (!filterText) return data; // Using rowData as initial data
    return data.filter((row) => {
      return Object.values(row).some((value) => {
        if (value === null || value === undefined) return false; // Handle null or undefined values
        return value.toString().toLowerCase().includes(filterText.toLowerCase());
      });
    });
  }, [data, filterText]);

  //Pagination

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

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
        await axios.delete(`${server}/api/admin/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            password: password
          }
        });

        const updatedCustomers = data.filter((customer) => customer._id !== id);

        setUserData(updatedCustomers);
        toast.success('Coach deleted Successfully');
        if (page > Math.ceil(updatedCustomers.length / rowsPerPage) - 1) {
          setPage(0);
        }
        // }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    setDeleteConfirmation({ open: false, id: null });
  };

  function splitStringIntoArr(data) {
    const temp1 = data[0] ? data[0] : ''; //get data from the 0 index

    const temp2 = temp1.split(','); //split it based on comma and return it

    return temp2;
  }

  function handleNavigate(Id) {
    navigate(`/apps/edit-coach/${Id}`);
  }

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
              onClick={() => navigate('/apps/create-coach')}
              data-modal-toggle="add-modal"
            >
              Add New Coach
            </Button>
          </Stack>

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
            {paginatedData
              .filter((row) => row.role === 'coach')
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
                  {/* <TableCell style={{ width: '10%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography>{row?.phoneNumber || 'NA'}</Typography>
                    </Stack>
                  </TableCell> */}
                  <TableCell className="text-center" style={{ width: '10%' }}>
                    {/* {columns.accessor === 'customerName' & */}
                    <Stack direction="row" alignItems="center" justifyContent='center' className="flex flex-col ">
                      {/* <Avatar variant="rounded" color="secondary" size="sm" src={`${row?.picture}`} /> */}

                      <Typography className="text-center text-[12px]">{row?.firstname + ' ' + row?.lastname || 'NA'}</Typography>
                      <Typography className="text-center text-[12px]">{row?.email || 'NA'}</Typography>

                      {/* vhnvnv */}
                    </Stack>
                    {/* } */}
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '10%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      <Typography className="text-center text-[12px]">{row?.phoneNumber || 'NA'}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '15%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      {row?.sportsgrounds?.map((r) => (
                        <Typography className="border-[2px] border-[#5f6368]/10 text-[12px]  bg-gray-50 items-center text-gray-600 rounded-full px-2 py-[2px] ">
                         
                          {r}
                        </Typography>
                      )) || 'NA'}
                    </Stack>
                  </TableCell>

                  <TableCell className="text-center" style={{ width: '5%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography>
                        <SwitchButton id={row._id} />
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell className='text-center' style={{ width: '15%' }}>
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
                        <IconButton color="success" onClick={() => navigate(`/apps/view-coach/${row._id}`)}>
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
                      ></Dialog>

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

            {/* <=====--------------- */}
          </TableBody>
        </Table>
      </Stack>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={filteredData.length}
        pageSize={rowsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
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

const CoachList = () => {
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
          const response = await axios.get(`${server}/api/admin/allcoach`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            const filteredData = response?.data?.formattedCoaches?.filter((user) => user.role === 'coach' && user.isDeleted === false);

            setUserData(filteredData);
            console.log('api data---', filteredData);
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

      // { Header: 'Phone Number', accessor: 'phoneNumber' },
      { Header: 'Coach Name', accessor: 'coachName' },
      { Header: 'Contact', accessor: 'contact' },
      //   { Header: 'Phone', accessor: 'phone' },
      // { Header: 'Email', accessor: 'email' },
      { Header: 'Sports', accessor: 'sports' },

      //   { Header: 'Social Media', accessor: 'socialMedia' },
      // { Header: 'IsVerified', accessor: 'isVerified' },
      //   { Header: 'Social Media', accessor: 'socialMedia' },
      { Header: 'Status', accessor: 'status' },
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

export default CoachList;
