import { Delete, DoneAll, Mail } from '@mui/icons-material';
import { Call, Edit2, Message, Notepad, Whatsapp } from 'iconsax-react';
import { DeleteLead, EditLeadStatus, EditParticularLead, getParticularLead, getAllStatus, createParticularLeadStatus, updateLastInteractions, updateLeadStatus, markOrderPost} from 'pages/utils/leads/api';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import toast, { Toaster } from 'react-hot-toast';
import { Button, FormControl, Grid, InputLabel, ListItemIcon, ListItemText, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowDropDownIcon, DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MainCard from 'components/MainCard';
import QuestionAnswerSharpIcon from '@mui/icons-material/QuestionAnswerSharp';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SketchPicker } from 'react-color';

export default function LeadDetails() {
  const { id } = useParams();
  const [isLastInteractionPopUp,setIsLastInteractionPopUp]=useState(false);
  const [interactionArr,setInteractionArr]=useState([]);
  const [interactionData,setInteractionData]=useState([]);
  const [city,setCity]=useState('');
  const [country,setCountry]=useState('');
  const [firstName,setFirstName]=useState('');
  const [lastName,setLastName]=useState('');
  const [state,setState]=useState('');
  const [agent,setAgent]=useState('');
  const [company,setCompany]=useState('');
  const [currentLead, setCurrentLead] = useState({});
  const [isActive, setIsActive] = useState();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [addReason, setaddReason] = useState('');
  const [leadStatusList, setLeadStatusList] = useState([]);
  const [editStatusDropdown,setEditStatusDropdown]=useState([]);
  const [openStatusModal,setOpenStatusModal]=useState(false);
  //const openEditStatusModal=()=>setEditStatusDropdown(true);
  const closeEditStatusModal=(e)=>{
    e.stopPropagation();
    setIsUpdateLeadStatusPopUpOpen(false);
  }
  const openEditStatusModal = (e, status, color, id) => {
    e.stopPropagation();
    setEditStatus(status);
    setEditColor(color);
    setCurrentLead(prev => ({ ...prev, status, color, _id: id }));
    console.log("Current Lead:", { status, color, _id: id }); 
    setIsUpdateLeadStatusPopUpOpen(true);
  };
  // const openEditStatusModal = (e,selectedStatus, selectedColor) => {
  //   e.stopPropagation();
  //   setStatusName(selectedStatus);
  //   setSelectedColor(selectedColor); 
  //   setIsUpdateLeadStatusPopUpOpen(true);
  // };
  const [leads, setLeads] = useState([]);
  const [LeadsId, setLeadsId] = useState();
  const [editNotes, seteditNotes] = useState('');
  const [editNeeds, seteditNeeds] = useState('');
  const [editLastInteraction, seteditLastInteraction] = useState('');
  const [editNextAction, seteditNextAction] = useState('');
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [source, setsource] = useState('');
  const [productItem, setProductItem] = useState('');
  const [ContactFirstName, setContactFirstName] = useState('');
  const [ContactLastName, setContactLastName] = useState('');
  const [ContactEmail, setContactEmail] = useState('');
  const [ContactPhoneNumber, setContactPhoneNumber] = useState('');
  const [OpenContactModal, setOpenContactModal] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [contactList, setContactList] = useState([]);

  const [nextActionDetails,setNextActionDetails]=useState({
    nextActionDate:null,
    nextActionTime:null,
    editNextAction:''
  });
const [errorMessage, setErrorMessage] = useState("");
const [selectedInteractionIndex, setSelectedInteractionIndex] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [isEditButtonPopUpOpen,setIsEditButtonPopUpOpen]=useState(false);
const [isUpdateLeadStatusPopUpOpen,setIsUpdateLeadStatusPopUpOpen]=useState(false);


const [statusName, setStatusName] = useState('');
const [status, setStatus] = useState('');

const [selectedColor, setSelectedColor] = useState('#ffffff'); 
const [isLeadDropdownOpen,setIsLeadDropdownOpen]=useState(false);

const [editStatus, setEditStatus] = useState(''); 
const [editColor, setEditColor] = useState(''); 


const [isCallDropdownOpen, setIsCallDropdownOpen] = useState(false);
const [callStatus, setCallStatus] = useState('Available');
const handleUpdateLeadStatus=async(e,newstatus,newcolor,uniqueId)=> {
  console.log(uniqueId)
  e.stopPropagation();
  const token=localStorage.getItem('token');
  console.log(newstatus,newcolor,uniqueId)
  const requestData={
    status:newstatus,
    role:'Lead',
    color:newcolor
  }
  console.log(requestData,token)
  const response=await updateLeadStatus(uniqueId,requestData,token)
  console.log('update lead status -- >',response);
  setIsUpdateLeadStatusPopUpOpen(false);
  const leadStatus = await getAllStatus(token);
  setLeadStatusList(leadStatus);
  setIsLeadDropdownOpen(false);
}
const callStatusList = [
  { status: 'Available' },
  { status: 'Unavailable/Not Answering' },
  { status: 'Busy' },
  { status: 'Switched off' },
  { status: 'Not Reachable' },
];
const handleLeadOrderConversion=async()=>{
  const token=localStorage.getItem('token');
  if(!token) return;
  console.log(id,token)
  const response=await markOrderPost(id,token);
  console.log(response);
  toast.success(response.message);

}

// Function to open modal for the clicked card
const openModal = (index) => {
  setSelectedInteractionIndex(index);
  setIsModalOpen(true);
};

// Function to close the modal
const closeModal = () => {
  setIsModalOpen(false);
  setSelectedInteractionIndex(null);
};
const copyText = (text,copytext) => {
  navigator.clipboard.writeText(copytext)
      .then(() => {
          toast.success(`${text} copied`)
      })
      .catch((err) => {
          console.error("Failed to copy: ", err);
      });
};


// Function to handle next and previous message navigation
const handleNext = () => {
  if (selectedInteractionIndex < interactionArr.length - 1) {
    setSelectedInteractionIndex(prevIndex => prevIndex + 1);
  }
};

const handlePrevious = () => {
  if (selectedInteractionIndex > 0) {
    setSelectedInteractionIndex(prevIndex => prevIndex - 1);
  }
};
const handleEditButtonPopUp=()=>{
   setIsEditButtonPopUpOpen(!setIsEditButtonPopUpOpen);
}


// Function to check if all fields are filled
const checkFormValidity = (date, time, description) => {
  if (date && time && description) {
    setIsFormValid(true);
    setErrorMessage(""); 
  } else {
    setIsFormValid(false);
  }
};
const handleAddStatus = async () => {
  const token = localStorage.getItem('token');

     console.log(statusName,selectedColor,token)
     const addLeadStatus=await createParticularLeadStatus(statusName,"Lead",selectedColor,token);
     console.log(addLeadStatus)
     const leadStatus = await getAllStatus(token);
    setLeadStatusList(leadStatus)
      
      setStatusName('');
      setSelectedColor('#ffffff');
      closeEditPopup();
 
};

// Handle save click
const handleSaveClick = () => {
  if (!isFormValid) {
    setErrorMessage("*Please fill all fields!");
  } else {
    addLIinfo(); 
    closePopup(); 
  }
};
const openEditPopup = () => setIsEditButtonPopUpOpen(true);
const closeEditPopup = () => setIsEditButtonPopUpOpen(false);

  const openPopup = () => {
    setSelectedDate(null);
    setSelectedTime(null);  
    seteditLastInteraction(''); 
    setIsLastInteractionPopUp(true);
  }
  const closePopup = () => setIsLastInteractionPopUp(false);
  
  const navigate = useNavigate();
  const editNeedsRef = useRef(null);

  const EditLeads = async (id) => {
    const token = localStorage.getItem('token');
    // const validDate = selectedDate ? selectedDate.format('DD-MM-YYYY') : new Date().toISOString().split('T')[0];
    // const validTime = selectedTime ? selectedTime.format('HH:mm') : new Date().toISOString().split('T')[1].substring(0, 5);
    
    const validNextActionDate = nextActionDetails.nextActionDate
    ? nextActionDetails.nextActionDate.format('DD-MM-YYYY')
    :null;
    
    const validNextActionTime = nextActionDetails.nextActionTime
    ? nextActionDetails.nextActionTime.format('HH:mm')
    : null;
   
    const requestData = {
      
  companyName: company,
  // contacts: [
  //   {
  //     firstName,
  //     lastName,
  //     email: Email,
  //     phoneNumber:PhoneNumber
  //   }
  // ],
  //contacts:contactList,
 
 
  country,
  state,
  city,
  executive: agent,
  source,
  // designation: "string",
  //product: "string",
  
  status,
  
      agentstatus: callStatus,
      requirements: editNeeds,
      notes: editNotes,
      // lastInteractions: [
      //   {
      //     description: editLastInteraction,
      //     date: validDate,
      //     time: validTime
      //   }
      // ],
      nextInteraction: (nextActionDetails.editNextAction === "" && validNextActionDate === null && validNextActionTime === null) ?  null : {
        description: nextActionDetails.editNextAction,
        date: validNextActionDate,
        time: validNextActionTime
      }
    };
   // Validate if description is provided but date is missing
   if (requestData?.nextInteraction?.description && !requestData?.nextInteraction?.date) {
    toast.error('Date is required when description is provided');
    return; // Stop submission if date is missing
  }

  if (requestData?.nextInteraction?.description && requestData?.nextInteraction?.date && !requestData?.nextInteraction?.time) {
    toast.error('Time is Required');
    return; // Stop submission if date is missing
  }

 const Nextinteraction  = (nextActionDetails.editNextAction === "" && validNextActionDate === null && validNextActionTime === null) ?  null : {
    description: nextActionDetails.editNextAction,
    date: validNextActionDate,
    time: validNextActionTime
  }

  requestData.nextInteraction = Nextinteraction

    console.log('requestdata',requestData);
    try {
      const editedLead = await EditParticularLead(id, requestData,token);
      console.log('Leads edit data particular wala---->', editedLead);
      toast.success('Lead Updated Successfully');
      const executiveName = interactionArr[0]?.executiveName || "admin";
    //   setInteractionArr(prevInteractions => [
    //     ...prevInteractions,
    //     {
    //         description: editLastInteraction,
    //         date: validDate,
    //         time: validTime,
    //         executiveName: executiveName, 
    //     },
        
    // ]);
 
    setSelectedDate(null);
    setSelectedTime(null);  
    seteditLastInteraction('');
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Error Updating Leads');
      // Handle error (e.g., show an error message to the user)
    }
  };
  const addLIinfo = () => {

    const token = localStorage.getItem('token');

    const validDate = selectedDate ? selectedDate.format('DD-MM-YYYY') : new Date().toISOString().split('T')[0];
    const validTime = selectedTime ? selectedTime.format('HH:mm') : new Date().toISOString().split('T')[1].substring(0, 5);
    const newInteraction = {
      description: editLastInteraction,
      date: validDate,
      time: validTime,
      executiveName: interactionArr[0]?.executiveName || 'admin',
    };
    const updateAllLastInteractions = async () => {
      const token=localStorage.getItem('token');
      const allInteractions=await updateLastInteractions(id,newInteraction,token);
      console.log(allInteractions)
      
      const updatedLead = await getParticularLead(id,token);
      seteditNotes(updatedLead?.notes);
      seteditNeeds(updatedLead?.requirements);
      
      const reversedInteractionsArr = updatedLead?.lastInteractions ? [...updatedLead.lastInteractions].reverse() : [];
      setInteractionArr(reversedInteractionsArr);
      seteditNextAction(updatedLead?.nextInteraction?.description); 
    }
    updateAllLastInteractions();
    closePopup();
    
  };
  const getLeads = async () => {
    const lead = await getParticularLead(id);
    console.log(lead)
    setLeadsId(lead?._id); 
    seteditNotes(lead?.notes)
    seteditNeeds(lead?.requirements);
    setCompany(lead?.companyName);
    setCity(lead?.city);
    setCountry(lead?.country);
    setState(lead?.state);
    setFirstName(lead?.contacts[0]?.firstName);
    setLastName(lead?.contacts[0]?.lastName);
    setAgent(lead?.executive);
    setContactList(lead?.contacts);
    setStatus(lead?.status);
    setCallStatus(lead?.agentstatus || 'Available');
    console.log('lead last interaction--->',lead?.lastInteractions)
    seteditLastInteraction(lead?.lastInteractions?.description);
    const reversedInteractionsArr = lead?.lastInteractions ? [...lead.lastInteractions].reverse() : [];
    setInteractionArr(reversedInteractionsArr);
    
    setNextActionDetails({
      nextActionDate: lead?.nextInteraction?.date ? dayjs(lead.nextInteraction.date, 'DD-MM-YYYY') : null,
      nextActionTime: lead?.nextInteraction?.time ? dayjs(lead.nextInteraction.time, 'HH:mm') : null,
      editNextAction: lead?.nextInteraction?.description || ''
    });
    setName(`${lead?.contacts[0]?.firstName} ${lead?.contacts[0]?.lastName}`);
    setEmail(lead?.contacts[0]?.email);
    setPhoneNumber(lead?.contacts[0]?.phoneNumber);
    console.log('lead mobile--->', lead?.contacts[0]?.phoneNumber);
    setsource(lead.source);
    setProductItem(lead.product);
    setIsActive(lead?.isactive);
  };
  
  useEffect(() => {
    
    getLeads();
  }, [id, interactionArr.length, contactList.length]);
  
  useEffect(() => {
    if (statusName) {
      setEditStatus(statusName);
    }
    if (selectedColor) {
      setEditColor(selectedColor);
    }
  }, [statusName, selectedColor]);
  useEffect(() => {
    const token=localStorage.getItem('token');
    const getLeadStatus = async () => {
      const leadStatus = await getAllStatus(token,"Lead");
      setLeadStatusList(leadStatus)
      console.log('lead status-->' ,leadStatus)
      
    };
    getLeadStatus();
  }, []);
  const handleEditLeadStatus=async(id,status,color) => {
    const token=localStorage.getItem('token');
   
    const response = await updateLeadStatus(id,{status,role:"Lead",color},token);
    
      console.log(id,token)
    //console.log('lead status-->' ,leadStatus)
      
    }
   

  const handleOpenStatusModal = () => {
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
  };

  const handleUpdateStatus = async (id) => {
    console.log('active/inactive id', id);
    console.log('active/inactive status check--->', isActive);

    const requestData = {
      reason: addReason
    };

    try {

      const updateStatus = isActive ? await EditLeadStatus(id, requestData) : await EditLeadStatus(id);

      console.log('Leads edit data particular wala---->', updateStatus);

      setIsActive(updateStatus?.lead?.isactive);
      
      toast.success('Status Updated Successfully');
    } catch (error) {
      console.error('Error updating status:', error.message);
      toast.error('Error Updating Status');
      
    }
  };

  const handleToggleStatus = (id) => {
    
    console.log('leads id------sds--->', id);
    handleUpdateStatus(id);
    handleCloseStatusModal();
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

        setLeads((prevLeads) => prevLeads.map((lead) => (lead._id === id ? { ...lead, ...deleteLead } : lead)));

        // Close the modal after deleting the lead
        setDeleteConfirmation({ open: false, details: null });

        toast.success('Lead Deleted Successfully');
        setTimeout(() => {
          navigate(`/apps/lead`);
        }, 1000);
      } catch (error) {
        console.error('Error deleting lead:', error.message);
        toast.error('Error Deleting Lead');
      }
    }

    setDeleteConfirmation({ open: false, id: null });
  };

  const handleContactModalOpen = () => setOpenContactModal(true);
  const handleContactModalClose = () => setOpenContactModal(false);
  const handleShowContactForm = () => setShowContactForm(true);

  // contact details form

  const ContactDetailsSubmit = async(id) =>{
    console.log('id btana jra konsi h',id)
    const token = localStorage.getItem('token');
    if(!ContactFirstName || !ContactLastName || !ContactEmail || !ContactPhoneNumber){
      toast.error("Please, fill all fields!");
      return;
    }
    if (ContactPhoneNumber.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits.");
      return;
    }
    const requestData = {
    
      addContact: {
        firstName: ContactFirstName,
        lastName: ContactLastName,
        email: ContactEmail,
        phoneNumber: ContactPhoneNumber
      }
    };

    try {
      const editedLead = await EditParticularLead(id, requestData, token);
      console.log('Leads contact details particular wala---->', editedLead);
      toast.success('Lead Updated Successfully');
      getLeads()
    } catch (error) {
      console.error('Error updating lead:', error.message);
      toast.error('Error Updating Leads');
      // Handle error (e.g., show an error message to the user)
    }
  }
  // console.log(country,state,city)
  return (
    <MainCard sx={{display:'flex',justifyContent:'center'}}>
    <>
      
      <div className="rounded-lg" style={{ width: '75vw', }}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-gray-800 py-4">Edit Lead</h3>
          <div className="flex justify-end w-[40vw] space-x-2">
            
            <Link
              to={`http://wa.me/${PhoneNumber}`}
              target="__blank"
              
            >
              <Whatsapp className="text-[#779E40] " />
            </Link>
            <Call className="text-[#779E40] cursor-pointer"  onClick={() => {
                window.location.href = `tel:${PhoneNumber}`;
              }}/>
            <Link
              onClick={(e) => {
                e.preventDefault(); // Prevent the default behavior of the Link component
                window.location.href = `mailto:${Email}`; // Open the default email client
              }}
            >
              <Mail className="text-[#779E40] hover:cursor-pointer" />
            </Link>
            <Delete
              className="text-[#779E40] hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();

                handleDeleteConfirmation(id);
              }}
            />
            {/* <Edit2
              className="text-red-600 hover:cursor-pointer"
              onClick={() => {
                const input = editNeedsRef.current;
                console.log(input)
                if (input) {
                  input.focus();
                  input.setSelectionRange(input.value.length, input.value.length);
                }
              }}
            /> */}
            <Edit2
              className="text-[#779E40] hover:cursor-pointer"
              onClick={() => {
               navigate('/apps/lead/add-lead',{state:{sourceName:source,name:Name,internalNotes:editNotes,needs:editNeeds,Email,PhoneNumber,FirstName:firstName,LastName:lastName,CityName:city,StateName:state,CountryName:country,Company:company,Agent:agent,productItem,id:LeadsId}})
              }}
            />
            <button 
            onClick={handleLeadOrderConversion}
            className="text-[#779E40] border border-[#779E40] bg-transparent hover:bg-[#779E40] hover:text-white px-4 rounded transition-colors duration-300">
              <DoneAll /> Mark Order
            </button>
          </div>

      
        </div>

        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div>
            <div className="flex flex-wrap gap-2">
              <button className="text-[#779E40] border border-[#779E40] bg-transparent hover:bg-[#779E40] hover:border-[#779E40] hover:text-white py-2 px-4 rounded transition-colors duration-300"
              onClick={() => {
                navigate('/apps/lead/add-lead',{state:{sourceName:source,name:Name,internalNotes:editNotes,needs:editNeeds,Email,PhoneNumber,FirstName:firstName,LastName:lastName,CityName:city,StateName:state,CountryName:country,Company:company,Agent:agent,productItem,id:LeadsId}})
               }}
              >
                {/* {detailsModal?.details?.firstName} {detailsModal?.details?.lastName} */}
                {Name}
              </button>

              <button className="text-[#779E40] border border-[#779E40] bg-transparent hover:bg-[#779E40] hover:border-[#779E40] hover:text-white py-2 px-4 rounded transition-colors duration-300"
              onClick={()=>copyText("Phone number",PhoneNumber)}

              >
                {/* {detailsModal?.details?.mobile} */}
                {PhoneNumber}
              </button>

              <Link
                // onClick={(e) => {
                //   e.preventDefault(); // Prevent the default behavior of the Link component
                //   window.location.href = `mailto:${Email}`; // Open the default email client
                // }}
              onClick={()=>copyText("Email",Email)}

                className="text-[#779E40] border border-[#779E40] bg-transparent hover:bg-[#779E40] hover:border-[#779E40] hover:text-white py-2 px-4 rounded transition-colors duration-300"
              >
                {/* {detailsModal?.details?.email} */}
                {Email}
              </Link>

              <div>
                <button
                  className="h-full text-[#779E40] border border-[#779E40] bg-transparent hover:bg-[#779E40] hover:border-[#779E40] hover:text-white py-2 px-4 rounded transition-colors duration-300"
                  onClick={handleOpenStatusModal}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </button>

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
                            //   onChange={(e) => setaddReason(e.target.value)}
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
                          className="text-white bg-[#779E40] hover:bg-[#5F7E33] py-2 px-4 rounded transition-colors duration-300"
                          onClick={() => handleToggleStatus(id)}
                        >
                          {isActive ? 'Mark as Inactive' : 'Mark as Active'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button className="text-[#779E40] border border-[#779E40] bg-transparent hover:bg-[#779E40] hover:border-[#779E40] hover:text-white py-2 px-4 rounded transition-colors duration-300">
                {/* {detailsModal?.details?.source} */}
                {source}
              </button>

              <button
                className="text-[#779E40] border border-[#779E40] bg-transparent hover:bg-[#779E40] hover:border-[#779E40] hover:text-white py-2 px-4 rounded transition-colors duration-300"
                onClick={handleContactModalOpen}
              >
                Other Contacts
              </button>
              <Box className='relative border border-[#779E40] rounded' >
              <Box className="flex justify-between items-stretch">

              <Box className="relative">
              <Box
                className="w-full p-2 flex gap-4 items-center cursor-pointer"
                onClick={() => setIsLeadDropdownOpen(!isLeadDropdownOpen)}
              >
                <Box sx={{ display: 'flex', color: '#779E40',width:'150px' }}>
                  
                  {!status ? 'Created':status}
                </Box>
            
              </Box>
              {isLeadDropdownOpen && (
                <Box
                  className="absolute z-50 mt-1 bg-white shadow-lg rounded-lg w-[200px] border border-gray-300"
                  sx={{ maxHeight: '200px', overflowY: 'auto' ,'::-webkit-scrollbar': { display: 'none' },msOverflowStyle: 'none', scrollbarWidth: 'none'}} 
                >
                  <Box
                      className="flex items-center justify-between gap-4 px-4 py-2 cursor-pointer hover:bg-[#C7DBA0]"
                      onClick={()=>{
                        setStatus(undefined);
                        setIsLeadDropdownOpen(false); 
                      }}
                  ><em>Select lead status</em>
                  </Box>
                  {leadStatusList && leadStatusList.map(({ status, color, _id }, idx) => (
                    <Box
                      key={idx}
                      className="flex items-center justify-between gap-4 px-4 py-2 cursor-pointer hover:bg-[#C7DBA0]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStatus(status);
                        setIsLeadDropdownOpen(false); 
                      }}
                    >
                      <Box className='flex'>
                      <Box
                        sx={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: color,
                          mr: 2,
                        }}
                      />
                      <Box>{status}</Box>
                      </Box>
                      <Box className='px-1 relative border text-[#779E40] border-[#779E40] rounded hover:bg-[#779E40] hover:text-white' onClick={(e)=>{
                       e.stopPropagation();
                       openEditStatusModal(e,status,color,_id)}} >
                        <EditIcon sx={{fontSize:'14px'}}/>
                        </Box>
                        {isUpdateLeadStatusPopUpOpen && (
                        <Box  
                        onClick={(e)=>e.stopPropagation()} className="fixed top-1/2 left-1/2 z-50 p-4 bg-white shadow-lg rounded-lg h-auto w-[300px] transform -translate-x-1/2 -translate-y-1/2">
                          <div className="flex flex-col justify-between gap-4 p-4">
                            <h2 className="text-xl font-semibold text-black mb-2">Edit Lead Status</h2>
                            <input
                              type="text"
                              value={editStatus}
                              onClick={(e)=>e.stopPropagation()}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded"
                              placeholder="Enter new status"
                            />
                            <SketchPicker
                              color={editColor}
                              onClick={(e)=>e.stopPropagation()}
                              onChangeComplete={(color) =>setEditColor(color.hex)}
                            />
                            <div className="flex justify-between mt-4">
                              <button
                                // onClick={(e)=>closeEditStatusModal(e)}
                                onClick={()=>setIsUpdateLeadStatusPopUpOpen(false)}
                                className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-poppins rounded py-1 px-2"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={(e)=>handleUpdateLeadStatus(e,editStatus,editColor,currentLead._id)}
                                className="bg-teal-600 text-white hover:bg-teal-700 font-poppins rounded py-1 px-4"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </Box>
                        )}

                    
                    </Box>
                  ))}
                </Box>
              )}
              </Box> 
                <Box className='ml-2 px-2 py-1 flex items-center justify-center border-l text-[#779E40] border-[#779E40] hover:bg-[#779E40] hover:text-white'
                 onClick={openEditPopup}
                >
                  <AddIcon sx={{fontSize:'18px'}} />
                 
                </Box>
              </Box>
                {/* {isEditButtonPopUpOpen && (<div className="fixed z-50 p-4 bg-white border border-black rounded shadow-lg" style={{height:'30vh',width:'30vh'}}>Hello</div>)

                } */}
                 {isEditButtonPopUpOpen && (
                    <div className="absolute z-50 p-4 mt-1 bg-white shadow rounded-lg h-auto w-[300px]">
                      <div className="flex flex-col justify-between gap-4 bg-white p-6 rounded-lg shadow-lg w-full h-full">
                        <h2 className="text-xl font-semibold text-black mb-2">Set Status Color</h2>
                        <input
                          type="text"
                          value={statusName}
                          onChange={(e) => setStatusName(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="Enter status name"
                        />
                        <SketchPicker
                          color={selectedColor}
                          onChangeComplete={(color) => setSelectedColor(color.hex)}
                        />
                        <div className='flex justify-between mt-4'>
                          <button
                            onClick={closeEditPopup}
                            className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-poppins rounded py-1 px-2'
                          >
                            Close
                          </button>
                          <button
                            onClick={handleAddStatus}
                            className='bg-teal-600 text-white hover:bg-teal-700 font-poppins rounded py-1 px-4'
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
              </Box>
              <div className='relative pr-2 border border-[#779E40] rounded'>
              <Box
        className="w-full p-2 flex gap-4 items-center cursor-pointer"
        onClick={() => setIsCallDropdownOpen(!isCallDropdownOpen)}
      >
        <Box sx={{ display: 'flex', color: '#779E40', width: '200px' }}>
          {callStatus}
        </Box>
      </Box>

      {isCallDropdownOpen && (
        <Box
          className="absolute z-50 mt-1 bg-white shadow-lg rounded-lg w-[250px] border border-gray-300"
          sx={{
            maxHeight: '200px',
            overflowY: 'auto',
            '::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none', 
            scrollbarWidth: 'none', 
            width:'200px'
          }}
        >
      
         
      <Box 
      className="flex items-center justify-start px-2 py-1 cursor-pointer hover:bg-[#C7DBA0]"
      onClick={() => {
        setCallStatus("Available");
        setIsCallDropdownOpen(false);
      }}
      >
          <em>Select call status</em>
      </Box>
          
        
          {callStatusList.map(({ status }, idx) => (
            <Box
              key={idx}
              className="flex items-center justify-start px-2 py-1 cursor-pointer hover:bg-[#C7DBA0]"
              onClick={() => {
                setCallStatus(status);
                setIsCallDropdownOpen(false);
              }}
            >
              <Box>{status}</Box>
            </Box>
          ))}
        </Box>
      )}
              </div>

              <Modal
                open={OpenContactModal}
                //   onClose={handleContactModalClose}
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
                    minWidth: 500,
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
                      className="capitalize"
                      sx={{
                        mb: 3,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        color: '#374151' // gray-700
                      }}
                    >
                      Contacts - {Name}
                    </Typography>

                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-900 rounded-full p-3 focus:outline-none"
                      // onClick={handleContactModalClose}
                      onClick={() => handleContactModalClose()}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* <Grid container spacing={1} sx={{ mb: 3 }}>
                    <Grid item xs={4}>
                      <Typography className="text-sm capitalize" sx={{ color: '#374151' }}>
                        {Name}
                      </Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography className="text-sm" sx={{ color: '#374151' }}>
                        {Email}
                      </Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography className="text-sm" sx={{ color: '#374151' }}>
                        {PhoneNumber}
                      </Typography>
                    </Grid>
                  </Grid> */}
                  {
                    contactList && contactList.map((contact)=>{
                      return (
                        <Grid container spacing={1} sx={{ mb: 3 }}>
                        <Grid item xs={3}>
                          <Typography className="text-sm capitalize" sx={{ color: '#374151' }}>
                            {contact.firstName}  {contact.lastName}
                          </Typography>
                        </Grid>
    
                        <Grid item xs={6}>
                          <Typography className="text-sm" sx={{ color: '#374151' }}>
                            {contact.email}
                          </Typography>
                        </Grid>
    
                        <Grid item xs={3}>
                          <Typography className="text-sm" sx={{ color: '#374151' }}>
                            {contact.phoneNumber}
                          </Typography>
                        </Grid>
                      </Grid>
                      )
                    })
                  }
                  <Typography sx={{ mt: 2, mb: 1, fontSize: '1rem', color: '#374151', fontWeight: 600 }}>
                    Other Contacts:
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        ml: 2,
                        borderColor: '#e53e3e',
                        color: '#e53e3e',
                        '&:hover': {
                          backgroundColor: '#e53e3e',
                          color: 'white',
                          borderColor: '#e53e3e',

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
                          label="First Name"
                          variant="outlined"
                          size="small"
                          sx={{ fontSize: '0.875rem', color: '#374151' }}
                          onChange={(e) => setContactFirstName(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          variant="outlined"
                          size="small"
                          sx={{ fontSize: '0.875rem', color: '#374151' }}
                          onChange={(e) => setContactLastName(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          onChange={(e) => setContactPhoneNumber(e.target.value)}
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
                          onChange={(e) => setContactEmail(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ textAlign: 'left', mt: 2 }} className="space-x-2">
                        <button
                          className="text-gray-700 border border-gray-300 bg-transparent hover:bg-gray-300 hover:text-white py-2 px-4 rounded transition-colors duration-300 mr-2"
                          onClick={() => handleContactModalClose()}
                        >
                          Cancel
                        </button>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            backgroundColor: '#F97316',
                            '&:hover': {
                              backgroundColor: '#ea580c'
                            },
                            fontSize: '0.875rem'
                          }}
                          onClick={() => ContactDetailsSubmit(id)}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </Modal>

              {deleteConfirmation.open && (
                <div
                  className="fixed top-0 left-0 z-[100000] w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center"
                  style={{ position: 'fixed', transform: 'translateZ(0)' }}
                >
                  <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow ">
                      <div className="p-4 md:p-5 text-center">
                        <svg
                          className="mx-auto mb-4 text-red-800 w-12 h-12 dark:text-red-600"
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
                        <h3 className="mb-5 text-lg font-normal text-gray-800 dark:text-gray-700">
                          Are you sure you want to delete this lead?
                        </h3>
                        {/* {console.log('details delete id modal----->', detailsModal?.details?._id)} */}
                        <button
                          data-modal-hide="popup-modal"
                          type="button"
                          className="text-[#779E40] border border-[#779E40] bg-transparent hover:bg-[#5F7E33] hover:text-white py-2 px-4 rounded transition-colors duration-300 m-3"
                          onClick={handleConfirmDelete}
                        >
                          Yes, I'm sure
                        </button>
                        <button
                          data-modal-hide="popup-modal"
                          type="button"
                          className="text-red-600 border border-red-600 bg-transparent hover:bg-red-600 hover:text-white py-2 px-4 rounded transition-colors duration-300 m-3"
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

          <div className="bg-white rounded-lg">
            <div className="flex flex-row space-x-6">
              {/* <div className="w-[40vw] space-y-6"> */}
              <div className="w-full space-y-6">
                <div className="border-2 p-4 rounded-lg space-y-6">
                  {/* both sections side-by-side */}
                  <div className="flex flex-row gap-7">
                    {/* Needs Section */}
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Message size="25px" className='text-[#779E40]' />
                        <h2 className="text-xl font-semibold text-black">Requirements</h2>
                      </div>
                      <textarea
                        name="needs"
                        id="needs"
                        rows="3"
                        value={editNeeds}
                        ref={editNeedsRef}
                        onChange={(e) => seteditNeeds(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none"
                        placeholder="Enter any additional needs"
                      ></textarea>
                    </div>

                    {/* Notes Section */}
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Notepad size="25px" className='text-[#779E40]' />
                        <h2 className="text-xl font-semibold text-black">Internal Notes</h2>
                      </div>
                      <textarea
                        name="notes"
                        id="notes"
                        value={editNotes}
                        onChange={(e) => seteditNotes(e.target.value)}
                        rows="3"
                        className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none"
                        placeholder="Enter any additional notes or comments"
                      ></textarea>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-black mb-2">Next Action</h2>
{/* Next Actions */}
<div className="flex-1">
  <div className="flex flex-row items-center space-x-4 mb-3">
    <div className="flex-1">
      <h2 className="text-sm font-medium text-black mb-1">Date</h2>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            label="Select Date"
            value={nextActionDetails.nextActionDate}
            renderInput={(params) => (
              <TextField 
                {...params} 
                placeholder="DD-MM-YYYY" 
                error={!nextActionDetails.nextActionDate && nextActionDetails.editNextAction} // Add error if description is not empty and date is missing
                helperText={
                  !nextActionDetails.nextActionDate && nextActionDetails.editNextAction
                    ? 'Date is required when description is provided'
                    : ''
                }
              />
            )}
            minDate={dayjs()}
            onChange={(newDate) => setNextActionDetails(prev => ({ 
              ...prev, 
              nextActionDate: newDate ? newDate : null 
            }))}
            sx={{ width: '100%', zIndex: 0 }} // Ensures the DatePicker takes the full width of its container
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>

    <div className="flex-1">
      <h2 className="text-sm font-medium text-black mb-1">Time</h2>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['TimePicker']}>
          <TimePicker
            label="Select Time"
            value={nextActionDetails.nextActionTime}
            renderInput={(params) => <TextField {...params} placeholder="HH:mm" />}
            minTime={nextActionDetails.nextActionDate && dayjs().isSame(nextActionDetails.nextActionDate, 'day') ? dayjs() : null}
            onChange={(newTime) => setNextActionDetails(prev => ({ 
              ...prev, 
              nextActionTime: newTime ? newTime : null 
            }))}
            sx={{ width: '100%', zIndex: 0 }} // Ensures the TimePicker takes the full width of its container
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  </div>
  <div className="flex-1">
    <h2 className="text-md font-semibold text-black mb-2">Description</h2>
    <textarea
      name="nextAction"
      id="nextAction"
      value={nextActionDetails.editNextAction}
      onChange={(e) => setNextActionDetails(prev => ({ ...prev, editNextAction: e.target.value }))}
      rows="3"
      className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none"
      placeholder="Enter next action details"
    ></textarea>
  </div>
</div>

                </div>
              </div>
            </div>
            {/* Interactions Section */}
            <div className="flex gap-4 border-2 w-full mt-3 p-4 rounded-lg relative">
              <div className='flex-1'>
                <div className='flex justify-between w-full'>
                <div className="flex items-center space-x-2 ml-4 mb-2">
                  <Message size="25px" className='text-[#779E40]' />
                  <h2 className="text-xl font-semibold text-black">Interactions</h2>
                </div>
                <div className="mr-4 mb-2">
                  <button className="flex items-center space-x-2 border rounded-md px-4 py-1 bg-[#779E40] text-white border-[#779E40]" onClick={openPopup}>
                  <QuestionAnswerSharpIcon size="10px" />
                  <h2 className="text-sm font-semibold ml-2">Last Interaction</h2>
                  </button>
                  {isLastInteractionPopUp && (
                  <div
                    className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-[100000]"
                    style={{ transform: 'translateZ(0)' }}
                  >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                      <h2 className="text-xl font-semibold text-black mb-2">Last Interaction</h2>
                      <div className="flex flex-row items-center space-x-4">
                        <div className="flex-1">
                          <h2 className="text-sm font-medium text-black mb-1">Date</h2>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                              <DatePicker
                                label="Select Date"
                                sx={{ width: '100%'}}
                          
                                onChange={(newValue) => {
                                  setSelectedDate(newValue);
                                  checkFormValidity(newValue, selectedTime, editLastInteraction);
                                }}
                                slotProps={{
                                  popper: {
                                    modifiers: [
                                      {
                                        name: 'zIndex',
                                        enabled: true,
                                        phase: 'afterWrite',
                                        fn: ({ state }) => {
                                          state.styles.popper.zIndex = 100001;
                                        },
                                      },
                                    ],
                                  },
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>

                        <div className="flex-1">
                          <h2 className="text-sm font-medium text-black mb-1">Time</h2>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['TimePicker']}>
                              <TimePicker
                                label="Select Time"
                                sx={{ width: '100%' }}
                                value={nextActionDetails.nextActionTime}
                                onChange={(newValue) => {
                                  setSelectedTime(newValue);
                                  checkFormValidity(selectedDate, newValue, editLastInteraction);
                                }}
                                slotProps={{
                                  popper: {
                                    modifiers: [
                                      {
                                        name: 'zIndex',
                                        enabled: true,
                                        phase: 'afterWrite',
                                        fn: ({ state }) => {
                                          state.styles.popper.zIndex = 100001;
                                        },
                                      },
                                    ],
                                  },
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>
                      </div>

                      <div className="flex-1 mt-4">
                        <h2 className="text-md font-semibold text-black mb-2">Description</h2>
                        <textarea
                          name="lastInteraction"
                          id="lastInteraction"
                          onChange={(e) => {
                            seteditLastInteraction(e.target.value);
                            checkFormValidity(selectedDate, selectedTime, e.target.value);
                          }}
                          rows="3"
                          className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none"
                          placeholder="Enter last interaction details"
                        ></textarea>
                      </div>

                      {errorMessage && (
                        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                      )}

                      <div className='flex justify-end mt-4'>
                        <button
                          onClick={closePopup}
                          className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-poppins rounded py-1 px-2'
                        >
                          Close
                        </button>

                        <button
                          onClick={handleSaveClick}
                          className={`border border-[#779E40] bg-[#779E40] text-white hover:bg-[#5F7E33] font-poppins rounded py-1 px-2 ml-2`}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                </div>
                </div>
                <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(30vh - 3.4rem)' }}>
                  {/* {console.log('editlastinteraction--->',editLastInteraction)} */}
                  {console.log('interactionArr--->',interactionArr)}

                  {/* {editLastInteraction && editLastInteraction?.map((interac,index) => (
                    <Box key={index} className="shadow-md bg-[#f1f1f3] mb-3" sx={{ margin: '5px', padding: '15px' }}>
                      {console.log('interact-----asdasd>',interac)}
                      {interac?.description}
                      {interac?.executiveName}
                    </Box>
                  ))} */}
                <Box
                  className="grid gap-4"
                  sx={{
                    gridTemplateColumns: 'repeat(3, 1fr)',
                  }}
                >
                  {interactionArr &&
                    interactionArr.map((item, index) => (
                      <Box
                        key={index}
                        className="bg-stone-100 p-4 border border-gray-300 rounded-md cursor-pointer"
                        sx={{
                          
                          padding: '15px',
                          display: 'flex',   
                          justifyContent: 'space-between',
                          
                        }}
                        onClick={() => openModal(index)}
                      >
                        <Box className="flex flex-col w-[80%]">
                          <Box className="text-stone-500">{item?.executiveName}</Box>
                          <Box className="mt-2">{item?.description}</Box>
                        </Box>
                        <Box className='flex flex-col justify-end items-end w-[20%]'>
                          {/* <Box className="text-stone-500" sx={{fontSize:'11px'}}>{item?.date && dayjs(item?.date).format('DD-MM-YYYY')} */}
                          <Box className="text-stone-500" sx={{fontSize:'11px'}}>{item?.date}

                          </Box>
                          {/* <Box className="text-stone-500" sx={{fontSize:'11px'}}>{item?.time && dayjs(item?.time, 'HH:mm').format('hh:mm A')} */}
                          <Box className="text-stone-500" sx={{fontSize:'11px'}}>{item?.time}
                          
                          </Box>
                        </Box>
                      </Box>
                    ))}
                </Box>
                {isModalOpen && selectedInteractionIndex !== null && (
                  <div className="fixed inset-0 flex items-center justify-center z-[100000] bg-black bg-opacity-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-1/3">
                      <button onClick={closeModal} className="absolute top-5 right-5 text-red-600">
                        <CloseIcon />
                      </button>
                      
                      <h2 className="text-xl font-semibold text-black mb-2">Interaction Details</h2>
                      <hr />
                      <div className="mt-4 flex flex-col py-2">
                        <p className='text-md font-poppins'><strong>Executive Name:</strong> {interactionArr[selectedInteractionIndex]?.executiveName}</p>
                        <p className='text-md font-poppins'><strong>Description:</strong> {interactionArr[selectedInteractionIndex]?.description}</p>
                        <p className='text-md font-poppins'><strong>Date:</strong> {interactionArr[selectedInteractionIndex]?.date && dayjs(interactionArr[selectedInteractionIndex]?.date).format('DD-MM-YYYY')}</p>
                        <p className='text-md font-poppins'><strong>Time:</strong> {interactionArr[selectedInteractionIndex]?.time && dayjs(interactionArr[selectedInteractionIndex]?.time, 'HH:mm').format('hh:mm A')}</p>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={handlePrevious}
                          className="border border-[#779E40] text-[#779E40] hover:bg-[#779E40] hover:text-white font-poppins rounded py-1 px-2"
                          disabled={selectedInteractionIndex === 0}
                          
                        >
                          <ArrowLeftIcon/> Previous
                        </button>
                        <button
                          onClick={handleNext}
                          className="border border-[#779E40] text-[#779E40] hover:bg-[#779E40] hover:text-white font-poppins rounded py-1 px-2"
                          disabled={selectedInteractionIndex === interactionArr.length - 1}
                          
                        >
                          Next <ArrowRightIcon/>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>

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
          </div>

          <div className="flex space-x-2">
            <button
              className="w-30 text-white bg-red-600 hover:bg-[#5F7E33] rounded-lg text-lg px-6 py-1"
               onClick={()=>navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-30 text-white bg-[#779E40] hover:bg-[#5F7E33] rounded-lg text-lg px-6 py-1"
              onClick={() => EditLeads(id)}
            >
              Save
            </button>
            {/* {console.log('detailsmodal edit00------->', detailsModal?.details?._id)} */}
          </div>
        </form>
      </div>

      <Toaster position="top-right" reverseOrder={false} style={{ zIndex: 200000 }}/>
      {/* </div> */}
    </>
   </MainCard>
  );
}
