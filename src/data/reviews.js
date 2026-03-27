const reviews = [
  {
    id: 1,
    author: "Sophie Martin",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    date: "2026-03-15",
    title: "Excellente qualité !",
    content: "Je suis très impressionnée par la qualité de ce produit. C'est exactement ce que j'attendais. La livraison a été rapide et le produit bien emballé. Je recommande vivement !",
    verified: true,
    helpful: 24,
    images: []
  },
  {
    id: 2,
    author: "Lucas Dubois",
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 4,
    date: "2026-03-14",
    title: "Très bon rapport qualité-prix",
    content: "Produit de bonne qualité pour le prix. Seul petit bémol, la couleur est légèrement différente de la photo, mais ça reste acceptable. Globalement très satisfait.",
    verified: true,
    helpful: 18,
    images: []
  },
  {
    id: 3,
    author: "Marie Chen",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    date: "2026-03-13",
    title: "Parfait pour les fans !",
    content: "Je l'ai offert à ma fille qui est une grande fan. Elle adore ! Les détails sont incroyables et le design est fidèle à l'original. C'est un excellent choix de cadeau.",
    verified: true,
    helpful: 31,
    images: []
  },
  {
    id: 4,
    author: "Thomas Moreau",
    avatar: "https://i.pravatar.cc/150?img=4",
    rating: 3,
    date: "2026-03-12",
    title: "Correct mais peut mieux faire",
    content: "Le produit est correct mais j'aurais espéré une meilleure finition. Il y a quelques défauts mineurs. Cela dit, le rapport qualité-prix reste honnête.",
    verified: true,
    helpful: 12,
    images: []
  },
  {
    id: 5,
    author: "Amélie Rousseau",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    date: "2026-03-11",
    title: "Livraison super rapide !",
    content: "Commandé lundi, reçu mercredi ! La qualité est au rendez-vous et le service clientèle a été très réactif. Je referai mes achats ici sans hésitation.",
    verified: true,
    helpful: 27,
    images: []
  },
  {
    id: 6,
    author: "Nicolas Lefevre",
    avatar: "https://i.pravatar.cc/150?img=6",
    rating: 4,
    date: "2026-03-10",
    title: "Conforme à la description",
    content: "Produit conforme à la description sur le site. Très satisfait de mon achat. Seul point : les frais de port auraient pu être moins élevés.",
    verified: true,
    helpful: 15,
    images: []
  },
  {
    id: 7,
    author: "Jade Kim",
    avatar: "https://i.pravatar.cc/150?img=7",
    rating: 5,
    date: "2026-03-09",
    title: "Collection complète !",
    content: "J'ai acheté plusieurs articles pour ma collection. Tous les produits sont magnifiques et d'excellente qualité. L'équipe est très accueillante. Bravo !",
    verified: true,
    helpful: 42,
    images: []
  },
  {
    id: 8,
    author: "Alexandre Fournier",
    avatar: "https://i.pravatar.cc/150?img=8",
    rating: 2,
    date: "2026-03-08",
    title: "Décevant",
    content: "Je suis déçu par la qualité. Le produit semble fragile et pas assez robuste pour le prix. Je ne recommande pas cet achat.",
    verified: true,
    helpful: 8,
    images: []
  },
  {
    id: 9,
    author: "Camille Dupont",
    avatar: "https://i.pravatar.cc/150?img=9",
    rating: 5,
    date: "2026-03-07",
    title: "Magnifique !",
    content: "C'est magnifique ! Les couleurs sont vibrantes, le design est impeccable. Je suis complètement fan. Un achat qu'on ne regrette pas !",
    verified: true,
    helpful: 35,
    images: []
  },
  {
    id: 10,
    author: "Pierre Blanc",
    avatar: "https://i.pravatar.cc/150?img=10",
    rating: 4,
    date: "2026-03-06",
    title: "Bon produit, bon service",
    content: "Bon produit avec un bon service. Je suis satisfait. Peut-être un petit amélioration au niveau de l'emballage mais rien de grave.",
    verified: true,
    helpful: 19,
    images: []
  },
  {
    id: 11,
    author: "Éva Laurent",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    date: "2026-03-05",
    title: "Au-delà de mes attentes",
    content: "Je ne m'attendais pas à cette qualité ! C'est vraiment au-delà de mes attentes. Les matériaux sont premium et ça se voit. Très content de mon achat !",
    verified: true,
    helpful: 28,
    images: []
  },
  {
    id: 12,
    author: "Hugo Petit",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 4,
    date: "2026-03-04",
    title: "Satisfait globalement",
    content: "Globalement satisfait de mon achat. Le produit correspond à ce qui était annoncé. Livraison rapide. Un petit plus : une meilleure description des tailles aurait aidé.",
    verified: true,
    helpful: 14,
    images: []
  },
  {
    id: 13,
    author: "Zoé Bernard",
    avatar: "https://i.pravatar.cc/150?img=13",
    rating: 5,
    date: "2026-03-03",
    title: "Addict à ce produit !",
    content: "Je suis addict à ce produit ! J'ai commandé 3 fois déjà. La qualité est constante et le service est impeccable. À recommander absolument !",
    verified: true,
    helpful: 38,
    images: []
  },
  {
    id: 14,
    author: "Mathieu Leclerc",
    avatar: "https://i.pravatar.cc/150?img=14",
    rating: 3,
    date: "2026-03-02",
    title: "Moyen",
    content: "C'est moyen. Pas mauvais mais pas exceptionnel non plus. Le prix me semble un peu élevé pour ce qu'on reçoit. Je cherche une meilleure alternative.",
    verified: false,
    helpful: 6,
    images: []
  },
  {
    id: 15,
    author: "Isabella Romano",
    avatar: "https://i.pravatar.cc/150?img=15",
    rating: 5,
    date: "2026-03-01",
    title: "Spettacolare !",
    content: "Spettacolare ! Exactement ce que je voulais. Les détails sont parfaits. Je l'ai montré à tous mes amis fans. Ils sont jaloux ! Merci beaucoup !",
    verified: true,
    helpful: 45,
    images: []
  },
  {
    id: 16,
    author: "David Moreau",
    avatar: "https://i.pravatar.cc/150?img=16",
    rating: 4,
    date: "2026-02-28",
    title: "Super choix pour un cadeau",
    content: "Super choix pour un cadeau. Le destinataire a aimé. Qualité correcte et prix raisonnable. Je recommande pour les cadeaux de dernière minute.",
    verified: true,
    helpful: 21,
    images: []
  },
  {
    id: 17,
    author: "Nina Rousseau",
    avatar: "https://i.pravatar.cc/150?img=17",
    rating: 5,
    date: "2026-02-27",
    title: "Je reviens toujours ici",
    content: "Je reviens toujours ici pour mes achats KPOP. La qualité, le service, les prix... tout est parfait. C'est devenu mon site préféré !",
    verified: true,
    helpful: 33,
    images: []
  },
  {
    id: 18,
    author: "Antoine Boucher",
    avatar: "https://i.pravatar.cc/150?img=18",
    rating: 2,
    date: "2026-02-26",
    title: "Problème avec la livraison",
    content: "Le produit est arrivé endommagé. J'ai dû faire un retour. Le service client a aidé mais c'était stressant. Peut mieux faire côté emballage.",
    verified: true,
    helpful: 11,
    images: []
  },
  {
    id: 19,
    author: "Léa Garnier",
    avatar: "https://i.pravatar.cc/150?img=19",
    rating: 5,
    date: "2026-02-25",
    title: "Authentique et de qualité",
    content: "C'est un produit authentique et de qualité. J'ai hésité avec d'autres sites mais je suis contente d'avoir choisi celui-ci. Merci !",
    verified: true,
    helpful: 26,
    images: []
  },
  {
    id: 20,
    author: "Raphaël Jean",
    avatar: "https://i.pravatar.cc/150?img=20",
    rating: 4,
    date: "2026-02-24",
    title: "Bonne expérience",
    content: "Bonne expérience globale. Le produit est bien, la livraison a été rapide. Juste un petit délai dans la réponse du service client mais ils ont finalement aidé.",
    verified: true,
    helpful: 17,
    images: []
  },
  {
    id: 21,
    author: "Chloé Mercier",
    avatar: "https://i.pravatar.cc/150?img=21",
    rating: 5,
    date: "2026-02-23",
    title: "Je suis tombée amoureuse !",
    content: "Je suis tombée amoureuse de ce produit dès que je l'ai vu ! Il est encore plus beau en vrai qu'en photo. Tout est parfait, je ne regrette rien !",
    verified: true,
    helpful: 40,
    images: []
  },
  {
    id: 22,
    author: "Louis Marchand",
    avatar: "https://i.pravatar.cc/150?img=22",
    rating: 3,
    date: "2026-02-22",
    title: "Acceptable",
    content: "C'est acceptable. Rien de spectaculaire mais ça fait le job. Je m'attendais à un peu plus pour ce prix. Correct quand même.",
    verified: false,
    helpful: 9,
    images: []
  },
  {
    id: 23,
    author: "Sarah Lefebvre",
    avatar: "https://i.pravatar.cc/150?img=23",
    rating: 5,
    date: "2026-02-21",
    title: "Recommande vraiment !",
    content: "Je recommande vraiment ce produit et ce site ! Qualité top, prix fair, service excellent. C'est mon nouveau site de référence pour le KPOP !",
    verified: true,
    helpful: 36,
    images: []
  },
  {
    id: 24,
    author: "Jérôme Gauthier",
    avatar: "https://i.pravatar.cc/150?img=24",
    rating: 4,
    date: "2026-02-20",
    title: "Très bien emballé",
    content: "Très bien emballé. C'est important pour ce type de produit. La qualité du produit lui-même est bonne. Peut-être un léger problème de finition mais mineur.",
    verified: true,
    helpful: 13,
    images: []
  },
  {
    id: 25,
    author: "Manon Soulier",
    avatar: "https://i.pravatar.cc/150?img=25",
    rating: 5,
    date: "2026-02-19",
    title: "Coup de cœur !",
    content: "Coup de cœur pour ce produit ! L'esthétique est superbe, la qualité est là. Je suis une cliente fidèle maintenant. Merci pour tout !",
    verified: true,
    helpful: 44,
    images: []
  },
  {
    id: 26,
    author: "Benjamin Collet",
    avatar: "https://i.pravatar.cc/150?img=26",
    rating: 4,
    date: "2026-02-18",
    title: "Finalement ravi",
    content: "Au départ j'étais un peu hésitant mais finalement je suis ravi ! Le produit est mieux que prévu. Bon achat en fin de compte.",
    verified: true,
    helpful: 20,
    images: []
  },
  {
    id: 27,
    author: "Virginie Dupuis",
    avatar: "https://i.pravatar.cc/150?img=27",
    rating: 5,
    date: "2026-02-17",
    title: "Ma collection s'agrandit !",
    content: "Ma collection s'agrandit avec ce nouvel ajout ! Chaque article que j'achète ici dépasse mes attentes. Merci à toute l'équipe ! 💜",
    verified: true,
    helpful: 32,
    images: []
  },
  {
    id: 28,
    author: "Sébastien Durand",
    avatar: "https://i.pravatar.cc/150?img=28",
    rating: 2,
    date: "2026-02-16",
    title: "Pas satisfait",
    content: "Je ne suis pas satisfait. Le produit ne correspond pas à la description. J'ai demandé un remboursement mais c'était compliqué. Déçu.",
    verified: true,
    helpful: 7,
    images: []
  },
  {
    id: 29,
    author: "Audrey Thierry",
    avatar: "https://i.pravatar.cc/150?img=29",
    rating: 5,
    date: "2026-02-15",
    title: "Exactement ce qu'il me fallait",
    content: "Exactement ce qu'il me fallait ! J'ai trouvé précisément le modèle que je cherchais. La qualité est impeccable. Merci beaucoup !",
    verified: true,
    helpful: 29,
    images: []
  },
  {
    id: 30,
    author: "Christophe Meyer",
    avatar: "https://i.pravatar.cc/150?img=30",
    rating: 4,
    date: "2026-02-14",
    title: "Valeur sûre",
    content: "C'est une valeur sûre. Vous ne vous tromperez pas en achetant ce produit. Qualité stable, livraison fiable. À acheter les yeux fermés.",
    verified: true,
    helpful: 25,
    images: []
  }
];

// Fonction pour obtenir 5 avis aléatoires
export function getRandomReviews(count = 5) {
  const shuffled = [...reviews].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Fonction pour obtenir les avis filtrés par note
export function getReviewsByRating(rating) {
  return reviews.filter(review => review.rating === rating);
}

// Fonction pour obtenir les avis vérifiés
export function getVerifiedReviews() {
  return reviews.filter(review => review.verified);
}

// Fonction pour obtenir les avis triés par utilité
export function getReviewsByHelpfulness() {
  return [...reviews].sort((a, b) => b.helpful - a.helpful);
}

export default reviews;
