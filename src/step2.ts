import "dotenv/config";
import readline from "readline";
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.2",
  input: "ping",
});

console.log(response.output_text);