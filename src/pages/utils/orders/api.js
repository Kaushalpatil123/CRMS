import axios from "axios";
const server = process.env.REACT_APP_API_URL;

export const getAllOrders = async (page, rowsPerPage, startDate, endDate, token) => {
    try {

    
      const params = {
        page: page || 1,
        pageSize: rowsPerPage || 10,
      };
  
      // Add startDate and endDate to params if provided
      if (startDate) {
        params.startDate = startDate;
      }
  
      if (endDate) {
        params.endDate = endDate;
      }
  
      
      const response = await axios.get(`${server}/api/order/get-orders`, {
        params,
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Order data--->', response?.data);
      return response.data; // Adjust this based on the actual structure of your API response
    } catch (error) {
      throw new Error(error);
    }
  };
  

  export const getParticularOrder = async (id, token) => {
    try {
      const response = await axios.get(`${server}/api/order/get-order/${id}`, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });
      
          return response.data.data;
       
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };


  export const DeleteOrder = async (id, token) => {
    try {
      const response = await axios.delete(`${server}/api/order/delete-order/${id}`, {
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
  


  export const getAddressOfCustomer = async (id, token) => {
    try {
      const response = await axios.get(`${server}/api/invoice/getCustomerAddresses/${id}`, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });
    //   console.log('customer  addressess data--->', response?.data?.addresses
    //   );
      return response.data?.addresses; // Adjust this based on the actual structure of your API response
    } catch (error) {
      throw new Error(error);
    }
  };


  export const getAllExecutives = async (token) => {
    try {
      const response = await axios.get(`${server}/api/user/user-name`,{
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });
      console.log('lead status--->', response?.data);
      return response.data; 
    } catch (error) {
      throw new Error(error);
    }
  };




  export const createOrder = async (payload) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${server}/api/order/create-order`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || error;
    }
  };


  export const UndoDeleteOrder = async (id,token) => {
    try {
      const response = await axios.put(`${server}/api/order/undelete-order/${id}`, {
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
  

  export const EditParticularOrder = async (id, requestData, token) => {
    try {
      const response = await axios.put(`${server}/api/order/update-order/${id}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('leads data--->', response?.data);
      return response.data; // Adjust this based on the actual structure of your API response
    } catch (error) {
      throw new Error(error);
    }
};


export const AddedOrderWishlist = async (id, requestData, token) => {
  try {
    const response = await axios.put(`${server}/api/order/order-wishlist/${id}`, requestData , {
      headers: {
        
        Authorization: `Bearer ${token}`
      }
    });
    console.log('orders wishlist data--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};