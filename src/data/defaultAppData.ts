import { AppData } from '../types';
import { initialRunWalkData } from './runWalkData';
import { initialHabitsData } from './habitsData';
import { initialQuickNotesData } from './quickNotesData';
import { initialDiaryData } from './diaryData';
import { initialLiabilityAssetsData } from './liabilityAssetsData';
import { initialSavingBanksData } from './savingBanksData';
import { initialSalaryData } from './salaryData';
import { initialBucketListData } from './bucketListData';
import { initialPlanningData } from './planningData';
import { initialGraphicJobsData } from './graphicZoneData';
import { initialInflowHoldingsData } from './inflowHoldingsData';
import { initialTradesData } from './tradesData';
import { initialSkillsData } from './skillsData';
import { initialSpecialDaysData } from './specialDaysData';

export const defaultMasterAppData: AppData = {
  runWalk: initialRunWalkData,
  habits: initialHabitsData,
  quickNotes: initialQuickNotesData,
  diary: initialDiaryData,
  liabilityAssets: initialLiabilityAssetsData,
  savingBanks: initialSavingBanksData,
  salaries: initialSalaryData,
  bucketList: initialBucketListData,
  plans: initialPlanningData,
  graphicJobs: initialGraphicJobsData,
  inflowHoldings: initialInflowHoldingsData,
  trades: initialTradesData,
  skills: initialSkillsData,
  specialDays: initialSpecialDaysData,
  health: [
    {
      id: 'hl_1',
      date: '2026-10-26',
      waterLiters: 3.5,
      sleepHours: 7.5,
      workoutMinutes: 45,
      weightKg: 68.2,
      notes: 'Morning walk and healthy hydration'
    }
  ]
};
