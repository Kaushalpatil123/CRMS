import {
  Box,
  Button,
  Checkbox,
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
import { ArrangeVertical, FilterEdit } from 'iconsax-react';
import { getUser } from 'pages/utils/user_management/api';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';

const App = () => {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);

  const columns = useMemo(
    () => [
      { Header: 'Login Time', accessor: 'Login Time' },
      { Header: 'Logout Time', accessor: 'Logout Time' },
      { Header: 'Work Time (mins)', accessor: 'Work Time (mins)' },
      { Header: 'Break Time (mins)', accessor: 'Break Time (mins)' },
      { Header: 'Break Start Time', accessor: 'Break Start Time' },
      { Header: 'Break End Time', accessor: 'Break End Time' },
      { Header: 'Reason', accessor: 'Reason' },
      { Header: 'Idle Time', accessor: 'Idle Time' }
    ],
    []
  );

  const fetchData = async () => {
    const { id } = location.state;
    const token = localStorage.getItem('token');
    try {
      const response = await getUser(id, token);
      setData(response);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format date function remains unchanged
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = {
      month: 'short',
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
  function toTitleCase(str) {
    if (!str) return 'N/A';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  

  return (
    <Box>
      {loading && <Typography>Loading...</Typography>}
      {data ? (
        <>
          {/* User Information Section */}
          <Box className="mb-4 p-4 border rounded bg-gray-100">
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 1 }}>USER OVERVIEW</Typography>
            <div className="bg-white shadow-lg rounded-lg p-6 mx-auto">
              <p className="font-poppins text-gray-700 text-lg mb-2 flex items-center">
                <strong className="mr-2">👤 User Name:</strong>
                <span className="text-gray-500">{data?.userName ? toTitleCase(data.userName) : 'N/A'}</span>
                </p>
              <p className="font-poppins text-gray-700 text-lg mb-2 flex items-center">
                <strong className="mr-2">🕒 Last Login Time:</strong>
                <span className="text-gray-500">{formatDate(data?.lastLoginTime)}</span>
              </p>

              <p className="font-poppins text-gray-700 text-lg mb-2 flex items-center">
                <strong className="mr-2">🚪 Last Logout Time:</strong>
                <span className="text-gray-500">
                  {data?.lastLogoutTime ? formatDate(data?.lastLogoutTime || 'Not Available') : 'Still Logged In'}
                </span>
              </p>

              <p className="font-poppins text-gray-700 text-lg mb-2 flex items-center">
                <strong className="mr-2">📶 Status:</strong>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    data?.isLoggedIn ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}
                >
                  {data?.isLoggedIn ? 'Logged In' : 'Logged Out'}
                </span>
              </p>
            </div>
          </Box>

          <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 1 }}>
            USER SESSIONS {data.sessions ? data.sessions.length : 0}
          </Typography>
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
                  //   <TableCell
                  //     key={column.accessor}
                  //     className={`text-[14px] ${column.accessor === 'status' || columns.accessor === 'action' ? 'text-center' : ''}`}
                  //     sx={{ whiteSpace: 'nowrap', fontFamily: 'inter' }}
                  //   >
                  //     {column.Header}
                  //   </TableCell>
                  <TableCell key={column.accessor}>
                    <Box className="flex items-center gap-1">
                      <Typography
                        sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
                        className={`${column.accessor === 'actions' ? 'text-center' : ''}`}
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
              {data?.sessions.map((session, index) => {
                const isLastItem = index === data.sessions.length - 1;
                const breaks = session.breaks;

                // If there are no breaks, show the session details with "N/A" for break-related fields
                if (breaks.length === 0) {
                  return (
                    <TableRow
                      key={data?._id}
                      selected={selected.indexOf(data?.userName) !== -1}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#dedede' : '#f7f7f7',
                        height: '50px',
                        minHeight: '50px'
                      }}
                    >
                      <TableCell className="border px-4 py-2 text-center"></TableCell>
                      <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                        {formatDate(session.loginTime)}
                      </TableCell>
                      <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                        {session.logoutTime ? formatDate(session.logoutTime) : 'Active'}
                      </TableCell>
                      <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                        {session.workTime}
                      </TableCell>
                      <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                        {session.breakTime}
                      </TableCell>
                      {console.log('session breaktie-->', session)}
                      <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                        NA
                      </TableCell>
                      <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                        NA
                      </TableCell>
                      {/* Empty Reason Cell */}
                      <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                        NA
                      </TableCell>
                      <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                        {session.idleTime}
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  // If there are breaks, create a row for each break
                  return breaks.map((breakDetail, breakIndex) => (
                    <React.Fragment key={breakIndex}>
                      <TableRow
                        key={`${data?._id}-${breakIndex}`}
                        selected={selected.indexOf(data?.userName) !== -1}
                        sx={{
                          backgroundColor: index % 2 === 0 ? '#dedede' : '#f7f7f7',
                          height: '50px',
                          minHeight: '50px'
                        }}
                      >
                        <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}></TableCell>
                        <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                          {breakIndex === 0 ? formatDate(session.loginTime) : ''}
                        </TableCell>
                        <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                          {breakIndex === 0 ? (session.logoutTime ? formatDate(session.logoutTime) : 'Active') : ''}
                        </TableCell>
                        <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                          {breakIndex === 0 ? session.workTime : 'NA'}
                        </TableCell>
                        <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                          {breakDetail?.duration}
                          {console.log('session ka time check--->', session)}
                        </TableCell>
                        <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                          {formatDate(breakDetail.startTime)}
                        </TableCell>
                        <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                          {formatDate(breakDetail.endTime)}
                        </TableCell>
                        {/* Display the name of the break in the Reason column */}
                        <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                          {/* {console.log('session worktime-- idletime---->',session)} */}
                          {breakDetail.nameOfBreak}
                        </TableCell>

                        <TableCell className="font-inter text-[13px]" sx={{ fontWeight: 400 }}>
                          {console.log('session worktime-- idletime---->', session)}
                          {session?.idleTime}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ));
                }
              })}
            </TableBody>
          </Table>
        </>
      ) : (
        <Box className="mb-4 p-4 border rounded bg-gray-100">
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 1 }}>User LoggedIn History Not Available</Typography>
          <div className="bg-white shadow-lg rounded-lg p-6 mx-auto">
            <p className="font-poppins text-gray-700 text-lg mb-2 flex items-center">
              <strong className="mr-2">👤 User Name:</strong>
              <span className="text-gray-500">{data?.userName || 'Not Available'}</span>
            </p>
            <p className="font-poppins text-gray-700 text-lg mb-2 flex items-center">
              <strong className="mr-2">🕒 Last Login Time:</strong>
              <span className="text-gray-500">{formatDate(data?.lastLoginTime || 'Not Available')}</span>
            </p>
            <p className="font-poppins text-gray-700 text-lg mb-2 flex items-center">
              <strong className="mr-2">🚪 Last Logout Time:</strong>
              <span className="text-gray-500">
                {data?.lastLogoutTime ? formatDate(data?.lastLogoutTime || 'Not Available') : 'Still Logged In'}
              </span>
            </p>
            <p className="font-poppins text-gray-700 text-lg mb-2 flex items-center">
              <strong className="mr-2">📶 Status:</strong>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  data?.isLoggedIn ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}
              >
                {data?.isLoggedIn ? 'Logged In' : 'Logged Out'}
              </span>
            </p>
          </div>
        </Box>
      )}
    </Box>
  );
};

export default App;
