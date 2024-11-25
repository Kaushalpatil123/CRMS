// material-ui
import { useMemo, useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Stack, Typography } from '@mui/material';

// projects*********


import RepeatCustomerRate from 'sections/widget/chart/RepeatCustomerRate';

import axios from 'axios';
import ApexCharts from 'apexcharts';

import {getAllProspects} from 'pages/utils/prospects/api';
import { getAllLeads,getParticularLead } from 'pages/utils/leads/api';
import {getAllModuleCounts} from 'pages/utils/dashboard/api';
import { useNavigate } from 'react-router-dom';
//*************** DASHBOARD - DEFAULT ************************ //


const DashboardDefault = () => {
  const theme = useTheme();
  const navigate=useNavigate();
  const [income, setIncome] = useState(null);
  const [susbcriptions, setSubscriptions] = useState(null);
  const [TotalUsers, setTotalUsers] = useState([]);
  const [AgeWiseActiveUser, setAgeWiseActiveUser] = useState([]);
  const [leadData,setLeadData]=useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [leads,setLeads]=useState([]);
  const [countData,setCountData]=useState(null);


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  
const fetchModuleCounts=async()=>{
  const response=await getAllModuleCounts();
  console.log(response);
  setCountData(response.data);
}
useEffect(()=>{
  fetchModuleCounts();
},[])


  useEffect(() => {
    const fetchIncome = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/totalEarnings`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('earning api se-->', data.data)
        setIncome(data.data.totalEarnings);
        setSubscriptions(data.data.totalSubscriptions)
        setTotalUsers(data.data.totalUsers);

      
      } catch (error) {
        console.error('Error fetching income:', error);
      }
    };

    fetchIncome();
  }, []);

 

  const formatIncome = (income) => {
    if (income >= 1e12) {
      return `₹ ${(income / 1e12).toFixed(1)}T`;
    } else if (income >= 1e9) {
      return `₹ ${(income / 1e9).toFixed(1)}B`;
    } else if (income >= 1e6) {
      return `₹ ${(income / 1e6).toFixed(1)}M`;
    } else {
      return `₹ ${income}`;
    }
  };


  const [orders, setOrders] = useState([]);


  const [prospects, setProspects] = useState([]);

  const [filterOption, setFilterOption] = useState('Last 30 days');


  //  fetch and filter prospects*********************
  const getProspects = async (days) => {
    const AllProspects = await getAllProspects();
    

    // const lastFiveProspects = AllProspects?.slice(-15);
    // setProspects(lastFiveProspects);

    if (Array.isArray(AllProspects)) {
      const lastFiveProspects = AllProspects.slice(-5);
      setProspects(lastFiveProspects);
   } else {
      console.error("AllProspects is not an array:", AllProspects);
   }
   
  };
  const fetchLeads=async()=>{
    const token=localStorage.getItem('token');
    const response=await getAllLeads(1,10,null, null, 'desc', null, null, null,token);
    console.log("Leads--->",response);
    setLeads(response.leads)

  }
  useEffect(()=>{
   fetchLeads();
  },[])

  useEffect(() => {
    // fetch prospects ********** when default filter
    const days = filterOption === 'Last 15 days' ? 15 : 30;
    getProspects(days);
  }, [filterOption]);

  // handle dropdown *************** when item click
  const handleFilterChange = (days, label) => {
    setFilterOption(label);
    setIsDropdownOpen(false); 
    getProspects(days);
  };

  const handleFilterChanges = async(days, label) => {
    
    setFilterOption(label);
    setIsDropdownOpen(false);
    const AllProspects = await getAllProspects();
   

    const lastFiveProspects = AllProspects?.slice(-30);
    setProspects(lastFiveProspects);
  };

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
         
          console.error('No token found');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/age`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });

        if (response.data) {
          console.log('response data====>', response?.data?.ageGroupsData);
          setAgeWiseActiveUser(response?.data?.ageGroupsData);

        } else {
          console.error('Empty response data or unexpected htmlFormat');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchUsers();

  }, [])

 const clickHandler=async(lead)=>{
  // if(lead.isDeleted) return;
  return navigate(`/apps/lead/details/${lead._id}`)
 }
