import React, { useState, useEffect } from "react";
import './AddCustomer.css';
import { handleError, handleSuccess } from "./utils";

const AddCustomerModal = ({ show, onClose, onSuccess, customer }) => {
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setphoneNumber] = useState('');
    const [address, setaddress] = useState('');
    const [licenseNumber, setlicenseNumber] = useState('');
    const [companyName, setcompanyName] = useState('');
    const [bankName, setBankName] = useState('');
    const isEditing = !!customer;

    useEffect(() => {
        if (customer) {
            setFullName(customer.name || '');
            setphoneNumber(customer.phone_number || '');
            setaddress(customer.address || '');
            setlicenseNumber(customer.driver_license || '');
            setcompanyName(customer.company_name || '');
            setBankName(customer.bank_name || '');
        } else {
            clearFields()
        }
    }, [customer, show]);

    const clearFields = () => {
        setFullName('');
        setphoneNumber('');
        setaddress('');
        setlicenseNumber('');
        setcompanyName('');
        setBankName('');
    }

    if (!show) return null;

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        console.log("tried to add new customer");
        if (!fullName || !phoneNumber || !licenseNumber || !companyName) {
            console.log("0");
            return handleError("All fields are required")
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            setLoading(false);
            return handleError("Phone number must be exactly 10 digits");
        }
        if (!/^[A-Za-z0-9]{6,12}$/.test(licenseNumber)) {
            setLoading(false);
            return handleError("License number must be 6–12 alphanumeric characters");
        }
        let result;
        try {
            console.log(1);
            //https://customer-backend-eq7y.onrender.com
            //http://localhost:8080
            const url = isEditing ? `https://customer-backend-eq7y.onrender.com/customer/update/${customer._id}`
                : `https://customer-backend-eq7y.onrender.com/customer/add`;

            const response = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: fullName,
                    phone_number: phoneNumber,
                    address: address,
                    driver_license: licenseNumber,
                    company_name: companyName,
                    bank_name: bankName
                })
            });
            console.log(2);
            result = await response.json();
            const { message, success } = result;
            if (success) {
                console.log(3);
                handleSuccess(message);
                if (onSuccess) await onSuccess();
                clearFields();
                onClose();
            } else {
                console.log(5);
                handleError(message);
            }
        } catch (err) {
            handleError(err);
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="modal-overlay">
            <div className="modal">
                <button onClick={onClose} type="button" className="close-btn">X</button>
                <h2>{isEditing ? "Edit Customer" : "Add New Customer"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            required
                            placeholder="Enter Name"
                            value={fullName}
                            pattern="[A-Za-z ]{2,50}"
                            onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            required
                            type="tel"
                            placeholder="Enter Number"
                            value={phoneNumber}
                            pattern="\d{10}"
                            maxLength={10}
                            onChange={(e) => setphoneNumber(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            required
                            type="text"
                            placeholder="Enter Address"
                            value={address}
                            maxLength={100}
                            onChange={(e) => setaddress(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Driver's License</label>
                        <input
                            required
                            type="text"
                            placeholder="Enter License Number"
                            value={licenseNumber}
                            maxLength={12}
                            pattern="[A-Za-z0-9]{6,13}"
                            onChange={(e) => setlicenseNumber(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Company's Name</label>
                        <input
                            required
                            type="text"
                            placeholder="Enter Company's Name"
                            value={companyName}
                            pattern="[A-Za-z ]{2,50}"
                            onChange={(e) => setcompanyName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Bank's Name</label>
                        <input
                            required
                            type="text"
                            placeholder="Enter Company's Name"
                            value={bankName}
                            pattern="[A-Za-z ]{2,50}"
                            onChange={(e) => setBankName(e.target.value)} />
                    </div>
                    <button type="Submit" className="AddItemBtn">
                        {loading ? (
                            <span>
                                <span className="loader mr-2 inline-block"></span> Loading...
                            </span>
                        ) : (
                            isEditing ? "Edit Customer" : "Add Customer"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddCustomerModal;