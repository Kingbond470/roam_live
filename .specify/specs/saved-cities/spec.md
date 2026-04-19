# Saved Cities (Favourites)

## Status
✅ Shipped — v1.0 (2026-04) | ⚠️ V2 planned: cloud sync

## Problem
Users who find cities they love need a way to return to them without re-discovering. Saved cities are the beginning of a personalisation layer — the first signal of user intent beyond a single session.

## User Stories
- As a traveller, I want to heart a city during a walk, so that I can find it again later
- As a traveller, I want to filter the globe to show only my saved cities, so that I can revisit favourites quickly
- As a traveller, I want my saved cities to persist across browser sessions, so that I don't lose my list when I close the tab

## Acceptance Criteria
- [x] Heart button in CityHUD top bar toggles saved state for current city
- [x] Heart fills rose when city is saved; empty when not
- [x] `favoriteSlugs: string[]` persisted in localStorage via Zustand persist
- [x] "Saved" filter pill on globe filters pins to favourited cities only
- [x] Keyboard shortcut `F` toggles favourite for current city

## Out of Scope (V1) — Explicitly Deferred
- Cloud sync across devices (requires auth — V2 with user accounts)
- Anonymous save migration to account on sign-up
- Sharing saved list with others
- Saved city notification ("New walk added to Tokyo")

## V1 Data Decision — DOCUMENTED
> **favoriteSlugs are localStorage-only.**
> Saved on device, not in any database.
> A user who switches devices or clears browser data loses their list.
> This was an explicit V1 decision. Users have not been promised cross-device sync.
> Cloud sync ships with user accounts (post-auth feature, Tier 1 spec required).

## Resolved Decisions
- **Array of slugs over Set**: JSON serialisation in localStorage; Sets don't serialise natively
- **Zustand persist partialise**: Only `favoriteSlugs` and `playerMuted` persisted — not ephemeral UI state like `cardOpen`, `phase`, `compareOpen`
