# stocks/views.py
import yfinance as yf
from django.http import JsonResponse
import requests


api_key = 'fe8ec2836cce432eb0cd6655fd480427'  # Get a key from https://newsapi.org/

def get_stock_data(request, symbol):
    try:
        # Fetch data from Yahoo Finance for the NSE stock
        stock = yf.Ticker(f'{symbol}.NS')
        stock_info = stock.history(period="1d")

        if stock_info.empty:
            return JsonResponse({"error": "Stock data not found"}, status=404)

        # Get current stock price from `info`
        stock_metadata = stock.info
        current_price = stock_metadata.get('currentPrice', 'N/A')  # Use 'N/A' if not available

        # Convert data to native Python types to avoid serialization issues
        response_data = {
            "symbol": symbol,
            "current_price": current_price,  # Include the current stock price
            "open": float(stock_info['Open'].iloc[0]),
            "close": float(stock_info['Close'].iloc[0]),
            "high": float(stock_info['High'].iloc[0]),
            "low": float(stock_info['Low'].iloc[0]),
            "volume": int(stock_info['Volume'].iloc[0]),
            "date": stock_info.index[0].strftime('%Y-%m-%d')
        }

        return JsonResponse(response_data)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# Endpoint for company-specific news
def company_news(request, symbol):
    try:
        # Use an external news API like NewsAPI or a custom source
        url = f'https://newsapi.org/v2/everything?q={symbol}&apiKey={api_key}'

        response = requests.get(url)
        data = response.json()
        print(data)

        if data.get("status") != "ok":
            return JsonResponse({"error": "Error fetching news"}, status=500)

        return JsonResponse(data["articles"], safe=False)  # Return list of news articles
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# stocks/views.py

# Endpoint for industry-related news
def industry_news(request, symbol):
    try:
        # Define industry mapping (or fetch it from an API)
        industry = "Technology"  # Example, map symbol to industry manually or use an API

        url = f'https://newsapi.org/v2/everything?q={industry}&apiKey={api_key}'

        response = requests.get(url)
        data = response.json()

        if data.get("status") != "ok":
            return JsonResponse({"error": "Error fetching industry news"}, status=500)

        return JsonResponse(data["articles"], safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# Endpoint for 6-month stock performance
def stock_performance(request, symbol):
    try:
        stock = yf.Ticker(f'{symbol}.NS')  # Replace `.NS` with the appropriate suffix for NSE/BSE
        hist = stock.history(period='6mo')  # Fetch 6-month history

        # Convert the data to a format usable by the frontend
        performance_data = [
            {"date": str(date), "price": row['Close']}
            for date, row in hist.iterrows()
        ]

        return JsonResponse(performance_data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)