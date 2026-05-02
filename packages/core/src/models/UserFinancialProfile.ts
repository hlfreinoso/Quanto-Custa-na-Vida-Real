export interface UserFinancialProfile {
  id?: string;
  monthlyIncome: number;
  workHoursPerDay: number;
  workDaysPerMonth: number;
  currency: "BRL";
  createdAt?: string;
  updatedAt?: string;
}
