import axios from 'axios';

const server = process.env.REACT_APP_API_URL;

export const addCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${server}/api/customer`, customerData);

    console.log('Customer added--->', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding customer:', error.response.data);
    throw error; 
  }
};


export const fetchAllCustomers = async () => {
      const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${server}/api/customer`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });

    console.log('customer list----->', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};
// export const fetchAddressById = async (id,token) => {
//   try{
//   const response = await axios.get(`${server}/api/invoice/getCustomerAddresses/${id}`, {
    
//     headers: {
//       Accept: '*/*',
//       Authorization: `Bearer ${token}`
//     }
//   });
//   console.log('Order data--->', response?.data);
//   return response.data; // Adjust this based on the actual structure of your API response
// } catch (error) {
//   throw new Error(error);
// }
// };
export const fetchAddressById = async (id) => {
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
