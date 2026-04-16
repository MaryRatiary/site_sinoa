import { useState } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownEditor({ value, onChange, placeholder = "Entrez votre contenu..." }) {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyTemplate = () => {
    const template = `# Titre Principal

## Section 1
Votre texte ici avec une description détaillée.

### Sous-section
- Point 1
- Point 2
- Point 3

## Section 2
Contenu supplémentaire...

**Texte en gras** | *Texte en italique*

Citation ou point important`;
    
    onChange(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              !showPreview
                ? 'bg-purple-900 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Éditer
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              showPreview
                ? 'bg-purple-900 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showPreview ? <Eye size={18} /> : <EyeOff size={18} />}
            Aperçu
          </button>
        </div>
        <button
          type="button"
          onClick={copyTemplate}
          className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all text-sm font-medium"
        >
          {copied ? (
            <>
              <Check size={16} />
              Copié !
            </>
          ) : (
            <>
              <Copy size={16} />
              Modèle
            </>
          )}
        </button>
      </div>

      {/* Editor or Preview */}
      {!showPreview ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900 transition-all font-mono text-sm"
          rows="12"
        />
      ) : (
        <div className="bg-white border border-gray-300 rounded-lg p-6 prose prose-sm max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-purple-900 mt-6 mb-4" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-purple-900 mt-5 mb-3" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold text-purple-900 mt-4 mb-2" {...props} />,
              p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 text-gray-700" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 text-gray-700" {...props} />,
              li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
              code: ({node, ...props}) => <code className="bg-gray-100 px-2 py-1 rounded text-purple-900 font-mono text-sm" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-900 pl-4 italic text-gray-600" {...props} />,
            }}
          >
            {value || placeholder}
          </ReactMarkdown>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-bold text-amber-900 mb-3">📝 Guide du Markdown</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <code className="bg-amber-100 px-2 py-1 rounded text-amber-900 font-mono"># Titre</code>
            <p className="text-amber-800 mt-1">Titre principal</p>
          </div>
          <div>
            <code className="bg-amber-100 px-2 py-1 rounded text-amber-900 font-mono">## Sous-titre</code>
            <p className="text-amber-800 mt-1">Sous-titre</p>
          </div>
          <div>
            <code className="bg-amber-100 px-2 py-1 rounded text-amber-900 font-mono">**gras**</code>
            <p className="text-amber-800 mt-1">Texte en gras</p>
          </div>
          <div>
            <code className="bg-amber-100 px-2 py-1 rounded text-amber-900 font-mono">*italique*</code>
            <p className="text-amber-800 mt-1">Texte en italique</p>
          </div>
          <div>
            <code className="bg-amber-100 px-2 py-1 rounded text-amber-900 font-mono">- Liste</code>
            <p className="text-amber-800 mt-1">Listes à puces</p>
          </div>
          <div>
            <code className="bg-amber-100 px-2 py-1 rounded text-amber-900 font-mono">Citation</code>
            <p className="text-amber-800 mt-1">Citation/Blockquote</p>
          </div>
        </div>
      </div>
    </div>
  );
}
