import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  Menu,
  MenuItem,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import Checkbox from '../../../components/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import {
  ArrowUpward,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Undo,
  PictureAsPdf as PictureAsPdfIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CustomCheckbox from '../../../components/Checkbox';

import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
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
import { Toaster, toast } from 'react-hot-toast';
import MainCard from 'components/MainCardWithoutTitle';
import SearchBar from '../components/Searchbar';
import PaginationComponent from '../components/Pagination';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllInvoices, DeleteInvoice, exportInvoice, AddedLeadWishlist, UndoDeleteInvoice } from 'pages/utils/invoices/api';
import DateButton from '../../../components/DateRange';

import InvoicePopUp from './InvoicePopUp';
import { ArrangeVertical, Sort } from 'iconsax-react';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import QuotationPopUp from './InvoicePopUp';
import { FiDownload } from 'react-icons/fi';
import axios from 'axios';
const server = process.env.REACT_APP_API_URL;

const InvoicesTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [filterText, setFilterText] = useState('');
  const [selected, setSelected] = useState([]);
  const [callStats, setCallStats] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortRef = useRef(null);
  const dateRef = useRef(null);
  const [sortOrder, setSortOrder] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [filteredData, setFilteredData] = useState([]); // New state for filtered quotations
  const [searchTerm, setSearchTerm] = useState(''); // New state for search input

  const navigate = useNavigate();
  const [role, setRole] = useState('');
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    console.log('role check ------>', storedRole);
    setRole(storedRole);
  }, []);
  const columns = useMemo(
    () => [
      { Header: 'Invoice ID', accessor: 'invoiceId' },
      { Header: 'Client', accessor: 'client' },
      { Header: 'Project', accessor: 'project' },
      { Header: 'Agent', accessor: 'agent' },
      { Header: 'Due Date', accessor: 'dueDate' },
      { Header: 'Amount', accessor: 'amount' },
      { Header: 'Paid Amount', accessor: 'paidAmount' },
      { Header: 'Balance Amount', accessor: 'balanceAmount' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Action', accessor: 'action' }
    ],
    []
  );
  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
    setIsDateOpen(false);
  };
  const handleSearchChange = (event) => {
    setFilterText(event.target.value);
  };
  const toggleDateDropdown = () => {
    setIsDateOpen(!isDateOpen);
    setIsSortDropdownOpen(false);
  };
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const toggleDropdown = (event, id) => {
    event.stopPropagation();
    setDropdownOpen(dropdownOpen === id ? null : id);
  };
  const handleDateRangeChange = (start, end) => {
    console.log(start, end);
    setStartDate(start);
    setEndDate(end);
  };
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null
  });
  const [UndoDeleteConfirmation, setUndoDeleteConfirmation] = useState({
    open: false,
    id: null
  });

  const handleDeleteConfirmation = (event, id) => {
    console.log('delete confirmation call hua00-->');
    event.stopPropagation();
    setDeleteConfirmation({ open: true, id });
  };

  const handleConfirmDelete = async (event) => {
    event.stopPropagation();
    const { id } = deleteConfirmation;

    if (id) {
      try {
        const token = localStorage.getItem('token');
        await DeleteInvoice(id, token);
        // const updatedinvoices = invoices.filter((invoice) => invoice._id !== id);
        // setInvoices(updatedinvoices);
        // Update order state
        const updatedInvoices = fetchInvoices();
        // setOrders(updatedOrders);

        console.log('updated invoices after delete,', updatedInvoices);
        if (page > Math.ceil(updatedInvoices.length / rowsPerPage) - 1) {
          setPage(0);
        }
        toast.success('Invoice deleted successfully');
      } catch (error) {
        console.error('Error deleting invoice:', error);
      } finally {
        setDeleteConfirmation({ open: false, id: null });
        setDropdownOpen(null);
      }
    }
  };

  const handleWishlist = async (e, invoiceId) => {
    e.stopPropagation();

    setIsWishlisted((prevState) => ({
      ...prevState,
      [invoiceId]: !prevState[invoiceId]
    }));
    const token = localStorage.getItem('token');
    await AddedLeadWishlist(invoiceId, {}, token);
  };

  const flattenObject = (obj, parentKey = '') => {
    let result = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (value && typeof value === 'object') {
        if (Array.isArray(value)) {
          result[newKey] = value.join('; ');
        } else {
          result = { ...result, ...flattenObject(value, newKey) };
        }
      } else {
        result[newKey] = value;
      }
    }
    return result;
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelecteds = invoices.map((invoice) => invoice.customer);
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

  const handleSortChange = (event) => {
    console.log(event.target.value);
    setSortOrder(event.target.value === 'Ascending' ? 'asc' : 'desc');
  };

  const handleChangeRowsPerPage = (size) => {
    console.log(size);
    setRowsPerPage(size);
    setPage(0);
  };

  console.log(page, rowsPerPage);

  const fetchInvoices = async () => {
    const token = localStorage.getItem('token');
    const invoiceData = await getAllInvoices(currentPage, rowsPerPage, startDate, endDate, token, status, sortOrder);
    console.log(invoiceData);
    if (invoiceData && invoiceData.invoices) {
      setInvoices(invoiceData.invoices);

      const wishlistedStatus = invoiceData.invoices.reduce((acc, lead) => {
        acc[lead._id] = lead.wishlist; // Set the wishlist status for each lead by its ID
        return acc;
      }, {});

      // Set the isWishlisted state with the new object
      setIsWishlisted(wishlistedStatus);
      setTotalInvoices(invoiceData?.totalInvoices);
      console.log('invoices data total invoices check0-->', invoiceData);
    } else {
      console.error('Empty response data or unexpected format');
    }
  };

  useEffect(() => {
    fetchInvoices();
    console.log('invoices-->' + invoices);
    console.log('Total invoices-->' + totalInvoices);
  }, [currentPage, rowsPerPage, startDate, endDate, sortOrder, status]);

  const callStatuses = [
    { label: 'All Invoices', value: 'All Invoices' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Partially Paid', value: 'Partially Paid' },
    { label: 'Overdue', value: 'Overdue' },
    { label: 'Unpaid', value: 'Unpaid' }
  ];
  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case 'Paid':
        return '#d4edda';
      case 'Partially Paid':
        return '#fff3cd';
      case 'Overdue':
        return '#f8d7da';
      case 'Unpaid':
        return '#f5c6cb';
      case 'All Invoices':
      default:
        return '#dc2626';
    }
  };
  const [anchorEl, setAnchorEl] = useState(null); // For handling menu open/close

  // Open menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleCloseAllInvoiceDropdown = () => {
    setAnchorEl(null);
  };

  // Handle item selection
  const handleSelect = (value) => {
    setCallStats(value);
    handleCloseAllInvoiceDropdown();
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
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
  const sortOptions = ['Ascending', 'Descending', 'Recently Viewed', 'Recently Added'];

  const [modalOpen, setModalOpen] = useState({ open: false, data: {} });

  const openViewModal = (data) => {
    setModalOpen({ open: true, data });
    setDropdownOpen(null); // Close the dropdown when modal opens
  };

  const closeModal = () => {
    setModalOpen({ open: false, data: {} });
  };

  // Search functionality for invoices
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setFilterText(value);
    setSearchTerm(value);

    const filtered = invoices.filter((invoice) => {
      return (
        invoice?.documentDetails?.invoiceNo?.toLowerCase().includes(value) ||
        (invoice?.customer?.firstName && invoice.customer.firstName.toLowerCase().includes(value)) ||
        (invoice?.customer?.lastName && invoice.customer.lastName.toLowerCase().includes(value)) ||
        (invoice.finalTotal && invoice.finalTotal.toString().includes(value)) ||
        (invoice.status && invoice.status.toLowerCase().includes(value)) ||
        (invoice?.documentDetails?.dueDate && invoice.documentDetails.dueDate.includes(value))
      );
    });

    setFilteredData(filtered);
  };

  // Use filtered data or original data if no search term is present
  const displayData = searchTerm ? filteredData : invoices;

  const closeViewModal = () => {
    setModalOpen({ open: false, data: {} });
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
        await UndoDeleteInvoice(id, token);

        // Update leads state
        const updatedinvoices = fetchInvoices();
        // setOrders(updatedOrders);

        console.log('updated invoice after delete,', updatedinvoices);
        // Reset page if needed
        if (page > Math.ceil(updatedinvoices.length / rowsPerPage) - 1) {
          setPage(0);
        }
        toast.success('Invoice revert successfully');

        // Optional: Show success message
      } catch (error) {
        console.error('Error deleting invoice:', error);
      } finally {
        // Close the confirmation modal
        setUndoDeleteConfirmation({ open: false, id: null });
        setDropdownOpen(null);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await DeleteInvoice(id);
      setInvoices((prevQuotations) => prevQuotations.filter((invoice) => invoice._id !== id));
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportInvoice(); // Call the API service

      // Create a URL for the file and trigger the download
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;

      // Set the file name for the downloaded file
      link.setAttribute('download', 'quotations_export.xlsx'); // Update as per your file format

      // Append link and initiate download
      document.body.appendChild(link);
      link.click();

      // Clean up and remove the link element
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error exporting quotations:', error);
    }
  };
  const handlePrintPDF = async (invoice) => {
    try {
      const response = await axios.get(`${server}/api/invoice/download/${invoice}`, {
        responseType: 'blob' // Important for file downloads
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

      // Open the PDF in a new window
      const pdfWindow = window.open(url);

      // Wait for the PDF to load, then trigger print
      pdfWindow.onload = () => {
        pdfWindow.print();
      };
    } catch (error) {
      console.error('Error downloading and printing the PDF:', error);
    }
  };
  const handleDownloadPDF = async (invoice) => {
    try {
      const response = await axios.get(`${server}/api/invoice/download/${invoice}`, {
        responseType: 'blob' // Important for file downloads
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${invoice?.documentDetails?.invoiceNo}.pdf`); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the PDF:', error);
    }
  };

  return (
    <>
      <Box>
        <h1 className="text-xl font-semibold mb-4">TOTAL INVOICES: {totalInvoices}</h1>
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
                  filterText={filterText}
                  setFilterText={setFilterText}
                  handleSearchChange={handleSearch}
                  searchText="INVOICES . . . . "
                />
              </div>
              <div style={{ display: 'flex' }}>
                <button className=" mr-2 bg-white border border-gray-500 text-gray-600  py-1.5 px-2 rounded transition-colors duration-300  hover:bg-[#779E40] hover:text-white hover:border-[#779E40] flex items-center gap-2">
                  <FiDownload className="text-xl" />
                  <Typography
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 300,
                      fontSize: '17px',
                      lineHeight: '20.57px'
                    }}
                    onClick={handleExport}
                  >
                    {' '}
                    EXPORT{' '}
                  </Typography>
                </button>

                {/* <Button
                  sx={{ borderRadius: '5px' }}
                  onClick={() => navigate(`/apps/invoice/create`)}
                  className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                >
                  <AddIcon />
                  <Typography>ADD INVOICE</Typography>
                </Button> */}

                <button
                  className="bg-lime-600 text-white font-semibold font-normal-400 rounded  hover:bg-lime-700 py-1.5 px-2"
                  onClick={() => navigate(`/apps/invoice/create`)}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Inter, sans-serif', // Font4
                      fontWeight: 300, // Weight
                      fontSize: '17px', // Size
                      lineHeight: '20.57px' // Line height
                    }}
                  >
                    {' '}
                    CREATE INVOICE{' '}
                  </Typography>
                </button>
              </div>
            </div>
          }
        >
          {/* <Divider sx={{ marginBottom: '0.3rem' }} /> */}
          <div className="overflow-x-auto bg-background">
            <Box className="flex gap-2 items-center ml-1" sx={{ padding: '1rem' }}>
              {/* <Box>
                <button
                  ref={sortRef}
                  onClick={toggleSortDropdown}
                  style={{
                    border: '1px solid rgba(0,0,0,0.35)',
                    color: 'rgba(0,0,0,0.4)',
                    padding: '6px 10px',
                    boxShadow: '0px 4px 4px 0px rgba(219, 219, 219, 0.2509803922)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    position: 'relative'
                  }}
                  className="rounded"
                >
                  <Box sx={{ height: '14px', width: '14px' }}>
                    <Sort size="14" />
                  </Box>
                  <Typography sx={{ color: 'rgba(0,0,0,0.4)' }} className="font-medium-500 text-[15px] font-inter">
                    SORT
                  </Typography>
                  {isSortDropdownOpen ? (
                    <Box>
                      <ExpandLessIcon sx={{ color: 'rgba(0,0,0,0.35)', fontSize: '16px' }} />
                    </Box>
                  ) : (
                    <Box>
                      <ExpandMoreIcon sx={{ color: 'rgba(0,0,0,0.35)', fontSize: '16px' }} />
                    </Box>
                  )}
                  {isSortDropdownOpen && (
                    <Box
                      sx={{
                        position: 'absolute',
                        zIndex: 1300,
                        left: 0,
                        top: '40px',
                        backgroundColor: 'white',
                        padding: '5px',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        width: '200px'
                      }}
                    >
                      {sortOptions.map((option, index) => (
                        <Box key={index}>
                          <FormControlLabel
                            control={
                              <Radio
                                checked={sortOrder === option.toLowerCase()}
                                onChange={handleSortChange}
                                value={option.toLowerCase()}
                                name="sortOrder"
                                sx={{
                                  '& .MuiSvgIcon-root': {
                                    fontSize: '20px'
                                  }
                                }}
                              />
                            }
                            label={<span style={{ fontSize: '13px' }}>{option}</span>}
                            sx={{
                              width: '100%',
                              margin: 0,
                              padding: '1px 0',
                              '&:hover': {
                                backgroundColor: '#f5f5f4',
                                borderRadius: '5px'
                              }
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </button>
              </Box>   */}

              <Box ref={dateRef}>
                <DateButton
                  handleDateRangeChange={handleDateRangeChange}
                  toggleDateDropdown={toggleDateDropdown}
                  isDateDropdownOpen={isDateOpen}
                />
              </Box>

              <div className="w-[140px] relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="block w-full px-3 py-2 border text-gray-500 border-gray-400 bg-white rounded shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm appearance-none"
                >
                  <option value="">SORT INVOICE</option>
                  <option value="asc">ASCENDING</option>
                  <option value="desc">DESCENDING</option>
                </select>

                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  {sortOrder === '' && <FaSort className="text-blue-600" />}
                  {sortOrder === 'asc' && <FaSortUp className="text-lime-500" />}
                  {sortOrder === 'desc' && <FaSortDown className="text-red-600" />}
                </div>
              </div>

              {/* <Box>
                <Button
                  aria-controls="call-status-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                  className="font-inter"
                  variant="outlined"
                  sx={{
                    fontWeight: 500,
                    borderRadius: '5px',
                    borderColor: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(0, 0, 0, 0.35)',
                    color: 'rgba(0, 0, 0, 0.4)',
                    padding: '6px 10px',
                    boxShadow: 'rgba(219, 219, 219, 0.25) 0px 4px 4px 0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    position: 'relative',
                    '&:hover': {
                      color: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(0, 0, 0, 0.35)',
                      borderColor: 'rgba(0, 0, 0, 0.4)'
                    }
                  }}
                >
                  {callStats ? callStatuses.find((status) => status.value === callStats)?.label : callStatuses[0]?.label}
                </Button>
                <Menu
                  id="call-status-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleCloseAllInvoiceDropdown}
                  PaperProps={{
                    style: {
                      maxHeight: '200px',
                      width: '200px'
                    }
                  }}
                >
                  {callStatuses.map((status, index) => (
                    <MenuItem
                      key={index}
                      value={status.value || callStatuses[0]?.value}
                      onClick={() => handleSelect(status.value || callStatuses[0]?.value)}
                      style={{ width: '100%' }}
                    >
                      <Typography>{status.label}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box> */}

              <div className="w-[138px] relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="block w-full px-3 py-2 border text-gray-500 border-gray-400 bg-white rounded shadow-sm focus:outline-none sm:text-sm appearance-none"
                >
                  <option value="">ALL INVOICES</option>
                  <option value="Paid">PAID</option>
                  <option value="Unpaid">UNPAID</option>
                  <option value="Overdue">OVERDUE</option>
                  <option value="Partially Paid">PARTIALLY PAID</option>
                </select>

                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  {status === '' && <FaHourglassHalf className="text-red-600" />}
                  {status === 'Paid' && <FaCheckCircle className="text-green-500" />}
                  {status === 'Unpaid' && <FaTimesCircle className="text-red-500" />}
                  {status === 'Overdue' && <FaExclamationCircle className="text-orange-500" />}
                  {status === 'Partially Paid' && <FaHourglassHalf className="text-blue-500" />}
                </div>
              </div>
            </Box>

            <Box sx={{ minHeight: '60vh' }}>
              {/* <Box  sx={{
                overflow:'hidden',
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius:'10px'
              }}> */}

              <Table sx={{ textTransform: 'uppercase' }}>
                <TableHead>
                  <TableRow
                    sx={{
                      height: '55px',
                      minHeight: '55px',
                      borderColor: 'black',
                      '& .MuiTableCell-root': {
                        paddingY: '6px',
                        height: '30px',
                        minHeight: '30px',
                        marginBottom: '3rem',
                        backgroundColor: 'rgba(118, 159, 64, 0.29)',

                        color: 'black'
                      }
                      //       '&.Mui-selected': {
                      //       backgroundColor: 'green',
                      // }
                    }}
                  >
                    <TableCell padding="checkbox" className="py-6">
                      {/* <Checkbox
                        indeterminate={selected.length > 0 && selected.length < invoices?.length}
                        checked={invoices?.length > 0 && selected.length === invoices?.length}
                        onChange={(e) => handleSelectAllClick(e)}
                      /> */}
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        key={column.accessor}
                        className={`text-[14px] ${column.accessor === 'status' || column.accessor === 'action' ? 'text-center' : ''}`}
                        sx={{ whiteSpace: 'nowrap', fontFamily: 'inter' }}
                      >
                        <div className="flex items-center gap-1">
                          {column.Header}
                          <ArrangeVertical size="14" color="gray" fontWeight={'semibold'} />
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody sx={{ cursor: 'pointer' }}>
                  {/* {invoices.length > 0 &&
                    invoices.map((invoice, idx) => {
                      const isLastItem = idx === invoices.length - 1;

                      return ( */}

                  {displayData.length > 0 &&
                    displayData.map((invoice, idx) => {
                      const isLastItem = idx === displayData.length - 1;

                      return (
                        <TableRow
                          key={invoice._id}
                          selected={selected.indexOf(invoice.customer) !== -1}
                          onClick={() => {
                            if (invoice.isDeleted) return;
                            return navigate(`/apps/invoice/create?id=${invoice._id}`, { state: invoice });
                          }}
                          sx={{
                            backgroundColor: invoice.isDeleted ? '#FFB3B3' : idx % 2 === 0 ? '#DEDEDE' : '#F7F7F7',
                            '&:hover': {
                              backgroundColor: invoice.isDeleted
                                ? '#FFB3B3 !important'
                                : idx % 2 === 0
                                ? '#DEDEDE !important'
                                : '#F7F7F7 !important'
                            }
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Box onClick={(e) => handleCheckClick(e, invoice.companyName)} className="flex gap-5 items-center">
                              {/* <CustomCheckbox checked={selected.indexOf(invoice.companyName) !== -1} /> */}
                              <Box className="flex items-center  rounded-full bg-white">
                                <StarsOutlinedIcon
                                  sx={{ fontSize: '14px', color: isWishlisted[invoice._id] ? 'green' : 'gray' }}
                                  onClick={(e) => handleWishlist(e, invoice._id)}
                                />
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {invoice?.invoiceId || '-'}
                          </TableCell>
                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {invoice?.customer?.firstName && invoice?.customer?.lastName
                              ? `${invoice.customer.firstName} ${invoice.customer.lastName}`
                              : '-'}
                          </TableCell>

                          {/* //Project */}
                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {invoice.project ? invoice.project : '-'}
                          </TableCell>
                          {/* Agent */}
                          {/* DueDate */}
                          {/* Amont */}
                          {/* Paid */}
                          {/* Balance */}
                          {/* Status */}
                          {/* Action */}
                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {/* {invoice?.documentDetails?.dueDate ? new Date(invoice.documentDetails.dueDate).toLocaleDateString('en-GB') : ''}
                             */}
                            {invoice?.user?.userName ? invoice.user.userName : '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {invoice?.documentDetails?.dueDate ? invoice.documentDetails.dueDate : '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {invoice?.finalTotal ? Math.floor(invoice.finalTotal) + (invoice.finalTotal % 1 >= 0.5 ? 1 : 0) : '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {invoice.paidAmount ? Math.floor(invoice.paidAmount) + (invoice.paidAmount % 1 >= 0.5 ? 1 : 0) : '-'}
                          </TableCell>
                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {/* ${amount} */}
                            {invoice.balanceAmount ? Math.floor(invoice.balanceAmount) + (invoice.balanceAmount % 1 >= 0.5 ? 1 : 0) : '-'}
                          </TableCell>

                          <TableCell className="font-inter w-[165px] text-center text-[13px]" sx={{ fontWeight: 400 }}>
                            <Typography
                              className={`
                    text-white p-1  rounded text-center
                    ${invoice?.status === 'Paid' ? 'bg-green-600' : ''}
                    ${invoice?.status === 'Unpaid' ? 'bg-red-600' : ''}
                    ${invoice?.status === 'Overdue' ? 'bg-orange-600' : ''}
                    ${invoice?.status === 'Partially Paid' ? 'bg-yellow-500' : ''}
                    ${!invoice?.status ? 'bg-gray-400' : ''}
                  `}
                            >
                              {invoice?.status ? invoice?.status : 'No Status'}
                            </Typography>
                          </TableCell>

                          {/* Action Dropdown */}
                          <TableCell
                            className="font-inter text-center text-[13px]"
                            sx={{ fontWeight: 400 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div>
                              <button
                                onClick={(e) => toggleDropdown(e, invoice._id)}
                                className="p-1 rounded-md text-[15px] border shadow-md bg-white relative"
                              >
                                <MoreVertIcon />
                                {dropdownOpen === invoice._id && (
                                  <div
                                    className="absolute top-9 right-0 w-52 -translate-x-5 bg-white rounded-lg shadow-lg z-10"
                                    style={isLastItem ? { transform: 'translate(0px,-8px)' } : {}}
                                  >
                                    <ul className="py-3">
                                      {role === `"Admin"` && invoice.isDeleted === true && (
                                        <li
                                          className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                          onClick={(event) => handleUndoDeleteConfirmation(event, invoice._id)}
                                        >
                                          <Undo className="text-[20px] text-green-700" />
                                          <Typography className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>
                                            UNDO
                                          </Typography>
                                        </li>
                                      )}
                                      {role === `"Admin"` && invoice.isDeleted != true && (
                                        <>
                                          

                                          <li
                                            className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                            onClick={() => navigate(`/apps/invoice/create?id=${invoice._id}`, { state: invoice })}
                                          >
                                            <EditIcon className="text-[20px] text-green-700" />
                                            <Typography className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>
                                              EDIT
                                            </Typography>
                                          </li>
                                          <li
                                            onClick={() => handlePrintPDF(invoice._id)}
                                            // onClick={(e) => { e.stopPropagation(); openViewModal(invoice) }}
                                            className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                          >
                                            <PrintIcon className="text-red-700 group-hover:text-white" />
                                            PRINT PDF
                                          </li>
                                          <li
                                            onClick={() => handleDownloadPDF(invoice._id)}
                                            // onClick={(e) => { e.stopPropagation(); openViewModal(invoice) }}
                                            className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                          >
                                            <PictureAsPdfIcon className="text-red-700 group-hover:text-white" />
                                            DOWNLOAD PDF
                                          </li>
                                          <li
                                            className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                            onClick={(event) => handleDeleteConfirmation(event, invoice._id)}
                                          >
                                            <DeleteIcon className="text-[20px] text-red-600" />
                                            <Typography className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>
                                              DELETE
                                            </Typography>
                                          </li>
                                        </>
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </button>
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

          {/* Modal */}
          {modalOpen && (
            // <>
            //   {/* Overlay to dim background */}
            //   <div
            //     className="fixed inset-0 bg-black bg-opacity-50 z-40"
            //     onClick={closeModal}
            //   ></div>

            //   {/* Modal content (Right half screen) */}
            //   <div className="fixed top-0 right-0 w-full md:w-1/2 h-full bg-white p-5 rounded-l-md shadow-lg z-50">
            //     <button
            //       className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            //       onClick={closeModal}
            //     >
            //       ✖
            //     </button>
            //     <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
            //     <p>Here are the details for invoice </p>
            //     {/* Add more content as needed */}
            //   </div>
            // </>
            <QuotationPopUp
              // isOpen={viewModal.open} data={viewModal.data} onClose={closeViewModal} onDelete={handleDelete}
              //

              onDelete={handleDelete}
              isOpen={modalOpen.open}
              onClose={closeViewModal}
              data={modalOpen.data}
            />
          )}

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
            <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-[110000]">
              <div className="bg-white p-6 rounded-md">
                <p className="mb-4">Are you sure you want to delete this record?</p>
                <div className="flex justify-end">
                  <button className="bg-[#779E40] text-white px-4 py-2 rounded-md mr-4" onClick={(event) => handleConfirmDelete(event)}>
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
        </MainCard>
        <PaginationComponent
          currentPage={currentPage}
          totalCount={totalInvoices}
          handleChangePage={(page) => setCurrentPage(page)}
          rowsPerPage={rowsPerPage}
          handleRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Toaster position="top-right" reverseOrder={false} />
      </Box>
    </>
  );
};

export default InvoicesTable;
