import { useState, useEffect } from 'react';
import { ChevronDown, Save, X } from 'lucide-react';

const subcategoryDescriptions = {
  'lightsticks': {
    name: 'Light Sticks KPOP',
    placeholder: 'Entrez la description pour les lightsticks...',
    defaultDescription: `Il y a longtemps, lorsque les idoles de la première génération comme g.o.d, S.E.S ou Shinhwa sont apparues, la meilleure façon de démontrer l'unité des fans avec leurs artistes favoris était de porter une tenue aux couleurs du groupe officiel. Puis les modestes fanfares se sont manifestées. Mais l'époque où l'on utilisait un simple bâton lumineux lors du concert est déjà révolue. Aujourd'hui, nous avons quelque chose de plus sophistiqué et nous pouvons distinguer les fandoms des différents groupes. Les lightsticks KPOP sont ce dont nous voulons tous être équipés lorsque nous assistons à un concert ou à un autre événement et que nous encourageons nos artistes préférés.

Les Lightsticks existent en différentes formes et tailles et sont spécialement conçus pour représenter ce qui vient à l'esprit lorsqu'on pense à un groupe particulier. Ils incorporent souvent les couleurs officielles du groupe, son logo ou son nom, ce qui nous permet de savoir instantanément à quel artiste appartient réellement le Lightstick. En regardant le Candy Bong Z par exemple, nous pouvons immédiatement repérer le logo de Twice qui indique clairement que le groupe de filles de JYP Entertainment en est le propriétaire. Le bâton lumineux officiel d'Astro porte le logo de l'artiste en tête de l'article et nous pouvons remarquer que le fanlight a été préparé spécialement pour eux juste après un regard. Parfois, le design évolue au fil du temps - BTS a déjà sorti plusieurs Army Bomb - le dernier en date est la Special Edition Map Of The Soul.

Quoi de mieux qu'un Lightstick KPOP pour démontrer l'amour des fans pour leurs artistes préférés ? C'est le symbole de l'unité et de la dévotion. Même si un fan n'a pas la possibilité d'assister au concert et d'utiliser le bâton lumineux sur place, il décide souvent de l'acheter quand même et de le garder comme objet de collection. Il peut ainsi devenir un objet très spécial et personnel à posséder.

Spécification des Lightsticks KPOP
La lampe à ventilateur KPop typique est alimentée par 3 (parfois 2) piles alcalines AAA qui sont cachées dans un compartiment spécial à l'intérieur de la poignée. Parfois, les piles AAA sont remplacées par une pile interne (comme dans le cas du Day6 Official Light Band). Elles peuvent produire une lumière généralement de couleur blanche ou des couleurs liées à un groupe ou à un soliste Kpop particulier et peuvent fonctionner selon différents modes, y compris le clignotement et le scintillement. Le temps de travail est compris entre 4 et 7 heures. Vous devez donc toujours vous souvenir d'un nouveau jeu de piles lorsque vous vous préparez pour un concert. La lumière rouge qui sort de votre Lightstick peut indiquer qu'il est temps de changer les piles.

Dans l'emballage, vous trouverez souvent quelques accessoires comme une dragonne ou un sac en feutre. Moins souvent, les piles AAA seront incluses. Vous recevrez toujours un manuel d'utilisation avec des conseils sur l'utilisation du produit acheté et une garantie. Parfois, un bonus est également ajouté, comme un jeu de 6 cartes photo qui vient avec la première version du GFriend's Glass Marble Stick ou une carte photo aléatoire que vous trouverez avec le Jigu Bong du SF9.

Lightstick Bluetooth
Au fil du temps, de nouvelles fonctionnalités sont ajoutées aux Lightsticks. Aujourd'hui, il est possible de connecter votre fanlight à un smartphone (avec Android ou iOS) via une connexion Bluetooth. Cela peut s'avérer utile sur le lieu de l'événement, lors de l'appariement du bâton à votre numéro de siège et de sa connexion à la commande centrale. Cela permettra de créer une variété de beaux effets de lumière.

Une connexion Bluetooth peut permettre de contrôler le Lightstick via une application spéciale préparée spécialement pour cet objet. En plus d'aider à entrer les informations sur le siège pendant le concert, elle peut également activer différents effets de couleur et débloquer des modes supplémentaires. Un exemple parfait est l'application Seventeen créée pour leur Carat Bong. Elle peut être téléchargée gratuitement en ligne.

Les autres fonctionnalités intéressantes ont également été intégrées. Le Lightstick officiel de Mamamoo peut vibrer de manière à donner aux personnes malentendantes et malvoyantes le signal qui leur permettra d'applaudir aux côtés des autres fans.

Bien entendu, tous les groupes de la Kpop ne peuvent pas avoir leur propre Lightstick. Cela dépend toujours de la taille du groupe et de sa capacité à organiser un grand événement, comme un concert solo, un spectacle ou une réunion de fans. Certains fans attendent toujours que ce soit le cas, comme le fan club de la CLC par exemple. Si vous êtes un fan d'un groupe qui possède déjà son bâton lumineux KPop, vous pouvez généralement l'acheter sur le lieu du concert ou de l'événement ou dans plusieurs magasins en ligne.`
  },
  'bestsellers': {
    name: 'Best Sellers',
    placeholder: 'Entrez la description pour les best sellers...',
    defaultDescription: ''
  },
  'groupes': {
    name: 'Nos Groupes KPOP',
    placeholder: 'Entrez la description pour les groupes...',
    defaultDescription: ''
  },
  'huntrix': {
    name: 'Huntrix',
    placeholder: 'Entrez la description pour Huntrix...',
    defaultDescription: ''
  }
};

