import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LockScreen } from './components/LockScreen';
import { DashboardView } from './components/DashboardView';
import { RunWalkView } from './components/RunWalkView';
import { HabitView } from './components/HabitView';
import { QuickNoteView } from './components/QuickNoteView';
import { DiaryView } from './components/DiaryView';
import { LiabilityAssetsView } from './components/LiabilityAssetsView';
import { SavingBankView } from './components/SavingBankView';
import { SalaryCardView } from './components/SalaryCardView';
import { BucketListView } from './components/BucketListView';
import { PlanningView } from './components/PlanningView';
import { GraphicZoneView } from './components/GraphicZoneView';
import { HealthView } from './components/HealthView';
import { Inflow2036View } from './components/Inflow2036View';
import { FivePercentClubView } from './components/FivePercentClubView';
import { SkillImproveView } from './components/SkillImproveView';
import { SpecialDaysView } from './components/SpecialDaysView';
import { OurWorldView } from './components/OurWorldView';

const MainAppContent: React.FC = () => {
  const { isLocked } = useApp();
  const [currentView, setCurrentView] = useState<string>('dashboard');

  if (isLocked) {
    return <LockScreen />;
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f6f7fc] text-slate-800 antialiased font-sans">
      <div className="max-w-[480px] mx-auto px-3.5 py-4 min-h-screen box-border">
        {currentView === 'dashboard' && (
          <DashboardView onSelectView={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        )}
        {currentView === 'runWalk' && <RunWalkView onBack={handleBackToDashboard} />}
        {currentView === 'habit' && <HabitView onBack={handleBackToDashboard} />}
        {currentView === 'quickNote' && <QuickNoteView onBack={handleBackToDashboard} />}
        {currentView === 'diary' && <DiaryView onBack={handleBackToDashboard} />}
        {currentView === 'liability' && <LiabilityAssetsView onBack={handleBackToDashboard} />}
        {currentView === 'savingBank' && <SavingBankView onBack={handleBackToDashboard} />}
        {currentView === 'salary' && <SalaryCardView onBack={handleBackToDashboard} />}
        {currentView === 'bucketList' && <BucketListView onBack={handleBackToDashboard} />}
        {currentView === 'planning' && <PlanningView onBack={handleBackToDashboard} />}
        {currentView === 'graphicZone' && <GraphicZoneView onBack={handleBackToDashboard} />}
        {currentView === 'health' && <HealthView onBack={handleBackToDashboard} />}
        {currentView === 'inflow2036' && <Inflow2036View onBack={handleBackToDashboard} />}
        {currentView === 'fivePercentClub' && <FivePercentClubView onBack={handleBackToDashboard} />}
        {currentView === 'skill' && <SkillImproveView onBack={handleBackToDashboard} />}
        {currentView === 'specialDays' && <SpecialDaysView onBack={handleBackToDashboard} />}
        {currentView === 'ourWorld' && <OurWorldView onBack={handleBackToDashboard} />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
