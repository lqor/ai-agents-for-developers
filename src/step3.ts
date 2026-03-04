import "dotenv/config";
import readline from "readline";
import OpenAI from "openai";
import { execSync } from "child_process";

const client = new OpenAI();

const readLine = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout 
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
        }
    }
]

let previousResponseId: string | undefined;

function ask(prompt: string): Promise<string> {
  return new Promise((resolve) => readLine.question(prompt, resolve));
}

function executeBash(command: string): string {
  return execSync(command, { encoding: "utf-8" }).toString();
}

while(true) {
    const input = await ask("You: ");

    if (input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
        console.log("Exiting...");
        break;
    }

    const response = await client.responses.create({
        model: "gpt-5.2",
        input: input,
        tools,
        previous_response_id: previousResponseId,
    });

    const toolCall = response.output.find((item) => item.type === "function_call");

    if (toolCall) {
        const args = JSON.parse(toolCall.arguments);
        console.log("⚡ Running: " + args.command);
        console.log(executeBash(args.command));
    } else {
        console.log("AI: " + response.output_text);
    }

    previousResponseId = response.id;
}

readLine.close();