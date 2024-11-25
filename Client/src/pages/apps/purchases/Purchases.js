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
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import MainCard from 'components/MainCard';
import {
  AddCircleOutline,
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
      console.log('leads check---->', leads);
      const newSelecteds = leads?.leads?.map((n) => n.companyName);
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
    return leads?.leads?.filter((row) =>
      Object.values(row)?.some((value) => value.toString().toLowerCase().includes(filterText.toLowerCase()))
    );
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
    const selectedRowData = leads?.leads?.filter((row) => newSelected.includes(row.companyName));
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
    console.log('id aayi details ki--->', details);
    console.log('leads id aayi--->', details?._id);
    setLeadsId(details?._id); // Save the ID to state
    seteditNotes(details?.notes);
    seteditNeeds(details?.requirements);
    seteditLastInteraction(details?.lastInteraction?.description);
    seteditNextAction(details?.nextInteraction?.description);
    setIsActive(details?.isactive);
    console.log('details last interaction', details);

    // Pass the ID directly to getLead function
    getParticularLead(details);
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

      setLeads((prevLeads) => prevLeads?.map((lead) => (lead._id === id ? { ...lead, ...updateStatus } : lead)));
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
        setLeads((prevLeads) => prevLeads?.map((lead) => (lead._id === id ? { ...lead, ...deleteLead } : lead)));
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
      title="Purchases"
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
{/* 
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
              </Button> */}
              {/* <Button
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
              </Button> */}
              <Button
                // onClick={handleAddLead}
                // onClick={handleAddNew}
                onClick={() => navigate(`/apps/add-lead`)}
                className="flex gap-2 bg-orange-400 text-white font-semibold hover:bg-orange-300 hover:text-white p-2"
              >
                <AddCircleOutline/>
                
                Enter Supplier Invoice
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

     

    

        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < leads?.leads?.length}
                  checked={leads?.leads?.length > 0 && selected.length === leads?.leads?.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell className="font-poppins text-center">Supplier</TableCell>
              <TableCell className="font-poppins text-center">Contact</TableCell>
              <TableCell className="font-poppins text-center">Invoice No.</TableCell>
              <TableCell className="font-poppins text-center">Invoice Date</TableCell>
              <TableCell className="font-poppins text-center">Taxable</TableCell>
              <TableCell className="font-poppins text-center">Amount</TableCell>
              <TableCell className="font-poppins text-center">Credit Month</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData?.leads?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((lead) => (
              <TableRow
                key={lead._id}
                className="cursor-pointer"
                // onClick={() => handleDetails(lead._id)} // Open the modal for all cells
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/apps/lead/details/${lead._id}`);
                }}
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
                <TableCell className="font-poppins text-center">{lead?.contacts['0']?.phoneNumber}</TableCell>
                <TableCell className="font-poppins text-center">{lead?.source}</TableCell>
                <TableCell className="font-poppins text-center">{lead?.lastInteractions['0']?.executiveName}</TableCell>
                <TableCell className="font-poppins text-center">
                  {lead?.lastInteractions?.[0]?.date ? format(new Date(lead.lastInteractions[0].date), 'dd-MM-yy') : 'N/A'}
                </TableCell>
                {console.log('leads last interactions date----->', lead?.lastInteractions['0']?.date)}
                <TableCell className="font-poppins flex flex-row space-x-2 justify-center mt-5">
                  <Link
                    to={`http://wa.me/${lead?.contacts['0']?.phoneNumber}`}
                    target="__blank"
                    onClick={(event) => event.stopPropagation()} // Prevent the row's onClick from firing
                  >
                    <Whatsapp className="text-orange-500 " />
                  </Link>
                  <Edit
                    className="text-orange-500 "
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/apps/lead/details/${lead._id}`);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Import Modal */}
      {importModal.open && (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 mt-20">
          <div
            className="bg-white pt-4 rounded-lg max-w-[80vw] w-full  mt-4 max-h-[50vh] overflow-y-auto shadow-2xl"
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

          </div>
        </div>
      )}

    

      <Toaster position="top-right" reverseOrder={false} toastOptions={{ style: { zIndex: 3000 } }} />
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
