import axios from 'axios';
const server = process.env.REACT_APP_API_URL;

export const getAllLeads = async ( page,rowsPerPage,startDate, endDate, sortOrder, status, isActive, executive,token) => {
  try {
    const params = {
      page: page || 1,
      pageSize: rowsPerPage || 10,
      sortOrder: sortOrder || 'desc',
      status:status,
      isactive:isActive,
      executive: executive,
    };

    // Add startDate and endDate to params if provided
    if (startDate) {
      params.startDate = startDate;
    }

    if (endDate) {
      params.endDate = endDate;
    }
   console.log(params)
    // Add status filter if provided
    if (status) {
      params.status = status;
    }
    

    const response = await axios.get(`${server}/api/leads`,{params,headers: {
      Accept: '*/*',
      Authorization: `Bearer ${token}`,
    }});
    console.log('leads data--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllOrders = async (page, rowsPerPage, startDate, endDate, sortOrder, token) => {
  try {
    const params = {
      page: page || 1,
      pageSize: rowsPerPage || 10,
    };

    if (sortOrder) {
      params.sortOrder = sortOrder;
    }
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

export const postNewLeads = async (requestData,token) => {
  try {
    const response = await axios.post(`${server}/api/leads`, requestData , {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });
    console.log('leads data token--->', token);
    return response.data;
  } catch (error) {
    console.error('Error in creating leads:', error);
    throw new Error(error);
    
    
  }
};

export const getParticularLead = async (id,token) => {
  try {
    const response = await axios.get(`${server}/api/leads/${id}`,{
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });
    console.log('leads data--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    console.log(error)
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
    console.log('Order data--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};

export const EditParticularLead = async (id, requestData, token) => {
  try {
    const response = await axios.put(`${server}/api/leads/${id}`, requestData , {
      headers: {
        
        Authorization: `Bearer ${token}`
      }
    });
    console.log('leads data--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
};

export const EditLeadStatus = async (id, requestData) => {
  try {
    const response = await axios.put(`${server}/api/leads/active/${id}`, requestData);
    console.log('leads data--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};


export const DeleteLead = async (id,token) => {
  try {
    const response = await axios.delete(`${server}/api/leads/${id}`, {
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


export const UndoDeleteLead = async (id,token) => {
  try {
    const response = await axios.put(`${server}/api/leads/undo-deleted-lead/${id}`, {
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

export const getAllProducts = async (token) => {
  try {
    const response = await axios.get(`${server}/api/product`,{
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });
    console.log('all products--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllStatus = async (token,role) => {
  try {
    const response = await axios.get(`${server}/api/status/all-status`,{
      params:{role},
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });
    console.log('lead status--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};
export const createParticularLeadStatus = async (statusName,role,selectedColor,token) => {
  try {
    const response = await axios.post(`${server}/api/status/create-status`,{
        status:statusName,
        role,
        color: selectedColor
    },
    {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });
    console.log('lead status created--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};

export const createProduct = async (obj,token) => {
  try {
    const response = await axios.post(`${server}/api/product`, obj,
    {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });
    console.log('product created--->', response?.data);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateLastInteractions = async (id, requestData, token) => {
  try {
    const response = await axios.put(`${server}/api/leads/lastInteraction/${id}`, requestData, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });
    console.log('leads data--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};

export const updateLeadStatus = async (id, requestData, token) => {
  try {
    const response = await axios.put(`${server}/api/status/update/${id}`, requestData, {
      headers: {
        
        Authorization: `Bearer ${token}`
      }
    });
    console.log('leads data--->', response?.data);
    return response.data;
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


export const postLeadsAssign = async (requestData,token) => {
  try {
    const response = await axios.post(`${server}/api/leads/assign-executive`, requestData , {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Assign leads--->', response.data);
    return response.data;
  } catch (error) {
    throw new Error(error);
    console.error('Error in creating leads:', error.message);
    
  }
};

export const postImport = async (formData,token) => {
  try {
    const response = await axios.post(`${server}/api/leads/import`, formData , {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });
    console.log('import file--->', response.data);
    return response.data;
  } catch (error) {
    throw new Error(error);
    console.error('Error in creating leads:', error.message);
    
  }
};
export const getExportFile = async (token) => {
  try {
    const response = await axios.get(`${server}/api/leads/export`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      },
      responseType: 'blob', // This is important to handle file download correctly
    });
    console.log('Export file response:', response);
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
export const markOrderPost = async (id,token) => {
  try {
    const response = await axios.post(`${server}/api/order/convert-lead/${id}`, {} , {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Mark order --->', response.data);
    return response.data;
  } catch (error) {
   // throw new Error(error);
    console.error('Error in creating leads:', error);
    
  }
};

export const AddedLeadWishlist = async (id, requestData, token) => {
  try {
    const response = await axios.put(`${server}/api/leads/lead-wishlist/${id}`, requestData , {
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