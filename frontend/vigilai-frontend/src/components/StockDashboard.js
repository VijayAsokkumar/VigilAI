import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

// Import and register Chart.js components
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const StockDashboard = () => {
    const [stockData, setStockData] = useState(null);
    const [companyNews, setCompanyNews] = useState([]);
    const [industryNews, setIndustryNews] = useState([]);
    const [stockPerformance, setStockPerformance] = useState([]);
    const [symbol, setSymbol] = useState('TCS');  // Default stock symbol
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStockData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch stock price data
                const stockResponse = await axios.get(`http://localhost:8000/stocks/api/stock/${symbol}/`);
                setStockData(stockResponse.data);

                // Fetch company-specific news
                const newsResponse = await axios.get(`http://localhost:8000/stocks/api/news/${symbol}/`);
                setCompanyNews(newsResponse.data);

                // Fetch industry-related news
                const industryResponse = await axios.get(`http://localhost:8000/stocks/api/industry-news/${symbol}/`);
                setIndustryNews(industryResponse.data);

                // Fetch 6-month stock performance data
                const performanceResponse = await axios.get(`http://localhost:8000/stocks/api/performance/${symbol}/`);
                setStockPerformance(performanceResponse.data);
            } catch (error) {
                setError('Error fetching stock data');
            }
            setLoading(false);
        };

        fetchStockData();
    }, [symbol]);

    // Data for the 6-month performance chart (using Chart.js)
    const performanceChartData = {
        labels: stockPerformance.map(data => data.date), // Assuming the data has `date`
        datasets: [
            {
                label: `${symbol} Stock Price (6 months)`,
                data: stockPerformance.map(data => data.price), // Assuming the data has `price`
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${symbol} Stock Performance Over 6 Months`,
            },
        },
        scales: {
            x: {
                type: 'category',  // Ensure 'category' scale is used for the x-axis
            },
            y: {
                type: 'linear',  // 'linear' scale for the y-axis
            },
        },
    };

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

            {/* Stock Price Widget */}
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

            {/* Company News Widget */}
            <div>
                <h3>Company News</h3>
                {companyNews.length > 0 ? (
                    companyNews.map((news, index) => (
                        <div key={index}>
                            <h4>{news.title}</h4>
                            <p>{news.description}</p>
                            <a href={news.url} target="_blank" rel="noopener noreferrer">Read more</a>
                        </div>
                    ))
                ) : (
                    <p>No news available for {symbol}.</p>
                )}
            </div>

            {/* Industry News Widget */}
            <div>
                <h3>Industry News</h3>
                {industryNews.length > 0 ? (
                    industryNews.map((news, index) => (
                        <div key={index}>
                            <h4>{news.title}</h4>
                            <p>{news.description}</p>
                            <a href={news.url} target="_blank" rel="noopener noreferrer">Read more</a>
                        </div>
                    ))
                ) : (
                    <p>No industry news available for {symbol}'s industry.</p>
                )}
            </div>

            {/* Stock Performance Widget (6-month chart) */}
            <div>
                <h3>6-Month Stock Performance</h3>
                {stockPerformance.length > 0 ? (
                    <Line data={performanceChartData} options={options} />
                ) : (
                    <p>No performance data available for {symbol}.</p>
                )}
            </div>
        </div>
    );
};

export default StockDashboard;
