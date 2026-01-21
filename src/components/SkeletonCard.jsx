import '../index.css';

function SkeletonCard() {
    return (
        <div className="weather-card" style={{ height: '400px', display: 'flex', flexDirection: 'column', gap: '20px', padding: '3rem' }}>
            <div style={{ width: '60%', height: '40px', background: '#f0f0f0', borderRadius: '8px' }} className="pulse"></div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                <div style={{ width: '100px', height: '100px', background: '#f0f0f0', borderRadius: '50%' }} className="pulse"></div>
                <div style={{ width: '120px', height: '100px', background: '#f0f0f0', borderRadius: '12px' }} className="pulse"></div>
            </div>

            <div style={{ marginTop: 'auto', width: '100%', height: '2px', background: '#f0f0f0' }}></div>
            <div style={{ width: '100%', height: '60px', background: '#f0f0f0', borderRadius: '8px' }} className="pulse"></div>
        </div>
    );
}

export default SkeletonCard;
