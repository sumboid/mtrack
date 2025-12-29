---
applyTo: '**'
---
# General Instructions

0. `any` type usage is prohibited at all.
0.1. No way we are using `as` type assertions to override typescript compiler. If types are not correct we need to fix them properly.
0.2. Always prefer type inference over explicit types, unless explicit types improve code readability significantly
1. Do not generate any doc files.
2. Do not produce any comments unless they makes sense because code is not obvious.
3. When generating code, ensure it adheres to best practices and is optimized for performance.
4. Especially for React, prefer functional components and hooks over class components and keep in mind memoization techniques to avoid unnecessary re-renders.
5. State should be managed by xstate, so try to not abuse useSate or useReducer. Xstate should be main source of truth for app state.
6. After any change need to check that typescript types are correct and there is no type errors. And if possible check build is still fine.