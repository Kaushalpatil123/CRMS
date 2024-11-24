import { CasinoSharp } from '@mui/icons-material';
import axios from 'axios';
const server = process.env.REACT_APP_API_URL;

export const getAllInvoices = async (page, rowsPerPage, startDate, endDate, token, status, sortOrder) => {
  try {
    const params = {
      page: page || 1,
      pageSize: rowsPerPage || 10
    };
    if (startDate) {
      params.startDate = startDate;
    }

    if (endDate) {
      params.endDate = endDate;
    }

    if (status) {
      params.status = status;
    }
    if (sortOrder) {
      params.sortOrder = sortOrder;
    }

    const response = await axios.get(`${server}/api/invoice`, {
      params,
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });
    console.log('invoicess data--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllCustomer = async () => {
  try {
    const responce = await axios.get(`${server}/api/customer`);
    if (responce) {
      console.log("All customers --- >",responce)
      return responce?.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log('error ;', error.message);
    throw new Error(error);
  }
};

export const getInvoiceById = async (id) => {
  try {
    const response = await axios.get(`${server}/api/invoice/${id}`);
    console.log('id is ', id, ' and the invoice is ', response);
    return response?.data;
  } catch (error) {
    console.log('error ', error);
    throw new Error(error);
  }
};

export const getCustomerById = async (id) => {
  try {
    console.log('customer is is ', id);
    if (id._id) {
      const responce = await axios.get(`${server}/api/customer/${id._id}`);
      console.log('customer is ', responce?.data);
      return responce?.data;
    } else {
      const responce = await axios.get(`${server}/api/customer/${id}`);
      console.log('customer is ', responce?.data);
      return responce?.data;
    }
  } catch (error) {
    console.log('error :', error);
    throw new Error(error);
  }
};
export const getAllProducts = async () => {
  try {
    const responce = await axios.get(`${server}/api/product`);
    if (responce) {
      console.log(responce?.data);
      return responce?.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log('error ;', error.message);
    throw new Error(error);
  }
};

export const countTotal = (list) => {
  try {
    let count = 0;
    list.forEach((e) => {
      count += e.amount;
    });
    return count;
  } catch (error) {
    console.log('error :', error);
    throw new Error(error);
  }
};

export const DeleteInvoice = async (id, token) => {
  try {
    const response = await axios.delete(`${server}/api/invoice/${id}`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });

    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};



export const UndoDeleteInvoice = async (id, token) => {
  try {
    const response = await axios.put(`${server}/api/invoice/undo-deleted-invoice/${id}`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });

    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};

export const getAddressBycustomerId = async (id) => {
  try {
    console.log('id hai', id);
    if (id) {
      const responce = await axios.get(`${server}/api/invoice/getCustomerAddresses/${id}`);

      console.log('address of the given customer ', responce.data);
      if (responce.data.addresses) {
        return responce.data.addresses;
      } else {
        return null;
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('No addresses found for this customer');
      return ''; // Return empty string if 404 error occurs
    } else {
      console.log('error', error);
      throw new Error(error);
    }
  }
};

export const exportInvoice = async () => {
  try {
    const response = await axios.get(`${server}/api/invoice/export/invoice`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting quotations:', error);
    throw error;
  }
};
export const updateInvoice = async (id, requestData, token) => {
  try {
    const response = await axios.put(`${server}/api/invoice/${id}`, requestData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('invoice update--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};

export const AddedLeadWishlist = async (id, requestData, token) => {
  try {
    const response = await axios.put(`${server}/api/invoice/invoice-wishlist/${id}`, requestData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('invoice000000000000000000000--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};

// api/invoice/invoice-wishlist/
