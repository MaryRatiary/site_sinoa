import { useState, useEffect } from 'react';

const categoryDescriptions = {
  'lightsticks': {
    name: 'Light Sticks KPOP',
    description: `Il y a longtemps, lorsque les idoles de la première génération comme g.o.d, S.E.S ou Shinhwa sont apparues, la meilleure façon de démontrer l'unité des fans avec leurs artistes favoris était de porter une tenue aux couleurs du groupe officiel. Puis les modestes fanfares se sont manifestées. Mais l'époque où l'on utilisait un simple bâton lumineux lors du concert est déjà révolue. Aujourd'hui, nous avons quelque chose de plus sophistiqué et nous pouvons distinguer les fandoms des différents groupes. Les lightsticks KPOP sont ce dont nous voulons tous être équipés lorsque nous assistons à un concert ou à un autre événement et que nous encourageons nos artistes préférés.

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
    description: ''
  },
  'groupes': {
    name: 'Nos Groupes KPOP',
    description: ''
  },
  'huntrix': {
    name: 'Huntrix',
    description: ''
  }
};

export default function CategoryDescriptionSection({ categoryType }) {
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Chercher la description depuis le localStorage d'abord
    const saved = localStorage.getItem('subcategory_descriptions');
    if (saved) {
      const savedDescriptions = JSON.parse(saved);
      if (savedDescriptions[categoryType]) {
        setDescription(savedDescriptions[categoryType]);
        return;
      }
    }

    // Sinon utiliser la description par défaut
    if (categoryDescriptions[categoryType]) {
      setDescription(categoryDescriptions[categoryType].description);
    }
  }, [categoryType]);

  // Ne pas afficher si aucune description
  if (!description) {
    return null;
  }

  return (
    <div className="w-full bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="prose prose-sm max-w-none">
          <div className="space-y-4">
            {description.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed text-justify">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
