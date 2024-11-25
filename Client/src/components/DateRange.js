
// import React, { useState, useEffect } from 'react';
// import { Box, Divider, Typography } from '@mui/material';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';
// import DateRangeIcon from '@mui/icons-material/DateRange';

// const DateRangeSelector = ({handleDateRangeChange,toggleDateDropdown,isDateDropdownOpen,setIsDateDropdownOpen}) => {
//     const today = dayjs();
//     const firstDayOfCurrentMonth = today.startOf('month');
//     const lastDayOfCurrentMonth = today.endOf('month');
//     const firstDayOfLastMonth = today.subtract(1, 'month').startOf('month');
//     const lastDayOfLastMonth = today.subtract(1, 'month').endOf('month');

//     const [dateRange, setDateRange] = useState(`${today.format('MM/DD/YYYY')} - ${today.format('MM/DD/YYYY')}`);
    
//     const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
//     const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
//     const [startDate, setStartDate] = useState(today);
//     const [endDate, setEndDate] = useState(today);
//     const [selectedOption, setSelectedOption] = useState('Today');

    

//     const handleApplyCustomRange = () => {
//         const [start, end] = selectedDateRange;
//         if (start && end) {
//             const customRange = `${dayjs(start).format('MM/DD/YYYY')} - ${dayjs(end).format('MM/DD/YYYY')}`;
//             setDateRange(customRange);
//             setStartDate(start);
//             setEndDate(end);
//             handleDateRangeChange(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
//         }
//         setIsCustomRangeOpen(false);     
//     };

//     const handleCancelCustomRange = () => {
//         setSelectedDateRange([null, null]);
//         setIsCustomRangeOpen(false);
//     };

//     const handleDateChange = (value) => {
//         setSelectedOption(value);
//         let start, end;
//         if (value === 'Today') {
//             start = end = today;
//         } else if (value === 'Yesterday') {
//             start = end = today.subtract(1, 'day');
//         } else if (value === 'Last 7 Days') {
//             start = today.subtract(6, 'day');
//             end = today;
//         } else if (value === 'Last 30 Days') {
//             start = today.subtract(29, 'day');
//             end = today;
//         } else if (value === 'This Month') {
//             start = firstDayOfCurrentMonth;
//             end = lastDayOfCurrentMonth;
//         } else if (value === 'Last Month') {
//             start = firstDayOfLastMonth;
//             end = lastDayOfLastMonth;
//         } else if (value === 'Custom Range') {
//             setIsCustomRangeOpen(true);
//             return;
//         }
//         setDateRange(`${start.format('MM/DD/YYYY')} - ${end.format('MM/DD/YYYY')}`);
//         setStartDate(start);
//         setEndDate(end);
//         handleDateRangeChange(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));        
//     };
//   const menuData=['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Range'];
//     useEffect(() => {
//         const { start, end } = parseDateRange(dateRange);
//         setStartDate(start);
//         setEndDate(end);
//     }, [dateRange]);

//     const parseDateRange = (range) => {
//         const [start, end] = range.split(' - ').map(date => dayjs(date, 'MM/DD/YYYY'));
//         return { start, end };
//     };

//     return (
//         <Box>
//             <button
//                 onClick={toggleDateDropdown}
//                 style={{
//                     border: '1px solid rgba(0,0,0,0.35)',
//                     color: 'rgba(0,0,0,0.4)',
//                     padding: '6px 10px',
//                     boxShadow: '0px 4px 4px 0px rgba(219, 219, 219, 0.2509803922)',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     gap: '4px',
//                     position: 'relative'
//                 }}
//                 className="rounded"
//             >
//                 <Box>
//                     <DateRangeIcon sx={{ fontSize: '14px' }} />
//                 </Box>
//                 <Typography sx={{color:'rgba(0,0,0,0.4)'}} className='font-medium-500 text-[15px] font-inter'>{dateRange}</Typography>
//                 {isDateDropdownOpen && (
//                     <Box
//                         onClick={(e)=>e.stopPropagation()}
//                         sx={{
//                             position: 'absolute',
//                             zIndex: 1300,
//                             left: 0,
//                             top: '40px',
//                             backgroundColor: 'white',
//                             paddingY:'8px',
                            
