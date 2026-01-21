import { useState, useEffect, useRef } from 'react';
import { getCitySuggestions } from '../services/weatherService';

function SearchBar({ onSearch }) {
    const [city, setCity] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        // Click outside to close suggestions
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            // Start searching after 1 character for instant-like feel
            if (city.trim().length > 1) {
                const results = await getCitySuggestions(city);
                setSuggestions(results);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        // Faster debounce (300ms) to feel more responsive while typing
        const timerId = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(timerId);
    }, [city]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            onSearch(city);
            setCity('');
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Helper to format display text (Open-Meteo uses admin1 for state)
    const formatSuggestion = (s) => {
        const parts = [s.name];
        if (s.admin1) parts.push(s.admin1);
        parts.push(s.country);
        return parts.join(', ');
    };

    // Filter duplicates and unrelated matches
    const uniqueSuggestions = suggestions
        .filter((v, i, a) =>
            // Must strictly start with the query (trimmed) to be relevant
            v.name.toLowerCase().startsWith(city.trim().toLowerCase()) &&
            // Filter duplicates (using admin1 as state)
            a.findIndex(t => (t.name === v.name && t.admin1 === v.admin1 && t.country === v.country)) === i
        )
        // Sort by length (shorter names first, likely better matches)
        .sort((a, b) => a.name.length - b.name.length);

    const handleSelectSuggestion = (suggestion) => {
        // Construct a clean search query for OpenWeatherMap (Name, Country Code)
        // Using country_code is safer for OWM than full country name
        const statePart = suggestion.admin1 ? `, ${suggestion.admin1}` : '';
        const cityName = `${suggestion.name}${statePart}, ${suggestion.country_code || suggestion.country}`;

        onSearch(cityName);
        setCity('');
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className="search-wrapper" ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            <form onSubmit={handleSubmit} className="search-bar">
                <input
                    type="text"
                    placeholder="Enter city name..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>
            {showSuggestions && uniqueSuggestions.length > 0 && (
                <ul className="suggestions-list">
                    {uniqueSuggestions.map((s, index) => (
                        <li key={`${s.name}-${index}`} onClick={() => handleSelectSuggestion(s)}>
                            {formatSuggestion(s)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;