export default function AdminSubcategoryDescriptionPage() {
  const [descriptions, setDescriptions] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('lightsticks');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [expandedCategory, setExpandedCategory] = useState('lightsticks');

  useEffect(() => {
    // Charger les descriptions depuis le localStorage (ou API backend)
    const saved = localStorage.getItem('subcategory_descriptions');
    if (saved) {
      setDescriptions(JSON.parse(saved));
    } else {
      // Initialiser avec les descriptions par défaut
      const initial = {};
      Object.keys(subcategoryDescriptions).forEach(key => {
        initial[key] = subcategoryDescriptions[key].defaultDescription;
      });
      setDescriptions(initial);
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Sauvegarder dans le localStorage pour l'instant
      localStorage.setItem('subcategory_descriptions', JSON.stringify(descriptions));
      
      // TODO: Appel API backend pour sauvegarder les descriptions
      // const response = await fetch('/api/categories/descriptions', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(descriptions)
      // });
      
      setSaveMessage('✓ Descriptions sauvegardées avec succès');
      setIsEditing(false);
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('✗ Erreur lors de la sauvegarde');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTextChange = (category, text) => {
    setDescriptions(prev => ({
      ...prev,
      [category]: text
    }));
  };

  const resetToDefault = (category) => {
    setDescriptions(prev => ({
      ...prev,
      [category]: subcategoryDescriptions[category].defaultDescription
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Gestion des Descriptions de Catégories
          </h1>
          <p className="text-gray-600">
            Ajoutez des descriptions pour les sous-catégories qui s'afficheront en bas de la page des produits
          </p>
        </div>

        {/* Messages */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg font-semibold ${
            saveMessage.startsWith('✓') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {saveMessage}
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-4">
          {Object.entries(subcategoryDescriptions).map(([key, config]) => (
            <div key={key} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-gray-900">{config.name}</h2>
                  <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {descriptions[key]?.length || 0} caractères
                  </span>
                </div>
                <ChevronDown 
                  size={20} 
                  className={`transition-transform ${expandedCategory === key ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Category Content */}
              {expandedCategory === key && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 space-y-4">
                  <textarea
                    value={descriptions[key] || ''}
                    onChange={(e) => handleTextChange(key, e.target.value)}
                    placeholder={config.placeholder}
                    className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251] resize-none font-mono text-sm"
                  />
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => resetToDefault(key)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Réinitialiser
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory(key);
                        setIsEditing(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-[#5E2251] bg-[#f5f0f2] rounded-lg hover:bg-[#5E2251] hover:text-white transition-colors"
                    >
                      Editer
                    </button>
                  </div>

                  {/* Preview */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">APERÇU:</p>
                    <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                      {descriptions[key]?.substring(0, 200)}...
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex gap-3 sticky bottom-8">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-[#5E2251] text-white font-bold rounded-lg hover:bg-[#4a1a3e] transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder les descriptions'}
          </button>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
