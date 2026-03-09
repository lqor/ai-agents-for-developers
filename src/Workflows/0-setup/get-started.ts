import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.2",
  input: "How's life?",
});

console.log(response);
