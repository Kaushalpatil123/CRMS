import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchAllCustomers } from 'pages/utils/customers/api';
import AddCustomer from 'pages/apps/orders/components/addCustomer'

const SelectCustomer = ({ open, handleClose, onCustomerSelect }) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddCustomer, setOpenAddCustomer] = useState(false);


  const handleOpenAddCustomer = () => setOpenAddCustomer(true);
  const handleCloseAddCustomer = () => setOpenAddCustomer(false);

  const navigate = useNavigate();

  // Fetch customers when the component mounts or `open` changes
  useEffect(() => {
    if (open) {
      fetchCustomers();
    }
  }, [open]);

  // Function to fetch customers from the API
  const fetchCustomers = async () => {
    try {
      const data = await fetchAllCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // Function to handle customer selection
  const handleCustomerSelect = (customer) => {
    // Debugging log
    console.log('Customer Selected:', customer);

    setSelectedCustomer(customer);

    // Ensure customerName is correctly set from customer object
    const customerName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();

    if (onCustomerSelect) {
      console.log('Calling onCustomerSelect with:', {
        customerId: customer._id,
        customerName: customerName
      }); // Debug log
      onCustomerSelect({
        customerId: customer._id,
        customerName: customerName
      });
    }

    handleClose(); // Ensure this closes the modal
  };

  // Function to handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = customers.filter((customer) =>
      `${customer.firstName} ${customer.lastName} ${customer.companyName}`.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  // Return null if the modal is not open
  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-[5000]">
      <div className="bg-white rounded-lg w-1/4 max-w-1/4">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="text-2xl font-semibold">Select Customer</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={handleClose}>
            &times;
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
                  <div className="py-3 px-2 cursor-pointer hover:bg-gray-100" onClick={() => handleCustomerSelect(customer)}>
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
              className="flex items-center px-4 py-2.5 bg-[#779E40] text-white font-normal-400 hover:bg-[#5F7E33] hover:text-white font-intertext-white font-semibold rounded "
              // onClick={() => navigate(`/apps/quotation/addCustomer`)}
              onClick={handleOpenAddCustomer}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add New Customer
            </button>
            <AddCustomer open={openAddCustomer} handleClose={handleCloseAddCustomer} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCustomer;
