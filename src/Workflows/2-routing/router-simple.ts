import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI();

/**
 * You're building a customer support system. A customer sends a message. The first LLM call classifies the message as billing, technical, or general. Then your code routes it to a specialized LLM. 
 * 
 * We can also combine it with gates, tools, etc. For example, the billing agent could have access to a tool that looks up order information, while the technical agent could have access to a knowledge base of common issues.
 */

// Just simulating an incoming customer support message, can be anything.
const customerMessage = "I can't turn on my device after the latest update. It was working fine yesterday.";

const classification = await client.responses.create({
  model: "gpt-5.2",
  input: `Classify this customer support message into exactly one category.
Return ONLY one word: billing, technical, or general. Nothing else.

Message: ${customerMessage}`,
});

const category = classification.output_text.trim().toLowerCase();
console.log("=== Classification ===");
console.log(`Message: "${customerMessage}"`);
console.log(`Category: ${category}\n`);

// Step 2: Route to the right handler
// Each handler has a completely different system prompt
const prompts: Record<string, string> = {
  billing:
    "You are a billing specialist. You help with refunds, invoices, and payment issues. Be direct and solution-oriented. Always ask for the order number.",
  technical:
    "You are a technical support engineer. Help diagnose issues step by step. Ask for error messages, screenshots, or logs. Be patient and methodical.",
  general:
    "You are a friendly support agent. Answer general questions about the product. Keep it short and helpful.",
};

const systemPrompt = prompts[category];
console.log(`=== Routing to: ${category} ===\n`);

// Step 3: LLM Call 2 - Respond with the specialized prompt
const response = await client.responses.create({
  model: "gpt-5.2",
  instructions: systemPrompt,
  input: customerMessage,
});

console.log("=== Response ===");
console.log(response.output_text);