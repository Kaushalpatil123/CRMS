// api.js
import axios from "axios";

// const BASE_URL = "http://localhost:8800/api/bankdetail";

const BASE_URL = process.env.REACT_APP_API_URL;



// Fetch all banks
export const fetchBanks = async () => {
    const response = await axios.get(`${BASE_URL}/api/bankdetail`);
    return response.data;
};

// Fetch bank details by ID
export const fetchBankDetailsById = async (id) => {
    const response = await axios.get(`${BASE_URL}/api/bankdetail/${id}`);
    console.log("responseresponseresponseresponse",response)
    return response.data;
};

// Add new bank details
export const addBankDetails = async (bankDetails) => {
    const response = await axios.post(`${BASE_URL}/api/bankdetail`, bankDetails);
    return response.data;
};

// Delete bank details by ID
export const deleteBankDetailsById = async (id) => {
    await axios.delete(`${BASE_URL}/api/bankdetail/${id}`);
};


export const updateBankDetailsById = async (bankId, formData) => {
    const response = await axios.put(`${BASE_URL}/api/bankdetail/${bankId}`, formData);
    return response.data;
};