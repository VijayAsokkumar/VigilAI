# stocks/views.py
import yfinance as yf
from django.http import JsonResponse


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
