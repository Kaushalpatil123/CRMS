import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import {
  Stack,
  Box,
  Button,
  Checkbox as CheckboxMUI,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  Modal,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  InputLabel,
  Select,
  TextareaAutosize,
  MenuItem,
  DialogActions,
  FormControl,
  Grid
} from '@mui/material';
import CustomCheckbox from '../../../components/Checkbox';
import AddIcon from '@mui/icons-material/Add';
//import DownloadIcon from '@mui/icons-material/Download';
import {
  ArrowDownward as ArrowDown,
  ArrowUpward,
  Download,
  DownloadDone,
  FilterAlt as FilterAltIcon,
  Edit,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Whatsapp,
  Undo
} from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';

import { Toaster, toast } from 'react-hot-toast';
import MainCard from 'components/MainCardWithoutTitle';
import SearchBar from '../components/Searchbar';
import PaginationComponent from '../components/Pagination';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SortIcon from '../../../assets/images/icons/sort-icon.jpeg';
import CloseIcon from '@mui/icons-material/Close';
import { DeleteOrder, getAllOrders, getAllStatus, postImport, getAllExecutives } from 'pages/utils/leads/api';
import DateButton from '../../../components/DateRange';
import PermDeviceInformationRoundedIcon from '@mui/icons-material/PermDeviceInformationRounded';
import * as XLSX from 'xlsx';
import { Sort } from 'iconsax-react';
import { ArrangeVertical, FilterEdit } from 'iconsax-react';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';

import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import GroupIcon from '@mui/icons-material/Group';
import { AddedOrderWishlist, UndoDeleteOrder } from 'pages/utils/orders/api';
import {
  FaEllipsisV,
  FaEye,
  FaTrashAlt,
  FaEdit,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle
} from 'react-icons/fa';

