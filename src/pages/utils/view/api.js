
import axios from 'axios';


const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8800';


export const downloadQuotationPDF = async (quotationId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/quotation/download/${quotationId}`, {
        responseType: 'blob', // Important for file downloads
      });
      return response;
    } catch (error) {
      throw error; 
    }
  };