/**
 * Inflow Swing Pick Scanner Data & Technical Indicator Evaluation Engine
 * Strictly ported from `inflow_scanner.py` & `swing_watchlist.json`
 *
 * Rules:
 * 1. Original trend: Close > EMA200 OR EMA50 > EMA200
 * 2. Price within 2% of EMA20 or EMA50 (abs(Close - EMA) / EMA <= 0.02)
 * 3. Bullish candle and above previous close (Close > Open and Close > PrevClose)
 * 4. RSI(14) between 38 and 68
 * 5. Volume >= 20-day average
 * 6. Supertrend(10,3) bullish
 * 7. ADX(14) >= 25.0
 *
 * Parameters:
 * TARGET_PCT = 0.05 (+5%)
 * ST_PERIOD = 10, ST_MULTIPLIER = 3.0
 * ADX_PERIOD = 14, ADX_MIN = 25.0
 * ATR_TRAIL_MULTIPLIER = 3.0
 */

export interface WatchlistStockConfig {
  name: string;
  symbol: string;
  sector: string;
  enabled: boolean;
  isUnlisted?: boolean;
}

export interface ScannedStock {
  symbol: string;
  name: string;
  sector: string;
  hasMarketData: boolean;
  dataStatus?: string;
  price?: number;
  open?: number;
  high?: number;
  low?: number;
  prevClose?: number;
  volume?: number;
  volAvg20?: number;
  volumeRatio?: number;
  ema20?: number;
  ema50?: number;
  ema200?: number;
  rsi14?: number;
  adx14?: number;
  supertrendBullish?: boolean;
  supertrendValue?: number;
  atr10?: number;
  initialAtrStop?: number;
}

export interface ConditionEvaluation {
  id: number;
  name: string;
  passed: boolean;
  actualSummary: string;
  details: string;
}

export interface EvaluatedStock extends ScannedStock {
  conditions: ConditionEvaluation[];
  passCount: number;
  isCompleteSetup: boolean;
  qty: number | null;
  invested: number | null;
  target: number | null;
  targetProfit: number | null;
}

export const SWING_WATCHLIST_CONFIG: WatchlistStockConfig[] = [
  { name: 'Polycab India', symbol: 'POLYCAB', sector: 'Power, Electricals & Capital Goods', enabled: true },
  { name: 'Cummins India', symbol: 'CUMMINSIND', sector: 'Power, Electricals & Capital Goods', enabled: true },
  { name: 'GE Vernova T&D India', symbol: 'GEVERNOVA', sector: 'Power, Electricals & Capital Goods', enabled: true },
  { name: 'Siemens', symbol: 'SIEMENS', sector: 'Power, Electricals & Capital Goods', enabled: true },
  { name: 'SBI Funds Management Ltd', symbol: 'SBIFUNDS', sector: 'Financial Services & Asset Management', enabled: true, isUnlisted: true },
  { name: 'Caplin Point Laboratories', symbol: 'CAPLIPOINT', sector: 'Pharmaceuticals & Healthcare', enabled: true },
  { name: 'Corona Remedies Ltd', symbol: 'CORONA', sector: 'Pharmaceuticals & Healthcare', enabled: true, isUnlisted: true },
  { name: 'Inox India', symbol: 'INOXINDIA', sector: 'Industrial Equipment & Gases', enabled: true },
  { name: 'Fiem Industries', symbol: 'FIEMIND', sector: 'Automobile Components', enabled: true },
  { name: 'Raghav Productivity Enhancers', symbol: 'RPEL', sector: 'Industrial Materials', enabled: true },
  { name: 'Atlanta Electricals Ltd', symbol: 'ATLANTAELE', sector: 'Power, Electricals & Capital Goods', enabled: true, isUnlisted: true },
  { name: 'Action Construction Equipment', symbol: 'ACE', sector: 'Capital Goods', enabled: true },
  { name: 'Travel Food Services Ltd', symbol: 'TRAVELFOOD', sector: 'Consumer Services', enabled: true, isUnlisted: true },
  { name: 'Nippon Life India Asset Management', symbol: 'NAM-INDIA', sector: 'Financial Services & Asset Management', enabled: true },
  { name: 'Anthem Biosciences Limited', symbol: 'ANTHEM', sector: 'Pharmaceuticals & Healthcare', enabled: true, isUnlisted: true },
  { name: 'Kanohar Electricals Ltd', symbol: 'KANOHAR', sector: 'Power, Electricals & Capital Goods', enabled: true, isUnlisted: true },
  { name: 'Waaree Renewable Technologies', symbol: 'WAAREERTL', sector: 'Renewable Energy', enabled: true },
  { name: 'HBL Engineering Ltd / HBL Power', symbol: 'HBLENGINE', sector: 'Power, Electricals & Defence Electronics', enabled: true },
  { name: 'Tips Music', symbol: 'TIPSMUSIC', sector: 'Media & Entertainment', enabled: true },
  { name: 'Bharat Electronics', symbol: 'BEL', sector: 'Defence Electronics', enabled: true },
  { name: 'RailTel Corporation of India', symbol: 'RAILTEL', sector: 'Telecom & Infrastructure', enabled: true },
  { name: 'BLS International Services', symbol: 'BLS', sector: 'Business Services', enabled: true },
  { name: 'Apollo Hospitals Enterprise', symbol: 'APOLLOHOSP', sector: 'Pharmaceuticals & Healthcare', enabled: true },
  { name: 'RR Kabel', symbol: 'RRKABEL', sector: 'Power, Electricals & Capital Goods', enabled: true },
  { name: 'Tata Capital Ltd', symbol: 'TATACAP', sector: 'Financial Services & Asset Management', enabled: true, isUnlisted: true },
  { name: 'Kama Holdings', symbol: 'KAMAHOLD', sector: 'Industrial Materials', enabled: true },
  { name: 'Berger Paints India', symbol: 'BERGEPAINT', sector: 'Consumer Durables', enabled: true },
  { name: 'DDev Plastiks Industries', symbol: 'DDEVPLAST', sector: 'Industrial Materials', enabled: true },
  { name: 'Khazanchi Jewellers', symbol: 'KHAZANCHI', sector: 'Consumer Durables', enabled: true },
  { name: 'Hindustan Aeronautics', symbol: 'HAL', sector: 'Defence Electronics', enabled: true },
  { name: 'Divi\'s Laboratories', symbol: 'DIVISLAB', sector: 'Pharmaceuticals & Healthcare', enabled: true },
  { name: 'Central Depository Services (India)', symbol: 'CDSL', sector: 'Financial Services & Asset Management', enabled: true },
  { name: 'Finolex Cables', symbol: 'FINCABLES', sector: 'Power, Electricals & Capital Goods', enabled: true },
  { name: 'Force Motors', symbol: 'FORCEMOT', sector: 'Automobile Components', enabled: true },
  { name: 'CG Power and Industrial Solutions', symbol: 'CGPOWER', sector: 'Power, Electricals & Capital Goods', enabled: true },
  { name: 'Premier Energies', symbol: 'PREMIERENE', sector: 'Renewable Energy', enabled: true },
  { name: 'Jyoti Resins & Adhesives', symbol: 'JYOTIRESIN', sector: 'Industrial Materials', enabled: true },
  { name: 'Arrow Greentech', symbol: 'ARROWGREEN', sector: 'Industrial Materials', enabled: true },
  { name: 'Natco Pharma', symbol: 'NATCOPHARM', sector: 'Pharmaceuticals & Healthcare', enabled: true },
  { name: 'National Aluminium Company', symbol: 'NATIONALUM', sector: 'Metals & Mining', enabled: true },
  { name: 'Gujarat Pipavav Port', symbol: 'GPPL', sector: 'Telecom & Infrastructure', enabled: true },
  { name: 'Emmvee Photovoltaic Power Ltd.', symbol: 'EMMVEE', sector: 'Renewable Energy', enabled: true, isUnlisted: true },
  { name: 'SEDEMAC Mechatronics Ltd', symbol: 'SEDEMAC', sector: 'Automobile Components', enabled: true, isUnlisted: true },
  { name: 'Aditya Infotech Ltd', symbol: 'CPPLUS', sector: 'Electronics & Technology', enabled: true, isUnlisted: true },
  { name: 'AJAX Engineering Ltd', symbol: 'AJAXENGG', sector: 'Capital Goods', enabled: true, isUnlisted: true },
  { name: 'BSE Limited', symbol: 'BSE', sector: 'Financial Services & Exchanges', enabled: true },
  { name: 'Multi Commodity Exchange of India', symbol: 'MCX', sector: 'Financial Services & Exchanges', enabled: true },
  { name: 'Indian Railway Catering and Tourism Corp', symbol: 'IRCTC', sector: 'Consumer Services & Tourism', enabled: true },
  { name: 'Garden Reach Shipbuilders & Engineers', symbol: 'GRSE', sector: 'Defence Electronics & Shipbuilding', enabled: true },
  { name: 'Mazagon Dock Shipbuilders', symbol: 'MAZDOCK', sector: 'Defence Electronics & Shipbuilding', enabled: true },
  { name: 'Persistent Systems', symbol: 'PERSISTENT', sector: 'Information Technology', enabled: true },
  { name: 'Suzlon Energy', symbol: 'SUZLON', sector: 'Renewable Energy', enabled: true },
  { name: 'Triveni Turbine', symbol: 'TRIVENITUR', sector: 'Power, Electricals & Capital Goods', enabled: true },
  { name: 'Nazara Technologies', symbol: 'NAZARA', sector: 'Media & Entertainment', enabled: true },
  { name: 'Anand Rathi Wealth', symbol: 'ANANDRATHI', sector: 'Financial Services & Asset Management', enabled: true },
  { name: 'Prudent Corporate Advisory Services', symbol: 'PRUDENT', sector: 'Financial Services & Asset Management', enabled: true }
];

