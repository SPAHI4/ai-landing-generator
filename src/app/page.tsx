'use client';

import { experimental_useObject as useObject } from 'ai/react';
import { ArtifactSchema, schema } from '@/lib/schema';
import { useEffect, useRef, useState } from 'react';
import { DeepPartial } from 'ai';
import { ChatInput } from '@/components/ChatInput';
import { Message, toAISDKMessages } from '@/lib/messages';
import { Artifact } from '@/components/Artifact';
import { ChatMessages } from '@/components/ChatMessages';

function usePrevEffect<TDeps extends React.DependencyList>(
  effect: (prev: TDeps) => void | (() => void),
  deps: TDeps,
): void {
  const prevDeps = useRef<TDeps>(deps);

  useEffect(() => {
    const cleanupFn = prevDeps.current ? effect(prevDeps.current) : undefined;

    prevDeps.current = deps;

    return cleanupFn;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default function Home() {
  const [chatInput, setChatInput] = useState('');
  const [artifact, setArtifact] = useState<DeepPartial<ArtifactSchema>>();
  const [messages, setMessages] = useState<Message[]>([]);
  const { object, submit, isLoading, stop, error } = useObject({
    api: '/api/chat',
    schema,
  });

  const lastMessage = messages.at(-1);

  function addMessage(message: Message) {
    setMessages((previousMessages) => [...previousMessages, message]);
    return [...messages, message];
  }

  function setMessage(message: Partial<Message>, index?: number) {
    setMessages((previousMessages) => {
      const updatedMessages = [...previousMessages];
      updatedMessages[index ?? previousMessages.length - 1] = {
        ...previousMessages[index ?? previousMessages.length - 1],
        ...message,
      };

      return updatedMessages;
    });
  }

  usePrevEffect(
    ([prevObject]) => {
      if (object) {
        if (prevObject == null && object) {
          // smooth transition for the input
          document.startViewTransition(() => {
            setArtifact(object);
          });
        } else {
          setArtifact(object);
        }

        const content: Message['content'] = [
          { type: 'text', text: object.commentary || '' },
          { type: 'code', text: object.code || '' },
        ];

        if (!lastMessage || lastMessage.role !== 'assistant') {
          addMessage({
            role: 'assistant',
            content,
            object,
          });
        }

        if (lastMessage && lastMessage.role === 'assistant') {
          setMessage({
            content,
            object,
          });
        }
      }
    },
    [object],
  );

  useEffect(() => {
    if (error) stop();
  }, [error, stop]);

  function retry() {
    submit({
      messages: toAISDKMessages(messages),
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isLoading) {
      stop();
    }

    const content: Message['content'] = [{ type: 'text', text: chatInput }];

    const updatedMessages = addMessage({
      role: 'user',
      content,
    });

    submit({
      messages: toAISDKMessages(updatedMessages),
    });

    setChatInput('');
  }

  function handleSaveInputChange(input: string) {
    setChatInput(input);
  }

  return (
    <main className="flex min-h-screen max-h-screen">
      <div className="grid w-full grid-cols-[600px_1fr]">
        <div
          className={`flex flex-col w-full max-h-full max-w-[800px] mx-auto p-4 overflow-auto ${artifact ? 'col-span-1' : 'col-span-2'}`}
        >
          <ChatMessages messages={messages} isLoading={isLoading} setPreviewArtifact={setArtifact} />

          <ChatInput
            isInitialized={messages.length > 0}
            retry={retry}
            isErrored={error !== undefined}
            isLoading={isLoading}
            stop={stop}
            input={chatInput}
            handleInputChange={handleSaveInputChange}
            handleSubmit={handleSubmit}
            followUps={(artifact?.followUps as string[]) ?? []}
          />
        </div>

        {artifact && <Artifact artifact={artifact} isLoading={isLoading} />}
      </div>
    </main>
  );
}
