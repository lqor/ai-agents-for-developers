# ai-agents-for-developers

## What are we going to build?

We'll build an agent that can use bash and can evaluate your code base. It'll be the bare minimum, because we want to do it for the learning purpose.

The whole thing is going to be <300 lines of code.

You'll see that Agent is a very simple concept.

## package.json

Add those lines to package.json:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "step1": "npx tsx src/step1.ts",
  "step2": "npx tsx src/step2.ts",
  "step3": "npx tsx src/step3.ts",
  "step4": "npx tsx src/step4.ts"
}
```

## How to run code

Now to run the code, you can just say `npm run step1` or `npm run step2`.

Or you can just run TypeScript directly: `npx tsx src/step1.ts`.

## API Keys

We'll use OpenAI SDK to make callouts to their LLM. You can use Claude as well. They are all the same in a lot of senses.

For this you need to get your API key from the platform and add it into the `.env` file:

```bash
OPENAI_API_KEY=your_key_here
```

## npm packages

We'll use following packages:

```bash
npm install openai dotenv tsx
```

It's an easy one-liner.

## Ready?

We'll slowly build the agent towards simple working agent.

Step 1 = Simple OpenAI callout.
Step 2 = Agentic Loop.
Step 3 = Working Agent.
Step 4 = Agent with tools.
