import { useEffect, useMemo, useState, useRef } from 'react';
import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Box,
  Modal,
  Typography,
  TextField,
  Grid,
  IconButton,
  Card
} from '@mui/material';
import MainCard from 'components/MainCard';
import {
  ArrowUpward,
  Delete,
  DeleteOutline,
  DoneAll,
  Download,
  DownloadDone,
  LaunchOutlined,
  Mail,
  MailOutline,
  TextFields
} from '@mui/icons-material';
import SearchBar from '../components/Searchbar';
import PaginationComponent from '../components/Pagination';

import { useNavigate } from 'react-router';
import { ArrowDown, Call, Edit, Edit2, Message, Notepad, Whatsapp } from 'iconsax-react';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import { DeleteLead, EditLeadStatus, EditParticularLead, getAllLeads, getParticularLead } from 'pages/utils/leads/api';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import toast, { Toaster } from 'react-hot-toast';

export default function Component() {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectAll, setSelectAll] = useState(false);
  const [editNotes, seteditNotes] = useState('');
  const [editNeeds, seteditNeeds] = useState('');
  const [editLastInteraction, seteditLastInteraction] = useState('');
  const [editNextAction, seteditNextAction] = useState('');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isActive, setIsActive] = useState();
  const [OpenContactModal, setOpenContactModal] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [LeadsId, setLeadsId] = useState();
  const [addReason, setaddReason] = useState('');
  const editNeedsRef = useRef(null);

  const handleContactModalOpen = () => setOpenContactModal(true);
  const handleContactModalClose = () => setOpenContactModal(false);
  const handleShowContactForm = () => setShowContactForm(true);
  const server = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleOpenStatusModal = () => {
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
  };

  const handleToggleStatus = (id) => {
    // setIsActive(!isActive);
    console.log('leads id------sds--->', id);
    handleUpdateStatus(id);
    handleCloseStatusModal();
  };

  useEffect(() => {
    const getLeads = async () => {
      const AllLeads = await getAllLeads();
      console.log('Leads data---->', AllLeads);
      setLeads(AllLeads);
    };
    getLeads();
  }, []);

  const [selected, setSelected] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [selectCheckbox, setselectCheckbox] = useState(false);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = leads.map((n) => n.companyName);
      setSelected(newSelecteds);
      setSelectedValue(leads);
      return;
    }
    setSelected([]);
    setSelectedValue([]);
  };

  const filteredData = useMemo(() => {
    // console.log("this is rowData", rowData);
    if (!filterText) return leads; // Using rowData as initial data
    return leads?.filter((row) => Object.values(row)?.some((value) => value.toString().toLowerCase().includes(filterText.toLowerCase())));
  }, [leads, filterText]);

  const handleSearchChange = (event) => {
    setFilterText(event.target.value);
  };

  const CSVExport = (data, filename) => {
    if (!data.length) {
      console.error('No data available for export.');
      return;
    }

    // Extract headers
    const headers = Object.keys(data[0]).join(',');
    // Convert data rows to CSV string
    const csvContent = data.map((item) => Object.values(item).join(',')).join('\n');
    // Combine headers and rows
    const csvData = `${headers}\n${csvContent}`;

    // Create a Blob from the CSV content
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);

    // Append the link to the document and trigger the click
    document.body.appendChild(link);
    link.click();
    // Remove the link element from the document
    document.body.removeChild(link);
  };

  const handleCheckClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
    const selectedRowData = leads.filter((row) => newSelected.includes(row.companyName));
    setSelectedValue(selectedRowData);
  };

  const handleExportCSV = () => {
    const dataToExport = selectedValue.length > 0 ? selectedValue : leads;
    CSVExport(dataToExport, 'leads.csv');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // edit modal

  const [editModal, setEditModal] = useState({
    open: false,
    details: null
  });

  const [detailsModal, setdetailsModal] = useState({
    open: false,
    details: null
  });

  const [importModal, setimportModal] = useState({
    open: false,
    details: null
  });

  const handleDetails = (details) => {
    setdetailsModal({
      open: true,
      details: { ...details }
    });
    console.log('leads id aayi--->', details?._id);
    setLeadsId(details?._id); // Save the ID to state
    seteditNotes(details?.notes);
    seteditNeeds(details?.requirements);
    seteditLastInteraction(details?.lastInteraction?.description);
    seteditNextAction(details?.nextInteraction?.description);
    setIsActive(details?.isactive);
    console.log('details last interaction', details);

    // Pass the ID directly to getLead function
    getParticularLead(details?._id);
  };

  const EditLeads = async (id) => {
    console.log('check modal open leads id', id);
    const requestData = {
      requirements: editNeeds,
      notes: editNotes,
      lastInteraction: {
        description: editLastInteraction
      },
      nextInteraction: {
        description: editNextAction
      }
    };
    try {
      const editedLead = await EditParticularLead(id, requestData);
      console.log('Leads edit data particular wala---->', editedLead);
      // Update the state with the new lead data
      const AllLeads = await getAllLeads();
      setLeads(AllLeads);
      // Close the modal after fetching the lead
      setdetailsModal({ open: false, details: null });
      // getAllLeads();
      toast.success('Lead Updated Successfully');
    } catch (error) {
      console.error('Error updating lead:', error.message);
      toast.error('Error Updating Leads');
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleImportModal = (importdetails) => {
    setimportModal({
      open: true,
      importdetails: { ...importdetails }
    });
  };

  const handleDetailsModalClose = () => {
    setdetailsModal({
      open: false
    });
  };

  const handleImportModalClose = () => {
    setimportModal({
      open: false
    });
  };

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked);
  };

  // Update Status Active/ Inactive

  const handleUpdateStatus = async (id) => {
    console.log('active/inactive id', id);
    console.log('active/inactive status check--->', isActive);

    const requestData = {
      reason: addReason
    };

    try {
      // Check if isActive is true, then include requestData in the request
      const updateStatus = isActive ? await EditLeadStatus(id, requestData) : await EditLeadStatus(id);

      console.log('Leads edit data particular wala---->', updateStatus);

      setLeads((prevLeads) => prevLeads.map((lead) => (lead._id === id ? { ...lead, ...updateStatus } : lead)));
      setIsActive(updateStatus?.lead?.isactive);
      //  getAllLeads()
      toast.success('Status Updated Successfully');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error updating lead:', error.message);
      toast.error('Error Updating Leads');
      // Handle error (e.g., show an error message to the user)
    }
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null
  });

  // delete the leads

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const { id } = deleteConfirmation;
    console.log('id aayi delete ki--->', id);

    if (id) {
      try {
        const deleteLead = await DeleteLead(id);
        // console.log('Leads delete data particular wala---->', deleteLead);

        // Remove the deleted lead from the state
        setLeads((prevLeads) => prevLeads.map((lead) => (lead._id === id ? { ...lead, ...deleteLead } : lead)));
        // setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== id));

        // Close the modal after deleting the lead
        setDeleteConfirmation({ open: false, details: null });
        setdetailsModal({ open: false });
        toast.success('Lead Deleted Successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error('Error deleting lead:', error.message);
        toast.error('Error Deleting Lead');
        // Handle error (e.g., show an error message to the user)
      }
    }

    setDeleteConfirmation({ open: false, id: null });
  };

  return (
    <MainCard
      content={false}
      title="Leads"
      secondary={
        <>
          <div>
            <div className="flex justify-between items-center mb-4 px-4 gap-4">
              {console.log('filtertext--->', filterText)}

              <SearchBar
                filterText={filterText}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
                handleSearchChange={handleSearchChange}
              />

              <Button
                variant="outlined"
                className="hover:bg-orange-400 hover:text-white font-semibold"
                onClick={handleExportCSV}
                sx={{
                  borderColor: 'orange',
                  color: 'orange',
                  '&:hover': {
                    borderColor: 'darkorange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)'
                  }
                }}
              >
                Export
                <ArrowUpward />
              </Button>
              <Button
                variant="outlined"
                // onClick={handleImportCSV}
                className="hover:bg-orange-400 hover:text-white font-semibold"
                sx={{
                  borderColor: 'orange',
                  color: 'orange',
                  '&:hover': {
                    borderColor: 'darkorange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)'
                  }
                }}
                onClick={() => handleImportModal()} //
              >
                Import
                <Download className="ml-2 h-4 w-4" />
              </Button>
              <Button
                // onClick={handleAddLead}
                // onClick={handleAddNew}
                onClick={() => navigate(`/apps/add-lead`)}
                className="bg-orange-400 text-white font-semibold hover:bg-orange-300 hover:text-white"
              >
                Add Lead
              </Button>
            </div>
          </div>
        </>
      }
    >
      <div className="overflow-x-auto bg-background">
        {/* <Button
          // onClick={handleAddLead}
          // onClick={handleAddNew}
          // onClick={() => navigate(`/apps/add-lead`)}
          className="flex justify-center bg-orange-400 text-white font-semibold hover:bg-orange-300 hover:text-white m-3"
        >
          Active */}
        <select name="jobRole" id="jobRole" className="w-[150px] bg-white border-2 outline-none rounded-md shadow-sm p-2 m-4 text-black">
          <option value="" disabled defaultValue>
            Select Job Role
          </option>
          <option value="Mean Stack Developer">Active</option>
          <option value="Python Developer">Inactive</option>
        </select>

        <select name="jobRole" id="jobRole" className="w-[150px] bg-white border-2 outline-none rounded-md shadow-sm p-2 m-4 text-black">
          <option value="" disabled defaultValue>
            This Month
          </option>
          <option value="Mean Stack Developer">This Month</option>
          <option value="Python Developer">Inactive</option>
        </select>

        <label>
          <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} className="m-2" />
          Select All Leads
        </label>
        <br />

        <select name="source" id="source" className="w-[150px] bg-white border-2 outline-none rounded-md shadow-sm p-2 m-4 text-black">
          <option value="Select Source" disabled defaultValue>
            Select Source
          </option>
          <option value="IndiaMart">IndiaMart</option>
          {/* <option value="Python Developer">Inactive</option> */}
        </select>

        <select
          name="executive"
          id="executive"
          className="w-[152px] bg-white border-2 outline-none rounded-md shadow-sm p-2 m-4 text-black"
        >
          <option value="Select Executive" disabled defaultValue>
            Select Executive
          </option>
          <option value="Select Executive">Select Executive</option>
          {/* <option value="Python Developer">Inactive</option> */}
        </select>

        <select
          name="appointments"
          id="appointments"
          className="w-[188px] bg-white border-2 outline-none rounded-md shadow-sm p-2 m-4 text-black"
        >
          <option value="Select Appointments" disabled defaultValue>
            Select Appointments
          </option>
          <option value="Select Appointment">Select Appointments</option>
          {/* <option value="Python Developer">Inactive</option> */}
        </select>

        <select
          name="FilterProduct"
          id="FilterProduct"
          className="w-[150px] bg-white border-2 outline-none rounded-md shadow-sm p-2 m-4 text-black"
        >
          <option value="Filter Product" disabled defaultValue>
            Filter Product
          </option>
          <option value="FilterProduct">Filter Product</option>
          {/* <option value="Python Developer">Inactive</option> */}
        </select>
        <br />

        {/* <select
          name="MissedAppointments"
          id="MissedAppointments"
          className="bg-orange-400 text-white font-semibold hover:bg-orange-300 hover:text-white"
        >
          <option value="Missed Appointments" disabled defaultValue>
          Missed Appointments
          </option>
          <option value="Missed Appointments">Missed Appointments</option>
        </select>*/}

        <button className="text-orange-400 border border-orange-400 bg-transparent hover:bg-orange-400 hover:text-white py-2 px-4 rounded transition-colors duration-300 m-3">
          Missed Appointments
        </button>

        <button className="text-orange-400 border border-orange-400 bg-transparent hover:bg-orange-400 hover:text-white py-2 px-4 rounded transition-colors duration-300 m-3">
          No Appointments Set
        </button>

        <button className="text-orange-400 border border-orange-400 bg-transparent hover:bg-orange-400 hover:text-white py-2 px-4 rounded transition-colors duration-300 m-3">
          No Interactions Leads
        </button>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < leads.length}
                  checked={leads.length > 0 && selected.length === leads.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell className="font-poppins text-center">Company</TableCell>
              <TableCell className="font-poppins text-center">Contact</TableCell>
              <TableCell className="font-poppins text-center">Source</TableCell>
              <TableCell className="font-poppins text-center">POC</TableCell>
              <TableCell className="font-poppins text-center">Last Talk</TableCell>
              <TableCell className="font-poppins text-center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((lead) => (
              <TableRow
                key={lead._id}
                className="cursor-pointer"
                onClick={() => handleDetails(lead)} // Open the modal for all cells
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(lead.companyName)}
                    onClick={(event) => {
                      event.stopPropagation(); // Prevent the row's onClick from firing
                      handleCheckClick(event, lead.companyName); // Handle the checkbox click
                    }}
                  />
                </TableCell>
                <TableCell className="font-poppins text-center">{lead?.companyName}</TableCell>
                <TableCell className="font-poppins text-center">{lead?.mobile}</TableCell>
                <TableCell className="font-poppins text-center">{lead?.source}</TableCell>
                <TableCell className="font-poppins text-center">{lead?.poc}</TableCell>
                <TableCell className="font-poppins text-center">{lead?.lastInteraction?.date}</TableCell>
                <TableCell className="font-poppins flex flex-row space-x-2 justify-center mt-5">
                  <Link
                    to={`http://wa.me/${lead?.mobile}`}
                    target="__blank"
                    onClick={(event) => event.stopPropagation()} // Prevent the row's onClick from firing
                  >
                    <Whatsapp className="text-orange-500 " />
                  </Link>
                  <Edit
                    className="text-orange-500 "
                    // onClick={(e) => {
                      // e.stopPropagation();
                      
                      // handleClose();
                      // handleDetails(lead);

                    // }}
                    onClick={() => navigate(`/apps/leads/details/:id`)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {detailsModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ml-[200px]">
          <div
            className="bg-white p-10 rounded-lg max-w-[90vw] w-full mx-6 max-h-[90vh] overflow-y-auto shadow-lg"
            style={{ width: '70vw' }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-semibold text-gray-800">Crane Manufacturers</h3>
              <div className="flex justify-end w-[40vw] space-x-2">
                {console.log('details modal----->', detailsModal?.details?.mobile)} {/* Adjust space-x-1 as needed */}
                <Link
                  to={`http://wa.me/${detailsModal?.details?.mobile}`}
                  target="__blank"
                  onClick={(event) => event.stopPropagation()} // Prevent the row's onClick from firing
                >
                  <Whatsapp className="text-orange-500 " />
                </Link>
                <Call className="text-orange-500 " />
                <Link
                  onClick={(e) => {
                    e.preventDefault(); // Prevent the default behavior of the Link component
                    window.location.href = `mailto:${detailsModal?.details?.email}`; // Open the default email client
                  }}
                >
                  <Mail
                    // onClick={(e) => {
                    //   e.preventDefault(); // Prevent the default behavior of the Link component
                    //   window.location.href = `mailto:${detailsModal?.details?.email}`; // Open the default email client
                    // }}
                    className="text-orange-500 hover:cursor-pointer"
                  />
                </Link>
                <Delete
                  className="text-orange-500 hover:cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    // handleClose();
                    handleDeleteConfirmation(detailsModal?.details?._id);
                  }}
                />
                <Edit2
                  className="text-orange-500 hover:cursor-pointer"
                  onClick={() => {
                    const input = editNeedsRef.current;
                    if (input) {
                      input.focus();
                      input.setSelectionRange(input.value.length, input.value.length);
                    }
                  }}
                />
                <button className="text-orange-400 border border-orange-400 bg-transparent hover:bg-orange-400 hover:text-white px-4 rounded transition-colors duration-300">
                  <DoneAll /> Mark Prospect
                </button>
              </div>

              <button
                type="button"
                className="text-gray-500 hover:text-gray-900 rounded-full p-3 focus:outline-none"
                onClick={handleDetailsModalClose}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault();
                //   // handleDetailsModalClose()
                //   // handleEditLeads();
              }}
            >
              <div>
                <div className="flex space-x-4">
                  <button className="text-orange-400 border border-orange-400 bg-transparent hover:bg-orange-400 hover:text-white px-4 rounded transition-colors duration-300 capitalize">
                    {detailsModal?.details?.firstName} {detailsModal?.details?.lastName}
                  </button>

                  <button className="text-orange-400 border border-orange-400 bg-transparent hover:bg-orange-400 hover:text-white py-2 px-4 rounded transition-colors duration-300">
                    {detailsModal?.details?.mobile}
                  </button>

                  <Link
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default behavior of the Link component
                      window.location.href = `mailto:${detailsModal?.details?.email}`; // Open the default email client
                    }}
                    className="text-orange-400 border border-orange-400 bg-transparent hover:bg-orange-400 hover:text-white py-2 px-4 rounded transition-colors duration-300 "
                  >
                    {detailsModal?.details?.email}
                  </Link>

                  {/*--------- Active Modal---------- */}
                  <div>
                    {/* Button to trigger status modal */}
                    <button
                      className="text-orange-400 border border-orange-400 bg-transparent hover:bg-orange-400 hover:text-white py-2 px-4 rounded transition-colors duration-300"
                      onClick={handleOpenStatusModal}
                    >
                      <span>{isActive ? 'Active' : 'Inactive'}</span>
                    </button>

                    {/* Status Modal component */}
                    {isStatusModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                          <h2 className="text-xl font-semibold mb-4">{isActive ? 'Mark As Inactive' : 'Mark As Active'}</h2>

                          {isActive ? (
                            <>
                              <p className="mb-4">Please provide a reason for marking this as inactive:</p>
                              <textarea
                                className="w-full p-2 border rounded mb-4"
                                placeholder="Enter reason here..."
                                rows="3"
                                onChange={(e) => setaddReason(e.target.value)}
                              ></textarea>
                            </>
                          ) : (
                            <p className="mb-4">Are you sure you wish to make this lead active?</p>
                          )}

                          <div className="flex justify-end">
                            <button
                              className="text-gray-700 border border-gray-300 bg-transparent hover:bg-gray-300 hover:text-white py-2 px-4 rounded transition-colors duration-300 mr-2"
                              onClick={handleCloseStatusModal}
                            >
                              Cancel
                            </button>
                            <button
                              className="text-white bg-orange-400 hover:bg-orange-500 py-2 px-4 rounded transition-colors duration-300"
                              onClick={() => handleToggleStatus(LeadsId)}
                            >
                              {isActive ? 'Mark as Inactive' : 'Mark as Active'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* {------------Active Modal End----------} */}

                  <button className="text-orange-400 border border-orange-400 bg-transparent hover:bg-orange-400 hover:text-white py-2 px-4 rounded transition-colors duration-300 capitalize">
                    {detailsModal?.details?.source}
                  </button>
                  {/*-------------- Other Contacts Modal ----------------*/}
                  <button
                    className="text-orange-400 border border-orange-400 bg-transparent hover:bg-orange-400 hover:text-white py-2 px-4 rounded transition-colors duration-300"
                    onClick={handleContactModalOpen}
                  >
                    Other Contacts
                  </button>

                  <Modal
                    open={OpenContactModal}
                    onClose={handleContactModalClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '20%',
                        left: '50%',
                        transform: 'translate(-50%, 0)',
                        width: '40vw',
                        minWidth: 400,
                        maxWidth: 600,
                        bgcolor: 'background.paper',
                        borderRadius: '8px',
                        boxShadow: 24,
                        p: 4,
                        border: '1px solid #ccc'
                      }}
                    >
                      <div className="flex justify-between">
                        <Typography
                          id="modal-title"
                          variant="h6"
                          component="h2"
                          sx={{
                            mb: 3,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontSize: '1.5rem',
                            color: '#374151' // gray-700
                          }}
                        >
                          Contacts - Rohit Kumar Srivastava
                        </Typography>

                        <button
                          type="button"
                          className="text-gray-500 hover:text-gray-900 rounded-full p-3 focus:outline-none"
                          onClick={handleContactModalClose}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <Grid container spacing={1} sx={{ mb: 3 }}>
                        <Grid item xs={4}>
                          <Typography className="text-sm" sx={{ color: '#374151' }}>
                            Rohit Kumar Srivastava
                          </Typography>
                        </Grid>

                        <Grid item xs={4}>
                          <Typography className="text-sm" sx={{ color: '#374151' }}>
                            rohit@gmail.com
                          </Typography>
                        </Grid>

                        <Grid item xs={4}>
                          <Typography className="text-sm" sx={{ color: '#374151' }}>
                            8080808080
                          </Typography>
                        </Grid>
                      </Grid>

                      <Typography sx={{ mt: 2, mb: 1, fontSize: '1rem', color: '#374151', fontWeight: 600 }}>
                        Other Contacts:
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            ml: 2,
                            borderColor: '#F97316', // orange-400
                            color: '#F97316',
                            '&:hover': {
                              backgroundColor: '#F97316',
                              color: 'white'
                            }
                          }}
                          onClick={handleShowContactForm}
                        >
                          Add
                        </Button>
                      </Typography>

                      {showContactForm && (
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              label="Name"
                              variant="outlined"
                              size="small"
                              sx={{ fontSize: '0.875rem', color: '#374151' }}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              label="Phone Number"
                              variant="outlined"
                              size="small"
                              sx={{ fontSize: '0.875rem', color: '#374151' }}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              label="Email"
                              variant="outlined"
                              size="small"
                              sx={{ fontSize: '0.875rem', color: '#374151' }}
                            />
                          </Grid>
                          <Grid item xs={12} sx={{ textAlign: 'left', mt: 2 }} className="space-x-2">
                            <button
                              className="text-gray-700 border border-gray-300 bg-transparent hover:bg-gray-300 hover:text-white py-2 px-4 rounded transition-colors duration-300 mr-2"
                              onClick={handleCloseStatusModal}
                            >
                              Cancel
                            </button>
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{
                                backgroundColor: '#F97316', // orange-400
                                '&:hover': {
                                  backgroundColor: '#ea580c' // darken the orange on hover
                                },
                                fontSize: '0.875rem'
                              }}
                              onClick={() => alert('Contact submitted')}
                            >
                              Submit
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                    </Box>
                  </Modal>

                  {/*---------------- Other Contact Modal End --------------*/}

                  {/* Delete confirmation  */}

                  {deleteConfirmation.open && (
                    <div
                      className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50000"
                      style={{ position: 'fixed', transform: 'translateZ(0)' }}
                    >
                      <div class="relative p-4 w-full max-w-md max-h-full">
                        <div class="relative bg-white rounded-lg shadow ">
                          {/* <button
                            type="button"
                            class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-white hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="popup-modal"
                            onClick={() => setDeleteConfirmation({ open: false, id: null })}
                          >
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                              />
                            </svg>
                            <span class="sr-only">Close modal</span>
                          </button> */}
                          <div class="p-4 md:p-5 text-center">
                            <svg
                              class="mx-auto mb-4 text-red-800 w-12 h-12 dark:text-red-600"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 20"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                            <h3 class="mb-5 text-lg font-normal text-gray-800 dark:text-gray-700">
                              Are you sure you want to delete this lead?
                            </h3>
                            {console.log('details delete id modal----->', detailsModal?.details?._id)}
                            <button
                              data-modal-hide="popup-modal"
                              type="button"
                              className="text-green-500 border border-green-600 bg-transparent hover:bg-green-600 hover:text-white py-2 px-4 rounded transition-colors duration-300 m-3"
                              onClick={handleConfirmDelete}
                            >
                              Yes, I'm sure
                            </button>
                            <button
                              data-modal-hide="popup-modal"
                              type="button"
                              className="text-orange-400 border border-orange-400 bg-transparent hover:bg-orange-400 hover:text-white py-2 px-4 rounded transition-colors duration-300 m-3"
                              onClick={() => setDeleteConfirmation({ open: false, id: null })}
                            >
                              No, cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className=" bg-white rounded-lg">
                <div className="flex flex-row space-x-[10px]">
                  <div className="w-[30vw] space-y-3 border-2 p-2">
                    <div className='flex flex-col'>
                    {/* <!-- Needs Section --> */}
                    <div className="flex-1">
                      <div className="flex space-x-2">
                        <Message size="25px" />
                        <h2 className="text-xl font-semibold text-green-900 mb-4">Needs</h2>
                      </div>

                      <textarea
                        name="notes"
                        id="notes"
                        rows="2"
                        ref={editNeedsRef}
                        value={editNeeds}
                        onChange={(e) => seteditNeeds(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none"
                        placeholder="Enter any additional notes or comments"
                      ></textarea>
                    </div>

                    {/* <!-- Notes Section --> */}
                    <div className="flex-1 p-2">
                      <div className="flex space-x-2">
                        <Notepad size="25px" />
                        <h2 className="text-xl font-semibold text-green-900 mb-4">Notes</h2>
                      </div>
                      <div>
                        <textarea
                          name="notes"
                          id="notes"
                          value={editNotes}
                          onChange={(e) => seteditNotes(e.target.value)}
                          rows="2"
                          className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none"
                          placeholder="Enter any additional notes or comments"
                        ></textarea>
                      </div>
                    </div>
                    </div>
                  
                    <div className="bg-white rounded-lg">
  <div className="flex flex-row space-x-3">
    {/* Last Interaction Section */}
    <div className="flex-1">
      <h2 className="text-xl font-semibold text-green-600 mb-4 ml-3">Last Interaction</h2>
      {console.log('last interactions-s-->', editLastInteraction)}
      <textarea
        name="lastInteraction"
        id="lastInteraction"
        value={editLastInteraction}
        onChange={(e) => seteditLastInteraction(e.target.value)}
        rows="3"
        className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none"
        placeholder="Enter any additional notes or comments"
      ></textarea>
    </div>

    {/* Next Action Section */}
    <div className="flex-1">
      <h2 className="text-xl font-semibold text-green-600 mb-4">Next Action</h2>
      <textarea
        name="NextAction"
        value={editNextAction}
        onChange={(e) => seteditNextAction(e.target.value)}
        id="NextAction"
        rows="3"
        className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none"
        placeholder="Enter any additional notes or comments"
      ></textarea>
    </div>
  </div>
</div>

                  </div>

                  {/* List Interactions */}
                  {/* List Interactions */}
                  <div className="flex gap-4 border-2 w-[32vw] p-2" style={{ height: '56vh' }}>
                    {/* <!-- Needs Section --> */}
                    <div className="flex-1">
                      <div className="flex space-x-2 ml-4">
                        <Message size="25px" />
                        <h2 className="text-xl font-semibold text-green-900 mb-4">Interactions</h2>
                      </div>
                      <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(52vh - 3.4rem)' }}>
                        <Box className="shadow-md bg-[#f1f1f3] mb-3" sx={{ margin: '5px', padding: '15px' }}>
                          Hello
                        </Box>
                        <Box className="shadow-md bg-[#f1f1f3] mb-3" sx={{ margin: '5px', padding: '15px' }}>
                          Hello
                        </Box>
                        <Box className="shadow-md bg-[#f1f1f3] mb-3" sx={{ margin: '5px', padding: '15px' }}>
                          Hello
                        </Box>
                        <Box className="shadow-md bg-[#f1f1f3] mb-3" sx={{ margin: '5px', padding: '15px' }}>
                          Hello
                        </Box>
                        <Box className="shadow-md bg-[#f1f1f3] mb-3" sx={{ margin: '5px', padding: '15px' }}>
                          Hello
                        </Box>

                        <Box className="shadow-md bg-[#f1f1f3] mb-3" sx={{ margin: '5px', padding: '15px' }}>
                          Hello
                        </Box>
                        <Box className="shadow-md bg-[#f1f1f3] mb-3" sx={{ margin: '5px', padding: '15px' }}>
                          Hello
                        </Box>
                        <Box className="shadow-md bg-[#f1f1f3] mb-3" sx={{ margin: '5px', padding: '15px' }}>
                          Hello
                        </Box>

                        {/* Add more content here if needed */}
                      </div>
                    </div>
                  </div>

                  {/* Custom Scrollbar CSS */}
                  <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                      width: 6px; /* Adjust the width of the scrollbar */
                    }

                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background-color: rgba(0, 0, 0, 0.4); /* Scrollbar thumb color */
                      border-radius: 10px; /* Rounded corners for the thumb */
                    }

                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                      background-color: rgba(0, 0, 0, 0.6); /* Thumb color on hover */
                    }

                    .custom-scrollbar::-webkit-scrollbar-track {
                      background-color: rgba(0, 0, 0, 0.1); /* Scrollbar track color */
                      border-radius: 10px; /* Rounded corners for the track */
                    }
                  `}</style>

                  {/* ---------- */}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  className="w-30 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300  rounded-lg text-lg px-6 py-1"
                  onClick={handleDetailsModalClose}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-30 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300  rounded-lg text-lg px-6 py-1"
                  // onClick={handleEditLeads}

                  onClick={() => EditLeads(detailsModal?.details?._id)}
                >
                  Save
                </button>
                {console.log('detailsmodal edit00------->', detailsModal?.details?._id)}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {importModal.open && (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 mt-20">
          <div
            className="bg-white pt-4 pl-6 rounded-lg max-w-[80vw] w-full mx-4 mt-4 max-h-[50vh] overflow-y-auto shadow-2xl"
            style={{ width: '25vw' }}
          >
            <div className="flex justify-between items-center mb-2 pr-4">
              <h3 className="text-xl font-bold text-gray-900 ml-6">Import Leads</h3>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-900 rounded-full p-2 focus:outline-none"
                onClick={handleImportModalClose}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form
              className="space-y-4 px-4"
              onSubmit={(e) => {
                e.preventDefault();
                // handleEditModalClose();
                // handleSaveEdit();
              }}
            >
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-green-900 mb-2">From Excel</h2>
                    <button
                      className="text-orange-500 border border-orange-500 bg-transparent hover:bg-orange-500 hover:text-white py-1 px-2 rounded transition-colors duration-300 w-full flex items-center justify-center space-x-2"
                      onClick={() =>
                        fetch(`${process.env.PUBLIC_URL}/leads.csv`)
                          .then((response) => response.blob())
                          .then((blob) => {
                            const url = window.URL.createObjectURL(new Blob([blob]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', 'leads.csv'); // File name to download
                            document.body.appendChild(link);
                            link.click();
                            link.parentNode.removeChild(link);
                          })
                      }
                    >
                      <span>Download</span>
                      <ArrowDown />
                    </button>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-green-900 mb-2">Upload Excel</h2>
                    <button className="text-orange-500 border border-orange-500 bg-transparent hover:bg-orange-500 hover:text-white py-1 px-2 rounded transition-colors duration-300 w-full flex items-center justify-center space-x-2">
                      <span>Upload Excel</span>
                      <DownloadDone className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-start space-x-4 mt-4 p-4">
                <button
                  type="button"
                  className="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 rounded-lg text-sm px-4 py-1 transition-colors duration-300"
                  onClick={handleImportModalClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 rounded-lg text-sm px-4 py-1 transition-colors duration-300"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* <div><Toaster/></div> */}
      {/* <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ color: '#fff' }}
      /> */}

      <Toaster position="bottom-center" reverseOrder={false} />
      <PaginationComponent
        count={filteredData.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </MainCard>
  );
}
