import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArtifactSchema } from '@/lib/schema';
import { DeepPartial } from 'ai';
import {
  ChevronsRight,
  LoaderCircle,
  Laptop,
  Phone,
  Maximize2,
  Minimize2,
  Smartphone,
  Download,
  Copy,
} from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { Code } from '@/components/Code';
import { Preview } from '@/components/Preview';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import BrowserWindow from '@/components/BrowserWindow';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { clsx } from 'clsx';

type ArtifactProps = {
  isLoading: boolean;
  artifact?: DeepPartial<ArtifactSchema>;
};

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export function Artifact({ isLoading, artifact }: ArtifactProps) {
  const [selectedTab, onSelectedTabChange] = useState<'code' | 'preview'>('code');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop');

  if (!artifact) return null;

  const handleDownload = () => {
    if (artifact.code) {
      download(`${artifact.title}.html`, artifact.code);
    }
  };

  const handleCopy = () => {
    if (artifact.code) {
      navigator.clipboard.writeText(artifact.code);
    }
  };

  return (
    <div
      style={{
        viewTransitionName: 'artifact',
      }}
      className={clsx(
        `relative top-0 left-0 shadow-2xl rounded-tl-3xl bl-3xl border-l border-y bg-popover h-full w-full overflow-auto`,
        isLoading && 'border-l-transparent border-y-transparent animate-glow',
      )}
    >
      <div className={clsx(`absolute inset-0 pointer-events-none`, isLoading && 'animate-glowInset')} />

      <Tabs
        value={selectedTab}
        onValueChange={(value) => onSelectedTabChange(value as 'code' | 'preview')}
        className="h-full flex flex-col items-start justify-start"
      >
        <div className="w-full py-2 pl-6 pr-2 border-b flex">
          {/*<div>{isChatLoading && <LoaderCircle strokeWidth={3} className="h-3 w-3 animate-spin" />}</div>*/}

          <div className="flex gap-2 flex-grow">
            <TabsList className="px-1 py-0 border h-8">
              <TabsTrigger className="font-normal text-xs py-1 px-2 gap-1 flex items-center" value="code">
                Source code
              </TabsTrigger>
              <TabsTrigger className="font-normal text-xs py-1 px-2 gap-1 flex items-center" value="preview">
                Preview
              </TabsTrigger>
            </TabsList>
          </div>

          {selectedTab === 'code' && (
            <div className="flex justify-end gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleCopy} disabled={isLoading}>
                      <Copy />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleDownload} disabled={isLoading}>
                      <Download />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {selectedTab === 'preview' && (
            <div className="flex justify-end gap-4">
              <ToggleGroup
                type="single"
                value={previewMode}
                onValueChange={(value) => setPreviewMode(value as 'mobile' | 'desktop')}
              >
                <ToggleGroupItem value="desktop">
                  <Laptop />
                </ToggleGroupItem>
                <ToggleGroupItem value="mobile">
                  <Smartphone />
                </ToggleGroupItem>
              </ToggleGroup>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Maximize2 />
                  </Button>
                </DialogTrigger>
                <DialogTitle />
                <DialogContent className="max-w-[1200px] p-0 rounded-xl overflow-hidden">
                  <BrowserWindow className="w-full h-full max-h-[calc(100vh-168px)]">
                    <Preview html={artifact.code ?? ''} />
                  </BrowserWindow>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        <div className="overflow-y-auto w-full h-full">
          <TabsContent value="code" className="h-full">
            {artifact.code && <Code code={artifact.code} />}
          </TabsContent>
          <TabsContent value="preview" className="h-full bg-gray-50">
            <div className={`h-full ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
              <Preview html={artifact.code ?? ''} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
