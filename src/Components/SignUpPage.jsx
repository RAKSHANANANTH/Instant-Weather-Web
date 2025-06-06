// src/components/SignUpPage.jsx

import React, { useState } from 'react';
// We can reuse the LoginPage.css for consistent styling of form elements
// import './LoginPage.css'; // Ensure this is imported if you want shared styles

function SignUpPage({ onSignUpSuccess, onGoToLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (username.length < 3 || password.length < 6) {
            setError('Username must be at least 3 characters and password at least 6 characters.');
            return;
        }

        // Dummy signup logic:
        // In a real app, you would send this data to a backend for user registration.
        // For now, we'll just simulate success and show a message.
        console.log(`Attempting to sign up with: Username: ${username}, Password: ${password}`);
        setSuccessMessage('Account created successfully! You can now log in.');
        setUsername('');
        setPassword('');
        setConfirmPassword('');

        // Optionally, automatically go to login page after a delay
        setTimeout(() => {
            onSignUpSuccess(); // This will typically navigate to the login page
        }, 2000);
    };

    return (
        <div className="login-container"> {/* Reuse login-container styles */}
            <h2 className="login-title">Create Account</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="new-username">Username</label>
                    <input
                        type="text"
                        id="new-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Choose a username"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="new-password">Password</label>
                    <input
                        type="password"
                        id="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                    />
                </div>
                {error && <p className="login-error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>} {/* Add success message style in App.css */}
                <button type="submit" className="login-button">Sign Up</button>
            </form>
            <p className="signup-text">
                Already have an account? <a href="#" onClick={onGoToLogin} className="signup-link">Log In</a>
            </p>
        </div>
    );
}

export default SignUpPage;