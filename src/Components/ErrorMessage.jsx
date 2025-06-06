// src/components/ErrorMessage.jsx

import React from 'react';
import './ErrorMessage.css'; // We'll add this CSS below

function ErrorMessage({ message }) {
    if (!message) {
        return null;
    }
    return (
        <div className="error-message">
            <p>{message}</p>
        </div>
    );
}

export default ErrorMessage;