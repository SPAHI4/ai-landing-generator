'use client';

import html from 'react-syntax-highlighter/dist/esm/languages/prism/xml-doc';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { PrismAsyncLight } from 'react-syntax-highlighter';

PrismAsyncLight.registerLanguage('html', html);

const codeStyle = {
  ...atomDark,
  fontSize: 12,
};

const customStyle = {
  borderRadius: 0,
  height: '100%',
  fontSize: 12,
};

export function Code({ code }: { code: string }) {
  return (
    // @ts-expect-error types are not compatible
    <PrismAsyncLight language="html" style={codeStyle} customStyle={customStyle}>
      {code}
    </PrismAsyncLight>
  );
}
