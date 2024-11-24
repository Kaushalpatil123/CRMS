import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Checkbox,
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
  Tooltip,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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
import { DeleteLead } from 'pages/utils/leads/api';
import DateButton from '../../../components/DateRange';
import PermDeviceInformationRoundedIcon from '@mui/icons-material/PermDeviceInformationRounded';
import * as XLSX from 'xlsx';
import { Sort } from 'iconsax-react';
import { ArrangeVertical, FilterEdit } from 'iconsax-react';
import {
  AddedUserManagementWishlist,
  DeleteUser,
  getAllUsers,
  getUserPassword,
  postNewUser,
  UndoDeleteUser,
  updateUser
} from 'pages/utils/user_management/api';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const UsersTable = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const [filterText, setFilterText] = useState('');
  const [selected, setSelected] = useState([]);

  const [executive, setExecutive] = useState('');

  const [isActive, setIsActive] = useState(true);
  const [isActiveVal, setIsActiveVal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');

  const [isApplyActive, setIsApplyActive] = useState(true);
  const [applystatus, setapplyStatus] = useState('');
  const [applyexecutive, setapplyExecutive] = useState('');

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const [isExecutiveDropdownOpen, setIsExecutiveDropdownOpen] = useState(false);
  const [isAppointmentsDropdownOpen, setIsAppointmentsDropdownOpen] = useState(false);
  const [isUserstatusDropdownOpen, setIsUserstatusDropdownOpen] = useState(false);
  const [importModal, setImportModal] = useState({ open: false });
  const [Users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ImportModalOpen, setImportModalOpen] = useState(false);
  const [openEditUserModal, setopenEditUserModal] = useState(false);
  const [openAddUserModal, setopenAddUserModal] = useState(false);
  const [EditUsername, setEditUsername] = useState('');
  const [EditEmail, setEditEmail] = useState('');
  const [EditMobile, setEditMobile] = useState('');
  const [EditPassword, setEditPassword] = useState('');

  const [AddUsername, setAddUsername] = useState('');
  const [AddEmail, setAddEmail] = useState('');
  const [AddMobile, setAddMobile] = useState('');
  const [AddPassword, setAddPassword] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [role, setRole] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [fetchedPasswords, setFetchedPasswords] = useState({});
  const [loadingRow, setLoadingRow] = useState(null); // For row-specific loading
  // Sorting
  const [sortUser, setSortUser] = useState('desc');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'Name' },
      { Header: 'Email', accessor: 'Email' },
      { Header: 'Mobile', accessor: 'Mobile' },
      { Header: 'Password', accessor: 'Password' },
      { Header: 'Actions', accessor: 'Actions' }
    ],
    []
  );

  const handleopenAddUserModal = () => {
    setopenAddUserModal({
      open: true
    });
    // console.log('open add user modal');F
  };

  // const handleAddModalSubmit = async (values) => {
  //   try {
  //     const requestData = {
  //       name: AddUsername,
  //       email: AddEmail,
  //       password: AddPassword,
  //       mobile: AddMobile
  //     };
  //     console.log('Form data:', values);
  //     const token = localStorage.getItem('token');

  //     const AddUser = await postNewUser(requestData, token);
  //     fetchUsers();
  //     toast.success('User Added Successfully');
  //     setAddUsername('');
  //     setAddEmail('');
  //     setAddPassword('');
  //     setAddMobile('');
  //     handleCloseModal();
  //     // resetForm();
  //   } catch (error) {
  //     console.error('Submission failed:', error);
  //     toast.error('Failed to submit. Please try again.');
  //   } finally {
  //     // setSubmitting(false);
  //   }
  // };
  const handleAddModalSubmit = async (values) => {
    // Regular expression for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Check if email, name, mobile, or password fields are empty or invalid
    if (!AddUsername) {
      toast.error('Name is required');
      return;
    }
    if (!AddEmail) {
      toast.error('Email is required');
      return;
    }
    if (!emailRegex.test(AddEmail)) {
      toast.error('Invalid email address');
      return;
    }
    if (!AddMobile) {
      toast.error('Mobile number is required');
      return;
    }
    if (!AddPassword) {
      toast.error('Password is required');
      return;
    }
  
    try {
      const requestData = {
        name: AddUsername,
        email: AddEmail,
        password: AddPassword,
        mobile: AddMobile,
      };
      console.log('Form data:', values);
      const token = localStorage.getItem('token');
  
      const AddUser = await postNewUser(requestData, token);
      fetchUsers();
      toast.success('User Added Successfully');
      setAddUsername('');
      setAddEmail('');
      setAddPassword('');
      setAddMobile('');
      handleCloseModal();
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to submit. Please try again.');
    }
  };
  

  // Edit User
  const handleopenEditUserModal = (event, details) => {
    event.stopPropagation();
    console.log('Opening edit modal with details:', details);

    // Set the modal open state and details once on click
    setopenEditUserModal({
      open: true,
      details: { ...details }
    });
    // Set username state if available
    setEditUsername(details?.userName || '');
    setEditEmail(details?.email || '');
    setEditPassword(details?.Password);
    setEditMobile(details?.mobile || '');
  };

  const handleCloseModal = () => {
    setopenEditUserModal(false);
    setopenAddUserModal(false);
  };

  const modalValidationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    mobile: Yup.string().required('Mobile is required'),
    Password: Yup.string()
  });

  const handleEditModalSubmit = async (values) => {
    try {
      const requestData = {
        name: EditUsername,
        email: EditEmail,
        password: EditPassword,
        mobile: EditMobile
      };
      console.log('Form data:', values);
      const token = localStorage.getItem('token');
      // console.log('open edit modal save send--->',openEditUserModal?.details?._id)
      const id = openEditUserModal?.details?._id;

      const editedUser = await updateUser(requestData, token, id);
      console.log('requestData particular wala---->', editedUser);

      fetchUsers();
      toast.success('User Updated Successfully');
      handleCloseModal();
      // resetForm();
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      // setSubmitting(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!filterText) return Users;
    return Users?.filter((row) => {
      return Object?.values(row).some((value) => {
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(filterText?.toLowerCase());
      });
    });
  }, [Users, filterText]);
  const paginatedData = useMemo(() => {
    // console.log("this is filteredData in useMemo",filteredData )
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return filteredData?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredData, rowsPerPage]);

  const handleImportModalOpen = () => setImportModalOpen(true);
  const [ConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const handleOpenConfirmationModal = () => setConfirmationModalOpen(true);

  const handleCloseConfirmationModal = () => setConfirmationModalOpen(false);
  const handleClose = () => {
    setImportModalOpen(false);
  };

  const server = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();
  // const filteredUsers = useMemo(() => {
  //   if (selectedFilters.length === 0) return Users; // If no filters are selected, show all Users
  //   return Users.filter(lead => selectedFilters.includes(lead.status));
  // }, [Users, selectedFilters]);

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

  const toggleSortDropdown = () => setIsSortDropdownOpen(!isSortDropdownOpen);
  const handleSearchChange = (event) => {
    setFilterText(event.target.value);
  };

  const toggleFilterDropdown = () => setIsDropdownOpen(!isDropdownOpen);
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
    console.log('delete confirmation call hua00-->');
    event.stopPropagation();
    setDeleteConfirmation({ open: true, id });
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
        await UndoDeleteUser(id, token);

        // Update leads state
        const updatedUsers = fetchUsers();
        // setUsers(updatedUsers);

        console.log('updated User after delete,', updatedUsers);
        // Reset page if needed
        if (page > Math.ceil(updatedUsers.length / rowsPerPage) - 1) {
          setPage(0);
        }
        toast.success('User Revert successfully');

        // Optional: Show success message
      } catch (error) {
        console.error('Error deleting lead:', error);
      } finally {
        // Close the confirmation modal
        setUndoDeleteConfirmation({ open: false, id: null });
        setDropdownOpen(null);
      }
    }
  };

  const handleConfirmDelete = async (event) => {
    event.stopPropagation();
    const { id } = deleteConfirmation;

    if (id) {
      try {
        const token = localStorage.getItem('token');

        // Call DeleteLead with id and token
        await DeleteUser(id, token);

        // // Update Users state
        // const updatedUsers = Users.filter((user) => user._id !== id);
        const updatedUsers = fetchUsers();

        console.log('updated Users after delete,', updatedUsers);

        // Reset page if needed
        if (page > Math.ceil(updatedUsers.length / rowsPerPage) - 1) {
          setPage(0);
        }
        toast.success('User Deleted successfully');

        // Optional: Show success message
      } catch (error) {
        console.error('Error deleting lead:', error);
      } finally {
        // Close the confirmation modal
        setDeleteConfirmation({ open: false, id: null });
        setDropdownOpen(null);
      }
    }
  };
  const handleFileUpload = () => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.xls,.xlsx';
    inputElement.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log('Uploaded file:', file);
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

  const handleExportCSV = () => {
    if (Users.length === 0) return; // Check if there are any Users to export

    // Flatten the objects and get the headers
    const flattenedUsers = Users.map((lead) => flattenObject(lead));
    const csvHeaders = Array.from(new Set(flattenedUsers.flatMap((lead) => Object.keys(lead))));

    // Map each flattened lead object to an array of its values
    const csvRows = flattenedUsers.map((lead) => csvHeaders.map((header) => lead[header] || ''));

    const csvContent = [
      csvHeaders.join(','), // Join headers with commas
      ...csvRows.map((row) => row.join(',')) // Join each row's data with commas
    ].join('\n'); // Join each row with a newline character

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

    if (filter === 'appointments') setIsAppointmentsDropdownOpen((prev) => !prev);

    if (filter === 'Userstatus') setIsUserstatusDropdownOpen((prev) => !prev);
  };

  const handleReset = () => {
    setapplyStatus('');
    setIsApplyActive(true);
    setapplyExecutive('');
  };
  const handleChangeRowsPerPage = (size) => {
    console.log(size);
    setRowsPerPage(size);
    setPage(0);
  };

  // Function to fetch the password when the eye button is clicked
  // Function to fetch the password

  // Function to fetch the password for a specific user row
  const handlePasswordFetch = async (event, id) => {
    event.stopPropagation(); // Prevent any default row behavior

    // Toggle visibility for the specific row
    if (visiblePasswords[id]) {
      setVisiblePasswords((prevState) => ({
        ...prevState,
        [id]: false
      }));
      return; // Close the visibility
    }

    try {
      setLoadingRow(id); // Show loading for the specific row
      const token = localStorage.getItem('token');
      const userData = await getUserPassword(id, token);
      setFetchedPasswords((prevState) => ({
        ...prevState,
        [id]: userData?.Password || '*****'
      }));
      setVisiblePasswords((prevState) => ({
        ...prevState,
        [id]: true
      }));
    } catch (error) {
      console.error('Error fetching password:', error);
      toast.error('User Password Does not exist');
    } finally {
      setLoadingRow(null); // Stop loading for the specific row
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const userData = await getAllUsers(token);

    // Set the Users state to the array of Users in the response
    setUsers(userData);
    const wishlistedStatus = userData.reduce((acc, user) => {
      acc[user._id] = user.wishlist; // Set the wishlist status for each lead by its ID
      return acc;
    }, {});

    // Set the isWishlisted state with the new object
    setIsWishlisted(wishlistedStatus);
  };
  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, startDate, endDate, status, sortUser]);

  const handleWishlist = async (e, userId) => {
    e.stopPropagation();

    setIsWishlisted((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId]
    }));
    const token = localStorage.getItem('token');
    await AddedUserManagementWishlist(userId, {}, token);
  };

  return (
    <Box>
      <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 1 }}>TOTAL USERS: {Users ? Users.length : 0}</Typography>
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
                handleSearchChange={handleSearchChange}
                searchText="USER . . . ."
              />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Button
                variant="outlined"
                className="flex justify-center items-center gap-2 hover:bg-red-600 hover:text-white hover:bUser-red-600 font-semibold text-black rounded transition-colors duration-300 font-poppins"
                sx={{ bUserColor: 'rgba(0,0,0,0.35)' }}
                onClick={handleExportCSV}
              >
                <ArrowUpward />
                <Typography>EXPORT USER</Typography>
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
                    Import USER
                  </Typography>
                  <div className="flex justify-center gap-2">
                    <button
                      className="bg-red-600 rounded-sm text-white font-semibold hover:bg-red-700 hover:text-white font-poppins w-[20vw] px-4 py-3"
                      onClick={downloadExcelTemplate}
                    >
                      Download Template
                    </button>
                    <button
                      className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white font-poppins w-[20vw] px-4 py-3"
                      onClick={handleOpenConfirmationModal}
                    >
                      Upload Excel
                    </button>
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
                      <Button variant="contained" className="bg-teal-600 text-white hover:bg-teal-700" onClick={handleFileUpload}>
                        Yes
                      </Button>
                      <Button
                        variant="outlined"
                        className="bUser bUser-black text-black hover:bUser-black hover:text-black"
                        onClick={handleCloseConfirmationModal}
                      >
                        No
                      </Button>
                    </div>
                  </Box>
                </>
              </Modal>
              <Button
                sx={{ bUserRadius: '5px' }}
                onClick={() => handleopenAddUserModal()}
                // onClick={() => navigate(`/apps/add-lead`)}
                className="flex align-center rounded justify-start gap-2 bg-[#779E40] text-white  font-semibold hover:bg-red-700 hover:text-white font-poppins"
              >
                <AddIcon />
                <Typography>ADD USER</Typography>
              </Button>
            </div>
          </div>
        }
      >
        {/* <Divider sx={{ marginBottom: '0.3rem' }} /> */}
        <div className="overflow-x-auto bg-background">
          <Box sx={{ minHeight: '65vh' }}>
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
                  }}
                >
                  <TableCell padding="checkbox" className="py-6"></TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.accessor}>
                      <Box className={`flex items-center ${column.accessor === 'Actions' ? 'justify-center' : ''} gap-1`}>
                        <Typography
                          sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
                         // className={`${column.accessor === 'Actions' ? 'text-center' : ''}`}
                        >
                          {column.Header}
                        </Typography>
                        <ArrangeVertical size="14" color="gray" />
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody sx={{ cursor: 'pointer' }}>
                {console.log('paginateed data---->', paginatedData)}
                {paginatedData.length > 0 &&
                  paginatedData.map((user, idx) => {
                    const isLastItem = idx === paginatedData.length - 1;
                    return (
                      <TableRow
                        key={user._id}
                        selected={selected.indexOf(user.userName) !== -1}
                        
                        onClick={() => {
                          if(user.isDeleted) return;
                          return navigate(`/apps/users/${user._id}`, { state: { id: user._id } })}

                        }
                          
                          
                        sx={{
                          backgroundColor: user.isDeleted ? '#FFB3B3' : idx % 2 === 0 ? '#dedede' : '#f7f7f7',
                          '&:hover': {
                         
                            backgroundColor: user.isDeleted ? '#FFB3B3 !important' : idx % 2 === 0 ? '#dedede !important' : '#f7f7f7 !important'

                          }
                        }}
                      >
                        <TableCell padding="checkbox">
                          {/* <Box onClick={(e) => handleCheckClick(e, user.companyName)} className="flex gap-5 items-center"> */}
                          {/* <CustomCheckbox checked={selected.indexOf(invoice.companyName) !== -1} /> */}
                          <Box className="flex items-center  rounded-full bg-white">
                            <StarsOutlinedIcon
                              sx={{ fontSize: '14px', color: isWishlisted[user._id] ? 'green' : 'gray' }}
                              onClick={(e) => handleWishlist(e, user._id)}
                            />
                            {/* </Box> */}
                          </Box>
                        </TableCell>
                        <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                          {user?.userName || '-'}
                        </TableCell>
                        <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                          {user?.email || '-'}
                        </TableCell>
                        <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                          {user?.mobile || '-'}
                        </TableCell>
                        {/* {console.log('lead active statis---',lead.isav)} */}
                        <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                          {/* Show loading text for the specific row */}
                          {loadingRow === user._id ? 'Loading...' : visiblePasswords[user._id] ? fetchedPasswords[user._id] : '*****'}
                          <IconButton onClick={(event) => handlePasswordFetch(event, user._id)} aria-label="toggle password visibility">
                            {visiblePasswords[user._id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                          <div className="relative flex justify-center">
                            <Tooltip
                              title={role !== `"Admin"` ? 'Only Admin can perform these actions' : ''}
                              arrow // This adds an arrow to the tooltip
                              disableHoverListener={role === 'Admin'} // Disable tooltip for Admins who can perform actions
                            >
                              <button
                                onClick={(e) => toggleDropdown(e, user._id)}
                                className="p-1 rounded-md text-[15px] bUser shadow-md bg-white flex items-center justify-center"
                              >
                                <MoreVertIcon />
                              </button>
                            </Tooltip>
                            {dropdownOpen === user._id && (
                              <div
                                className="absolute top-9 right-19 w-38 -translate-x-5 bg-white rounded-lg shadow-lg z-10"
                                style={isLastItem ? { transform: 'translate(-18px,-123px)' } : {}}
                              >
                                <ul className="py-3">
                                  {role === `"Admin"` && user.isDeleted === true && (
                                    <li
                                      className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                      onClick={(event) => handleUndoDeleteConfirmation(event, user._id)}
                                    >
                                      <Undo className="text-[20px] text-green-700" />
                                      <Typography className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>
                                        Undo
                                      </Typography>
                                    </li>
                                  )}

                                  {role === `"Admin"` && user.isDeleted != true && (
                                    <>
                                      <li
                                        className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                        onClick={(event) => handleopenEditUserModal(event, user)}
                                      >
                                        <EditIcon className="text-[20px] text-green-700" />
                                        <Typography>Edit</Typography>
                                      </li>
                                      <li
                                        className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                        onClick={(event) => handleDeleteConfirmation(event, user._id)}
                                      >
                                        <DeleteIcon className="text-[20px] text-red-500" />
                                        <Typography>Delete</Typography>
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
            {/* </Box> */}
          </Box>
        </div>

        {/* Add Modal */}

        <Dialog open={openAddUserModal} onClose={handleCloseModal} PaperProps={{ style: { width: '400px', maxWidth: '90%' } }}>
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.5rem'
            }}
          >
            Add User
          </DialogTitle>
          <Formik
            initialValues={{
              name: EditUsername || '',
              email: setAddEmail || '',
              mobile: setAddMobile || '',
              Password: setAddPassword || ''
            }}
            validationSchema={modalValidationSchema}
            onSubmit={handleEditModalSubmit}
          >
            {/* {({ isSubmitting }) => ( */}
            <>
              {/* // <Form> */}
              <DialogContent>
                <Field
                  as={TextField}
                  label="Name"
                  name="name"
                  fullWidth
                  margin="normal"
                  value={AddUsername}
                  onChange={(e) => setAddUsername(e.target.value)}
                  required
                />
                {/* <ErrorMessage name="name" component="div" className="text-red-500" /> */}

                <Field
                  as={TextField}
                  type="email"
                  label="Email"
                  name="email"
                  fullWidth
                  margin="normal"
                  value={AddEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  required
                />

                <Field
                  as={TextField}
                  type="number"
                  label="Mobile"
                  name="mobile"
                  fullWidth
                  margin="normal"
                  value={AddMobile}
                  onChange={(e) => setAddMobile(e.target.value)}
                  required
                />
                {/* <ErrorMessage name="mobile" component="div" className="text-red-500" /> */}

                <Field
                  as={TextField}
                  label="Password"
                  name="Password"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setAddPassword(e.target.value)}
                  value={AddPassword}
                  required
                />
                {/* <ErrorMessage name="Password" component="div" className="text-red-500" /> */}
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'flex-start', marginLeft: '20px' }}>
                <Button className="bg-red-600 text-white hover:bg-red-800 hover:text-white" onClick={handleCloseModal} color="secondary">
                  Cancel
                </Button>
                <Button
                  className="bg-[#779E40] text-white  hover:bg-red-800 hover:text-white"
                  type="submit"
                  color="primary"
                  // disabled={isSubmitting}
                  onClick={handleAddModalSubmit}
                >
                  Submit
                </Button>
              </DialogActions>
              {/* </Form> */}
            </>
            {/* )} */}
          </Formik>
        </Dialog>

        {/* EDIT MODAL */}

        <Dialog open={openEditUserModal} onClose={handleCloseModal} PaperProps={{ style: { width: '400px', maxWidth: '90%' } }}>
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.5rem'
            }}
          >
            Edit User
          </DialogTitle>
          <Formik
            initialValues={{
              name: EditUsername || '',
              email: setEditEmail || '',
              mobile: setEditMobile || '',
              Password: setEditPassword || ''
            }}
            validationSchema={modalValidationSchema}
            onSubmit={handleEditModalSubmit}
          >
            {/* {({ isSubmitting }) => ( */}
            <>
              {/* // <Form> */}
              <DialogContent>
                {/* {console.log('edit username --->', EditUsername)} */}
                <Field
                  as={TextField}
                  label="Name"
                  name="name"
                  fullWidth
                  margin="normal"
                  value={EditUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  required
                />
                {/* <ErrorMessage name="name" component="div" className="text-red-500" /> */}

                <Field
                  as={TextField}
                  type="email"
                  label="Email"
                  name="email"
                  fullWidth
                  margin="normal"
                  value={EditEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                />

                <Field
                  as={TextField}
                  label="Mobile"
                  name="mobile"
                  fullWidth
                  margin="normal"
                  value={EditMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  required
                />
                {/* <ErrorMessage name="mobile" component="div" className="text-red-500" /> */}

                <Field
                  as={TextField}
                  label="Password"
                  name="Password"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setEditPassword(e.target.value)}
                  value={EditPassword}
                  required
                />
                {/* <ErrorMessage name="Password" component="div" className="text-red-500" /> */}
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'flex-start', marginLeft: '20px' }}>
                <Button className="bg-red-600 text-white hover:bg-red-800 hover:text-white" onClick={handleCloseModal} color="secondary">
                  Cancel
                </Button>
                <Button
                  className="bg-[#779E40] text-white  hover:bg-red-800 hover:text-white"
                  type="submit"
                  color="primary"
                  // disabled={isSubmitting}
                  onClick={handleEditModalSubmit}
                >
                  Submit
                </Button>
              </DialogActions>
              {/* </Form> */}
            </>
            {/* )} */}
          </Formik>
        </Dialog>

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
          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md">
              <p className="mb-4">Are you sure you want to delete this record?</p>
              <div className="flex justify-end">
                <button className="bg-red-500 text-white px-4 py-2 rounded-md mr-4" onClick={(event) => handleConfirmDelete(event)}>
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
        totalCount={filteredData.length}
        handleChangePage={(page) => setCurrentPage(page)}
        rowsPerPage={rowsPerPage}
        handleRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Toaster position="top-right" reverseUser={false} />
    </Box>
  );
};

export default UsersTable;
