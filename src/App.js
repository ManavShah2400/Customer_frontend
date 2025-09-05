import './App.css';
import AddCustomerModal from './AddCustomer';
import DeleteCustomerModal from './DeleteCustomer';
import React, { useState, useEffect } from 'react';

function App() {
  const [showBox, setShowBox] = useState(false);
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [showEditBox, setShowEditBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const toogleBox = () => setShowBox(!showBox);
  const [search, setSearch] = useState('');

  const handleClose = () => {
    setShowBox(false);
    setShowEditBox(false);
    setShowDeleteBox(false);
    setSelectedCustomer(null);
  };
  const fetchCustomer = async () => {
    setLoading(true);
    try {
      //https://customer-backend-eq7y.onrender.com
      const response = await fetch(`https://customer-backend-eq7y.onrender.com/customer/customers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (response.ok) {
        setCustomer(result.data);
        console.log("Customer fetched:", result.data);
      } else {
        console.error("Error fetching customer:", result.message);
        setCustomer([]);
      }

    } catch (err) {
      console.error("Fetch error:", err);
      setCustomer([]);
    } finally {
      setLoading(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent form submission if inside a form
      handleSearch(search);    // call your search function
    }
  };

  const handleSearch = async (query) => {
    const response = await fetch(`https://customer-backend-eq7y.onrender.com/customer/search?query=${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const result = await response.json();
    if (result.success) {
      setCustomer(result.data); // update your table
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const handleRowClick = (customer, action) => {
    setSelectedCustomer(customer);
    if (action === 'delete') setShowDeleteBox(true);
    if (action === 'edit') setShowEditBox(true);
  }

  return (
    <div className="App">
      <div className='nav'>
        <h1>Customer Database</h1>
        <input
        className='search'
          type='text'
          placeholder='Search Customer'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onKeyDown={handleKeyDown} />
        <button className='add btn' type='button' onClick={toogleBox}>Add Customer</button>
      </div>
      {loading && <p>Loading...</p>}
      {customer.length === 0 && !loading && <p>No Customer found.</p>}
      <div className='table-cont'>
        {/* Table header */}
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>Driver's License</th>
              <th>Company's Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customer.map(item => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.phone_number}</td>
                <td>{item.address}</td>
                <td>{item.driver_license}</td>
                <td>{item.company_name}</td>
                <td>
                  <button
                    className='edit btn'
                    type='button'
                    onClick={() => handleRowClick(item, 'edit')}
                  >
                    Edit
                  </button>
                  <button
                    className='del btn'
                    type='button'
                    onClick={() => handleRowClick(item, 'delete')}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteCustomerModal
        show={showDeleteBox}
        onClose={handleClose}
        onSuccess={fetchCustomer}
        customer={selectedCustomer} />
      <AddCustomerModal
        show={showBox || showEditBox}
        onClose={handleClose}
        onSuccess={fetchCustomer}
        customer={selectedCustomer} />
    </div>
  );
}

export default App;
