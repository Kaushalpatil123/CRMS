import React, { useState } from 'react';
import {
  Box, Grid, Button, DialogContent, DialogTitle, IconButton, Typography, Dialog
} from '@mui/material';
import {
  CalendarToday as CalendarTodayIcon,
  AccountCircle as AccountCircleIcon,
  Close as CloseIcon,
  LocalPhone as LocalPhoneIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  PictureAsPdf as PictureAsPdfIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Print as PrintIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaFileInvoice, FaPlusCircle } from 'react-icons/fa';
import axios from 'axios';
import { downloadQuotationPDF } from 'pages/utils/view/api';

const QuotationPopUp = ({data , onClose, isOpen, onDelete }) => {
  
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  
  
  if (!data) return null;

  const handleDownloadPDF = async () => {
    setLoading(true);
    document.body.style.cursor = 'wait';
    try {
      const response = await downloadQuotationPDF(data._id);

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quotation_${data.quotationNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    } finally {
      setLoading(false);
      document.body.style.cursor = 'default';
    }
  };

  const handlePrintPDF = async () => {
    setLoading(true);
    document.body.style.cursor = 'wait';
    try {
      const response = await downloadQuotationPDF(data._id);
      
      // Check if the response is valid
      if (!response || !response.data) throw new Error("No PDF data received");
  
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      
      // Create a new window and wait for it to load
      const pdfWindow = window.open(url);
      if (pdfWindow) {
        pdfWindow.addEventListener('load', () => {
          pdfWindow.print();
          window.URL.revokeObjectURL(url); // Cleanup the object URL after printing
        });
      } else {
        console.warn("Popup blocked, cannot open PDF");
      }
    } catch (error) {
      console.error("Error downloading and printing the PDF:", error);
    } finally {
      setLoading(false);
      document.body.style.cursor = 'default';
    }
  };
  


  
 

  
 
 
  const handleDeleteAndClose = () => {
    // Check if data and _id are present
    if (!data || !data._id) {
      console.error("Quotation data is missing or does not have an _id.");
      return; // Stop further execution if the _id is not available
    }

    console.log(`Deleting quotation with ID: ${data._id}`);
    onDelete(data._id); // Delete using data ID
    onClose(); // Close modal after deletion
  };



  return (
    <Dialog
    open={isOpen}  // Control the modal open/close state with isOpen prop
    onClose={onClose}
      PaperProps={{
        sx: {
          position: 'absolute',
          top: 0,
          right: 0,
          margin: 0,
          width: '35vw',
          minWidth: '300px',
          maxWidth: '35vw',
          padding: '16px',
          minHeight: '100vh',
          borderRadius: '0px',
          zIndex: 20000,
        },
      }}
    >
      <DialogTitle id="quotation-popup-title">
        <Grid container alignItems="flex-start" justifyContent="space-between" marginTop={6}>
          <Grid item xs={8}>
            <Typography className="font-semibold text-2xl font-inter text-center text-black inline-flex items-center whitespace-nowrap">
              PREMSANG DEVELOPERS PVT. LTD.
            </Typography>
          </Grid>
          <Grid item xs={4} container justifyContent="flex-end">
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dividers sx={{ padding: '16px', overflow: 'hidden', maxHeight: '80vh' }}>
      <div className="flex flex-col ">
  <div className="grid grid-cols-1 gap-4">
    {/* Header */}
    <div className="mt-4 flex items-center justify-between">
  <span className="text-red-700 font-medium text-lg inline-flex items-center">
    <CalendarTodayIcon className="mr-1" /> 
    {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
  </span>
  <span className="text-black-700 border border-black px-2 font-medium text-base"> QuotationNo &nbsp;: &nbsp;{data.quotationNo}</span>
  {/* <span className="px-2">|</span>
  <span className="text-lg inline-flex items-center">
    <AccountCircleIcon className="mr-1" /> {data.contactPerson}
  </span> */}
</div>

    {/* Customer Details */}
    <div className=' '>
      <h1 className="text-lg font-medium pt-4  border-b border-gray-300 w-auto">CUSTOMER DETAILS</h1>
    
        <button className=" text-black  py-2 flex items-center space-x-2">
          <AccountCircleIcon className="text-blue-600 group-hover:text-white"/>
          <span className=' text-base text-black-700'>Name &nbsp; : &nbsp;{data?.customer?.firstName} {data?.customer?.lastName}</span>
        </button>
        <button className="text-black py-2 flex items-center space-x-2">
          <LocalPhoneIcon className="text-lime-600 group-hover:text-white" />
          <span className=' text-base text-black-700'>Mobile No. &nbsp; : {(data?.customer?.mobile)?`${data.customer.mobile}`:'-'}</span>
        </button>

        <button className="text-black py-2 flex items-center space-x-2">
        <EmailIcon className="text-red-600 group-hover:text-white" />

          <span className=' text-base text-black-700'>Email &nbsp; : {(data?.customer?.email)?`${data.customer.email}`:'-'}</span>
        </button>
      


    </div>

    {/* Financials */}
    {/* <div>
      <p className="text-xl font-light pt-2 pb-2">Financials</p>
      <div className="flex space-x-4">
        <button className="border-2 border-gray-400 text-black px-2 py-1">
          Pre-Tax ₹ {data.totalAmountBeforeTax}
        </button>
        <button className="border-2 border-gray-400 text-black px-2 py-1">
          Amount ₹ {data.grandTotal}
        </button>
      </div>
    </div> */}
<div className='flex items-center justify-between'>
<div className='w-auto'>
  <h1 className="text-lg font-medium pt-2 border-b border-gray-300 w-auto">STATUS</h1>
  <div className="flex items-center justify-between space-x-4 py-2">
    <button 
      className={`text-black py-1 px-2 mt-2 rounded flex items-center space-x-2 
        ${data?.status === "Paid" ? 'bg-green-500' :
          data?.status === "Partially Paid" ? 'bg-yellow-500' :
          data?.status === "Overdue" ? 'bg-orange-500' :
          data?.status === "Unpaid" ? 'bg-red-600' : 
          'bg-gray-400'} // Default color if status is missing
        text-white text-base`}
    >
      <span>{data?.status ? data.status : "No Status"}</span>
    </button>
  </div>
  



</div>

<div className='w-auto'>
  <h1 className="text-lg font-medium pt-2 border-b border-gray-300 w-auto">CONTACT-PERSON</h1>
  <div className="flex items-center justify-between space-x-4 py-2">
    <button 
      className="text-white py-1 px-2 mt-2 font-inter font-lg rounded flex items-center space-x-2 bg-gray-400"
    
    >
           <span className="uppercase">{data?.contactPerson}</span>
    </button>
  </div>

  


</div>





</div>

    {/* Actions */}
    <div  >
      <p className="text-lg font-medium pt-2  border-b border-gray-300 w-auto">ACTIONS</p>
      <div className="flex items-center justify-between space-x-2 mt-4 ">
      <div className="flex space-x-2 ">
      {/* <Link to={`/apps/quote/editQuote/${data._id}`}> */}
          <button className="text-lime-600 font-base font-inter rounded text-md  flex items-center space-x-2 group  hover:text-lime-700"
                    onClick={() => navigate(`/apps/quote/editQuote`, { state: { quotationId: data._id } })}
          >
          <FaEdit size={22} />
          </button>
        {/* </Link> */}
        {/* <button
          onClick={handleDeleteAndClose}
          // disabled={!quotationData || !quotationData._id}
          className="text-red-600 font-base rounded-md text-md  flex items-center space-x-2 group "
        >
          <DeleteIcon className="text-red-600 " />
         
        </button> */}
        <button className=" font-base font-inter rounded-md text-md flex items-center space-x-2 group  hover:text-white"
         onClick={() => navigate(`/apps/quote/createQuote`)}>
        <FaPlusCircle className="text-red-600" size={24} />
         
        </button>  
        </div>
        {/* <button className="text-white  font-base font-inter rounded-md text-md  flex items-center space-x-2 group hover:bg-lime-700 bg-lime-600 hover:text-white">
          <ShoppingCartIcon className="text-white" />
          <span></span>
        </button> */}
           
        
      </div>
    </div>


        <div className='border-t border-gray-300 flex items-center justify-between'>
    
        <button className="text-black border-2 mt-4 border-red-700 font-medium rounded-md text-md px-4 py-2 flex items-center w-auto space-x-2 group hover:bg-red-700 hover:text-white"
         onClick={handlePrintPDF}
         disabled={loading}
        >
          <PrintIcon className="text-red-700 group-hover:text-white" />
          <span>PRINT PDF</span>
        </button>


        <button className="text-black border-2 border-red-700 mt-4   font-medium rounded-md text-md px-4 py-2 flex items-center space-x-2 group hover:bg-red-700 hover:text-white"
          onClick={handleDownloadPDF}
          disabled={loading}
         >
          <PictureAsPdfIcon className="text-red-700 group-hover:text-white" />
          <span>DOWNLOAD PDF</span>
        </button>

        </div>
    

    {/* Share */} 
    {/* <div>
      <p className="text-xl font-light pt-2 pb-2">Share</p>
      <div className="flex space-x-2">
        <button className="text-black border-2 border-red-400 font-medium rounded-md text-md px-4 py-2 flex items-center space-x-2 group hover:bg-red-400 hover:text-white">
          <PictureAsPdfIcon className="text-red-500 group-hover:text-white" />
          <span>PDF</span>
        </button>
        <button className="text-black border-2 border-green-400 font-medium rounded-md text-md px-4 py-2 flex items-center space-x-2 group hover:bg-green-400 hover:text-white">
          <WhatsAppIcon className="text-green-400 group-hover:text-white" />
          <span>WhatsApp</span>
        </button>
        <button className="text-black border-2 border-yellow-400 font-medium rounded-md text-md px-4 py-2 flex items-center space-x-2 group hover:bg-yellow-400 hover:text-white">
          <EmailIcon className="text-yellow-400 group-hover:text-white" />
          <span>Email</span>
        </button>
        <button className="text-black border-2 border-gray-400 font-medium rounded-md text-md px-4 py-2 flex items-center space-x-2 group hover:bg-gray-400 hover:text-white"
         onClick={handlePrintPDF}
        >
          <PrintIcon className="text-gray-400 group-hover:text-white" />
          <span>Print</span>
        </button>
      </div>
    </div> */}
  </div>
  
</div>

      </DialogContent>
    </Dialog>
  );
};

export default QuotationPopUp;
