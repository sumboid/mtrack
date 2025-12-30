---
applyTo: '**'
---
# General Instructions

## Type Safety (CRITICAL)
0. `any` type usage is **PROHIBITED**. No exceptions.
0.1. **NEVER** use `as` type assertions to override TypeScript compiler. If types are incorrect, fix them properly at the source.
0.2. Always prefer type inference over explicit types, unless explicit types significantly improve readability.
0.3. **MANDATORY: After ANY code change, ALWAYS run `deno check --remote src/main.tsx` before considering work complete.** Fix ALL type errors. Not optional.

## Code Quality
1. **NO documentation files** - do not generate README, CHANGELOG, or any doc files.
2. **NO useless comments** - code must be self-explanatory. Only add comments for non-obvious business logic or complex algorithms. Comments like "// Update user" above `updateUser()` or "// Loop through items" are forbidden.
3. **Follow functional programming principles** - prefer `map`/`filter`/`reduce` over `forEach`/`for` loops.
4. **Extract ALL magic numbers** to named constants at module/component level.
5. **Use descriptive variable names** - no single letters except in very short scopes (i, j for loops, e for events).

## React-Specific (CRITICAL)
6. **NEVER use inline objects in JSX** - ALL style objects, props objects, or any object literals in JSX **MUST** be:
   - Extracted outside the component, OR
   - Memoized with `useMemo`, OR
   - Created by memoized factory functions with `useCallback`
   - Inline objects cause re-renders on every render cycle.

7. **Memoize components and values**:
   - Wrap expensive components with `React.memo`
   - Use `useMemo` for computed values
   - Use `useCallback` for functions passed as props
   - Use `useCallback` for style factory functions

8. **Avoid `undefined` in style objects**:
   - **WRONG**: `borderColor: condition ? 'red' : undefined`
   - **CORRECT**: `...(condition ? { borderColor: 'red' } : {})`
   - This prevents TypeScript errors with MUI `sx` prop

9. **State management**:
   - Use XState for application state
   - Minimize `useState` and `useReducer` - only for local UI state
   - XState is the single source of truth

10. **Check browser API compatibility**:
    - Methods like `padStart`, `flatMap`, etc. may not exist in older lib targets
    - Use polyfills or manual implementations when needed
    - Check TypeScript lib configuration before using newer APIs

## Code Organization
11. **Group related constants** into const objects:
    - **GOOD**: `const TIMELINE_CONSTANTS = { ROW_HEIGHT: 40, ... }`
    - **BAD**: Multiple separate `const ROW_HEIGHT = 40` declarations

12. **Extract helper functions** from large useMemo/useCallback blocks when they contain complex logic.

13. **Use early returns** to reduce nesting and improve readability.

14. **Destructure only what you need** - avoid large destructuring that isn't used.

## Validation Checklist (RUN AFTER EVERY CHANGE)
- [ ] Run `deno check --remote src/main.tsx` - must pass
- [ ] No inline objects in JSX
- [ ] No useless comments
- [ ] All magic numbers extracted to constants
- [ ] No `any` types
- [ ] No `as` type assertions (except for `as const`)
- [ ] Proper memoization (useMemo/useCallback/React.memo)
- [ ] No `forEach` - use `map`/`reduce`/`filter`