const List = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const [filterText, setFilterText] = useState('');
  const [selected, setSelected] = useState([]);

  const [executive, setExecutive] = useState('');

  const [isActive, setIsActive] = useState(true);
  const [isActiveVal, setIsActiveVal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [isDateOpen, setIsDateOpen] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allExecutives, setAllExecutives] = useState([]);

  // const [importModal, setImportModal] = useState({ open: false });
  const [leads, setLeads] = useState([]);
  const [orders, setOrders] = useState([]); // State to store orders
  const [totalOrder, setTotalOrder] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [ImportModalOpen, setImportModalOpen] = useState(false);
  //const [modalType, setModalType] = useState('');
  const [filterToggle, setFilterToggle] = useState(false);
  const [apiStatus, setApiStatus] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedFilter, setSelectedFilter] = useState('');

  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const dateRef = useRef(null);
  // Sorting
  // Today's date
  const [todayDate, setTodayDate] = useState('');

  // const handleImportModalOpen = () => setImportModalOpen(true);
  const [ConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const handleOpenConfirmationModal = () => setConfirmationModalOpen(true);

  const [role, setRole] = useState('');
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    console.log('role check ------>', storedRole);
    setRole(storedRole);
  }, []);
  useEffect(() => {
    console.log('this is filter 1------>', selectedFilter);
    console.log('this is filter 2------>', sortOrder);
  }, [selectedFilter, sortOrder]);

  const handleCloseConfirmationModal = () => setConfirmationModalOpen(false);
  // const handleClose = () => {
  //   setImportModalOpen(false);
  // };

  const handleWishlist = async (e, orderId) => {
    e.stopPropagation();

    setIsWishlisted((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId]
    }));
    const token = localStorage.getItem('token');
    await AddedOrderWishlist(orderId, {}, token);
  };

  const server = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  const handleLeadCheckboxChange = (value) => {
    console.log(value);
    if (status === value) {
      setStatus('');
    } else {
      setStatus(value);
    }
  };
  const handleExecutiveCheckboxChange = (value) => {
    console.log(value);
    if (executive === value) {
      setExecutive('');
    } else {
      setExecutive(value);
    }
  };
  const handleIsActiveValCheckboxChange = (value) => {
    console.log(value);
    if (isActiveVal === value) {
      setIsActiveVal('');
    } else {
      setIsActiveVal(value);
    }
    if (isActiveVal === 'Active') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
    console.log(isActive);
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
    setIsDropdownOpen(false);
    setIsDateOpen(false);
  };
  const handleSearchChange = (event) => {
    setFilterText(event.target.value);
  };

  const toggleFilterDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsSortDropdownOpen(false);
    setIsDateOpen(false);
  };
  const toggleDateDropdown = () => {
    setIsDateOpen(!isDateOpen);
    setIsDropdownOpen(false);
    setIsSortDropdownOpen(false);
  };

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const toggleDropdown = (event, id) => {
    event.stopPropagation();
    setDropdownOpen(dropdownOpen === id ? null : id);
  };
  const handleClickOutside = () => {
    setIsDropdownOpen(null);
  };
  const handleDateRangeChange = (start, end) => {
    console.log(start, end);
    setStartDate(start);
    setEndDate(end);
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelecteds = orders.map((lead) => orders.companyName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleCheckClick = (e, companyName) => {
    e.stopPropagation();
    console.log('check click--->', companyName);
    const selectedIndex = selected.indexOf(companyName);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, companyName);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (size) => {
    console.log(size);
    setRowsPerPage(size);
    setPage(0);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const all_status = async () => {
      const response = await getAllStatus(token);
      console.log(response);
      setApiStatus(response);
    };
    all_status();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setIsDateOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // -------------------------------------------------------------------- for order list----------------

  // Enter Delivery
  const [enterDelivery, setEnterDelivery] = useState({
    open: false
  });

  const handleEnterDeliveryModalClose = () => {
    setEnterDelivery({
      open: false
    });
  };

  const handleEnterDelivery = () => {
    setEnterDelivery({
      open: true
    });
  };

  // Enter Quick Order
  const [enterQuickOrder, setEnterQuickOrder] = useState({
    open: false
  });

  const handleEnterQuickOrderModalClose = () => {
    setEnterQuickOrder({
      open: false
    });
  };

  const handleEnterQuickOrder = () => {
    setEnterQuickOrder({
      open: true
    });
  };

  const fetchOrder = async () => {
    const token = localStorage.getItem('token');
    const orderData = await getAllOrders(currentPage, rowsPerPage, startDate, endDate, sortOrder, token);
    if (orderData) {
      console.log(orderData);
    } else {
      console.log('error');
    }

    setOrders(orderData.data.orders);
    const wishlistedStatus = orderData?.data?.orders.reduce((acc, order) => {
      acc[order._id] = order.wishlist; // Set the wishlist status for each lead by its ID
      return acc;
    }, {});

    // Set the isWishlisted state with the new object
    setIsWishlisted(wishlistedStatus);

    setTotalOrder(orderData.data.totalOrders);
  };

  console.log('this is order api data------->', orders);

  useEffect(() => {
    fetchOrder();
  }, [currentPage, rowsPerPage, startDate, endDate, sortOrder]);

  const [UndoDeleteConfirmation, setUndoDeleteConfirmation] = useState({
    open: false,
    id: null
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null
  });

  const handleDeleteConfirmation = (event, id) => {
    console.log('delete confirmation call hua00-->');
    event.stopPropagation();
    setDeleteConfirmation({ open: true, id });
    fetchOrder();
  };

  const handleConfirmDelete = async (event) => {
    event.stopPropagation();
    const { id } = deleteConfirmation;

    if (id) {
      try {
        const token = localStorage.getItem('token');

        // Call DeleteLead with id and token
        await DeleteOrder(id, token);

        // Update order state
        const updatedOrders = fetchOrder();
        // setOrders(updatedOrders);

        console.log('updated order after delete,', updatedOrders);

        // Reset page if needed
        if (page > Math.ceil(updatedOrders.length / rowsPerPage) - 1) {
          setPage(0);
        }
        toast.success('Order Deleted Successfully');

        // Optional: Show success message
      } catch (error) {
        console.error('Error deleting lead:', error);
      } finally {
        // Close the confirmation modal
        setDeleteConfirmation({ open: false, id: null });
      }
    }
    fetchOrder();
  };

  const handleUndoDeleteConfirmation = (event, id) => {
    event.stopPropagation();
    setUndoDeleteConfirmation({ open: true, id });
  };

  const handleConfirmUndoDelete = async (event) => {
    event.stopPropagation();
    const { id } = UndoDeleteConfirmation;

    if (id) {
      try {
        const token = localStorage.getItem('token');

        // Call DeleteLead with id and token
        await UndoDeleteOrder(id, token);

        // Update leads state
        const updatedOrders = fetchOrder();
        // setOrders(updatedOrders);

        console.log('updated order after delete,', updatedOrders);
        // Reset page if needed
        if (page > Math.ceil(updatedOrders.length / rowsPerPage) - 1) {
          setPage(0);
        }
        toast.success('Order Revert successfully');

        // Optional: Show success message
      } catch (error) {
        console.error('Error deleting lead:', error);
      } finally {
        // Close the confirmation modal
        setUndoDeleteConfirmation({ open: false, id: null });
      }
    }
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setTodayDate(formattedDate);
  }, []);

  const handleTodayDate = (event) => {
    setTodayDate(event.target.value);
  };
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setFilterText(value);
    setSearchTerm(value);

    const filtered = orders.filter((order) => {
      // console.log('this is filter order-------->', order);
      return (
        order?.partyDetails?.contactPerson?.toLowerCase().includes(value) ||
        (order?.documentDetails?.orderNumber && order.documentDetails.orderNumber.toLowerCase().includes(value)) ||
        (order?.documentDetails?.customerPoNumber && order.documentDetails.customerPoNumber.toLowerCase().includes(value)) ||
        (order.total && order.total.toString().includes(value)) ||
        (order.status && order.status.toLowerCase().includes(value)) ||
        (order?.documentDetails?.dueDate && order.documentDetails.dueDate.includes(value))
      );
    });

    setFilteredData(filtered);
  };
  const displayData = searchTerm ? filteredData : orders;

  const addfilter = (filter) => {
    setSortOrder(filter);
    setSelectedFilter(filter);
  };

  return (
    <>
      <Box>
        <Typography className="text-xl font-semibold mb-4" sx={{ fontWeight: 500 }}>
          TOTAL ORDERS: {totalOrder}
        </Typography>

        <MainCard
          content={false}
          secondary={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <div style={{ width: '500px' }}>
                <SearchBar
                  sx={{ width: '100%' }}
                  filterText={filterText}
                  setFilterText={setFilterText}
                  handleSearchChange={handleSearch}
                  searchText="ORDERS . . . ."
                />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Stack className="flex flex-row gap-3">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Button
                      // variant="outlined"
                      className="flex align-center justify-start gap-2 bg-[#779E40] hover:bg-[#5F7E33] rounded hover:text-white text-white font-normal-400 font-inter"
                      onClick={() => navigate('/apps/orders/enter-order')}
                      data-modal-toggle="add-modal"
                    >
                      ENTER ORDER
                    </Button>
                  </Stack>
                </Stack>
              </div>
            </div>
          }
        >
          {/* <Divider sx={{ marginBottom: '0.3rem' }} /> */}
          <div className="overflow-x-auto bg-background">
            <Box className="flex gap-2 ml-5">
              <Stack className="flex flex-row gap-1 py-4">
                <Box ref={dateRef}>
                  <DateButton
                    handleDateRangeChange={handleDateRangeChange}
                    toggleDateDropdown={toggleDateDropdown}
                    isDateDropdownOpen={isDateOpen}
                    setIsDateDropdownOpen={setIsDateDropdownOpen}
                  />
                </Box>
              </Stack>
              <Stack className="flex py-4">
                <div className="w-[170px]  relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => addfilter(e.target.value)}
                    // onChange={(e) => setSortOrder(e.target.value) && setSelectedFilter(e.target.value)}
                    className="block w-full px-3 py-2 border text-gray-500 border-gray-400 bg-white rounded shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm appearance-none"
                  >
                    <option value="">SORT ORDERS</option>
                    <option value="asc">ASCENDING</option>
                    <option value="desc">DESCENDING</option>
                  </select>

                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    {sortOrder === '' && <FaSort className="text-blue-600" />}
                    {sortOrder === 'asc' && <FaSortUp className="text-lime-500" />}
                    {sortOrder === 'desc' && <FaSortDown className="text-red-600" />}
                  </div>
                </div>
              </Stack>
              {selectedFilter && (
                <Stack className="flex py-4">
                  <div className="block w-full px-3 py-2 border text-gray-500 border-gray-400 bg-white rounded shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm appearance-none">
                    <p>
                      Filter :- <span>{selectedFilter === 'asc' ? 'Ascending' : 'Descending'}</span>
                    </p>
                  </div>
                </Stack>
              )}
            </Box>

            <Box sx={{ minHeight: '60vh' }}>
              <Table sx={{ textTransform: 'uppercase' }}>
                <TableHead>
                  <TableRow
                    sx={{
                      borderColor: 'black',
                      height: '55px',
                      minHeight: '55px',
                      '& .MuiTableCell-root': {
                        padding: '2px 6px',
                        height: '45px',
                        height: '30px',
                        minHeight: '30px',
                        marginBottom: '3rem',
                        backgroundColor: 'rgba(118, 159, 64, 0.29)',
                        //backgroundColor:'#779E40',
                        color: 'black'
                      }
                    }}
                    className="ml-20"
                  >
                    <TableCell>
                      <Box className="flex gap-1 font-inter">
                        <Typography
                          className="font-inter text-[14px]"
                          sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
                        ></Typography>
                        <Typography></Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="flex gap-1 font-inter">
                        <Typography className="font-inter text-[14px]" sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                          Contact
                        </Typography>
                        <Typography>
                          <ArrangeVertical size="14" color="gray" fontWeight={'semibold'} />
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="flex gap-1 font-inter">
                        <Typography className="font-inter text-[14px]" sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                          Order No
                        </Typography>
                        <Typography>
                          <ArrangeVertical size="14" color="gray" fontWeight={'semibold'} />
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="flex gap-1 font-inter">
                        <Typography className="font-inter text-[14px]" sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                          Cstr P.O.
                        </Typography>
                        <Typography>
                          <ArrangeVertical size="14" color="gray" fontWeight={'semibold'} />
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="flex gap-1 font-inter">
                        <Typography className="font-inter text-[14px]" sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                          Due Date
                        </Typography>
                        <Typography>
                          <ArrangeVertical size="14" color="gray" fontWeight={'semibold'} />
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="flex gap-1 font-inter">
                        <Typography
                          className="font-inter text-center text-[14px]"
                          sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
                        >
                          Total Price
                        </Typography>
                        <Typography>
                          <ArrangeVertical size="14" color="gray" fontWeight={'semibold'} />
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="flex gap-1 justify-center items-center font-inter">
                        <Typography className="font-inter text-[14px]" sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                          Status
                        </Typography>
                        <Typography>
                          <ArrangeVertical size="14" color="gray" fontWeight={'semibold'} />
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="flex gap-1 justify-center items-center font-inter">
                        <Typography
                          className="font-inter text-[14px] text-center flex justify-center"
                          sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
                        >
                          Actions
                        </Typography>
                        <Typography>
                          <ArrangeVertical size="14" color="gray" fontWeight={'semibold'} />
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody sx={{ cursor: 'pointer' }}>
                  {displayData.length > 0 &&
                    displayData.map((row, index) => {
                      const isLastItem = index === row.length - 1;
                      return (
                        <TableRow
                          key={row._id}
                          selected={selected.indexOf(orders.companyName) !== -1}
                          onClick={() => navigate(`/apps/orders/editOrder/${row._id}`)}
                          sx={{
                            backgroundColor: row.isDeleted ? '#FFB3B3' : index % 2 === 0 ? '#DEDEDE' : '#F7F7F7',
                            '&:hover': {
                              backgroundColor: row.isDeleted
                                ? '#FFB3B3 !important'
                                : index % 2 === 0
                                ? '#DEDEDE !important'
                                : '#F7F7F7 !important'
                            }
                          }}
                        >
                          <TableCell className=" items-center font-inter text-[13px]" sx={{ fontWeight: 400, width: '2%' }}>
                            <StarsOutlinedIcon
                              sx={{ fontSize: '13px', color: isWishlisted[row._id] ? 'green' : 'gray' }}
                              onClick={(e) => handleWishlist(e, row._id)}
                            />
                          </TableCell>
                          {/* {console.log('orders check for id--->',row)} */}
                          <TableCell className=" items-center font-inter text-[13px]" sx={{ fontWeight: 400, width: '15%' }}>
                            {row?.partyDetails?.contactPerson || '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400, width: '15%' }}>
                            {row?.documentDetails?.orderNumber || '-'}
                          </TableCell>
                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400, width: '15%' }}>
                            {row?.documentDetails?.customerPoNumber || '-'}
                          </TableCell>
                          {/* {console.log('lead active statis---',lead.isav)} */}
                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400, width: '15%' }}>
                            {row?.documentDetails?.dueDate || '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400, width: '15%' }}>
                            {row?.grandTotal !== null && row?.grandTotal !== undefined ? Math.round(row.grandTotal) : '-'}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 400, width: '15%' }}>
                            <Typography
                              className={`text-white rounded p-1 text-center font-inter text-[13px]
                      ${row.status === 'Received' ? 'bg-orange-300' : ''}
                      ${row.status === 'Done' ? 'bg-green-600' : ''}
                      ${row.status === 'Query' ? 'bg-red-600' : ''}
                      ${row.status === 'WIP' ? 'bg-orange-600' : ''}
                      ${row.status === 'Packed' ? 'bg-yellow-500' : ''}
                      ${row.status === 'Cancelled' ? 'bg-yellow-900' : ''}
                      ${!row.status ? 'bg-gray-400' : ''}
                    `}
                            >
                              {row?.status || 'NA'}
                            </Typography>
                          </TableCell>
                          <TableCell
                            className="font-inter text-center text-[13px]"
                            sx={{ fontWeight: 400, width: '15%' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="relative flex justify-center">
                              <button
                                onClick={(e) => toggleDropdown(e, row._id)}
                                className="p-1 rounded-md text-[15px] border shadow-md bg-white flex items-center justify-center"
                              >
                                <MoreVertIcon />
                              </button>
                              {dropdownOpen === row._id && (
                                <div
                                  className="absolute top-9 right-19 w-38 -translate-x-5 bg-white rounded-lg shadow-lg z-10"
                                  style={isLastItem ? { transform: 'translate(-18px,-123px)' } : {}}
                                >
                                  <ul className="py-3">
                                    {role === `"Admin"` && row.isDeleted === true && (
                                      <li
                                        className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                        onClick={(event) => handleUndoDeleteConfirmation(event, row._id)}
                                      >
                                        <Undo className="text-[20px] text-green-700" />
                                        <Typography className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>
                                          Undo
                                        </Typography>
                                      </li>
                                    )}

                                    <li
                                      className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                      onClick={() => navigate(`/apps/orders/editOrder/${row._id}`)}
                                    >
                                      <EditIcon className="text-[20px] text-green-700" />
                                      <Typography>Edit</Typography>
                                    </li>
                                    <li
                                      className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                      onClick={(event) => handleDeleteConfirmation(event, row._id)}
                                    >
                                      <DeleteIcon className="text-[20px] text-red-500" />
                                      <Typography>Delete</Typography>
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              {/* </Box> */}
            </Box>
          </div>

          {/* Undo Delete Confirmation */}
          {UndoDeleteConfirmation.open && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-[110000]">
              <div className="bg-white p-6 rounded-md">
                <p className="mb-4">Are you sure you want to revert back this record?</p>
                <div className="flex justify-end">
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md mr-4" onClick={(event) => handleConfirmUndoDelete(event)}>
                    Confirm
                  </button>
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                    onClick={() => setUndoDeleteConfirmation({ open: false, id: null })}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete confirmation  */}

          {deleteConfirmation.open && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-[5000]">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <p className="mb-4">Are you sure you want to delete this item?</p>
                <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={(event) => handleConfirmDelete(event)}>
                  Confirm
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setDeleteConfirmation({ open: false, id: null })}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <Dialog
            open={enterQuickOrder.open}
            onClose={handleEnterQuickOrderModalClose}
            fullWidth
            maxWidth="md"
            PaperProps={{ style: { borderRadius: '10px' } }} // Customizing dialog paper
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Enter Order</h3>
              <IconButton onClick={handleEnterQuickOrderModalClose}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ overflowY: 'auto', maxHeight: '65vh' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', py: 2, gap: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<SearchIcon />}
                  // sx={{ mr: 2, fontFamily: 'Poppins', flexShrink: 0 }} // Prevent shrinking
                  className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                >
                  Select Customer
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  // sx={{ fontFamily: 'Poppins', flexShrink: 0 }} // Prevent shrinking
                  className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                >
                  New
                </Button>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Include Contact Name"
                  sx={{ ml: 2 }} // Add margin to the left for spacing
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Company Name"
                    fullWidth
                    variant="outlined"
                    required
                    size="small" // Added size for consistent height
                  />
                </Grid>
                <Grid item xs={12} sm={6} container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Start Date"
                      type="date"
                      value={todayDate}
                      onChange={(e) => setTodayDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small" // Added size for consistent height
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="End Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small" // Added size for consistent height
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Box sx={{ my: 4, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  // color="primary"
                  size="medium"
                  className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                >
                  Sales
                </Button>
                <Button
                  variant="outlined"
                  // color="primary"
                  className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                  size="medium"
                >
                  Service
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Select Sales Executive</InputLabel>
                    <Select defaultValue="" label="Select Sales Executive">
                      <MenuItem value="option1">Option 1</MenuItem>
                      <MenuItem value="option2">Option 2</MenuItem>
                      <MenuItem value="option3">Option 3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Select Responsible Executive</InputLabel>
                    <Select defaultValue="" label="Select Responsible Executive">
                      <MenuItem value="option1">Option 1</MenuItem>
                      <MenuItem value="option2">Option 2</MenuItem>
                      <MenuItem value="option3">Option 3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Billing and Shipping Address */}
              <Grid container spacing={3} sx={{ mb: 3, mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Billing Address
                  </Typography>
                  <TextField placeholder="Billing Address" multiline rows={3} fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Shipping Address</Typography>
                  <Stack direction="row" alignItems="center">
                    <Checkbox color="primary" />
                    <Typography>Same as Billing Address</Typography>
                  </Stack>
                </Grid>
              </Grid>

              <Box sx={{ my: 4 }}>
                <h2 style={{ margin: 0 }}>Enter Sales</h2>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Item" fullWidth variant="outlined" size="small" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Quantity" fullWidth variant="outlined" size="small" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Price"
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: <span style={{ marginRight: '8px' }}>₹</span>
                      }}
                    />
                  </Grid>
                </Grid>
                <TextareaAutosize
                  minRows={3}
                  placeholder="Notes"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc'
                  }}
                />
              </Box>

              <Box sx={{ my: 4 }}>
                <Button
                  variant="contained"
                  //  color="primary"
                  className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                  startIcon={<AddIcon />}
                  size="medium"
                >
                  Add Another Item
                </Button>
              </Box>

              <FormControlLabel control={<Checkbox />} label="Update Customer" />
            </DialogContent>

            <DialogActions>
              <Button
                onClick={handleEnterQuickOrderModalClose}
                // color="primary"
                className="flex align-center justify-start gap-2 bg-red-600 text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                // color="success"
                className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* {enterDelivery.open && (
            <div className="fixed top-0 left-0 w-[100vw] h-full flex items-center overflow-y-hidden justify-center bg-black bg-opacity-50 z-52">
              <div className="bg-white p-6 rounded-sm w-[50vw] mt-12 h-[80vh] overflow-y-hidden font-poppins">
                <div className="flex justify-between items-center py-2">
                  <h3 className="text-2xl font-semibold  my-2">Enter Order</h3>
                  <Button
                    type="Button"
                    className="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-sm text-sm p-1.5 ml-auto inline-flex items-center"
                    data-modal-toggle="authentication-modal"
                    onClick={() => handleEnterDeliveryModalClose()}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                </div>

                <form
                  id="form"
                  className="space-y-6 overflow-y-auto max-h-[65vh] pr-3"
                  onSubmit={(e) => {
                    handleEnterDeliveryModalClose();
                    e.preventDefault();
                  }}
                >
                  <div className="flex items-center py-2 space-x-3">
                    <Button className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-poppins w-[30%]">
                      <SearchIcon className="mr-2" />
                      Select Customer
                    </Button>
                    <Button className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 w-[30%] font-poppins">
                      <AddIcon className="mr-2" />
                      New
                    </Button>
                    <div className="flex items-center">
                      <Checkbox
                        type="Button"
                        role="checkbox"
                        aria-checked="false"
                        data-state="unchecked"
                        value="on"
                        padding="checkbox"
                        id="shippingAddress"
                      />
                      <span>Include Contact Name</span>
                    </div>
                  </div>

                  <div className="flex space-x-10">
                    <div>
                      <label htmlFor="mobileNumber" className="text-sm font-medium text-gray-800 block mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        id="company"
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block p-2.5"
                        placeholder="Enter Company Name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="mobileNumber" className="text-sm font-medium text-gray-800 block mb-2">
                        Date Range
                      </label>
                      <input
                        type="date"
                        value={todayDate}
                        onChange={handleTodayDate}
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none p-2.5 mr-5"
                      />
                      <input
                        type="date"
                        id="dateInput"
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none p-2.5"
                      />
                    </div>
                  </div>

                  <div className="space-x-2">
                    <Button className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-poppins">
                      Sales
                    </Button>
                    <Button className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-poppins">
                      Service
                    </Button>
                  </div>

                  <div className="flex space-x-5">
                    <div>
                      <div className="relative flex space-x-2 items-center">
                        <GroupIcon className="text-4xl text-blue-900" />
                        <select
                          id="copyFrom"
                          className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                        >
                          <option value="none">Select Sales Executive</option>
                          <option value="option1">Option 1</option>
                          <option value="option2">Option 2</option>
                          <option value="option3">Option 3</option>
                        </select>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-chevron-down h-4 w-4 opacity-50 absolute top-1/2 right-1 transform -translate-y-1/2 pointer-events-none"
                          aria-hidden="true"
                        >
                          <path d="m6 9 6 6 6-6"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div className="relative flex space-x-2 items-center">
                        <GroupIcon className="text-4xl text-blue-900" />
                        <select
                          id="copyFrom"
                          className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                        >
                          <option value="none">Select Responsible Executive</option>
                          <option value="option1">Option 1</option>
                          <option value="option2">Option 2</option>
                          <option value="option3">Option 3</option>
                        </select>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-chevron-down h-4 w-4 opacity-50 absolute top-1/2 right-1 transform -translate-y-1/2 pointer-events-none"
                          aria-hidden="true"
                        >
                          <path d="m6 9 6 6 6-6"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-5">
                    <div className="rounded-md border bg-card text-card-foreground shadow-sm p-4 flex-1" data-v0-t="card">
                      <h2 className="text-lg font-semibold mb-4">Billing Address</h2>
                      <textarea
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                        placeholder="Billing Address"
                      ></textarea>
                    </div>
                    <div className="rounded-md border bg-card text-card-foreground shadow-sm p-4 flex-1" data-v0-t="card">
                      <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                      <div className="flex items-center">
                        <Checkbox
                          type="Button"
                          role="checkbox"
                          aria-checked="false"
                          data-state="unchecked"
                          value="on"
                          padding="checkbox"
                          id="shippingAddress"
                        />
                        <span>Same as Billing Address</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border bg-card text-card-foreground shadow-sm p-4 flex-1" data-v0-t="card">
                    <h2 className="text-lg font-semibold mb-4">Enter Sales</h2>
                    <div className="flex space-x-5 mb-4">
                      <input
                        type="text"
                        name="item"
                        id="item"
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-[42%] p-2.5"
                        placeholder="Item"
                        required
                      />
                      <input
                        type="text"
                        name="quantity"
                        id="quantity"
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-[42%] p-2.5"
                        placeholder="Quantity"
                        required
                      />
                      <div className="relative w-[42%]">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                        <input
                          type="text"
                          name="price"
                          id="price"
                          className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full pl-6 p-2.5"
                          placeholder="Price"
                          required
                        />
                      </div>
                    </div>
                    <textarea
                      className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                      placeholder="Notes"
                    ></textarea>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-poppins"
                    >
                      <AddIcon className="mr-2" />
                      Add Another Item
                    </Button>
                  </div>

                  <div>
                    <div className="flex space-x-5 mb-4">
                      <input
                        type="text"
                        name="item"
                        id="item"
                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-[42%] p-2.5"
                        placeholder="Delivery Details"
                        required
                      />
                      <Button className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-poppins">
                        <AddIcon className="mr-2" />
                        Add Note
                      </Button>
                      <Button className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-poppins">
                        <UploadFileIcon className="mr-2" />
                        Upload Invoice
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border bg-card text-card-foreground shadow-sm p-4 flex-1" data-v0-t="card">
                    <h2 className="text-lg font-semibold mb-4">Update Recovery Amount</h2>
                    <div className="flex space-x-5 mb-4">
                      <div className="relative w-[42%]">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                        <input
                          type="number"
                          name="item"
                          id="item"
                          className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full pl-6 p-2.5"
                          placeholder="0"
                          required
                        />
                      </div>
                      <div className="relative w-[42%]">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                        <input
                          type="number"
                          name="quantity"
                          id="quantity"
                          className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full pl-6 p-2.5"
                          placeholder="Add"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center -ml-2 ">
                    <Checkbox
                      type="Button"
                      role="checkbox"
                      aria-checked="false"
                      data-state="unchecked"
                      value="on"
                      padding="checkbox"
                      id="shippingAddress"
                      className="-my-8"
                    />
                    <span>Update Customer</span>
                  </div>

                  <div className="flex justify-center items-center">
                    <Button
                      type="submit"
                      className="bg-lime-600 rounded-md text-white font-semibold hover:bg-lime-700 hover:text-white p-2 font-poppins my-4"
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )} */}
          <Dialog
            open={enterDelivery.open}
            onClose={handleEnterDeliveryModalClose}
            fullWidth
            maxWidth="md"
            PaperProps={{ style: { maxHeight: '80vh', marginTop: '5vh', overflow: 'hidden' } }}
          >
            <DialogTitle>
              <Typography variant="h6" component="div">
                Enter Order
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleEnterDeliveryModalClose}
                aria-label="close"
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ overflowY: 'auto' }}>
              <form
                onSubmit={(e) => {
                  handleEnterDeliveryModalClose();
                  e.preventDefault();
                }}
              >
                {/* Customer Selection */}
                <Box sx={{ display: 'flex', alignItems: 'center', py: 2, gap: 2 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<SearchIcon />}
                    // sx={{ mr: 2, fontFamily: 'Poppins', flexShrink: 0 }} // Prevent shrinking
                    className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                  >
                    Select Customer
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    // sx={{ fontFamily: 'Poppins', flexShrink: 0 }} // Prevent shrinking
                    className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                  >
                    New
                  </Button>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Include Contact Name"
                    sx={{ ml: 2 }} // Add margin to the left for spacing
                  />
                </Box>

                {/* Company Name and Date Range */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <TextField label="Company Name" variant="outlined" fullWidth required />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Start Date"
                      type="date"
                      value={todayDate}
                      onChange={(e) => setTodayDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField label="End Date" type="date" InputLabelProps={{ shrink: true }} fullWidth variant="outlined" />
                  </Grid>
                </Grid>

                {/* Sales and Service Buttons */}
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <Button
                    variant="contained"
                    // color="primary"
                    className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                  >
                    Sales
                  </Button>
                  <Button
                    variant="contained"
                    // color="primary"
                    className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                  >
                    Service
                  </Button>
                </Stack>

                {/* Sales Executive Selection */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Select fullWidth variant="outlined" defaultValue="">
                      <MenuItem value="">Select Sales Executive</MenuItem>
                      <MenuItem value="option1">Option 1</MenuItem>
                      <MenuItem value="option2">Option 2</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Select fullWidth variant="outlined" defaultValue="">
                      <MenuItem value="">Select Responsible Executive</MenuItem>
                      <MenuItem value="option1">Option 1</MenuItem>
                      <MenuItem value="option2">Option 2</MenuItem>
                    </Select>
                  </Grid>
                </Grid>

                {/* Billing and Shipping Address */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6">Billing Address</Typography>
                    <TextField placeholder="Billing Address" multiline rows={3} fullWidth variant="outlined" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6">Shipping Address</Typography>
                    <Stack direction="row" alignItems="center">
                      <Checkbox color="primary" />
                      <Typography>Same as Billing Address</Typography>
                    </Stack>
                  </Grid>
                </Grid>

                {/* Enter Sales Section */}
                <Box
                  sx={{
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    p: 3,
                    mb: 3
                  }}
                >
                  <Typography variant="h6">Enter Sales</Typography>
                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={4}>
                      <TextField label="Item" fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField label="Quantity" fullWidth variant="outlined" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Price"
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                        }}
                      />
                    </Grid>
                  </Grid>
                  <TextField placeholder="Notes" multiline rows={2} fullWidth variant="outlined" sx={{ mt: 2 }} />
                </Box>

                {/* Buttons for Adding Items */}
                <Button
                  variant="contained"
                  // color="primary"
                  className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                  type="submit"
                  startIcon={<AddIcon />}
                  sx={{ mb: 3 }}
                >
                  Add Another Item
                </Button>

                {/* Delivery Details and Upload Section */}
                {/* Delivery Details and Upload Section */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={8}>
                    <TextField label="Delivery Details" sx={{ width: '100%' }} variant="outlined" />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      variant="contained"
                      className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                      startIcon={<AddIcon />}
                      fullWidth
                    >
                      Add Note
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      variant="contained"
                      className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                      startIcon={<UploadFileIcon />}
                      fullWidth
                    >
                      Upload Invoice
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </DialogContent>

            <DialogActions>
              <Button
                onClick={handleEnterDeliveryModalClose}
                variant="contained"
                color="secondary"
                className="flex align-center justify-start gap-2 bg-red-600 text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
              >
                Close
              </Button>
              <Button
                onClick={handleEnterDeliveryModalClose}
                variant="contained"
                // color="secondary"
                className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </MainCard>
        <PaginationComponent
          currentPage={currentPage}
          totalCount={totalOrder}
          handleChangePage={(page) => setCurrentPage(page)}
          rowsPerPage={rowsPerPage}
          handleRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Toaster position="top-right" reverseOrder={false} />
      </Box>
    </>
  );
};

export default List;
