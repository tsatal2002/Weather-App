import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getCurrentWeather = async (city, unit = 'metric') => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: unit,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error('City not found');
        }
        throw new Error('Failed to fetch weather data');
    }
};
export const getCitySuggestions = async (query) => {
    try {
        const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search`, {
            params: {
                name: query,
                count: 10,
                language: 'en',
                format: 'json',
            },
        });
        return response.data.results || [];
    } catch (error) {
        console.error("Error fetching city suggestions:", error);
        return [];
    }
};

export const convertWeatherData = (data, toUnit) => {
    if (!data) return null;

    const isMetric = toUnit === 'metric';
    const newData = JSON.parse(JSON.stringify(data));

    if (isMetric) {
        newData.main.temp = (data.main.temp - 32) * 5 / 9;
        newData.main.feels_like = (data.main.feels_like - 32) * 5 / 9;
        newData.main.temp_min = (data.main.temp_min - 32) * 5 / 9;
        newData.main.temp_max = (data.main.temp_max - 32) * 5 / 9;
        newData.wind.speed = parseFloat((data.wind.speed / 2.237).toFixed(2));
    } else {
        newData.main.temp = (data.main.temp * 9 / 5) + 32;
        newData.main.feels_like = (data.main.feels_like * 9 / 5) + 32;
        newData.main.temp_min = (data.main.temp_min * 9 / 5) + 32;
        newData.main.temp_max = (data.main.temp_max * 9 / 5) + 32;
        newData.wind.speed = parseFloat((data.wind.speed * 2.237).toFixed(2));
    }

    return newData;
};
