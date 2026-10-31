import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AppData,
  RunWalkEntry,
  HabitItem,
  QuickNote,
  DiaryEntry,
  LiabilityAssetItem,
  SavingBankItem,
  SalaryEntry,
  BucketPlace,
  Plan,
  PlanItem,
  MonthlyExpenseItem,
  GraphicJob,
  GraphicCustomer,
  InflowHolding,
  Trade5Pct,
  SkillSentence,
  SpecialDay,
  HealthLog
} from '../types';
import {
  StorageService,
  GraphicZoneService,
  TradeService,
  GoogleDriveService
} from '../services';
import { getLocalDateString, getLocalDateTimeString } from '../utils/dateUtils';

interface AppContextType {
  data: AppData;
  exportBackupJSON: () => void;
  backupToGoogleDrive: () => Promise<{ success: boolean; message: string; link?: string }>;
  importBackupJSON: (file: File) => Promise<boolean>;
  resetToDefaults: () => void;

  // Run Walk
  saveRunWalkEntry: (date: string, distance: number, duration?: number, notes?: string) => void;
  deleteRunWalkEntry: (id: string) => void;

  // Habits
  addHabit: (title: string) => void;
  toggleHabitStatus: (habitId: string, dateStr: string) => void;
  deleteHabit: (habitId: string) => void;

  // Quick Notes
  addQuickNote: (content?: string) => QuickNote;
  updateQuickNote: (id: string, content: string) => void;
  deleteQuickNote: (id: string) => void;

  // Diary
  saveDiaryEntry: (entry: Omit<DiaryEntry, 'id'>, existingId?: string) => void;
  deleteDiaryEntry: (id: string) => void;

  // Liability & Assets
  saveLiabilityAsset: (item: Omit<LiabilityAssetItem, 'id'>, existingId?: string) => void;
  deleteLiabilityAsset: (id: string) => void;

  // Saving Banks
  saveSavingBank: (bank: Omit<SavingBankItem, 'id'>, existingId?: string) => void;
  deleteSavingBank: (id: string) => void;

  // Salary
  saveSalaryEntry: (salary: Omit<SalaryEntry, 'id'>, existingId?: string) => void;
  deleteSalaryEntry: (id: string) => void;

  // Bucket List
  saveBucketPlace: (place: Omit<BucketPlace, 'id'>, existingId?: string) => void;
  deleteBucketPlace: (id: string) => void;

  // Planning
  createNewPlan: (planName: string) => void;
  createMonthlyPlan: (plan: { name: string; budget: number; startDate: string; endDate?: string; totalDays?: number }) => void;
  renamePlan: (planId: string, newName: string) => void;
  updateMonthlyPlanSettings: (planId: string, settings: { name?: string; budget?: number; startDate?: string; endDate?: string; totalDays?: number }) => void;
  deletePlan: (planId: string) => void;
  savePlanItem: (planId: string, item: Omit<PlanItem, 'id'>, existingId?: string) => void;
  togglePlanItemTick: (planId: string, itemId: string) => void;
  deletePlanItem: (planId: string, itemId: string) => void;
  saveMonthlyExpense: (planId: string, expense: Omit<MonthlyExpenseItem, 'id'>, existingId?: string) => void;
  deleteMonthlyExpense: (planId: string, expenseId: string) => void;

  // Graphic Zone
  saveGraphicJob: (job: Omit<GraphicJob, 'id' | 'jobNo' | 'totalAmount' | 'balanceDue' | 'estimatedProfit'> & { id?: string; jobNo?: string }) => void;
  markGraphicJobDelivered: (id: string) => void;
  cancelGraphicJob: (id: string) => void;
  deleteGraphicJob: (id: string) => void;
  getGraphicCustomers: () => GraphicCustomer[];

  // Inflow Portfolio
  saveInflowHolding: (holding: Omit<InflowHolding, 'id'>, existingId?: string) => void;
  deleteInflowHolding: (id: string) => void;

  // 5% Club
  saveTrade: (trade: Omit<Trade5Pct, 'id'>, existingId?: string) => void;
  deleteTrade: (id: string) => void;

