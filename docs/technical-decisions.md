# Architecture and technical decisions

This public companion was prepared from a read-only inspection of the private `barbarakprokop/concrete-set` GitHub repository on 20 November 2026. This is documentation of an implementation, not a claim that all private production paths were executed or audited.

## 1. A timer that doesn't trust intervals

The private app contains `src/workoutTimeline.ts`. Its `resolveElapsedWorkout` function takes the completed item index, its completion timestamp, and the current time. It walks forward through the workout and subtracts each item's duration to resolve which item should be active now. That means time can catch up when backgrounding prevents JavaScript intervals from running reliably.

The standalone `src/workout-timeline.mjs` is adapted directly from that algorithm. It does not itself implement app lifecycle tracking, precise hardware timing or background notifications. It assumes reasonable wall-clock time; changing device clock can affect the result.

## 2. Offline is a deliberate scope decision

Routines, sound settings and onboarding state are stored using AsyncStorage. User-picked exercise images are copied to the app's local document directory. No backend, authentication or analytics service is present in the inspected source.

This reduces setup and network dependencies, but there is no account-based sync or cross-device backup. Those are tradeoffs, not undisclosed planned features.

## 3. The native watch boundary

The codebase contains a custom Expo native module in Swift and a watchOS companion.

- React Native calls `updateWorkoutState` and receives explicit watch actions via an event listener.
- The native coordinator uses `WCSession.updateApplicationContext` to retain the newest workout snapshot.
- When the watch is reachable, it also sends a message with the current workout state.
- The watch receives state updates and can send play, pause, previous and next commands to the iPhone.

This transport is not a promise of reliable real-time connectivity when the devices are disconnected. The watch displays its latest received state, rather than independently running the full workout timer.

## 4. Haptics represent transitions

The watch's private Swift module compares the previous and next workout states. Starting a rest item, changing the current item and entering the final three seconds trigger different haptic patterns. It guards against repeating countdown cues for the same item and second.

The public `watch-state.mjs` demonstrates only the state contract, action vocabulary and countdown keys. It is not a watchOS haptic implementation.

## 5. Product scope and maintainability

The private project is organized into routine, editor and workout screens, shared components, models, storage, and the Swift integration. The workout screen is relatively large, and the repository includes some alternate filenames with ` 2` suffixes. Consolidating older copies and breaking up large components would reduce maintenance overhead.

The codebase's README mentions future ActivityKit Live Activity integration; I did not identify a completed Widget Extension in the inspected tree. Do not describe Live Activities as already shipped on the basis of this snapshot.

## 6. What stays private

The full React Native app, Apple signing and provisioning settings, native project files, application graphics and audio assets, and repository history. No original asset binary is included in this public companion.

## 7. What to inspect

Run `npm test` with Node.js 20+ to execute the six synthetic example tests. Passing these tests does not replace device tests, native watch pairing tests, accessibility checks or store review.
