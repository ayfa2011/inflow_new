import { Plan } from '../types';

export class PlanningService {
  static calculatePlanBalance(plan: Plan) {
    const incomes = plan.items ? plan.items.filter(it => it.type === 'INCOME') : [];
    const expenses = plan.items ? plan.items.filter(it => it.type === 'EXPENSE') : [];

    const totalIncome = incomes.reduce((s, it) => s + (Number(it.amount) || 0), 0);
    const totalExpenses = expenses.reduce((s, it) => s + (Number(it.amount) || 0), 0);
    const netBalance = totalIncome - totalExpenses;

    return {
      incomes,
      expenses,
      totalIncome,
      totalExpenses,
      netBalance
    };
  }

  static calculateMonthlyMetrics(plan: Plan, asOfDateStr?: string) {
    const expenses = plan.monthlyExpenses || [];
    const totalExpense = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const budget = Number(plan.budget) || 0;
    const remaining = budget - totalExpense;

    // Determine Start Date
    const todayStr = asOfDateStr || new Date().toISOString().split('T')[0];
    const startDateStr = plan.startDate || todayStr;

    // Calculate elapsed days
    const startObj = new Date(startDateStr);
    const asOfObj = new Date(todayStr);

    let diffDays = Math.round((asOfObj.getTime() - startObj.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 1) {
      diffDays = 1; // Minimum 1 day elapsed to calculate rate
    }

    const totalDays = Number(plan.totalDays) > 0 ? Number(plan.totalDays) : 30;
    const dailyAverage = totalExpense > 0 ? (totalExpense / diffDays) : 0;
    const estimatedMonthlyProjection = dailyAverage * totalDays;
    const projectedRemaining = budget - estimatedMonthlyProjection;
    const isOverBudget = budget > 0 && estimatedMonthlyProjection > budget;
    const percentSpent = budget > 0 ? Math.min(100, Math.round((totalExpense / budget) * 100)) : 0;

    return {
      startDate: startDateStr,
      asOfDate: todayStr,
      elapsedDays: diffDays,
      totalDays,
      budget,
      totalExpense,
      remaining,
      dailyAverage,
      estimatedMonthlyProjection,
      projectedRemaining,
      isOverBudget,
      percentSpent
    };
  }
}

