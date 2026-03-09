import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string): Promise<string> => new Promise((r) => rl.question(q, r));

// A safe tool - no approval needed
const lookupOrder = tool({
  name: "lookup_order",
  description: "Look up an order by ID and return its details",
  parameters: z.object({ orderId: z.string() }),
  execute: async ({ orderId }) => {
    return JSON.stringify({
      id: orderId,
      status: "delivered",
      total: 149.99,
      item: "Mechanical Keyboard",
    });
  },
});

// A dangerous tool - requires human approval before executing
const refundOrder = tool({
  name: "refund_order",
  description: "Process a refund for an order. This charges money back to the customer.",
  parameters: z.object({
    orderId: z.string(),
    amount: z.number(),
    reason: z.string(),
  }),
  needsApproval: true, // <-- This is the key
  execute: async ({ orderId, amount, reason }) => {
    return `Refund of $${amount} processed for order ${orderId}. Reason: ${reason}`;
  },
});

const agent = new Agent({
  name: "Support Agent",
  model: "gpt-5.2",
  instructions: `You are a customer support agent. You can look up orders and process refunds.
Always look up the order first before processing a refund.`,
  tools: [lookupOrder, refundOrder],
});

// Run the agent
let result = await run(
  agent,
  "I want a refund for order ORD-1234, the keyboard arrived broken."
);

// Check if the agent is waiting for approval
while (result.interruptions && result.interruptions.length > 0) {
  console.log("\n🔒 APPROVAL REQUIRED:\n");

  for (const interruption of result.interruptions) {
    const raw = interruption.rawItem;
    const name = "name" in raw ? raw.name : "unknown";
    const args = "arguments" in raw ? raw.arguments : "{}";

    console.log(`  Tool: ${name}`);
    console.log(`  Args: ${JSON.stringify(args)}`);

    const answer = await ask("\n  Approve? (y/n): ");

    if (answer.toLowerCase() === "y") {
      result.state.approve(interruption);
    } else {
      result.state.reject(interruption);
    }
  }

  // Resume the agent with the approval/rejection decisions
  result = await run(agent, result.state);
}

console.log(`\nAgent: ${result.finalOutput}`);
rl.close();