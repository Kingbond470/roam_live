# Nearaway Spec System

This directory implements **Spec-Driven Development** following the [spec-kit](https://github.com/github/spec-kit) methodology. Specs live next to the code, not in a separate tool.

---

## Why This Exists

Features built without specs accumulate invisible debt:
- Decisions made in chat history that disappear
- Bugs reintroduced because nobody documented the original fix
- Contractors or new contributors who can't understand *why* the code is the way it is

Every spec here answers three questions: **What** was built, **Why** decisions were made, and **What** was explicitly deferred.

---

## Structure

```
.specify/
├── constitution.md        ← Read this first. Always.
├── README.md              ← You are here
├── templates/             ← Copy these for new features
│   ├── spec-template.md
│   ├── plan-template.md
│   └── tasks-template.md
├── scripts/               ← Automation
│   ├── new-spec.sh        ← Scaffold a new spec
│   ├── validate-spec.sh   ← Check a spec is complete
│   └── list-specs.sh      ← See all specs + status
└── specs/                 ← One directory per feature
    ├── [feature]/
    │   ├── spec.md        ← What + why + user stories + acceptance criteria
    │   ├── plan.md        ← Technical architecture + key files + decisions
    │   └── tasks.md       ← Ordered checklist, V2 deferrals
    └── ...
```

---

## When to Write a Spec

| Tier | Examples | Spec required |
|---|---|---|
| **1** | Auth, payments, user data, new data models, core loop changes | `spec.md` + `plan.md` + `tasks.md` |
| **2** | New page types, major UX changes, new content verticals | `spec.md` + `tasks.md` |
| **3** | Bug fixes, copy, flag fixes, SEO tweaks, visual polish | None |

**When in doubt, write a spec.** The cost is 20 minutes. The cost of not writing one is hours of rework.

---

## Workflow for a New Feature

```
1. Determine tier (see constitution.md §6)
   └── Tier 3? → implement directly
   └── Tier 1 or 2? → continue

2. Scaffold spec
   $ npm run spec:new <feature-name>
   # or: bash .specify/scripts/new-spec.sh <feature-name>

3. Fill in spec.md
   - Problem statement
   - User stories
   - Acceptance criteria
   - Out of scope (explicit!)
   - Open questions

4. Get spec reviewed
   - SPM reviews: user stories, scope, out-of-scope
   - TL reviews: feasibility, technical risks, open questions

5. Fill in plan.md  (after spec is approved)
   - Architecture diagram
   - Key files
   - State changes
   - Data model

6. Fill in tasks.md
   - Ordered tasks, grouped by layer
   - V2 deferrals at bottom

7. Implement (tasks.md is your checklist)

8. Validate
   $ npm run spec:validate <feature-name>
   $ npm run typecheck

9. Update spec
   - Check off tasks
   - Log resolved decisions
   - Set status → ✅ Shipped
```

---

## Scripts

```bash
# Scaffold a new spec from templates
npm run spec:new <feature-name>

# List all specs and their status
npm run spec:list

# Validate a spec is complete (no empty placeholders)
npm run spec:validate <feature-name>

# TypeScript check (run before every commit)
npm run typecheck
```

---

## AI Agent Instructions

When Claude Code works on this project it reads `CLAUDE.md` at the project root automatically. That file points here. The workflow for Claude is:

1. Read `CLAUDE.md` → understand project context
2. Read `constitution.md` → understand constraints
3. Read `specs/[feature]/spec.md` → understand what and why
4. Read `specs/[feature]/plan.md` → understand the technical approach
5. Implement against `specs/[feature]/tasks.md`
6. Update spec files after implementation

**Claude should never change a V1 deferred decision without creating or updating a spec first.**

---

## Current Features

| Feature | Spec | Status |
|---|---|---|
| Globe Navigation | [spec](specs/globe-navigation/spec.md) | ✅ Shipped |
| City Video Player | [spec](specs/city-video-player/spec.md) | ✅ Shipped |
| City HUD | [spec](specs/city-hud/spec.md) | ✅ Shipped |
| Culture Card | [spec](specs/culture-card/spec.md) | ✅ Shipped |
| City Search | [spec](specs/city-search/spec.md) | ✅ Shipped |
| Saved Cities | [spec](specs/saved-cities/spec.md) | ✅ Shipped · V2 pending |
| Journeys | [spec](specs/journeys/spec.md) | ✅ Shipped |
| Split Screen Compare | [spec](specs/split-screen-compare/spec.md) | ✅ Shipped |
| Onboarding | [spec](specs/onboarding/spec.md) | ✅ Shipped |
| Discover Mode | [spec](specs/discover-mode/spec.md) | ✅ Shipped |
| Video Switcher | [spec](specs/video-switcher/spec.md) | ✅ Shipped |
| Static Walk Pages | [spec](specs/static-walk-pages/spec.md) | ✅ Shipped |
| Continent/Country Pages | [spec](specs/continent-country-pages/spec.md) | ✅ Shipped |
| Journey Detail Pages | [spec](specs/journey-detail-pages/spec.md) | ✅ Shipped |
| SEO Infrastructure | [spec](specs/seo-infrastructure/spec.md) | ✅ Shipped |
| Analytics | [spec](specs/analytics/spec.md) | ✅ Shipped |
