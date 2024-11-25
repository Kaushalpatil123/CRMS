//api/leads/dashboard/modul-counts
// import axios from 'axios';
// const server = process.env.REACT_APP_API_URL;
// export const getAllModuleCounts = async () => {
//     try {
//       const response = await axios.get(`${server}/api/leads/dashboard/modul-counts`);
//       if (response) {
//         console.log("All customers --- >",response)
//         return response?.data;
//       } else {
//         return null;
//       }
//     } catch (error) {
//       console.log('error ;', error.message);
//       throw new Error(error);
//     }
//   };




import axios from 'axios';

const server = process.env.REACT_APP_API_URL;

export const getAllModuleCounts = async () => {
  const token = localStorage.getItem('token')

  try {
    // Get the token from localStorage

    // Make the request with the token in the Authorization header
    const response = await axios.get(`${server}/api/leads/dashboard/modul-counts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response) {
      console.log("All customers --- >", response);
      return response?.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log('error ;', error.message);
    throw new Error(error);
  }
};
