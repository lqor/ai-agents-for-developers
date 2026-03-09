import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

// Custom tool - the SDK handles the JSON schema generation from Zod
const getWeather = tool({
  name: "get_weather",
  description: "Get the current weather for a city",
  parameters: z.object({
    city: z.string().describe("The city name"),
    unit: z.enum(["celsius", "fahrenheit"]).describe("Temperature unit"),
  }),
  // This is the execute function - runs when the agent calls the tool
  execute: async ({ city, unit }) => {
    // In a real app, you'd call an API here
    const mockData: Record<string, number> = {
      tokyo: 22,
      london: 14,
      munich: 8,
      kyiv: 11,
    };
    const temp = mockData[city.toLowerCase()] ?? 20;
    const converted =
      unit === "fahrenheit" ? Math.round(temp * 1.8 + 32) : temp;
    return `${city}: ${converted}°${unit === "celsius" ? "C" : "F"}, partly cloudy`;
  },
});

const agent = new Agent({
  name: "Weather assistant",
  instructions:
    "You help users check the weather. Always use celsius unless asked otherwise.",
  tools: [getWeather],
});

const result = await run(
  agent,
  "What is the weather in Munich and Kyiv right now?"
);

console.log(result.finalOutput);