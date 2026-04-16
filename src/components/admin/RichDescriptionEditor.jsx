import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, EyeOff } from 'lucide-react';

export const RichDescriptionEditor = ({ value, onChange, placeholder = "Décrivez votre produit..." }) => {
  const [showPreview, setShowPreview] = useState(false);

  const markdownHelp = [
    { syntax: '# Titre 1', example: 'Titre principal' },
    { syntax: '## Titre 2', example: 'Sous-titre' },
    { syntax: '**texte gras**', example: 'Texte important' },
    { syntax: '*texte italique*', example: 'Texte en italique' },
    { syntax: '- Item 1\n- Item 2', example: 'Liste à puces' },
    { syntax: '1. Item 1\n2. Item 2', example: 'Liste numérotée' },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs sm:text-sm font-medium text-gray-700">
          Description Détaillée (Markdown supporté)
        </label>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
        >
          {showPreview ? (
            <>
              <EyeOff size={14} /> Édition
            </>
          ) : (
            <>
              <Eye size={14} /> Aperçu
            </>
          )}
        </button>
      </div>

      {!showPreview ? (
        <div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm font-mono"
            rows="8"
          />
          
          {/* Aide Markdown */}
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">💡 Guide Markdown:</p>
            <div className="grid grid-cols-2 gap-2">
              {markdownHelp.map((item, idx) => (
                <div key={idx} className="text-xs">
                  <code className="bg-white px-1 py-0.5 rounded border border-gray-200 font-mono">
                    {item.syntax.split('\n')[0]}
                  </code>
                  <span className="text-gray-600 ml-1">→ {item.example}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full min-h-[300px] p-4 border border-gray-300 rounded-lg bg-white prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-3 mt-4 text-gray-900" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2 mt-3 text-gray-800" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 text-gray-800" {...props} />,
              p: ({ node, ...props }) => <p className="mb-2 text-gray-700 leading-relaxed" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 text-gray-700" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 text-gray-700" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1 text-gray-700" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
              em: ({ node, ...props }) => <em className="italic text-gray-800" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-purple-600 pl-3 italic text-gray-700 my-2" {...props} />
              ),
            }}
          >
            {value}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};
