import axios from 'axios';
const server = process.env.REACT_APP_API_URL;
export const getAllReceipts = async (page,rowsPerPage,startDate, endDate, token) => {
  try {
    console.log('token received-------------------------->',token)
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
    // const response = await axios.get(`${server}/api/user/getuser`,token,{params});
    const response = await axios.get(`${server}/api/payment/getAllpayments`, {
      params,
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }});
    console.log('user data--->', response?.data);
    return response?.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};




export const postNewUser = async (requestData,token) => {
    try {
      const response = await axios.post(`${server}/api/user/signup`, requestData , {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });
      console.log('user data token--->', token);
      return response.data;
    } catch (error) {
      throw new Error(error);
      console.error('Error in creating leads:', error.message);
      
    }
  };





  
export const updateUser = async (requestData,token,id) => {
    try {
      console.log('this is id in func--->',id)
      const response = await axios.put(`${server}/api/user/update/${id}`, requestData , {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });
      console.log('user data token--->', token);
      return response.data;
    } catch (error) {
      throw new Error(error);
      console.error('Error in creating leads:', error.message);
      
    }
  };


  export const DeleteUser = async (id,token) => {
    try {
      const response = await axios.delete(`${server}/api/user/deleted/${id}`, {
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

  export const getUser = async (id,token) => {
    try {
      const response = await axios.get(`${server}/api/userActivity/activity/${id}`, {
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
  // export const CreateReceipt = async (formData, token) => {
  //   try {
  //     const response = await axios.post(`${server}/api/payment/create-payment`, formData , {
  //       body: formData,
  //       headers: {  
  //         'Content-Type': 'multipart/form-data',
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     console.log('payment receipt created--->', response?.data);
  //     return response.data; // Adjust this based on the actual structure of your API response
  //   } catch (error) {
  //     // throw new Error(error);
  //     console.log(error)
  //   }
  // };
 
 
export const CreateReceipt = async (formData, token) => {
  try {
    const response = await axios.post(`${server}/api/payment/create-payment`, formData, {
      headers: {  
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      }
    });

    console.log('Payment receipt created --->', response?.data);
    return response.data; // Return the actual response from the API
  } catch (error) {
    console.error('Error creating payment receipt:', error.response?.data || error.message);
  }
};



 
  // export const EditReceipt = async (id, formData, token) => {
  //   try {
  //     const response = await axios.put(`${server}/api/payment/update-payment/${id}`, formData , {
  //       headers: {  
  //         'Content-Type': 'multipart/form-data',
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     console.log('payment receipt updated--->', response?.data);
  //     return response.data; // Adjust this based on the actual structure of your API response
  //   } catch (error) {
  //    // throw new Error(error);
  //    console.log(error)
  //   }
  // };



  export const EditReceipt = async (id, formData, token) => {
    try {
      const response = await axios.put(`${server}/api/payment/update-payment/${id}`, formData, {
        headers: {  
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });
  
      console.log('Payment receipt updated --->', response?.data);
      return response.data; // Return the actual response from the API
    } catch (error) {
      console.error('Error updating payment receipt:', error.response?.data || error.message);
    }
  };
  export const getReceiptPDF = async (id,token) => {
    try {
      const response = await axios.get(`${server}/api/payment/viewOrDownloadReceipt/${id}`, {
        responseType: 'blob',
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });
  
      return response;
    } catch (error) {
      throw new Error(error);
    }
  };


  export const getPaymentById = async (id,token) => {
    try {
      const response = await axios.get(`${server}/api/payment/get-payment/${id}`, {
        // responseType: 'blob',
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });
  
      return response?.data?.data;
    } catch (error) {
      throw new Error(error);
    }
  };