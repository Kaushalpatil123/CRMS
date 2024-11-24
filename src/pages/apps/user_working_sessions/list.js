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
import CustomCheckbox from '../../../components/Checkbox'
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
    Whatsapp
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
import { getAllActivities } from 'pages/utils/user_working_sessions/api';
import DateButton from '../../../components/DateRange';
import PermDeviceInformationRoundedIcon from '@mui/icons-material/PermDeviceInformationRounded';
import * as XLSX from 'xlsx';
import { Sort } from 'iconsax-react';
import { ArrangeVertical, FilterEdit } from 'iconsax-react';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';


const LeadsTable = () => {
    const [totalLeads, setTotalLeads] = useState(0);
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
    const [isApplyActive, setIsApplyActive] = useState(true);
    const [applystatus, setapplyStatus] = useState('');
    const [applyexecutive, setapplyExecutive] = useState('');
    const [totalFilteredLeads, setTotalFilteredLeads] = useState(0);

    const [selectedFilters, setSelectedFilters] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [allExecutives, setAllExecutives] = useState([]);

    const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
    const [isExecutiveDropdownOpen, setIsExecutiveDropdownOpen] = useState(false);
    const [isAppointmentsDropdownOpen, setIsAppointmentsDropdownOpen] = useState(false);
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
    const [sortOrder, setSortOrder] = useState('desc');
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
        return leads.filter(lead => selectedFilters.includes(lead.status));
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
        console.log(value)
        if (executive === value) {
            setExecutive('');
        } else {
            setExecutive(value);
        }
    };
    const handleIsActiveValCheckboxChange = (value) => {
        console.log(value)
        if (isActiveVal === value) {
            setIsActiveVal('');
        } else {
            setIsActiveVal(value);
        }
        if (isActiveVal === "Active") {
            setIsActive(true)
        } else {
            setIsActive(false)
        }
        console.log(isActive)
    };

    const toggleSortDropdown = () => {
        setIsSortDropdownOpen(!isSortDropdownOpen);
        setIsDropdownOpen(false);
        setIsDateOpen(false);
    }
    const handleSearchChange = (event) => {
        setFilterText(event.target.value);
    };

    const toggleFilterDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        setIsSortDropdownOpen(false);
        setIsDateOpen(false);
    }
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
    }
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        id: null
    });

    const handleDeleteConfirmation = (event, id) => {
        console.log('delete confirmation call hua00-->');
        event.stopPropagation();
        setDeleteConfirmation({ open: true, id });
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
        console.log(event.target.value)
        setSortOrder(event.target.value === 'Ascending' ? 'asc' : 'desc');

    };
    const downloadExcelTemplate = () => {
        const templateData = [
            ['Company', 'Title', 'First Name', 'Last Name', 'Designation', 'Mobile'],
        ];
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

        setIsApplyActive(true);
        setIsActive(true);

        setIsActiveVal('');
        setapplyExecutive('');
        setExecutive('');

        setIsDropdownOpen(false);
        setFilterToggle(!filterToggle);
        // fetchLeads();

    };

    const handleChangeRowsPerPage = (size) => {

        console.log(size)
        setRowsPerPage(size);
        setPage(0);
    };

    console.log(page, rowsPerPage)
    // const getStatusColor = (status) => {
    //   switch (status) {
    //     case 'Closed':
    //       return 'rgba(92, 184, 92, 1)';
    //     case 'Not Contacted':
    //       return 'rgba(103, 109, 255, 1)';
    //     case 'Contacted':
    //         return 'rgba(253, 167, 0, 1)';
    //     default:
    //       return '#5d0245';
    //   }
    // };

    const fetchLeads = async () => {
        const token = localStorage.getItem('token');
        const activitiesData = await getAllActivities(token);
        console.log(activitiesData);

        // Set the leads state to the array of leads in the response
        setLeads(activitiesData.userActivities);

    };
    useEffect(() => {
        fetchLeads();
    }, [filterToggle, currentPage, rowsPerPage, startDate, endDate, sortOrder]);




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



    // Formate date
    function formatDate(timestamp) {
        const date = new Date(timestamp);

        const options = {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };

        const formattedDate = date.toLocaleString('en-US', options);
        return formattedDate.replace(',', '');
    }

    return (
        <>
            <Box>
                <Typography className='text-[17px] font-inter mb-1' sx={{ fontWeight: 500 }}>TOTAL Activities: {totalLeads}</Typography>
                <MainCard
                    content={false}
                    secondary={
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <div style={{ width: '500px' }}>
                                <SearchBar sx={{ width: '100%' }} filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} searchText='USER WORKING SESSIONS' />
                            </div>

                        </div>
                    }
                >
                    {/* <Divider sx={{ marginBottom: '0.3rem' }} /> */}
                    <div className="overflow-x-auto bg-background">
                        <Box sx={{ minHeight: '60vh' }}>
                            <Table sx={{ textTransform: 'uppercase' }} >
                                <TableHead>
                                    <TableRow sx={{

                                        height: '30px',
                                        minHeight: '30px',
                                        borderColor: 'black',
                                        '& .MuiTableCell-root': {
                                            padding: '2px 6px',
                                            height: '30px',
                                            minHeight: '30px',
                                            marginBottom: '3rem',
                                            backgroundColor: 'rgba(118, 159, 64, 0.29)',
                                            //backgroundColor:'#779E40',
                                            color: 'black'
                                        },
                                        //       '&.Mui-selected': {
                                        //       backgroundColor: '#779E40',   
                                        // }

                                    }}>
                                        <TableCell>
                                            <Box className="flex justify-center items-center gap-1 font-inter">
                                                <Typography className='font-inter text-center text-[14px]' sx={{ fontWeight: 500 }}>User Name</Typography>
                                                <Typography><ArrangeVertical size="14" color="gray" fontWeight={'semibold'} /></Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box className="flex justify-center items-center gap-1 font-inter">
                                                <Typography className='font-inter text-center text-[14px]' sx={{ fontWeight: 500 }}>last Login Time</Typography>
                                                <Typography><ArrangeVertical size="14" color="gray" fontWeight={'semibold'} /></Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box className="flex justify-center items-center gap-1 font-inter">
                                                <Typography className='font-inter text-center text-[14px]' sx={{ fontWeight: 500 }}>last Logout Time</Typography>
                                                <Typography><ArrangeVertical size="14" color="gray" fontWeight={'semibold'} /></Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box className="flex justify-center items-center gap-1 font-inter">
                                                <Typography className='font-inter text-center text-[14px]' sx={{ fontWeight: 500 }}>total Work Time</Typography>
                                                <Typography><ArrangeVertical size="14" color="gray" fontWeight={'semibold'} /></Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box className="flex justify-center items-center gap-1 font-inter">
                                                <Typography className='font-inter text-center text-[14px]' sx={{ fontWeight: 500 }}>total Break Time</Typography>
                                                <Typography><ArrangeVertical size="14" color="gray" fontWeight={'semibold'} /></Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box className="flex justify-center items-center gap-1 font-inter">
                                                <Typography className='font-inter text-center text-[14px]' sx={{ fontWeight: 500 }}>last Session Work Time</Typography>
                                                <Typography><ArrangeVertical size="14" color="gray" fontWeight={'semibold'} /></Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box className="flex justify-center items-center gap-1 font-inter">
                                                <Typography className='font-inter text-center text-[14px]' sx={{ fontWeight: 500 }}>last Session Break Time</Typography>
                                                <Typography><ArrangeVertical size="14" color="gray" fontWeight={'semibold'} /></Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box className="flex justify-center items-center gap-1 font-inter">
                                                <Typography className='font-inter text-center text-[14px]' sx={{ fontWeight: 500 }}>last Session Login Time</Typography>
                                                <Typography><ArrangeVertical size="14" color="gray" fontWeight={'semibold'} /></Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box className="flex justify-center items-center gap-1 font-inter">
                                                <Typography className='font-inter text-center text-[14px]' sx={{ fontWeight: 500 }}>last Session Logout Time</Typography>
                                                <Typography><ArrangeVertical size="14" color="gray" fontWeight={'semibold'} /></Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody sx={{ cursor: 'pointer' }}>
                                    {leads.length > 0 &&
                                        leads.map((lead, idx) => {
                                            const isLastItem = idx === leads.length - 1;
                                            return (<TableRow

                                                key={leads._id}
                                                selected={selected.indexOf(lead.companyName) !== -1}
                                                sx={{
                                                    backgroundColor: idx % 2 === 0 ? '#dedede' : '#f7f7f7'
                                                }}

                                            >
                                                <TableCell className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>{lead?.userName ? lead?.userName : "NA"}</TableCell>
                                                <TableCell className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>{lead?.lastLoginTime ? formatDate(lead?.lastLoginTime) : "NA"}</TableCell>
                                                <TableCell className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>{lead?.lastLogoutTime ? formatDate(lead?.lastLogoutTime) : "NA"}</TableCell>
                                                <TableCell className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>{lead?.totalWorkTime} Min</TableCell>
                                                <TableCell className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>{lead?.totalBreakTime} Min</TableCell>
                                                <TableCell className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>{lead?.lastSessionWorkTime} Min</TableCell>
                                                <TableCell className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>{lead?.lastSessionBreakTime} Min</TableCell>
                                                <TableCell className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>{lead?.lastSessionLoginTime ? formatDate(lead?.lastSessionLoginTime) : "NA"}</TableCell>
                                                <TableCell className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>{lead?.lastSessionLogoutTime ? formatDate(lead?.lastSessionLogoutTime) : "NA"}</TableCell>


                                            </TableRow>)
                                        })}
                                </TableBody>
                            </Table>
                            {/* </Box> */}
                        </Box>
                    </div>

                </MainCard>
                <PaginationComponent

                    currentPage={currentPage}
                    totalCount={totalLeads}

                    handleChangePage={(page) => setCurrentPage(page)}
                    rowsPerPage={rowsPerPage}
                    handleRowsPerPageChange={handleChangeRowsPerPage}
                />

                <Toaster position="bottom-center" reverseOrder={false} />
            </Box>

        </>
    );
};

export default LeadsTable;
