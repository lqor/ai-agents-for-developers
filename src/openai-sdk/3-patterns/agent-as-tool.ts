import "dotenv/config";
import { Agent, run } from "@openai/agents";
import { writeFileSync } from "fs";

// Specialist 1: knows about code
const codeReviewer = new Agent({
  name: "Code Reviewer",
  instructions:
    "You are a strict code reviewer. Review the code you receive and give concrete feedback on quality, bugs, and improvements. Be concise.",
  model: "gpt-5.2",
});

// Specialist 2: knows about documentation
const docWriter = new Agent({
  name: "Doc Writer",
  instructions:
    "You are a technical writer. Write clear, concise documentation for the code you receive. Output markdown.",
  model: "gpt-5.2",
});

// Manager: owns the conversation, delegates to specialists
const manager = new Agent({
  name: "Engineering Manager",
  instructions: `You are an engineering manager. 
When the user gives you code, use your specialists:
- Use code_reviewer to get a code review
- Use doc_writer to generate documentation
Combine their outputs into a single, organized response.`,
  model: "gpt-5.2",
  tools: [
    codeReviewer.asTool({
      toolName: "code_reviewer",
      toolDescription: "Reviews code for quality, bugs, and improvements",
    }),
    docWriter.asTool({
      toolName: "doc_writer",
      toolDescription: "Writes documentation for code",
    }),
  ],
});

const result = await run(
  manager,
  `Review and document this function:

function debounce(fn, ms) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
}`
);

console.log(result.finalOutput);
writeFileSync("review.md", result.finalOutput ?? "No output");
console.log("\nSaved to review.md");