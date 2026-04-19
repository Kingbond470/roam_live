# Onboarding (Milestones + Coach Marks)

## Status
✅ Shipped — v1.0 (2026-04)

## Problem
First-time users don't know what Nearaway can do. They might watch one city, close the tab, and never discover journeys, search, compare, or saving. Milestone toasts celebrate moments and introduce features at the right time — not upfront.

## User Stories
- As a first-time traveller, I want contextual hints when I discover new features, so that I know what's possible without being lectured on arrival
- As a traveller who reaches a milestone, I want a celebration moment, so that continued exploration feels rewarding
- As a returning traveller, I want the onboarding hints to stop after I've seen them, so that they don't get in the way

## Acceptance Criteria
- [x] Milestone toasts fire for: 1st walk, 3rd walk, 1st save, 1st compare, 1st journey
- [x] Each toast has a title, message, emoji, and dismiss (✕) button
- [x] ✕ button correctly dismisses the toast (not a no-op)
- [x] Toasts don't repeat once dismissed in the session
- [x] Toast animations via Framer Motion AnimatePresence
- [x] Toasts don't block the video or HUD controls
- [x] Coach marks explain key interactions (globe tap, HUD controls)

## Out of Scope (V1)
- Persisted milestone state across sessions (toasts can refire on refresh — acceptable V1)
- Onboarding tutorial / walkthrough flow
- A/B testing of milestone copy

## Resolved Decisions
- **Session-only dismissed state**: `dismissedMilestones: number[]` is React state (not Zustand persisted). Toasts can reappear after page refresh. Acceptable V1 — full persistence would require auth to avoid polluting localStorage with too many keys.
- **onDismiss was a no-op bug**: Original implementation had `onDismiss={() => {}}` — toasts could never be closed. Fixed by introducing `dismissedMilestones` state and wiring ✕ to `dismissMilestone(index)`.
