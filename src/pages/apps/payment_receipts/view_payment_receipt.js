import { Box, Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';

const ViewReceiptPage = () => {
  const [viewUrl, setViewUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    // Retrieve URLs from localStorage
    const template = localStorage.getItem('htmlTemplate');
    const url = localStorage.getItem('downloadUrl');
    if (template && url) {
      setViewUrl(template);
      setDownloadUrl(url);
    }
  }, []);

  const handlePrint = async () => {
    try {
      // Fetch the HTML content from the viewUrl
      const response = await fetch(viewUrl);
      const htmlContent = await response.text();

      // Create a hidden iframe
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'absolute';
      printIframe.style.width = '0px';
      printIframe.style.height = '0px';
      printIframe.style.border = 'none';
      printIframe.srcdoc = htmlContent; // Set the HTML content to the iframe

      // Add the iframe to the body
      document.body.appendChild(printIframe);

      // Wait for the iframe to load before printing
      printIframe.onload = () => {
        printIframe.contentWindow.focus();
        printIframe.contentWindow.print();

        // Remove the iframe after printing
        document.body.removeChild(printIframe);
      };
    } catch (error) {
      console.error('Error printing receipt:', error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'receipt.pdf'); // Customize the file name if necessary
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  return (
    <div>
      <h1>Receipt Preview</h1>

      {/* Show loader while iframe is loading */}
      {loading && (
        <div className="flex justify-center items-center" style={{ height: '80vh' }}>
          <CircularProgress /> {/* MUI circular loader */}
        </div>
      )}

      {/* iframe that displays the receipt */}
      {viewUrl && (
        <iframe
          src={viewUrl}
          style={{ width: '100%', height: '80vh', border: 'none', display: loading ? 'none' : 'block' }}
          title="Receipt Preview"
          onLoad={() => setLoading(false)} // Hide loader when iframe is loaded
        ></iframe>
      )}

      <Box className="flex justify-center items-center py-8">
        <Button className="text-white bg-green-600 px-6 rounded-[5px]" onClick={handleDownload}>
          📥 DOWNLOAD
        </Button>
      </Box>
    </div>
  );
};

export default ViewReceiptPage;
