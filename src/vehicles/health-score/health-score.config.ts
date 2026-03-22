export type IntervalType = 'km' | 'months';
export type Category = 'critical' | 'important' | 'complementary';

export interface MaintenanceRule {
  type: string;
  label: string;
  weight: number;
  interval: number;
  intervalType: IntervalType;
  category: Category;
}

export const MAINTENANCE_RULES: MaintenanceRule[] = [
  // CRITICAL
  { type: 'engine_oil', label: 'Engine Oil', weight: 20, interval: 10000, intervalType: 'km', category: 'critical' },
  { type: 'brakes', label: 'Brakes', weight: 25, interval: 25000, intervalType: 'km', category: 'critical' },
  { type: 'tires', label: 'Tires', weight: 15, interval: 40000, intervalType: 'km', category: 'critical' },
  { type: 'timing_belt', label: 'Timing Belt', weight: 30, interval: 80000, intervalType: 'km', category: 'critical' },

  // IMPORTANT
  { type: 'air_filter', label: 'Air Filter', weight: 10, interval: 10000, intervalType: 'km', category: 'important' },
  { type: 'fuel_filter', label: 'Fuel Filter', weight: 10, interval: 20000, intervalType: 'km', category: 'important' },
  { type: 'spark_plugs', label: 'Spark Plugs', weight: 10, interval: 30000, intervalType: 'km', category: 'important' },
  { type: 'battery', label: 'Battery', weight: 10, interval: 24, intervalType: 'months', category: 'important' },

  // COMPLEMENTARY
  { type: 'alignment', label: 'Alignment', weight: 5, interval: 10000, intervalType: 'km', category: 'complementary' },
  { type: 'balancing', label: 'Balancing', weight: 5, interval: 10000, intervalType: 'km', category: 'complementary' },
  { type: 'coolant', label: 'Coolant', weight: 10, interval: 24, intervalType: 'months', category: 'complementary' },
  { type: 'suspension', label: 'Suspension', weight: 15, interval: 40000, intervalType: 'km', category: 'complementary' },
];
