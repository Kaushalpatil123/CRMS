import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Checkbox as CheckboxMUI,
    Modal,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';

import { Toaster, toast } from 'react-hot-toast';
import MainCard from 'components/MainCardWithoutTitle';
import SearchBar from '../components/Searchbar';
import PaginationComponent from '../components/Pagination';
import DateButton from '../../../components/DateRange';
import { stubFalse } from 'lodash';
import { getAllExecutives, postLeadsAssign, UndoDeleteLead } from 'pages/utils/leads/api';
import { getAllReceipts } from 'pages/utils/payment_receipts/api';
import {getReceiptPDF} from 'pages/utils/payment_receipts/api';

const LeadsTable = () => {
    const navigate=useNavigate();
    const [totalReceipt, setTotalReceipt] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
    const [filterText, setFilterText] = useState('');
    const [executive, setExecutive] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [allExecutives, setAllExecutives] = useState([]);
    const [leads, setLeads] = useState([]);
    const dateRef = useRef(null);
    const [AssignLeadsModal, setAssignLeadsModal] = useState(stubFalse);
    const [LeadId, setLeadId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);



    const handlePostAssignLead = async () => {
        try {
            const token = localStorage.getItem('token');
            const requestData = {
                leadId: LeadId,
                executiveName: executive // Ensure executive state is set properly
            };
            const editedLead = await postLeadsAssign(requestData, token);
            // console.log('Leads edit post assigned:', editedLead);

            // Update leads state
            const updatedLeads = leads.filter((lead) => lead._id !== LeadId);
            setLeads(updatedLeads);
            console.log('updated leads after delete,', updatedLeads);
            setAssignLeadsModal(false);

            // Reset page if needed
            if (page > Math.ceil(updatedLeads.length / rowsPerPage) - 1) {
                setPage(0);
            }
            toast.success('Lead Assigned Successfully');
        } catch (error) {
            console.error('Error assigning lead:', error);
            toast.error('Error Assigning Leads');
        }
    };


    const handleSearchChange = (event) => {
        setFilterText(event.target.value);
    };
    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setFilterText(value);
        setSearchTerm(value);
    
        const filtered = leads.filter((lead) => {
          // console.log('this is filter order-------->', order);
          return (
            lead?.customer?.firstName && lead.customer.firstName.toLowerCase().includes(value) ||
            lead?.customer?.lastName && lead.customer.lastName.toLowerCase().includes(value) ||
            lead?.dueDate && lead.dueDate.includes(value) ||
            // (lead?.amountPaid || lead?.amountPaid === 0) && lead.amountPaid.includes(value) ||
            lead?.receiptNumber && lead.receiptNumber.includes(value)
          );
        });
    
        setFilteredData(filtered);
        //setTotalReceipt(searchTerm?filteredData.length:leads.length)
    
      };
      const displayData = searchTerm ? filteredData : leads;
  
    const toggleDateDropdown = () => {
        setIsDateOpen(!isDateOpen);
        
    };

    const handleDateRangeChange = (start, end) => {
        console.log(start, end);
        setStartDate(start);
        setEndDate(end);
    };
 
    // const [UndoDeleteConfirmation, setUndoDeleteConfirmation] = useState({
    //     open: false,
    //     id: null
    // });

    // const handleConfirmUndoDelete = async (event) => {
    //     event.stopPropagation();
    //     const { id } = UndoDeleteConfirmation;

    //     if (id) {
    //         try {
    //             const token = localStorage.getItem('token');
    //             await UndoDeleteLead(id, token);
    //             const updatedLeads = leads.filter((lead) => lead._id !== id);
    //             setLeads(updatedLeads);
    //             console.log('updated leads after delete,', updatedLeads);
    //             if (page > Math.ceil(updatedLeads.length / rowsPerPage) - 1) {
    //                 setPage(0);
    //             }
    //             toast.success('Lead Revert successfully');
    //         } catch (error) {
    //             console.error('Error deleting lead:', error);
    //         } finally {
    //             setUndoDeleteConfirmation({ open: false, id: null });
    //         }
    //     }
    // };

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


    const handleChangeRowsPerPage = (size) => {
        console.log(size);
        setRowsPerPage(size);
        setPage(0);
    };

    console.log(page, rowsPerPage);
    const fetchPaymentReceipts = async () => {
        const token = localStorage.getItem('token');
        const allPaymentReceipts = await getAllReceipts(
            currentPage,
            rowsPerPage,
            startDate,
            endDate,
            token);
        console.log("payment receipts", allPaymentReceipts);
        setLeads(allPaymentReceipts?.data);
        setTotalReceipt(allPaymentReceipts?.totalPayments);
        setCurrentPage(allPaymentReceipts.currentPage);
        setHasNextPage(allPaymentReceipts.hasNextPage);
        setHasPreviousPage(allPaymentReceipts.hasPreviousPage);
    };

    useEffect(() => {
        fetchPaymentReceipts();
    }, [currentPage, rowsPerPage, startDate, endDate]);
    useEffect(() => {
        const fetchAllExecutives = async () => {
            const token = localStorage.getItem('token');
            const response = await getAllExecutives(token);
            console.log(response?.data);
            setAllExecutives(response?.data);
        };
        fetchAllExecutives();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
           
            if (dateRef.current && !dateRef.current.contains(event.target)) {
                setIsDateOpen(false);
            }
          
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const handleViewReceipt = async (receiptId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await getReceiptPDF(receiptId, token, {
                responseType: 'blob', // Ensure axios treats the response as a Blob
            });
    
            // Convert Blob to JSON
            const responseData = await response.data.text(); 
            const parsedData = JSON.parse(responseData); // Parse the JSON string
    
            console.log("----------------------------------", parsedData);
    
            if (parsedData) {
                const { viewUrl, downloadUrl } = parsedData;
    
                // Store data in localStorage or a state management store
                localStorage.setItem('htmlTemplate', viewUrl);
                localStorage.setItem('downloadUrl', downloadUrl);
    
                // Redirect to the view page
                navigate(`/apps/payment_receipts/view_payment_receipt/${receiptId}`, {
                    state: {},
                });
            }
        } catch (error) {
            console.error("Error fetching receipt:", error);
        }
    };
    
    // const handleViewReceipt = async (receiptId) => {
        
    //       const token=localStorage.getItem('token');
    //       const response = await getReceiptPDF(receiptId,token);
    //       console.log("----------------------------------",response) // Update with your API URL
    //       if(response){
        
    //       const { viewLink, downloadLink } = response.data;
    
    //       // Store data in localStorage or a state management store
    //       localStorage.setItem('htmlTemplate', viewLink);
    //       localStorage.setItem('downloadUrl', downloadLink);
     
    //       // Redirect to the view page (assuming you are using react-router)
    //     //   window.location.href = `/view-receipt/${receiptId}`;/apps/payment_receipts/view_payment_receipt/${item._id} // Update with your route
    //     // window.location.href = `/apps/payment_receipts/view_payment_receipt/${receiptId} `;
    //      navigate(`/apps/payment_receipts/view_payment_receipt/${receiptId}`, {
    //                                                     state: {},
    //       })
    //       }
    //   };
    return (
        <>
            <Box>
            <Typography className="text-[17px] font-inter mb-1" sx={{ fontWeight: 500 }}>
                TOTAL RECEIPTS: {totalReceipt}
            </Typography>
            <MainCard
                content={false}
                sx={{
                    minHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
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
                            <SearchBar
                                sx={{ width: '100%' }}
                                filterText={filterText}
                                setFilterText={setFilterText}
                                handleSearchChange={handleSearch}
                                searchText="RECEIPTS"
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Button
                                sx={{ borderRadius: '5px' }}
                                onClick={() => navigate(`/apps/payment_receipts/create_payment_receipt`)}
                                className="flex align-center justify-start gap-2 bg-[#779E40] hover:bg-[#5F7E33] hover:text-white text-white font-inter"
                            >
                                <AddIcon />
                                <Typography>CREATE NEW RECEIPT</Typography>
                            </Button>
                        </div>
                    </div>
                }
            >
                {/* Wrapper to hold the background color */}
             
                    <Box className="flex gap-5 items-center ml-5" sx={{ marginY: '2rem'}}>
                        <Box ref={dateRef}>
                            <DateButton
                                handleDateRangeChange={handleDateRangeChange}
                                toggleDateDropdown={toggleDateDropdown}
                                isDateDropdownOpen={isDateOpen}
                                setIsDateDropdownOpen={setIsDateDropdownOpen}
                            />
                        </Box>
                    </Box>
                    <div
                    style={{
                        backgroundColor: '#BCBCBC26',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1rem',
                    }}
                >

                    {/* Content Grid */}
                    <div className="p-6 flex-grow overflow-x-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-auto">
                            {displayData && displayData.map((item, index) => (
                                <div key={index} className="bg-gray-100 border border-gray-300 rounded-lg shadow-lg">
                                    {/* Header */}
                                    <div className="bg-[#769F40] text-white rounded-t-lg p-3 text-center">
                                        <h2 className="text-lg font-bold">Receipt No.: {item?.receiptNumber}</h2>
                                    </div>

                                    {/* Body */}
                                    <div className="p-4 bg-[#769F402B] rounded-b-lg">
                                        <div className="flex items-center">
                                            {/* Left Side (Labels) */}
                                            <div className="w-1/3">
                                                <div className="mb-2">
                                                    <div readOnly className="w-full bg-white px-2 py-1 rounded-md border border-gray-300">
                                                        Client Name
                                                    </div>
                                                </div>
                                                <div className="mb-2">
                                                    <div readOnly className="w-full bg-white px-2 py-1 rounded-md border border-gray-300">
                                                        Date
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div readOnly className="w-full bg-white px-2 py-1 rounded-md border border-gray-300">
                                                        Amount Paid
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <hr className="border-l border-white h-[120px] mx-2 -mt-[22px]" />

                                            {/* Right Side (Inputs) */}
                                            <div className="w-2/3">
                                                <div className="mb-2">
                                                    <div readOnly className="w-full bg-white px-2 py-1 rounded-md border border-gray-300">
                                                        {item?.customer?.firstName + " " + item?.customer?.lastName}
                                                    </div>
                                                </div>
                                                <div className="mb-2">
                                                    <div readOnly className="w-full bg-white px-2 py-1 rounded-md border border-gray-300">
                                                        {item?.receiptDate}
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div readOnly className="w-full bg-white px-2 py-1 rounded-md border border-gray-300">
                                                        {item?.amountPaid}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex justify-end gap-2 mt-4 mr-5 relative">
                                            <button
                                                className="bg-[#FF975C] text-white py-2 px-4 rounded-md hover:bg-orange-500"
                                                // onClick={() =>
                                                    // navigate(`/apps/payment_receipts/view_payment_receipt/${item._id}`, {
                                                    //     state: item,
                                                    // })
                                                // }
                                                onClick={() => handleViewReceipt(item._id)}
                                            >
                                                View Full Receipt
                                            </button>
                                            <button
                                                className="bg-[#F96363] text-black py-2 px-4 rounded-md hover:bg-[#dc5050]"
                                                onClick={() =>
                                                    navigate(`/apps/payment_receipts/create_payment_receipt/${item._id}`, {
                                                        state: item,
                                                    })
                                                }
                                            >
                                                Edit Receipt
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </MainCard>

            {/* Pagination outside of the background container */}
            <PaginationComponent
                currentPage={currentPage}
                totalCount={totalReceipt}
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
