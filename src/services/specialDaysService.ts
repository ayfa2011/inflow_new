import { SpecialDay } from '../types';

export class SpecialDaysService {
  static calculateDaysRemaining(targetYMD: string, today = new Date()): number {
    if (!targetYMD) return 999;
    const base = new Date(today);
    base.setHours(0, 0, 0, 0);

    const parts = targetYMD.split('-');
    if (parts.length !== 3) return 999;

    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    let nextTarget = new Date(base.getFullYear(), month, day);
    nextTarget.setHours(0, 0, 0, 0);

    if (nextTarget < base) {
      nextTarget.setFullYear(base.getFullYear() + 1);
    }

    return Math.round((nextTarget.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));
  }

  static formatDateReadable(ymd: string): string {
    if (!ymd) return '';
    const parts = ymd.split('-');
    if (parts.length !== 3) return ymd;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mIdx = parseInt(parts[1], 10) - 1;
    return `${months[mIdx]} ${parseInt(parts[2], 10)}`;
  }

  static getSortedDaysWithRemaining(days: SpecialDay[], today = new Date()) {
    return days
      .map(d => ({
        ...d,
        daysLeft: this.calculateDaysRemaining(d.dateStr, today)
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }
}
