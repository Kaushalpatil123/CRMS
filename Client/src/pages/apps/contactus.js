// Import necessary dependencies and components
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  alpha,
  useTheme,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  Typography
} from '@mui/material';
import {
  useFilters,
  useGlobalFilter,
  useTable,
  usePagination
} from 'react-table';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import PaginationComponent from './components/Pagination'; // Update the path accordingly
import SearchBar from './components/Searchbar'; // Update the path accordingly

const server = process.env.REACT_APP_API_URL;

// Define the ReactTable component
function ReactTable({ columns, data, fetchData }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const filterTypes = useMemo(() => ({}), {});

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, pageIndex, pageSize },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['avatar', 'email'] },
    },
    useGlobalFilter,
    useFilters,
    usePagination
  );

  useEffect(() => {
    if (matchDownSM) {
      setHiddenColumns(['age', 'contact', 'visits', 'email', 'status', 'avatar']);
    } else {
      setHiddenColumns(['avatar', 'email']);
    }
  }, [matchDownSM]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Stack spacing={3}>
        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          {/* New SearchBar Component */}
          <SearchBar filterText={globalFilter} setFilterText={setGlobalFilter} handleSearchChange={(e) => setGlobalFilter(e.target.value || undefined)} />
        </Stack>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column) => (
                  <TableCell key={column.id} {...column.getHeaderProps([{ className: column.className }])}>
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              const rowProps = row.getRowProps();

              return (
                <React.Fragment key={row.id}>
                  <TableRow
                    {...rowProps}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit'
                    }}
                  >
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                </React.Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              {/* New Pagination Component */}
              <TableCell sx={{ p: 2, py: 3 }} colSpan={4}>
                <PaginationComponent
                  page={pageIndex}
                  setPage={gotoPage}
                  filteredData={rows}
                  rowsPerPage={pageSize}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

// PropTypes for the ReactTable component
ReactTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired,
};

// Define the ContactUs component
const ContactUs = () => {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const fetchData = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`${server}/api/contact-us/contact/getall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setData(response.data.contacts);
      } else {
        console.error('Empty response data or unexpected format');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: (originalRow, rowIndex) => rowIndex + 1,
        className: 'cell-center',
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ row }) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack spacing={0}>
                <Typography variant="subtitle1">{values.name}</Typography>
                <Typography color="text.secondary">{values.email}</Typography>
              </Stack>
            </Stack>
          );
        },
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone Number',
        accessor: 'phoneNumber',
      },
      {
        Header: 'Query',
        accessor: 'Query',
      },
    ],
    []
  );

  const theme = useTheme();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['avatar', 'email'] },
    },
    useGlobalFilter,
    useFilters,
    usePagination
  );

  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (matchDownSM) {
      setHiddenColumns(['age', 'contact', 'visits', 'email', 'status', 'avatar']);
    } else {
      setHiddenColumns(['avatar', 'email']);
    }
  }, [matchDownSM]);

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={data} fetchData={fetchData} />
      </ScrollX>
    </MainCard>
  );
};

export default ContactUs;
