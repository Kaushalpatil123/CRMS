import PropTypes from 'prop-types';
import { useMemo, Fragment, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Avatar from '../../components/@extended/Avatar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, Tooltip, Button } from '@mui/material';
import MainCard from '../../components/MainCard';
import ScrollX from '../../components/ScrollX';
import { renderFilterTypes } from 'utils/react-table';
import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';
import { Trash, Eye, Edit } from 'iconsax-react';
import makeData from 'data/react-table';
import { ThemeMode } from 'config';
// import IconButton from 'components/@extended/IconButton';
import IconButton from '../../components/@extended/IconButton';
import SearchBar from './components/Searchbar';
import PaginationComponent from './components/Pagination';
import Box from '@mui/material/Box';
import { PopupTransition } from '../../components/@extended/Transitions';
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

import SimpleBar from '../../components/third-party/SimpleBar';
import Switch from 'themes/overrides/Switch';
import Pagination from './components/Pagination/Pagination';

const server = process.env.REACT_APP_API_URL;
// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, rowData, renderRowSubComponent, setplanData, fetchUsers, setRowData }) {
  const [currentPage, setCurrentPage] = useState(1);

  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const theme = useTheme();
  const mode = theme.palette.mode;
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  

  const [filterText, setFilterText] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [decodedPass, setdecodedPass] = useState('');
  const [showpass, setshowpass] = useState(false);
  const [totalPage, settotalPage] = useState(0);
  const [addplanName, setaddplanName] = useState();
  const [AddPlanType, setaddPlantype] = useState();
  const [AddPrice, setAddPrice] = useState();
  //   const [AddRole, setAddRole] = useState('plan');
  const [AddActualPrice, setAddActualPrice] = useState();

  const [EditPlanType, setEditPlanType] = useState();
  const [Editprice, setEditprice] = useState();
  const [EditactualPrice, setEditactualPrice] = useState();
  const [isOn, setIsOn] = useState(false);
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
      const response = await axios.get(`${server}/api/plan/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Assuming your raw body response is plain text
      const responseDataCart = response.data;
      const responseData = response.data.data;
      console.log('This is view response data', responseData);

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
        await axios.delete(`${server}/api/subscription/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('api url', `${server}/api/user/${id}`);
        console.log('userdata--->', rowData);
        const updatedsubscriptions = rowData.filter((subscription) => subscription._id !== id);
        setRowData(updatedsubscriptions);
        console.log('Deleted subscription of id -->', id);
        toast('Record deleted Successfully');
        if (page > Math.ceil(updatedsubscriptions.length / rowsPerPage) - 1) {
          setPage(0);
        }
        // }
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    }
    setDeleteConfirmation({ open: false, id: null });
  };

  // add new plan


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

  const handleEdit = (details) => {
    setEditModal({
      open: true,
      details: { ...details }
    });
    console.log('edit details--->', details);

    // Set the initial values for editing
    setEditPlanType(details.planType);
    setEditactualPrice(details.actualPrice);
    setEditprice(details.price);

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
        planType: EditPlanType,
        actualPrice: EditactualPrice,
        newPrice: Editprice
      };

      const token = localStorage.getItem('token');
      const response = await axios.put(`${server}/api/subscription/update/${editModal.details._id}`, requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });

      // Handle the response as needed

      if (response.status === 200) {
        // Close the edit modal after successful update
        setEditModal({ open: false, details: null });
        setaddPlantype();
        setAddPrice();
        setAddActualPrice();

        // Fetch the updated data from the server and update the rowData state
        try {
          const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/subscription/getPlan`, {
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${token}`
            }
          });
          setRowData(updatedData.data.data);
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

  // const handleChange = (id) => (event) => {
  //   toggleSwitch(id);
  //   const updatedStatuses = paginatedData?.map((row) => (row?._id === id ? { ...row, status: event.target.checked } : row));
  //   setUserData(updatedStatuses);
  // };

  const toggleSwitch = useCallback(
    async (id, currentStatus, event) => {
      event.stopPropagation();
      event.preventDefault();

      let tempStatus = currentStatus === 'open' ? 'closed' : 'open';

      const token = localStorage.getItem('token');
      // setIsOn((prevIsOn) => !prevIsOn);
      try {
        const response = await axios.put(
          `${server}/api/complaintQuery/${id}`,
          { status: tempStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.data) {
          tempStatus = '';
          toast.success('Status Updated Successfully');
          fetchUsers();
        }
        console.log('updated status', response);
      } catch (error) {
        console.log(error);
      }
    },
    [fetchUsers, server]
  );
  const renderSortIcon = (column) => {
    if (sortBy === column) {
      return (
        <Box component="span" sx={{ fontSize: 16 }}>
          {sortDirection === 'asc' ? '↑' : '↓'}
        </Box>
      );
    }
    return null;
  };

  const filteredData = useMemo(() => {
    // console.log("this is rowData", rowData);
    if (!filterText) return rowData; // Using rowData as initial data
    return rowData?.filter((row) => Object.values(row)?.some((value) => value.toString().toLowerCase().includes(filterText.toLowerCase())));
  }, [rowData, filterText]);

  const handleSort = (column) => {
    const direction = sortBy === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortDirection(direction);

    const sortedData = [...rowData].sort((a, b) => {
      if (direction === 'asc') {
        return a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
      } else {
        return a[column] > b[column] ? -1 : a[column] < b[column] ? 1 : 0;
      }
    });

    setRowData(sortedData);
  };

  const paginatedData = useMemo(() => {
    // console.log("this is filteredData in useMemo",filteredData )
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return filteredData?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredData]);

  
  return (
    <>
      <Stack spacing={3} className="py-4">
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 0 }}>
          <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} />

          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Button
              variant="contained"
              className="bg-blue-500 text-white hover:bg-blue-600 w-[120px] h-[50px]"
              // startIcon={<Add />}
              onClick={handleAddNew}
              data-modal-toggle="add-modal"
            >
              Add Subscription
            </Button> */}
          </Stack>
        </Stack>
        <Table>
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
                <TableCell className="text-center" style={{ width: '15%' }}>
                  {/* {columns.accessor === 'subscriptionName' & */}
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    {/* <Avatar variant="rounded" color="secondary" size="sm" src={`${row?.picture}`} /> */}

                    <Typography className='text-[12px]'>{row?._id || 'NA'}</Typography>
                  </Stack>
                  {/* } */}
                </TableCell>
                <TableCell className='text-center' style={{ width: '15%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    <Typography className='text-[12px]'> {new Date(row?.createdAt).toLocaleString() || 'NA'}</Typography>
                  </Stack>
                </TableCell>
                <TableCell className='text-center' style={{ width: '10%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    <Typography className='text-[12px]'> {row?.userId?.userName || 'NA'}</Typography>
                  </Stack>
                </TableCell>
                <TableCell className='text-center' style={{ width: '10%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    <Typography className='text-[12px]'> {row?.type || 'NA'}</Typography>
                  </Stack>
                </TableCell>
                <TableCell className='text-center' style={{ width: '25%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    <Typography className='text-[12px]'>{row?.content || 'NA'}</Typography>
                  </Stack>
                </TableCell>
                <TableCell className='text-center' style={{ width: '10%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    <Typography>
                      {' '}
                      <div className="flex items-center cursor-pointer">
                        <label
                          htmlFor={`AcceptConditions-${row?._id}`}
                          className={`relative inline-block h-6 w-12 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] ${
                            row?.status === 'open' ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            id={`AcceptConditions-${row?._id}`}
                            onClick={(event) => toggleSwitch(row?._id, row?.status, event)}
                            className="peer sr-only"
                          />

                          <span
                            className={`absolute inset-y-0 start-0 m-1 size-4 rounded-full bg-white ${
                              row?.status === 'open' ? 'transition-all start-6' : 'transition-all start-0'
                            } `}
                          ></span>
                        </label>
                      </div>
                      <span className="ml-2  text-sm font-semibold">{row?.status}</span>
                    </Typography>
                  </Stack>
                </TableCell>
                {/* <TableCell style={{ width: '15%' }}>
                  <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
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
                          handleDeleteConfirmation(row._id);
                        }}
                      >
                        <Trash />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell> */}
              </TableRow>
            ))}

            {/* Pagination */}

            {/* <=====--------------- */}
          </TableBody>
        </Table>
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={filteredData.length}
          pageSize={rowsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />

        {/* <PaginationComponent page={page} setPage={setPage} filteredData={filteredData} rowsPerPage={rowsPerPage} /> */}
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

const Complaints = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const data = useMemo(() => makeData(200), []);
  const [open, setOpen] = useState(false);
  const [subscription, setsubscription] = useState(null);
  const [subscriptionDeleteId, setsubscriptionDeleteId] = useState('');
  const [add, setAdd] = useState(false);
  const [rowData, setRowData] = useState([]);

  const handleAdd = () => {
    setAdd(!add);
    if (subscription && !add) setsubscription(null);
  };
 const fetchUsers = async () => {
   const token = localStorage.getItem('token');
   if (!token) {
     // navigate("/");
   } else {
     try {
       const response = await axios.get(`${server}/api/complaintQuery`, {
         headers: {
           Authorization: `Bearer ${token}`
         }
       });
       console.log('respone me kya h', response);
       if (response.data) {
        // const reverseData = response?.data?.data?.reverse();
         setRowData(response?.data?.data);
         console.log('reverse---', response?.data?.data);
       } else {
         console.error('Empty response data or unexpected format');
       }
     } catch (error) {
       console.error('Error fetching users:', error);
     }
   }
 };
  useEffect(() => {
   
    fetchUsers();
  }, []);

  const columns = useMemo(
    () => [
      // { Header: 'ID', accessor: 'id', width: 100  },
      { Header: ' ID', accessor: '_id' },
      { Header: 'Date', accessor: 'createdAt' },
      { Header: 'User Name', accessor: 'userName' },
      { Header: 'Type', accessor: 'type' },

      { Header: 'Description', accessor: 'content' },
    //   { Header: 'Amount', accessor: 'amount' },
    //   { Header: 'Purchase Date', accessor: 'purchaseDate' },
      { Header: 'Status', accessor: 'status' },
        // { Header: 'Actions', accessor: 'actions' }
    ],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} rowData={rowData} fetchUsers={fetchUsers} setRowData={setRowData} />
        {/* <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} /> */}
      </ScrollX>
    </MainCard>
  );
};

// Function to handle closing the delete dialog

export default Complaints;
