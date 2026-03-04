# AI Agents For Developers

Learn the basics of AI agents in about 30 minutes by building a tiny agent harness from scratch.

This repo is intentionally minimal and practical. The goal is to understand the core loop, not hide it behind frameworks.

## What You Will Build

You will build a simple agent that:
- Calls an LLM
- Runs in a loop
- Gradually evolves toward using tools (like bash/codebase evaluation)

The whole project is designed to stay small and readable (well under a few hundred lines).

## 30-Minute Path

1. `Step 1`: Make one OpenAI call.
2. `Step 2`: Introduce an agentic loop scaffold.
3. `Step 3`: Build a working agent (planned).
4. `Step 4`: Add tools (planned).

## Project Setup

### 1) Install dependencies

```bash
npm install
```

Dependencies used:
- `openai`
- `dotenv`
- `tsx`

### 2) Add your API key

Create a `.env` file:

```bash
OPENAI_API_KEY=your_key_here
```

### 3) Run each step

```bash
npm run step1
npm run step2
```

You can also run files directly:

```bash
npx tsx src/step1.ts
npx tsx src/step2.ts
```

## Scripts

Current scripts in `package.json`:

```json
"scripts": {
  "step1": "npx tsx src/step1.ts",
  "step2": "npx tsx src/step2.ts",
  "step3": "npx tsx src/step3.ts",
  "step4": "npx tsx src/step4.ts"
}
```

`step3` and `step4` are part of the learning roadmap and will be added in follow-up commits.

## Why This Repo

Most agent tutorials jump straight to abstractions. This one does the opposite:
- small files
- obvious control flow
- easy to debug
- easy to extend

If you are new to agents, this should help you understand the fundamentals quickly.

## Contributing

Issues and PRs are welcome, especially if you want to:
- improve the teaching flow
- add step-by-step tests
- add `step3` and `step4` implementations
