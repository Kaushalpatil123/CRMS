import axios from 'axios';
const server = process.env.REACT_APP_API_URL;

export const getAllActivities = async (token) => {
    try {
        const response = await axios.get(`${server}/api/userActivity/all-activities`, {
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