import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Sort } from 'iconsax-react';

import CustomCheckbox from '../../../components/Checkbox';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {  Undo } from '@mui/icons-material';


import ContentPasteSearchRoundedIcon from '@mui/icons-material/ContentPasteSearchRounded';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Checkbox as CheckboxMUI,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
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
  PictureAsPdf as PictureAsPdfIcon,
  Print as PrintIcon
} from '@mui/icons-material';
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
import QuotationPopUp from './quotationPopUp';
import { fetchQuotations, deleteQuotation, exportQuotations, AddedLeadWishlist, DeleteInvoice, UndoDeleteInvoice } from 'pages/utils/quotations/api';
import { ArrangeVertical, FilterEdit } from 'iconsax-react';
import { FiUpload, FiDownload } from 'react-icons/fi';
import { AiOutlineFileText } from 'react-icons/ai';
import SearchBar from '../components/Searchbar';
// import Loader from 'components/newLoader';
import Pagination from '../components/Pagination';
import Loader from 'components/newLoader';
import { getListData } from 'pages/utils/quotations/api';
import DateButton from '../../../components/DateRange';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toast, Toaster } from 'react-hot-toast';
import { downloadQuotationPDF } from 'pages/utils/view/api';


export default function Component() {
  const [fetchQuotationsData, setFetchQuotationsData] = useState([]);
  const navigate = useNavigate();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [viewModal, setViewModal] = useState({ open: false, data: {} });

  const [filteredData, setFilteredData] = useState([]); // New state for filtered quotations
  const [searchTerm, setSearchTerm] = useState(''); // New state for search input

  const [filterText, setFilterText] = useState('');
  const [selected, setSelected] = useState([]);

  const [executive, setExecutive] = useState('');

  const [isActive, setIsActive] = useState(true);
  const [isActiveVal, setIsActiveVal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('Unpaid');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isApplyActive, setIsApplyActive] = useState(true);
  const [applystatus, setapplyStatus] = useState('');
  const [applyexecutive, setapplyExecutive] = useState('');

  const [isWishlist, setIsWishlist] = useState(false);

  const [page, setPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const [isExecutiveDropdownOpen, setIsExecutiveDropdownOpen] = useState(false);
  const [isAppointmentsDropdownOpen, setIsAppointmentsDropdownOpen] = useState(false);
  const [isLeadStatusDropdownOpen, setIsLeadStatusDropdownOpen] = useState(false);
  const [importModal, setImportModal] = useState({ open: false });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterToggle, setFilterToggle] = useState(false);


  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const toggleDropdown = (event, id) => {
    event.stopPropagation();
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const [selectAllWishlist, setSelectAllWishlist] = useState(false); // New state for header checkbox
  const [isWishlisted, setIsWishlisted] = useState(false);

  const dateRef = useRef(null);

  // Sorting
  const [sortOrder, setSortOrder] = useState('');

  const [role, setRole] = useState('');
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    console.log('role check ------>', storedRole);
    setRole(storedRole);
  }, []);


  

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
          const updatedInvoices = fetchLeads();
          // setOrders(updatedOrders);
  
        console.log('updated Quotation after delete,', updatedInvoices);
        if (page > Math.ceil(updatedInvoices.length / rowsPerPage) - 1) {
          setPage(0);
        }
        toast.success('Quotation deleted successfully');
      } catch (error) {
        console.error('Error deleting quotation:', error);
      } finally {
        setDeleteConfirmation({ open: false, id: null });
        setDropdownOpen(null)
      }
    }
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
        const updatedinvoices = fetchLeads();
        // setOrders(updatedOrders);

        console.log('updated order after delete,', updatedinvoices);
        // Reset page if needed
        if (page > Math.ceil(updatedinvoices.length / rowsPerPage) - 1) {
          setPage(0);
        }
        toast.success('Quotation revert successfully');

        // Optional: Show success message
      } catch (error) {
        console.error('Error deleting Quotation:', error);
      } finally {
        // Close the confirmation modal
        setUndoDeleteConfirmation({ open: false, id: null });
        setDropdownOpen(null)
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await DeleteInvoice(id);
      setFetchQuotationsData((prevQuotations) => prevQuotations.filter((invoice) => invoice._id !== id));
    } catch (error) {
      console.error('Error deleting Quotation:', error);
    }
  };


  const handleDateRangeChange = (start, end) => {
    console.log(start, end);
    setStartDate(start);
    setEndDate(end);
  };

  const fetchLeads = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const leadData = await getListData(startDate, endDate, page, pageSize, token, pageSize, status, sortOrder);
      setFetchQuotationsData(leadData?.data?.quotations);

      const wishlistedStatus = leadData?.data?.quotations.reduce((acc, quotation) => {
        acc[quotation._id] = quotation.wishlist; // Set the wishlist status for each lead by its ID
        return acc;
      }, {});
      setTotalRecords(leadData?.data.totalQuotations);

      console.log('wishlist status--->', wishlistedStatus);
      // Set the isWishlisted state with the new object
      setIsWishlisted(wishlistedStatus);
    } catch (error) {
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, pageSize, startDate, endDate, sortOrder, status]);

  const handleToggle = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const openViewModal = (data) => {
    setViewModal({ open: true, data });
    setOpenDropdownId(null);
  };

  const closeViewModal = () => {
    setViewModal({ open: false, data: {} });
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
    setIsDropdownOpen(false);
    setIsDateOpen(false);
  };



  const handleChangePage = (newPage) => {
    console.log('newPage', newPage);
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / pageSize)) {
      console.log('newPage------', newPage);
      setPage(newPage);
    }
  };

  const handleRowsPerPageChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const totalPages = Math.ceil(totalRecords / pageSize); // Calculate total pages

  const toggleDateDropdown = () => {
    setIsDateOpen(!isDateOpen);
    setIsDropdownOpen(false);
    setIsSortDropdownOpen(false);
  };

  const handleExport = async () => {
    try {
      const data = await exportQuotations(); // Call the API service

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



  const handleWishlist = async (e, leadId) => {
    e.stopPropagation();

    setIsWishlisted((prevState) => ({
      ...prevState,
      [leadId]: !prevState[leadId]
    }));
    const token = localStorage.getItem('token');
    await AddedLeadWishlist(leadId, {}, token);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setFilterText(value); // Update the filterText state
    setSearchTerm(value); // Update the searchTerm state

    const filtered = fetchQuotationsData.filter((quote) => {
      return (
        quote?.quotationNo?.toLowerCase().includes(value) ||
        (quote?.customer?.firstName && quote.customer.firstName.toLowerCase().includes(value)) ||
        (quote?.customer?.lastName && quote.customer.lastName.toLowerCase().includes(value)) ||
        (quote.grandTotal && quote.grandTotal.toString().includes(value)) ||
        (quote.status && quote.status.toLowerCase().includes(value)) ||
        (quote.quotationDate && quote.quotationDate.includes(value)) // Add any other fields you want to search
      );
    });

    setFilteredData(filtered);
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelecteds = leads.map((lead) => lead.companyName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };


  
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1); // Reset to first page
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

  // Use filtered data or original data if no search term is present
  const displayData = searchTerm ? filteredData : fetchQuotationsData;

  const handleDownloadPDF = async (quote) => {
    setLoading(true);
    document.body.style.cursor = 'wait';
    try {
      const response = await downloadQuotationPDF(quote);

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quotation_${quote.quotationNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    } finally {
      setLoading(false);
      document.body.style.cursor = 'default';
    }
  };
  const handlePrintPDF = async (quote) => {
    setLoading(true);
    document.body.style.cursor = 'wait';
    try {
      const response = await downloadQuotationPDF(quote);
      
      // Check if the response is valid
      if (!response || !response.data) throw new Error("No PDF data received");
  
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      
      // Create a new window and wait for it to load
      const pdfWindow = window.open(url);
      if (pdfWindow) {
        pdfWindow.addEventListener('load', () => {
          pdfWindow.print();
          window.URL.revokeObjectURL(url); // Cleanup the object URL after printing
        });
      } else {
        console.warn("Popup blocked, cannot open PDF");
      }
    } catch (error) {
      console.error("Error downloading and printing the PDF:", error);
    } finally {
      setLoading(false);
      document.body.style.cursor = 'default';
    }
  };

  return (
    <div className="flex  z-40">
      <main className="flex-1 font-poppins ">
        <h1 className="text-xl font-semibold mb-4">TOTAL QUOTATIONS : {totalRecords} </h1>

        <div className="border border-1 border-gray-400 bg-white shadow-lg ">
          <div className="py-4 px-4 flex items-center justify-between">
            <div className="w-[43%]">
              <SearchBar
                filterText={filterText}
                setFilterText={setFilterText}
                handleSearchChange={handleSearch}
                searchText="QUOTATIONS . . . . "
              />{' '}
            </div>

            <div className="flex items-center  ">
              <button className=" mr-2 bg-white border border-gray-500 text-gray-600  py-1 px-2 rounded transition-colors duration-300  hover:bg-[#779E40] hover:text-white hover:border-[#779E40] flex items-center gap-2">
                <FiDownload className="text-xl" />
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 250,
                    fontSize: '17px',
                    lineHeight: '20.57px'
                  }}
                  onClick={handleExport}
                >
                  {' '}
                  EXPORT {' '}
                </Typography>
              </button>

              <button
                className="bg-[#779E40] hover:bg-[#5F7E33] text-white font-semibold font-normal-400 rounded py-1 px-2"
                onClick={() => navigate(`/apps/quote/createQuote`)}
              >
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif', // Font4
                    fontWeight: 250, // Weight
                    fontSize: '17px', // Size
                    lineHeight: '20.57px' // Line height
                  }}
                >
                  {' '}
                  CREATE QUOTATION{' '}
                </Typography>
              </button>
            </div>
          </div>

          <Box className="flex gap-2 items-center " sx={{ padding: '1rem' }}>
            <Box ref={dateRef}>
              <DateButton
                handleDateRangeChange={handleDateRangeChange}
                toggleDateDropdown={toggleDateDropdown}
                isDateDropdownOpen={isDateOpen}
              />
            </Box>
            <Box className="flex gap-2 items-center ">
              <div className="w-[165px] relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="block w-full px-3 py-2 border text-gray-500 border-gray-400 bg-white rounded shadow-sm focus:outline-none sm:text-sm appearance-none"
                >
                  <option value="">ALL QUOTATIONS</option>
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

              <div className="w-[170px] relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="block w-full px-3 py-2 border text-gray-500 border-gray-400 bg-white rounded shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm appearance-none"
                >
                  <option value="">SORT QUOTATIONS</option>
                  <option value="asc">ASCENDING</option>
                  <option value="desc">DESCENDING</option>
                </select>

                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  {sortOrder === '' && <FaSort className="text-blue-600" />}
                  {sortOrder === 'asc' && <FaSortUp className="text-lime-500" />}
                  {sortOrder === 'desc' && <FaSortDown className="text-red-600" />}
                </div>
              </div>
            </Box>
          </Box>

          <div className="w-full">
            {/* Table Section */}
            <div className="bg-white min-h-screen z-50">
              <table className="table-auto w-full border-separate border-spacing-y-[1px] bg-white ">
                {/* <thead className="bg-[rgb(215,227,200)]  sticky top-0 z-10"> */}
                <thead className="bg-[rgb(215,227,200)]">
                  <tr>
                    {["", 'QUOTE No.', 'CUSTOMER', 'AMOUNT (₹)', 'ISSUED BY', 'VALID TILL', 'ISSUED ON', 'STATUS', 'ACTIONS'].map(
                      (heading, index) => (
                        // <th key={index} className={heading === "" ? "w-[70px]" : ""}>
                        <th key={index} className={heading === "" ? "w-[70px]" : ""}>
                          {/* <div className={`flex items-center ${heading === 'WISHLIST' || heading === 'STATUS' || heading === 'ACTIONS' ? 'justify-center' : 'justify-start'}`}> */}
                          <div className={`flex items-center justify-${heading === 'STATUS' || heading === 'ACTIONS' ? 'center' : 'start'}`}>
                            {/* heading === 'ISSUED ON' || heading === 'VALID TILL' || */}
                            <Typography
                              sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 650, fontSize: '14px', lineHeight: '16.94px' }}
                              className="font-inter text-center text-black py-4"
                            >
                              {heading}
                            </Typography>
                            {heading !== '' && (
                              <ArrangeVertical className='mx-1' size="14" color="gray" fontWeight="semibold" />
                            )}
                          </div>
                          {/* </th> */}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                {loading ? (
                  <tbody>
                    <tr>
                      <td colSpan="9">
                        <div className="flex justify-center items-center h-full min-h-[300px]">
                          <Loader loaderType="video" loaderSrc="/Animation - 172598733932.webm" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                  {displayData.length > 0 &&
                    displayData.map((quote, index) => {
                      const isLastItem = index === displayData.length - 1;


                     const parseDate = (dateString) => {
                        if (!dateString) return 'Invalid Date';
                        const [day, month, year] = dateString.split('-');
                        return new Date(`${year}-${month}-${day}`);
                      };

                      const formattedQuotationDate = quote.quotationDate
                        ? parseDate(quote.quotationDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric' // Display full year
                        }).replace(/\//g, '-') // Replace slashes with dashes
                        : 'Invalid Date';

                      const formattedDueDate = quote.dueDate
                        ? parseDate(quote.dueDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric' // Display full year
                        }).replace(/\//g, '-') // Replace slashes with dashes
                        : 'Invalid Date';

                      // const rowBgColor =  quote.isDeleted ? '#FFB3B3' : index % 2 === 0 ? '#dedede' : '#f7f7f7';
                      const rowBgColor = quote.isDeleted ? '#FFB3B3' : index % 2 === 0 ? '#dedede' : '#f7f7f7';

                      

                      


                      return (
                        <tr
                          key={quote._id}
                          style={{ backgroundColor: rowBgColor }} // Inline style for background color
                          className="cursor-pointer hover:bg-gray-200 mb-2" // Use Tailwind for hover effect
                          // className={`cursor-pointer ${rowBgColor}`}
                          onClick={() => {
                            if (!quote.isDeleted) {
                              navigate(`/apps/quote/editQuote`, { state: { quotationId: quote._id, quote } });
                            }
                          }}
                        >

                          <td className="font-inter w-[70px] text-center text-[13px]  ">
                            <StarsOutlinedIcon
                              sx={{ fontSize: '14px', color: isWishlisted[quote._id] ? 'green' : 'gray' }}
                              className="bg-white w-auto rounded-[50%]"
                              onClick={(e) => handleWishlist(e, quote._id)}
                            />
                          </td>
                          <td className="font-inter ">
                            {/* <StarsOutlinedIcon
                              sx={{ fontSize: '14px', color: isWishlisted[quote._id] ? 'green' : 'gray' }}
                              className="bg-white w-auto rounded-[50%]"
                              onClick={(e) => handleWishlist(e, quote._id)}
                            /> */}
                            <Typography>{quote?.quotationNo?.toUpperCase()}</Typography>
                          </td>
                          <td  className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            <Typography>{`${quote?.customer?.firstName?.toUpperCase()} ${quote?.customer?.lastName?.toUpperCase()}`}</Typography>
                          </td>
                          <td  className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            <Typography>{Math.round(quote.grandTotal)}</Typography>
                          </td>
                          <td  className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            <Typography>{quote?.contactPerson?.toUpperCase()}</Typography>
                          </td>
                          <td  className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            <Typography>{formattedDueDate}</Typography>
                          </td>
                          <td  className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            <Typography>{formattedQuotationDate}</Typography>
                          </td>

                          <td className="text-center w-[130px]">
                            <Typography
                              className={`text-white py-0.5 rounded text-center
                      ${quote.status === 'Paid' ? 'bg-green-600' : ''}
                      ${quote.status === 'Unpaid' ? 'bg-red-600' : ''}
                      ${quote.status === 'Overdue' ? 'bg-orange-600' : ''}
                      ${quote.status === 'Partially Paid' ? 'bg-yellow-500' : ''}
                      ${!quote.status ? 'bg-gray-400' : ''}
                    `}
                            >
                              {quote?.status?.toUpperCase() || 'NO STATUS'}
                            </Typography>
                          </td>
                          <td className="p-3 flex items-center justify-center">
                            <div className="relative inline-block text-left dropdown">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDropdown(e, quote._id)
                                }}
                                className="py-1.5 px-1 rounded-md border bg-white shadow-md border-gray-200"
                              >
                                {/* <FaEllipsisV /> */}
                                <MoreVertIcon />



                                {dropdownOpen === quote._id && (
                                  <div
                                    className="absolute top-9 right-0 w-52 -translate-x-5 bg-white rounded-lg shadow-lg z-10"
                                    style={isLastItem ? { transform: 'translate(-18px,-123px)' } : {}}
                                  >
                                    <ul className="py-3">
                                      {role === `"Admin"` && quote.isDeleted === true && (
                                        <li
                                          className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                          onClick={(event) => handleUndoDeleteConfirmation(event, quote._id)}
                                        >
                                          <Undo className="text-[20px] text-green-700" />
                                          <Typography className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>
                                            UNDO
                                          </Typography>
                                        </li>
                                      )}
                                      {role === `"Admin"` && quote.isDeleted != true && (
                                        <>
                                      {/* <li
                                        onClick={() => openViewModal(quote)}
                                        // onClick={(e) => { e.stopPropagation(); openViewModal(invoice) }}
                                        className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                      >
                                        <FaEye className="text-[20px] text-blue-700" />
                                        VIEW
                                      </li> */}
                                      
                                      <li
                                        className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                        onClick={() => navigate(`/apps/quote/editQuote`, { state: { quotationId: quote._id ,quote} })}
                                      >
                                        <EditIcon className="text-[20px] text-green-700" />
                                        <Typography className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>
                                          EDIT
                                        </Typography>
                                          </li>
                                          <li
                                            onClick={() => handlePrintPDF(quote._id)}
                                            // onClick={(e) => { e.stopPropagation(); openViewModal(invoice) }}
                                            className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                          >
                                            <PrintIcon className="text-red-700 group-hover:text-white" />
                                            PRINT PDF
                                          </li>
                                          <li
                                            onClick={() => handleDownloadPDF(quote._id)}
                                            // onClick={(e) => { e.stopPropagation(); openViewModal(invoice) }}
                                            className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                          >
                                            <PictureAsPdfIcon className="text-red-700 group-hover:text-white" />
                                            DOWNLOAD PDF
                                          </li>
                                      <li
                                        className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                        onClick={(event) => handleDeleteConfirmation(event, quote._id)}
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
                              {/* {openDropdownId === quote._id && (
                                <div
                                  className={`absolute w-auto p-2 bg-white rounded-md shadow-lg z-50 ${fetchQuotationsData.length - index <= 3 ? 'bottom-full mb-2' : 'top-full mt-2'
                                    } left-1/2 transform -translate-x-1/2`}
                                >
                                  <ul className="py-1">
                                    <li
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openViewModal(quote);
                                      }}
                                      className="p-2 text-gray-600 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                      <FaEye /> VIEW
                                    </li>
                                    <li
                                      onClick={() => navigate(`/apps/quote/editQuote`, { state: { quotationId: quote._id } })}
                                      className="p-2 text-green-700 flex items-center gap-2 hover:bg-green-100 cursor-pointer"
                                    >
                                      <FaEdit /> EDIT
                                    </li>
                                    <li
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(quote._id);
                                      }}
                                      className="p-2 text-red-600 flex items-center gap-2 hover:bg-red-100 cursor-pointer"
                                    >
                                      <FaTrashAlt /> DELETE
                                    </li>
                                  </ul>
                                </div>
                              )} */}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
        <Pagination
          currentPage={page}
          totalCount={totalRecords}
          handleChangePage={handleChangePage}
          rowsPerPage={pageSize}
          handleRowsPerPageChange={handleRowsPerPageChange}
          totalPages={totalPages}
        />

        {viewModal.open && (
          <QuotationPopUp isOpen={viewModal.open} data={viewModal.data} onClose={closeViewModal} onDelete={handleDelete} fetchLeads={fetchLeads} />
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


      </main>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
