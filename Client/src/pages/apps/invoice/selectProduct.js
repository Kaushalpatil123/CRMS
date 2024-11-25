// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { getAllProducts } from 'pages/utils/invoices/api';
// import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

// const SelectProduct = ({ open, handleClose,onSelectProduct, handleDialogOpen }) => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   const navigate = useNavigate();

//   // Fetch products when the component mounts or `open` changes
//   useEffect(() => {
//     if (open) {
//       fetchAllProducts();
//     }
//   }, [open]);

//   // Function to fetch products from the API
//   const fetchAllProducts = async () => {
//     try {
//       const data = await getAllProducts();
//       console.log(data);
//       setProducts(data?.products);
    
//       setFilteredProducts(data?.products);
      
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   // Function to handle customer selection
// //   const handleProductSelect = (product) => {
// //     // Debugging log
// //     console.log('product Selected:', product);
  
// //     setSelectedProduct(product);

// //     // Ensure customerName is correctly set from customer object
// //    // const productName = `${product.firstName || ''} ${product.lastName || ''}`.trim();
  
// //     // if (onProductSelect) {
// //     //   console.log('Calling onproductSelect with:', {
// //     //     productId: product._id,
// //     //     productName: productName,
// //     //   }); // Debug log
// //     //   onProductSelect({
// //     //     productId: product._id,
// //     //     productName: productName,
// //     //   });
// //     // }
  
// //     handleClose(); // Ensure this closes the modal
// //   };
//   const handleProductSelect = (product) => {
//     onSelectProduct(product); // Pass selected product to parent component
//     setSearchTerm(''); // Optionally clear the search term
//     handleClose(); // Close the popup after selection
//   };
//   // Function to handle search input change
  
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     const filtered = products.filter((product) =>
//       product.itemname.toLowerCase().includes(e.target.value.toLowerCase())
//     );
//     setFilteredProducts(filtered);
//   };
  
//   // Return null if the modal is not open
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white rounded-lg w-1/4 max-w-1/4">
//         <div className="flex items-center justify-between px-4 py-2 border-b">
//           <h2 className="text-2xl font-semibold">Select Product</h2>
//           <button
//             className="text-red-600"
//             onClick={handleClose}
//           >
//             <CloseOutlinedIcon size="small" />
//           </button>
//         </div>
//         <div className="p-4">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={handleSearch}
//             placeholder="Search"
//             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
//           />
//           <div className="mt-4 bg-white border border-stone-200 rounded-lg max-h-48 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400">
//             {filteredProducts.length > 0 ? (
//               filteredProducts.map((product) => (
//                 <React.Fragment key={product._id}>
//                   <div
//                     className="py-3 px-2 cursor-pointer hover:bg-gray-100"
//                     onClick={() => handleProductSelect(product)}
//                   >
//                     {product.itemname}
//                   </div>
//                   <hr className="border-t" />
//                 </React.Fragment>
//               ))
//             ) : (
//               <div className="py-3 px-2 text-gray-500">No products found</div>
//             )}
//           </div>
//           <div className="flex justify-center mt-4">
//             <button
//               //className="flex items-center px-4 py-2.5 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
//               // onClick={() => navigate(`/apps/quote/addCustomer`)}
//               className='flex items-center font-semibold text-green-900 border border-[#C7DBA0] bg-[#C7DBA0] hover:bg-[#779E40] rounded-sm font-inter px-4 py-0.5'
//               onClick={handleDialogOpen}
//             >
//               <svg
//                 className="w-3 h-3 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 4v16m8-8H4"
//                 ></path>
//               </svg>
//               Add New Product
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SelectProduct;

// const SelectProduct = ({ open, handleClose, onSelectProduct}) => {
//     const [products, setProducts] = useState([]);
//     const [filteredProducts, setFilteredProducts] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
  
//     useEffect(() => {
//       if (open) {
//         fetchAllProducts();
//       }
//     }, [open]);
  
//     const fetchAllProducts = async () => {
//       try {
//         const data = await getAllProducts();
//         setProducts(data?.products);
//         setFilteredProducts(data?.products);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//     };
  
//     const handleProductSelect = (product) => {
//       console.log("Selected table item---->",product);
//       onSelectProduct(product);
//       handleClose();
//     };
  
//     const handleSearch = (e) => {
//       setSearchTerm(e.target.value);
//       const filtered = products.filter((product) =>
//         product.itemname.toLowerCase().includes(e.target.value.toLowerCase())
//       );
//       setFilteredProducts(filtered);
//     };
  
//     if (!open) return null;
  
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//         <div className="bg-white rounded-lg w-1/4 max-w-1/4">
//           <div className="flex items-center justify-between px-4 py-2 border-b">
//             <h2 className="text-2xl font-semibold">Select Product</h2>
//             <button className="text-red-600" onClick={handleClose}>
//               <CloseOutlinedIcon size="small" />
//             </button>
//           </div>
//           <div className="p-4">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={handleSearch}
//               placeholder="Search"
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
//             />
//             <div className="mt-4 bg-white border border-stone-200 rounded-lg max-h-48 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400">
//               {filteredProducts.length > 0 ? (
//                 filteredProducts.map((product) => (
//                   <div key={product._id} className="py-3 px-2 cursor-pointer hover:bg-gray-100" onClick={() => handleProductSelect(product)}>
//                     {product.itemname}
//                   </div>
//                 ))
//               ) : (
//                 <div className="py-3 px-2 text-gray-500">No products found</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };
  
//   export default SelectProduct;
  
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllProducts } from 'pages/utils/products/api';

