const reviews = [
  {
    id: 1,
    author: "Sophie Martin",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    date: "2026-03-15",
    title: "T-shirt BLACKPINK parfait !",
    content: "J'ai commandé le t-shirt BLACKPINK Pink edition et c'est absolument magnifique ! Le design est identique aux photos, la qualité du tissu est excellente et le rendu des couleurs est impeccable. Je suis très impressionnée !",
    verified: true,
    helpful: 24,
    productImage: "/photo review/t-shirt blackpinfk.jpg",
    product: "T-shirt BLACKPINK",
    prompt: "Professional product photography of a BLACKPINK pink edition t-shirt laid flat on a white background, showing the front design with the group's logo in vibrant colors, with a delivery box partially visible in the corner. High quality, clean lighting, 500x500px"
  },
  {
    id: 2,
    author: "Lucas Dubois",
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 4,
    date: "2026-03-14",
    title: "Photocard BTS bien reçue",
    content: "J'ai reçu le set de 10 photocards BTS Dynamite. Elles sont en super état, pas de plis ni rayures. Un petit bémol sur le packaging qui aurait pu être mieux protégé, mais les cartes sont parfaites !",
    verified: true,
    helpful: 18,
    productImage: "/photo review/carte bts.jpg",
    product: "Photocards BTS Dynamite",
    prompt: "Professional photography of a fan-out display of 10 BTS Dynamite photocards arranged in a fan pattern on a clean white background, showing the colorful member cards with Dynamite era styling, next to a cardboard shipping box. High resolution, vibrant colors, 500x500px"
  },
  {
    id: 3,
    author: "Marie Chen",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    date: "2026-03-13",
    title: "Lightstick TWICE incroyable !",
    content: "Le lightstick TWICE officiel que j'ai commandé est fabuleux ! Les couleurs changent parfaitement, la batterie tient longtemps, et le design est exactement comme en concert. Mes amis fans l'adorent aussi !",
    verified: true,
    helpful: 31,
    productImage: "/photo review/lightstick.jpg",
    product: "Lightstick TWICE",
    prompt: "Professional product shot of an official TWICE lightstick glowing with pink and purple LED lights, held vertically with a delivery box in the background, white clean background. The lightstick should show the group's official design and colors. High quality lighting, 500x500px"
  },
  {
    id: 4,
    author: "Thomas Moreau",
    avatar: "https://i.pravatar.cc/150?img=4",
    rating: 4,
    date: "2026-03-12",
    title: "Poster STRAY KIDS correct",
    content: "Les posters STRAY KIDS que j'ai commandés sont de bonne qualité. L'impression est nette et claire. Juste un petit souci avec le tube de livraison qui était légèrement endommagé, mais les posters vont bien.",
    verified: true,
    helpful: 12,
    productImage: "/photo review/stray kids.jpg",
    product: "Posters STRAY KIDS",
    prompt: "Professional flat lay photography of 3-4 STRAY KIDS posters rolled partially out and stacked, showing vibrant K-pop imagery and group member photos, with a cardboard shipping tube and white background. Clean professional lighting, sharp details, 500x500px"
  },
  {
    id: 5,
    author: "Amélie Rousseau",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    date: "2026-03-11",
    title: "Coque téléphone NewJeans super !",
    content: "J'ai acheté la coque NewJeans pour mon iPhone et elle est arrivée très vite ! La protection est excellente, le design ne s'efface pas et c'est vraiment stylé. Je recommande absolument !",
    verified: true,
    helpful: 27,
    productImage: "/photo review/housse telephone.jpg",
    product: "Coque NewJeans",
    prompt: "Professional product photography of a NewJeans iPhone case displayed on a smartphone, showing the front design with the group's pastel-colored logo and aesthetic, placed next to a white packaging box on clean white background. Modern, clean lighting, 500x500px"
  },
  {
    id: 6,
    author: "Nicolas Lefevre",
    avatar: "https://i.pravatar.cc/150?img=6",
    rating: 5,
    date: "2026-03-10",
    title: "Album SEVENTEEN collector's edition",
    content: "Collector's edition de SEVENTEEN Seventeen Album - tout y est ! Les photocards bonus, le livret haute qualité, le poster, et le design de boîte est magnifique. Un vrai bijou pour la collection !",
    verified: true,
    helpful: 15,
    productImage: "/photo review/carte livre cd et album FML.jpg",
    product: "Album SEVENTEEN",
    prompt: "Professional flat lay photography of a SEVENTEEN collector's edition album open showing the interior contents: premium album cover, photocards spread out, colorful poster, booklet, all on white background with subtle cardboard box in corner. Luxury photography style, 500x500px"
  },
  {
    id: 7,
    author: "Jade Kim",
    avatar: "https://i.pravatar.cc/150?img=7",
    rating: 5,
    date: "2026-03-09",
    title: "Figurines K-beauty collector pack",
    content: "J'ai commandé le pack complet de 6 figurines des idoles K-beauty et elles sont incroyables ! Le détail des visages est parfait, les poses sont dynamiques. Les boîtes d'emballage collectionneurs sont très belles !",
    verified: true,
    helpful: 42,
    productImage: "/photo review/Figurne idol.jpg",
    product: "Figurines K-beauty",
    prompt: "Professional product photography of 6 K-pop idol figurines arranged in a dynamic display on white background, showing detailed facial features and colorful outfits, with their individual packaging boxes and a larger collector's box visible. Studio lighting, vibrant colors, 500x500px"
  },
  {
    id: 8,
    author: "Alexandra Martin",
    avatar: "https://i.pravatar.cc/150?img=8",
    rating: 5,
    date: "2026-03-08",
    title: "Itzy Box merchandising",
    content: "La box merchandising ITZY complète avec cartes postales et cartes spéciales est arrivée. Tout est de super qualité, les cartes ont des finitions brillantes. Très content de cet achat pour ma collection !",
    verified: true,
    helpful: 38,
    productImage: "/photo review/Itzy carte.png",
    product: "Box ITZY",
    prompt: "Professional flat lay photography of an ITZY merchandise box with contents displayed: colorful cards with glossy finishes, special edition postcards with member photos, arranged artfully on white background. Bright, colorful, merchandise product photography style, 500x500px"
  },
  {
    id: 9,
    author: "Clara Fontaine",
    avatar: "https://i.pravatar.cc/150?img=9",
    rating: 4,
    date: "2026-03-07",
    title: "ITZY Set complet parfait",
    content: "L'ensemble ITZY que j'ai commandé avec cartes et sacs est arrivé en parfait état ! La qualité du packaging est exceptionnelle et tous les articles sont comme décrits. Je recommande vivement ce set !",
    verified: true,
    helpful: 35,
    productImage: "/photo review/itzy carte et scas KPO.png",
    product: "Set ITZY complet",
    prompt: "Professional flat lay photography of a complete ITZY set including cards and small bags, arranged artfully on white background, showing all items clearly. High-end merchandise photography with studio lighting, 500x500px"
  },
  {
    id: 10,
    author: "Raphaël Dupont",
    avatar: "https://i.pravatar.cc/150?img=10",
    rating: 5,
    date: "2026-03-06",
    title: "Ensemble BTS Album + Cartes",
    content: "J'ai acheté l'ensemble BTS avec album CD et cartes photocards premium et c'est simplement parfait ! La qualité audio du CD est excellente et les cartes sont magnifiquement imprimées. Mes copains fans l'adorent !",
    verified: true,
    helpful: 29,
    productImage: "/photo review/Itzy carte.png",
    product: "Ensemble BTS Album",
    prompt: "Professional product photography of a BTS album set with CD case open showing the disc and booklet, accompanied by premium photocards arranged beside it, on clean white background. High-end music product photography, 500x500px"
  }
];

export function getRandomReviews(count = 4) {
  const shuffled = [...reviews].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getReviewsByRating(rating) {
  return reviews.filter(review => review.rating === rating);
}

export function getVerifiedReviews() {
  return reviews.filter(review => review.verified);
}

export function getReviewsByHelpfulness() {
  return [...reviews].sort((a, b) => b.helpful - a.helpful);
}

export default reviews;
