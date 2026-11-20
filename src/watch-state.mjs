/**
 * Synthetic watch state contract adapted from the private TypeScript and Swift interfaces.
 * This does not send WatchConnectivity messages or access hardware.
 */
const actions = new Set(['play', 'pause', 'previous', 'next']);
export function isWatchAction(value) { return actions.has(value); }
export function createWatchSnapshot({currentExerciseName = '', nextExerciseName = '', remainingSeconds = 0, isRunning = false, isRest = false, currentIndex = 0, totalItems = 0, isComplete = false} = {}) {
  return {
    currentExerciseName,
    nextExerciseName,
    remainingSeconds: Math.max(0, Math.floor(remainingSeconds)),
    isRunning: Boolean(isRunning),
    isRest: Boolean(isRest),
    currentIndex,
    totalItems,
    isComplete: Boolean(isComplete),
  };
}
export function countdownHapticKey(snapshot) {
  if (!snapshot.isRunning || snapshot.isComplete || ![1,2,3].includes(snapshot.remainingSeconds)) return null;
  return `${snapshot.currentIndex}-${snapshot.remainingSeconds}`;
}
