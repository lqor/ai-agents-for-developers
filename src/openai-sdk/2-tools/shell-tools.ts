import "dotenv/config";
import {
  Agent,
  run,
  shellTool,
  type Shell,
} from "@openai/agents";
import { execSync } from "child_process";
import readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string): Promise<string> => new Promise((r) => rl.question(q, r));

const shell: Shell = {
  run: async (action) => ({
    output: action.commands.map((cmd) => {
      console.log(`$ ${cmd}`);
      try {
        const stdout = execSync(cmd, { encoding: "utf-8", timeout: 30_000 });
        return { stdout, stderr: "", outcome: { type: "exit" as const, exitCode: 0 } };
      } catch (e: any) {
        return { stdout: e.stdout ?? "", stderr: e.stderr ?? e.message, outcome: { type: "exit" as const, exitCode: e.status ?? 1 } };
      }
    }),
  }),
};

const agent = new Agent({
  name: "Mini Codex",
  model: "gpt-5.2",
  instructions: "You are a coding agent with shell access. Be concise.",
  tools: [shellTool({ shell })], // <- handles the inner tool calling loop
});

let history: any[] = [];

while (true) {
  const input = await ask("\nYou: ");
  if (input === "exit") break;

  const inputList = history.length > 0
    ? [...history, { role: "user", content: [{ type: "input_text", text: input }] }]
    : input;

  const result = await run(agent, inputList);
  console.log(`\nAgent: ${result.finalOutput}`);

  if (history.length === 0) {
    history = [{ role: "user", content: [{ type: "input_text", text: input }] }];
  }
  for (const item of result.newItems) {
    history.push(item.rawItem);
  }
}

rl.close();