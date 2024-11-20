import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { CodeXml, LoaderCircle } from 'lucide-react';
import { Message } from '@/lib/messages';
import { DeepPartial } from 'ai';
import { ArtifactSchema } from '@/lib/schema';

type ChatMessagesProps = {
  messages: Message[];
  isLoading: boolean;
  setPreviewArtifact: (artifact: DeepPartial<ArtifactSchema> | undefined) => void;
};

export const ChatMessages = ({ messages, isLoading, setPreviewArtifact }: ChatMessagesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(messages.at(-1))]);

  return (
    <div ref={containerRef} className="grid gap-2 overflow-y-auto max-w-full max-h-full py-8">
      {messages.map((message, index) => {
        return (
          <div
            key={index}
            style={{
              viewTransitionName: index === 0 ? 'first-message' : undefined,
            }}
            className={clsx(
              'flex flex-col p-4 py-3 whitespace-pre-wrap',
              message.role === 'user'
                ? 'shadow-sm bg-accent dark:bg-white/5 text-accent-foreground dark:text-muted-foreground rounded-2xl gap-4 justify-self-end'
                : ' dark:from-black/30 dark:to-black/50 rounded-xl gap-2 w-fit',
            )}
          >
            {message.content.map((content) => {
              if (content.type === 'text') {
                return content.text;
              }

              return null;
            })}

            {message.object && (
              <div
                onClick={() => {
                  setPreviewArtifact(message.object);
                }}
                className="py-2 pl-2 w-full md:w-max flex items-center border rounded-xl select-none hover:bg-black/5 dark:hover:bg-white/5 hover:cursor-pointer"
              >
                <div className="rounded-[0.5rem] w-10 h-10 bg-black/5 dark:bg-white/5 self-stretch flex items-center justify-center">
                  <CodeXml />
                </div>
                <div className="pl-2 pr-4 flex flex-col">
                  <span className="font-bold font-sans text-sm text-primary">{message.object.title}</span>
                  <span className="font-sans text-sm text-muted-foreground">Show page</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {isLoading && (
        <div className="flex items-center pl-4 gap-1 text-sm text-muted-foreground">
          <LoaderCircle strokeWidth={2} className="animate-spin w-4 h-4" />
          <span>Generating...</span>
        </div>
      )}
    </div>
  );
};
