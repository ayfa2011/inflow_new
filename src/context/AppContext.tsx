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

const AUTH_KEY = 'inflow2036_auth_v1';
const DEFAULT_PASSWORD = 'shanu2';

interface AppContextType {
  data: AppData;
  isLocked: boolean;
  loginError: string;
  login: (pwd: string) => boolean;
  logout: () => void;
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
  renamePlan: (planId: string, newName: string) => void;
  deletePlan: (planId: string) => void;
  savePlanItem: (planId: string, item: Omit<PlanItem, 'id'>, existingId?: string) => void;
  togglePlanItemTick: (planId: string, itemId: string) => void;
  deletePlanItem: (planId: string, itemId: string) => void;

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

  const [isLocked, setIsLocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) !== 'unlocked';
    } catch {
      return true;
    }
  });

  const [loginError, setLoginError] = useState<string>('');

  const login = (pwd: string): boolean => {
    if (pwd === DEFAULT_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'unlocked');
      setIsLocked(false);
      setLoginError('');
      return true;
    }
    setLoginError('ತಪ್ಪು ಪಾಸ್‌ವರ್ಡ್ (Incorrect password)! ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ.');
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsLocked(true);
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
    const defaults = StorageService.resetToDefaults();
    setData(defaults);
  };

  // ================= RUN WALK =================
  const saveRunWalkEntry = (date: string, distance: number, duration?: number, notes?: string) => {
    setData(prev => {
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
      const nextData = { ...prev, runWalk: updatedRunWalk };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const deleteRunWalkEntry = (id: string) => {
    setData(prev => {
      const nextData = { ...prev, runWalk: prev.runWalk.filter(e => e.id !== id) };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  // ================= HABITS =================
  const addHabit = (title: string) => {
    if (!title.trim()) return;
    const newHabit: HabitItem = {
      id: `h_${Date.now()}`,
      title: title.trim(),
      dateCreated: new Date().toISOString().split('T')[0],
      logs: {}
    };
    setData(prev => {
      const nextData = { ...prev, habits: [...prev.habits, newHabit] };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const toggleHabitStatus = (habitId: string, dateStr: string) => {
    setData(prev => {
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
      const nextData = { ...prev, habits: updated };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const deleteHabit = (habitId: string) => {
    setData(prev => {
      const nextData = { ...prev, habits: prev.habits.filter(h => h.id !== habitId) };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  // ================= QUICK NOTES =================
  const addQuickNote = (content = ''): QuickNote => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const nowStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const newNote: QuickNote = {
      id: `qn_${Date.now()}`,
      content,
      dateTimeStr: nowStr,
      lastModified: nowStr
    };
    setData(prev => {
      const nextData = { ...prev, quickNotes: [newNote, ...prev.quickNotes] };
      StorageService.saveAppData(nextData);
      return nextData;
    });
    return newNote;
  };

  const updateQuickNote = (id: string, content: string) => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const nowStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    setData(prev => {
      const nextData = {
        ...prev,
        quickNotes: prev.quickNotes.map(n => n.id === id ? { ...n, content, lastModified: nowStr } : n)
      };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const deleteQuickNote = (id: string) => {
    setData(prev => {
      const nextData = { ...prev, quickNotes: prev.quickNotes.filter(n => n.id !== id) };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  // ================= DIARY =================
  const saveDiaryEntry = (entry: Omit<DiaryEntry, 'id'>, existingId?: string) => {
    const now = new Date().toISOString();
    setData(prev => {
      let updatedDiary = [...prev.diary];
      if (existingId) {
        updatedDiary = updatedDiary.map(d => d.id === existingId ? { ...entry, id: existingId, lastModified: now } : d);
      } else {
        const newD: DiaryEntry = { ...entry, id: `d_${Date.now()}`, lastModified: now };
        updatedDiary = [newD, ...updatedDiary];
      }
      const nextData = { ...prev, diary: updatedDiary };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const deleteDiaryEntry = (id: string) => {
    setData(prev => {
      const nextData = { ...prev, diary: prev.diary.filter(d => d.id !== id) };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  // ================= LIABILITY & ASSETS =================
  const saveLiabilityAsset = (item: Omit<LiabilityAssetItem, 'id'>, existingId?: string) => {
    setData(prev => {
      let updated = [...prev.liabilityAssets];
      if (existingId) {
        updated = updated.map(a => a.id === existingId ? { ...item, id: existingId } : a);
      } else {
        updated.push({ ...item, id: `la_${Date.now()}` });
      }
      const nextData = { ...prev, liabilityAssets: updated };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const deleteLiabilityAsset = (id: string) => {
    setData(prev => {
      const nextData = { ...prev, liabilityAssets: prev.liabilityAssets.filter(a => a.id !== id) };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  // ================= SAVING BANKS =================
  const saveSavingBank = (bank: Omit<SavingBankItem, 'id'>, existingId?: string) => {
    setData(prev => {
      let updated = [...prev.savingBanks];
      if (existingId) {
        updated = updated.map(b => b.id === existingId ? { ...bank, id: existingId } : b);
      } else {
        updated.push({ ...bank, id: `sb_${Date.now()}` });
      }
      const nextData = { ...prev, savingBanks: updated };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const deleteSavingBank = (id: string) => {
    setData(prev => {
      const nextData = { ...prev, savingBanks: prev.savingBanks.filter(b => b.id !== id) };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  // ================= SALARY =================
  const saveSalaryEntry = (salary: Omit<SalaryEntry, 'id'>, existingId?: string) => {
    setData(prev => {
      let updated = [...prev.salaries];
      if (existingId) {
        updated = updated.map(s => s.id === existingId ? { ...salary, id: existingId } : s);
      } else {
        updated = [
          { ...salary, id: `sc_${Date.now()}` },
          ...updated.filter(s => !(s.year === salary.year && s.month === salary.month))
        ];
      }
      const nextData = { ...prev, salaries: updated };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const deleteSalaryEntry = (id: string) => {
    setData(prev => {
      const nextData = { ...prev, salaries: prev.salaries.filter(s => s.id !== id) };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  // ================= BUCKET LIST =================
  const saveBucketPlace = (place: Omit<BucketPlace, 'id'>, existingId?: string) => {
    setData(prev => {
      let updated = [...prev.bucketList];
      if (existingId) {
        updated = updated.map(b => b.id === existingId ? { ...place, id: existingId } : b);
      } else {
        updated = [{ ...place, id: `bl_${Date.now()}` }, ...updated];
      }
      const nextData = { ...prev, bucketList: updated };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const deleteBucketPlace = (id: string) => {
    setData(prev => {
      const nextData = { ...prev, bucketList: prev.bucketList.filter(b => b.id !== id) };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  // ================= PLANNING =================
  const createNewPlan = (planName: string) => {
    if (!planName.trim()) return;
    const newPlan: Plan = {
      id: `plan_${Date.now()}`,
      name: planName.trim(),
      items: []
    };
    setData(prev => {
      const nextData = { ...prev, plans: [newPlan, ...prev.plans] };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const renamePlan = (planId: string, newName: string) => {
    setData(prev => {
      const nextData = {
        ...prev,
        plans: prev.plans.map(p => p.id === planId ? { ...p, name: newName.trim() } : p)
      };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const deletePlan = (planId: string) => {
    setData(prev => {
      const nextData = { ...prev, plans: prev.plans.filter(p => p.id !== planId) };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const savePlanItem = (planId: string, item: Omit<PlanItem, 'id'>, existingId?: string) => {
    setData(prev => {
      const nextData = {
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
      };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const togglePlanItemTick = (planId: string, itemId: string) => {
    setData(prev => {
      const nextData = {
        ...prev,
        plans: prev.plans.map(p => {
          if (p.id !== planId) return p;
          return {
            ...p,
            items: p.items.map(it => it.id === itemId ? { ...it, ticked: !it.ticked } : it)
          };
        })
      };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const deletePlanItem = (planId: string, itemId: string) => {
    setData(prev => {
      const nextData = {
        ...prev,
        plans: prev.plans.map(p => {
          if (p.id !== planId) return p;
          return {
            ...p,
            items: p.items.filter(it => it.id !== itemId)
          };
        })
      };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  // ================= GRAPHIC ZONE =================
  const saveGraphicJob = (jobInput: Omit<GraphicJob, 'id' | 'jobNo' | 'totalAmount' | 'balanceDue' | 'estimatedProfit'> & { id?: string; jobNo?: string }) => {
    setData(prev => {
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
      const nextData = { ...prev, graphicJobs: updatedJobs };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const markGraphicJobDelivered = (id: string) => {
    setData(prev => {
      const nextData = {
        ...prev,
        graphicJobs: prev.graphicJobs.map(j => j.id === id ? { ...j, status: 'Delivered' as const } : j)
      };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const cancelGraphicJob = (id: string) => {
    setData(prev => {
      const nextData = {
        ...prev,
        graphicJobs: prev.graphicJobs.map(j => j.id === id ? { ...j, status: 'Cancel' as const } : j)
      };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const deleteGraphicJob = (id: string) => {
    setData(prev => {
      const nextData = { ...prev, graphicJobs: prev.graphicJobs.filter(j => j.id !== id) };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const getGraphicCustomers = (): GraphicCustomer[] => {
    return GraphicZoneService.buildCustomerDirectory(data.graphicJobs);
  };

  // ================= INFLOW PORTFOLIO =================
  const saveInflowHolding = (holding: Omit<InflowHolding, 'id'>, existingId?: string) => {
    setData(prev => {
      let updated = [...prev.inflowHoldings];
      if (existingId) {
        updated = updated.map(h => h.id === existingId ? { ...holding, id: existingId } : h);
      } else {
        updated.push({ ...holding, id: `inf_${Date.now()}` });
      }
      const nextData = { ...prev, inflowHoldings: updated };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const deleteInflowHolding = (id: string) => {
    setData(prev => {
      const nextData = { ...prev, inflowHoldings: prev.inflowHoldings.filter(h => h.id !== id) };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  // ================= 5% CLUB TRADES =================
  const saveTrade = (trade: Omit<Trade5Pct, 'id'>, existingId?: string) => {
    setData(prev => {
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
      const nextData = { ...prev, trades: updated };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const deleteTrade = (id: string) => {
    setData(prev => {
      const nextData = { ...prev, trades: prev.trades.filter(t => t.id !== id) };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  // ================= SKILLS =================
  const saveSkillSentence = (sentence: Omit<SkillSentence, 'id'>, existingId?: string) => {
    setData(prev => {
      let updated = [...prev.skills];
      if (existingId) {
        updated = updated.map(s => s.id === existingId ? { ...sentence, id: existingId } : s);
      } else {
        updated.push({ ...sentence, id: `sk_${Date.now()}` });
      }
      const nextData = { ...prev, skills: updated };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const deleteSkillSentence = (id: string) => {
    setData(prev => {
      const nextData = { ...prev, skills: prev.skills.filter(s => s.id !== id) };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  // ================= SPECIAL DAYS =================
  const saveSpecialDay = (day: Omit<SpecialDay, 'id'>, existingId?: string) => {
    setData(prev => {
      let updated = [...prev.specialDays];
      if (existingId) {
        updated = updated.map(sd => sd.id === existingId ? { ...day, id: existingId } : sd);
      } else {
        updated.push({ ...day, id: `sd_${Date.now()}` });
      }
      const nextData = { ...prev, specialDays: updated };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  const deleteSpecialDay = (id: string) => {
    setData(prev => {
      const nextData = { ...prev, specialDays: prev.specialDays.filter(sd => sd.id !== id) };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  // ================= HEALTH =================
  const saveHealthLog = (log: Omit<HealthLog, 'id'>, existingId?: string) => {
    setData(prev => {
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
      const nextData = { ...prev, health: updated };
      StorageService.saveAppData(nextData);
      return nextData;
    });
  };

  return (
    <AppContext.Provider
      value={{
        data,
        isLocked,
        loginError,
        login,
        logout,
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
        renamePlan,
        deletePlan,
        savePlanItem,
        togglePlanItemTick,
        deletePlanItem,

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
