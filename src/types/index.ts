export interface RunWalkEntry {
  id: string;
  date: string; // YYYY-MM-DD
  distance: number; // KM
  duration?: number; // Minutes
  notes?: string;
}

export interface HabitItem {
  id: string;
  title: string;
  dateCreated: string;
  logs: Record<string, '✅' | '❌' | ''>; // dateStr -> status
}

export interface QuickNote {
  id: string;
  content: string;
  dateTimeStr: string;
  lastModified: string;
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  notes: string;
  lastModified?: string;
}

export interface LiabilityAssetItem {
  id: string;
  type: 'ASSET' | 'LIABILITY';
  name: string;
  amount: number;
}

export interface SavingBankItem {
  id: string;
  name: string;
  currency: 'INR' | 'AED';
  type: string;
  balance: number;
  logoUrl?: string;
}

export interface SalaryEntry {
  id: string;
  year: number;
  month: string; // "01" - "12"
  basic: number;
  allowance: number;
  ot: number;
  deduction: number;
  remarks: string;
  rate: number; // 1 AED = X INR
  totalAED: number;
  totalINR: number;
}

export interface BucketPlace {
  id: string;
  country: string; // "India" | "UAE" | "Other"
  state: string;
  district: string;
  placeName: string;
  imageUrl?: string;
  mapLink?: string;
  category: string;
  rating: number; // 1 to 5
  notes?: string;
}

export interface PlanItem {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  name: string;
  amount: number;
  ticked: boolean;
}

export interface Plan {
  id: string;
  name: string;
  items: PlanItem[];
}

export type GraphicJobStatus =
  | 'Design Pending'
  | 'Printing'
  | 'Ready for Delivery'
  | 'Delivered'
  | 'Cancel';

export interface GraphicJob {
  id: string;
  jobNo: string; // "G315"
  date: string; // YYYY-MM-DD
  customerName: string;
  phone: string;
  place: string;
  item: string;
  qty: number;
  rate: number;
  totalAmount: number;
  paid: number;
  balanceDue: number;
  printCost: number;
  otherCost: number;
  estimatedProfit: number;
  status: GraphicJobStatus;
  remarks?: string;
}

export interface GraphicCustomer {
  name: string;
  place: string;
  phone: string;
  totalOrders: number;
  totalBusiness: number;
  totalPaid: number;
  balanceDue: number;
  lastOrderDate: string;
}

export interface InflowHolding {
  id: string;
  category: 'core' | 'mf' | 'stocks';
  name: string;
  type?: string;
  investedAmount: number;
  currentValue: number;
  sipAmount?: number;
  notes?: string;
  logoUrl?: string;
}

export interface Trade5Pct {
  id: string;
  asset: string;
  investment: number;
  entryDate: string; // YYYY-MM-DD
  exitDate?: string; // YYYY-MM-DD
  holdingDays?: number;
  exitPct?: number;
  brokerCharges?: number;
  grossPnl?: number;
  netPnl?: number;
  isExited: boolean;
}

export interface SkillSentence {
  id: string;
  category: string;
  kannada: string;
  roman: string;
  deva: string;
}

export interface SpecialDay {
  id: string;
  title: string;
  dateStr: string; // YYYY-MM-DD
  category: 'Birthday' | 'Anniversary' | 'Event' | string;
  phone?: string;
  notes?: string;
}

export interface HealthLog {
  id: string;
  date: string; // YYYY-MM-DD
  waterLiters: number;
  sleepHours: number;
  workoutMinutes: number;
  weightKg?: number;
  notes?: string;
}

export interface AppData {
  runWalk: RunWalkEntry[];
  habits: HabitItem[];
  quickNotes: QuickNote[];
  diary: DiaryEntry[];
  liabilityAssets: LiabilityAssetItem[];
  savingBanks: SavingBankItem[];
  salaries: SalaryEntry[];
  bucketList: BucketPlace[];
  plans: Plan[];
  graphicJobs: GraphicJob[];
  inflowHoldings: InflowHolding[];
  trades: Trade5Pct[];
  skills: SkillSentence[];
  specialDays: SpecialDay[];
  health: HealthLog[];
}
