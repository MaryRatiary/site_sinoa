import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const input = `<meta charset="utf-8">
<p>Pourquoi tu vas adorer</p>
<p>Tissu respirant</p>
<p>| Taille | Épaules | Poitrine | Longueur | Manches |</p>
<p>|---|---|---|---|---|</p>
<p>| 110 | 35 | 36 | 77 | 34 |</p>
<p>| 120 | 37.5 | 37.5 | 80 | 37.5 |</p>
`;

const cleanMarkdown = input
  .replace(/<meta[^>]*>/gi, '')
  .replace(/<\/?span[^>]*>/gi, '')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/p>\s*<p>/gi, '\n')
  .replace(/<\/?p[^>]*>/gi, '\n')
  .replace(/&nbsp;/g, ' ')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&')
  .replace(/\\n/g, '\n')
  .replace(/\\r/g, '')
  .replace(/\n{3,}/g, '\n\n')
  .replace(/\|\s*\n+\s*\|/g, '|\n|')
  .trim();

function App() {
  return React.createElement(
    ReactMarkdown,
    {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeRaw],
      components: {
        table: ({ node, ...props }) => React.createElement('table', { className: 'custom-table', ...props }),
      }
    },
    cleanMarkdown
  );
}

console.log("CLEANED MARKDOWN -----");
console.log(cleanMarkdown);
console.log("HTML -----");
console.log(renderToString(React.createElement(App)));
