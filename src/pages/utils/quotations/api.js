// import axios from 'axios';


// // const server = process.env.REACT_APP_API_URL;

// const BASE_URL = process.env.REACT_APP_API_URL;

// export const fetchQuotationById = async (quotationId) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/api/quotation/get-quotation/${quotationId}`);
//     console.log('Quotation-data--->',response?.data)
//     return response.data.data;
//   } catch (error) {
//     console.error('Error fetching quotation:', error);
//     throw error;
//   }
// };


// export const getListData = async( startDate, endDate, page, pageSize,token, rowsPerPage, isWishlist,status, sortOrder) => {
//   try {
//     const params = {
//       page: page || 1,
//       pageSize,
//       isWishlist, // Add this line
    
   
//     };

//     // Add startDate and endDate to params if provided


//       // Add status and sortOrder to params only if they are not empty
//       if (status) {
//         params.status = status;
//       }
//       if (sortOrder) {
//         params.sortOrder = sortOrder;
//       }
      
//     if (page) {
//       params.page = page;
//     }
//     if (pageSize) {
//       params.pageSize = pageSize;
//     }
//     if (startDate) {
//       params.startDate = startDate;
//     }

//     if (endDate) {
//       params.endDate = endDate;
//     }

//     const response = await axios.get(`${BASE_URL}/api/quotation/getAllquotations`,{params,headers: {
//       Accept: '*/*',
//       Authorization: `Bearer ${token}`,
//     }});
//     console.log('leads data-78787878-->', response?.data);
//     return response.data; // Adjust this based on the actual structure of your API response
//   } catch (error) {
//     throw new Error(error);
//   }
// };



// export const updateQuotationAPI = async (quotationId, formData, token) => {
//   try {
//     const response = await axios.put(
//       `${BASE_URL}/api/quotation/update-quotation/${quotationId}`,
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data', // Important for file uploads
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error updating quotation:', error.response ? error.response.data : error);
//     throw error;
//   }
// };


// export const fetchQuotations = async (page,pageSize) => {
//   // http://localhost:8800/api/quotation/getA?llquotations?page=1&pageSize=10

//     try {
//       const response = await axios.get(`${BASE_URL}/api/quotation/getAllquotations?page=${page}&pageSize=${pageSize}`);
//       return response.data.data.quotations;
//     } catch (error) {
//       console.error('Error fetching quotations:', error);
//       throw error;
//     }
//   };
  
//   export const deleteQuotation = async (id) => {
//     try {
//       await axios.delete(`${BASE_URL}/api/quotation/delete-quotation/${id}`);
//     } catch (error) {
//       console.error('Error deleting quotation:', error);
//       throw error;
//     }
//   };

//   export const createQuotation = async (payload, uploadFile) => {
//     const formData = new FormData();
//     for (const key in payload) {
//       formData.append(key, payload[key]);
//     }
//     if (uploadFile) {
//       formData.append('uploadFile', uploadFile);
//     }
  
//     // const token =
//     // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmJjODQ0NzkxOGZmNmJmMTI5YTFjZTYiLCJpYXQiOjE3MjYyMDEzNjYsImV4cCI6MTcyODc5MzM2Nn0.FL1QM7gsML9SGneEmfuftqqQRcdTdDBkXS6nEhChfP4';

//   const token = localStorage.getItem('token');
//     try {
//       const response = await axios.post(`${BASE_URL}/api/quotation/create-quotation`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       console.log('Quotation created------------>', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating quotation:', error);
//       throw error;
//     }
//   };


//   export const exportQuotations = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/quotation/exportquotation`, {
//         responseType: 'blob', 
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error exporting quotations:', error);
//       throw error;
//     }
//   };

//   // http://localhost:8800/api/quotation/quotation-wishlist/66f9625c00922c820e598636
//   // https://zosgo88k0gkco4kww8gc4gkw.srv-01.purezzatechnologies.com/api/quotation/quotation-wishlist/66f7a1873f354ce91b077bf6


// // http://localhost:8800/api/quotation/quotation-wishlist/66f9625c00922c820e598636

