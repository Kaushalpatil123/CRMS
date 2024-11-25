import PropTypes from 'prop-types';
import React, { useMemo, Fragment, useEffect, useState } from 'react';
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
    Typography,
    Tooltip,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Menu,
    Checkbox
} from '@mui/material';
import { ArrangeVertical } from 'iconsax-react';
import MainCard from '../../../components/MainCard';
import ScrollX from '../../../components/ScrollX';
import { renderFilterTypes } from 'utils/react-table';
import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';
import { Trash, Eye, Edit, AddCircle } from 'iconsax-react';
import EditIcon from '@mui/icons-material/Edit';
import makeData from 'data/react-table';
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
import DeleteIcon from '@mui/icons-material/Delete';
import SimpleBar from '../../../components/third-party/SimpleBar';
import { ArrowUpward, Download, EditLocation } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import GroupIcon from '@mui/icons-material/Group';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import Pagination from '../components/Pagination/Pagination';
import { useNavigate } from 'react-router';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Toaster } from 'react-hot-toast';

const server = process.env.REACT_APP_API_URL;
// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent, setgroundData, setUserData }) {
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
    const [decodedPass, setdecodedPass] = useState('');
    const [showpass, setshowpass] = useState(false);

    const handleClose = () => setOpen(false);

    const server = process.env.REACT_APP_API_URL;

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

    const filteredData = data.filter((item) => {
        const propertyValue = item.property?.toString().toLowerCase() ?? '';
        return propertyValue.includes(filterText.toLowerCase());
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

    const paginatedData = useMemo(() => {
        // console.log("this is filteredData in useMemo",filteredData )
        const firstPageIndex = (currentPage - 1) * rowsPerPage;
        const lastPageIndex = firstPageIndex + rowsPerPage;
        return filteredData?.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filteredData]);

   
    
    const handleSearchChange = (event) => {
        setFilterText(event.target.value);
    };

    const [dropdownOpen, setDropdownOpen] = useState(null);
    const toggleDropdown = (event, id) => {
      event.stopPropagation();
      setDropdownOpen(dropdownOpen === id ? null : id);
    };

    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        id: null
      });
    
      const handleDeleteConfirmation = (event, id) => {
        console.log('delete confirmation call hua00-->');
        event.stopPropagation();
        setDeleteConfirmation({ open: true, id });
      };
      const handleDelete = async (id) => {
        try {
          // Replace with your actual delete API URL
          const response = await axios.delete(`/api/order/delete-order/${id}`);
          
          if (response.status === 200) {
            // Handle success (e.g., show a success message or update the UI)
            console.log("Item deleted successfully");
          }
        } catch (error) {
          console.error("Error deleting item:", error);
          // Handle error (e.g., show an error message)
        } finally {
          // Close the delete confirmation
          setDeleteConfirmation({ open: false, id: null });
        }
      };
    return (
        <>
            <Stack spacing={3} className='overflow-x-auto bg-background'>
            <Box sx={{minHeight:'60vh'}}>
                <Table sx={{textTransform:'uppercase', marginTop:"40px"}} {...getTableProps()}>
                    <TableHead>
                        <TableRow sx={{
                    
                    height: '30px',
                    minHeight: '30px',
                    borderColor:'black',
                    '& .MuiTableCell-root': {
                    padding: '2px 6px', 
                    height: '45px',
                    minHeight: '30px', 
                    marginBottom:'3rem',
                    backgroundColor:'rgba(118, 159, 64, 0.29)',
                   //backgroundColor:'#779E40',
                    color:'black'
                    },
                }}>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.Header}
                                    className="font-poppins"
                                     //className="flex justify-center items-center gap-1 font-poppins"
                                >

