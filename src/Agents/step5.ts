import "dotenv/config";
import readline from "readline";
import OpenAI from "openai";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const client = new OpenAI();
const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const tools = [
  {
    name: "do_bash",
    description: "Execute bash commands on the server",
    type: "function" as const,
    strict: true,
    parameters: {
      type: "object",
      properties: {
        command: { type: "string" },
      },
      required: ["command"],
      additionalProperties: false,
    },
  },
  {
    name: "read_file",
    description: "Read a UTF-8 text file from disk. Supports optional byte offset/length for partial reads.",
    type: "function" as const,
    strict: true,
    parameters: {
      type: "object",
      properties: {
        file_path: { type: "string", description: "Path to file, relative to the project root or absolute." },
        offset: { type: "integer", description: "Optional byte offset to start reading from.", minimum: 0 },
        length: { type: "integer", description: "Optional max number of bytes to read.", minimum: 0 },
      },
      required: ["file_path"],
      additionalProperties: false,
    },
  },
  {
    name: "write_file",
    description: "Write a UTF-8 text file to disk (overwrites by default). Creates parent directories if needed.",
    type: "function" as const,
    strict: true,
    parameters: {
      type: "object",
      properties: {
        file_path: { type: "string", description: "Path to file, relative to the project root or absolute." },
        content: { type: "string", description: "UTF-8 content to write." },
        append: { type: "boolean", description: "If true, append instead of overwrite.", default: false },
      },
      required: ["file_path", "content"],
      additionalProperties: false,
    },
  },
];

const instructions =
  "You are a self-improving AI agent built in TypeScript. " +
  "Your own source code is at src/step5.ts — that file contains your tool definitions, " +
  "your executor function, and your main loop. " +
  "You can read files with cat and write files with bash commands. " +
  "You ARE allowed to modify your own source code. " +
  "When you modify yourself, the changes take effect after a restart.";

let previousResponseId: string | undefined;

function ask(prompt: string): Promise<string> {
  return new Promise((resolve) => readLine.question(prompt, resolve));
}

function executeBash(command: string): string {
  try {
    return execSync(command, { encoding: "utf-8", cwd: process.cwd() }).toString();
  } catch (error: any) {
    return "ERROR: " + (error.stderr || error.message);
  }
}

function resolveUserPath(filePath: string): string {
  return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
}

function readFileUtf8(filePath: string, offset?: number, length?: number): string {
  try {
    const abs = resolveUserPath(filePath);
    const buf = fs.readFileSync(abs);
    const start = offset ?? 0;
    const end = length != null ? start + length : buf.length;
    if (start < 0 || end < 0 || start > buf.length) {
      return `ERROR: Invalid offset/length for file of  bytes.`;
    }
    return buf.subarray(start, Math.min(end, buf.length)).toString("utf-8");
  } catch (error: any) {
    return "ERROR: " + (error.message || String(error));
  }
}

function writeFileUtf8(filePath: string, content: string, append = false): string {
  try {
    const abs = resolveUserPath(filePath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    if (append) fs.appendFileSync(abs, content, { encoding: "utf-8" });
    else fs.writeFileSync(abs, content, { encoding: "utf-8" });
    return "OK";
  } catch (error: any) {
    return "ERROR: " + (error.message || String(error));
  }
}

while (true) {
  const input = await ask("You: ");
  if (input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
    console.log("Exiting...");
    break;
  }

  let response = await client.responses.create({
    model: "gpt-5.2",
    instructions,
    input: input,
    tools,
    previous_response_id: previousResponseId,
  });

  while (true) {
    const toolCall = response.output.find((item) => item.type === "function_call");
    if (!toolCall) break;
    const args = JSON.parse(toolCall.arguments);
    let result = "ERROR: Unknown tool";

    if (toolCall.name === "do_bash") {
      console.log("⚡ Running: " + args.command);
      result = executeBash(args.command);
    } else if (toolCall.name === "read_file") {
      console.log("⚡ Reading: " + args.file_path);
      result = readFileUtf8(args.file_path, args.offset, args.length);
    } else if (toolCall.name === "write_file") {
      console.log("⚡ Writing: " + args.file_path + (args.append ? " (append)" : ""));
      result = writeFileUtf8(args.file_path, args.content, args.append);
    }

    response = await client.responses.create({
      model: "gpt-5.2",
      instructions,
      tools,
      previous_response_id: response.id,
      input: [{
        type: "function_call_output" as const,
        call_id: toolCall.call_id,
        output: result,
      }],
    });
  }

  console.log("AI: " + response.output_text);
  previousResponseId = response.id;
}

readLine.close();