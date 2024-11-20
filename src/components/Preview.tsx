import { useEffect, useRef, memo } from 'react';

export const Preview = memo(function Preview({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDocument) return;

    iframeDocument.open();
    iframeDocument.write(html);
    iframeDocument.close();

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        e.preventDefault();
        const href = target.getAttribute('href');
        if (href?.startsWith('#')) {
          iframeDocument.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    iframeDocument.addEventListener('click', handleClick);

    return () => {
      iframeDocument.removeEventListener('click', handleClick);
    };
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts allow-same-origin"
      className="w-full h-full cursor-pointer bg-white"
      loading="lazy"
    />
  );
});
