import React from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi';
import { BsBookmarkFill, BsBookmark } from 'react-icons/bs';

function WeatherCard({ weather, onToggleFavorite, isFavorite, unit }) {
    if (!weather) return null;

    const { name, main, weather: weatherDetails, wind } = weather;
    const temp = Math.round(main.temp);
    const description = weatherDetails[0].description;
    const humidity = main.humidity;
    const windSpeed = wind.speed;

    const getWeatherIcon = (code) => {
        if (code >= 200 && code < 300) return <WiThunderstorm size={80} />;
        if (code >= 300 && code < 600) return <WiRain size={80} />;
        if (code >= 600 && code < 700) return <WiSnow size={80} />;
        if (code >= 700 && code < 800) return <WiFog size={80} />;
        if (code === 800) return <WiDaySunny size={80} />;
        return <WiCloudy size={80} />;
    };

    return (
        <div className="weather-card">
            <div className="card-header">
                <h2 style={{ fontSize: '2.5rem', letterSpacing: '-1px', fontWeight: '600' }}>
                    {name}
                </h2>
                <button
                    onClick={onToggleFavorite}
                    className="favorite-btn"
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: isFavorite ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}
                >
                    {isFavorite ? <BsBookmarkFill size={22} /> : <BsBookmark size={22} />}
                </button>
            </div>

            <div className="weather-main">
                {getWeatherIcon(weatherDetails[0].id)}

                <div className="temp-container">
                    <span className="temperature">{temp}°</span>
                </div>
            </div>

            <p className="description">{description}</p>

            <div className="details">
                <div className="detail-item">
                    <span>Humidity</span>
                    <span>{humidity}%</span>
                </div>
                <div className="detail-item">
                    <span>Wind</span>
                    <span>{windSpeed} {unit === 'imperial' ? 'mph' : 'm/s'}</span>
                </div>
            </div>
        </div>
    );
}

export default WeatherCard;
