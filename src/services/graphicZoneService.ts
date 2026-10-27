import { GraphicJob, GraphicCustomer } from '../types';

export class GraphicZoneService {
  static TARGET_AMOUNT = 300000;
  static POINT_VALUE = 250;

  static getNextJobNumber(jobs: GraphicJob[]): string {
    let max = 300;
    jobs.forEach(j => {
      const match = String(j.jobNo || '').trim().match(/^G\s*(\d+)$/i);
      if (match) {
        const val = parseInt(match[1], 10);
        if (val > max) max = val;
      }
    });
    return `G${max + 1}`;
  }

  static calculateJobFinancials(qty: number, rate: number, paid: number, printCost: number, otherCost: number) {
    const totalAmount = Math.round((Number(qty || 0) * Number(rate || 0)) * 100) / 100;
    const balanceDue = Math.max(0, Math.round((totalAmount - Number(paid || 0)) * 100) / 100);
    const estimatedProfit = Math.round((Number(paid || 0) - Number(printCost || 0) - Number(otherCost || 0)) * 100) / 100;
    return {
      totalAmount,
      balanceDue,
      estimatedProfit
    };
  }

  static calculateTargetPoints(deliveredProfit: number) {
    const pointsEarned = Math.round((deliveredProfit / this.POINT_VALUE) * 100) / 100;
    const remaining = Math.max(0, this.TARGET_AMOUNT - deliveredProfit);
    const pointsNeeded = Math.round((remaining / this.POINT_VALUE) * 100) / 100;
    const percentage = Math.min(100, Math.round((deliveredProfit / this.TARGET_AMOUNT) * 1000) / 10);
    return {
      pointsEarned,
      pointsNeeded,
      remaining,
      percentage
    };
  }

  static buildCustomerDirectory(jobs: GraphicJob[]): GraphicCustomer[] {
    const map: Record<string, GraphicCustomer> = {};

    jobs.forEach(j => {
      const name = (j.customerName || '').trim();
      if (!name) return;
      const key = name.toLowerCase();

      if (!map[key]) {
        map[key] = {
          name,
          place: j.place || '',
          phone: j.phone || '',
          totalOrders: 0,
          totalBusiness: 0,
          totalPaid: 0,
          balanceDue: 0,
          lastOrderDate: ''
        };
      }

      const c = map[key];
      if (j.place) c.place = j.place;
      if (j.phone) c.phone = j.phone;
      if (j.status === 'Cancel') return;

      c.totalOrders += 1;
      c.totalBusiness += j.totalAmount;
      c.totalPaid += j.paid;
      c.balanceDue += j.balanceDue;

      if (!c.lastOrderDate || j.date > c.lastOrderDate) {
        c.lastOrderDate = j.date;
      }
    });

    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  }
}
