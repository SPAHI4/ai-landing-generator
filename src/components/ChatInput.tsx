import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowUp, Square } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { Badge } from '@/components/ui/badge';

const defaultSuggestions = {
  'Landing page for coffee recommendation app':
    "I need a sleek page for my AI-powered coffee recommendation app. It should include a hero section describing the app, features overview, user testimonials, subscription plans, and an 'About Us' section with articles about our mission and team.",

  'E-commerce product showcase page':
    'Create a visually appealing product showcase page for an online store. Include high-resolution product images, detailed descriptions, pricing information, customer reviews, related products carousel, and a clear call-to-action for purchasing.',

  'Personal portfolio website homepage':
    'Design a modern homepage for a personal portfolio website. It should feature a welcome banner, a brief bio, highlights of key projects with thumbnails, skills section, contact information, and links to social media profiles.',

  'Blog article template page':
    'Generate a clean and readable blog article template. Include a title section, author bio, publication date, main content area with support for images and videos, related posts section, and a comments area for user engagement.',

  'SaaS product landing page':
    'Develop a professional landing page for a SaaS product. It should have a compelling headline, features and benefits sections, pricing tiers, customer testimonials, a demo video, and a prominent sign-up form.',
};

type ChatInputProps = {
  retry: () => void;
  isErrored: boolean;
  isLoading: boolean;
  stop: () => void;
  input: string;
  handleInputChange: (string: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isInitialized: boolean;
  followUps: string[];
};

export function ChatInput({
  retry,
  isErrored,
  isLoading,
  stop,
  input,
  handleInputChange,
  handleSubmit,
  isInitialized,
  followUps,
}: ChatInputProps) {
  function onEnter(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (e.currentTarget.checkValidity()) {
        handleSubmit(e);
      } else {
        e.currentTarget.reportValidity();
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e.target.value);
  };

  const suggestions = isInitialized
    ? followUps.map((followUp) => ({ label: followUp, value: followUp }))
    : Object.entries(defaultSuggestions).map(([label, value]) => ({ label, value }));

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={onEnter}
      className="mb-2 flex flex-col mt-auto bg-background"
      style={{
        viewTransitionName: 'chat-input',
      }}
    >
      {isErrored && (
        <div className="flex items-center p-1.5 text-sm font-medium mb-2 rounded-xl bg-red-400/10 text-red-400">
          <span className="flex-1 px-1.5">Error: Something went wrong. Please try again later.</span>
          <button className="px-2 py-1 rounded-sm bg-red-400/20" onClick={retry}>
            Try again
          </button>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 py-2 mb-2">
          {suggestions.map((suggestion) => (
            <Badge
              className="hover:bg-gray-100 cursor-pointer"
              variant="outline"
              key={suggestion.label}
              onClick={() => handleInputChange(suggestion.value)}
            >
              {suggestion.label}
            </Badge>
          ))}
        </div>
      )}
      <div className="shadow-md rounded-2xl border">
        <TextareaAutosize
          autoFocus={true}
          minRows={1}
          maxRows={5}
          className="text-normal px-4 py-3 resize-none ring-0 bg-inherit w-full m-0 outline-none"
          required={true}
          placeholder={isInitialized ? 'Ask a follow-up...' : 'Describe your app...'}
          disabled={isErrored}
          value={input}
          onChange={handleChange}
        />
        <div className="flex p-3 justify-end">
          {!isLoading ? (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    disabled={isErrored}
                    variant="default"
                    size="icon"
                    type="submit"
                    className="rounded-xl h-10 w-10"
                  >
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send message</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-xl h-10 w-10"
                    onClick={(e) => {
                      e.preventDefault();
                      stop();
                    }}
                  >
                    <Square className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Stop generation</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </form>
  );
}