<Box className="flex justify-center  items-center gap-1 font-inter">
                       <Typography className='font-inter text-center text-[14px]' sx={{fontWeight:500}}>{column.Header}</Typography>
                       <Typography><ArrangeVertical size="14" color="gray" fontWeight={'semibold'} /></Typography>
                    </Box>
                                    {/* <Box className="flex justify-center items-center gap-1 size-12 font-poppins font-semibold ">
                                   
                                    </Box> */}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    {/* Change table body theme when we get dynamic data */}
                    <TableBody>
                         {paginatedData?.map((row, index) => {
                            // {paginatedData.map((row, i) => ( */}
                            const isLastItem = index === paginatedData.length - 1;
                            return(
                           

                            <TableRow
                                key={row._id}
                                // sx={{
                                //     backgroundColor: index % 2 === 0 ? '#f0f0f0' : 'white',
                                //     '&:hover': {
                                //         backgroundColor: 'gray'
                                //     }
                                // }}
                                sx={{
                                    backgroundColor: index % 2 === 0 ? '#dedede' : '#f7f7f7'
                                  }}
                               
                            >


                                <TableCell className="text-center" style={{ width: '20%' }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                                        {/* <Avatar variant="rounded" color="secondary" size="sm" src={`${row?.picture}`} /> */}

                                        <Typography className='text-[12px]'>{row?.partyDetails?.contactPerson  || '-'}</Typography>
                                        {/* <Typography className='text-[12px]'>{ 'NA'}</Typography> */}
                                    </Stack>
                                </TableCell>

                                <TableCell className='text-center' style={{ width: '20%' }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        {/* <Typography>{ 'NA'}</Typography> */}
                                        <Typography>{row?.documentDetails?.orderNumber || '-'}</Typography>
                                    </Stack>
                                </TableCell>

                                <TableCell className='text-center' style={{ width: '10%' }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                                        <Typography className='text-[12px]'>{row?.documentDetails?.customerPoNumber || '-'}</Typography>
                                        {/* <Typography className='text-[12px]'>{ 'NA'}</Typography> */}
                                    </Stack>
                                </TableCell>

                                <TableCell className='text-center' style={{ width: '20%' }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                                        {/* <Typography className='text-[12px]'>{'NA'}</Typography> */}
                                        <Typography className='text-[12px]'>{row?.documentDetails?.dueDate|| '-'}</Typography>
                                    </Stack>
                                </TableCell>

                                <TableCell className='text-center' style={{ width: '20%' }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>

                                        {/* <Typography className='text-[12px]'>{ 'NA'}</Typography> */}
                                        <Typography className='text-[12px]'>{row?.grandTotal !== null && row?.grandTotal !== undefined ? row.grandTotal : '-'}</Typography>
                                    </Stack>
                                </TableCell>

                                <TableCell className='text-center' style={{ width: '20%' }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                                        {/* <Typography className='text-[12px]'>{new Date(row?.purchaseDate).toLocaleString() || 'NA'}</Typography> */}
                                        <Typography className='text-[12px]'>{ 'NA'}</Typography>
                                    </Stack>
                                </TableCell>

                              

                                <TableCell className="font-poppins text-center">
                        <div className="relative">
                          <button onClick={(e) => toggleDropdown(e, row._id)} className="p-1 rounded-md text-[15px] ml-3 border shadow-md bg-white">
                            <MoreVertIcon />
                          </button>
                          {dropdownOpen === row._id && (
                            <div
                              className="absolute top-9 right-19 w-38 -translate-x-5 bg-white rounded-lg shadow-lg z-10"
                              style={isLastItem ? { transform: 'translate(-18px,-123px)' } : {}}
                            
                            >
                              <ul className="py-3">
                              {/* <li
                                  className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                  // onClick={() => navigate(`/apps/lead/details/${lead._id}`)}
                                >
                                  <DownloadIcon className="text-[20px] text-blue-700" />
                                  <Typography>Download</Typography>
                                </li> */}
                              
                                <li
                                  className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                 // onClick={() => navigate(`/apps/lead/details/${lead._id}`)}
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

                      {deleteConfirmation.open && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <p className="mb-4">Are you sure you want to delete this item?</p>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
        onClick={() => handleDelete(deleteConfirmation.id)}
      >
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

                                {/* <TableCell className='text-center' style={{ width: '20%' }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                                        {/* <Typography className='text-[12px]'>{row?.status || 'NA'}</Typography> */}
                                        {/* <Typography className='text-[12px]'>{ 'NA'}</Typography>
                                    </Stack>
                                </TableCell> */} 

                                {/* <TableCell className="text-center" style={{ width: '25%' }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                                        {/* <Button
                                            className={`bg-blue-500 text-white px-4 py-2 rounded-md mr-4 ${row.status !== 'success' && 'opacity-50 cursor-not-allowed'
                                                }`}
                                            onClick={() => row.status === 'success' && window.open(row?.invoiceUrl, '_blank')}
                                            disabled={row.status !== 'success'}
                                        >
                                            View
                                        </Button> */}
                                          {/* <Button
                                            className={`bg-blue-500 text-white px-4 py-2 rounded-md mr-4 '
                                                }`}
                                          
                                        >
                                            View
                                        </Button>
                                    </Stack>
                                </TableCell> */} 
                            </TableRow>
                          )
                        }
                         )} 
                        

                        {/* Pagination */}
                        {/* <PaginationComponent page={page} setPage={setPage} filteredData={filteredData} rowsPerPage={rowsPerPage} /> */}

                        {/* <=====--------------- */}
                    </TableBody>
                </Table>
                </Box>
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
        <Toaster position="top-right" reverseOrder={false} style={{ zIndex: 200000 }} />
            
            {/* <ToastContainer
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
            /> */}
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

const SubscriptionListPage = () => {
    const theme = useTheme();
    const data = useMemo(() => makeData(200), []);

    const [userData, setSubscriptionData] = useState([]);
    const dataArray = Object.values(userData);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchpaymnethistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                // navigate("/");
            } else {
                try {
                    const response = await axios.get(`${server}/api/order/get-orders`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (response.data) {
                        setSubscriptionData(response?.data?.data?.orders);
                        console.log('api dataqweqweqewq---', response?.data?.data);
                    } else {
                        console.error('Empty response data or unexpected format');
                    }
                } catch (error) {
                    console.error('Error fetching purchaseHistory:', error);
                }
            }
        };
        fetchpaymnethistory();
    }, []);

    const columns = useMemo(
        () => [
            // { Header: 'ID', accessor: 'id', width: 100  },
            // {
            //     Header: <Checkbox  />, // Select/Deselect all rows
                
            //     accessor: 'checkbox',
                
               
            // },
            { Header: 'Contact', accessor: 'prurchase' },
            { Header: 'Order No', accessor: 'user' },
            { Header: 'Cstr P.O.', accessor: 'phoneNumber' },
            { Header: 'Due Date', accessor: 'plan' },
            // Plantype in place of subscriptionPlan
            { Header: 'Total Price', accessor: 'price' },
            // { Header: 'Purchase Date', accessor: 'date' },
            // { Header: 'Card Type', accessor: 'cardType' },
            { Header: 'Status', accessor: 'status' },
            { Header: 'Actions', accessor: 'invoice' }
        ],
        []
    );

    // pending / completed filter
    const [selectedView, setSelectedView] = useState('PENDING');

    const handleSelect = () => {
        setSelectedView((prevView) => (prevView === 'PENDING' ? 'COMPLETED' : 'PENDING'));
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


    // Today's date
    const [todayDate, setTodayDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setTodayDate(formattedDate);
    }, []);

    const handleTodayDate = (event) => {
        setTodayDate(event.target.value);
    };


    return (
        <>
        <Typography sx={{ fontSize: '1.4rem', fontWeight: "500", mb: 1 }}>ORDERS</Typography>
            <MainCard content={false} secondary={
                <>
                    <div>
                        <div className="flex justify-between items-center mb-4 px-4 gap-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="flex-1 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-orange-400"
                            // onChange={(e) => handleSearch(e.target.value)}
                            />
                            <Button
                               
                                className="bg-fuchsia-600 rounded-md text-white font-semibold hover:bg-fuchsia-700 hover:text-white font-poppins p-2.5 "
                               
                            >
                                <ArrowUpward />
                            </Button>
                            <Button
                               
                                // onClick={handleImportCSV}
                                className="bg-fuchsia-600 rounded-md text-white font-semibold hover:bg-fuchsia-700 hover:text-white font-poppins p-2.5"
                              
                            >
                                <Download />
                            </Button>
                            
                            <Button
                                // onClick={handleAddLead}
                                className="bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 hover:text-white font-poppins w-full p-2"
                            >
                                Add Lead
                            </Button>
                        </div>
                    </div>
                </>
            }
            >

                <Stack className='flex flex-row justify-between w-full p-4'>
                    <Stack>
                        <div>
                            <div className="relative inline-block text-left">
                                <div>
                                    <Button
                                        type="button"
                                        sx={{ borderRadius: '5px' }}
                                                      className="flex align-center justify-start gap-2 bg-red-600 text-white font-normal hover:bg-red-700 hover:text-white font-poppins"
                                        // className="bg-gradient-to-b from-yellow-400 via-orange-300 to-red-300 rounded-md text-gray-800 font-semibold hover:bg-blue-600 hover:text-white font-poppins p-2"
                                     
                                        id="options-menu"
                                        aria-expanded="true"
                                        aria-haspopup="true"
                                        onClick={handleSelect}
                                    >
                                        {selectedView}
                                    </Button>
                                </div>
                            </div>
                        </div>


                    </Stack>
                    <Stack className='flex flex-row gap-3'>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Button
                            variant="outlined"
                            className="flex justify-center items-center gap-2 hover:bg-red-600 hover:text-white hover:border-red-600 font-normal text-black rounded transition-colors duration-300 font-poppins"
            sx={{borderColor:'rgba(0,0,0,0.35)'}}
                                
                                // className="bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 hover:text-white font-poppins w-full p-2"
                                // startIcon={<Add />}
                                // onClick={handleAddNew}
                                onClick={() => navigate('/apps/orders/enter-order')}
                                data-modal-toggle="add-modal"
                            >
                                ENTER ORDER
                            </Button>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Button
                                variant="outlined"
                                className="flex justify-center items-center gap-2  hover:bg-red-600 hover:text-white hover:border-red-600 font-normal text-black rounded transition-colors duration-300 font-poppins"
                sx={{borderColor:'rgba(0,0,0,0.35)'}}
                                // startIcon={<Add />}
                                // onClick={handleAddNew}
                                onClick={handleEnterQuickOrder}
                                data-modal-toggle="add-modal"
                            >
                                ENTER QUICK ORDER
                            </Button>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Button
                            sx={{ borderRadius: '5px' }}
                                variant="contained"
                                className="flex align-center  justify-start gap-2 bg-red-600 text-white font-normal hover:bg-red-700 hover:text-white font-poppins"
                               // className="bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 hover:text-white font-poppins w-full p-2"
                                // startIcon={<Add />}
                                // onClick={handleAddNew}
                                onClick={handleEnterDelivery}
                                data-modal-toggle="add-modal"
                            >
                                ENTER DELIVERY
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>

                <Stack className='flex flex-row justify-start gap-3 w-full p-4'>

                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Button
                              style={{
                                border: '1px solid rgba(0,0,0,0.35)',
                                color: 'rgba(0,0,0,0.4)',
                                padding: '6px 10px',
                                boxShadow: '0px 4px 4px 0px rgba(219, 219, 219, 0.2509803922)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap:'5px',
                                position:'relative',
                                fontWeight: "500"
                              }}
                              
                            sx={{color:'rgba(0,0,0,0.4)',fontWeight:600}}
                            className='rounded'
                           // className="bg-lime-600 rounded-md text-white font-semibold hover:bg-lime-700 hover:text-white font-poppins p-2"
                           
                            // startIcon={<Add />}
                            // onClick={handleAddNew}
                            // onClick={() => navigate('/apps/create-grounds')}
                            
                            data-modal-toggle="add-modal"
                        >
                            OVERDUE 0
                        </Button>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Button
                             style={{
                                border: '1px solid rgba(0,0,0,0.35)',
                                color: 'rgba(0,0,0,0.4)',
                                padding: '6px 10px',
                                boxShadow: '0px 4px 4px 0px rgba(219, 219, 219, 0.2509803922)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap:'5px',
                                position:'relative',
                                fontWeight: "500"
                              }}
                              
                            sx={{color:'rgba(0,0,0,0.4)',fontWeight:600}}
                            className='rounded'
                           // className="bg-lime-600 rounded-md text-white font-semibold hover:bg-lime-700 hover:text-white font-poppins p-2"
                            // startIcon={<Add />}
                            // onClick={handleAddNew}
                            // onClick={() => navigate('/apps/create-grounds')}
                            data-modal-toggle="add-modal"
                        >
                            TODAY 0
                        </Button>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Button
                             style={{
                                border: '1px solid rgba(0,0,0,0.35)',
                                color: 'rgba(0,0,0,0.4)',
                                padding: '6px 10px',
                                boxShadow: '0px 4px 4px 0px rgba(219, 219, 219, 0.2509803922)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap:'5px',
                                position:'relative',
                                fontWeight: "500"
                                
                              }}
                              
                            sx={{color:'rgba(0,0,0,0.4)',fontWeight:600}}
                            className='rounded'
                           // className="bg-lime-600 rounded-md text-white font-semibold hover:bg-lime-700 hover:text-white font-poppins p-2"
                            // startIcon={<Add />}
                            // onClick={handleAddNew}
                            // onClick={() => navigate('/apps/create-grounds')}
                            data-modal-toggle="add-modal"
                        >
                            TOMMORROW 0
                        </Button>
                    </Stack>
                </Stack>


                <ScrollX>
                    <ReactTable columns={columns} data={dataArray} setUserData={setSubscriptionData} />
                    {/* <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} /> */}
                </ScrollX>
            </MainCard>

            {enterQuickOrder.open && (
                <div className="fixed top-0 left-0 w-[100vw] h-full flex items-center overflow-y-hidden justify-center bg-black bg-opacity-50 z-52">
                    <div className="bg-white p-6 rounded-sm w-[50vw] mt-12 h-[80vh] overflow-y-hidden font-poppins">
                        <div className="flex justify-between items-center py-2">
                            <h3 className="text-2xl font-semibold my-2">Enter Order</h3>
                            <Button
                                type="Button"
                                className="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-sm text-sm p-1.5 ml-auto inline-flex items-center"
                                data-modal-toggle="authentication-modal"
                                onClick={() => handleEnterQuickOrderModalClose()}
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
                                handleEnterQuickOrderModalClose();
                                e.preventDefault();
                            }}
                        >

                            <div className="flex items-center py-2 space-x-3">
                                <Button
                                  
                                    className="bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 hover:text-white font-poppins w-[30%] p-2"
                                   
                                >
                                    <SearchIcon className='mr-2' />
                                    Select Customer
                                </Button>
                                <Button
                                   
                                    className="bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 hover:text-white font-poppins w-[30%]  p-2"
                                  
                                >
                                    <AddIcon className='mr-2' />
                                    New
                                </Button>
                                <div className='flex items-center'>
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


                            <div className='flex space-x-10'>
                                <div>
                                    <label htmlFor="mobileNumber" className="text-sm font-medium text-gray-800 block mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        name="company"
                                        id="company"
                                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                                        placeholder="Enter Company Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="mobileNumber" className="text-sm font-medium text-gray-800 block mb-2">Date Range</label>
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
                                <Button
                                    variant="outlined"
                                    className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-poppins"
                                   >
                                    Service
                                </Button>
                            </div>


                            <div className='flex space-x-5'>
                                <div>
                                    <div className="relative flex space-x-2 items-center">
                                        <GroupIcon className='text-4xl text-blue-900' />
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
                                        <GroupIcon className='text-4xl text-blue-900' />
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
                                    <div className='flex items-center'>
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
                                <div className='flex space-x-5 mb-4'>
                                    <input
                                        type="text"
                                        name="item"
                                        id="item"
                                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-sm focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-[42%] p-2.5"
                                        placeholder="Item"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="quantity"
                                        id="quantity"
                                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-sm focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-[42%] p-2.5"
                                        placeholder="Quantity"
                                        required
                                    />
                                    <div className='relative w-[42%]'>
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                                        <input
                                            type="text"
                                            name="price"
                                            id="price"
                                            className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-sm focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full pl-6 p-2.5"
                                            placeholder="Price"
                                            required
                                        />
                                    </div>
                                </div>
                                <textarea
                                    className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-sm focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-full p-2.5"
                                    placeholder="Notes"
                                ></textarea>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-poppins"
                                >
                                    <AddIcon className='mr-2' />
                                    Add Another Item
                                </Button>
                            </div>

                            <div className='flex items-center -ml-2 '>
                                <Checkbox
                                    type="Button"
                                    role="checkbox"
                                    aria-checked="false"
                                    data-state="unchecked"
                                    value="on"
                                    padding="checkbox"
                                    id="shippingAddress"
                                    className='-my-8'
                                />
                                <span>Update Customer</span>
                            </div>


                            <div className='flex justify-center items-center'>
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
            )}


            {enterDelivery.open && (
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
                                <Button
                                   
                                    className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-poppins w-[30%]"
                                   
                                >
                                    <SearchIcon className='mr-2' />
                                    Select Customer
                                </Button>
                                <Button
                               
                                    className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 w-[30%] font-poppins"
                                   
                                >
                                    <AddIcon className='mr-2' />
                                    New
                                </Button>
                                <div className='flex items-center'>
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


                            <div className='flex space-x-10'>
                                <div>
                                    <label htmlFor="mobileNumber" className="text-sm font-medium text-gray-800 block mb-2">Company Name</label>
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
                                    <label htmlFor="mobileNumber" className="text-sm font-medium text-gray-800 block mb-2">Date Range</label>
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
                                <Button 
                                    className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-poppins"
                                    >
                                    Sales
                                </Button>
                                <Button
                                    className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-poppins">
                                    Service
                                </Button>
                            </div>


                            <div className='flex space-x-5'>
                                <div>
                                    <div className="relative flex space-x-2 items-center">
                                        <GroupIcon className='text-4xl text-blue-900' />
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
                                        <GroupIcon className='text-4xl text-blue-900' />
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
                                    <div className='flex items-center'>
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
                                <div className='flex space-x-5 mb-4'>
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
                                    <div className='relative w-[42%]'>
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
                                    <AddIcon className='mr-2' />
                                    Add Another Item
                                </Button>
                            </div>

                            <div>
                                <div className='flex space-x-5 mb-4'>
                                    <input
                                        type="text"
                                        name="item"
                                        id="item"
                                        className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none block w-[42%] p-2.5"
                                        placeholder="Delivery Details"
                                        required
                                    />
                                    <Button
                                       
                                        className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-poppins"
                                      
                                    >
                                        <AddIcon className='mr-2' />
                                        Add Note
                                    </Button>
                                    <Button
                                       
                                        className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white p-2 font-poppins"
                                     
                                    >
                                        <UploadFileIcon className='mr-2' />
                                        Upload Invoice
                                    </Button>
                                </div>
                            </div>


                            <div className="rounded-md border bg-card text-card-foreground shadow-sm p-4 flex-1" data-v0-t="card">
                                <h2 className="text-lg font-semibold mb-4">Update Recovery Amount</h2>
                                <div className='flex space-x-5 mb-4'>
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

                            <div className='flex items-center -ml-2 '>
                                <Checkbox
                                    type="Button"
                                    role="checkbox"
                                    aria-checked="false"
                                    data-state="unchecked"
                                    value="on"
                                    padding="checkbox"
                                    id="shippingAddress"
                                    className='-my-8'
                                />
                                <span>Update Customer</span>
                            </div>


                            <div className='flex justify-center items-center'>
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
            )}
        </>
    );
};

// Function to handle closing the delete dialog

export default SubscriptionListPage;
