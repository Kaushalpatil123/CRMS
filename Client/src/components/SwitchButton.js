import axios from 'axios';
import React, { useState, useEffect } from 'react';

const SwitchButton = ({ id }) => {
  const [isOn, setIsOn] = useState(false);

  const server = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchInitialState = async () => {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.get(`${server}/api/admin/getAllUser`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const product = data.find((product) => product._id.toString() === id);
        // console.log('data suspended default--->', product.isSuspended);
        setIsOn(product.isSuspended);
      } catch (error) {
        console.log(error);
      }
    };

    fetchInitialState();
  }, [id, server]);

  useEffect(() => {
    const fetchInitialState = async () => {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.get(`${server}/api/admin/allcoach`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const product = data.formattedCoaches.find((product) => product._id.toString() === id);
        // console.log('data suspended default--->', product.isSuspended);
        setIsOn(product.isSuspended);
      } catch (error) {
        console.log(error);
      }
    };

    fetchInitialState();
  }, [id, server]);

  // for ground status
  useEffect(() => {
    const fetchInitialState = async () => {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.get(`${server}/api/ground/getall`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const product = data.data.find((product) => product._id.toString() === id);

        setIsOn(product.recommended);
      } catch (error) {
        console.log(error);
      }
    };

    fetchInitialState();
  }, [id, server]);

  const admin_update = `/api/admin/update/${id}`;
  const toggleSwitch = async () => {
    const token = localStorage.getItem('token');
    setIsOn((prevIsOn) => !prevIsOn);

    try {
      const { data } = await axios.put(
        `${server}${admin_update}`,
        { isSuspended: !isOn },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(data);
    } catch (error) {
      console.log('Primary API failed. Trying fallback API...');
      try {
        const { data: fallbackData } = await axios.put(
          `${server}/api/ground/recommend/${id}`,
          { isSuspended: !isOn },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log(fallbackData);
      } catch (fallbackError) {
        console.log('Fallback API also failed:', fallbackError);
      }
    }
  };

  return (
    <div className="flex items-center cursor-pointer" onClick={toggleSwitch}>
      <div className={`relative w-10 h-5 rounded-full p-1 duration-300 ${isOn ? 'bg-green-400' : 'bg-gray-400'}`}>
        <div
          className={`mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 absolute w-3 h-3 bg-white rounded-full shadow-md transform duration-300 ${
            isOn ? 'translate-x-6' : 'translate-x-0'
          }`}
        ></div>
      </div>

      <span className="ml-2 text-sm font-semibold">{isOn ? 'ON' : 'OFF'}</span>
    </div>
  );
};

export default SwitchButton;
