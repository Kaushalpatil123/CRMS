import axios from 'axios';

const server = process.env.REACT_APP_API_URL;

export const fetchAllProducts = async (page, rowsPerPage, startDate, endDate) => {
  const token = localStorage.getItem('token')

  try {
    const params = {
      page: page || 1,
      pageSize: rowsPerPage || 10,
    };

    if (startDate) {
      params.startDate = startDate;
    }

    if (endDate) {
      params.endDate = endDate;
    }
    const response = await axios.get(`${server}/api/product`, {params,
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw the error for handling in the component
  }
};



export const fetchAllProductsAdmin = async (page, rowsPerPage, startDate, endDate, token) => {
  try {
    const params = {
      page: page || 1,
      pageSize: rowsPerPage || 10,
    };

    if (startDate) {
      params.startDate = startDate;
    }

    if (endDate) {
      params.endDate = endDate;
    }
    const response = await axios.get(`${server}/api/product/admin`, {params,
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data.products)
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw the error for handling in the component
  }
};





export const getParticularProduct = async (id) => {
  try {
    const response = await axios.get(`${server}/api/product/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw the error for handling in the component
  }
};


export const DeleteProducts = async (id,token) => {
  try {
    const response = await axios.delete(`${server}/api/product/${id}`, {
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




export const UndoDeleteProduct = async (id,token) => {
  try {
    const response = await axios.put(`${server}/api/product/undo-deleted-product/${id}`, {
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



export const AddProduct = async (productData, token) => {
  try {
    const response = await axios.post(`${server}/api/product`, productData, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    console.error('Error submitting product:', error);
    throw error;
  }
};


export const EditParticularProduct = async (id, requestData, token) => {
  try {
    const response = await axios.put(`${server}/api/product/${id}`, requestData , {
      headers: {
        
        Authorization: `Bearer ${token}`
      }
    });
    console.log('product data--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};



// Adding the add category API call
export const AddCategory = async (categoryName) => {
  try {
    const response = await axios.post(`${server}/api/category`,categoryName, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};




// Add a new subcategory to a specific category
export const AddSubcategory = async (categoryId, subcategoryName) => {
  try {
    console.log('subcategory name --->',subcategoryName)
    const response = await axios.post(`${server}/api/category/${categoryId}/subcategory`, subcategoryName, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    console.error('Error adding subcategory:', error);
    throw error;
  }
};



export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${server}/api/category`);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};



export const AddedProductWishlist = async (id, requestData, token) => {
  try {
    const response = await axios.put(`${server}/api/product/product-wishlist/${id}`, requestData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};