import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8800';



// const response = await axios.get(`${BASE_URL}/api/quotation/get-quotation/${quotationId}`);


export const fetchCustomerAddresses = async (customerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/invoice/getCustomerAddresses/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch addresses:', error);
    throw error;
  }
};


export const getAddressById = async (addressId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/invoice/getAddressById/${addressId}`);
      return response.data;  // Assuming data contains the address details
    } catch (error) {
      console.error('Failed to fetch address details:', error);
      throw error;
    }
  };