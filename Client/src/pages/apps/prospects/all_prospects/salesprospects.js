import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  Typography,
  Drawer,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Tooltip
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '../../components/Searchbar';
import { useNavigate } from 'react-router';
import axios from 'axios';
import MainCard from 'components/MainCard';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import { Modal } from '@mui/material';
import { Setting } from 'iconsax-react';
import SortIcon from '../../../../assets/images/icons/sort-icon.jpeg';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  ArrowDownward as ArrowDown,
  ArrowUpward,
  Download,
  DownloadDone,
  // FilterAlt as FilterAltIcon,
  Edit,
  // ExpandLess as ExpandLessIcon,
  // ExpandMore as ExpandMoreIcon,
  // KeyboardArrowRight as KeyboardArrowRightIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Whatsapp
} from '@mui/icons-material';
import PaginationComponent from 'pages/apps/components/Pagination';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllProspects } from 'pages/utils/prospects/api';

const KanbanBoard = () => {
  const navigate = useNavigate();
  const server = process.env.REACT_APP_API_URL;
  const [sortOrder, setSortOrder] = useState('');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [ImportModalOpen, setImportModalOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [SettingModalOpen, setSettingModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  // const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const [isExecutiveDropdownOpen, setIsExecutiveDropdownOpen] = useState(false);
  const [isAppointmentsDropdownOpen, setIsAppointmentsDropdownOpen] = useState(false);
  const [isLeadStatusDropdownOpen, setIsLeadStatusDropdownOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [prospectsData, setprospectsData] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const getProspects = async () => {
      const prospect = await getAllProspects();
      setprospectsData(prospect?.data);
  console.log('prospects m aaya-->',prospect)
    };
    getProspects();
  }, []);

  useEffect(() => {
    setFilteredData(prospectsData?.filter((lead) => lead.company?.toLowerCase().includes(filterText?.toLowerCase())));
  }, [filterText, prospectsData]);

  const toggleDropdown = (event, id) => {
    event.stopPropagation();
    setDropdownOpen(dropdownOpen === id ? null : id);
  };
  const handleClickOutside = () => {
    setIsDropdownOpen(null);
  };

  const handleImportModalOpen = () => setImportModalOpen(true);
  const handleSettingModalOpen = () => setSettingModalOpen(true);
  const initialStages = ['New', 'Discussion', 'Samples Given', 'Estimate Given', 'Done'];
  const toggleFilterDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  // Create state for stages
  const [stages, setStages] = useState(initialStages);

  // Handle change for each TextField
  const handleChange = (index, newValue) => {
    const updatedStages = [...stages];
    updatedStages[index] = newValue;
    setStages(updatedStages);
  };
  const handleClose = () => {
    setImportModalOpen(false);
    setSettingModalOpen(false);
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
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

  const toggleFilterDrawer = () => {
    setIsFilterDrawerOpen(!isFilterDrawerOpen);
  };

  const handleFilterClick = (filter) => {
    if (filter === 'active') setIsSubDropdownOpen((prev) => !prev);

    if (filter === 'executive') setIsExecutiveDropdownOpen((prev) => !prev);

    if (filter === 'appointments') setIsAppointmentsDropdownOpen((prev) => !prev);

    if (filter === 'leadStatus') setIsLeadStatusDropdownOpen((prev) => !prev);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    setIsSortDropdownOpen(false);
  };

  // const handleFilterClick = (filter) => {
  //   setActiveFilter(filter);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [columns, setColumns] = useState({
    new: [],
    discussion: [],
    samplesGiven: [],
    estimateShared: [],
    done: []
  });
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   const fetchProspects = async () => {
  //     try {
  //       const stages = ['new', 'discussion', 'samplesGiven', 'estimateShared', 'done'];
  //       const newColumns = {};

  //       for (let stage of stages) {
  //         const response = await axios.get(`${server}/api/prospect/getAllProspects?prospectStage=${stage}`);
  //         // console.log(response);
  //         newColumns[stage] = response.data.data.map((prospect) => prospect.name);
  //       }

  //       setColumns(newColumns);
  //     } catch (error) {
  //       console.error('Failed to fetch prospects:', error);
  //     }
  //   };

  //   fetchProspects();
  // }, [server]);

  const handleSearchChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // const newSelecteds = leads?.map((lead) => lead?.companyName);
      // setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  // const filteredData = useMemo(() => {
  //   if (!filterText) return data;
  //   return data?.filter((row) => Object.values(row)?.some((value) => value.toString().toLowerCase().includes(filterText.toLowerCase())));
  // }, [data, filterText]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceColumn = [...columns[source.droppableId]];
    const destinationColumn = [...columns[destination.droppableId]];

    const [removed] = sourceColumn.splice(source.index, 1);
    destinationColumn.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destinationColumn
    });
  };

  const getColumnBackgroundColor = (columnTitle) => {
    switch (columnTitle.toLowerCase()) {
      case 'new':
        return '#e27602';
      case 'discussion':
        return '#e69b00';
      case 'samples given':
        return '#5d4d37';
      case 'estimate shared':
        return '#008080';
      case 'done':
        return '#4da044';
      default:
        return '#FFFFFF';
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCheckClick = (event, companyName) => {
    event.stopPropagation();
    // console.log('check click--->', companyName);
    const selectedIndex = selected.indexOf(companyName);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, companyName);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const renderColumn = (columnId, columnTitle, tasks, noOfItems) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={2.4} key={columnId}>
        <Paper
          elevation={3}
          sx={{
            padding: '10px',
            minHeight: '6.5rem',
            color: '#fff',
            backgroundColor: getColumnBackgroundColor(columnTitle)
          }}
        >
          <Typography variant="h6" textAlign="center" sx={{ fontSize: '1.3rem' }}>
            {columnTitle} (<span>{noOfItems}</span>)
          </Typography>
          {/* {console.log('column title--->', columnTitle)} */}
          {!['New', 'Discussion', 'Done'].includes(columnTitle) && noOfItems === 0 && (
            <Typography variant="subtitle1" marginTop={1} sx={{ fontSize: '0.72rem' }}>
              <AddIcon /> Add prospects in {columnTitle}
            </Typography>
          )}
        </Paper>

        <Droppable droppableId={columnId}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                flexGrow: 1,
                minHeight: '200px',
                marginTop: '1rem'
              }}
            >
              {tasks &&
                tasks.map((task, index) => (
                  <Draggable key={task} draggableId={task} index={index}>
                    {(provided) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          padding: '14px 8px',
                          marginBottom: '1rem',
                          minHeight: '8rem'
                        }}
                      >
                        {task}
                      </Paper>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Grid>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'default';
      default:
        return 'primary';
    }
  };

  const paginatedData = filteredData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  console.log('paginated data---->', paginatedData);
  return (
    <>
      <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 4 }}>Sales Prospects</Typography>

      <MainCard content={false} sx={{ padding: '20px' }}>
        {/* Search and Enter Prospect Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ width: '500px' }}>
            <SearchBar filterText={filterText} handleSearchChange={handleSearchChange} />
          </div>

          <div className="flex justify-end gap-2">
            <button
              // onClick={() => navigate(`/apps/create-prospects`)}
              className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white font-poppins p-2"
              onClick={handleImportModalOpen}
              // variant="contained"
              // color="warning"
              // sx={{
              //   textTransform: 'none',
              //   fontWeight: 'bold'
              // }}
            >
              <CallReceivedIcon />
            </button>

            <Modal open={ImportModalOpen} onClose={handleClose}>
              <Box
                className="bg-white p-14 rounded-lg shadow-lg"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: { xs: '90%', md: '500px' },
                  height: { md: '25vh' },
                  boxShadow: 24
                }}
              >
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'gray'
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h4" component="h2" className="mb-4 flex justify-center">
                  Import Prospects
                </Typography>
                <div className="flex justify-center gap-2">
                  <button
                    className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white font-poppins w-[20vw] px-4 py-3"
                    onClick={() => {
                      // Handle download template
                    }}
                  >
                    Download Template
                  </button>
                  <button
                    className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white font-poppins w-[20vw] px-4 py-3"
                    onClick={() => {
                      // Handle upload excel
                    }}
                  >
                    Upload Excel
                  </button>
                </div>
              </Box>
            </Modal>
            <button
              onClick={() => navigate(`/apps/create-prospects`)}
              className="bg-red-600 rounded-md text-white font-semibold hover:bg-red-700 hover:text-white font-poppins p-2"
              // variant="contained"
              // color="warning"
              // sx={{
              //   textTransform: 'none',
              //   fontWeight: 'bold'
              // }}
            >
              Enter Prospect
            </button>

            <button
              // onClick={() => navigate(`/apps/create-prospects`)}
              onClick={handleSettingModalOpen}
              className="bg-blue-600 rounded-md text-white font-semibold hover:bg-blue-700 hover:text-white font-poppins p-2"
            >
              <Setting />
            </button>

            {/* Setting Modal */}
            <Modal open={SettingModalOpen} onClose={handleClose}>
              <Box
                className="bg-white p-14 rounded-lg shadow-lg"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: { xs: '90%', md: '500px' },
                  height: { md: '54vh' },
                  boxShadow: 24
                }}
              >
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'gray'
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h4" component="h2" className="mb-4 flex justify-center">
                  Sales Funnel Stages
                </Typography>

                {stages.map((stage, index) => (
                  <TextField
                    key={index}
                    value={stage}
                    onChange={(e) => handleChange(index, e.target.value)}
                    fullWidth
                    // label={stage}
                    variant="outlined"
                    className="mb-2"
                  />
                ))}
                <div className="flex justify-center">
                  <button className="bg-green-600 w-[10vw] px-4 py-3 mb-2 text-white">Save</button>
                </div>
              </Box>
            </Modal>
          </div>
        </div>
        <Divider sx={{ marginY: '1rem' }} />

        {/* Sort and Filter */}
        <div className="overflow-x-auto bg-background">
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.7rem', paddingBottom: '0.7rem' }}
          >
            <Box>
              <button
                onClick={toggleSortDropdown}
                style={{
                  border: '1px solid #e8e8e8',
                  color: '#262a2a',
                  padding: '6px 10px',
                  boxShadow: '0px 4px 4px 0px rgba(219, 219, 219, 0.2509803922)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
                className="rounded"
              >
                <Box sx={{ height: '14px', width: '14px' }}>
                  <img src={SortIcon} alt="Sort Icon" className="h-full w-full" />
                </Box>
                <Typography>Sort</Typography>
                {isSortDropdownOpen ? (
                  <Box>
                    <ExpandLessIcon />
                  </Box>
                ) : (
                  <Box>
                    <ExpandMoreIcon />
                  </Box>
                )}
              </button>
              {isSortDropdownOpen && (
                <Box
                  className="m-3"
                  sx={{
                    position: 'absolute',
                    zIndex: 1300,
                    left: 0,
                    top: '140px',
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Box>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={sortOrder === 'Ascending'}
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
                        padding: '1px 8px',
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
                          checked={sortOrder === 'Descending'}
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
                        padding: '1px 8px',
                        '&:hover': {
                          backgroundColor: '#f5f5f4',
                          borderRadius: '5px'
                        }
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
            <Box>
              <button
                onClick={toggleFilterDropdown}
                style={{
                  border: '1px solid #e8e8e8',
                  color: '#262a2a',
                  padding: '6px 10px',
                  boxShadow: '0px 4px 4px 0px rgba(219, 219, 219, 0.2509803922)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                className="rounded"
              >
                <FilterAltIcon sx={{ fontSize: '14px', marginRight: '4px' }} />
                Filter
              </button>
            </Box>
          </Box>

          {isDropdownOpen && (
            <Box
              sx={{
                position: 'absolute',
                top: '140px',
                right: '0',
                width: '25%',
                zIndex: '1000',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                padding: '10px'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <FilterAltIcon sx={{ marginRight: '1rem' }} />
                Filter
              </Typography>
              <Button
                variant="text"
                onClick={() => handleFilterClick('active')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: '100%',
                  padding: '10px 15px',
                  textAlign: 'left',
                  backgroundColor: 'white',
                  color: 'black',
                  marginTop: '5px'
                }}
              >
                {isSubDropdownOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                Active Leads
              </Button>
              {isSubDropdownOpen && (
                <Box sx={{ padding: '10px 20px', backgroundColor: '#f7f6fb', borderRadius: '8px', marginLeft: '20px', marginTop: '10px' }}>
                  <Box>
                    <FormControlLabel control={<Checkbox />} label="Active" />
                  </Box>
                  <Box>
                    <FormControlLabel control={<Checkbox />} label="Inactive" />
                  </Box>
                </Box>
              )}
              <Button
                variant="text"
                onClick={() => handleFilterClick('executive')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: '100%',
                  padding: '10px 15px',
                  textAlign: 'left',
                  backgroundColor: 'white',
                  color: 'black',
                  marginTop: '5px'
                }}
              >
                {isExecutiveDropdownOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                By Executive
              </Button>
              {isExecutiveDropdownOpen && (
                <Box sx={{ padding: '10px 20px', backgroundColor: '#f7f6fb', borderRadius: '8px', marginLeft: '20px', marginTop: '10px' }}>
                  <Box>
                    <FormControlLabel control={<Checkbox />} label="Executive 1" />
                  </Box>
                  <Box>
                    <FormControlLabel control={<Checkbox />} label="Executive 2" />
                  </Box>
                  <Box>
                    <FormControlLabel control={<Checkbox />} label="Executive 3" />
                  </Box>
                </Box>
              )}
              <Button
                variant="text"
                onClick={() => handleFilterClick('appointments')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: '100%',
                  padding: '10px 15px',
                  textAlign: 'left',
                  backgroundColor: 'white',
                  color: 'black',
                  marginTop: '5px'
                }}
              >
                {isAppointmentsDropdownOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                Select Appointments
              </Button>
              {isAppointmentsDropdownOpen && (
                <Box sx={{ padding: '10px 20px', backgroundColor: '#f7f6fb', borderRadius: '8px', marginLeft: '20px', marginTop: '10px' }}>
                  <Box>
                    <FormControlLabel control={<Checkbox />} label="Appointment 1" />
                  </Box>
                  <Box>
                    <FormControlLabel control={<Checkbox />} label="Appointment 2" />
                  </Box>
                  <Box>
                    <FormControlLabel control={<Checkbox />} label="Appointment 3" />
                  </Box>
                </Box>
              )}
              <Button
                variant="text"
                onClick={() => handleFilterClick('leadStatus')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: '100%',
                  padding: '10px 15px',
                  textAlign: 'left',
                  backgroundColor: 'white',
                  color: 'black',
                  marginTop: '5px'
                }}
              >
                {isLeadStatusDropdownOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                Lead Status
              </Button>
              {isLeadStatusDropdownOpen && (
                <Box sx={{ padding: '10px 20px', backgroundColor: '#f7f6fb', borderRadius: '8px', marginLeft: '20px', marginTop: '10px' }}>
                  <Box>
                    <FormControlLabel control={<Checkbox />} label="Closed" />
                  </Box>
                  <Box>
                    <FormControlLabel control={<Checkbox />} label="Not Contacted" />
                  </Box>
                  <Box>
                    <FormControlLabel control={<Checkbox />} label="Contacted" />
                  </Box>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, paddingX: '15px', gap: '2.5rem' }}>
                <Button variant="outlined" color="secondary" fullWidth>
                  Reset
                </Button>
                <Button variant="contained" fullWidth className="bg-red-600 hover:bg-red-700 duration-300 transition-colors">
                  Filter
                </Button>
              </Box>
            </Box>
          )}
          <Box
            sx={{
              paddingX: '0.2rem',
              paddingY: '1rem',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: 'none'
            }}
          >
            <Table
              sx={{
                borderRadius: '8px',
                border: '1px solid #d0d0d0',
                boxShadow: '10px'
              }}
            >
              <TableHead
                sx={{
                  background: '#fafafa',
                  '& th': {
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    borderBottom: 'none',
                    height: '32px', // Reduced height
                    padding: '4px', // Reduced padding
                    lineHeight: '1.2' // Adjust line-height if necessary
                  }
                }}
              >
                <TableRow
                  sx={{
                    height: '32px' // Set the height for the entire row
                  }}
                >
                  <TableCell padding="checkbox" sx={{ padding: '4px' }}>
                    <Checkbox
                      color="default"
                      onChange={handleSelectAllClick}
                      sx={{
                        color: '#333333',
                        '&.Mui-checked': {
                          color: '#0073e6',
                          transition: 'background-color 0.3s ease'
                        }
                      }}
                    />
                  </TableCell>
                  {[
                    'New',
                    'Discussion',
                    'Samples Given',
                    'Deal Name',
                    'Stage',
                    'Deal Value',
                    'Expected Close Date',
                    'Agent Name',
                    'Status',
                    'Action'
                  ].map((heading) => (
                    <TableCell key={heading} align="center" sx={{ padding: '4px' }}>
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody sx={{ borderRadius: '0 0 15px 15px', overflow: 'hidden', cursor: 'pointer' }}>
                {paginatedData?.length > 0 &&
                  paginatedData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((prospect, idx) => {
                    const isLastItem = idx === paginatedData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length - 1;
                    return (
                      <TableRow
                        hover
                        key={prospect?._id}
                        selected={selected.indexOf(prospect.companyName) !== -1}
                        onClick={() => navigate(`/apps/edit-prospects/${prospect._id}`)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selected.indexOf(prospect.companyName) !== -1}
                            onClick={(event) => handleCheckClick(event, prospect?.company)}
                          />
                        </TableCell>
                        <TableCell className="font-poppins text-center">{prospect?.company}</TableCell>

                        <TableCell className="font-poppins text-center">{prospect?.discussion}</TableCell>
                        <TableCell className="text-center">{prospect?.sampleGiven ? 'Yes' : 'No'}</TableCell>
                        <TableCell className="text-center">
                          {prospect?.firstName}&nbsp;{prospect?.lastName}
                        </TableCell>
                        <TableCell className="text-center">
                          <Chip
                            label={prospect?.prospectStage}
                            sx={{
                              backgroundColor: prospect.status === 'Closed' ? '#4caf50' : '#f44336',
                              color: '#ffffff',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              borderRadius: '12px'
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-center">{prospect?.businessProspectAnnual}</TableCell>
                        <TableCell className="text-center">{prospect?.closedate}</TableCell>
                        <TableCell className="text-center">{prospect?.executive}</TableCell>
                        <TableCell className="text-cente.r">{prospect?.status}</TableCell>

                     
                        {/* <TableCell className="font-poppins text-center">{lead?.lastInteractions['0']?.executiveName}</TableCell> */}
                        {/* <TableCell className="font-poppins text-center"> */}
                          {/* {lead.lastInteractions?.[0]?.date ? format(new Date(lead.lastInteractions[0].date), 'dd-MM-yy') : 'N/A'} */}
                        {/* </TableCell> */}
                        <TableCell className="font-poppins text-center">
                          <div className="relative">
                            <button
                              onClick={(e) => toggleDropdown(e, prospect?._id)}
                              className="p-1 rounded-md text-[15px] ml-3 border shadow-md"
                            >
                              <MoreVertIcon />
                            </button>
                            {dropdownOpen === prospect?._id && (
                              <div
                                className="absolute top-9 right-19 w-38 -translate-x-5 bg-white rounded-lg shadow-lg z-10"
                                style={isLastItem ? { transform: 'translate(-18px,-123px)' } : {}}
                                // style={{ transform: 'translateY(-10px)' }}
                              >
                                <ul className="py-3">
                                  {/* <li
                                  className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/apps/add-lead`);
                                  }}
                                >
                                  <VisibilityIcon className="text-[20px]" />
                                  <Typography>View</Typography>
                                </li> */}
                                  <li
                                    className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                    // onClick={() => navigate(`/apps/edit-prospects/${prospect?._id}`)}
                                    onClick={() => navigate(`/apps/view-prospects/${prospect?._id}`)}
                                  >
                                    <EditIcon className="text-[20px] text-blue-700" />
                                    <Typography>Edit</Typography>
                                  </li>
                                  <li
                                    className="flex gap-2 align-middle hover:bg-gray-100 cursor-pointer text-sm px-3 py-1 mx-3 rounded-sm"
                                    onClick={(event) => handleDeleteConfirmation(event, prospect?._id)}
                                  >
                                    <DeleteIcon className="text-[20px] text-red-500" />
                                    <Typography>Delete</Typography>
                                  </li>
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
          </Box>
        </div>

        {/* Drag and Drop Kanban Columns */}
        {/* <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={3}>
            {renderColumn('new', 'New', columns.new, columns.new.length)}
            {renderColumn('discussion', 'Discussion', columns.discussion, columns.discussion.length)}
            {renderColumn('samplesGiven', 'Samples Given', columns.samplesGiven, columns.samplesGiven.length)}
            {renderColumn('estimateShared', 'Estimate Shared', columns.estimateShared, columns.estimateShared.length)}
            {renderColumn('done', 'Done', columns.done, columns.done.length)}
          </Grid>
        </DragDropContext> */}
        <PaginationComponent
          // count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </MainCard>
    </>
  );
};

export default KanbanBoard;
