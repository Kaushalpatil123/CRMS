// Import necessary dependencies and components
import React, { useEffect, useMemo, Fragment, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useTable } from 'react-table';
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
  usePagination
} from 'react-table';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport } from 'components/third-party/ReactTable';
import PaginationComponent from '../components/Pagination'; // Update the path accordingly
import SearchBar from '../components/Searchbar'; // Update the path accordingly
const server = process.env.REACT_APP_API_URL;

// New component to display invoices details in a nested table
const InvoiceDetailsTable = ({ invoiceDetails }) => {
  if (!invoiceDetails) {
    return null;
  }

  const {
    invoiceId,
    dueDate,
    status,
    to,
    grandTotal,
    discount,
    taxAmount,
    totalBeforeTax,
    discountAmount,
    currency,

    details = [],
  } = invoiceDetails;

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Invoice ID:</TableCell>
          <TableCell>{invoiceId || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Username:</TableCell>
          <TableCell>{to?.name || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Email:</TableCell>
          <TableCell>{to?.email || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Phone No:</TableCell>
          <TableCell>{to?.number || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>City:</TableCell>
          <TableCell>{to?.city || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Address:</TableCell>
          <TableCell>{to?.address || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Status:</TableCell>
          <TableCell>{status || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Due Date:</TableCell>
          <TableCell>{dueDate || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2}>
            <Typography variant="h6">Items</Typography>
            <ul>
              {details.map((item, index) => (
                <li key={index}>
                  <Typography variant="body2" style={{ fontSize: '14px' }}>
                    Item:  {item?.name || 'N/A'} ,  Description:  {item?.description || 'N/A'} , Price:  {item?.price || 'N/A'} ,
                    Quantity:  {item?.qty || 'N/A'} , Id:  {item?._id || 'N/A'}
                  </Typography>
                </li>
              ))}
            </ul>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Currency:</TableCell>
          <TableCell>{currency || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Total Before Tax:</TableCell>
          <TableCell>{totalBeforeTax || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
        </TableRow>
        <TableRow>
          <TableCell>Discount Percentage:</TableCell>
          <TableCell>{discount || 'N/A'}% </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Discount Amount:</TableCell>
          <TableCell>{discountAmount || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Tax Amount:</TableCell>
          <TableCell>{taxAmount || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Grand Total :</TableCell>
          <TableCell>{grandTotal || 'N/A'}</TableCell>
        </TableRow>

      </TableBody>
    </Table>
  );
};


// AllInvoicesTable component with modifications
function AllInvoicesTable({ columns, data, setInvoices }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    rows,
    page,
    gotoPage,
    state: { globalFilter, pageIndex, pageSize },
    setGlobalFilter,
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

  const [expandedRows, setExpandedRows] = useState([]);


  const handleToggleRowExpansion = (rowId) => {
    setExpandedRows((prevExpandedRows) => {
      const isExpanded = prevExpandedRows.includes(rowId);
      return isExpanded
        ? prevExpandedRows.filter((id) => id !== rowId)
        : [...prevExpandedRows, rowId];
    });
  };

  useEffect(() => {
    if (matchDownSM) {
      setHiddenColumns(['age', 'contact', 'visits', 'email', 'status', 'avatar']);
    } else {
      setHiddenColumns(['avatar', 'email']);
    }
  }, [matchDownSM]);


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
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={2}>
            <CSVExport data={data} filename={'invoice-list.csv'} />
          </Stack>
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

                <TableCell>Action</TableCell>
              </TableRow>

            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              const rowProps = row.getRowProps();

              const isExpanded = expandedRows.includes(row.id);

              return (
                <Fragment key={row.id}>
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
                    <TableCell>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'left',
                        }}
                      >
                        <div
                          onClick={() => handleToggleRowExpansion(row.id)}
                          style={{
                            cursor: 'pointer',
                            padding: '6px 12px',
                            backgroundColor: '#3f51b5',
                            color: 'white',
                            borderRadius: '4px',
                          }}
                        >
                          {isExpanded ? 'Hide Details' : 'View Details'}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1}>
                        <InvoiceDetailsTable invoiceDetails={row.original} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              {/* New Pagination Component */}
              <TableCell sx={{ p: 2, py: 3 }} colSpan={columns.length + 1}>
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

AllInvoicesTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired,
};

// Define the AllInvoices component
const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);



  useEffect(() => {
    const fetchData = async () => {

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${server}/api/invoice/all-invoices`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.data && response.data.invoices) {
            const reversedInvoices = response.data.invoices.reverse().map(invoice => ({
              ...invoice,
              url: invoice.URL || ''
            }));
            setInvoices(reversedInvoices);
            console.log('response custom invoice invoices--->', reversedInvoices);
          }
          else {
            console.error('Empty response data or unexpected format');
          }
        } catch (error) {
          console.error('Error fetching invoices:', error);
        }
      };
    }
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Invoice ID',
        accessor: 'invoiceId',
        className: 'cell-center'
      },
      {
        Header: 'Username',
        accessor: 'to.name'
      },
      {
        Header: 'Email',
        accessor: 'to.email'
      },
      {
        Header: 'Status',
        accessor: 'status'
      },
      {
        Header: 'URL', // Column header
        accessor: 'url', // Accessor for the URL data
        Cell: ({ row }) => (
          // Render the URL value
          <a
            href={row.original.invoiceURL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            Invoice URL
          </a>
        )
      }
    ],
    []
  );
    
    return (
      <MainCard content={false}>
    
      <ScrollX>
        <AllInvoicesTable columns={columns} data={invoices} setInvoices={setInvoices} />
      </ScrollX>
    </MainCard>
  );
}

export default AllInvoices;
