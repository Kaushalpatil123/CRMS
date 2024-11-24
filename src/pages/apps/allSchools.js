    import PropTypes from 'prop-types';
    import { useMemo, Fragment, useEffect, useState } from 'react';
    import axios from 'axios';
    import Avatar from '../../components/@extended/Avatar';
    import { toast, ToastContainer } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import { useTheme } from '@mui/material/styles';
    import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, Tooltip, Button } from '@mui/material';
    import MainCard from '../../components/MainCard';
    import ScrollX from '../../components/ScrollX';
    import { renderFilterTypes } from 'utils/react-table';
    import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';
    import { Trash, Eye, Edit } from 'iconsax-react';
    import makeData from 'data/react-table';
    import { ThemeMode } from 'config';
    // import IconButton from 'components/@extended/IconButton';
    import IconButton from '../../components/@extended/IconButton';
    import SearchBar from './components/Searchbar';
    // import PaginationComponent from './components/Pagination';
    import Box from '@mui/material/Box';
    import { PopupTransition } from '../../components/@extended/Transitions';
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

    import SimpleBar from '../../components/third-party/SimpleBar';
import Pagination from './components/Pagination/Pagination';

    const server = process.env.REACT_APP_API_URL;
    // ==============================|| REACT TABLE ||============================== //

    function ReactTable({ columns, data, renderRowSubComponent, setplanData, setUserData }) {
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

    const [addplanName, setaddplanName] = useState();
    const [AddPlanType, setaddPlantype] = useState();
    const [AddPrice, setAddPrice] = useState();
    //   const [AddRole, setAddRole] = useState('plan');
    const [AddActualPrice, setAddActualPrice] = useState();

    const [EditPlanType, setEditPlanType] = useState();
    const [Editprice, setEditprice] = useState();
    const [EditactualPrice, setEditactualPrice] = useState();

    const handleClose = () => setOpen(false);

    const [viewModal, setViewModal] = useState({
        open: false,
        details: null,
        completeDetails: null
    });

    const server = process.env.REACT_APP_API_URL;

      const [rowsPerPageOptions, setRowsPerPageOptions] = useState([1, 20, 30, 50]);

      const handlePageChange = (event, newPage) => {
        setPage(newPage);
      };

      const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

      const getPaginationGroup = () => {
        let start = Math.floor(page / 5) * 5;
        return new Array(5).fill().map((_, idx) => start + idx + 1);
      };

      const getPaginationGroupWithEllipsis = () => {
        const totalPageCount = Math.ceil(filteredData.length / rowsPerPage);
        const paginationGroup = getPaginationGroup();

        if (paginationGroup[0] > 1) {
          paginationGroup.unshift('...');
          paginationGroup.unshift(1);
        }

        if (paginationGroup[paginationGroup.length - 1] < totalPageCount) {
          paginationGroup.push('...');
          paginationGroup.push(totalPageCount);
        }

        return paginationGroup;
      };

      const handlePageClick = (pageNumber) => {
        if (pageNumber === '...') return;
        setPage(pageNumber - 1);
      };

    const handleOpenViewModal = async (id) => {
        try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${server}/api/plan/user/${id}`, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        });

        // Assuming your raw body response is plain text
        const responseDataCart = response.data;
        const responseData = response.data.data;
        console.log('This is view response data', responseData);

        // Adjust this logic based on the actual format of your raw body response
        // For example, if your response is plain text, you might display it directly
        setOpen(true);
        setViewModal({
            details: responseData,
            completeDetails: responseDataCart // Adjust this line accordingly
        });
        } catch (error) {
        console.error('Error fetching User details:', error);
        }
    };

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

    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        id: null
    });

    // SearchBar
    // SearchBar
    // const filteredData = useMemo(() => {
    //     if (!filterText) return data; // Using rowData as initial data
    //     return data.filter((row) => {
    //     return Object.values(row).some((value) => {
    //         if (value === null || value === undefined) return false; // Handle null or undefined values
    //         return value.toString().toLowerCase().includes(filterText.toLowerCase());
    //     });
    //     });
    // }, [data, filterText]);

      const filteredData = useMemo(() => {
        // console.log("this is rowData", rowData);
        if (!filterText) return data; // Using rowData as initial data
        return data?.filter((row) =>
          Object.values(row)?.some((value) => value.toString().toLowerCase().includes(filterText.toLowerCase()))
        );
      }, [data, filterText]);

    //Pagination

     const paginatedData = useMemo(() => {
       // console.log("this is filteredData in useMemo",filteredData )
       const firstPageIndex = (currentPage - 1) * rowsPerPage;
       const lastPageIndex = firstPageIndex + rowsPerPage;
       return filteredData?.slice(firstPageIndex, lastPageIndex);
     }, [currentPage, filteredData]);

    // const paginatedData = useMemo(() => {
    //     return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    // }, [filteredData, page, rowsPerPage]);

    const handleSearchChange = (event) => {
        setFilterText(event.target.value);
    };

    const handleDeleteConfirmation = (id) => {
        setDeleteConfirmation({ open: true, id });
    };

    const handleConfirmDelete = async () => {
        const { id } = deleteConfirmation;
        console.log('id aayi delet k liye', deleteConfirmation);
        if (id) {
        try {
            const token = localStorage.getItem('token');
            // if (!token) {
            // navigate("/");
            // } else {
            await axios.delete(`${server}/api/subscription/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            });
            console.log('api url', `${server}/api/user/${id}`);
            console.log('userdata--->', data);
            const updatedsubscriptions = data.filter((subscription) => subscription._id !== id);
            setUserData(updatedsubscriptions);
            console.log('Deleted subscription of id -->', id);
            toast.success('School deleted Successfully');
            if (page > Math.ceil(updatedsubscriptions.length / rowsPerPage) - 1) {
            setPage(0);
            }
            // }
        } catch (error) {
            console.error('Error deleting subscription:', error);
        }
        }
        setDeleteConfirmation({ open: false, id: null });
    };

    // add new plan

    const handleSaveNewplan = async () => {
        try {
        // ---- IT's Working ------
        const requestData = {
            planType: AddPlanType,
            // role: AddRole,
            actualPrice: AddActualPrice,
            price: AddPrice
        };

        const token = localStorage.getItem('token');
        console.log(token);
        const response = await axios.post(`${server}/api/subscription/create`, requestData, {
            headers: {
            Accept: '*/*',
            Authorization: `Bearer ${token}`
            }
        });

        // Handle the response as needed
        console.log('Create API response:', response.data);

        if (response.status === 201) {
            // Close the add new modal after successful creation
            // setAddNewModal({ open: false });
            // setaddplanName('');
            setaddPlantype('');
            setAddPrice('');
            // setAddRole('');
            setAddActualPrice('');
            // setAddPassword('');

            try {
            const token = localStorage.getItem('token');
            const updatedData = await axios.get(`${server}/api/subscription/getPlan`, {
                headers: {
                Authorization: `Bearer ${token}`
                }
            });

            setUserData(updatedData.data.data);
            console.log('record save successfully--->', updatedData);
            toast('New plan Added Successfully');
            } catch (error) {
            console.log('Error duing Updated DAta fetching', error);
            }
        } else {
            toast.error('Error Creating plan');
        }
        } catch (error) {
        console.error('Error creating plan:', error);

        toast.error('Error creating plan');
        }
    };

    const [addNewModal, setAddNewModal] = useState({
        open: false
    });

    const handleAddModalClose = () => {
        setAddNewModal({
        open: false
        });
    };

    const handleAddNew = () => {
        setAddNewModal({
        open: true
        });
    };

    // Edit Plans

    //  Edit Plans

    const [editModal, setEditModal] = useState({
        open: false,
        details: null
    });

    const handleEdit = (details) => {
        setEditModal({
        open: true,
        details: { ...details }
        });
        console.log('edit details--->', details);

        // Set the initial values for editing
        setEditPlanType(details.planType);
        setEditactualPrice(details.actualPrice);
        setEditprice(details.price);

        console.log('Initializatin completed');
    };

    const handleEditModalClose = () => {
        setEditModal({
        open: false
        // blog: { ...blog },
        });
    };

    // Calling the update api
    const handleSaveEdit = async () => {
        try {
        const requestData = {
            planType: EditPlanType,
            actualPrice: EditactualPrice,
            newPrice: Editprice
        };

        const token = localStorage.getItem('token');
        const response = await axios.put(`${server}/api/subscription/update/${editModal.details._id}`, requestData, {
            headers: {
            Accept: '*/*',
            Authorization: `Bearer ${token}`
            }
        });

        // Handle the response as needed

        if (response.status === 200) {
            // Close the edit modal after successful update
            setEditModal({ open: false, details: null });
            setaddPlantype();
            setAddPrice();
            setAddActualPrice();

            // Fetch the updated data from the server and update the rowData state
            try {
            const token = localStorage.getItem('token');
            const updatedData = await axios.get(`${server}/api/subscription/getPlan`, {
                headers: {
                Accept: '*/*',
                Authorization: `Bearer ${token}`
                }
            });
            setUserData(updatedData.data.data);
            console.log('Updated rowData:', updatedData);
            } catch (error) {
            console.log('Error', error);
            }

            toast('Record updated Successfully');
        } else {
            toast.error('Record Not updated.. Try Again');
        }
        } catch (error) {
        console.error('Error updating record:', error);
        // Handle error and display a toast or error message to the user
        toast.error('Error updating record');
        }
    };

    return (
      <>
        <Stack spacing={3}>
          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 0 }}>
            <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} />

            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                variant="contained"
                className="bg-blue-500 text-white hover:bg-blue-600 w-[120px] h-[50px]"
                // startIcon={<Add />}
                onClick={handleAddNew}
                data-modal-toggle="add-modal"
              >
                Add Subscription
              </Button>
            </Stack>
          </Stack>
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.Header} sx={{ width: column.Header === 'ID' ? '40px' : 'auto' }}>
                    {column.Header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData?.map((row) => (
                // {paginatedData.map((row, i) => (

                <TableRow key={row._id}>
                  <TableCell className="" style={{ width: '25%' }}>
                    {/* {columns.accessor === 'subscriptionName' & */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar variant="rounded" color="secondary" size="sm" src={`${row?.picture}`} />

                      <Typography>{row?.institutionId || 'NA'}</Typography>
                    </Stack>
                    {/* } */}
                  </TableCell>
                  <TableCell style={{ width: '25%' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography>{row?.institutionName || 'NA'}</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {/* Pagination */}

              {/* <=====--------------- */}
            </TableBody>
          </Table>
          {/* Add Pagination */}
          <div className="float-left mt-2 py-2">
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={filteredData.length}
              pageSize={rowsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>

          {/* <PaginationComponent page={page} setPage={setPage} filteredData={filteredData} rowsPerPage={rowsPerPage} /> */}
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

    const AllSchools = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const data = useMemo(() => makeData(200), []);
    const [open, setOpen] = useState(false);
    const [subscription, setsubscription] = useState(null);
    const [subscriptionDeleteId, setsubscriptionDeleteId] = useState('');
    const [add, setAdd] = useState(false);
    const [userData, setUserData] = useState([]);

    const handleAdd = () => {
        setAdd(!add);
        if (subscription && !add) setsubscription(null);
    };

    useEffect(() => {
        const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            // navigate("/");
        } else {
            try {
            const response = await axios.get(`${server}/api/school/school/1234`, {
                headers: {
                Authorization: `Bearer ${token}`
                }
            });
            console.log('reosne', response);
            if (response.data) {
                setUserData(response.data.data);
                console.log('api data---', response.data.data);
            } else {
                console.error('Empty response data or unexpected format');
            }
            } catch (error) {
            console.error('Error fetching users:', error);
            }
        }
        };
        fetchUsers();
    }, []);

    const columns = useMemo(
        () => [
        
        { Header: 'Institution ID', accessor: 'institutionId' },
        { Header: 'Institution Name', accessor: 'institutionName' },

        ],
        []
    );

    return (
        <MainCard content={false}>
        <ScrollX>
            <ReactTable columns={columns} data={userData} setUserData={setUserData} />
            {/* <SearchBar filterText={filterText} setFilterText={setFilterText} handleSearchChange={handleSearchChange} /> */}
        </ScrollX>
        </MainCard>
    );
    };

    // Function to handle closing the delete dialog

    export default AllSchools;
