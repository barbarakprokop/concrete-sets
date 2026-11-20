import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveElapsedWorkout } from '../src/workout-timeline.mjs';
import { createWatchSnapshot, isWatchAction, countdownHapticKey } from '../src/watch-state.mjs';
import { formatDuration, routineDurationSeconds, moveItem } from '../src/routine-utils.mjs';

const exercises = [{name:'Squats', durationSeconds:30},{name:'Break',durationSeconds:10},{name:'Plank',durationSeconds:20}];

test('timer resolves the next item after a long app suspension', () => {
  assert.deepEqual(resolveElapsedWorkout(exercises, 0, 1000, 16000), {complete:false,index:2,remainingMilliseconds:15000});
});

test('timer advances across several items when callbacks were skipped', () => {
  assert.deepEqual(resolveElapsedWorkout(exercises, -1, 0, 47000), {complete:false,index:2,remainingMilliseconds:13000});
});

test('timer resolves completion at the end of the routine', () => {
  assert.deepEqual(resolveElapsedWorkout(exercises, -1, 0, 60000), {complete:true});
});

test('a backwards device clock does not subtract remaining workout time', () => {
  assert.deepEqual(resolveElapsedWorkout(exercises, 0, 10000, 2000), {complete:false,index:1,remainingMilliseconds:10000});
});

test('watch state has bounded countdown and validates controls', () => {
  const snapshot=createWatchSnapshot({currentExerciseName:'Plank', remainingSeconds:-4,isRunning:true,currentIndex:2,totalItems:3});
  assert.equal(snapshot.remainingSeconds,0);
  assert.equal(isWatchAction('next'),true);
  assert.equal(isWatchAction('delete'),false);
  assert.equal(countdownHapticKey(createWatchSnapshot({isRunning:true,currentIndex:2,remainingSeconds:3})), '2-3');
});

test('routine ordering and formatting stay deterministic', () => {
  const source=['squats','break','plank'];
  assert.deepEqual(moveItem(source,0,2),['break','plank','squats']);
  assert.deepEqual(source,['squats','break','plank']);
  assert.equal(formatDuration(125),'2:05');
  assert.equal(routineDurationSeconds({exercises}),60);
});
