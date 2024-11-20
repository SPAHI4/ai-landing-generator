import { useState, useEffect, useRef, memo } from 'react';

const customHtml = `
        <script>
          document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
              e.preventDefault();
              const href = e.target.getAttribute('href');
              if (href && href.startsWith('#')) {
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
              }
            }
          });
        </script>
`;

function isValidHtml(html: string) {
  return html.trim().endsWith('/>') || /<\/[a-z0-9]+>\s*$/i.test(html);
}

export const Preview = memo(function Preview({ html }: { html: string }) {
  const [validHtml, setValidHtml] = useState(html);

  useEffect(() => {
    if (isValidHtml(html)) {
      const modifiedHtml = html + customHtml;
      setValidHtml(modifiedHtml);
    }
  }, [html]);

  return (
    <iframe
      sandbox="allow-scripts allow-same-origin"
      className="w-full min-h-screen cursor-pointer"
      srcDoc={validHtml}
      loading="lazy"
    />
  );
});
