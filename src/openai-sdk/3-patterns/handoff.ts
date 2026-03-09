import "dotenv/config";
import { Agent, run } from "@openai/agents";

// Specialist 1: handles billing questions
const billingAgent = new Agent({
  name: "Billing Agent",
  instructions:
    "You are a billing specialist. Help with invoices, payments, refunds, and pricing questions. Be concise and helpful.",
  model: "gpt-5.2",
});

// Specialist 2: handles technical support
const techAgent = new Agent({
  name: "Tech Support Agent",
  instructions:
    "You are a technical support specialist. Help with bugs, errors, setup issues, and troubleshooting. Be concise and helpful.",
  model: "gpt-5.2",
});

// Triage agent: routes to the right specialist
const triageAgent = new Agent({
  name: "Triage Agent",
  instructions: `You are a customer support triage agent.
Based on the user's message, hand off to the right specialist:
- Billing questions (invoices, payments, refunds, pricing) → Billing Agent
- Technical issues (bugs, errors, setup, troubleshooting) → Tech Support Agent
Do NOT answer the question yourself. Just route it.`,
  model: "gpt-5.2",
  handoffs: [billingAgent, techAgent],
});

const result = await run(
  triageAgent,
  "I'm getting a 500 error when I try to upload a file through the API. It was working yesterday."
);

console.log(`Handled by: ${result.lastAgent?.name}`);
console.log(`\n${result.finalOutput}`);