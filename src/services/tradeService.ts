import { Trade5Pct } from '../types';

export class TradeService {
  static calculateTradeFinancials(investment: number, exitPct: number, brokerCharges: number, isExited: boolean) {
    const inv = Number(investment) || 0;
    const pct = isExited ? Number(exitPct) || 0 : 0;
    const charges = Number(brokerCharges) || 0;
    const grossPnl = isExited ? Math.round(((inv * pct) / 100) * 100) / 100 : 0;
    const netPnl = isExited ? Math.round((grossPnl - charges) * 100) / 100 : 0;

    return {
      grossPnl,
      netPnl,
      brokerCharges: charges
    };
  }

  static calculateHoldingDays(entryDate: string, exitDate?: string, isExited = false): number {
    if (!entryDate) return 0;
    const entry = new Date(`${entryDate}T00:00:00`).getTime();
    const end = isExited && exitDate ? new Date(`${exitDate}T00:00:00`).getTime() : new Date().getTime();
    return Math.max(0, Math.round((end - entry) / (1000 * 60 * 60 * 24)));
  }

  static calculateSummary(trades: Trade5Pct[]) {
    let profitCount = 0;
    let lossCount = 0;
    let totalProfit = 0;
    let totalLoss = 0;
    let totalCharges = 0;

    trades.forEach(t => {
      if (!t.isExited) return;
      const net = Number(t.netPnl || 0);
      const charges = Number(t.brokerCharges || 0);
      totalCharges += charges;
      if (net >= 0) {
        profitCount += 1;
        totalProfit += net;
      } else {
        lossCount += 1;
        totalLoss += Math.abs(net);
      }
    });

    return {
      profitCount,
      lossCount,
      totalProfit: Math.round(totalProfit * 100) / 100,
      totalLoss: Math.round(totalLoss * 100) / 100,
      totalCharges: Math.round(totalCharges * 100) / 100,
      netPnl: Math.round((totalProfit - totalLoss) * 100) / 100
    };
  }
}
