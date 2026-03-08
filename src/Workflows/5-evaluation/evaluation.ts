import "dotenv/config";
import OpenAI from "openai";
import { writeFileSync } from "fs";

const client = new OpenAI();

const task = `Write a TypeScript function called "getTopExpensive".
It takes two arguments: an array of objects with "name" (string) and "price" (number), and a count (number).
It returns the top N most expensive items, sorted by price descending.
Define a type for the product. Export the function.
Return ONLY the code, no markdown, no explanation.`;

let code = "";
let feedback = "";

for (let i = 1; i <= 3; i++) {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`🔄 Iteration ${i}`);
  console.log("=".repeat(50));

  // Generator - write or rewrite the code
  const generatorPrompt =
    i === 1
      ? task
      : `Here is your previous code:\n\n${code}\n\nHere is the feedback from the code reviewer:\n\n${feedback}\n\nRewrite the code to address ALL the feedback. Return ONLY the code, no markdown, no explanation.`;

  console.log("\n📝 Generator writing code...\n");
  const generated = await client.responses.create({
    model: "gpt-5.2",
    input: generatorPrompt,
  });

  code = generated.output_text;
  console.log(code);

  // Evaluator - review code quality
  console.log("\n🔍 Evaluator reviewing...\n");
  const evaluation = await client.responses.create({
    model: "gpt-5.2",
    input: `You are a strict TypeScript code reviewer. Review this code:

${code}

Check these criteria:
1. Descriptive variable/parameter names (no single letters, no "any")
2. Explicit return type on every function
3. Custom type definitions (not inline)
4. Edge case handling (empty array, negative count)
5. No mutation of the original array

For each, say PASS or FAIL with a one-line reason.`,
  });

  feedback = evaluation.output_text;
  console.log(feedback);
}

console.log("\n✅ Done. Final code after 3 iterations:");
console.log(code);

writeFileSync("result.ts", code);
console.log("\n📄 Saved to result.ts");