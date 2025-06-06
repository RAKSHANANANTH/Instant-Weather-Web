// src/App.jsx

import React, { useState, useEffect } from 'react';
import WeatherDisplay from './components/WeatherDisplay.jsx';
import ForecastDisplay from './components/ForecastDisplay.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import SearchForm from './components/SearchForm.jsx';
import LoginPage from './components/LoginPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import { getCurrentWeather, getFiveDayForecast, getCurrentWeatherByCoords, getFiveDayForecastByCoords } from './utils/weatherApi.js';
import './App.css';

function App() {
    // State for authentication and view management
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Set to true to bypass login for testing
    const [showSignUp, setShowSignUp] = useState(false); // Controls between LoginPage and SignUpPage

    // States for weather data and UI feedback
    const [location, setLocation] = useState('');
    const [currentWeather, setCurrentWeather] = useState(null);
    const [fiveDayForecast, setFiveDayForecast] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false); // New state to manage initial message

    // Function called when login is successful (from LoginPage)
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setShowSignUp(false); // Ensure signup view is off after login
    };

    // Functions to navigate between login and signup views
    const handleGoToSignUp = () => {
        setShowSignUp(true);
        setError(null); // Clear any errors when switching views
    };

    const handleGoToLogin = () => {
        setShowSignUp(false);
        setError(null); // Clear any errors when switching views
    };

    // Function called when signup is successful (from SignUpPage)
    const handleSignUpSuccess = () => {
        // In a real app, you might show a success message here,
        // then navigate to the login page.
        alert('Account created successfully! Please log in with your new credentials.');
        handleGoToLogin(); // Go back to login page
    };

    // Function to fetch weather data (by query like city name, zip, or lat,lon)
    const fetchWeather = async (query) => {
        setIsLoading(true);
        setError(null); // Clear previous errors
        setHasSearched(true); // Indicate that a search attempt has been made
        try {
            const weatherData = await getCurrentWeather(query);
            setCurrentWeather(weatherData);

            const forecastData = await getFiveDayForecast(query);
            setFiveDayForecast(forecastData);

        } catch (err) {
            setError(err.message);
            setCurrentWeather(null); // Clear weather data on error
            setFiveDayForecast([]); // Clear forecast data on error
        } finally {
            setIsLoading(false);
        }
    };

    // Handler for search form submission
    const handleSearchSubmit = (searchQuery) => {
        if (searchQuery.trim()) {
            setLocation(searchQuery.trim()); // Update location state with actual query
            fetchWeather(searchQuery.trim());
        } else {
            setError("Please enter a location.");
            setHasSearched(true); // Still mark as searched for empty query
        }
    };

    // Handler for "Use Current Location" button
    const handleCurrentLocationWeather = () => {
        setIsLoading(true);
        setError(null);
        setHasSearched(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        // Fetch current weather by coordinates
                        const weatherData = await getCurrentWeatherByCoords(latitude, longitude);
                        setCurrentWeather(weatherData);
                        // Fetch forecast by coordinates
                        const forecastData = await getFiveDayForecastByCoords(latitude, longitude);
                        setFiveDayForecast(forecastData);
                        // Update input with truncated coords for clarity, or can set to "Current Location"
                        setLocation(`${latitude.toFixed(2)},${longitude.toFixed(2)}`);
                    } catch (err) {
                        setError(err.message);
                        setCurrentWeather(null);
                        setFiveDayForecast([]);
                    } finally {
                        setIsLoading(false);
                    }
                },
                (err) => {
                    setError(`Geolocation error: ${err.message}. Please enable location services.`);
                    setIsLoading(false);
                    setCurrentWeather(null); // Clear weather data on error
                    setFiveDayForecast([]); // Clear forecast data on error
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setIsLoading(false);
            setCurrentWeather(null); // Clear weather data on error
            setFiveDayForecast([]); // Clear forecast data on error
        }
    };

    // Logout function: Resets all states to revert to pre-login view
    const handleLogout = () => {
        setIsLoggedIn(false);
        setHasSearched(false); // Reset app state on logout
        setCurrentWeather(null);
        setFiveDayForecast([]);
        setLocation('');
        setError(null);
    };

    return (
        <div className="App">
            {/* Conditional rendering based on login status and signup view */}
            {!isLoggedIn ? (
                // IF NOT LOGGED IN, SHOW EITHER SIGNUP OR LOGIN PAGE
                showSignUp ? (
                    <SignUpPage onSignUpSuccess={handleSignUpSuccess} onGoToLogin={handleGoToLogin} />
                ) : (
                    // Pass onGoToSignUp to LoginPage so it can switch views
                    <LoginPage onLoginSuccess={handleLoginSuccess} onGoToSignUp={handleGoToSignUp} />
                )
            ) : (
                // IF LOGGED IN, SHOW WEATHER APP CONTENT
                <>
                    {/* Logout button at the very bottom of the weather app content */}
                    {/* Position: absolute and right corner is handled by CSS in App.css */}
                    <h1 className="app-title">Instant Weather</h1>

                    <SearchForm
                        onSearch={handleSearchSubmit}
                        onUseCurrentLocation={handleCurrentLocationWeather}
                        isLoading={isLoading}
                    />

                    {error && <ErrorMessage message={error} />}

                    {isLoading && !error && (
                        <div className="loading-message">
                            Loading weather data...
                        </div>
                    )}

                    {!hasSearched && !isLoading && !error && (
                        <div className="initial-message">
                            Enter a location or use your current location to get weather updates.
                        </div>
                    )}

                    {currentWeather && !isLoading && !error && <WeatherDisplay weather={currentWeather} />}

                    {fiveDayForecast.length > 0 && !isLoading && !error && <ForecastDisplay forecast={fiveDayForecast} />}

                    {/* NEW POSITION: Log out button at the very bottom of the weather app content */}
                    <button onClick={handleLogout} className="logout-button-bottom">Log Out</button>
                </>
            )}
        </div>
    );
}

export default App;