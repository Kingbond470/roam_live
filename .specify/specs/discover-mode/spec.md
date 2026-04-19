# Discover Mode

## Status
✅ Shipped — v1.0 (2026-04)

## Problem
Some users don't want to choose — they want to be taken somewhere. Discover mode auto-advances through random cities, creating a passive "world TV" experience.

## User Stories
- As a traveller with no destination in mind, I want the app to take me on a random city journey automatically, so that I can enjoy exploring without making decisions
- As a traveller in discover mode, I want to be able to stop and stay in a city I like, so that I'm not locked in

## Acceptance Criteria
- [x] "Discover" button in globe bottom bar toggles discover mode
- [x] In discover mode, cities auto-advance after a set interval
- [x] User can exit discover mode by toggling the button or pressing ESC
- [x] Current city can still be explored normally while in discover mode

## Resolved Decisions
- **Advance interval**: Set to match video chapter length — not too fast to feel chaotic, not too slow to feel stuck
- **discoverMode: boolean** in Zustand; `toggleDiscoverMode()` action
