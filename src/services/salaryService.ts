import { SalaryEntry } from '../types';

export class SalaryService {
  static calculateSalaryTotals(basic: number, allowance: number, ot: number, rate: number) {
    const totalAED = Math.round((Number(basic || 0) + Number(allowance || 0) + Number(ot || 0)) * 100) / 100;
    const totalINR = Math.round(totalAED * Number(rate || 0) * 100) / 100;
    return { totalAED, totalINR };
  }

  static calculateYearSummary(salaries: SalaryEntry[], year: number) {
    const yearEntries = salaries.filter(s => s.year === year);
    let totalAED = 0;
    let totalINR = 0;
    yearEntries.forEach(s => {
      totalAED += Number(s.totalAED || 0);
      totalINR += Number(s.totalINR || 0);
    });
    return {
      entries: yearEntries,
      totalAED: Math.round(totalAED * 100) / 100,
      totalINR: Math.round(totalINR * 100) / 100
    };
  }
}
