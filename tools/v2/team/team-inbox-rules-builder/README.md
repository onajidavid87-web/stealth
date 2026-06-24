# Team Inbox Rules Builder

This folder is the isolated workspace for the Team Inbox Rules Builder tool.

## Ownership boundary

All work for this tool must stay inside:

```
.tools/v2/team/team-inbox-rules-builder/
```

Do not wire this tool into the main app, routing, inbox architecture, wallet core, Stellar core, database schema, or existing design system unless a future integration issue explicitly allows it.

## What this tool provides

A folder-local rule engine for evaluating inbox automation rules against message context.

### Included files

- `src/rulesEngine.ts` — core rule evaluation logic
- `src/fixtures.ts` — deterministic rule and message examples
- `src/rulesEngine.test.ts` — unit tests covering rule matching and evaluation

## Local validation

Run only the folder-local tests from the repo root:

```bash
cd c:/Users/HP/gfox/stealth
npx vitest run tools/v2/team/team-inbox-rules-builder/src/rulesEngine.test.ts
```

## Review notes

Reviewers should verify that:

- enabled rules are matched against message fields correctly
- disabled rules are ignored
- subject keyword matching, tag inclusion, and project equality are handled deterministically
- the engine returns only matching rules and their actions
- the implementation is isolated to this folder and does not touch app-wide code

## Known limitations

- This issue implements only the isolated core rule engine, not UI or app integration.
- There are no live network calls or production data dependencies.
- The rule language is intentionally minimal to keep the core behavior reviewable.

## Follow-up

Future issues may add a UI, rule editor, persistence, or integration with mail events.
