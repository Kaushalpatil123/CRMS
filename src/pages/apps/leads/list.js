import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
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
  Typography
} from '@mui/material';
import { Checkbox } from '@mui/material';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
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
import {
  DeleteLead,
  getAllLeads,
  getAllStatus,
  postImport,
  getExportFile,
  getAllExecutives,
  postLeadsAssign,
  UndoDeleteLead,
  AddedLeadWishlist
} from 'pages/utils/leads/api';
import DateButton from '../../../components/DateRange';
import PermDeviceInformationRoundedIcon from '@mui/icons-material/PermDeviceInformationRounded';
import * as XLSX from 'xlsx';
import { Edit2, Sort, UserTick } from 'iconsax-react';
import { ArrangeVertical, FilterEdit } from 'iconsax-react';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import { stubFalse } from 'lodash';

const LeadsTable = () => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [totalLeads, setTotalLeads] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // const [hasNextPage, setHasNextPage] = useState(false);
  // const [hasPreviousPage, setHasPreviousPage] = useState(false);
  // const [totalPages, setTotalPages] = useState(0);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const [filterText, setFilterText] = useState('');
  const [selected, setSelected] = useState([]);

  const [executive, setExecutive] = useState('');

  const [isActive, setIsActive] = useState(true);
  const [isActiveVal, setIsActiveVal] = useState('Active');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isApplyActive, setIsApplyActive] = useState(null);
  const [applystatus, setapplyStatus] = useState('');
  const [applyexecutive, setapplyExecutive] = useState('');
  const [totalFilteredLeads, setTotalFilteredLeads] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allExecutives, setAllExecutives] = useState([]);

  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const [isExecutiveDropdownOpen, setIsExecutiveDropdownOpen] = useState(false);
  const [isLeadStatusDropdownOpen, setIsLeadStatusDropdownOpen] = useState(false);
  const [importModal, setImportModal] = useState({ open: false });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ImportModalOpen, setImportModalOpen] = useState(false);
  //const [modalType, setModalType] = useState('');
  const [filterToggle, setFilterToggle] = useState(false);
  const [apiStatus, setApiStatus] = useState([]);
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const dateRef = useRef(null);
  // Sorting
  const [sortOrder, setSortOrder] = useState('');
  const [AssignLeadsModal, setAssignLeadsModal] = useState(stubFalse);
  const [LeadId, setLeadId] = useState([]);
  const [role, setRole] = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]); // Track selected leads
  const [leadCount, setLeadCount] = useState(0); // To track the count of selected IDs

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    // console.log('role check ------>', storedRole);
    setRole(storedRole); // Update the state
  }, []); // The empty dependency array ensures this effect runs once on mount
  // const filteredData = useMemo(() => {
  //   if (!filterText) return leads;
  //   return leads.filter((row) => {
  //     return Object.values(row).some((value) => {
  //       if (value === null || value === undefined) return false;
  //       return value.toString().toLowerCase().includes(filterText.toLowerCase());
  //     });
  //   });
  // }, [leads, filterText]);
  // const paginatedData = useMemo(() => {
  //   // console.log("this is filteredData in useMemo",filteredData )
  //   const firstPageIndex = (currentPage - 1) * rowsPerPage;
  //   const lastPageIndex = firstPageIndex + rowsPerPage;
  //   return filteredData.slice(firstPageIndex, lastPageIndex);
  // }, [currentPage, filteredData,rowsPerPage]);

  const handleImportModalOpen = () => setImportModalOpen(true);
  const [ConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const handleOpenConfirmationModal = () => setConfirmationModalOpen(true);

  const handleCloseConfirmationModal = () => setConfirmationModalOpen(false);
  const handleClose = () => {
    setImportModalOpen(false);
  };

  const server = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();
  const filteredLeads = useMemo(() => {
    if (selectedFilters.length === 0) return leads; // If no filters are selected, show all leads
    return leads.filter((lead) => selectedFilters.includes(lead.status));
  }, [leads, selectedFilters]);

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
  // const handleIsActiveValCheckboxChange = (value) => {
  //   console.log(isActiveVal,value);
  //   if (value === "Active") {
  //     // setIsActiveVal('');
  //     // setIsActive(null); // No filtering if unchecked
  //     setIsActive(true);
  //   }
  //   if(value==="Not Active"){
  //     setIsActive(false);
  //   }
  // };
  // const handleIsActiveValCheckboxChange = (value) => {
  //   console.log(value);
  //   if (isActiveVal === value) {
  //     setIsActiveVal('');
  //   } else {
  //     setIsActiveVal(value);
  //   }
  //   if (isActiveVal === 'Active') {
  //     setIsActive(true);
  //   } else {
  //     setIsActive(false);
  //   }
  //   console.log(isActive);
  // };
  const handleIsActiveValCheckboxChange = (value) => {
    console.log(value);

    // Update the isActiveVal state directly
    if (isActiveVal === value) {
      setIsActiveVal('');
      setIsActive(false); // If unchecked, set isActive to false
    } else {
      setIsActiveVal(value);
      setIsActive(value === 'Active'); // Set isActive based on whether 'Active' is selected
    }

    console.log('isActive:', value === 'Active');
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
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null
  });

  const [UndoDeleteConfirmation, setUndoDeleteConfirmation] = useState({
    open: false,
    id: null
  });

  const handleDeleteConfirmation = (event, id) => {
    // console.log('delete confirmation call hua00-->');
    event.stopPropagation();
    setDeleteConfirmation({ open: true, id });
  };

  const handleUndoDeleteConfirmation = (event, id) => {
    // console.log('delete confirmation call hua00-->');
    event.stopPropagation();
    setUndoDeleteConfirmation({ open: true, id });
  };

  // api call for confirm delete
  const handleConfirmDelete = async (event) => {
    event.stopPropagation();
    const { id } = deleteConfirmation;

    if (id) {
      try {
        const token = localStorage.getItem('token');

        // Call DeleteLead with id and token
        await DeleteLead(id, token);

        // Update leads state
        const updatedLeads = leads.filter((lead) => lead._id !== id);
        setLeads(updatedLeads);
        // console.log('updated leads after delete,', updatedLeads);

        // Reset page if needed
        if (page > Math.ceil(updatedLeads.length / rowsPerPage) - 1) {
          setPage(0);
        }
        toast.success('Lead Deleted successfully');

        // Optional: Show success message
      } catch (error) {
        console.error('Error deleting lead:', error);
      } finally {
        // Close the confirmation modal
        setDeleteConfirmation({ open: false, id: null });
        setDropdownOpen(null);
      }
    }
    fetchLeads();
  };

  // const handleWishlist = async (e,id) => {
  //   e.stopPropagation();
  //   console.log(id)
  //   const token=localStorage.getItem('token');
  //     const res=await AddedLeadWishlist(id, {}, token);
  //     console.log(res);
  //     setIsWishlisted((prev) => !prev);
  // };
  const handleWishlist = async (e, leadId) => {
    e.stopPropagation();

    setIsWishlisted((prevState) => ({
      ...prevState,
      [leadId]: !prevState[leadId]
    }));
    const token = localStorage.getItem('token');
    await AddedLeadWishlist(leadId, {}, token);
  };

  const handleConfirmUndoDelete = async (event) => {
    event.stopPropagation();
    const { id } = UndoDeleteConfirmation;

    if (id) {
      try {
        const token = localStorage.getItem('token');

        await UndoDeleteLead(id, token);

        const updatedLeads = leads.filter((lead) => lead._id !== id);
        setLeads(updatedLeads);
        // console.log('updated leads after delete,', updatedLeads);

        if (page > Math.ceil(updatedLeads.length / rowsPerPage) - 1) {
          setPage(0);
        }
        toast.success('Lead Revert successfully');

        // Optional: Show success message
      } catch (error) {
        console.error('Error deleting lead:', error);
      } finally {
        // Close the confirmation modal
        setUndoDeleteConfirmation({ open: false, id: null });
        setDropdownOpen(null);
      }
    }
    fetchLeads();
  };

  const handleFileUpload = async () => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.xls,.xlsx';
    inputElement.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        // console.log('Uploaded file:', file);
        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem('token');

        try {
          const response = await postImport(formData, token);
          // console.log('Import response:', response);
          toast.success('Import process completed successfully!');
          fetchLeads();
        } catch (error) {
          // console.error('Error while importing-->', error.message);
          toast.error('Please try again.');
        }
        setConfirmationModalOpen(false);
        setImportModalOpen(false);
      }
    };
    inputElement.click();
  };
  const flattenObject = (obj, parentKey = '') => {
    let result = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (value && typeof value === 'object') {
        if (Array.isArray(value)) {
          // Convert arrays to a string representation
          result[newKey] = value.join('; ');
        } else {
          // Recursively flatten objects
          result = { ...result, ...flattenObject(value, newKey) };
        }
      } else {
        result[newKey] = value;
      }
    }
    return result;
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await getExportFile(token);

      // Extract filename from content-disposition or use a default
      const fileName = response.headers['content-disposition']?.split('filename=')[1]?.replace(/['"]/g, '') || 'leads.xlsx'; // Removing extra quotes if any

      // Create a URL for the file blob
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));

      // Create a temporary link element for downloading the file
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // Set the filename
      document.body.appendChild(link);
      link.click(); // Programmatically click the link to trigger the download

      // Clean up by removing the link and revoking the blob URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Cleanup the URL object
    } catch (error) {
      // console.error('Error exporting file:', error.message);
      alert('Error exporting file. Please try again.');
    }
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelecteds = leads.map((lead) => lead.companyName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleCheckClick = (e, companyName) => {
    e.stopPropagation();
    // console.log('check click--->', companyName);
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
  const downloadExcelTemplate = () => {
    const templateData = [['Company', 'Title', 'First Name', 'Last Name', 'Designation', 'Mobile']];
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'Lead_Template.xlsx');
  };

  const handleFilterClick = (e, filter) => {
    e.stopPropagation();
    if (filter === 'active') setIsSubDropdownOpen((prev) => !prev);

    if (filter === 'executive') setIsExecutiveDropdownOpen((prev) => !prev);

    if (filter === 'leadStatus') setIsLeadStatusDropdownOpen((prev) => !prev);
  };

  // setapplyStatus(status);
  // setIsApplyActive(isActive);
  // setapplyExecutive(executive);
  // setFilterToggle(!filterToggle);
  // setIsDropdownOpen(false);
  const handleReset = () => {
    setapplyStatus('');
    setStatus('');

    setIsApplyActive(null);
    // setIsActive(true);
    setIsActive(true);
    setIsActiveVal('Active');
    setapplyExecutive('');
    setExecutive('');
    setIsSubDropdownOpen(false);
    setIsExecutiveDropdownOpen(false);
    setIsLeadStatusDropdownOpen(false);

    setIsDropdownOpen(false);
    setFilterToggle(!filterToggle);
    fetchLeads();
  };
  const columns = [
    { Header: 'Company', accessor: 'companyName' },
    { Header: 'Contact', accessor: 'contact' },
    { Header: 'Source', accessor: 'source' },
    { Header: 'Since', accessor: 'since' },
    { Header: 'Agent', accessor: 'agent' },
    { Header: 'Lead Status', accessor: 'status' },
    { Header: 'Last Talk', accessor: 'lastTalk' },
    { Header: 'Next Discussion', accessor: 'nextDiscussion' },
    { Header: 'Actions', accessor: 'actions' }
  ];

  const handleChangeRowsPerPage = (size) => {
    // console.log(size);
    setRowsPerPage(size);
    setPage(0);
  };

  // console.log(page, rowsPerPage);

  const fetchLeads = async () => {
    const token = localStorage.getItem('token');
    // console.log(isActive);
    const leadData = await getAllLeads(
      currentPage,
      rowsPerPage,
      startDate,
      endDate,
      sortOrder,
      applystatus,
      isActive,
      applyexecutive,
      token
    );

    // console.log(leadData);

    // Set the leads state to the array of leads in the response
    setLeads(leadData.leads);
    const wishlistedStatus = leadData.leads.reduce((acc, lead) => {
      acc[lead._id] = lead.wishlist; // Set the wishlist status for each lead by its ID
      return acc;
    }, {});

    // Set the isWishlisted state with the new object
    setIsWishlisted(wishlistedStatus);

    // Optionally, you may want to set other state variables from the response
    setTotalLeads(leadData.totalLeads);

    //setCurrentPage(leadData.currentPage);
    // setHasNextPage(leadData.hasNextPage);
    // setHasPreviousPage(leadData.hasPreviousPage);
  };

  useEffect(() => {
    fetchLeads();
  }, [filterToggle, currentPage, rowsPerPage, startDate, endDate, sortOrder]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const all_status = async () => {
      const response = await getAllStatus(token);
      // console.log(response);
      setApiStatus(response);
    };
    all_status();
  }, []);
  useEffect(() => {
    const fetchAllExecutives = async () => {
      const token = localStorage.getItem('token');
      const response = await getAllExecutives(token);
      // console.log(response?.data);
      setAllExecutives(response?.data);
    };
    fetchAllExecutives();
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
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setFilterText(value);
    setSearchTerm(value);

    const filtered = leads.filter((lead) => {
      // console.log('this is filter order-------->', order);
      return (
        (lead?.companyName && lead.companyName.toLowerCase().includes(value)) ||
        (lead?.source && lead.source.toLowerCase().includes(value)) ||
        (lead?.executive && lead.executive.toLowerCase().includes(value)) ||
        (lead?.createdAt && lead.createdAt.includes(value)) ||
        (lead?.lastInteractions?.[0]?.date && lead?.lastInteractions?.[0]?.date.includes(value)) ||
        (lead?.contacts?.[0]?.phoneNumber && lead.contacts[0].phoneNumber.includes(value)) ||
        (lead?.nextInteraction?.date && lead.nextInteraction.date.includes(value)) ||
        (lead.status && lead.status.toLowerCase().includes(value))
      );
    });

    setFilteredData(filtered);
    setTotalLeads(searchTerm ? filteredData.length : leads.length);
  };
  const displayData = searchTerm ? filteredData : leads;

  const handleCheck = (id) => {
    // console.log('this is selected ID----->', id);

    setLeadId((prevIds) => {
      let updatedIds;
      if (prevIds.includes(id)) {
        // Remove the id if already in the array (uncheck)
        updatedIds = prevIds.filter((leadId) => leadId !== id);
      } else {
        // Add the id if not already in the array (check)
        updatedIds = [...prevIds, id];
      }

      // setLeadCount(updatedIds.length);
      console.log('Updated Lead IDs----->', updatedIds.length); // Log the updated Lead IDs
      return updatedIds;
    });

    setSelectedLeads((prevLeads) => {
      let updatedLeads;
      if (prevLeads.includes(id)) {
        // Remove the id if already in the array (uncheck)
        updatedLeads = prevLeads.filter((leadId) => leadId !== id);
      } else {
        // Add the id if not already in the array (check)
        updatedLeads = [...prevLeads, id];
      }
      setLeadCount(updatedLeads.length)

      console.log('Updated Selected Leads----->', updatedLeads); // Log the updated Selected Leads
      return updatedLeads;
    });
  };

  const handleAssignLead = async (id) => {
    setAssignLeadsModal(true);
    // console.log('lead id00-->', id);

    // Update LeadId state properly
    setLeadId((prevIds) => {
      const updatedIds = [...prevIds, id];
      console.log('Assign Lead updated IDs:', updatedIds);
      return updatedIds;
    });
  };

  const handlePostAssignLead = async () => {
    try {
      const token = localStorage.getItem('token');

      // Ensure LeadId state is used correctly
      const currentLeadIds = [...LeadId]; // Copy the current LeadId state to ensure it's not null
      console.log('Lead IDs to assign:', currentLeadIds); // Log LeadId for debugging

      if (currentLeadIds.length === 0) {
        throw new Error('No leads selected for assignment');
      }

      const requestData = {
        leadIds: currentLeadIds, // Ensure leadIds is an array
        executiveName: executive // Ensure executive state is set properly
      };

      const editedLead = await postLeadsAssign(requestData, token);

      // Update leads state
      const updatedLeads = leads.filter((lead) => !currentLeadIds.includes(lead._id)); // Filter all assigned leads
      setLeads(updatedLeads);

      console.log('Updated leads after assignment:', updatedLeads);
      setAssignLeadsModal(false);

      // Reset page if needed
      if (page > Math.ceil(updatedLeads.length / rowsPerPage) - 1) {
        setPage(0);
      }

      toast.success('Lead Assigned Successfully');
      setLeadId('');
      setLeadCount(0);
      setSelectedLeads('');
    } catch (error) {
      // console.error('Error assigning lead:', error);
      toast.error('Error Assigning Leads');
    }
  };

  return (
    <>
      <Box>
        <Typography className="text-xl font-semibold mb-4" sx={{ fontWeight: 500 }}>
          TOTAL LEADS: {totalLeads}
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
                  searchText="LEADS"
                />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Button
                  variant="outlined"
                  className="flex justify-center items-center gap-2 hover:bg-[#779E40] hover:text-white hover:border-[#779E40] font-semibold text-black rounded transition-colors duration-300 font-inter"
                  sx={{ borderColor: 'rgba(0,0,0,0.35)' }}
                  onClick={handleImportModalOpen}
                >
                  <Download />
                  <Typography>IMPORT LEADS</Typography>
                </Button>
                <Button
                  variant="outlined"
                  className="flex justify-center items-center gap-2 hover:bg-[#779E40] hover:text-white hover:border-[#779E40] font-normal-400 text-black rounded transition-colors duration-300 font-inter"
                  sx={{ borderColor: 'rgba(0,0,0,0.35)' }}
                  onClick={handleExportCSV}
                >
                  <ArrowUpward />
                  <Typography>EXPORT LEADS</Typography>
                </Button>

                <Modal open={ImportModalOpen} onClose={handleClose}>
                  <Box
                    className="bg-white p-14 rounded-lg shadow-lg"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: { xs: '90%', md: '550px' },
                      height: { md: '25vh' },
                      boxShadow: 24
                    }}
                  >
                    <IconButton
                      aria-label="close"
                      onClick={handleClose}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'gray'
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography variant="h4" component="h2" className="mb-4 flex justify-center">
                      Import Leads
                    </Typography>
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-[#779E40] rounded-md text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter w-[20vw] px-4 py-3"
                        onClick={downloadExcelTemplate}
                      >
                        Download Template
                      </button>
                      <button
                        className="bg-[#779E40] rounded-md text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter w-[20vw] px-4 py-3"
                        onClick={handleOpenConfirmationModal}
                      >
                        Upload Excel
                      </button>
                      {/* <button className='bg-red-600 px-4 py-3 rounded-md'
                    onClick={()=>handleOpenConfirmationModal("Info")}
                    >
                        <PermDeviceInformationRoundedIcon sx={{color:'white'}}/>
                    </button> */}
                    </div>
                  </Box>
                </Modal>
                <Modal open={ConfirmationModalOpen} onClose={handleCloseConfirmationModal}>
                  <>
                    <Box
                      className="bg-white p-8 rounded-lg shadow-lg"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', md: '400px' },
                        boxShadow: 24
                      }}
                    >
                      {/* {(modalType === "Info") && (
                      <IconButton
                      aria-label="close"
                      onClick={handleCloseConfirmationModal}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'gray'
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                )} */}
                      <Typography variant="h6" className="mb-4">
                        Have you ensured the following?
                      </Typography>
                      <Typography variant="body1" component="p" className="mb-2">
                        1. Column names are the same as in templates.
                      </Typography>
                      <Typography variant="body1" component="p" className="mb-2">
                        2. Compulsory fields (Company, Last Name, Mobile OR Email) must be included.
                      </Typography>
                      <Typography variant="body1" component="p" className="mb-2">
                        3. Mobile number must be 10 digits long (no 91 prefix).
                      </Typography>
                      <Typography variant="body1" component="p" className="mb-2">
                        4. No spaces in mobile or email fields.
                      </Typography>
                      <Typography variant="body1" component="p" className="mb-4">
                        5. Country, State, Executive Name match exactly with the lists.
                      </Typography>

                      <div className="flex justify-start gap-4">
                        <Button variant="contained" className="bg-[#779E40] text-white hover:bg-[#5F7E33]" onClick={handleFileUpload}>
                          Yes
                        </Button>
                        <Button
                          variant="outlined"
                          className="border border-black text-black hover:border-black hover:text-black"
                          onClick={handleCloseConfirmationModal}
                        >
                          No
                        </Button>
                      </div>
                    </Box>
                  </>
                </Modal>
                <Button
                  sx={{ borderRadius: '5px' }}
                  onClick={() => navigate(`/apps/lead/add-lead`)}
                  className="flex align-center justify-start gap-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                >
                  <AddIcon />
                  <Typography>ADD LEAD</Typography>
                </Button>
              </div>
            </div>
          }
        >
          {/* <Divider sx={{ marginBottom: '0.3rem' }} /> */}
          <div className="overflow-x-auto bg-background">
            <Box className="flex justify-between align-middle items-center ml-1" sx={{ padding: '1rem' }}>
              <div className="flex gap-2">
                <Box>
                  {/* <button
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
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <Box>
                        <FormControlLabel
                          control={
                            <Radio
                              checked={sortOrder === 'asc'}
                              onChange={handleSortChange}
                              value="Ascending"
                              name="sortOrder"
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  fontSize: '20px'
                                }
                              }}
                            />
                          }
                          label={<span style={{ fontSize: '13px' }}>Ascending</span>}
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
                      <Box>
                        <FormControlLabel
                          control={
                            <Radio
                              checked={sortOrder === 'desc'}
                              onChange={handleSortChange}
                              value="Descending"
                              name="sortOrder"
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  fontSize: '20px'
                                }
                              }}
                            />
                          }
                          label={<span style={{ fontSize: '13px' }}>Descending</span>}
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
                    </Box>
                  )}
                 
                </button> */}
                  <div className="w-[138px] relative">
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="block w-full px-3 py-2 border text-gray-500 border-gray-400 bg-white rounded shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm appearance-none"
                    >
                      <option value="">Sort Leads</option>
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>

                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      {sortOrder === '' && <FaSort className="text-blue-600" />}
                      {sortOrder === 'asc' && <FaSortUp className="text-lime-500" />}
                      {sortOrder === 'desc' && <FaSortDown className="text-red-600" />}
                    </div>
                  </div>
                </Box>
                <Box>
                  <button
                    ref={filterRef}
                    onClick={toggleFilterDropdown}
                    style={{
                      border: '1px solid rgba(0,0,0,0.35)',
                      color: 'rgba(0,0,0,0.4)',
                      padding: '6px 10px',
                      boxShadow: '0px 4px 4px 0px rgba(219, 219, 219, 0.2509803922)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      position: 'relative'
                    }}
                    className="rounded"
                  >
                    <Box sx={{ height: '14px', width: '14px' }}>
                      <FilterEdit size="14" />
                    </Box>
                    <Typography sx={{ color: 'rgba(0,0,0,0.4)' }} className="font-medium-500 text-[15px] font-inter">
                      filter
                    </Typography>

                    {isDropdownOpen && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '40px',
                          left: 0,
                          width: '400px',
                          zIndex: '1000',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                          padding: '10px',
                          maxHeight: '400px',
                          overflowY: 'auto'
                          // '::-webkit-scrollbar': { display: 'none' },
                          // msOverflowStyle: 'none',
                          // scrollbarWidth: 'none'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '5px' }}
                        >
                          <FilterEdit size="24" style={{ color: 'gray' }} />
                          <Typography sx={{ color: 'gray', fontSize: '20px', fontWeight: 500 }}>Filter</Typography>
                        </Typography>
                        <Button
                          variant="text"
                          onClick={(e) => handleFilterClick(e, 'active')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: '100%',
                            padding: '10px 15px',
                            textAlign: 'left',
                            backgroundColor: 'white',
                            color: 'black',
                            marginTop: '5px'
                          }}
                        >
                          {isSubDropdownOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                          Active Leads
                        </Button>
                        {isSubDropdownOpen && (
                          <Box
                            sx={{
                              padding: '10px 20px',
                              backgroundColor: '#f7f6fb',
                              borderRadius: '8px',
                              marginLeft: '20px',
                              marginTop: '10px',
                              maxHeight: '250px',
                              overflowY: 'auto'
                            }}
                            className="flex flex-col justify-center items-start text-black"
                          >
                            {['Active', 'Not Active'].map((item) => (
                              <Box key={item}>
                                <FormControlLabel
                                  control={
                                    <CustomCheckbox
                                      checked={isActiveVal === item}
                                      onClick={(e) => {
                                        handleIsActiveValCheckboxChange(item);
                                      }}
                                    />
                                  }
                                  label={item}
                                />
                              </Box>
                            ))}
                          </Box>
                        )}
                        <Button
                          variant="text"
                          onClick={(e) => handleFilterClick(e, 'executive')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: '100%',
                            padding: '10px 15px',
                            textAlign: 'left',
                            backgroundColor: 'white',
                            color: 'black',
                            marginTop: '5px'
                          }}
                        >
                          {isExecutiveDropdownOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                          By Executive
                        </Button>
                        {isExecutiveDropdownOpen && (
                          <Box
                            sx={{
                              padding: '10px 20px',
                              backgroundColor: '#f7f6fb',
                              borderRadius: '8px',
                              marginLeft: '20px',
                              marginTop: '10px',
                              maxHeight: '250px',
                              overflowY: 'auto'
                            }}
                            className="flex flex-col justify-center items-start text-black"
                          >
                            {allExecutives &&
                              allExecutives.map((executiveItem, index) => (
                                <Box key={index}>
                                  <FormControlLabel
                                    control={
                                      <CustomCheckbox
                                        checked={executive === executiveItem}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleExecutiveCheckboxChange(executiveItem);
                                        }}
                                      />
                                    }
                                    label={executiveItem}
                                  />
                                </Box>
                              ))}
                          </Box>
                        )}

                        <Button
                          variant="text"
                          onClick={(e) => handleFilterClick(e, 'leadStatus')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: '100%',
                            padding: '10px 15px',
                            textAlign: 'left',
                            backgroundColor: 'white',
                            color: 'black',
                            marginTop: '5px',
                            zIndex: 1 // Ensure the button is above other elements
                          }}
                        >
                          {isLeadStatusDropdownOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                          Lead Status
                        </Button>

                        {isLeadStatusDropdownOpen && (
                          <Box
                            sx={{
                              padding: '10px 20px',
                              backgroundColor: '#f7f6fb',
                              borderRadius: '8px',
                              marginLeft: '20px',
                              marginTop: '10px',
                              maxHeight: '250px',
                              overflowY: 'auto',
                              position: 'relative',
                              zIndex: 10
                              // '::-webkit-scrollbar': { display: 'none' },
                              // msOverflowStyle: 'none',
                              // scrollbarWidth: 'none'
                            }}
                            className="flex flex-col justify-start items-start text-black"
                          >
                            {apiStatus &&
                              apiStatus.map((leadStatus, index) => (
                                <Box
                                  key={leadStatus._id}
                                  sx={{
                                    paddingTop: index === 0 ? '0' : '5px'
                                  }}
                                >
                                  <FormControlLabel
                                    control={
                                      <CustomCheckbox
                                        checked={status === leadStatus.status}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleLeadCheckboxChange(leadStatus.status);
                                        }}
                                      />
                                    }
                                    label={leadStatus.status}
                                  />
                                </Box>
                              ))}
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, paddingX: '15px', gap: '2.5rem' }}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={() => {
                              handleReset();
                            }}
                          >
                            Reset
                          </Button>
                          <Button
                            variant="contained"
                            fullWidth
                            className="bg-[#779E40] hover:bg-[#5F7E33] duration-300 transition-colors"
                            onClick={(e) => {
                              setapplyStatus(status);
                              setIsApplyActive(isActive);
                              setapplyExecutive(executive);
                              setFilterToggle(!filterToggle);
                              setIsDropdownOpen(false);
                            }}
                          >
                            Filter
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </button>
                </Box>
                <Box ref={dateRef}>
                  <DateButton
                    handleDateRangeChange={handleDateRangeChange}
                    toggleDateDropdown={toggleDateDropdown}
                    isDateDropdownOpen={isDateOpen}
                    setIsDateDropdownOpen={setIsDateDropdownOpen}
                  />
                </Box>
              </div>
              <div>
                <Box>
                  {selectedLeads.length > 0 && (
                    <div className="flex gap-2">
                      <div
                        style={{
                          border: '1px solid rgba(0,0,0,0.35)',
                          color: 'rgba(0,0,0,0.4)',
                          padding: '6px 10px',
                          boxShadow: '0px 4px 4px 0px rgba(219, 219, 219, 0.2509803922)',
                          display: 'flex',
                          alignItems: 'end',
                          justifyContent: 'center',
                          gap: '5px',
                          position: 'relative'
                        }}
                        className="rounded"
                      >
                        <p>{leadCount}</p>
                      </div>
                      <button
                        onClick={() => handleAssignLead()}
                        style={{
                          border: '1px solid rgba(0,0,0,0.35)',
                          // color: 'rgba(0,0,0,0.4)',
                          padding: '6px 10px',
                          boxShadow: '0px 4px 4px 0px rgba(219, 219, 219, 0.2509803922)',
                          display: 'flex',
                          alignItems: 'end',
                          justifyContent: 'center',
                          gap: '5px',
                          position: 'relative'
                        }}
                        className="rounded"
                      >
                        <UserTick className="text-[20px] text-green-700" />
                        <Typography sx={{ fontWeight: 400 }} className="text-[15px] font-inter">
                          ASSIGN
                        </Typography>
                      </button>
                    </div>
                  )}
                </Box>
              </div>
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
                    {role === `"Indiamart"` && (
                      <TableCell className="pl-0">
                        <Box className="flex gap-1 font-inter">
                          <Typography className="" sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}></Typography>
                          <Typography></Typography>
                        </Box>
                      </TableCell>
                    )}
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
                          COMPANY
                        </Typography>
                        <Typography>
                          <ArrangeVertical size="14" color="gray" fontWeight={'semibold'} />
                        </Typography>
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
                          SOURCE
                        </Typography>
                        <Typography>
                          <ArrangeVertical size="14" color="gray" fontWeight={'semibold'} />
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="flex gap-1 font-inter">
                        <Typography className="font-inter text-[14px]" sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                          SINCE
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
                          AGENT
                        </Typography>
                        <Typography>
                          <ArrangeVertical size="14" color="gray" fontWeight={'semibold'} />
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="flex gap-1 font-inter">
                        <Typography className="font-inter text-[14px]" sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                          LEAD STATUS
                        </Typography>
                        <Typography>
                          <ArrangeVertical size="14" color="gray" fontWeight={'semibold'} />
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="flex gap-1 font-inter">
                        <Typography
                          className="font-inter text-[14px] text-center flex justify-center"
                          sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
                        >
                          LAST TASK
                        </Typography>
                        <Typography>
                          <ArrangeVertical size="14" color="gray" fontWeight={'semibold'} />
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="flex gap-1 font-inter">
                        <Typography
                          className="font-inter text-[14px] text-center flex justify-center"
                          sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
                        >
                          NEXT DISCUSSION
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
                          ACTION
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
                    displayData.map((lead, idx) => {
                      const isLastItem = idx === displayData.length - 1;
                      return (
                        <TableRow
                          key={lead._id}
                          selected={selected.indexOf(lead.companyName) !== -1}
                          onClick={() => {
                            if (lead.isDeleted) return;
                            return navigate(`/apps/lead/details/${lead._id}`);
                          }}
                          sx={{
                            backgroundColor: lead.isDeleted ? '#FFB3B3' : idx % 2 === 0 ? '#DEDEDE' : '#F7F7F7',
                            '&:hover': {
                              backgroundColor: lead.isDeleted
                                ? '#FFB3B3 !important'
                                : idx % 2 === 0
                                ? '#DEDEDE !important'
                                : '#F7F7F7 !important'
                            }
                          }}
                        >
                          {/* {role === `"Indiamart"` && (
                            // <div onClick={(e) => handleCheckClick(e, lead.companyName)} padding="checkbox" sx={{width: '1%' }}>
                            // <Box  className="flex gap-5 items-center"> */}
                            {/* <TableCell> */}
                              {/* <Box onClick={(e) => handleCheckClick(e, lead.companyName)} className="flex gap-5 items-center"> */}
                                {/* <Box className="flex items-center p-0.5 rounded-full bg-white"> */}
                                {/* <input 

                                  type="checkbox"
                                  role="checkbox"
                                  // padding="checkbox"
                                  onChange={() => handleCheck(lead._id)}
                                  sx={{fontSize:'13px'}} */}
                                  {/* // sx={{ */}
                                  {/* //   '& .MuiSvgIcon-root': { */}
                                  {/* //     fontSize: '8rem' // Adjust size here, try values like '0.75rem' or '12px' for smaller sizes */}
                                  {/* //   } */}
                                  {/* // }} */}
                                {/* // /> */}

                                {/* </Box> */}
                                {/* </Box> */}
                              {/* // </Box> */}
                            {/* // </TableCell> */}
                          {/* // )} */}


                          {role === `"Indiamart"` && (
                            <div onClick={(e) => handleCheckClick(e, lead.companyName)} className='flex justify-center align-middle' padding="checkbox" sx={{width: '1%' }}>
                            {/* <Box  className="flex gap-5 items-center"> */}
                               <input
                                className='mt-7 ml-3 text-[13px]'
                                    type="checkbox"
                                    role="checkbox"
                                    padding="checkbox"
                                    onChange={() => handleCheck(lead._id)}
                                  />
                            {/* </Box> */}
                          </div>
                          )}
                          {/* <TableCell padding="checkbox">
                            <Box onClick={(e) => handleCheckClick(e, lead.companyName)} className="flex gap-5 items-center">
                              <Box className="flex items-center p-0.5 rounded-full bg-white text-[13px]" sx={{ fontWeight: 400, width: '2%' }}>
                                <StarsOutlinedIcon
                                  sx={{ fontSize: '13px', color: isWishlisted[lead._id] ? 'green' : 'gray' }}
                                  onClick={(e) => handleWishlist(e, lead._id)}
                                />
                              </Box>
                            </Box>
                          </TableCell> */}
                          <TableCell className=" items-center font-inter text-[13px]" sx={{ fontWeight: 400, width: '2%' }}>
                            <StarsOutlinedIcon
                              sx={{ fontSize: '13px', color: isWishlisted[lead._id] ? 'green' : 'gray' }}
                              onClick={(e) => handleWishlist(e, lead._id)}
                            />
                          </TableCell>
                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {lead.companyName || '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {lead.contacts['0']?.phoneNumber || '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {lead.source || '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {lead.createdAt ? format(new Date(lead.createdAt), 'dd-MM-yy') : '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {lead.executive || '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            <Chip
                              label={lead.status !== undefined ? lead.status.toUpperCase() : 'CREATED'}
                              sx={{
                                backgroundColor: lead.statusColor || '#5d0245',
                                color: 'white',
                                padding: '0px 0.5px',
                                fontSize: '13px',
                                fontWeight: 400,
                                borderRadius: '6px',
                                fontFamily: 'inter',
                                width: '118px',
                                textTransform: 'none'
                              }}
                            />
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {lead?.lastInteractions?.[0]?.date ? lead.lastInteractions[0].date : '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {lead?.nextInteraction?.date ? lead.nextInteraction.date : '-'}
                          </TableCell>

                          <TableCell className="text-center text-[13px]" sx={{ fontWeight: 400 }} onClick={(e) => e.stopPropagation()}>
                            <div className="relative flex justify-center">
                              <button
                                onClick={(e) => toggleDropdown(e, lead._id)}
                                className="p-1 rounded-md text-[15px] border shadow-md bg-white flex items-center justify-center"
                              >
                                <MoreVertIcon />
                              </button>
                              {dropdownOpen === lead._id && (
                                <div
                                  className="absolute top-9 right-19 w-38 -translate-x-5 bg-white rounded-lg shadow-lg z-10"
                                  style={isLastItem ? { transform: 'translate(-18px,-123px)' } : {}}
                                >
                                  <ul className="py-3">
                                    {role === `"Indiamart"` && (
                                      <li
                                        className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                        onClick={() => handleAssignLead(lead._id)}
                                      >
                                        <UserTick className="text-[20px] text-green-700" />
                                        <Typography className="text-[13px]" sx={{ fontWeight: 400 }}>
                                          Assign
                                        </Typography>
                                      </li>
                                    )}

                                    {role === `"Admin"` || role === `"User"` && lead.isDeleted === true && (
                                      <li
                                        className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                        onClick={(event) => handleUndoDeleteConfirmation(event, lead._id)}
                                      >
                                        <Undo className="text-[20px] text-green-700" />
                                        <Typography className="text-[13px]" sx={{ fontWeight: 400 }}>
                                          Undo
                                        </Typography>
                                      </li>
                                    )}
                                    {role === `"Admin"` || role === `"User"` && lead.isDeleted != true && (
                                      <>
                                        <li
                                          className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                          onClick={() => navigate(`/apps/lead/details/${lead._id}`)}
                                        >
                                          <EditIcon className="text-[20px] text-green-700" />
                                          <Typography className="text-[13px]" sx={{ fontWeight: 400 }}>
                                            Edit
                                          </Typography>
                                        </li>
                                        <li
                                          className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                          onClick={(event) => handleDeleteConfirmation(event, lead._id)}
                                        >
                                          <DeleteIcon className="text-[20px] text-red-600" />
                                          <Typography className="text-[13px]" sx={{ fontWeight: 400 }}>
                                            Delete
                                          </Typography>
                                        </li>
                                      </>
                                    )}
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
            </Box>
          </div>

          {/* Modal that shows when Assign Leads */}
          <Modal
            open={AssignLeadsModal}
            onClose={() => {
              // Close the modal and reset states
              setAssignLeadsModal(false);
              // setExecutive(''); // Reset executive selection
              // setLeadId([]); // Reset selected lead IDs
              // setLeadCount(0); // Reset lead count
              // setSelectedLeads([]); // Reset selected leads array
              // setSelected([]); // Reset checkboxes
              // setLeads(async () => {
              //   const leadData = await fetchLeads();
              //   return leadData; // Re-fetch leads if necessary
              // });
            }}
            className="flex items-start justify-center min-h-screen pt-[18.9rem] px-4"
          >
            <Box className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-auto">
              <Typography variant="h6" className="text-gray-800 mb-4">
                Assign Leads
              </Typography>

              <select
                id="category"
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 h-[40px] mt-2 mb-4 transition ease-in-out duration-150"
                value={executive} // Bind the state
                onChange={(e) => setExecutive(e.target.value)} // Update executive state on change
                required
              >
                <option value="">Select Agent</option>
                {allExecutives.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <div className="flex justify-center space-x-4">
                <Button
                  // variant="contained"
                  className="px-6 py-2 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-inter"
                  color="primary"
                  // className="px-6 py-2"
                  onClick={handlePostAssignLead} // Pass the function reference
                >
                  Save
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  className="px-6 py-2"
                  onClick={() => {
                    setAssignLeadsModal(false); // Close the modal
                    // setExecutive(''); // Reset the executive selection
                    // setLeadId([]); // Reset the selected lead IDs
                    // setLeadCount(0); // Reset the lead count
                    // setSelectedLeads([]); // Reset selected leads array
                    // setSelected([]); // Reset checkboxes
                    // fetchLeads();
                    // Update leads state using fetchLeads
                    // setLeads(async (prevLeads) => {
                    //   const leadData = await fetchLeads();
                    //   return leadData;
                    // }); // Re-fetch leads if necessary
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Box>
          </Modal>

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
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md mr-4" onClick={(event) => handleConfirmDelete(event)}>
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
          totalCount={totalLeads}
          handleChangePage={(page) => setCurrentPage(page)}
          rowsPerPage={rowsPerPage}
          handleRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Toaster position="top-right" reverseOrder={false} />
      </Box>
    </>
  );
};

export default LeadsTable;
