import axios from 'axios';
const server = process.env.REACT_APP_API_URL;
export const getAllUsers = async (token) => {
  try {
    const params = {
      // page: page || 1,
      // pageSize: rowsPerPage || 10,
    //   sortOrder: sortOrder || 'desc',
    //   status:status,
    //   isActive:isActive || true,
    //   executive: executive,
    };

    // // Add startDate and endDate to params if provided
    // if (startDate) {
    //   params.startDate = startDate;
    // }

    // if (endDate) {
    //   params.endDate = endDate;
    // }

    // // Add status filter if provided
    // if (status) {
    //   params.status = status;
    // }
    console.log('token received-------------------------->',token)

    // const response = await axios.get(`${server}/api/user/getuser`,token,{params});
    const response = await axios.get(`${server}/api/user/getuser`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }});
    console.log('user data--->', response?.data);
    return response?.data?.data; // Adjust this based on the actual structure of your API response
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



  export const UndoDeleteUser = async (id,token) => {
    try {
      const response = await axios.put(`${server}/api/user/undo-deleted-user/${id}`, {
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

  export const getUserPassword = async (id,token) => {
    try {
      const response = await axios.get(`${server}/api/user/password/${id}`, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`
        }
      });
  
      return response.data?.data; // Adjust this based on the actual structure of your API response
    } catch (error) {
      throw new Error(error);
    }
  };



  
export const AddedUserManagementWishlist = async (id, requestData, token) => {
  try {
    const response = await axios.put(`${server}/api/user/user-wishlist/${id}`, requestData , {
      headers: {
        
        Authorization: `Bearer ${token}`
      }
    });
    console.log('user wishlist data--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};