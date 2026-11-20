/** Small standalone adaptations of the app's routine utilities. */
export function formatDuration(seconds) {
  const safeSeconds = Math.max(0, Math.round(seconds));
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, '0')}`;
}
export function routineDurationSeconds(routine) {
  return routine.exercises.reduce((sum, exercise) => sum + (exercise.durationSeconds ?? 0), 0);
}
export function moveItem(items, from, to) {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 || from >= items.length || to >= items.length) throw new RangeError('Invalid reorder indices');
  const reordered = [...items];
  const [moved] = reordered.splice(from, 1);
  reordered.splice(to, 0, moved);
  return reordered;
}
