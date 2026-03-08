import "dotenv/config";
import OpenAI from "openai";
import { readFileSync, writeFileSync } from "fs";

const client = new OpenAI();

const topic = "AI coding agents";

console.log(`=== Researching: ${topic} ===\n`);
console.log("Running 3 research tasks in parallel...\n");

const [technical, business, risks] = await Promise.all([
  client.responses.create({
    model: "gpt-5.2",
    tools: [{ type: "web_search_preview" }],
    input: `Research the technical architecture of ${topic}. How do they work under the hood? Keep it to 1 paragraph.`,
  }),

  client.responses.create({
    model: "gpt-5.2",
    tools: [{ type: "web_search_preview" }],
    input: `Research the business use cases of ${topic}. Who is using them and for what? Keep it to 1 paragraph.`,
  }),

  client.responses.create({
    model: "gpt-5.2",
    tools: [{ type: "web_search_preview" }],
    input: `Research the risks and criticisms of ${topic}. What can go wrong? Keep it to 1 paragraph.`,
  }),
]);

// Important: Combine programmatically, not LLM. 
// Otherwise, it's another pattern.
console.log("=== Technical Architecture ===");
console.log(technical.output_text);

console.log("\n=== Business Use Cases ===");
console.log(business.output_text);

console.log("\n=== Risks & Criticism ===");
console.log(risks.output_text);

writeFileSync(
  "research.md",
  `=== Research on ${topic} ===\n\n` +
    `=== Technical Architecture ===\n${technical.output_text}\n\n` +
    `=== Business Use Cases ===\n${business.output_text}\n\n` +
    `=== Risks & Criticism ===\n${risks.output_text}\n`
);

console.log("\nResearch saved to research.md");