function UnitToggle({ unit, onToggle }) {
    return (
        <div className="unit-toggle">
            <button
                className={`unit-btn ${unit === 'metric' ? 'active' : ''}`}
                onClick={() => unit !== 'metric' && onToggle()}
                aria-label="Switch to Celsius"
            >
                °C
            </button>
            <button
                className={`unit-btn ${unit === 'imperial' ? 'active' : ''}`}
                onClick={() => unit !== 'imperial' && onToggle()}
                aria-label="Switch to Fahrenheit"
            >
                °F
            </button>
        </div>
    );
}

export default UnitToggle;
