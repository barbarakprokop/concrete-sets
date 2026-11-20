/**
 * Adapted from private src/workoutTimeline.ts.
 * Uses elapsed wall-clock time to resolve the next timed workout item.
 * Deliberately standalone: no React Native or private application imports.
 */
export function resolveElapsedWorkout(exercises, completedIndex, completedAt, now) {
  let rollover = Math.max(0, now - completedAt);
  for (let index = completedIndex + 1; index < exercises.length; index += 1) {
    const duration = Math.max(1, exercises[index].durationSeconds ?? 60) * 1000;
    if (rollover < duration) {
      return { complete: false, index, remainingMilliseconds: duration - rollover };
    }
    rollover -= duration;
  }
  return { complete: true };
}
