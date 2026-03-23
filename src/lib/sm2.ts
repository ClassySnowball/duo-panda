export interface SM2Input {
  quality: number;       // 0-5
  easeFactor: number;    // current EF, starts at 2.5
  interval: number;      // current interval in days
  repetitions: number;   // current repetition count
}

export interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: Date;
}

export function sm2({ quality, easeFactor, interval, repetitions }: SM2Input): SM2Result {
  let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  let newInterval: number;
  let newReps: number;

  if (quality < 3) {
    // Failed: reset
    newReps = 0;
    newInterval = 0;
  } else {
    newReps = repetitions + 1;
    if (newReps === 1) {
      newInterval = 1;
    } else if (newReps === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEF);
    }
  }

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

  return {
    easeFactor: Math.round(newEF * 100) / 100,
    interval: newInterval,
    repetitions: newReps,
    nextReviewAt,
  };
}
