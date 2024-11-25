import PropTypes from 'prop-types';
import { useMemo, Fragment, useEffect, useState } from 'react';
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

const server = process.env.REACT_APP_API_URL;
// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent, setplanData, setUserData }) {
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const theme = useTheme();
  const mode = theme.palette.mode;
  const filterTypes = useMemo(() => renderFilterTypes, []);

  const [sortBy, setSortBy] = useState('');
  const [filterText, setFilterText] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [decodedPass, setdecodedPass] = useState('');
  const [showpass, setshowpass] = useState(false);

  const [addplanName, setaddplanName] = useState();
  const [AddPlanType, setaddPlantype] = useState();
  const [AddPrice, setAddPrice] = useState();
  //   const [AddRole, setAddRole] = useState('plan');
  const [AddActualPrice, setAddActualPrice] = useState();

  const [EditPlanType, setEditPlanType] = useState();
  const [Editprice, setEditprice] = useState();
  const [EditactualPrice, setEditactualPrice] = useState();

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
        await axios.delete(`${server}/api/subscription/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('api url', `${server}/api/user/${id}`);
        console.log('userdata--->', data);
        const updatedsubscriptions = data.filter((subscription) => subscription._id !== id);
        setUserData(updatedsubscriptions);
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

  const handleSaveNewplan = async () => {
    try {
      // ---- IT's Working ------
      const requestData = {
        planType: AddPlanType,
        // role: AddRole,
        actualPrice: AddActualPrice,
        price: AddPrice
      };

      const token = localStorage.getItem('token');
      console.log(token);
      const response = await axios.post(`${server}/api/subscription/create`, requestData, {
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
        // setaddplanName('');
        setaddPlantype('');
        setAddPrice('');
        // setAddRole('');
        setAddActualPrice('');
        // setAddPassword('');

        try {
          const token = localStorage.getItem('token');
          const updatedData = await axios.get(`${server}/api/subscription/getPlan`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setUserData(updatedData.data.data);
          console.log('record save successfully--->', updatedData);
          toast('New plan Added Successfully');
        } catch (error) {
          console.log('Error duing Updated DAta fetching', error);
        }
      } else {
        toast.error('Error Creating plan');
      }
    } catch (error) {
      console.error('Error creating plan:', error);

      toast.error('Error creating plan');
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


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <>
      <Stack spacing={3}>
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
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.Header} sx={{ width: column.Header === 'ID' ? '40px' : 'auto' }}>
                  {column.Header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData?.map((row) => (
              // {paginatedData.map((row, i) => (

              <TableRow key={row._id}>
                <TableCell className="" style={{ width: '20%' }}>
                  {/* {columns.accessor === 'subscriptionName' & */}
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    {/* <Avatar variant="rounded" color="secondary" size="sm" src={`${row?.picture}`} /> */}

                    <Typography>{row?._id || 'NA'}</Typography>
                  </Stack>
                  {/* } */}
                </TableCell>
                <TableCell style={{ width: '15%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography>{row?.userName || 'NA'}</Typography>
                  </Stack>
                </TableCell>
                <TableCell style={{ width: '15%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography> {row?.subscription?.subscriptionid || 'NA'}</Typography>
                  </Stack>
                </TableCell>
                <TableCell style={{ width: '10%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography>{row?.subscription?.subscriptionPlanName || 'NA'}</Typography>
                  </Stack>
                </TableCell>
                <TableCell style={{ width: '10%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography>INR {row?.subscription?.subscriptionAmount + '.00' || 'NA'}</Typography>
                  </Stack>
                </TableCell>
                <TableCell style={{ width: '15%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography> {formatDate(row?.subscription?.purchaseDate) || 'NA'}</Typography>
                  </Stack>
                </TableCell>{' '}
                <TableCell style={{ width: '15%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography> {formatDate(row?.subscription?.expirationDate) || 'NA'}</Typography>
                  </Stack>
                </TableCell>
                <TableCell style={{ width: '10%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography>
                      {' '}
                      {row?.subscription?.Status == true ? (
                        <div className="px-4 py-1 text-[14px] text-green-800 bg-green-100 rounded-full ">True</div>
                      ) : (
                        <div className="px-4 py-1 text-[14px] text-red-800 bg-red-100 rounded-full ">False</div> || 'NA'
                      )}
                    </Typography>
                  </Stack>
                </TableCell>
                {/* <TableCell style={{ width: '25%' }}>
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
        <PaginationComponent page={page} setPage={setPage} filteredData={filteredData} rowsPerPage={rowsPerPage} />
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
                handleSaveNewplan();

                e.preventDefault();
              }}
            >
              <h3 className="text-2xl font-medium text-gray-800 mb-4">Enter New plan Details</h3>

              <div>
                <label htmlFor="planType" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Plan Type
                </label>
                <input
                  type="text"
                  name="planType"
                  id="planType"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter planType"
                  required
                  onChange={(e) => setaddPlantype(e.target.value)}
                  value={AddPlanType}
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
                  required
                  onChange={(e) => setAddPrice(e.target.value)}
                  value={AddPrice}
                />
              </div>

              <div>
                <label htmlFor="expiryDate" className=" text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Actual Price
                </label>
                <div className="max-h-40 overflow-y-auto">
                  <input
                    type="number"
                    name="actualPrice"
                    id="actualPrice"
                    className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                    placeholder="Enter Phone Number"
                    required
                    onChange={(e) => setAddActualPrice(e.target.value)}
                    value={AddActualPrice}
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

      {/*  edit plans  */}
      {editModal.open && (
        <div className="fixed top-0 left-0 w-[100vw] h-full flex items-center justify-center align-middle  bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between p-2">
              <div className="div">
                <h3 className="text-2xl font-medium text-gray-800 mb-4">Edit Subscription Details</h3>
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
                  Plan Type
                </label>
                <input
                  type="text"
                  name="planType"
                  id="planType"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter Plan Type"
                  required=""
                  onChange={(e) => setEditPlanType(e.target.value)}
                  value={EditPlanType}
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
                <label htmlFor="actualPrice" className="text-sm font-medium text-gray-800 light:text-gray-300 block mb-2">
                  Actual Price
                </label>
                <input
                  type="number"
                  name="actualPrice"
                  id="actualPrice"
                  className="bg-gray-100 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-gray-200 focus:border-black-200 block w-full p-2.5 light:bg-gray-700 light:border-gray-500 dark:placeholder-gray-400 dark:text-dark"
                  placeholder="Enter ActualPrice "
                  required=""
                  onChange={(e) => setEditactualPrice(e.target.value)}
                  value={EditactualPrice}
                />
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

// ==============================|| subscription - LIST ||============================== //

const SubScriptionUser = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const data = useMemo(() => makeData(200), []);
  const [open, setOpen] = useState(false);
  const [subscription, setsubscription] = useState(null);
  const [subscriptionDeleteId, setsubscriptionDeleteId] = useState('');
  const [add, setAdd] = useState(false);
  const [userData, setUserData] = useState([]);

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
          const response = await axios.get(`${server}/api/school/user/subscription`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log("reosne",response)
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
      { Header: 'User ID', accessor: '_id' },
      { Header: 'User Name', accessor: 'userName' },
      { Header: 'Plan ID', accessor: 'planID' },

      { Header: 'Plan', accessor: 'planName' },
      { Header: 'Amount', accessor: 'amount' },
      { Header: 'Purchase Date', accessor: 'purchaseDate' },
      { Header: 'Expiry Date', accessor: 'expiryDate' },
      { Header: 'Status', accessor: 'status' }
      //   { Header: 'Actions', accessor: 'actions' }
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

export default SubScriptionUser;
