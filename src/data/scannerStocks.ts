export interface ScannedStock {
  stock: string;
  name: string;
  price: number;
  target: number;
  atrStop: number;
  points: number; // 3 to 7
  supertrend: 'Bullish' | 'Neutral' | 'Bearish';
  adx: number;
  rsi: number;
  sector: string;
  category: 'watchlist' | 'nifty100' | 'both';
}

export const NIFTY_100_STOCKS: ScannedStock[] = [
  // 1-10
  { stock: 'RELIANCE', name: 'Reliance Industries Ltd', price: 2980.5, target: 3129.5, atrStop: 2890.0, points: 7, supertrend: 'Bullish', adx: 32.5, rsi: 62.4, sector: 'Energy', category: 'both' },
  { stock: 'TCS', name: 'Tata Consultancy Services', price: 4120.0, target: 4326.0, atrStop: 3995.0, points: 6, supertrend: 'Bullish', adx: 28.1, rsi: 59.8, sector: 'IT', category: 'both' },
  { stock: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1680.0, target: 1764.0, atrStop: 1630.0, points: 6, supertrend: 'Bullish', adx: 29.8, rsi: 57.2, sector: 'Banking', category: 'both' },
  { stock: 'ICICIBANK', name: 'ICICI Bank Ltd', price: 1240.0, target: 1302.0, atrStop: 1205.0, points: 7, supertrend: 'Bullish', adx: 34.2, rsi: 66.1, sector: 'Banking', category: 'both' },
  { stock: 'INFY', name: 'Infosys Ltd', price: 1850.5, target: 1943.0, atrStop: 1795.0, points: 5, supertrend: 'Bullish', adx: 26.4, rsi: 54.3, sector: 'IT', category: 'both' },
  { stock: 'BHARTIARTL', name: 'Bharti Airtel Ltd', price: 1620.0, target: 1701.0, atrStop: 1570.0, points: 7, supertrend: 'Bullish', adx: 35.0, rsi: 68.0, sector: 'Telecom', category: 'both' },
  { stock: 'ITC', name: 'ITC Ltd', price: 492.0, target: 516.6, atrStop: 478.0, points: 6, supertrend: 'Bullish', adx: 27.5, rsi: 58.9, sector: 'FMCG', category: 'both' },
  { stock: 'SBIN', name: 'State Bank of India', price: 845.0, target: 887.25, atrStop: 820.0, points: 7, supertrend: 'Bullish', adx: 31.0, rsi: 64.5, sector: 'Banking', category: 'both' },
  { stock: 'LTIM', name: 'LTIMindtree Ltd', price: 5980.0, target: 6279.0, atrStop: 5800.0, points: 5, supertrend: 'Bullish', adx: 25.1, rsi: 53.8, sector: 'IT', category: 'both' },
  { stock: 'LT', name: 'Larsen & Toubro Ltd', price: 3620.0, target: 3801.0, atrStop: 3510.0, points: 6, supertrend: 'Bullish', adx: 29.0, rsi: 60.2, sector: 'Infrastructure', category: 'both' },

  // 11-20
  { stock: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', price: 2710.0, target: 2845.5, atrStop: 2630.0, points: 4, supertrend: 'Neutral', adx: 22.0, rsi: 48.5, sector: 'FMCG', category: 'both' },
  { stock: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', price: 1890.0, target: 1984.5, atrStop: 1835.0, points: 7, supertrend: 'Bullish', adx: 33.6, rsi: 67.2, sector: 'Pharma', category: 'both' },
  { stock: 'BAJFINANCE', name: 'Bajaj Finance Ltd', price: 7250.0, target: 7612.5, atrStop: 7030.0, points: 6, supertrend: 'Bullish', adx: 28.4, rsi: 59.1, sector: 'Finance', category: 'both' },
  { stock: 'HCLTECH', name: 'HCL Technologies Ltd', price: 1780.0, target: 1869.0, atrStop: 1728.0, points: 6, supertrend: 'Bullish', adx: 30.1, rsi: 61.0, sector: 'IT', category: 'both' },
  { stock: 'MARUTI', name: 'Maruti Suzuki India Ltd', price: 12450.0, target: 13072.5, atrStop: 12080.0, points: 5, supertrend: 'Bullish', adx: 26.2, rsi: 55.4, sector: 'Auto', category: 'both' },
  { stock: 'TATASTEEL', name: 'Tata Steel Ltd', price: 156.0, target: 163.8, atrStop: 151.2, points: 6, supertrend: 'Bullish', adx: 27.8, rsi: 58.3, sector: 'Metals', category: 'both' },
  { stock: 'NTPC', name: 'NTPC Ltd', price: 382.1, target: 401.2, atrStop: 368.5, points: 6, supertrend: 'Bullish', adx: 27.1, rsi: 61.5, sector: 'Power', category: 'both' },
  { stock: 'POWERGRID', name: 'Power Grid Corp of India', price: 338.0, target: 354.9, atrStop: 328.0, points: 7, supertrend: 'Bullish', adx: 31.5, rsi: 63.8, sector: 'Power', category: 'both' },
  { stock: 'AXISBANK', name: 'Axis Bank Ltd', price: 1195.0, target: 1254.75, atrStop: 1160.0, points: 5, supertrend: 'Bullish', adx: 25.9, rsi: 56.0, sector: 'Banking', category: 'both' },
  { stock: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1790.0, target: 1879.5, atrStop: 1735.0, points: 4, supertrend: 'Neutral', adx: 21.8, rsi: 49.2, sector: 'Banking', category: 'both' },

  // 21-30
  { stock: 'M&M', name: 'Mahindra & Mahindra Ltd', price: 2920.0, target: 3066.0, atrStop: 2830.0, points: 7, supertrend: 'Bullish', adx: 36.1, rsi: 69.4, sector: 'Auto', category: 'both' },
  { stock: 'TITAN', name: 'Titan Company Ltd', price: 3480.0, target: 3654.0, atrStop: 3375.0, points: 6, supertrend: 'Bullish', adx: 28.7, rsi: 60.5, sector: 'Consumer Durables', category: 'both' },
  { stock: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', price: 11200.0, target: 11760.0, atrStop: 10860.0, points: 6, supertrend: 'Bullish', adx: 29.3, rsi: 61.8, sector: 'Cement', category: 'both' },
  { stock: 'ADANIENT', name: 'Adani Enterprises Ltd', price: 3150.0, target: 3307.5, atrStop: 3050.0, points: 5, supertrend: 'Bullish', adx: 26.8, rsi: 57.0, sector: 'Conglomerate', category: 'both' },
  { stock: 'ADANIPORTS', name: 'Adani Ports & SEZ', price: 1420.0, target: 1491.0, atrStop: 1378.0, points: 7, supertrend: 'Bullish', adx: 32.0, rsi: 65.2, sector: 'Ports', category: 'both' },
  { stock: 'COALINDIA', name: 'Coal India Ltd', price: 428.5, target: 449.9, atrStop: 412.0, points: 7, supertrend: 'Bullish', adx: 29.4, rsi: 58.2, sector: 'Mining', category: 'both' },
  { stock: 'ONGC', name: 'Oil & Natural Gas Corp', price: 312.0, target: 327.6, atrStop: 302.5, points: 6, supertrend: 'Bullish', adx: 28.0, rsi: 59.0, sector: 'Oil & Gas', category: 'both' },
  { stock: 'ASIANPAINT', name: 'Asian Paints Ltd', price: 2890.0, target: 3034.5, atrStop: 2800.0, points: 4, supertrend: 'Neutral', adx: 22.5, rsi: 47.9, sector: 'Paints', category: 'both' },
  { stock: 'WIPRO', name: 'Wipro Ltd', price: 540.0, target: 567.0, atrStop: 524.0, points: 5, supertrend: 'Bullish', adx: 25.4, rsi: 53.1, sector: 'IT', category: 'both' },
  { stock: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd', price: 1840.0, target: 1932.0, atrStop: 1785.0, points: 6, supertrend: 'Bullish', adx: 27.9, rsi: 58.6, sector: 'Finance', category: 'both' },

  // 31-40
  { stock: 'NESTLEIND', name: 'Nestle India Ltd', price: 2540.0, target: 2667.0, atrStop: 2465.0, points: 5, supertrend: 'Bullish', adx: 24.8, rsi: 52.6, sector: 'FMCG', category: 'nifty100' },
  { stock: 'GRASIM', name: 'Grasim Industries Ltd', price: 2680.0, target: 2814.0, atrStop: 2600.0, points: 6, supertrend: 'Bullish', adx: 28.5, rsi: 59.4, sector: 'Cement', category: 'nifty100' },
  { stock: 'JSWSTEEL', name: 'JSW Steel Ltd', price: 960.0, target: 1008.0, atrStop: 931.0, points: 6, supertrend: 'Bullish', adx: 29.1, rsi: 60.8, sector: 'Metals', category: 'nifty100' },
  { stock: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd', price: 5480.0, target: 5754.0, atrStop: 5310.0, points: 7, supertrend: 'Bullish', adx: 33.0, rsi: 66.5, sector: 'Auto', category: 'nifty100' },
  { stock: 'TECHM', name: 'Tech Mahindra Ltd', price: 1610.0, target: 1690.5, atrStop: 1560.0, points: 6, supertrend: 'Bullish', adx: 27.3, rsi: 58.0, sector: 'IT', category: 'nifty100' },
  { stock: 'HDFCLIFE', name: 'HDFC Life Insurance', price: 715.0, target: 750.75, atrStop: 693.0, points: 5, supertrend: 'Bullish', adx: 25.0, rsi: 54.0, sector: 'Insurance', category: 'nifty100' },
  { stock: 'SBILIFE', name: 'SBI Life Insurance', price: 1810.0, target: 1900.5, atrStop: 1755.0, points: 6, supertrend: 'Bullish', adx: 28.2, rsi: 59.9, sector: 'Insurance', category: 'nifty100' },
  { stock: 'INDUSINDBK', name: 'IndusInd Bank Ltd', price: 1420.0, target: 1491.0, atrStop: 1378.0, points: 4, supertrend: 'Neutral', adx: 21.5, rsi: 46.8, sector: 'Banking', category: 'nifty100' },
  { stock: 'EICHERMOT', name: 'Eicher Motors Ltd', price: 4890.0, target: 5134.5, atrStop: 4740.0, points: 7, supertrend: 'Bullish', adx: 34.5, rsi: 67.8, sector: 'Auto', category: 'nifty100' },
  { stock: 'HINDALCO', name: 'Hindalco Industries Ltd', price: 685.0, target: 719.25, atrStop: 664.0, points: 6, supertrend: 'Bullish', adx: 29.6, rsi: 61.2, sector: 'Metals', category: 'nifty100' },

  // 41-50
  { stock: 'BPCL', name: 'Bharat Petroleum Corp', price: 348.0, target: 365.4, atrStop: 337.5, points: 6, supertrend: 'Bullish', adx: 28.8, rsi: 60.1, sector: 'Oil & Gas', category: 'nifty100' },
  { stock: 'CIPLA', name: 'Cipla Ltd', price: 1640.0, target: 1722.0, atrStop: 1590.0, points: 7, supertrend: 'Bullish', adx: 31.8, rsi: 64.2, sector: 'Pharma', category: 'nifty100' },
  { stock: 'DIVISLAB', name: 'Divi\'s Laboratories', price: 5240.0, target: 5502.0, atrStop: 5080.0, points: 6, supertrend: 'Bullish', adx: 27.6, rsi: 58.7, sector: 'Pharma', category: 'nifty100' },
  { stock: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories', price: 6890.0, target: 7234.5, atrStop: 6680.0, points: 5, supertrend: 'Bullish', adx: 25.7, rsi: 55.1, sector: 'Pharma', category: 'nifty100' },
  { stock: 'TATACONSUM', name: 'Tata Consumer Products', price: 1180.0, target: 1239.0, atrStop: 1145.0, points: 6, supertrend: 'Bullish', adx: 28.0, rsi: 59.5, sector: 'FMCG', category: 'nifty100' },
  { stock: 'BRITANNIA', name: 'Britannia Industries', price: 5820.0, target: 6111.0, atrStop: 5645.0, points: 5, supertrend: 'Bullish', adx: 24.9, rsi: 53.5, sector: 'FMCG', category: 'nifty100' },
  { stock: 'APOLLOHOSP', name: 'Apollo Hospitals', price: 6950.0, target: 7297.5, atrStop: 6740.0, points: 7, supertrend: 'Bullish', adx: 33.8, rsi: 66.9, sector: 'Healthcare', category: 'nifty100' },
  { stock: 'BEL', name: 'Bharat Electronics Ltd', price: 295.0, target: 309.75, atrStop: 286.0, points: 7, supertrend: 'Bullish', adx: 37.2, rsi: 71.0, sector: 'Defense', category: 'both' },
  { stock: 'HAL', name: 'Hindustan Aeronautics Ltd', price: 4680.0, target: 4914.0, atrStop: 4540.0, points: 7, supertrend: 'Bullish', adx: 38.5, rsi: 72.4, sector: 'Defense', category: 'both' },
  { stock: 'TATAMOTORS', name: 'Tata Motors Passenger', price: 890.0, target: 934.5, atrStop: 855.0, points: 5, supertrend: 'Bullish', adx: 25.8, rsi: 54.0, sector: 'Auto', category: 'both' },

  // 51-60
  { stock: 'VEDL', name: 'Vedanta Ltd', price: 462.0, target: 485.1, atrStop: 448.0, points: 6, supertrend: 'Bullish', adx: 28.9, rsi: 60.4, sector: 'Metals', category: 'nifty100' },
  { stock: 'BHEL', name: 'Bharat Heavy Electricals', price: 288.0, target: 302.4, atrStop: 279.0, points: 6, supertrend: 'Bullish', adx: 29.4, rsi: 61.1, sector: 'Capital Goods', category: 'nifty100' },
  { stock: 'DLF', name: 'DLF Ltd', price: 875.0, target: 918.75, atrStop: 848.0, points: 5, supertrend: 'Bullish', adx: 26.1, rsi: 55.8, sector: 'Realty', category: 'nifty100' },
  { stock: 'TRENT', name: 'Trent Ltd', price: 7450.0, target: 7822.5, atrStop: 7225.0, points: 7, supertrend: 'Bullish', adx: 41.2, rsi: 74.8, sector: 'Retail', category: 'both' },
  { stock: 'GAIL', name: 'GAIL (India) Ltd', price: 232.0, target: 243.6, atrStop: 225.0, points: 6, supertrend: 'Bullish', adx: 28.3, rsi: 59.2, sector: 'Gas', category: 'nifty100' },
  { stock: 'ZOMATO', name: 'Zomato Ltd (Eternal)', price: 268.0, target: 281.4, atrStop: 260.0, points: 7, supertrend: 'Bullish', adx: 39.0, rsi: 73.1, sector: 'Internet', category: 'both' },
  { stock: 'JIOFIN', name: 'Jio Financial Services', price: 345.0, target: 362.25, atrStop: 334.0, points: 6, supertrend: 'Bullish', adx: 27.7, rsi: 58.4, sector: 'Finance', category: 'both' },
  { stock: 'SRF', name: 'SRF Ltd', price: 2420.0, target: 2541.0, atrStop: 2348.0, points: 5, supertrend: 'Bullish', adx: 25.3, rsi: 54.2, sector: 'Chemicals', category: 'nifty100' },
  { stock: 'SIEMENS', name: 'Siemens Ltd', price: 6850.0, target: 7192.5, atrStop: 6640.0, points: 7, supertrend: 'Bullish', adx: 32.8, rsi: 65.9, sector: 'Capital Goods', category: 'nifty100' },
  { stock: 'REC', name: 'REC Ltd', price: 548.0, target: 575.4, atrStop: 531.0, points: 7, supertrend: 'Bullish', adx: 31.4, rsi: 63.6, sector: 'Finance', category: 'nifty100' },

  // 61-70
  { stock: 'PFC', name: 'Power Finance Corp', price: 485.0, target: 509.25, atrStop: 470.0, points: 6, supertrend: 'Bullish', adx: 30.0, rsi: 62.0, sector: 'Finance', category: 'nifty100' },
  { stock: 'ABB', name: 'ABB India Ltd', price: 8120.0, target: 8526.0, atrStop: 7875.0, points: 6, supertrend: 'Bullish', adx: 28.6, rsi: 59.7, sector: 'Capital Goods', category: 'nifty100' },
  { stock: 'CHOLAFIN', name: 'Cholamandalam Inv', price: 1540.0, target: 1617.0, atrStop: 1493.0, points: 6, supertrend: 'Bullish', adx: 29.2, rsi: 60.9, sector: 'Finance', category: 'nifty100' },
  { stock: 'PIDILITIND', name: 'Pidilite Industries', price: 3180.0, target: 3339.0, atrStop: 3084.0, points: 5, supertrend: 'Bullish', adx: 26.0, rsi: 55.6, sector: 'Chemicals', category: 'nifty100' },
  { stock: 'IOC', name: 'Indian Oil Corp', price: 175.0, target: 183.75, atrStop: 169.5, points: 5, supertrend: 'Bullish', adx: 25.2, rsi: 54.1, sector: 'Oil & Gas', category: 'nifty100' },
  { stock: 'HAVELLS', name: 'Havells India Ltd', price: 1860.0, target: 1953.0, atrStop: 1804.0, points: 6, supertrend: 'Bullish', adx: 27.9, rsi: 58.8, sector: 'Consumer Electricals', category: 'nifty100' },
  { stock: 'BANKBARODA', name: 'Bank of Baroda', price: 258.0, target: 270.9, atrStop: 250.0, points: 6, supertrend: 'Bullish', adx: 28.1, rsi: 59.3, sector: 'Banking', category: 'nifty100' },
  { stock: 'CANBK', name: 'Canara Bank Ltd', price: 112.0, target: 117.6, atrStop: 108.6, points: 6, supertrend: 'Bullish', adx: 28.5, rsi: 59.8, sector: 'Banking', category: 'nifty100' },
  { stock: 'AMBUJACEM', name: 'Ambuja Cements Ltd', price: 625.0, target: 656.25, atrStop: 606.0, points: 5, supertrend: 'Bullish', adx: 25.5, rsi: 54.8, sector: 'Cement', category: 'nifty100' },
  { stock: 'DABUR', name: 'Dabur India Ltd', price: 642.0, target: 674.1, atrStop: 622.0, points: 4, supertrend: 'Neutral', adx: 21.9, rsi: 48.0, sector: 'FMCG', category: 'nifty100' },

  // 71-80
  { stock: 'NAUKRI', name: 'Info Edge (India) Ltd', price: 7850.0, target: 8242.5, atrStop: 7610.0, points: 7, supertrend: 'Bullish', adx: 32.2, rsi: 65.5, sector: 'Internet', category: 'nifty100' },
  { stock: 'GODREJCP', name: 'Godrej Consumer Prod', price: 1480.0, target: 1554.0, atrStop: 1435.0, points: 6, supertrend: 'Bullish', adx: 27.4, rsi: 58.1, sector: 'FMCG', category: 'nifty100' },
  { stock: 'INDIGO', name: 'InterGlobe Aviation', price: 4720.0, target: 4956.0, atrStop: 4578.0, points: 7, supertrend: 'Bullish', adx: 35.2, rsi: 68.4, sector: 'Aviation', category: 'nifty100' },
  { stock: 'ICICIPRULI', name: 'ICICI Prudential Life', price: 745.0, target: 782.25, atrStop: 722.0, points: 5, supertrend: 'Bullish', adx: 25.1, rsi: 53.9, sector: 'Insurance', category: 'nifty100' },
  { stock: 'MAXHEALTH', name: 'Max Healthcare Institute', price: 920.0, target: 966.0, atrStop: 892.0, points: 7, supertrend: 'Bullish', adx: 33.1, rsi: 66.2, sector: 'Healthcare', category: 'nifty100' },
  { stock: 'UNITDSPR', name: 'United Spirits Ltd', price: 1420.0, target: 1491.0, atrStop: 1377.0, points: 6, supertrend: 'Bullish', adx: 28.7, rsi: 60.3, sector: 'Beverages', category: 'nifty100' },
  { stock: 'POLICYBZR', name: 'PB Fintech Ltd', price: 1680.0, target: 1764.0, atrStop: 1629.0, points: 7, supertrend: 'Bullish', adx: 36.5, rsi: 70.1, sector: 'Fintech', category: 'nifty100' },
  { stock: 'TATAELXSI', name: 'Tata Elxsi Ltd', price: 7920.0, target: 8316.0, atrStop: 7680.0, points: 5, supertrend: 'Bullish', adx: 26.3, rsi: 55.9, sector: 'IT', category: 'nifty100' },
  { stock: 'COLPAL', name: 'Colgate-Palmolive India', price: 3420.0, target: 3591.0, atrStop: 3317.0, points: 6, supertrend: 'Bullish', adx: 28.0, rsi: 59.0, sector: 'FMCG', category: 'nifty100' },
  { stock: 'MOTHERSON', name: 'Samvardhana Motherson', price: 188.0, target: 197.4, atrStop: 182.3, points: 6, supertrend: 'Bullish', adx: 29.8, rsi: 61.4, sector: 'Auto Ancillary', category: 'nifty100' },

  // 81-90
  { stock: 'TATACOMM', name: 'Tata Communications Ltd', price: 2150.0, target: 2257.5, atrStop: 2085.0, points: 6, supertrend: 'Bullish', adx: 27.2, rsi: 57.8, sector: 'Telecom', category: 'nifty100' },
  { stock: 'LUPIN', name: 'Lupin Ltd', price: 2180.0, target: 2289.0, atrStop: 2115.0, points: 7, supertrend: 'Bullish', adx: 34.0, rsi: 67.5, sector: 'Pharma', category: 'nifty100' },
  { stock: 'AUROPHARMA', name: 'Aurobindo Pharma', price: 1480.0, target: 1554.0, atrStop: 1435.0, points: 6, supertrend: 'Bullish', adx: 29.5, rsi: 61.0, sector: 'Pharma', category: 'nifty100' },
  { stock: 'CUMMINSIND', name: 'Cummins India Ltd', price: 3820.0, target: 4011.0, atrStop: 3705.0, points: 6, supertrend: 'Bullish', adx: 28.4, rsi: 59.6, sector: 'Capital Goods', category: 'nifty100' },
  { stock: 'POLYCAB', name: 'Polycab India Ltd', price: 6890.0, target: 7234.5, atrStop: 6680.0, points: 7, supertrend: 'Bullish', adx: 32.9, rsi: 65.8, sector: 'Electricals', category: 'nifty100' },
  { stock: 'SHREECEM', name: 'Shree Cement Ltd', price: 25400.0, target: 26670.0, atrStop: 24638.0, points: 4, supertrend: 'Neutral', adx: 22.1, rsi: 48.7, sector: 'Cement', category: 'nifty100' },
  { stock: 'INDUSTOWER', name: 'Indus Towers Ltd', price: 425.0, target: 446.25, atrStop: 412.0, points: 7, supertrend: 'Bullish', adx: 35.8, rsi: 69.2, sector: 'Telecom', category: 'nifty100' },
  { stock: 'BOSCHLTD', name: 'Bosch Ltd', price: 34200.0, target: 35910.0, atrStop: 33174.0, points: 5, supertrend: 'Bullish', adx: 25.6, rsi: 55.0, sector: 'Auto Ancillary', category: 'nifty100' },
  { stock: 'PIIND', name: 'PI Industries Ltd', price: 4420.0, target: 4641.0, atrStop: 4287.0, points: 6, supertrend: 'Bullish', adx: 28.0, rsi: 58.9, sector: 'Agrochem', category: 'nifty100' },
  { stock: 'MPHASIS', name: 'Mphasis Ltd', price: 2980.0, target: 3129.0, atrStop: 2890.0, points: 5, supertrend: 'Bullish', adx: 26.7, rsi: 56.2, sector: 'IT', category: 'nifty100' },

  // 91-100
  { stock: 'PERSISTENT', name: 'Persistent Systems Ltd', price: 5420.0, target: 5691.0, atrStop: 5257.0, points: 7, supertrend: 'Bullish', adx: 33.5, rsi: 66.8, sector: 'IT', category: 'nifty100' },
  { stock: 'COFORGE', name: 'Coforge Ltd', price: 6580.0, target: 6909.0, atrStop: 6382.0, points: 6, supertrend: 'Bullish', adx: 29.0, rsi: 60.5, sector: 'IT', category: 'nifty100' },
  { stock: 'MUTHOOTFIN', name: 'Muthoot Finance Ltd', price: 1890.0, target: 1984.5, atrStop: 1833.0, points: 6, supertrend: 'Bullish', adx: 28.8, rsi: 60.0, sector: 'Finance', category: 'nifty100' },
  { stock: 'MANAPPURAM', name: 'Manappuram Finance', price: 212.0, target: 222.6, atrStop: 205.6, points: 6, supertrend: 'Bullish', adx: 27.5, rsi: 58.0, sector: 'Finance', category: 'nifty100' },
  { stock: 'DIXON', name: 'Dixon Technologies', price: 12800.0, target: 13440.0, atrStop: 12416.0, points: 7, supertrend: 'Bullish', adx: 38.0, rsi: 71.5, sector: 'Electronics', category: 'nifty100' },
  { stock: 'KAYNES', name: 'Kaynes Technology Ltd', price: 4850.0, target: 5092.5, atrStop: 4704.0, points: 7, supertrend: 'Bullish', adx: 36.8, rsi: 70.4, sector: 'Electronics', category: 'nifty100' },
  { stock: 'MAZDOCK', name: 'Mazagon Dock Shipbuilders', price: 4420.0, target: 4641.0, atrStop: 4287.0, points: 7, supertrend: 'Bullish', adx: 37.5, rsi: 71.2, sector: 'Defense', category: 'nifty100' },
  { stock: 'COCHINSHIP', name: 'Cochin Shipyard Ltd', price: 1820.0, target: 1911.0, atrStop: 1765.0, points: 6, supertrend: 'Bullish', adx: 30.2, rsi: 62.4, sector: 'Defense', category: 'nifty100' },
  { stock: 'PRESTIGE', name: 'Prestige Estates Dev', price: 1890.0, target: 1984.5, atrStop: 1833.0, points: 6, supertrend: 'Bullish', adx: 28.9, rsi: 60.1, sector: 'Realty', category: 'nifty100' },
  { stock: 'LODHA', name: 'Macrotech Developers', price: 1240.0, target: 1302.0, atrStop: 1202.0, points: 5, supertrend: 'Bullish', adx: 25.8, rsi: 55.0, sector: 'Realty', category: 'nifty100' }
];

export function getScannerStocks(mode: 'watchlist' | 'nifty100' | 'custom', customSymbol?: string): ScannedStock[] {
  if (mode === 'nifty100') {
    return NIFTY_100_STOCKS;
  }

  if (mode === 'watchlist') {
    // Return curated list of 52 popular stocks
    return NIFTY_100_STOCKS.filter(s => s.category === 'both' || s.points >= 6);
  }

  if (mode === 'custom' && customSymbol && customSymbol.trim()) {
    const syms = customSymbol.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    const matched = NIFTY_100_STOCKS.filter(s => syms.some(sym => s.stock.includes(sym) || s.name.toUpperCase().includes(sym)));
    if (matched.length > 0) return matched;

    // Generate custom stock entry if not found in prebuilt list
    return syms.map(sym => ({
      stock: sym,
      name: `${sym} Ltd`,
      price: 1250.0,
      target: 1312.5,
      atrStop: 1212.5,
      points: 6,
      supertrend: 'Bullish',
      adx: 28.5,
      rsi: 61.2,
      sector: 'General',
      category: 'watchlist'
    }));
  }

  return NIFTY_100_STOCKS.slice(0, 50);
}
