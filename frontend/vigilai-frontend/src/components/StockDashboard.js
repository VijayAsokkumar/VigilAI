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
    // eslint-disable-next-line
    const [stockData, setStockData] = useState(null);
    const [companyNews, setCompanyNews] = useState([]);
    const [industryNews, setIndustryNews] = useState([]);
    const [stockPerformance, setStockPerformance] = useState([]);
    const [symbol, setSymbol] = useState('TCS');  // Default stock symbol
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState('6mo');  // Default time period

    // Pagination state for news
    const [companyNewsPage, setCompanyNewsPage] = useState(1);
    const [industryNewsPage, setIndustryNewsPage] = useState(1);
    const newsPerPage = 5;  // Display 5 news items per page

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

                // Fetch stock performance data based on the selected period
                const performanceResponse = await axios.get(`http://localhost:8000/stocks/api/performance/${symbol}/?period=${period}`);
                setStockPerformance(performanceResponse.data);
            } catch (error) {
                setError('Error fetching stock data');
            }
            setLoading(false);
        };

        fetchStockData();
    }, [symbol, period]);  // Refetch when symbol or period changes

    // Pagination handlers for company news
    const handleCompanyNewsNext = () => {
        if (companyNewsPage < Math.ceil(companyNews.length / newsPerPage)) {
            setCompanyNewsPage(companyNewsPage + 1);
        }
    };

    const handleCompanyNewsPrev = () => {
        if (companyNewsPage > 1) {
            setCompanyNewsPage(companyNewsPage - 1);
        }
    };

    // Pagination handlers for industry news
    const handleIndustryNewsNext = () => {
        if (industryNewsPage < Math.ceil(industryNews.length / newsPerPage)) {
            setIndustryNewsPage(industryNewsPage + 1);
        }
    };

    const handleIndustryNewsPrev = () => {
        if (industryNewsPage > 1) {
            setIndustryNewsPage(industryNewsPage - 1);
        }
    };

    // Data for the stock performance chart (using Chart.js)
    const performanceChartData = {
        labels: stockPerformance.map(data => data.date), // Assuming the data has `date`
        datasets: [
            {
                label: `${symbol} Stock Price (${period})`,
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
                text: `${symbol} Stock Performance (${period})`,
            },
        },
        scales: {
            x: {
                type: 'category',  // Use category scale for the x-axis
                title: {
                    display: true,
                    text: 'Date',  // Label for the x-axis
                },
            },
            y: {
                type: 'linear',  // Use linear scale for the y-axis (stock price)
                title: {
                    display: true,
                    text: 'Price (INR)',  // Label for the y-axis
                },
            },
        },
    };

    // Get paginated company and industry news
    const displayedCompanyNews = companyNews.slice((companyNewsPage - 1) * newsPerPage, companyNewsPage * newsPerPage);
    const displayedIndustryNews = industryNews.slice((industryNewsPage - 1) * newsPerPage, industryNewsPage * newsPerPage);

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

            {/* Stock Performance Period Selection */}
            <div style={{ margin: '20px 0' }}>
                <button onClick={() => setPeriod('1w')}>1 Week</button>
                <button onClick={() => setPeriod('1mo')}>1 Month</button>
                <button onClick={() => setPeriod('6mo')}>6 Months</button>
                <button onClick={() => setPeriod('1y')}>1 Year</button>
                <button onClick={() => setPeriod('2y')}>2 Years</button>
                <button onClick={() => setPeriod('5y')}>5 Years</button>
            </div>

            {/* Stock Performance Widget (dynamic chart based on period) */}
            <div>
                <h3>Stock Performance ({period})</h3>
                {stockPerformance.length > 0 ? (
                    <Line data={performanceChartData} options={options} />
                ) : (
                    <p>No performance data available for {symbol}.</p>
                )}
            </div>

            {/* Flexbox layout for news widgets */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginTop: '20px' }}>
                {/* Company News Widget with Pagination */}
                <div style={{ flex: 1 }}>
                    <h3>Company News</h3>
                    {displayedCompanyNews.length > 0 ? (
                        displayedCompanyNews.map((news, index) => (
                            <div key={index}>
                                <h4>{news.title}</h4>
                                <p>{news.description}</p>
                                <a href={news.url} target="_blank" rel="noopener noreferrer">Read more</a>
                            </div>
                        ))
                    ) : (
                        <p>No news available for {symbol}.</p>
                    )}
                    <div>
                        <button onClick={handleCompanyNewsPrev} disabled={companyNewsPage === 1}>Previous</button>
                        <button onClick={handleCompanyNewsNext} disabled={companyNewsPage === Math.ceil(companyNews.length / newsPerPage)}>Next</button>
                    </div>
                </div>

                {/* Industry News Widget with Pagination */}
                <div style={{ flex: 1 }}>
                    <h3>Industry News</h3>
                    {displayedIndustryNews.length > 0 ? (
                        displayedIndustryNews.map((news, index) => (
                            <div key={index}>
                                <h4>{news.title}</h4>
                                <p>{news.description}</p>
                                <a href={news.url} target="_blank" rel="noopener noreferrer">Read more</a>
                            </div>
                        ))
                    ) : (
                        <p>No industry news available for {symbol}'s industry.</p>
                    )}
                    <div>
                        <button onClick={handleIndustryNewsPrev} disabled={industryNewsPage === 1}>Previous</button>
                        <button onClick={handleIndustryNewsNext} disabled={industryNewsPage === Math.ceil(industryNews.length / newsPerPage)}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockDashboard;