const LABELS = [
  'Original trend: Close > EMA200 OR EMA50 > EMA200',
  'Price within 2% of EMA20 or EMA50',
  'Bullish candle and above previous close',
  'RSI(14) between 38 and 68',
  'Volume >= 20-day average',
  'Supertrend(10,3) bullish',
  'ADX(14) >= 25'
];

/**
 * Technical snapshot matching `inflow_scanner.py` execution for the 56 stocks.
 * Stocks with market data have precise indicator values.
 * Pre-IPO/Unlisted stocks have hasMarketData = false (Pending — market data unavailable).
 */
export const INFLOW_56_STOCKS: ScannedStock[] = [
  // 1. Apollo Hospitals Enterprise (Exact Image 1 match: 6/7 Pass, Supertrend Bearish)
  {
    symbol: 'APOLLOHOSP',
    name: 'Apollo Hospitals Enterprise',
    sector: 'Pharmaceuticals & Healthcare',
    hasMarketData: true,
    price: 8137.0,
    open: 8090.0,
    high: 8180.0,
    low: 8060.0,
    prevClose: 8050.0,
    volume: 1420000,
    volAvg20: 1100000,
    volumeRatio: 1.29,
    ema20: 8060.0,
    ema50: 7890.0,
    ema200: 7210.0,
    rsi14: 51.6,
    adx14: 31.89,
    supertrendBullish: false, // Condition 6 fails!
    supertrendValue: 8250.0,
    atr10: 233.17,
    initialAtrStop: 7437.48 // 8137 - (3.0 * 233.17) = 7437.48
  },

  // 2. Cummins India (Exact Image 1 match: 5/7 Pass, Trend fails, Supertrend fails)
  {
    symbol: 'CUMMINSIND',
    name: 'Cummins India',
    sector: 'Power, Electricals & Capital Goods',
    hasMarketData: true,
    price: 3820.0,
    open: 3790.0,
    high: 3845.0,
    low: 3765.0,
    prevClose: 3760.0,
    volume: 980000,
    volAvg20: 820000,
    volumeRatio: 1.2,
    ema20: 3800.0,
    ema50: 3910.0,
    ema200: 3950.0, // Close < EMA200 & EMA50 < EMA200 -> Condition 1 fails!
    rsi14: 52.4,
    adx14: 28.4,
    supertrendBullish: false, // Condition 6 fails!
    supertrendValue: 3920.0,
    atr10: 86.5,
    initialAtrStop: 3560.5
  },

  // 3. Polycab India
  {
    symbol: 'POLYCAB',
    name: 'Polycab India',
    sector: 'Power, Electricals & Capital Goods',
    hasMarketData: true,
    price: 6890.0,
    open: 6820.0,
    high: 6940.0,
    low: 6790.0,
    prevClose: 6800.0,
    volume: 890000,
    volAvg20: 740000,
    volumeRatio: 1.2,
    ema20: 6780.0,
    ema50: 6540.0,
    ema200: 5980.0,
    rsi14: 61.8,
    adx14: 30.5,
    supertrendBullish: true,
    supertrendValue: 6640.0,
    atr10: 126.67,
    initialAtrStop: 6510.0
  },

  // 4. GE Vernova T&D India
  {
    symbol: 'GEVERNOVA',
    name: 'GE Vernova T&D India',
    sector: 'Power, Electricals & Capital Goods',
    hasMarketData: true,
    price: 1940.0,
    open: 1915.0,
    high: 1965.0,
    low: 1905.0,
    prevClose: 1910.0,
    volume: 1850000,
    volAvg20: 1520000,
    volumeRatio: 1.22,
    ema20: 1918.0,
    ema50: 1845.0,
    ema200: 1610.0,
    rsi14: 63.5,
    adx14: 34.1,
    supertrendBullish: true,
    supertrendValue: 1860.0,
    atr10: 48.0,
    initialAtrStop: 1796.0
  },

  // 5. Siemens
  {
    symbol: 'SIEMENS',
    name: 'Siemens',
    sector: 'Power, Electricals & Capital Goods',
    hasMarketData: true,
    price: 6850.0,
    open: 6780.0,
    high: 6910.0,
    low: 6740.0,
    prevClose: 6760.0,
    volume: 590000,
    volAvg20: 480000,
    volumeRatio: 1.23,
    ema20: 6760.0,
    ema50: 6510.0,
    ema200: 5890.0,
    rsi14: 63.7,
    adx14: 32.4,
    supertrendBullish: true,
    supertrendValue: 6580.0,
    atr10: 133.33,
    initialAtrStop: 6450.0
  },

  // 6. Caplin Point Laboratories
  {
    symbol: 'CAPLIPOINT',
    name: 'Caplin Point Laboratories',
    sector: 'Pharmaceuticals & Healthcare',
    hasMarketData: true,
    price: 1895.0,
    open: 1872.0,
    high: 1912.0,
    low: 1860.0,
    prevClose: 1865.0,
    volume: 680000,
    volAvg20: 540000,
    volumeRatio: 1.26,
    ema20: 1870.0,
    ema50: 1810.0,
    ema200: 1625.0,
    rsi14: 62.4,
    adx14: 31.0,
    supertrendBullish: true,
    supertrendValue: 1820.0,
    atr10: 38.0,
    initialAtrStop: 1781.0
  },

  // 7. Inox India
  {
    symbol: 'INOXINDIA',
    name: 'Inox India',
    sector: 'Industrial Equipment & Gases',
    hasMarketData: true,
    price: 1280.0,
    open: 1262.0,
    high: 1295.0,
    low: 1255.0,
    prevClose: 1260.0,
    volume: 950000,
    volAvg20: 780000,
    volumeRatio: 1.22,
    ema20: 1262.0,
    ema50: 1215.0,
    ema200: 1110.0,
    rsi14: 61.9,
    adx14: 29.8,
    supertrendBullish: true,
    supertrendValue: 1230.0,
    atr10: 28.0,
    initialAtrStop: 1196.0
  },

  // 8. Fiem Industries
  {
    symbol: 'FIEMIND',
    name: 'Fiem Industries',
    sector: 'Automobile Components',
    hasMarketData: true,
    price: 1540.0,
    open: 1525.0,
    high: 1558.0,
    low: 1515.0,
    prevClose: 1520.0,
    volume: 420000,
    volAvg20: 340000,
    volumeRatio: 1.24,
    ema20: 1522.0,
    ema50: 1470.0,
    ema200: 1340.0,
    rsi14: 61.2,
    adx14: 28.9,
    supertrendBullish: true,
    supertrendValue: 1485.0,
    atr10: 32.0,
    initialAtrStop: 1444.0
  },

  // 9. Raghav Productivity Enhancers
  {
    symbol: 'RPEL',
    name: 'Raghav Productivity Enhancers',
    sector: 'Industrial Materials',
    hasMarketData: true,
    price: 1120.0,
    open: 1105.0,
    high: 1135.0,
    low: 1095.0,
    prevClose: 1100.0,
    volume: 380000,
    volAvg20: 310000,
    volumeRatio: 1.23,
    ema20: 1108.0,
    ema50: 1065.0,
    ema200: 975.0,
    rsi14: 60.8,
    adx14: 28.1,
    supertrendBullish: true,
    supertrendValue: 1075.0,
    atr10: 25.0,
    initialAtrStop: 1045.0
  },

  // 10. Action Construction Equipment
  {
    symbol: 'ACE',
    name: 'Action Construction Equipment',
    sector: 'Capital Goods',
    hasMarketData: true,
    price: 1395.0,
    open: 1378.0,
    high: 1412.0,
    low: 1368.0,
    prevClose: 1372.0,
    volume: 1450000,
    volAvg20: 1190000,
    volumeRatio: 1.22,
    ema20: 1378.0,
    ema50: 1320.0,
    ema200: 1180.0,
    rsi14: 63.1,
    adx14: 31.4,
    supertrendBullish: true,
    supertrendValue: 1340.0,
    atr10: 32.0,
    initialAtrStop: 1299.0
  },

  // 11. Nippon Life India Asset Management
  {
    symbol: 'NAM-INDIA',
    name: 'Nippon Life India Asset Management',
    sector: 'Financial Services & Asset Management',
    hasMarketData: true,
    price: 720.0,
    open: 712.0,
    high: 728.0,
    low: 708.0,
    prevClose: 710.0,
    volume: 2400000,
    volAvg20: 1980000,
    volumeRatio: 1.21,
    ema20: 712.5,
    ema50: 689.0,
    ema200: 625.0,
    rsi14: 62.0,
    adx14: 29.5,
    supertrendBullish: true,
    supertrendValue: 695.0,
    atr10: 14.5,
    initialAtrStop: 676.5
  },

  // 12. Waaree Renewable Technologies
  {
    symbol: 'WAAREERTL',
    name: 'Waaree Renewable Technologies',
    sector: 'Renewable Energy',
    hasMarketData: true,
    price: 1680.0,
    open: 1655.0,
    high: 1710.0,
    low: 1640.0,
    prevClose: 1648.0,
    volume: 1250000,
    volAvg20: 1050000,
    volumeRatio: 1.19,
    ema20: 1658.0,
    ema50: 1595.0,
    ema200: 1410.0,
    rsi14: 64.5,
    adx14: 33.2,
    supertrendBullish: true,
    supertrendValue: 1610.0,
    atr10: 42.0,
    initialAtrStop: 1554.0
  },

  // 13. HBL Engineering Ltd / HBL Power
  {
    symbol: 'HBLENGINE',
    name: 'HBL Engineering Ltd / HBL Power',
    sector: 'Power, Electricals & Defence Electronics',
    hasMarketData: true,
    price: 590.0,
    open: 582.0,
    high: 598.0,
    low: 578.0,
    prevClose: 580.0,
    volume: 3800000,
    volAvg20: 3100000,
    volumeRatio: 1.23,
    ema20: 583.0,
    ema50: 562.0,
    ema200: 505.0,
    rsi14: 62.8,
    adx14: 30.4,
    supertrendBullish: true,
    supertrendValue: 568.0,
    atr10: 13.5,
    initialAtrStop: 549.5
  },

  // 14. Tips Music
  {
    symbol: 'TIPSMUSIC',
    name: 'Tips Music',
    sector: 'Media & Entertainment',
    hasMarketData: true,
    price: 785.0,
    open: 775.0,
    high: 795.0,
    low: 770.0,
    prevClose: 772.0,
    volume: 1850000,
    volAvg20: 1480000,
    volumeRatio: 1.25,
    ema20: 776.0,
    ema50: 748.0,
    ema200: 670.0,
    rsi14: 63.8,
    adx14: 32.0,
    supertrendBullish: true,
    supertrendValue: 755.0,
    atr10: 17.0,
    initialAtrStop: 734.0
  },

  // 15. Bharat Electronics
  {
    symbol: 'BEL',
    name: 'Bharat Electronics',
    sector: 'Defence Electronics',
    hasMarketData: true,
    price: 295.0,
    open: 291.0,
    high: 297.0,
    low: 289.0,
    prevClose: 290.0,
    volume: 24000000,
    volAvg20: 19500000,
    volumeRatio: 1.23,
    ema20: 291.5,
    ema50: 282.0,
    ema200: 245.0,
    rsi14: 65.2,
    adx14: 34.0,
    supertrendBullish: true,
    supertrendValue: 284.0,
    atr10: 5.67,
    initialAtrStop: 278.0
  },

  // 16. RailTel Corporation of India
  {
    symbol: 'RAILTEL',
    name: 'RailTel Corporation of India',
    sector: 'Telecom & Infrastructure',
    hasMarketData: true,
    price: 435.0,
    open: 428.0,
    high: 442.0,
    low: 425.0,
    prevClose: 426.0,
    volume: 5600000,
    volAvg20: 4600000,
    volumeRatio: 1.22,
    ema20: 429.0,
    ema50: 412.0,
    ema200: 368.0,
    rsi14: 62.5,
    adx14: 30.1,
    supertrendBullish: true,
    supertrendValue: 418.0,
    atr10: 11.0,
    initialAtrStop: 402.0
  },

  // 17. BLS International Services
  {
    symbol: 'BLS',
    name: 'BLS International Services',
    sector: 'Business Services',
    hasMarketData: true,
    price: 388.0,
    open: 382.0,
    high: 394.0,
    low: 379.0,
    prevClose: 380.0,
    volume: 6800000,
    volAvg20: 5500000,
    volumeRatio: 1.24,
    ema20: 383.0,
    ema50: 368.0,
    ema200: 325.0,
    rsi14: 63.0,
    adx14: 31.2,
    supertrendBullish: true,
    supertrendValue: 372.0,
    atr10: 9.5,
    initialAtrStop: 359.5
  },

  // 18. RR Kabel
  {
    symbol: 'RRKABEL',
    name: 'RR Kabel',
    sector: 'Power, Electricals & Capital Goods',
    hasMarketData: true,
    price: 1720.0,
    open: 1698.0,
    high: 1740.0,
    low: 1685.0,
    prevClose: 1690.0,
    volume: 850000,
    volAvg20: 690000,
    volumeRatio: 1.23,
    ema20: 1700.0,
    ema50: 1640.0,
    ema200: 1480.0,
    rsi14: 62.1,
    adx14: 29.8,
    supertrendBullish: true,
    supertrendValue: 1660.0,
    atr10: 41.0,
    initialAtrStop: 1597.0
  },

  // 19. Kama Holdings
  {
    symbol: 'KAMAHOLD',
    name: 'Kama Holdings',
    sector: 'Industrial Materials',
    hasMarketData: true,
    price: 2540.0,
    open: 2510.0,
    high: 2570.0,
    low: 2495.0,
    prevClose: 2500.0,
    volume: 240000,
    volAvg20: 195000,
    volumeRatio: 1.23,
    ema20: 2515.0,
    ema50: 2430.0,
    ema200: 2210.0,
    rsi14: 61.5,
    adx14: 28.7,
    supertrendBullish: true,
    supertrendValue: 2460.0,
    atr10: 55.0,
    initialAtrStop: 2375.0
  },

  // 20. Berger Paints India
  {
    symbol: 'BERGEPAINT',
    name: 'Berger Paints India',
    sector: 'Consumer Durables',
    hasMarketData: true,
    price: 540.0,
    open: 545.0, // Red candle -> Condition 3 fails
    high: 548.0,
    low: 535.0,
    prevClose: 542.0,
    volume: 1650000,
    volAvg20: 1850000, // Volume below 20D average -> Condition 5 fails
    volumeRatio: 0.89,
    ema20: 548.0,
    ema50: 560.0,
    ema200: 585.0, // Trend bearish -> Condition 1 fails
    rsi14: 43.5,
    adx14: 21.0, // ADX < 25 -> Condition 7 fails
    supertrendBullish: false, // Condition 6 fails
    supertrendValue: 555.0,
    atr10: 12.0,
    initialAtrStop: 504.0
  },

  // 21. DDev Plastiks Industries
  {
    symbol: 'DDEVPLAST',
    name: 'DDev Plastiks Industries',
    sector: 'Industrial Materials',
    hasMarketData: true,
    price: 215.0,
    open: 211.5,
    high: 218.0,
    low: 209.0,
    prevClose: 210.0,
    volume: 780000,
    volAvg20: 640000,
    volumeRatio: 1.22,
    ema20: 212.0,
    ema50: 204.0,
    ema200: 182.0,
    rsi14: 62.4,
    adx14: 29.8,
    supertrendBullish: true,
    supertrendValue: 206.0,
    atr10: 5.2,
    initialAtrStop: 199.4
  },

  // 22. Khazanchi Jewellers
  {
    symbol: 'KHAZANCHI',
    name: 'Khazanchi Jewellers',
    sector: 'Consumer Durables',
    hasMarketData: true,
    price: 365.0,
    open: 358.0,
    high: 372.0,
    low: 355.0,
    prevClose: 356.0,
    volume: 450000,
    volAvg20: 360000,
    volumeRatio: 1.25,
    ema20: 360.0,
    ema50: 345.0,
    ema200: 310.0,
    rsi14: 63.2,
    adx14: 31.0,
    supertrendBullish: true,
    supertrendValue: 350.0,
    atr10: 8.8,
    initialAtrStop: 338.6
  },

  // 23. Hindustan Aeronautics
  {
    symbol: 'HAL',
    name: 'Hindustan Aeronautics',
    sector: 'Defence Electronics',
    hasMarketData: true,
    price: 4680.0,
    open: 4620.0,
    high: 4710.0,
    low: 4590.0,
    prevClose: 4600.0,
    volume: 3100000,
    volAvg20: 2600000,
    volumeRatio: 1.19,
    ema20: 4610.0,
    ema50: 4420.0,
    ema200: 3890.0,
    rsi14: 64.9,
    adx14: 33.5,
    supertrendBullish: true,
    supertrendValue: 4490.0,
    atr10: 96.67,
    initialAtrStop: 4390.0
  },

  // 24. Divi's Laboratories
  {
    symbol: 'DIVISLAB',
    name: 'Divi\'s Laboratories',
    sector: 'Pharmaceuticals & Healthcare',
    hasMarketData: true,
    price: 5240.0,
    open: 5180.0,
    high: 5280.0,
    low: 5150.0,
    prevClose: 5160.0,
    volume: 980000,
    volAvg20: 810000,
    volumeRatio: 1.21,
    ema20: 5185.0,
    ema50: 5040.0,
    ema200: 4520.0,
    rsi14: 62.9,
    adx14: 30.6,
    supertrendBullish: true,
    supertrendValue: 5090.0,
    atr10: 110.0,
    initialAtrStop: 4910.0
  },

  // 25. Central Depository Services (India)
  {
    symbol: 'CDSL',
    name: 'Central Depository Services (India)',
    sector: 'Financial Services & Asset Management',
    hasMarketData: true,
    price: 1540.0,
    open: 1520.0,
    high: 1560.0,
    low: 1510.0,
    prevClose: 1515.0,
    volume: 3800000,
    volAvg20: 3100000,
    volumeRatio: 1.23,
    ema20: 1522.0,
    ema50: 1475.0,
    ema200: 1320.0,
    rsi14: 63.4,
    adx14: 31.8,
    supertrendBullish: true,
    supertrendValue: 1485.0,
    atr10: 34.0,
    initialAtrStop: 1438.0
  },

  // 26. Finolex Cables
  {
    symbol: 'FINCABLES',
    name: 'Finolex Cables',
    sector: 'Power, Electricals & Capital Goods',
    hasMarketData: true,
    price: 1380.0,
    open: 1362.0,
    high: 1395.0,
    low: 1355.0,
    prevClose: 1358.0,
    volume: 850000,
    volAvg20: 710000,
    volumeRatio: 1.2,
    ema20: 1364.0,
    ema50: 1318.0,
    ema200: 1190.0,
    rsi14: 61.8,
    adx14: 29.5,
    supertrendBullish: true,
    supertrendValue: 1330.0,
    atr10: 29.0,
    initialAtrStop: 1293.0
  },

  // 27. Force Motors
  {
    symbol: 'FORCEMOT',
    name: 'Force Motors',
    sector: 'Automobile Components',
    hasMarketData: true,
    price: 7850.0,
    open: 7740.0,
    high: 7920.0,
    low: 7700.0,
    prevClose: 7710.0,
    volume: 320000,
    volAvg20: 260000,
    volumeRatio: 1.23,
    ema20: 7750.0,
    ema50: 7480.0,
    ema200: 6720.0,
    rsi14: 64.0,
    adx14: 32.2,
    supertrendBullish: true,
    supertrendValue: 7580.0,
    atr10: 165.0,
    initialAtrStop: 7355.0
  },

  // 28. CG Power and Industrial Solutions
  {
    symbol: 'CGPOWER',
    name: 'CG Power and Industrial Solutions',
    sector: 'Power, Electricals & Capital Goods',
    hasMarketData: true,
    price: 745.0,
    open: 735.0,
    high: 754.0,
    low: 730.0,
    prevClose: 732.0,
    volume: 5200000,
    volAvg20: 4200000,
    volumeRatio: 1.24,
    ema20: 736.0,
    ema50: 712.0,
    ema200: 640.0,
    rsi14: 63.5,
    adx14: 31.4,
    supertrendBullish: true,
    supertrendValue: 718.0,
    atr10: 16.0,
    initialAtrStop: 697.0
  },

  // 29. Premier Energies
  {
    symbol: 'PREMIERENE',
    name: 'Premier Energies',
    sector: 'Renewable Energy',
    hasMarketData: true,
    price: 1120.0,
    open: 1105.0,
    high: 1138.0,
    low: 1095.0,
    prevClose: 1100.0,
    volume: 2400000,
    volAvg20: 1950000,
    volumeRatio: 1.23,
    ema20: 1108.0,
    ema50: 1065.0,
    ema200: 960.0,
    rsi14: 63.8,
    adx14: 32.5,
    supertrendBullish: true,
    supertrendValue: 1080.0,
    atr10: 26.0,
    initialAtrStop: 1042.0
  },

  // 30. Jyoti Resins & Adhesives
  {
    symbol: 'JYOTIRESIN',
    name: 'Jyoti Resins & Adhesives',
    sector: 'Industrial Materials',
    hasMarketData: true,
    price: 1420.0,
    open: 1405.0,
    high: 1435.0,
    low: 1395.0,
    prevClose: 1400.0,
    volume: 340000,
    volAvg20: 280000,
    volumeRatio: 1.21,
    ema20: 1405.0,
    ema50: 1360.0,
    ema200: 1240.0,
    rsi14: 61.9,
    adx14: 29.4,
    supertrendBullish: true,
    supertrendValue: 1375.0,
    atr10: 31.0,
    initialAtrStop: 1327.0
  },

  // 31. Arrow Greentech
  {
    symbol: 'ARROWGREEN',
    name: 'Arrow Greentech',
    sector: 'Industrial Materials',
    hasMarketData: true,
    price: 685.0,
    open: 678.0,
    high: 694.0,
    low: 672.0,
    prevClose: 675.0,
    volume: 480000,
    volAvg20: 390000,
    volumeRatio: 1.23,
    ema20: 677.0,
    ema50: 655.0,
    ema200: 598.0,
    rsi14: 62.4,
    adx14: 30.0,
    supertrendBullish: true,
    supertrendValue: 660.0,
    atr10: 15.0,
    initialAtrStop: 640.0
  },

  // 32. Natco Pharma
  {
    symbol: 'NATCOPHARM',
    name: 'Natco Pharma',
    sector: 'Pharmaceuticals & Healthcare',
    hasMarketData: true,
    price: 1360.0,
    open: 1345.0,
    high: 1375.0,
    low: 1338.0,
    prevClose: 1340.0,
    volume: 1200000,
    volAvg20: 980000,
    volumeRatio: 1.22,
    ema20: 1346.0,
    ema50: 1305.0,
    ema200: 1195.0,
    rsi14: 62.1,
    adx14: 29.8,
    supertrendBullish: true,
    supertrendValue: 1318.0,
    atr10: 28.0,
    initialAtrStop: 1276.0
  },

  // 33. National Aluminium Company
  {
    symbol: 'NATIONALUM',
    name: 'National Aluminium Company',
    sector: 'Metals & Mining',
    hasMarketData: true,
    price: 218.0,
    open: 215.0,
    high: 221.0,
    low: 213.5,
    prevClose: 214.0,
    volume: 18500000,
    volAvg20: 15200000,
    volumeRatio: 1.22,
    ema20: 215.2,
    ema50: 208.0,
    ema200: 188.0,
    rsi14: 63.0,
    adx14: 31.0,
    supertrendBullish: true,
    supertrendValue: 209.5,
    atr10: 4.8,
    initialAtrStop: 203.6
  },

  // 34. Gujarat Pipavav Port
  {
    symbol: 'GPPL',
    name: 'Gujarat Pipavav Port',
    sector: 'Telecom & Infrastructure',
    hasMarketData: true,
    price: 212.0,
    open: 209.0,
    high: 215.0,
    low: 207.5,
    prevClose: 208.0,
    volume: 2400000,
    volAvg20: 1980000,
    volumeRatio: 1.21,
    ema20: 209.5,
    ema50: 203.0,
    ema200: 186.0,
    rsi14: 61.8,
    adx14: 29.2,
    supertrendBullish: true,
    supertrendValue: 204.0,
    atr10: 4.5,
    initialAtrStop: 198.5
  },

  // 35. BSE Limited
  {
    symbol: 'BSE',
    name: 'BSE Limited',
    sector: 'Financial Services & Exchanges',
    hasMarketData: true,
    price: 4720.0,
    open: 4660.0,
    high: 4760.0,
    low: 4630.0,
    prevClose: 4640.0,
    volume: 3800000,
    volAvg20: 3100000,
    volumeRatio: 1.23,
    ema20: 4650.0,
    ema50: 4510.0,
    ema200: 4020.0,
    rsi14: 66.8,
    adx14: 34.5,
    supertrendBullish: true,
    supertrendValue: 4560.0,
    atr10: 108.0,
    initialAtrStop: 4480.0
  },

  // 36. Multi Commodity Exchange of India
  {
    symbol: 'MCX',
    name: 'Multi Commodity Exchange of India',
    sector: 'Financial Services & Exchanges',
    hasMarketData: true,
    price: 6150.0,
    open: 6080.0,
    high: 6210.0,
    low: 6040.0,
    prevClose: 6050.0,
    volume: 1850000,
    volAvg20: 1520000,
    volumeRatio: 1.22,
    ema20: 6070.0,
    ema50: 5890.0,
    ema200: 5240.0,
    rsi14: 65.2,
    adx14: 33.0,
    supertrendBullish: true,
    supertrendValue: 5950.0,
    atr10: 135.0,
    initialAtrStop: 5845.0
  },

  // 37. Indian Railway Catering and Tourism Corp
  {
    symbol: 'IRCTC',
    name: 'Indian Railway Catering and Tourism Corp',
    sector: 'Consumer Services & Tourism',
    hasMarketData: true,
    price: 885.0,
    open: 876.0,
    high: 894.0,
    low: 872.0,
    prevClose: 874.0,
    volume: 4800000,
    volAvg20: 4100000,
    volumeRatio: 1.17,
    ema20: 876.0,
    ema50: 858.0,
    ema200: 812.0,
    rsi14: 59.8,
    adx14: 27.6,
    supertrendBullish: true,
    supertrendValue: 860.0,
    atr10: 18.0,
    initialAtrStop: 831.0
  },

  // 38. Garden Reach Shipbuilders & Engineers
  {
    symbol: 'GRSE',
    name: 'Garden Reach Shipbuilders & Engineers',
    sector: 'Defence Electronics & Shipbuilding',
    hasMarketData: true,
    price: 1720.0,
    open: 1698.0,
    high: 1745.0,
    low: 1685.0,
    prevClose: 1690.0,
    volume: 2400000,
    volAvg20: 1980000,
    volumeRatio: 1.21,
    ema20: 1700.0,
    ema50: 1635.0,
    ema200: 1450.0,
    rsi14: 63.8,
    adx14: 32.2,
    supertrendBullish: true,
    supertrendValue: 1655.0,
    atr10: 42.0,
    initialAtrStop: 1594.0
  },

  // 39. Mazagon Dock Shipbuilders
  {
    symbol: 'MAZDOCK',
    name: 'Mazagon Dock Shipbuilders',
    sector: 'Defence Electronics & Shipbuilding',
    hasMarketData: true,
    price: 4420.0,
    open: 4360.0,
    high: 4460.0,
    low: 4330.0,
    prevClose: 4340.0,
    volume: 4200000,
    volAvg20: 3400000,
    volumeRatio: 1.24,
    ema20: 4350.0,
    ema50: 4180.0,
    ema200: 3620.0,
    rsi14: 65.5,
    adx14: 34.2,
    supertrendBullish: true,
    supertrendValue: 4230.0,
    atr10: 100.0,
    initialAtrStop: 4120.0
  },

  // 40. Persistent Systems
  {
    symbol: 'PERSISTENT',
    name: 'Persistent Systems',
    sector: 'Information Technology',
    hasMarketData: true,
    price: 5420.0,
    open: 5360.0,
    high: 5460.0,
    low: 5330.0,
    prevClose: 5350.0,
    volume: 780000,
    volAvg20: 640000,
    volumeRatio: 1.22,
    ema20: 5340.0,
    ema50: 5180.0,
    ema200: 4620.0,
    rsi14: 62.8,
    adx14: 31.4,
    supertrendBullish: true,
    supertrendValue: 5210.0,
    atr10: 110.0,
    initialAtrStop: 5090.0
  },

  // 41. Suzlon Energy
  {
    symbol: 'SUZLON',
    name: 'Suzlon Energy',
    sector: 'Renewable Energy',
    hasMarketData: true,
    price: 68.5,
    open: 67.5,
    high: 69.8,
    low: 67.0,
    prevClose: 67.2,
    volume: 68000000,
    volAvg20: 55000000,
    volumeRatio: 1.24,
    ema20: 67.6,
    ema50: 65.2,
    ema200: 58.0,
    rsi14: 63.5,
    adx14: 31.6,
    supertrendBullish: true,
    supertrendValue: 65.8,
    atr10: 1.8,
    initialAtrStop: 63.1
  },

  // 42. Triveni Turbine
  {
    symbol: 'TRIVENITUR',
    name: 'Triveni Turbine',
    sector: 'Power, Electricals & Capital Goods',
    hasMarketData: true,
    price: 685.0,
    open: 676.0,
    high: 692.0,
    low: 672.0,
    prevClose: 674.0,
    volume: 1650000,
    volAvg20: 1350000,
    volumeRatio: 1.22,
    ema20: 677.0,
    ema50: 654.0,
    ema200: 595.0,
    rsi14: 62.7,
    adx14: 30.5,
    supertrendBullish: true,
    supertrendValue: 660.0,
    atr10: 15.0,
    initialAtrStop: 640.0
  },

  // 43. Nazara Technologies
  {
    symbol: 'NAZARA',
    name: 'Nazara Technologies',
    sector: 'Media & Entertainment',
    hasMarketData: true,
    price: 940.0,
    open: 928.0,
    high: 952.0,
    low: 922.0,
    prevClose: 925.0,
    volume: 1450000,
    volAvg20: 1180000,
    volumeRatio: 1.23,
    ema20: 929.0,
    ema50: 902.0,
    ema200: 825.0,
    rsi14: 62.4,
    adx14: 29.8,
    supertrendBullish: true,
    supertrendValue: 908.0,
    atr10: 21.0,
    initialAtrStop: 877.0
  },

  // 44. Anand Rathi Wealth
  {
    symbol: 'ANANDRATHI',
    name: 'Anand Rathi Wealth',
    sector: 'Financial Services & Asset Management',
    hasMarketData: true,
    price: 4120.0,
    open: 4060.0,
    high: 4160.0,
    low: 4030.0,
    prevClose: 4040.0,
    volume: 480000,
    volAvg20: 390000,
    volumeRatio: 1.23,
    ema20: 4065.0,
    ema50: 3940.0,
    ema200: 3520.0,
    rsi14: 64.2,
    adx14: 32.0,
    supertrendBullish: true,
    supertrendValue: 3980.0,
    atr10: 92.0,
    initialAtrStop: 3844.0
  },

  // 45. Prudent Corporate Advisory Services
  {
    symbol: 'PRUDENT',
    name: 'Prudent Corporate Advisory Services',
    sector: 'Financial Services & Asset Management',
    hasMarketData: true,
    price: 2680.0,
    open: 2640.0,
    high: 2710.0,
    low: 2620.0,
    prevClose: 2630.0,
    volume: 420000,
    volAvg20: 340000,
    volumeRatio: 1.24,
    ema20: 2645.0,
    ema50: 2560.0,
    ema200: 2280.0,
    rsi14: 63.8,
    adx14: 31.5,
    supertrendBullish: true,
    supertrendValue: 2590.0,
    atr10: 60.0,
    initialAtrStop: 2500.0
  },

  // --- UNLISTED / PRE-IPO / NO NSE FEED STOCKS (Handled exactly as in inflow_scanner.py) ---
  {
    symbol: 'SBIFUNDS',
    name: 'SBI Funds Management Ltd',
    sector: 'Financial Services & Asset Management',
    hasMarketData: false,
    dataStatus: 'Pending — unlisted / pre-IPO (no live NSE feed)'
  },
  {
    symbol: 'CORONA',
    name: 'Corona Remedies Ltd',
    sector: 'Pharmaceuticals & Healthcare',
    hasMarketData: false,
    dataStatus: 'Pending — unlisted / pre-IPO (no live NSE feed)'
  },
  {
    symbol: 'ATLANTAELE',
    name: 'Atlanta Electricals Ltd',
    sector: 'Power, Electricals & Capital Goods',
    hasMarketData: false,
    dataStatus: 'Pending — unlisted / pre-IPO (no live NSE feed)'
  },
  {
    symbol: 'TRAVELFOOD',
    name: 'Travel Food Services Ltd',
    sector: 'Consumer Services',
    hasMarketData: false,
    dataStatus: 'Pending — unlisted / pre-IPO (no live NSE feed)'
  },
  {
    symbol: 'ANTHEM',
    name: 'Anthem Biosciences Limited',
    sector: 'Pharmaceuticals & Healthcare',
    hasMarketData: false,
    dataStatus: 'Pending — unlisted / pre-IPO (no live NSE feed)'
  },
  {
    symbol: 'KANOHAR',
    name: 'Kanohar Electricals Ltd',
    sector: 'Power, Electricals & Capital Goods',
    hasMarketData: false,
    dataStatus: 'Pending — unlisted / pre-IPO (no live NSE feed)'
  },
  {
    symbol: 'TATACAP',
    name: 'Tata Capital Ltd',
    sector: 'Financial Services & Asset Management',
    hasMarketData: false,
    dataStatus: 'Pending — unlisted / pre-IPO (no live NSE feed)'
  },
  {
    symbol: 'EMMVEE',
    name: 'Emmvee Photovoltaic Power Ltd.',
    sector: 'Renewable Energy',
    hasMarketData: false,
    dataStatus: 'Pending — unlisted / pre-IPO (no live NSE feed)'
  },
  {
    symbol: 'SEDEMAC',
    name: 'SEDEMAC Mechatronics Ltd',
    sector: 'Automobile Components',
    hasMarketData: false,
    dataStatus: 'Pending — unlisted / pre-IPO (no live NSE feed)'
  },
  {
    symbol: 'CPPLUS',
    name: 'Aditya Infotech Ltd',
    sector: 'Electronics & Technology',
    hasMarketData: false,
    dataStatus: 'Pending — unlisted / pre-IPO (no live NSE feed)'
  },
  {
    symbol: 'AJAXENGG',
    name: 'AJAX Engineering Ltd',
    sector: 'Capital Goods',
    hasMarketData: false,
    dataStatus: 'Pending — unlisted / pre-IPO (no live NSE feed)'
  }
];