//  navigate('/apps/lead/add-lead')
 
  useEffect(() => {
    if (AgeWiseActiveUser.length > 0) {
      const ageCounts = AgeWiseActiveUser.map((ageGroup) => ageGroup.count);
      const ageGroup = AgeWiseActiveUser.map((ageGroup) => ageGroup.ageGroup);

     
      const barColors = ['#FF5733', '#33FF57'];

      const chartConfig = {
        series: [
          {
            name: 'Active Users',
            data: ageCounts
          }
        ],
        chart: {
          type: 'bar',
          height: 240,
          toolbar: {
            show: false
          }
        },
        title: {
          show: false
        },
        dataLabels: {
          enabled: false
        },
        colors: barColors, 
        plotOptions: {
          bar: {
            columnWidth: '40%',
            borderRadius: 2,
            distributed: true 
          }
        },
        xaxis: {
          categories: ageGroup,
          axisTicks: {
            show: false
          },
          axisBorder: {
            show: false
          },
          labels: {
            style: {
              colors: '#616161',
              fontSize: '12px',
              fontFamily: 'inherit',
              fontWeight: 400
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: '#616161',
              fontSize: '12px',
              fontFamily: 'inherit',
              fontWeight: 400
            }
          }
        },
        grid: {
          show: true,
          borderColor: '#dddddd',
          strokeDashArray: 5,
          xaxis: {
            lines: {
              show: true
            }
          },
          padding: {
            top: 5,
            right: 20
          }
        },
        fill: {
          opacity: 0.8
        },
        tooltip: {
          theme: 'dark'
        }
      };

      const chart = new ApexCharts(document.querySelector('#bar-chart'), chartConfig);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [AgeWiseActiveUser]);

 //prospects fetch*********************

    useEffect(() => {
    const getProspects = async () => {
      const AllProspects = await getAllProspects();
      console.log('Leads data---->', AllProspects);
      // const lastFiveProspects = AllProspects?.slice(-5);
      // setProspects(lastFiveProspects);
      if (Array.isArray(AllProspects)) {
        const lastFiveProspects = AllProspects.slice(-5);
        setProspects(lastFiveProspects);
     } else {
        console.error("AllProspects is not an array:", AllProspects);
     }
     
     
    };
    getProspects();
  }, []);



  return (
    <>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
       
        <Grid container item xs={12} sm={12} lg={12}>
          
         
         
        </Grid>
        
      </Grid>
      
      <Grid item xs={12} md={12} lg={12} className='py-5' >
      <Box className='flex gap-4'>
          <Box className='flex flex-col gap-1 min-w-[100px] bg-[#f5f5f5] px-2 py-3 border border-[#e5e5e5] rounded-[5px] shadow-lg' >
            <Typography className='font-inter'>Customer Count</Typography>
            <Typography className='font-inter font-semibold text-xl'>{(countData && countData.totalCustomers !==0) ? countData.totalCustomers : '+'}</Typography>


          </Box>
          <Box className='flex flex-col gap-1 min-w-[100px] bg-[#f5f5f5] px-2 py-3 border border-[#e5e5e5] rounded-[5px] shadow-lg cursor-pointer' onClick={()=>navigate(`/apps/lead`)} >
            <Typography className='font-inter'>Lead Count</Typography>
            <Typography className='font-inter font-semibold text-xl'>{(countData && countData.totalLeads !==0) ? countData.totalLeads : '+'}</Typography>


          </Box>
          <Box className='flex flex-col gap-1 min-w-[100px] bg-[#f5f5f5] px-2 py-3 border border-[#e5e5e5] rounded-[5px] shadow-lg cursor-pointer' onClick={()=>navigate(`/apps/orders/list`)} >
            <Typography>Order Count</Typography>
            <Typography className='font-semibold text-xl'>{(countData && countData.totalOrders !==0) ? countData.totalOrders : '+'}</Typography>


          </Box>
          <Box className='flex flex-col gap-1 min-w-[100px] bg-[#f5f5f5] px-2 py-3 border border-[#e5e5e5] rounded-[5px] shadow-lg cursor-pointer' onClick={()=>navigate(`/apps/invoice/list`)} >
            <Typography>Invoice Count</Typography>
            <Typography className='font-semibold text-xl'>{(countData && countData.totalInvoices !==0) ? countData.totalInvoices : '+'}</Typography>


          </Box>
          <Box className='flex flex-col gap-1 min-w-[100px] bg-[#f5f5f5] px-2 py-3 border border-[#e5e5e5] rounded-[5px] shadow-lg cursor-pointer' onClick={()=>navigate(`/apps/quote`)} >
            <Typography>Quotation Count</Typography>
            <Typography className='font-semibold text-xl'>{(countData && countData.totalQuotations !==0) ? countData.totalQuotations : '+'}</Typography>


          </Box>
         
         
          </Box>
  </Grid>

<Grid item xs={12} md={12} lg={12}>

        <Grid item xs={12}>
          <RepeatCustomerRate />

        </Grid>
      </Grid>

      <br/>

      <Grid item xs={12} md={12} lg={12}>
      <div className="relative flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 border-gray-200 mt-3">
        <div className="flex justify-between items-center py-6 px-6 border-b border-gray-200">
          <h6 className="text-lg font-semibold">Recently Created Leads</h6>
          <div className="relative">
            <button
              className="bg-white border border-gray-200 px-4 py-[0.5rem] rounded-lg text-gray-600 hover:bg-gray-50 focus:outline-none"
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              {filterOption}
              <svg className="inline ml-2 w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
                role="menu"
                aria-labelledby="dropdown-button"
              >
                <a  className="block px-4 py-2 text-black hover:bg-gray-100" role="menuitem" onClick={() => handleFilterChange(15, 'Last 15 days')}>Last 15 days</a>
                <a  className="block px-4 py-2 text-black hover:bg-gray-100" role="menuitem" onClick={() => handleFilterChanges(30, 'Last 30 days')}>Last 30 days</a>
              </div>
            )}
          </div>
        </div>
        <div className="border border-gray-200 m-10">
  <div className="overflow-y-auto max-h-[340px]">
    <table className="table-auto w-full border-collapse">
      <thead>
        <tr className="bg-gray-50">
          <th className="border-b border-gray-200 p-4 text-left" scope="col">Lead Name</th>
          <th className="border-b border-gray-200 p-4 text-left" scope="col">Company Name</th>
          <th className="border-b border-gray-200 p-4 text-left" scope="col">Phone</th>
          <th className="border-b border-gray-200 p-4 text-left" scope="col">Status</th>
        </tr>
      </thead>
      <tbody className='cursor-pointer'>
        {leads && leads.map((lead) => (
          <tr key={lead._id} className="border-b border-gray-200" onClick={()=>clickHandler(lead)}>
            <td className="p-4">{(lead?.contacts[0]?.firstName)?`${lead.contacts[0].firstName} ${lead.contacts[0].lastName}`:'-'}</td>
            <td className="p-4">{(lead?.companyName)?`${lead.companyName}`:'-'}</td>
            <td className="p-4">{(lead?.contacts[0]?.phoneNumber)?`${lead.contacts[0].phoneNumber}`:'-'}</td>
            <td className="p-4">
              <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${lead.isactive ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                {lead?.isactive ? "Active" : 'InActive'}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      </div>
    </Grid>
      <br />

    </>
  );
};

export default DashboardDefault;
