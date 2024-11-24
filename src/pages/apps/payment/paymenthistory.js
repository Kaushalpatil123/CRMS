import PropTypes from 'prop-types';
import { useMemo, Fragment, useEffect, useState } from 'react';
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
  FormHelperText
} from '@mui/material';
import MainCard from '../../../components/MainCard';
import ScrollX from '../../../components/ScrollX';
import { renderFilterTypes } from 'utils/react-table';
import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';
import { Trash, Eye, Edit, AddCircle } from 'iconsax-react';
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

import SimpleBar from '../../../components/third-party/SimpleBar';
import { EditLocation } from '@mui/icons-material';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import Pagination from '../components/Pagination/Pagination';

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

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 0 }}>
          <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} />
        </Stack>
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.Header}
                  className="bg-[#4c81f4] text-white text-center"
                  sx={{ fontSize: '10px', width: column.Header === 'ID' ? '40px' : 'auto' }}
                >
                  {column.Header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData?.map((row, index) => (
              // {paginatedData.map((row, i) => (

              <TableRow
                key={row._id}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#f0f0f0' : 'white',
                  '&:hover': {
                    backgroundColor: 'gray'
                  }
                }}
              >
                <TableCell className="text-center" style={{ width: '20%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    {/* <Avatar variant="rounded" color="secondary" size="sm" src={`${row?.picture}`} /> */}

                    <Typography className='text-[12px]'>{row?.transactionId || 'NA'}</Typography>
                  </Stack>
                </TableCell>

                <TableCell className='text-center' style={{ width: '20%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography>{row?.user?.userName || 'NA'}</Typography>
                  </Stack>
                </TableCell>

                <TableCell className='text-center' style={{ width: '10%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    <Typography className='text-[12px]'>{row?.user?.phoneNumber || 'NA'}</Typography>
                  </Stack>
                </TableCell>

                <TableCell className='text-center' style={{ width: '20%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    <Typography className='text-[12px]'>{row?.type || 'NA'}</Typography>
                  </Stack>
                </TableCell>

                <TableCell className='text-center' style={{ width: '20%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                   
                    <Typography className='text-[12px]'>{row?.price !== null && row?.price !== undefined ? row.price : 'NA'}</Typography>
                  </Stack>
                </TableCell>

                <TableCell className='text-center' style={{ width: '20%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    <Typography className='text-[12px]'>{new Date(row?.purchaseDate).toLocaleString() || 'NA'}</Typography>
                  </Stack>
                </TableCell>

                <TableCell className='text-center'  style={{ width: '20%' }}>
                 
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    <Typography className='text-[12px]'>{row?.card_type || 'NA'}</Typography>
                  </Stack>
                </TableCell>

                <TableCell className='text-center' style={{ width: '20%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    <Typography className='text-[12px]'>{row?.status || 'NA'}</Typography>
                  </Stack>
                </TableCell>

                <TableCell className="text-center" style={{ width: '25%' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent='center'>
                    <Button
                      className={`bg-blue-500 text-white px-4 py-2 rounded-md mr-4 ${
                        row.status !== 'success' && 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => row.status === 'success' && window.open(row?.invoiceUrl, '_blank')}
                      disabled={row.status !== 'success'}
                    >
                      View
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {/* Pagination */}
            {/* <PaginationComponent page={page} setPage={setPage} filteredData={filteredData} rowsPerPage={rowsPerPage} /> */}

            {/* <=====--------------- */}
          </TableBody>
        </Table>
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

      <ToastContainer
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
      />
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

  useEffect(() => {
    const fetchpaymnethistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate("/");
      } else {
        try {
          const response = await axios.get(`${server}/api/history/allpurchases`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            setSubscriptionData(response?.data?.data);
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
      { Header: 'Transaction id', accessor: 'prurchase' },
      { Header: 'User Name', accessor: 'user' },
      { Header: 'Phone Number', accessor: 'phoneNumber' },
      { Header: 'Purchase Type', accessor: 'plan' },
      // Plantype in place of subscriptionPlan
      { Header: 'Purchase Price', accessor: 'price' },
      { Header: 'Purchase Date', accessor: 'date' },
      { Header: 'Card Type', accessor: 'cardType' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Invoice', accessor: 'invoice' }
    ],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={userData} setUserData={setSubscriptionData} />
        {/* <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} /> */}
      </ScrollX>
    </MainCard>
  );
};

// Function to handle closing the delete dialog

export default SubscriptionListPage;