  // Skills
  saveSkillSentence: (sentence: Omit<SkillSentence, 'id'>, existingId?: string) => void;
  deleteSkillSentence: (id: string) => void;

  // Special Days
  saveSpecialDay: (day: Omit<SpecialDay, 'id'>, existingId?: string) => void;
  deleteSpecialDay: (id: string) => void;

  // Health
  saveHealthLog: (log: Omit<HealthLog, 'id'>, existingId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => StorageService.loadAppData());

  useEffect(() => {
    StorageService.syncWithCloud().then(cloudData => {
      setData(cloudData);
    }).catch(err => console.error('Cloud sync err:', err));
  }, []);

  /**
   * Pure state updater helper that keeps StorageService calls outside React state updaters.
   */
  const updateAppData = (updater: (prev: AppData) => AppData) => {
    setData(prev => {
      const nextData = updater(prev);
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const exportBackupJSON = () => {
    StorageService.exportBackup(data);
  };

  const backupToGoogleDrive = async (): Promise<{ success: boolean; message: string; link?: string }> => {
    const res = await GoogleDriveService.uploadBackupToDrive(data, 'inflow2036_Backups');
    if (res.success) {
      return {
        success: true,
        message: `✅ Backup uploaded successfully to Google Drive folder 'inflow2036_Backups' as '${res.fileName}'`,
        link: res.webViewLink
      };
    } else {
      return {
        success: false,
        message: `❌ Failed to save backup to Google Drive: ${res.error || 'Unknown error'}`
      };
    }
  };

  const importBackupJSON = async (file: File): Promise<boolean> => {
    const imported = await StorageService.importBackup(file);
    if (imported) {
      setData(imported);
      return true;
    }
    return false;
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all data to default?')) {
      const defaults = StorageService.resetToDefaults();
      setData(defaults);
    }
  };

  // ================= RUN WALK =================
  const saveRunWalkEntry = (date: string, distance: number, duration?: number, notes?: string) => {
    updateAppData(prev => {
      const existingIdx = prev.runWalk.findIndex(e => e.date === date);
      let updatedRunWalk = [...prev.runWalk];
      if (existingIdx >= 0) {
        updatedRunWalk[existingIdx] = {
          ...updatedRunWalk[existingIdx],
          distance,
          duration: duration !== undefined ? duration : updatedRunWalk[existingIdx].duration,
          notes: notes !== undefined ? notes : updatedRunWalk[existingIdx].notes
        };
      } else {
        const newEntry: RunWalkEntry = {
          id: `rw_${Date.now()}`,
          date,
          distance,
          duration,
          notes
        };
        updatedRunWalk = [newEntry, ...updatedRunWalk];
      }
      return { ...prev, runWalk: updatedRunWalk };
    });
  };

  const deleteRunWalkEntry = (id: string) => {
    updateAppData(prev => ({ ...prev, runWalk: prev.runWalk.filter(e => e.id !== id) }));
  };

  // ================= HABITS =================
  const addHabit = (title: string) => {
    if (!title.trim()) return;
    const newHabit: HabitItem = {
      id: `h_${Date.now()}`,
      title: title.trim(),
      dateCreated: getLocalDateString(),
      logs: {}
    };
    updateAppData(prev => ({ ...prev, habits: [...prev.habits, newHabit] }));
  };

  const toggleHabitStatus = (habitId: string, dateStr: string) => {
    updateAppData(prev => {
      const updated = prev.habits.map(h => {
        if (h.id !== habitId) return h;
        const current = h.logs[dateStr] || '';
        let next: '✅' | '❌' | '' = '✅';
        if (current === '✅') next = '❌';
        else if (current === '❌') next = '';
        const newLogs = { ...h.logs };
        if (next === '') {
          delete newLogs[dateStr];
        } else {
          newLogs[dateStr] = next;
        }
        return { ...h, logs: newLogs };
      });
      return { ...prev, habits: updated };
    });
  };

  const deleteHabit = (habitId: string) => {
    updateAppData(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== habitId) }));
  };

  // ================= QUICK NOTES =================
  const addQuickNote = (content = ''): QuickNote => {
    const nowStr = getLocalDateTimeString();
    const newNote: QuickNote = {
      id: `qn_${Date.now()}`,
      content,
      dateTimeStr: nowStr,
      lastModified: nowStr
    };
    updateAppData(prev => ({ ...prev, quickNotes: [newNote, ...prev.quickNotes] }));
    return newNote;
  };

  const updateQuickNote = (id: string, content: string) => {
    const nowStr = getLocalDateTimeString();
    updateAppData(prev => ({
      ...prev,
      quickNotes: prev.quickNotes.map(n => n.id === id ? { ...n, content, lastModified: nowStr } : n)
    }));
  };

  const deleteQuickNote = (id: string) => {
    updateAppData(prev => ({ ...prev, quickNotes: prev.quickNotes.filter(n => n.id !== id) }));
  };

  // ================= DIARY =================
  const saveDiaryEntry = (entry: Omit<DiaryEntry, 'id'>, existingId?: string) => {
    const now = new Date().toISOString();
    updateAppData(prev => {
      let updatedDiary = [...prev.diary];
      if (existingId) {
        updatedDiary = updatedDiary.map(d => d.id === existingId ? { ...entry, id: existingId, lastModified: now } : d);
      } else {
        const newD: DiaryEntry = { ...entry, id: `d_${Date.now()}`, lastModified: now };
        updatedDiary = [newD, ...updatedDiary];
      }
      return { ...prev, diary: updatedDiary };
    });
  };

  const deleteDiaryEntry = (id: string) => {
    updateAppData(prev => ({ ...prev, diary: prev.diary.filter(d => d.id !== id) }));
  };

  // ================= LIABILITY & ASSETS =================
  const saveLiabilityAsset = (item: Omit<LiabilityAssetItem, 'id'>, existingId?: string) => {
    updateAppData(prev => {
      let updated = [...prev.liabilityAssets];
      if (existingId) {
        updated = updated.map(a => a.id === existingId ? { ...item, id: existingId } : a);
      } else {
        updated.push({ ...item, id: `la_${Date.now()}` });
      }
      return { ...prev, liabilityAssets: updated };
    });
  };

  const deleteLiabilityAsset = (id: string) => {
    updateAppData(prev => ({ ...prev, liabilityAssets: prev.liabilityAssets.filter(a => a.id !== id) }));
  };

  // ================= SAVING BANKS =================
  const saveSavingBank = (bank: Omit<SavingBankItem, 'id'>, existingId?: string) => {
    updateAppData(prev => {
      let updated = [...prev.savingBanks];
      if (existingId) {
        updated = updated.map(b => b.id === existingId ? { ...bank, id: existingId } : b);
      } else {
        updated.push({ ...bank, id: `sb_${Date.now()}` });
      }
      return { ...prev, savingBanks: updated };
    });
  };

  const deleteSavingBank = (id: string) => {
    updateAppData(prev => ({ ...prev, savingBanks: prev.savingBanks.filter(b => b.id !== id) }));
  };

  // ================= SALARY =================
  const saveSalaryEntry = (salary: Omit<SalaryEntry, 'id'>, existingId?: string) => {
    updateAppData(prev => {
      let updated = [...prev.salaries];
      if (existingId) {
        updated = updated.map(s => s.id === existingId ? { ...salary, id: existingId } : s);
      } else {
        updated = [
          { ...salary, id: `sc_${Date.now()}` },
          ...updated.filter(s => !(s.year === salary.year && s.month === salary.month))
        ];
      }
      return { ...prev, salaries: updated };
    });
  };

  const deleteSalaryEntry = (id: string) => {
    updateAppData(prev => ({ ...prev, salaries: prev.salaries.filter(s => s.id !== id) }));
  };

  // ================= BUCKET LIST =================
  const saveBucketPlace = (place: Omit<BucketPlace, 'id'>, existingId?: string) => {
    updateAppData(prev => {
      let updated = [...prev.bucketList];
      if (existingId) {
        updated = updated.map(b => b.id === existingId ? { ...place, id: existingId } : b);
      } else {
        updated = [{ ...place, id: `bl_${Date.now()}` }, ...updated];
      }
      return { ...prev, bucketList: updated };
    });
  };

  const deleteBucketPlace = (id: string) => {
    updateAppData(prev => ({ ...prev, bucketList: prev.bucketList.filter(b => b.id !== id) }));
  };

  // ================= PLANNING =================
  const createNewPlan = (planName: string) => {
    if (!planName.trim()) return;
    const newPlan: Plan = {
      id: `plan_${Date.now()}`,
      name: planName.trim(),
      items: [],
      planType: 'standard'
    };
    updateAppData(prev => ({ ...prev, plans: [newPlan, ...prev.plans] }));
  };

  const createMonthlyPlan = (planInput: { name: string; budget: number; startDate: string; endDate?: string; totalDays?: number }) => {
    if (!planInput.name.trim()) return;
    const newPlan: Plan = {
      id: `plan_monthly_${Date.now()}`,
      name: planInput.name.trim(),
      items: [],
      planType: 'monthly',
      budget: Number(planInput.budget) || 0,
      startDate: planInput.startDate || new Date().toISOString().split('T')[0],
      endDate: planInput.endDate,
      totalDays: Number(planInput.totalDays) > 0 ? Number(planInput.totalDays) : 30,
      monthlyExpenses: []
    };
    updateAppData(prev => ({ ...prev, plans: [newPlan, ...prev.plans] }));
  };

  const updateMonthlyPlanSettings = (planId: string, settings: { name?: string; budget?: number; startDate?: string; endDate?: string; totalDays?: number }) => {
    updateAppData(prev => ({
      ...prev,
      plans: prev.plans.map(p => {
        if (p.id !== planId) return p;
        return {
          ...p,
          name: settings.name !== undefined ? settings.name.trim() : p.name,
          budget: settings.budget !== undefined ? Number(settings.budget) : p.budget,
          startDate: settings.startDate !== undefined ? settings.startDate : p.startDate,
          endDate: settings.endDate !== undefined ? settings.endDate : p.endDate,
          totalDays: settings.totalDays !== undefined ? Number(settings.totalDays) : p.totalDays
        };
      })
    }));
  };

  const renamePlan = (planId: string, newName: string) => {
    updateAppData(prev => ({
      ...prev,
      plans: prev.plans.map(p => p.id === planId ? { ...p, name: newName.trim() } : p)
    }));
  };

  const deletePlan = (planId: string) => {
    updateAppData(prev => ({ ...prev, plans: prev.plans.filter(p => p.id !== planId) }));
  };

  const savePlanItem = (planId: string, item: Omit<PlanItem, 'id'>, existingId?: string) => {
    updateAppData(prev => ({
      ...prev,
      plans: prev.plans.map(p => {
        if (p.id !== planId) return p;
        if (existingId) {
          return {
            ...p,
            items: p.items.map(it => it.id === existingId ? { ...item, id: existingId } : it)
          };
        }
        return {
          ...p,
          items: [...p.items, { ...item, id: `pi_${Date.now()}` }]
        };
      })
    }));
  };

  const togglePlanItemTick = (planId: string, itemId: string) => {
    updateAppData(prev => ({
      ...prev,
      plans: prev.plans.map(p => {
        if (p.id !== planId) return p;
        return {
          ...p,
          items: p.items.map(it => it.id === itemId ? { ...it, ticked: !it.ticked } : it)
        };
      })
    }));
  };

  const deletePlanItem = (planId: string, itemId: string) => {
    updateAppData(prev => ({
      ...prev,
      plans: prev.plans.map(p => {
        if (p.id !== planId) return p;
        return {
          ...p,
          items: p.items.filter(it => it.id !== itemId)
        };
      })
    }));
  };

  const saveMonthlyExpense = (planId: string, expense: Omit<MonthlyExpenseItem, 'id'>, existingId?: string) => {
    updateAppData(prev => ({
      ...prev,
      plans: prev.plans.map(p => {
        if (p.id !== planId) return p;
        const currentExpenses = p.monthlyExpenses || [];
        if (existingId) {
          return {
            ...p,
            monthlyExpenses: currentExpenses.map(item => item.id === existingId ? { ...expense, id: existingId } : item)
          };
        }
        const newExpense: MonthlyExpenseItem = {
          ...expense,
          id: `me_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
        };
        return {
          ...p,
          monthlyExpenses: [newExpense, ...currentExpenses]
        };
      })
    }));
  };

  const deleteMonthlyExpense = (planId: string, expenseId: string) => {
    updateAppData(prev => ({
      ...prev,
      plans: prev.plans.map(p => {
        if (p.id !== planId) return p;
        return {
          ...p,
          monthlyExpenses: (p.monthlyExpenses || []).filter(item => item.id !== expenseId)
        };
      })
    }));
  };

  // ================= GRAPHIC ZONE =================
  const saveGraphicJob = (jobInput: Omit<GraphicJob, 'id' | 'jobNo' | 'totalAmount' | 'balanceDue' | 'estimatedProfit'> & { id?: string; jobNo?: string }) => {
    updateAppData(prev => {
      const financials = GraphicZoneService.calculateJobFinancials(
        jobInput.qty,
        jobInput.rate,
        jobInput.paid,
        jobInput.printCost,
        jobInput.otherCost
      );

      let updatedJobs = [...prev.graphicJobs];
      if (jobInput.id) {
        updatedJobs = updatedJobs.map(j => {
          if (j.id !== jobInput.id) return j;
          return {
            ...j,
            ...jobInput,
            id: jobInput.id,
            jobNo: jobInput.jobNo || j.jobNo,
            ...financials
          };
        });
      } else {
        const jobNo = jobInput.jobNo || GraphicZoneService.getNextJobNumber(updatedJobs);
        const newJob: GraphicJob = {
          ...jobInput,
          id: `gj_${Date.now()}`,
          jobNo,
          ...financials
        };
        updatedJobs = [newJob, ...updatedJobs];
      }
      return { ...prev, graphicJobs: updatedJobs };
    });
  };

  const markGraphicJobDelivered = (id: string) => {
    updateAppData(prev => ({
      ...prev,
      graphicJobs: prev.graphicJobs.map(j => j.id === id ? { ...j, status: 'Delivered' as const } : j)
    }));
  };

  const cancelGraphicJob = (id: string) => {
    updateAppData(prev => ({
      ...prev,
      graphicJobs: prev.graphicJobs.map(j => j.id === id ? { ...j, status: 'Cancel' as const } : j)
    }));
  };

  const deleteGraphicJob = (id: string) => {
    updateAppData(prev => ({ ...prev, graphicJobs: prev.graphicJobs.filter(j => j.id !== id) }));
  };

  const getGraphicCustomers = (): GraphicCustomer[] => {
    return GraphicZoneService.buildCustomerDirectory(data.graphicJobs);
  };

  // ================= INFLOW PORTFOLIO =================
  const saveInflowHolding = (holding: Omit<InflowHolding, 'id'>, existingId?: string) => {
    updateAppData(prev => {
      let updated = [...prev.inflowHoldings];
      if (existingId) {
        updated = updated.map(h => h.id === existingId ? { ...holding, id: existingId } : h);
      } else {
        updated.push({ ...holding, id: `inf_${Date.now()}` });
      }
      return { ...prev, inflowHoldings: updated };
    });
  };

  const deleteInflowHolding = (id: string) => {
    updateAppData(prev => ({ ...prev, inflowHoldings: prev.inflowHoldings.filter(h => h.id !== id) }));
  };

  // ================= 5% CLUB TRADES =================
  const saveTrade = (trade: Omit<Trade5Pct, 'id'>, existingId?: string) => {
    updateAppData(prev => {
      const financials = TradeService.calculateTradeFinancials(
        trade.investment,
        trade.exitPct || 0,
        trade.brokerCharges || 0,
        trade.isExited
      );
      const holdingDays = TradeService.calculateHoldingDays(trade.entryDate, trade.exitDate, trade.isExited);

      const calculatedTrade: Omit<Trade5Pct, 'id'> = {
        ...trade,
        ...financials,
        holdingDays
      };

      let updated = [...prev.trades];
      if (existingId) {
        updated = updated.map(t => t.id === existingId ? { ...calculatedTrade, id: existingId } : t);
      } else {
        updated = [{ ...calculatedTrade, id: `tr_${Date.now()}` }, ...updated];
      }
      return { ...prev, trades: updated };
    });
  };

  const deleteTrade = (id: string) => {
    updateAppData(prev => ({ ...prev, trades: prev.trades.filter(t => t.id !== id) }));
  };

  // ================= SKILLS =================
  const saveSkillSentence = (sentence: Omit<SkillSentence, 'id'>, existingId?: string) => {
    updateAppData(prev => {
      let updated = [...prev.skills];
      if (existingId) {
        updated = updated.map(s => s.id === existingId ? { ...sentence, id: existingId } : s);
      } else {
        updated.push({ ...sentence, id: `sk_${Date.now()}` });
      }
      return { ...prev, skills: updated };
    });
  };

  const deleteSkillSentence = (id: string) => {
    updateAppData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
  };

  // ================= SPECIAL DAYS =================
  const saveSpecialDay = (day: Omit<SpecialDay, 'id'>, existingId?: string) => {
    updateAppData(prev => {
      let updated = [...prev.specialDays];
      if (existingId) {
        updated = updated.map(sd => sd.id === existingId ? { ...day, id: existingId } : sd);
      } else {
        updated.push({ ...day, id: `sd_${Date.now()}` });
      }
      return { ...prev, specialDays: updated };
    });
  };

  const deleteSpecialDay = (id: string) => {
    updateAppData(prev => ({ ...prev, specialDays: prev.specialDays.filter(sd => sd.id !== id) }));
  };

  // ================= HEALTH =================
  const saveHealthLog = (log: Omit<HealthLog, 'id'>, existingId?: string) => {
    updateAppData(prev => {
      let updated = [...prev.health];
      if (existingId) {
        updated = updated.map(h => h.id === existingId ? { ...log, id: existingId } : h);
      } else {
        const existingDateIdx = updated.findIndex(h => h.date === log.date);
        if (existingDateIdx >= 0) {
          updated[existingDateIdx] = { ...log, id: updated[existingDateIdx].id };
        } else {
          updated = [{ ...log, id: `hl_${Date.now()}` }, ...updated];
        }
      }
      return { ...prev, health: updated };
    });
  };

  return (
    <AppContext.Provider
      value={{
        data,
        exportBackupJSON,
        backupToGoogleDrive,
        importBackupJSON,
        resetToDefaults,

        saveRunWalkEntry,
        deleteRunWalkEntry,

        addHabit,
        toggleHabitStatus,
        deleteHabit,

        addQuickNote,
        updateQuickNote,
        deleteQuickNote,

        saveDiaryEntry,
        deleteDiaryEntry,

        saveLiabilityAsset,
        deleteLiabilityAsset,

        saveSavingBank,
        deleteSavingBank,

        saveSalaryEntry,
        deleteSalaryEntry,

        saveBucketPlace,
        deleteBucketPlace,

        createNewPlan,
        createMonthlyPlan,
        renamePlan,
        updateMonthlyPlanSettings,
        deletePlan,
        savePlanItem,
        togglePlanItemTick,
        deletePlanItem,
        saveMonthlyExpense,
        deleteMonthlyExpense,

        saveGraphicJob,
        markGraphicJobDelivered,
        cancelGraphicJob,
        deleteGraphicJob,
        getGraphicCustomers,

        saveInflowHolding,
        deleteInflowHolding,

        saveTrade,
        deleteTrade,

        saveSkillSentence,
        deleteSkillSentence,

        saveSpecialDay,
        deleteSpecialDay,

        saveHealthLog
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
