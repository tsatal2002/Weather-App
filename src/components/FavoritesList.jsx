import { useState, useEffect } from 'react';
import WeatherCard from './WeatherCard';
import SkeletonCard from './SkeletonCard';
import { getCurrentWeather, convertWeatherData } from '../services/weatherService';

function FavoritesList({ favorites, onSelect, onRemove, unit }) {
    const [favoritesData, setFavoritesData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const promises = favorites.map(city => getCurrentWeather(city, unit));
                const results = await Promise.all(promises);
                setFavoritesData(results);
            } catch (error) {
                console.error("Error fetching favorites:", error);
            } finally {
                setLoading(false);
            }
        };

        if (favorites.length > 0) {
            fetchFavorites();
        } else {
            setFavoritesData([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [favorites]);

    useEffect(() => {
        if (favoritesData.length > 0) {
            const converted = favoritesData.map(data => convertWeatherData(data, unit));
            setFavoritesData(converted);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unit]);

    if (favorites.length === 0) {
        return (
            <div className="empty-favorites">
                <p>No favorite cities added yet.</p>
            </div>
        );
    }

    if (loading && favoritesData.length === 0) {
        return (
            <div className="favorites-grid">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="favorite-card-wrapper">
                        <SkeletonCard />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="favorites-grid">
            {favoritesData.map((weather) => (
                <div key={weather.name} className="favorite-card-wrapper" onClick={() => onSelect(weather.name)}>
                    <WeatherCard
                        weather={weather}
                        unit={unit}
                        isFavorite={true}
                        onToggleFavorite={(e) => {
                            e.stopPropagation(); // Prevent triggering onSelect
                            onRemove(weather.name);
                        }}
                    />
                </div>
            ))}
        </div>
    );
}

export default FavoritesList;
