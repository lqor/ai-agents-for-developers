import { Agent, run } from '@openai/agents';

const agent = new Agent({
  name: 'Haiku Agent',
  instructions: 'Always respond in haiku form.', // system prompt
  model: 'gpt-5.4',
});

const result = await run(agent, 'How are you?');
console.log(result.finalOutput);