//                             boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
//                         }}
//                     >
//                         {menuData.map(range => (
//                             <Box 
//                                 key={range} 
//                                 onClick={() => handleDateChange(range)} 
//                                 sx={{
//                                     display:'flex',
//                                     flexDirection:'column',
//                                     width:'150px',
//                                     backgroundColor: selectedOption === range ? '#779E40' : 'white',
//                                     color: selectedOption === range ? 'white' : 'inherit',
//                                     cursor: 'pointer',
                                    
//                                     '&:hover': {
//                                         backgroundColor:selectedOption === range ? '#5F7E33' :'#F5F5F4',
                                        
//                                     }
//                                 }}
//                             >
//                                 <Typography variant="body2" textAlign="left" className='px-4 py-1.5'>{range}</Typography>
//                             </Box>
//                         ))}
//                     </Box>
//                 )}
//                 {isCustomRangeOpen && (
//                     <LocalizationProvider dateAdapter={AdapterDayjs}>
//                         <Box
//                             className="m-3"
//                             sx={{
//                                 position: 'absolute',
//                                 zIndex: 1300,
//                                 left: '215px',
//                                 top: '30px',
//                                 backgroundColor: 'white',
//                                 padding: '10px',
//                                 borderRadius: '8px',
//                                 boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
//                             }}
//                         >
//                             <StaticDateRangePicker
//                                 displayStaticWrapperAs="desktop"
//                                 calendars={2}
//                                 value={[startDate, endDate]}
//                                 onChange={(newValue) => {
//                                     setSelectedDateRange(newValue);
//                                     setStartDate(newValue[0]);
//                                     setEndDate(newValue[1]);
//                                 }}
//                             />
//                             <Divider />
//                             <Box className="flex justify-end items-center mt-4 gap-2">
//                                 <span className='mr-3 font-semibold' sx={{color:'rgba(0,0,0,0.4)'}} >
//                                     {startDate && endDate 
//                                         ? `${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}` 
//                                         : ''}
//                                 </span>
//                                 <button
//                                     onClick={handleCancelCustomRange}
//                                     className="font-semibold text-black hover:text-gray-600 px-2 py-1 rounded text-sm"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleApplyCustomRange}
//                                     className="font-semibold text-white bg-[#779E40] hover:bg-[#5F7E33] px-2 py-1 rounded text-sm"
//                                 >
//                                     Apply
//                                 </button>
//                             </Box>
//                         </Box>
//                     </LocalizationProvider>
//                 )}
//             </button>
//         </Box>
//     );
// };

// export default DateRangeSelector;