const ProductListPopup = ({ open, onClose, onSelectProduct, itemList }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [duplicateProductError, setDuplicateProductError] = useState(''); // For error message

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token=localStorage.getItem('token');
        const allProduct = await fetchAllProducts(token);
        setProducts(allProduct);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (open) {
      fetchProducts();
      setDuplicateProductError(''); // Reset error when popup is opened
    }
  }, [open]);

  const filteredProducts = products.filter((product) =>
    product.itemname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (product) => {
    const productExists = itemList.some((item) => item._id === product._id);

    if (productExists) {
      setDuplicateProductError(`The product "${product.itemname}" is already added in the list.`);
      return;
    }

    onSelectProduct(product);
    setSearchTerm('');
    onClose();
  };

  const handleCloseErrorModal = () => {
    setDuplicateProductError('');
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg w-1/4 max-w-1/4 shadow-lg transform transition-all">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h1 className="text-2xl font-semibold my-2">Select a Product</h1>
            <button className="text-red-600 hover:text-red-700" onClick={onClose}>
              &times;
            </button>
          </div>

          <div className="p-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for an item..."
              className="bg-white border border-gray-300 text-gray-800 sm:text-sm rounded-md focus:ring-red-600 focus:border-red-600 focus:outline-none block w-full p-2.5"
            />

            <div className="mt-4 bg-white border border-stone-200 rounded-lg max-h-48 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <React.Fragment key={product._id}>
                    <div
                      className="py-3 px-2 cursor-pointer hover:bg-gray-100"
                      onMouseDown={() => handleProductSelect(product)}
                    >
                      {product.itemname}
                    </div>
                    <hr className="border-t" />
                  </React.Fragment>
                ))
              ) : (
                <div className="py-3 px-2 text-gray-500">No items found</div>
              )}
            </div>

            <div className="flex justify-center mt-4">
              <Link to="/apps/product/create">
                <button className="flex items-center px-4 py-2.5 bg-red-600 text-white font-semibold rounded hover:bg-red-700">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Product
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Duplicate Product Error Modal */}
      {duplicateProductError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-auto max-w-lg p-6 text-center">
            <h1 className="text-xl font-semibold text-black mb-4">Duplicate Product</h1>
            <h2 className="text-red-600 mb-6">{duplicateProductError}</h2>
            <button
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={handleCloseErrorModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductListPopup;
