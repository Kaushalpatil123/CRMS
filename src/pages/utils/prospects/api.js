import axios from "axios";
const server = process.env.REACT_APP_API_URL;

export const getAllProspects = async () => {
    try {
      const response = await axios.get(`${server}/api/prospect/getAllProspects`);
      console.log('prospects data--->',response?.data)
      return response.data; 
    } catch (error) {
      throw new Error(error);
    }
};





export const getParticularProspect= async (id) => {
  try {
    const response = await axios.get(`${server}/api/prospect/get-prospect/${id}`);
    console.log('particular prospect data--->', response?.data);
    return response.data.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    throw new Error(error);
  }
};


// export const getChartData = async () => {
//     try {
//       const response = await axios.get(`${server}/api/leads/dashboard/lead-count`);
//       console.log('Chart  data--->',response?.data)
//       return response.data; // Adjust this based on the actual structure of your API response
//     } catch (error) {
//       throw new Error(error);
//   }
// };



export const getChartData = async () => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('authToken');

    // Make the request with the token in the Authorization header
    const response = await axios.get(`${server}/api/leads/dashboard/lead-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Chart data--->', response?.data);
    return response.data; // Adjust this based on the actual structure of your API response
  } catch (error) {
    console.log('Error fetching chart data:', error.message);
    throw new Error(error);
  }
};


