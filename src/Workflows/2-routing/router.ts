import "dotenv/config";
import OpenAI from "openai";
import readline from "readline";

const client = new OpenAI();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(prompt: string): Promise<string> {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

const prompts: Record<string, string> = {
  billing:
    "You are a billing specialist. You help with refunds, invoices, and payment issues. Be direct and solution-oriented. Always ask for the order number.",
  technical:
    "You are a technical support engineer. Help diagnose issues step by step. Ask for error messages, screenshots, or logs. Be patient and methodical.",
  general:
    "You are a friendly support agent. Answer general questions about the product. Keep it short and helpful.",
};

while (true) {
  const customerMessage = await ask("\nCustomer: ");

  if (customerMessage.toLowerCase() === "exit") {
    console.log("Goodbye!");
    break;
  }

  // Step 1: LLM Call 1 - Classify the message
  const classification = await client.responses.create({
    model: "gpt-5.2",
    input: `Classify this customer support message into exactly one category.
Return ONLY one word: billing, technical, or general. Nothing else.

Message: ${customerMessage}`,
  });

  const category = classification.output_text.trim().toLowerCase();
  console.log(`\n🏷️  Classified as: ${category}`);

  // Step 2: Route to the right handler
  const systemPrompt = prompts[category];

  if (!systemPrompt) {
    console.log(`❌ Unknown category: ${category}`);
    continue;
  }

  // Step 3: LLM Call 2 - Respond with the specialized prompt
  const response = await client.responses.create({
    model: "gpt-5.2",
    instructions: systemPrompt,
    input: customerMessage,
  });

  console.log(`\n🤖 [${category}] ${response.output_text}`);
}

rl.close();