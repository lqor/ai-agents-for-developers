import "dotenv/config";
import OpenAI from "openai";
import readline from "readline";
import { execSync } from "child_process";

const client = new OpenAI();

const readLine = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout 
});

const tools = [
    {
        name: "do_bash",
        description: "Execute a bash command and return the output",
        type: "function" as const,
        strict: true,
        parameters: {
            type: "object",
            properties: {
                command: { type: "string"}
            },
            required: ["command"],
            additionalProperties: false
        }
    }
];

// {"ls -la"}

let previousResponseId: string | undefined;

function ask(prompt: string): Promise<string> {
  return new Promise((resolve) => readLine.question(prompt, resolve));
}

function executeBash(command: string): string {
  return execSync(command, { encoding: "utf-8" }).toString();
}

while(true) {
    const input = await ask("You: ");

    if(input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
        console.log("Exiting...");
        break;
    }

    let response = await client.responses.create({
        model: "gpt-5.2",
        input: input,
        tools,
        previous_response_id: previousResponseId,
    });

    while(true) {
        const toolCall = response.output.find((item) => item.type === "function_call");

        if(!toolCall) {
            break;
        }

        const args = JSON.parse(toolCall.arguments);
        console.log("Executing command: " + args.command);
        const result = executeBash(args.command);
        console.log(result);

        response = await client.responses.create({
            model: "gpt-5.2",
            tools,
            previous_response_id: response.id,
            input: [{
                type: "function_call_output" as const,
                call_id: toolCall.call_id,
                output: result,
            }],
        });
    }

    previousResponseId = response.id;
}

readLine.close();