//   export const updateWishlistStatusAPI = async (quotationId, wishlistStatus, token) => {
//     try {
//       const response = await axios.put
//       (
//         `${BASE_URL}/api/quotation/quotation-wishlist/${"66f9625c00922c820e598636"}`,
//         { wishlist: wishlistStatus }, // Update the wishlist status
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Error updating wishlist status:', error.response ? error.response.data : error);
//       throw error;
//     }
//   };


  


 


  // aasadasd


  
  import axios from 'axios';


  const BASE_URL = process.env.REACT_APP_API_URL;
  
  export const fetchQuotationById = async (quotationId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/quotation/get-quotation/${quotationId}`);
      console.log('Quotation-data--->',response?.data)
      return response.data.data;
    } catch (error) {
      console.error('Error fetching quotation:', error);
      throw error;
    }
  };
  
  
  export const getListData = async( startDate, endDate, page, pageSize,token, rowsPerPage,status, sortOrder) => {
    try {
      const params = {
        page: page || 1,
        pageSize,
        // isWishlist, // Add this line
      
     
      };
  
      // Add startDate and endDate to params if provided
  
  
        // Add status and sortOrder to params only if they are not empty
        if (status) {
          params.status = status;
        }
        if (sortOrder) {
          params.sortOrder = sortOrder;
        }
  
  
      if (page) {
        params.page = page;
      }
      if (pageSize) {
        params.pageSize = pageSize;
      }
      if (startDate) {
        params.startDate = startDate;
      }
  
      if (endDate) {
        params.endDate = endDate;
      }
  
      const response = await axios.get(`${BASE_URL}/api/quotation/getAllquotations`,{params,headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      }});
      console.log('leads data-78787878-->', response?.data);
      return response.data; // Adjust this based on the actual structure of your API response
    } catch (error) {
      throw new Error(error);
    }
  };
  
  
  
  export const updateQuotationAPI = async (quotationId, formData, token) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/quotation/update-quotation/${quotationId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Important for file uploads
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating quotation:', error.response ? error.response.data : error);
      throw error;
    }
  };
  
  
  export const fetchQuotations = async (page,pageSize) => {
    // http://localhost:8800/api/quotation/getA?llquotations?page=1&pageSize=10
  
      try {
        const response = await axios.get(`${BASE_URL}/api/quotation/getAllquotations?page=${page}&pageSize=${pageSize}`);
        return response.data.data.quotations;
      } catch (error) {
        console.error('Error fetching quotations:', error);
        throw error;
      }
    };
    

  
    export const createQuotation = async (payload, uploadFile) => {
      const formData = new FormData();
      for (const key in payload) {
        formData.append(key, payload[key]);
      }
      if (uploadFile) {
        formData.append('uploadFile', uploadFile);
      }
      // const token =
      // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmJjODQ0NzkxOGZmNmJmMTI5YTFjZTYiLCJpYXQiOjE3MjYyMDEzNjYsImV4cCI6MTcyODc5MzM2Nn0.FL1QM7gsML9SGneEmfuftqqQRcdTdDBkXS6nEhChfP4';
  
    const token = localStorage.getItem('token');
      try {
        const response = await axios.post(`${BASE_URL}/api/quotation/create-quotation`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Quotation created------------>', response.data);
        return response.data;
      } catch (error) {
        console.error('Error creating quotation:', error);
        throw error;
      }
    };
  
  
    export const exportQuotations = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/quotation/exportquotation`, {
          responseType: 'blob', 
        });
        return response.data;
      } catch (error) {
        console.error('Error exporting quotations:', error);
        throw error;
      }
    };
  
  
    export const AddedLeadWishlist = async (id, requestData, token) => {
      try {
        const response = await axios.put(`${BASE_URL}/api/quotation/quotation-wishlist/${id}`, requestData , {
          headers: {
            
            Authorization: `Bearer ${token}`
          }
        });
        console.log('quotation data--->', response?.data);
        return response.data; // Adjust this based on the actual structure of your API response
      } catch (error) {
        throw new Error(error);
      }
    };
  

    
export const UndoDeleteQuotation = async (id,token) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/quotation/undo-deleted-quotation/${id}`, {
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



// export const deleteQuotation = async (id) => {
//   try {
//     await axios.delete(`${BASE_URL}/api/quotation/delete-quotation/${id}`);
//   } catch (error) {
//     console.error('Error deleting quotation:', error);
//     throw error;
//   }
// };



export const DeleteInvoice = async (id, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/quotation/delete-quotation/${id}`, {
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
    const response = await axios.put(`${BASE_URL}/api/quotation/undo-deleted-quotation/${id}`, {
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

   