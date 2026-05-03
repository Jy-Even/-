export type ViewType = 'home' | 'calculator' | 'history' | 'profile' | 'calendar' | 'salarySettings' | 'socialSecurity' | 'salaryDetail' | 'salaryEdit' | 'appearanceSettings' | 'realtimeSalary';

export type ScheduleType = 'Double' | 'Single' | 'Big-Small';

export interface SalarySettings {
  baseSalary: number;
  salaryMode: 'Monthly' | 'Annual';
  scheduleType: ScheduleType;
  dailyHours: number;
}

export interface SalaryRecord {
  id: string;
  date: string;
  type: 'Overtime' | 'Leave' | 'Comp';
  subtype: 'Workday' | 'Weekend' | 'Holiday';
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
