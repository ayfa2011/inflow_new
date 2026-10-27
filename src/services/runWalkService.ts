import { RunWalkEntry } from '../types';

export interface RunWalkAverages {
  weeklyAvg: number;
  monthlyAvg: number;
  yearlyAvg: number;
}

export interface DayHistoryItem {
  dateStr: string;
  dayName: string;
  formatted: string;
  km: number;
  entry?: RunWalkEntry;
  isToday: boolean;
}

export class RunWalkService {
  static kannadaDays = ['ಭಾನುವಾರ', 'ಸೋಮವಾರ', 'ಮಂಗಳವಾರ', 'ಬುಧವಾರ', 'ಗುರುವಾರ', 'ಶುಕ್ರವಾರ', 'ಶನಿವಾರ'];
  static kannadaMonths = ['ಜನವರಿ', 'ಫೆಬ್ರವರಿ', 'ಮಾರ್ಚ್', 'ಏಪ್ರಿಲ್', 'ಮೇ', 'ಜೂನ್', 'ಜುಲೈ', 'ಆಗಸ್ಟ್', 'ಸೆಪ್ಟೆಂಬರ್', 'ಅಕ್ಟೋಬರ್', 'ನವೆಂಬರ್', 'ಡಿಸೆಂಬರ್'];

  static calculateAverages(entries: RunWalkEntry[], now = new Date()): RunWalkAverages {
    const parse = (str: string) => new Date(`${str}T00:00:00`);

    // Past 7 days
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const past7Km = entries
      .filter(x => {
        const d = parse(x.date);
        return d >= sevenDaysAgo && d <= now;
      })
      .reduce((s, x) => s + (Number(x.distance) || 0), 0);

    // Past 30 days
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const past30Km = entries
      .filter(x => {
        const d = parse(x.date);
        return d >= thirtyDaysAgo && d <= now;
      })
      .reduce((s, x) => s + (Number(x.distance) || 0), 0);

    // Current Year elapsed days
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const daysElapsed = Math.max(1, Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const thisYearKm = entries
      .filter(x => parse(x.date).getFullYear() === now.getFullYear())
      .reduce((s, x) => s + (Number(x.distance) || 0), 0);

    return {
      weeklyAvg: Math.round((past7Km / 7) * 10) / 10,
      monthlyAvg: Math.round((past30Km / 30) * 10) / 10,
      yearlyAvg: Math.round((thisYearKm / daysElapsed) * 10) / 10
    };
  }

  static getWeekHistory(entries: RunWalkEntry[], now = new Date()): DayHistoryItem[] {
    const pad = (n: number) => String(n).padStart(2, '0');
    const weekHistory: DayHistoryItem[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const dayName = this.kannadaDays[d.getDay()];
      const shortFormatted = `${d.getDate()} ${this.kannadaMonths[d.getMonth()]}`;
      const matches = entries.filter(x => x.date === dStr);
      const km = matches.reduce((s, x) => s + (Number(x.distance) || 0), 0);
      const primaryEntry = matches[0];

      weekHistory.push({
        dateStr: dStr,
        dayName,
        formatted: shortFormatted,
        km,
        entry: primaryEntry,
        isToday: i === 0
      });
    }

    return weekHistory;
  }
}
