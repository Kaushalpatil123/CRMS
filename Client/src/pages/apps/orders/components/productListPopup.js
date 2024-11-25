import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllProducts } from 'pages/utils/products/api';

const ProductListPopup = ({ open, onClose, onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(true); // Keep dropdown open to show products immediately

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token')
        const allProduct = await fetchAllProducts(token);
        setProducts(allProduct);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (open) {
      fetchProducts();
    }
  }, [open]);

  const filteredProducts = products.filter((product) =>
    product.itemname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-[5000]">
      <div className="bg-white rounded-lg w-1/4 max-w-1/4">
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
                    onMouseDown={() => {
                      onSelectProduct(product);
                      setSearchTerm('');
                    }}
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
  );
};

export default ProductListPopup;
