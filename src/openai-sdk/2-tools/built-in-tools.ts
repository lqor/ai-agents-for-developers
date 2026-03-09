import {
  Agent,
  run,
  codeInterpreterTool,
  webSearchTool,
} from '@openai/agents';

const agent = new Agent({
  name: 'Travel assistant',
  model: 'gpt-5.2',
  tools: [
    webSearchTool({ searchContextSize: 'medium' }),
    codeInterpreterTool()
  ],
});

const result = await run(
  agent,
  'I want to plan a trip to Japan. What are the top 5 attractions in Tokyo? Find me some recent photos of those attractions.'
);

console.log(result.finalOutput);