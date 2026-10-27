import { Plan } from '../types';

export class PlanningService {
  static calculatePlanBalance(plan: Plan) {
    const incomes = plan.items.filter(it => it.type === 'INCOME');
    const expenses = plan.items.filter(it => it.type === 'EXPENSE');

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
}
