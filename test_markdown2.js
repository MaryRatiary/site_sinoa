import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const markdown = `<p>| Taille | Épaules | Poitrine | Longueur | Manches |</p>
<p>|---|---|---|---|---|</p>
<p>| 110 | 35 | 36 | 77 | 34 |</p>
<p>| 120 | 37.5 | 37.5 | 80 | 37.5 |</p>`;

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
    markdown
  );
}

console.log(renderToString(React.createElement(App)));
