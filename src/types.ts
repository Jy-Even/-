export type ViewType = 'home' | 'calculator' | 'history' | 'profile' | 'calendar' | 'salarySettings' | 'socialSecurity' | 'salaryDetail' | 'salaryEdit' | 'appearanceSettings' | 'realtimeSalary';

export type ScheduleType = 'Double' | 'Single' | 'Big-Small';

export interface SalarySettings {
  baseSalary: number;
  salaryMode: 'Monthly' | 'Annual';
  scheduleType: ScheduleType;
  dailyHours: number;
  pensionRate: number;
  medicalRate: number;
  unemploymentRate: number;
  housingRate: number;
}

export interface SalaryRecord {
  id: string;
  date: string;
  type: 'Overtime' | 'Leave' | 'Comp' | 'Regular' | 'Penalty';
  subtype: 'Workday' | 'Weekend' | 'Holiday' | 'Late' | 'Unpaid';
  duration: number; // in hours
  estimatedPay: number;
}

export interface MonthlySalary {
  id: string;
  month: string; // "YYYY-MM"
  baseAmount: number;
  bonus: number;
  socialSecurity: number;
  tax: number;
  gross: number;
  net: number;
}
