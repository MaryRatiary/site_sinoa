import React from 'react';
import ReactMarkdown from 'react-markdown';

export const ProductDescriptionRenderer = ({ description }) => {
  if (!description) {
    return null;
  }

  return (
    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 mt-6 text-gray-900" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3 mt-5 text-gray-800" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2 mt-4 text-gray-800" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-lg font-bold mb-2 mt-3 text-gray-800" {...props} />,
          p: ({ node, ...props }) => <p className="mb-3 text-gray-700 leading-relaxed" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700" {...props} />,
          li: ({ node, ...props }) => <li className="text-gray-700" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-gray-800" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-purple-600 pl-4 italic text-gray-700 my-4 bg-purple-50 py-2 pr-4 rounded" {...props} />
          ),
          code: ({ node, inline, ...props }) => 
            inline ? (
              <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm text-red-600" {...props} />
            ) : (
              <code className="block bg-gray-900 text-gray-100 p-4 rounded mb-3 overflow-x-auto font-mono text-sm" {...props} />
            ),
          a: ({ node, ...props }) => <a className="text-purple-600 hover:text-purple-700 underline" {...props} />,
          hr: ({ node, ...props }) => <hr className="my-4 border-t-2 border-gray-300" {...props} />,
        }}
      >
        {description}
      </ReactMarkdown>
    </div>
  );
};