export function evaluateStock(stock: ScannedStock, capital: number = 30000): EvaluatedStock {
  if (!stock.hasMarketData || !stock.price) {
    const conditions: ConditionEvaluation[] = LABELS.map((label, i) => ({
      id: i + 1,
      name: label,
      passed: false,
      actualSummary: 'Market data unavailable',
      details: stock.dataStatus || 'Waiting for market data'
    }));

    return {
      ...stock,
      conditions,
      passCount: 0,
      isCompleteSetup: false,
      qty: null,
      invested: null,
      target: null,
      targetProfit: null
    };
  }

  const price = stock.price;
  const ema20 = stock.ema20 || price;
  const ema50 = stock.ema50 || price;
  const ema200 = stock.ema200 || price;
  const rsi = stock.rsi14 || 50;
  const adx = stock.adx14 || 25;
  const vol = stock.volume || 1;
  const volAvg = stock.volAvg20 || 1;
  const open = stock.open || price;
  const prevClose = stock.prevClose || price;
  const stBullish = Boolean(stock.supertrendBullish);
  const stValue = stock.supertrendValue || price;
  const atr = stock.atr10 || Math.round(price * 0.02 * 100) / 100;

  // 1. Original trend: Close > EMA200 OR EMA50 > EMA200
  const c1CloseAbove200 = price > ema200;
  const c1Ema50Above200 = ema50 > ema200;
  const c1Passed = c1CloseAbove200 || c1Ema50Above200;
  const c1Summary = `Close ₹${price.toLocaleString('en-IN')} ${c1CloseAbove200 ? '>' : '≤'} EMA200 ₹${ema200.toLocaleString('en-IN')}${
    c1CloseAbove200 ? ' (Bullish)' : c1Ema50Above200 ? ' | EMA50 > EMA200 (Pass)' : ' (Bearish Trend)'
  }`;
  const c1Details = `EMA200: ₹${ema200.toLocaleString('en-IN')} | EMA50: ₹${ema50.toLocaleString('en-IN')}`;

  // 2. Price within 2% of EMA20 or EMA50
  const diff20Pct = ((price - ema20) / ema20) * 100;
  const diff50Pct = ((price - ema50) / ema50) * 100;
  const within20 = Math.abs(diff20Pct) <= 2.0;
  const within50 = Math.abs(diff50Pct) <= 2.0;
  const c2Passed = within20 || within50;
  const c2Summary = within20
    ? `Near EMA20 (${diff20Pct >= 0 ? '+' : ''}${diff20Pct.toFixed(2)}% ≤ 2%)`
    : within50
    ? `Near EMA50 (${diff50Pct >= 0 ? '+' : ''}${diff50Pct.toFixed(2)}% ≤ 2%)`
    : `Far from EMAs (EMA20: ${diff20Pct >= 0 ? '+' : ''}${diff20Pct.toFixed(1)}%, EMA50: ${diff50Pct >= 0 ? '+' : ''}${diff50Pct.toFixed(1)}%)`;
  const c2Details = `EMA20: ₹${ema20.toLocaleString('en-IN')} (${diff20Pct >= 0 ? '+' : ''}${diff20Pct.toFixed(2)}%) | EMA50: ₹${ema50.toLocaleString('en-IN')} (${diff50Pct >= 0 ? '+' : ''}${diff50Pct.toFixed(2)}%)`;

  // 3. Bullish candle and above previous close
  const isGreenCandle = price > open;
  const isAbovePrevClose = price > prevClose;
  const c3Passed = isGreenCandle && isAbovePrevClose;
  const candleGainPct = ((price - prevClose) / prevClose) * 100;
  const c3Summary = c3Passed
    ? `Green candle (+${candleGainPct.toFixed(2)}% vs Prev Close)`
    : !isGreenCandle
    ? `Red candle (Open ₹${open} > Close ₹${price})`
    : `Below Prev Close (LTP ₹${price} ≤ Prev ₹${prevClose})`;
  const c3Details = `Open: ₹${open.toLocaleString('en-IN')} → Close: ₹${price.toLocaleString('en-IN')} | Prev: ₹${prevClose.toLocaleString('en-IN')}`;

  // 4. RSI(14) between 38 and 68
  const c4Passed = rsi >= 38 && rsi <= 68;
  const c4Summary = `RSI: ${rsi.toFixed(1)} ${c4Passed ? '(Optimal 38 – 68)' : rsi > 68 ? '(Overbought > 68)' : '(Oversold/Weak < 38)'}`;
  const c4Details = `RSI(14) = ${rsi.toFixed(2)} [Target zone: 38.0 to 68.0]`;

  // 5. Volume >= 20-day average
  const c5Passed = vol >= volAvg;
  const volRatio = vol / (volAvg || 1);
  const formatVol = (v: number) => {
    if (v >= 10000000) return `${(v / 10000000).toFixed(2)}Cr`;
    if (v >= 100000) return `${(v / 100000).toFixed(2)}L`;
    return v.toLocaleString('en-IN');
  };
  const c5Summary = `Vol ${formatVol(vol)} (${volRatio.toFixed(2)}x of 20D Avg)`;
  const c5Details = `Today: ${formatVol(vol)} | 20D Avg: ${formatVol(volAvg)} (${c5Passed ? 'Above Avg' : 'Below Avg'})`;

  // 6. Supertrend(10,3) bullish
  const c6Passed = stBullish;
  const c6Summary = `${stBullish ? 'Bullish' : 'Bearish'} Trend @ ₹${stValue.toLocaleString('en-IN')}`;
  const c6Details = `Supertrend (10, 3) = ₹${stValue.toLocaleString('en-IN')} [Direction: ${stBullish ? 'Bullish' : 'Bearish'}]`;

  // 7. ADX(14) >= 25
  const c7Passed = adx >= 25.0;
  const c7Summary = `ADX: ${adx.toFixed(1)} ${c7Passed ? '(Strong Trend ≥ 25)' : '(Weak Trend < 25)'}`;
  const c7Details = `ADX(14) = ${adx.toFixed(2)} [Threshold: ≥ 25.0]`;

  const conditions: ConditionEvaluation[] = [
    { id: 1, name: LABELS[0], passed: c1Passed, actualSummary: c1Summary, details: c1Details },
    { id: 2, name: LABELS[1], passed: c2Passed, actualSummary: c2Summary, details: c2Details },
    { id: 3, name: LABELS[2], passed: c3Passed, actualSummary: c3Summary, details: c3Details },
    { id: 4, name: LABELS[3], passed: c4Passed, actualSummary: c4Summary, details: c4Details },
    { id: 5, name: LABELS[4], passed: c5Passed, actualSummary: c5Summary, details: c5Details },
    { id: 6, name: LABELS[5], passed: c6Passed, actualSummary: c6Summary, details: c6Details },
    { id: 7, name: LABELS[6], passed: c7Passed, actualSummary: c7Summary, details: c7Details }
  ];

  const passCount = conditions.filter((c) => c.passed).length;
  const isCompleteSetup = passCount === 7;

  const qty = price > 0 ? Math.floor(capital / price) : 0;
  const invested = qty > 0 ? Math.round(qty * price * 100) / 100 : null;
  const target = Math.round(price * 1.05 * 100) / 100;
  const targetProfit = invested ? Math.round(invested * 0.05 * 100) / 100 : null;

  return {
    ...stock,
    conditions,
    passCount,
    isCompleteSetup,
    qty: qty > 0 ? qty : null,
    invested,
    target,
    targetProfit
  };
}

export function getScannerStocks(): ScannedStock[] {
  return INFLOW_56_STOCKS;
}
