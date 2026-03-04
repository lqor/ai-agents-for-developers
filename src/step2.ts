import "dotenv/config";
import readline from "readline";
import OpenAI from "openai";

const client = new OpenAI();

const readLine = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout 
});

let previousResponseId: string | undefined;

function ask(prompt: string): Promise<string> {
  return new Promise((resolve) => readLine.question(prompt, resolve));
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
        previous_response_id: previousResponseId,
    });

    console.log("AI: " + response.output_text);

    previousResponseId = response.id;
}

readLine.close();