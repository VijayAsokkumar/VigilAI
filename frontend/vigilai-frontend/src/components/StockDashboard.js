import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockDashboard = () => {
    const [stockData, setStockData] = useState(null);
    const [symbol, setSymbol] = useState('TCS');  // Default stock symbol
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Define the fetchStockData function inside useEffect
        const fetchStockData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:8000/stocks/api/stock/${symbol}/`);
                setStockData(response.data);
            } catch (error) {
                setError('Error fetching stock data');
            }
            setLoading(false);
        };

        // Call the fetch function
        fetchStockData();
    }, [symbol]);  // Include 'symbol' as a dependency

    return (
        <div>
            <h1>VigilAI Stock Dashboard</h1>

            {/* Input for the stock symbol */}
            <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="Enter Stock Symbol"
            />
            <button onClick={() => {}}>Fetch Stock Data</button>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            {/* Display stock data if available */}
            {stockData && (
                <div>
                    <h2>{stockData.symbol} - {stockData.date}</h2>
                    <p>Current Price: {stockData.current_price} INR</p>
                    <p>Open: {stockData.open} INR</p>
                    <p>Close: {stockData.close} INR</p>
                    <p>High: {stockData.high} INR</p>
                    <p>Low: {stockData.low} INR</p>
                    <p>Volume: {stockData.volume}</p>
                </div>
            )}
        </div>
    );
};

export default StockDashboard;
