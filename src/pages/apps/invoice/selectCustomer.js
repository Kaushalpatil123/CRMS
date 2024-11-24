

import React, { useEffect, useState } from 'react';
import { fetchAllCustomers } from 'pages/utils/customers/api';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const SelectCustomer = ({
  open,
  handleClose,
  onCustomerSelect,
  handleDialogOpen,


}) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      fetchCustomers();
    }
  }, [open]);
  
  const fetchCustomers = async () => {
    try {
      const data = await fetchAllCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = customers.filter((customer) =>
      `${customer.firstName} ${customer.lastName} ${customer.companyName}`
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-1/4 max-w-1/4">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="text-2xl font-semibold">Select Customer</h2>
          <button className="text-red-600" onClick={handleClose}>
            <CloseOutlinedIcon size="small" />
          </button>
        </div>
        <div className="p-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
          <div className="mt-4 bg-white border border-stone-200 rounded-lg max-h-48 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <React.Fragment key={customer._id}>
                  <div
                    className="py-3 px-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => onCustomerSelect(customer)}
                  >
                    {customer.firstName} {customer.lastName} ({customer.companyName})
                  </div>
                  <hr className="border-t" />
                </React.Fragment>
              ))
            ) : (
              <div className="py-3 px-2 text-gray-500">No customers found</div>
            )}
          </div>
          <div className="flex justify-center mt-4">
            <button
              className='flex items-center font-semibold text-green-900 border border-[#C7DBA0] bg-[#C7DBA0] hover:bg-[#779E40] rounded-sm font-inter px-4 py-0.5'
              onClick={handleDialogOpen}
            >
              <svg
                className="w-3 h-3 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Add New Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCustomer;