import React, { useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS

const DateRangeSelector = ({ handleDateRangeChange, toggleDateDropdown, isDateDropdownOpen }) => {
    const today = new Date();

    // Helper function to format date as dd/mm/yyyy
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
    const [dateRange, setDateRange] = useState(`${formatDate(today)} - ${formatDate(today)}`);
    const [selectedOption, setSelectedOption] = useState('Today');

    const handleApplyCustomRange = () => {
        if (startDate && endDate) {
            const customRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;
            setDateRange(customRange);
            handleDateRangeChange(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
        }
        setIsCustomRangeOpen(false);
    };
    const handleDateChange = (value) => {
        setSelectedOption(value);
        let start, end;
        const today = new Date();
    
        if (value === 'Today') {
            start = end = today;
        } else if (value === 'Yesterday') {
            start = end = new Date(today.setDate(today.getDate() - 1));
        } else if (value === 'Last 7 Days') {
            start = new Date(today.setDate(today.getDate() - 6));
            end = new Date();
        } else if (value === 'Last 30 Days') {
            start = new Date(today.setDate(today.getDate() - 29));
            end = new Date();
        } else if (value === 'This Month') {
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        } else if (value === 'Last Month') {
            start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            end = new Date(today.getFullYear(), today.getMonth(), 0);
        } else if (value === 'Custom Range') {
            setIsCustomRangeOpen(true);
            return; // Keep the dropdown open for Custom Range
        }
    
        // If a pre-defined range is selected, update date range and close dropdown
        setDateRange(`${formatDate(start)} - ${formatDate(end)}`);
        setStartDate(start);
        setEndDate(end);
        handleDateRangeChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
        toggleDateDropdown(); // Close the dropdown after selection
    };
    
    const menuData = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Range'];

    return (
        <Box>
            <button
                onClick={toggleDateDropdown}
                style={{
                    border: '1px solid rgba(0,0,0,0.35)',
                    color: 'rgba(0,0,0,0.4)',
                    padding: '6px 10px',
                    boxShadow: '0px 4px 4px 0px rgba(219, 219, 219, 0.2509803922)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    position: 'relative',
                }}
                className="rounded"
            >
                <Box>
                    <DateRangeIcon sx={{ fontSize: '14px' }} />
                </Box>
                <Typography sx={{ color: 'rgba(0,0,0,0.4)' }} className='font-medium-500 text-[15px] font-inter'>
                    {dateRange}
                </Typography>
                {isDateDropdownOpen && (
                    <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            position: 'absolute',
                            zIndex: 1300,
                            left: 0,
                            top: '40px',
                            backgroundColor: 'white',
                            paddingY: '8px',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {menuData.map(range => (
                            <Box
                                key={range}
                                onClick={() => handleDateChange(range)}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '150px',
                                    backgroundColor: selectedOption === range ? '#779E40' : 'white',
                                    color: selectedOption === range ? 'white' : 'inherit',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: selectedOption === range ? '#5F7E33' : '#F5F5F4',
                                    },
                                }}
                            >
                                <Typography variant="body2" textAlign="left" className='px-4 py-1.5'>{range}</Typography>
                            </Box>
                        ))}
                    </Box>
                )}
                {isCustomRangeOpen && (
                    <Box
                        className="m-3"
                        sx={{
                            position: 'absolute',
                            zIndex: 1300,
                            left: '138px',
                            top: '60px',
                            backgroundColor: 'white',
                            padding: '10px',
                            borderRadius: '0px',
                            
                        }}
                    >
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                             dateFormat="dd/MM/yyyy"
                            placeholderText="Start Date"
                            value={startDate ? formatDate(startDate) : ''} 

                            className='border border-1 border-red-600 rounded text-black p-1 my-2 bg-red-200 outline-none'
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="End Date"
                            minDate={startDate}
                              dateFormat="dd/MM/yyyy"
                              
                              value={endDate ? formatDate(endDate) : ''}  // Manually format the displayed date

                            className='border border-1 border-red-600 rounded text-black p-1 my-2 bg-red-200  outline-none'
                        />
                        <Divider />
                        <Box className="flex justify-end items-center mt-4 gap-2">
                            <span className='mr-4 font-semibold text-red-600'>
                                {startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : ''}
                            </span>
                        </Box>
                        <Box className="flex justify-end mt-2 gap-2">
                            <button
                                onClick={() => setIsCustomRangeOpen(false)}
                                className="bg-red-600 rounded text-white p-2 font-semibold hover:bg-red-700 hover:text-white font-poppins mt-2 ml-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApplyCustomRange}
                                className="bg-lime-600 rounded text-white p-2 font-semibold hover:bg-lime-700 hover:text-white font-poppins mt-2 ml-2"
                            >
                                Apply
                            </button>
                        </Box>
                    </Box>
                )}
            </button>
        </Box>
    );
};

export default DateRangeSelector;
