import { HealthAnswerType } from './health-answers.enums';

type OffsetMap = Record<'recent' | 'while' | 'over_year', number>;

interface AnswerOffsets {
  km: OffsetMap;
  months: OffsetMap;
}

export const HEALTH_ANSWER_CONFIG: Record<HealthAnswerType, AnswerOffsets> = {
  [HealthAnswerType.ENGINE_OIL]: {
    km: { recent: 3000, while: 7000, over_year: 15000 },
    months: { recent: 2, while: 6, over_year: 14 },
  },
  [HealthAnswerType.BRAKES]: {
    km: { recent: 5000, while: 15000, over_year: 30000 },
    months: { recent: 3, while: 12, over_year: 24 },
  },
  [HealthAnswerType.TIRES]: {
    km: { recent: 10000, while: 25000, over_year: 50000 },
    months: { recent: 6, while: 18, over_year: 36 },
  },
  [HealthAnswerType.TIMING_BELT]: {
    km: { recent: 20000, while: 50000, over_year: 90000 },
    months: { recent: 12, while: 36, over_year: 60 },
  },
  [HealthAnswerType.COOLING_SYSTEM]: {
    km: { recent: 10000, while: 25000, over_year: 50000 },
    months: { recent: 6, while: 18, over_year: 30 },
  },
};
