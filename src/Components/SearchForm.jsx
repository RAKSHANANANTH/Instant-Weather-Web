// src/components/SearchForm.jsx

import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

function SearchForm({ onSearch, onUseCurrentLocation, isLoading }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="search-form-container">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter City, Zip Code, or Landmark"
                    className="search-input"
                    disabled={isLoading}
                />
                <button type="submit" className="search-icon-button" disabled={isLoading}>
                    <FaSearch />
                </button>
            </div>
            <button
                type="button"
                onClick={onUseCurrentLocation}
                className="current-location-button"
                disabled={isLoading}
            >
                <FaMapMarkerAlt />
                {isLoading ? 'Getting Location...' : 'Get Weather for Current Location'}
            </button>
        </form>
    );
}

export default SearchForm;