import { HealthAnswerType, HealthAnswerValue } from './health-answers.enums';

const TYPE_WEIGHTS: Record<HealthAnswerType, number> = {
  [HealthAnswerType.TIMING_BELT]: 30,
  [HealthAnswerType.BRAKES]: 25,
  [HealthAnswerType.ENGINE_OIL]: 20,
  [HealthAnswerType.TIRES]: 15,
  [HealthAnswerType.COOLING_SYSTEM]: 10,
};

const ANSWER_MULTIPLIERS: Record<HealthAnswerValue, number> = {
  [HealthAnswerValue.RECENT]: 0,
  [HealthAnswerValue.WHILE]: 0.35,
  [HealthAnswerValue.OVER_YEAR]: 0.75,
  [HealthAnswerValue.NEVER]: 1.0,
  [HealthAnswerValue.NO_TIMING_BELT]: 0,
};

export function calculateAnswerBasedScore(
  answers: { type: string; answer: string }[],
): number {
  let totalPenalty = 0;

  for (const { type, answer } of answers) {
    const weight = TYPE_WEIGHTS[type as HealthAnswerType] ?? 0;
    const multiplier = ANSWER_MULTIPLIERS[answer as HealthAnswerValue] ?? 0;
    totalPenalty += weight * multiplier;
  }

  return Math.max(0, Math.min(100, Math.round(100 - totalPenalty)));
}
