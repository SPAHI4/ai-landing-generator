import { CoreMessage, streamObject } from 'ai';
import { systemPrompt } from '@/lib/prompt';
import { openai } from '@ai-sdk/openai';
import { schema } from '@/lib/schema';

export const maxDuration = 60;

export async function POST(req: Request) {
  const {
    messages,
  }: {
    messages: CoreMessage[];
  } = await req.json();

  const stream = await streamObject({
    model: openai('gpt-4o'),
    schema,
    system: systemPrompt(),
    messages,
    mode: 'auto',
  });

  return stream.toTextStreamResponse();
}
