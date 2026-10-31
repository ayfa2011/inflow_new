/**
 * Service to connect directly to the live Inflow Scanner FastAPI backend deployed on Render:
 * https://inflow-scanner.onrender.com/api/scan
 */

export const RENDER_SCANNER_BASE_URL = 'https://inflow-scanner.onrender.com';

export interface BackendCondition {
  label: string;
  pass: boolean;
}

export interface InflowStockRow {
  stock: string; // e.g. "APOLLOHOSP"
  companyName: string;
  sector: string;
  matched: boolean;
  status: string;
  dataStatus: string;
  conditions: BackendCondition[];
  conditionPoints: number;
  conditionTotal: number;
  buyPrice: number | null;
  qty: number | null;
  investment: number | null;
  target: number | null;
  targetPct: number;
  targetProfit: number | null;
  rsi: number | null;
  supertrend: number | null;
  supertrendBullish: boolean | null;
  adx: number | null;
  atr10: number | null;
  initialAtrStop: number | null;
  volumeRatio?: number | null;
  setupScore: number;
}

export interface InflowScanResponse {
  status: 'success' | 'error';
  scanTime: string;
  totalMatches: number;
  data: InflowStockRow[];
  watchlist: InflowStockRow[];
  matches?: InflowStockRow[];
  mode: string;
  message?: string;
  diagnostics?: any;
}

const CACHE_KEY = 'inflow_scanner_render_cache_v1';

export async function fetchLiveScan(
  capital: number = 30000,
  mode: 'watchlist' | 'nifty100' | 'custom' = 'watchlist',
  symbols?: string
): Promise<{ response: InflowScanResponse; fromCache: boolean; error?: string }> {
  const url = new URL(`${RENDER_SCANNER_BASE_URL}/api/scan`);
  url.searchParams.set('capital', String(capital));
  url.searchParams.set('mode', mode);
  if (symbols && symbols.trim()) {
    url.searchParams.set('symbols', symbols.trim());
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 28000); // 28s timeout for Render free tier spin-up

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data: InflowScanResponse = await res.json();
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        return { response: data, fromCache: false };
      }
    }
  } catch (err: any) {
    console.warn('Render live scan fetch failed or timed out:', err);
  }

  // Fallback to local cache if available
  try {
    const cachedStr = localStorage.getItem(CACHE_KEY);
    if (cachedStr) {
      const cachedData: InflowScanResponse = JSON.parse(cachedStr);
      // recalculate qty and investment with new capital
      const updatedData = cachedData.data.map((row) => {
        const price = row.buyPrice;
        if (price && price > 0) {
          const qty = Math.floor(capital / price);
          const investment = qty > 0 ? Math.round(qty * price * 100) / 100 : null;
          const target = Math.round(price * 1.05 * 100) / 100;
          const targetProfit = investment ? Math.round(investment * 0.05 * 100) / 100 : null;
          return { ...row, qty: qty > 0 ? qty : null, investment, target, targetProfit };
        }
        return row;
      });
      return {
        response: { ...cachedData, data: updatedData, watchlist: updatedData },
        fromCache: true,
        error: 'Render server is booting up. Showing cached snapshot.'
      };
    }
  } catch (e) {
    // ignore
  }

  throw new Error('Unable to fetch scan data');
}
