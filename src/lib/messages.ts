import { DeepPartial } from 'ai';
import { ArtifactSchema } from '@/lib/schema';

export type MessageText = {
  type: 'text';
  text: string;
};

export type MessageCode = {
  type: 'code';
  text: string;
};

export type Message = {
  role: 'assistant' | 'user';
  content: Array<MessageText | MessageCode>;
  object?: DeepPartial<ArtifactSchema>;
};

export function toAISDKMessages(messages: Message[]) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content.map((content) => {
      if (content.type === 'code') {
        return {
          type: 'text',
          text: content.text,
        };
      }

      return content;
    }),
  }));
}
