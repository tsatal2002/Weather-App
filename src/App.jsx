import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import FavoritesList from './components/FavoritesList';
import UnitToggle from './components/UnitToggle';
import SkeletonCard from './components/SkeletonCard';
import { getCurrentWeather, convertWeatherData } from './services/weatherService';
import { WiCloudy, WiDaySunny, WiNightClear } from 'react-icons/wi';

function App() {
  const [weather, setWeather] = useState(null);
  const [view, setView] = useState('home');
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('weatherAppUnit') || 'metric';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('weatherAppUnit', unit);
  }, [unit]);

  const handleSearch = async (city) => {
    setLoading(true);
    setError('');
    try {
      const data = await getCurrentWeather(city, unit);
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);

    if (weather) {
      const convertedWeather = convertWeatherData(weather, newUnit);
      setWeather(convertedWeather);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleFavorite = () => {
    if (!weather) return;
    const city = weather.name;
    if (favorites.includes(city)) {
      setFavorites(favorites.filter(c => c !== city));
    } else {
      setFavorites([...favorites, city]);
    }
  };

  const isFavorite = weather ? favorites.includes(weather.name) : false;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <h1>Weather App <WiCloudy className="app-logo" /></h1>
        </div>
        <nav className="nav-tabs">
          <button
            className={`nav-btn ${view === 'home' ? 'active' : ''}`}
            onClick={() => setView('home')}
          >
            Home
          </button>
          <button
            className={`nav-btn ${view === 'favorites' ? 'active' : ''}`}
            onClick={() => setView('favorites')}
          >
            Favorites
          </button>



          <UnitToggle unit={unit} onToggle={handleToggleUnit} />

          <button
            className="nav-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', marginLeft: '0.5rem' }}
          >
            {theme === 'light' ? <WiNightClear /> : <WiDaySunny />}
          </button>
        </nav>
      </header>


      <main>
        {view === 'home' ? (
          <div className="home-view">


            <div className="search-section">
              <SearchBar onSearch={handleSearch} />
              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="main-weather">
              {loading ? (
                <SkeletonCard />
              ) : (
                <WeatherCard
                  weather={weather}
                  unit={unit}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="favorites-view">
            <FavoritesList
              favorites={favorites}
              unit={unit}
              onSelect={(city) => {
                handleSearch(city);
                setView('home');
              }}
              onRemove={(city) => setFavorites(favorites.filter(c => c !== city))}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
