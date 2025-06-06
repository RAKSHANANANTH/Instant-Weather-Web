// src/components/LoginPage.jsx

import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage({ onLoginSuccess, onGoToSignUp }) { // Added onGoToSignUp prop
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (username === 'user' && password === 'password') {
            onLoginSuccess();
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Welcome Back</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                {error && <p className="login-error-message">{error}</p>}
                <button type="submit" className="login-button">Log In</button>
            </form>
            <p className="signup-text">
                Don't have an account? <a href="#" onClick={onGoToSignUp} className="signup-link">Sign Up</a> {/* Added onClick */}
            </p>
        </div>
    );
}

export default LoginPage;