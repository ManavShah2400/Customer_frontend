import React, { useState } from "react";
import { handleError, handleSuccess } from "./utils";

const DeleteCustomerModal = ({ show, onClose, onSuccess, customer }) => {
    const [loading, setLoading] = useState(false);
    if (!show) return null;

    const handleDelete = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Ttied to delete a customer");
        if (!customer._id) return handleError("Customer id not selected. Please try again");
        let result;
        try {
            //https://customer-backend-eq7y.onrender.com
            const response = await fetch(`https://customer-backend-eq7y.onrender.com/customer/delete/${customer._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            result = await response.json();
            const { message, success } = result;
            if (success) {
                handleSuccess(message);
                if (onSuccess) await onSuccess();
                onClose();
            } else {
                handleError(message)
            }

        } catch (err) {
            console.log(err);
            handleError(err);
        }
    }
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Delete Customer</h2>
                <button type="button" className="btn" onClick={onClose}>Cancel</button>
                <button type="button" className="del btn" onClick={handleDelete}>
                    {loading ? (
                        <span>
                            <span className="loader mr-2 inline-block"></span> Loading...
                        </span>
                    ) : (
                        "Delete"
                    )}
                </button>
            </div>
        </div>
    );
}

export default DeleteCustomerModal;