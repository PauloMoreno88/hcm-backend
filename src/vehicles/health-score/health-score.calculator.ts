import { MAINTENANCE_RULES, type MaintenanceRule } from './health-score.config';

export interface MaintenanceRecord {
  type: string;
  km: number;
  date: Date;
}

export interface VehicleHealthInput {
  currentKm: number;
  maintenances: MaintenanceRecord[];
}

export interface HealthScoreResult {
  score: number;
  status: string;
  issues: string[];
  positives: string[];
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function monthsDiff(from: Date, to: Date): number {
  const years = to.getFullYear() - from.getFullYear();
  const months = to.getMonth() - from.getMonth();
  const days = (to.getDate() - from.getDate()) / 30;
  return years * 12 + months + days;
}

function computeDelay(
  rule: MaintenanceRule,
  last: MaintenanceRecord,
  currentKm: number,
  now: Date,
): number {
  if (rule.intervalType === 'km') {
    return (currentKm - last.km) / rule.interval;
  }
  return monthsDiff(last.date, now) / rule.interval;
}

function computePenalty(delay: number | null, weight: number): number {
  if (delay === null) return weight * 1.2;
  if (delay <= 1) return 0;
  if (delay <= 1.5) return weight * 0.5;
  if (delay <= 2) return weight;
  return weight * 1.5;
}

function resolveStatus(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Attention';
  return 'Critical';
}

export function calculateHealthScore(
  input: VehicleHealthInput,
  rules: MaintenanceRule[] = MAINTENANCE_RULES,
): HealthScoreResult {
  const now = new Date();
  const { currentKm, maintenances } = input;

  const latestByType = new Map<string, MaintenanceRecord>();
  for (const m of maintenances) {
    const existing = latestByType.get(m.type);
    if (!existing || new Date(m.date) > new Date(existing.date)) {
      latestByType.set(m.type, m);
    }
  }

  const issues: string[] = [];
  const positives: string[] = [];
  let totalPenalty = 0;
  let anyOverdue = false;

  for (const rule of rules) {
    const last = latestByType.get(rule.type);
    const delay = last ? computeDelay(rule, last, currentKm, now) : null;
    const penalty = computePenalty(delay, rule.weight);

    totalPenalty += penalty;

    if (penalty > 0) {
      anyOverdue = true;
      issues.push(last ? `${rule.label} is overdue` : `No record found for ${rule.label}`);
    } else {
      positives.push(`${rule.label} is up to date`);
    }
  }

  let bonus = 0;
  const recentRecords = maintenances.filter(
    (m) => now.getTime() - new Date(m.date).getTime() < THIRTY_DAYS_MS,
  );

  if (recentRecords.length >= 1) {
    bonus += 5;
    positives.push('Recent maintenance done in the last 30 days');
  }
  if (recentRecords.length >= 2) {
    bonus += 5;
    positives.push('Multiple maintenance records in the last 30 days');
  }
  if (!anyOverdue) {
    bonus += 10;
    positives.push('No overdue maintenance');
  }

  const score = Math.min(100, Math.max(0, Math.round(100 - totalPenalty + bonus)));

  return { score, status: resolveStatus(score), issues, positives };
}
