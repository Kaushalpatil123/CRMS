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
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import Checkbox from '../../../components/Checkbox';
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
import { DeleteLead, getAllLeads, getAllStatus } from 'pages/utils/leads/api';
import DateButton from '../../../components/DateRange';
import PermDeviceInformationRoundedIcon from '@mui/icons-material/PermDeviceInformationRounded';
import * as XLSX from 'xlsx';
import { Sort } from 'iconsax-react';
import { ArrangeVertical, FilterEdit } from 'iconsax-react';
import { AddedProductWishlist, DeleteProducts, fetchAllProducts, fetchAllProductsAdmin, UndoDeleteProduct } from 'pages/utils/products/api';

const ProductsTable = () => {
  const [totalProducts, settotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [filterText, setFilterText] = useState('');
  const [selected, setSelected] = useState([]);

  const [executive, setExecutive] = useState('');

  const [isActive, setIsActive] = useState(true);
  const [isActiveVal, setIsActiveVal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [products, setProducts] = useState([]);

  const [ImportModalOpen, setImportModalOpen] = useState(false);
  //const [modalType, setModalType] = useState('');
  const [filterToggle, setFilterToggle] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [apiStatus, setApiStatus] = useState([]);
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const dateRef = useRef(null);
  // Sorting
  const [sortOrder, setSortOrder] = useState('desc');
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'Name' },
      { Header: 'HSN', accessor: 'HSN' },
      { Header: 'Code', accessor: 'Code' },
      { Header: 'Category', accessor: 'Category' },
      { Header: 'Actual Price', accessor: 'Actual Price' },
      { Header: 'Selling Price', accessor: 'Selling Price' },
      { Header: 'Created At', accessor: 'paidAmount' },
      { Header: 'Actions', accessor: 'actions' }
    ],
    []
  );
  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    // console.log(isActive);
    const prodData = await fetchAllProductsAdmin(
      currentPage,
      rowsPerPage,
      startDate,
      endDate,
      token
    );

    setProducts(prodData.products);
    // const wishlistedStatus = prodData.products.reduce((acc, prod) => {
    //   acc[prod._id] = prod.wishlist; // Set the wishlist status for each lead by its ID
    //   return acc;
    // }, {});

    // Set the isWishlisted state with the new object
   // setIsWishlisted(wishlistedStatus);

    // Optionally, you may want to set other state variables from the response
    settotalProducts(prodData.totalProducts);

    //setCurrentPage(leadData.currentPage);
    // setHasNextPage(leadData.hasNextPage);
    // setHasPreviousPage(leadData.hasPreviousPage);
  };

  useEffect(() => {
    fetchProducts();
  }, [filterToggle, currentPage, rowsPerPage, startDate, endDate]);
  // const filteredData = useMemo(() => {
  //   if (!filterText) return products;
  //   return products?.filter((row) => {
  //     return Object.values(row).some((value) => {
  //       if (value === null || value === undefined) return false;
  //       return value.toString().toLowerCase().includes(filterText.toLowerCase());
  //     });
  //   });
  // }, [products, filterText]);
  // const paginatedData = useMemo(() => {
  //   // console.log("this is filteredData in useMemo",filteredData )
  //   const firstPageIndex = (currentPage - 1) * rowsPerPage;
  //   const lastPageIndex = firstPageIndex + rowsPerPage;
  //   return filteredData?.slice(firstPageIndex, lastPageIndex);
  // }, [currentPage, filteredData, rowsPerPage]);

  const [ConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const handleCloseConfirmationModal = () => setConfirmationModalOpen(false);
  const handleClose = () => {
    setImportModalOpen(false);
  };

  const server = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();
  const filteredLeads = useMemo(() => {
    if (selectedFilters.length === 0) return products; // If no filters are selected, show all leads
    return products.filter((product) => selectedFilters.includes(product?.status));
  }, [products, selectedFilters]);

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
    setIsDropdownOpen(false);
    setIsDateOpen(false);
  };
  const handleSearchChange = (event) => {
    setFilterText(event.target.value);
  };
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setFilterText(value);
    setSearchTerm(value);

    const filtered = products.filter((product) => {
  
      return (
         (product?.itemname && product.itemname.toLowerCase().includes(value)) || 
         (product?.hsn && product.hsn.toLowerCase().includes(value)) || 
         (product?.code && product.code.toLowerCase().includes(value)) || 
         (product?.category && product.category.toLowerCase().includes(value)) || 
         (product?.actualprice && product.actualprice.toLowerCase().includes(value)) || 
         (product?.sellingprice && product.sellingprice.toLowerCase().includes(value)) || 
         (product?.createdAt && product.createdAt.includes(value))
      );
    });

    setFilteredData(filtered);
   // settotalProducts(searchTerm ? filteredData.length : products.length);
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
    // console.log(start, end);
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
        await UndoDeleteProduct(id, token);

        // Update leads state
        const updatedUsers = fetchProducts();
        // setUsers(updatedUsers);

        // console.log('updated User after delete,', updatedUsers);
        // Reset page if needed
        if (page > Math.ceil(updatedUsers.length / rowsPerPage) - 1) {
          setPage(0);
        }
        toast.success('Product Revert successfully');

        // Optional: Show success message
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        // Close the confirmation modal
        setUndoDeleteConfirmation({ open: false, id: null });
      }
    }
  };

  const handleConfirmDelete = async (event) => {
    event.stopPropagation();
    const { id } = deleteConfirmation;

    if (id) {
      try {
        const token = localStorage.getItem('token');

        // Call DeleteProduct with id and token
        await DeleteProducts(id, token);

        // Update products state
        // const updatedProducts = products?.filter((product) => product?._id !== id);
        const updatedProducts = fetchProducts();
        // setProducts(updatedProducts);
        // console.log('updated products after delete,', updatedProducts);

        // Reset page if needed
        if (page > Math.ceil(updatedProducts?.length / rowsPerPage) - 1) {
          setPage(0);
        }
        toast.success('Product Deleted successfully');

        // Optional: Show success message
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        // Close the confirmation modal
        setDeleteConfirmation({ open: false, id: null });
      }
    }
  };

  const handleWishlist = async (e, productId) => {
    e.stopPropagation();

    setIsWishlisted((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId]
    }));
    const token = localStorage.getItem('token');
    await AddedProductWishlist(productId, {}, token);
  };

  const handleFileUpload = () => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.xls,.xlsx';
    inputElement.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // console.log('Uploaded file:', file);
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
    if (products?.length === 0) return; // Check if there are any products to export
    const flattenedProducts = products.map((product) => flattenObject(product));
    const csvHeaders = Array.from(new Set(flattenedProducts.flatMap((product) => Object.keys(product))));

    // Map each flattened products object to an array of its values
    const csvRows = flattenedProducts.map((product) => csvHeaders.map((header) => product[header] || ''));

    const csvContent = [
      csvHeaders.join(','), // Join headers with commas
      ...csvRows.map((row) => row.join(',')) // Join each row's data with commas
    ].join('\n'); // Join each row with a newline character

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'products.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSortChange = (event) => {
    console.log(event.target.value);
    setSortOrder(event.target.value === 'Ascending' ? 'asc' : 'desc');
  };

  const handleChangeRowsPerPage = (size) => {
    // console.log(size);
    setRowsPerPage(size);
    setPage(0);
  };

  // const fetchProducts = async () => {
  //   const token = localStorage.getItem('token');
  //   const productsData = await fetchAllProductsAdmin(token);
  //   const wishlistedStatus = productsData.reduce((acc, product) => {
  //     acc[product._id] = product.wishlist; // Set the wishlist status for each products by its ID
  //     return acc;
  //   }, {});

  //   // Set the products state to the array of products in the response
  //   setProducts(productsData);
  //   setIsWishlisted(wishlistedStatus);
  //   settotalProducts(productsData?.length);
  // };
  // useEffect(() => {
  //   fetchProducts();
  // }, [filterToggle, page, rowsPerPage, startDate, endDate, sortOrder]);

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
  const displayData = searchTerm ? filteredData : products;
  console.log(displayData);

  return (
    <>
      <Box>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 1 }}>TOTAL PRODUCTS: {totalProducts}</Typography>
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
                  searchText="PRODUCTS . . . ."
                />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Button
                  variant="outlined"
                  className="flex justify-center items-center gap-2 hover:bg-red-600 hover:text-white hover:border-red-600 font-semibold text-black rounded transition-colors duration-300 font-poppins"
                  sx={{ borderColor: 'rgba(0,0,0,0.35)' }}
                  onClick={handleExportCSV}
                >
                  <ArrowUpward />
                  <Typography>EXPORT PRODUCT</Typography>
                </Button>

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
                        <Button variant="contained" className="bg-teal-600 text-white hover:bg-teal-700" onClick={handleFileUpload}>
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
                  onClick={() => navigate(`/apps/product/create`)}
                  className="flex align-center justify-start gap-2 bg-[#779E40] hover:bg-[#5F7E33] hover:text-white text-white font-semibold font-inter"
                >
                  <AddIcon />
                  <Typography>ADD PRODUCT</Typography>
                </Button>
              </div>
            </div>
          }
        >
          {/* <Divider sx={{ marginBottom: '0.3rem' }} /> */}
          <div className="overflow-x-auto bg-background">
            <Box className="flex gap-2 items-center" sx={{ padding: '1rem'}}>
              {/* <Box>
                <button
                  ref={sortRef}
                  onClick={toggleSortDropdown}
                  style={{
                    border: '1px solid rgba(0,0,0,0.35)',
                    color: 'rgba(0,0,0,0.4)',
                    padding: '6px 5px',
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
                  <Typography sx={{ color: 'rgba(0,0,0,0.4)', fontWeight: 600 }}>SORT</Typography>
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
                        top: '35px',
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
                </button>
              </Box> */}

              <Box ref={dateRef}>
                <DateButton
                  handleDateRangeChange={handleDateRangeChange}
                  toggleDateDropdown={toggleDateDropdown}
                  isDateDropdownOpen={isDateOpen}
                  setIsDateDropdownOpen={setIsDateDropdownOpen}
                />
              </Box>
            </Box>

            <Box sx={{ minHeight: '60vh' }}>
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
                          <Box className={`flex items-center ${column.accessor === 'actions' ? 'justify-center' : ''} gap-1`}>

                          <Typography
                            sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
                            // className={`${column.accessor === 'actions' ? 'text-center' : ''}`}
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
                  {displayData?.length > 0 &&
                    displayData?.map((product, idx) => {
                      const isLastItem = idx === displayData?.length - 1;
                      return (
                        <TableRow
                          hover={false}
                          key={product?._id}
                          selected={selected.indexOf(product?.name) !== -1}
                          onClick={() => {
                            if(product.isdeleted) return;

                            return navigate(`/apps/product/details/${product?._id}`)}
                          }
                          // sx={{
                          //   backgroundColor: product.isdeleted ? '#FFB3B3' : idx % 2 === 0 ? '#dedede' : '#f7f7f7',
                          // }}
      
                          sx={{
                            backgroundColor: product.isdeleted ? '#FFB3B3' : idx % 2 === 0 ? '#dedede' : '#f7f7f7',
                            '&:hover': {
                              backgroundColor: product.isdeleted ? '#FFB3B3 !important' : idx % 2 === 0 ? '#dedede !important' : '#f7f7f7 !important'
                            }
                            
                          }}
                        >
                          <TableCell padding="checkbox">
                          <Box className="flex items-center  rounded-full bg-white">
                            <StarsOutlinedIcon
                              sx={{ fontSize: '14px', color: isWishlisted[product._id] ? 'green' : 'gray' }}
                              onClick={(e) => handleWishlist(e, product._id)}
                            />
                            </Box>
                          </TableCell>
                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {product?.itemname || '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {product?.hsn || '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {product?.code || '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {product?.category || '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {product?.actualprice || '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {product?.sellingprice || '-'}
                          </TableCell>
                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            {product?.createdAt ? format(new Date(product?.createdAt), 'dd-MM-yy') : '-'}
                          </TableCell>

                          <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                            <div className="relative flex justify-center">
                              <button
                                onClick={(e) => toggleDropdown(e, product._id)}
                                className="p-1 rounded-md text-[15px] border shadow-md bg-white flex justify-center items-center"
                              >
                                <MoreVertIcon />
                              </button>
                              {dropdownOpen === product?._id && (
                                <div
                                  className="absolute top-9 right-19 w-38 -translate-x-5 bg-white rounded-lg shadow-lg z-10"
                                  style={isLastItem ? { transform: 'translate(-18px,-123px)' } : {}}
                                >
                                  <ul className="py-3">
                                    {role === `"Admin"` && product.isdeleted === true && (
                                      <li
                                        className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                        onClick={(event) => handleUndoDeleteConfirmation(event, product._id)}
                                      >
                                        <Undo className="text-[20px] text-green-700" />
                                        <Typography className="font-inter text-center text-[13px]" sx={{ fontWeight: 400 }}>
                                          Undo
                                        </Typography>
                                      </li>
                                    )}

                                    {role === `"Admin"` && product.isdeleted != true && (
                                      
                                      <>
                                        <li
                                          className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                          onClick={() => navigate(`/apps/lead/details/${product?._id}`)}
                                        >
                                          <EditIcon className="text-[20px] text-green-700" />
                                          <Typography>Edit</Typography>
                                        </li>
                                        <li
                                          className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                          onClick={(event) => handleDeleteConfirmation(event, product?._id)}
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
          totalCount={totalProducts}
          handleChangePage={(page) => setCurrentPage(page)}
          rowsPerPage={rowsPerPage}
          handleRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Toaster position="top-right" reverseOrder={false} />
      </Box>
    </>
  );
};

export default ProductsTable;
