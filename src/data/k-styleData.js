// ─── Helper: converts "61,90€" or "À partir de 27,90€" → { price, isEstimated }
function parsePrice(str) {
  if (!str || str.includes('~~')) return { price: null, isEstimated: false };
  const isEstimated = str.includes('À partir de');
  const cleaned = str.replace('À partir de', '').replace('€', '').replace(',', '.').trim();
  return { price: parseFloat(cleaned), isEstimated };
}

function normalize(raw) {
  const nameRaw    = raw.nom   ?? raw.name;
  const priceRaw   = raw.prix  ?? raw.price;
  // handle both field names — and ignore markdown strikethrough "~~69,90€~~"
  const reducedRaw = raw.prix_reduction ?? raw.discount_price ?? null;

  const { price, isEstimated } = parsePrice(priceRaw);
  const { price: original_price } = parsePrice(reducedRaw);

  return {
    name: nameRaw,
    price,
    original_price,   // crossed-out original price (null if no sale)
    isEstimated,
    rating: null,
    url: raw.url ?? '',
    image:      raw.image      || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
    hover_image: raw.hover_image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80',
  };
}

// ─── Raw data ──────────────────────────────────────────────────────────────────

export const RAW = {
  't-shirts-korean': [
    { name: "T-shirt Korean Style", price: "24,90€", discount_price: "37,90€", image: "/k-styles/t-shirt/t-shirt1.jpg", hover_image: "/k-styles/t-shirt/t-shirt1.jpg" },
    { name: "T-shirt Finger Heart", price: "22,90€", discount_price: "37,90€", image: "/k-styles/t-shirt/t-shirt2.jpg", hover_image: "/k-styles/t-shirt/t-shirt2.jpg" },
    { name: "T-shirt Coréen Blanc Imprimé", price: "24,90€", discount_price: null, image: "/k-styles/t-shirt/t-shirt3.jpg", hover_image: "/k-styles/t-shirt/t-shirt3.jpg" },
    { name: "T-shirt Korean Pop", price: "24,90€", discount_price: null, image: "/k-styles/t-shirt/t-shirt4.jpg", hover_image: "/k-styles/t-shirt/t-shirt4.jpg" },
    { name: "T-shirt Korean Imprimé", price: "29,90€", discount_price: null, image: "/k-styles/t-shirt/t-shirt5.jpg", hover_image: "/k-styles/t-shirt/t-shirt5.jpg" },
    { name: "T-shirt Coréen Long", price: "30,90€", discount_price: "36,90€", image: "/k-styles/t-shirt/t-shirt6.jpg", hover_image: "/k-styles/t-shirt/t-shirt6.jpg" },
    { name: "T-shirt Korean Unisex", price: "24,90€", discount_price: null, image: "/k-styles/t-shirt/t-shirt7.jpg", hover_image: "/k-styles/t-shirt/t-shirt7.jpg" },
    { name: "T-shirt Coréen Hangoul", price: "29,90€", discount_price: null, image: "/k-styles/t-shirt/t-shirt8.jpg", hover_image: "/k-styles/t-shirt/t-shirt8.jpg" },
    { name: "T-shirt Coréen Halloween", price: "29,90€", discount_price: null, image: "/k-styles/t-shirt/t-shirt9.jpg", hover_image: "/k-styles/t-shirt/t-shirt9.jpg" },
    { name: "T-shirt Korean pour Couple", price: "24,90€", discount_price: null, image: "/k-styles/t-shirt/t-shirt10.jpg", hover_image: "/k-styles/t-shirt/t-shirt10.jpg" },
  ],

  'pyjamas-coreens': [
    { name: "Ensemble Pyjama Huntrix pour Enfant", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama1.png", hover_image: "/k-styles/pyjamas/pyjama1.png" },
    { name: "Pyjama Cosplay Zoey Huntrix Demon Hunters", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama2.png", hover_image: "/k-styles/pyjamas/pyjama2.png" },
    { name: "Ensemble Pyjama Imprimé Huntrix Enfant", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama3.png", hover_image: "/k-styles/pyjamas/pyjama3.png" },
    { name: "Ensemble Pyjama Huntrix Enfant", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama4.png", hover_image: "/k-styles/pyjamas/pyjama4.png" },
    { name: "Pyjama pour Femme KPop Demon Hunters", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama5.png", hover_image: "/k-styles/pyjamas/pyjama5.png" },
    { name: "Pyjama Huntrix Demon Hunters Enfant", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama6.png", hover_image: "/k-styles/pyjamas/pyjama6.png" },
    { name: "Pyjama BT21", price: "39,90€", discount_price: "59,90€", image: "/k-styles/pyjamas/pyjama7.jpg", hover_image: "/k-styles/pyjamas/pyjama7.jpg" },
    { name: "Pyjama Dessin Bt21", price: "29,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama8.jpg", hover_image: "/k-styles/pyjamas/pyjama8.jpg" },
    { name: "Ensemble de Pyjama Coréen Femme", price: "29,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama9.webp", hover_image: "/k-styles/pyjamas/pyjama9.webp" },
    { name: "Pyjama BT21 Court", price: "34,90€", discount_price: "59,90€", image: "/k-styles/pyjamas/pyjama10.webp", hover_image: "/k-styles/pyjamas/pyjama10.webp" },
    { name: "Pyjama Coréen Femme Grande Taille", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama11.webp", hover_image: "/k-styles/pyjamas/pyjama11.webp" },
    { name: "Pyjama Coréen Kawaii pour Couple", price: "29,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama12.webp", hover_image: "/k-styles/pyjamas/pyjama12.webp" },
    { name: "Pyjama Coréen Short Femme", price: "29,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama13.jpg", hover_image: "/k-styles/pyjamas/pyjama13.jpg" },
    { name: "Pyjama Coréen Ourson", price: "29,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama14.jpg", hover_image: "/k-styles/pyjamas/pyjama14.jpg" },
    { name: "Pyjama Short Coréen Homme", price: "44,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama15.png", hover_image: "/k-styles/pyjamas/pyjama15.png" },
    { name: "Ensemble Pyjama Short Fleuri", price: "39,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama16.png", hover_image: "/k-styles/pyjamas/pyjama16.png" },
    { name: "Ensemble Pyjama Blanc", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama17.webp", hover_image: "/k-styles/pyjamas/pyjama17.webp" },
    { name: "Pyjama Korean Leger pour Femme", price: "29,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama18.webp", hover_image: "/k-styles/pyjamas/pyjama18.webp" },
    { name: "Pyjama Coréen Kawaii", price: "59,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama19.webp", hover_image: "/k-styles/pyjamas/pyjama19.webp" },
    { name: "Ensemble Pyjama Coréen à Rayure", price: "44,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama20.webp", hover_image: "/k-styles/pyjamas/pyjama20.webp" },
    { name: "Pyjama Korean à Dentelles", price: "99,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama21.webp", hover_image: "/k-styles/pyjamas/pyjama21.webp" },
    { name: "Pyjama Coréen Rouge Femme", price: "59,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama22.webp", hover_image: "/k-styles/pyjamas/pyjama22.webp" },
    { name: "Pyjama Coréen pour Couple", price: "49,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama23.webp", hover_image: "/k-styles/pyjamas/pyjama23.webp" },
    { name: "Pyjama Hiver Coréen", price: "84,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama24.webp", hover_image: "/k-styles/pyjamas/pyjama24.webp" },
    { name: "Pyjama Coréen Matelassé", price: "84,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama25.webp", hover_image: "/k-styles/pyjamas/pyjama25.webp" },
    { name: "Ensemble de Pyjama Coréen Homme", price: "64,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama26.webp", hover_image: "/k-styles/pyjamas/pyjama26.webp" },
    { name: "Pyjama Pantalon Homme", price: "54,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama27.webp", hover_image: "/k-styles/pyjamas/pyjama27.webp" },
    { name: "Pyjama Coréen Homme Grande Taille", price: "104,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama28.webp", hover_image: "/k-styles/pyjamas/pyjama28.webp" },
    { name: "Pyjama Femme Korean", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama29.webp", hover_image: "/k-styles/pyjamas/pyjama29.webp" },
    { name: "Pyjama Korean Homme Marron", price: "54,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama30.webp", hover_image: "/k-styles/pyjamas/pyjama30.webp" },
    { name: "Ensemble Pyjama Derpy Tiger Demon Hunters", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama31.png", hover_image: "/k-styles/pyjamas/pyjama31.png" },
  ],

  'jupes-coreenne': [
    { name: "Jupe Coréenne Plissée", price: "19,90€", discount_price: null, image: "/k-styles/jupes/jupes1.png", hover_image: "/k-styles/jupes/jupes1.png" },
    { name: "Jupe Coréenne Écolière", price: "22,90€", discount_price: null, image: "/k-styles/jupes/jupes2.webp", hover_image: "/k-styles/jupes/jupes2.webp" },
    { name: "Jupe Coréenne Courte", price: "24,90€", discount_price: null, image: "/k-styles/jupes/jupes3.png", hover_image: "/k-styles/jupes/jupes3.png" },
    { name: "Jupe Coréenne Taille Haute", price: "26,90€", discount_price: null, image: "/k-styles/jupes/jupes4.png", hover_image: "/k-styles/jupes/jupes4.png" },
    { name: "Jupe Coréenne Longue", price: "29,90€", discount_price: null, image: "/k-styles/jupes/jupes5.webp", hover_image: "/k-styles/jupes/jupes5.webp" },
    { name: "Jupe Coréenne à Carreaux", price: "27,90€", discount_price: null, image: "/k-styles/jupes/jupes6.webp", hover_image: "/k-styles/jupes/jupes6.webp" },
    { name: "Jupe Coréenne A-Line", price: "25,90€", discount_price: null, image: "/k-styles/jupes/jupes7.jpg", hover_image: "/k-styles/jupes/jupes7.jpg" },
    { name: "Jupe Coréenne avec Poches", price: "28,90€", discount_price: null, image: "/k-styles/jupes/jupes8.jpg", hover_image: "/k-styles/jupes/jupes8.jpg" },
    { name: "Jupe Coréenne K-Pop Style", price: "24,90€", discount_price: null, image: "/k-styles/jupes/jupes9.png", hover_image: "/k-styles/jupes/jupes9.png" },
    { name: "Jupe Coréenne à Volants", price: "29,90€", discount_price: null, image: "/k-styles/jupes/jupes10.webp", hover_image: "/k-styles/jupes/jupes10.webp" },
    { name: "Mini Jupe Coréenne", price: "19,90€", discount_price: null, image: "/k-styles/jupes/jupes11.jpg", hover_image: "/k-styles/jupes/jupes11.jpg" },
    { name: "Jupe Coréenne À Fleurs", price: "27,90€", discount_price: null, image: "/k-styles/jupes/jupes12.webp", hover_image: "/k-styles/jupes/jupes12.webp" },
    { name: "Jupe Coréenne Imprimée", price: "28,90€", discount_price: null, image: "/k-styles/jupes/jupes13.jpg", hover_image: "/k-styles/jupes/jupes13.jpg" },
    { name: "Jupe Coréenne Tennis", price: "24,90€", discount_price: null, image: "/k-styles/jupes/jupes14.jpg", hover_image: "/k-styles/jupes/jupes14.jpg" },
    { name: "Jupe Coréenne Noir Classique", price: "22,90€", discount_price: null, image: "/k-styles/jupes/jupes15.jpg", hover_image: "/k-styles/jupes/jupes15.jpg" },
  ],

  'manteaux-doudounes': [
    { name: "Manteau Coreen", price: "61,90€", discount_price: "75,90€", image: "/k-styles/manteaux/manteau1.jpg", hover_image: "/k-styles/manteaux/manteau1.jpg" },
    { name: "Doudoune Pastel Femme", price: "77,90€", discount_price: "94,90€", image: "/k-styles/manteaux/manteau2.jpg", hover_image: "/k-styles/manteaux/manteau2.jpg" },
    { name: "Doudoune Style Coreen", price: "51,90€", discount_price: "63,90€", image: "/k-styles/manteaux/manteau3.jpg", hover_image: "/k-styles/manteaux/manteau3.jpg" },
    { name: "Doudoune Coréenne Mi-Longue", price: "34,90€", discount_price: null, image: "/k-styles/manteaux/manteau4.jpg", hover_image: "/k-styles/manteaux/manteau4.jpg" },
    { name: "Veste en Jean Coreen", price: "49,90€", discount_price: null, image: "/k-styles/manteaux/manteau5.jpg", hover_image: "/k-styles/manteaux/manteau5.jpg" },
    { name: "Doudoune Korean Mi-Longue", price: "59,90€", discount_price: null, image: "/k-styles/manteaux/manteau6.jpg", hover_image: "/k-styles/manteaux/manteau6.jpg" },
    { name: "Manteau Hiver Homme Coréen", price: "49,90€", discount_price: null, image: "/k-styles/manteaux/manteau7.webp", hover_image: "/k-styles/manteaux/manteau7.webp" },
    { name: "Manteau Style Coréen Femme", price: "59,90€", discount_price: null, image: "/k-styles/manteaux/manteau8.webp", hover_image: "/k-styles/manteaux/manteau8.webp" },
    { name: "Parka Korean Luxe Homme", price: "129,90€", discount_price: null, image: "/k-styles/manteaux/manteau9.jpg", hover_image: "/k-styles/manteaux/manteau9.jpg" },
    { name: "Parka à Col Fourrure Femme", price: "69,90€", discount_price: null, image: "/k-styles/manteaux/manteau10.jpg", hover_image: "/k-styles/manteaux/manteau10.jpg" },
    { name: "Parka Korean pour Homme", price: "64,90€", discount_price: null, image: "/k-styles/manteaux/manteau11.webp", hover_image: "/k-styles/manteaux/manteau11.webp" },
    { name: "Parka Longue Femme", price: "149,90€", discount_price: null, image: "/k-styles/manteaux/manteau12.webp", hover_image: "/k-styles/manteaux/manteau12.webp" },
    { name: "Parka Coréenne à Fourrure", price: "174,90€", discount_price: null, image: "/k-styles/manteaux/manteau13.webp", hover_image: "/k-styles/manteaux/manteau13.webp" },
    { name: "Parka Coréenne Homme", price: "59,90€", discount_price: null, image: "/k-styles/manteaux/manteau14.webp", hover_image: "/k-styles/manteaux/manteau14.webp" },
    { name: "Parka Homme à Capuche", price: "64,90€", discount_price: null, image: "/k-styles/manteaux/manteau15.webp", hover_image: "/k-styles/manteaux/manteau15.webp" },
    { name: "Doudoune Oversize Style Coréenne", price: "89,90€", discount_price: null, image: "/k-styles/manteaux/manteau16.jpg", hover_image: "/k-styles/manteaux/manteau16.jpg" },
    { name: "Doudoune Courte à Fourrure", price: "74,90€", discount_price: null, image: "/k-styles/manteaux/manteau17.webp", hover_image: "/k-styles/manteaux/manteau17.webp" },
    { name: "Doudoune Coréenne Longue", price: "354,90€", discount_price: null, image: "/k-styles/manteaux/manteau18.webp", hover_image: "/k-styles/manteaux/manteau18.webp" },
    { name: "Doudoune Rembourrée Sans Manches", price: "34,90€", discount_price: null, image: "/k-styles/manteaux/manteau19.webp", hover_image: "/k-styles/manteaux/manteau19.webp" },
    { name: "Doudoune Femme Extra Longue", price: "84,90€", discount_price: null, image: "/k-styles/manteaux/manteau20.webp", hover_image: "/k-styles/manteaux/manteau20.webp" },
    { name: "Doudoune Coréenne Femme Oversize", price: "59,90€", discount_price: null, image: "/k-styles/manteaux/manteau21.webp", hover_image: "/k-styles/manteaux/manteau21.webp" },
    { name: "Doudoune Femme à Col Fourrure", price: "214,90€", discount_price: null, image: "/k-styles/manteaux/manteau22.webp", hover_image: "/k-styles/manteaux/manteau22.webp" },
    { name: "Doudoune Homme à Capuche", price: "99,90€", discount_price: null, image: "/k-styles/manteaux/manteau23.webp", hover_image: "/k-styles/manteaux/manteau23.webp" },
    { name: "Doudoune Coréenne Rembourrée", price: "104,90€", discount_price: null, image: "/k-styles/manteaux/manteau24.webp", hover_image: "/k-styles/manteaux/manteau24.webp" },
    { name: "Doudoune Matelassée Femme", price: "69,90€", discount_price: null, image: "/k-styles/manteaux/manteau25.webp", hover_image: "/k-styles/manteaux/manteau25.webp" },
    { name: "Manteau Korean Long en Laine", price: "179,90€", discount_price: null, image: "/k-styles/manteaux/manteau26.webp", hover_image: "/k-styles/manteaux/manteau26.webp" },
    { name: "Manteaux Coréen Femme Mi-Long", price: "104,90€", discount_price: null, image: "/k-styles/manteaux/manteau27.webp", hover_image: "/k-styles/manteaux/manteau27.webp" },
    { name: "Manteau Femme Pied de Poule", price: "84,90€", discount_price: null, image: "/k-styles/manteaux/manteau28.webp", hover_image: "/k-styles/manteaux/manteau28.webp" },
    { name: "Manteau Court pour Homme", price: "64,90€", discount_price: null, image: "/k-styles/manteaux/manteau29.webp", hover_image: "/k-styles/manteaux/manteau29.webp" },
    { name: "Manteau Korean Beige", price: "129,90€", discount_price: null, image: "/k-styles/manteaux/manteau30.webp", hover_image: "/k-styles/manteaux/manteau30.webp" },
    { name: "Manteau Korean Unisex", price: "144,90€", discount_price: null, image: "/k-styles/manteaux/manteau31.webp", hover_image: "/k-styles/manteaux/manteau31.webp" },
    { name: "Trench Coréen pour Femme", price: "144,90€", discount_price: null, image: "/k-styles/manteaux/manteau32.webp", hover_image: "/k-styles/manteaux/manteau32.webp" },
    { name: "Manteau Court à Fourrures", price: "104,90€", discount_price: null, image: "/k-styles/manteaux/manteau33.webp", hover_image: "/k-styles/manteaux/manteau33.webp" },
    { name: "Manteau Hiver Coréen", price: "154,90€", discount_price: null, image: "/k-styles/manteaux/manteau34.webp", hover_image: "/k-styles/manteaux/manteau34.webp" },
    { name: "Manteau Style Coréen Homme", price: "319,90€", discount_price: null, image: "/k-styles/manteaux/manteau35.webp", hover_image: "/k-styles/manteaux/manteau35.webp" },
    { name: "Manteau Long Style Coréen", price: "74,90€", discount_price: null, image: "/k-styles/manteaux/manteau36.webp", hover_image: "/k-styles/manteaux/manteau36.webp" },
    { name: "Long Manteau Noir Korean", price: "204,90€", discount_price: null, image: "/k-styles/manteaux/manteau37.webp", hover_image: "/k-styles/manteaux/manteau37.webp" },
    { name: "Manteau Coréen Col Fourrure", price: "234,90€", discount_price: null, image: "/k-styles/manteaux/manteau38.webp", hover_image: "/k-styles/manteaux/manteau38.webp" },
    { name: "Blouson Parka Coreen", price: "64,90€", discount_price: "78,90€", image: "/k-styles/manteaux/manteau39.webp", hover_image: "/k-styles/manteaux/manteau39.webp" },
    { name: "Manteau Velours Femme", price: "65,90€", discount_price: "79,90€", image: "/k-styles/manteaux/manteau40.webp", hover_image: "/k-styles/manteaux/manteau40.webp" },
    { name: "Coupe Vent Dinosaure", price: "73,90€", discount_price: "90,90€", image: "/k-styles/manteaux/manteau41.jpg", hover_image: "/k-styles/manteaux/manteau41.jpg" },
    { name: "Parka Coreen", price: "118,90€", discount_price: "145,90€", image: "/k-styles/manteaux/manteau42.webp", hover_image: "/k-styles/manteaux/manteau42.webp" },
    { name: "Doudoune Tricolore Degradé", price: "82,90€", discount_price: null, image: "/k-styles/manteaux/manteau43.jpg", hover_image: "/k-styles/manteaux/manteau43.jpg" },
  ],

  'blouses-chemises': [
    { name: "Blouse Coreenne Design à Ceinture", price: "32,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier1.jpg", hover_image: "/k-styles/chemisiers/chemisier1.jpg" },
    { name: "Blouse Korean Broderie Blanche", price: "33,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier2.jpg", hover_image: "/k-styles/chemisiers/chemisier2.jpg" },
    { name: "Chemise à fleur de couleur", price: "À partir de 28,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier3.jpg", hover_image: "/k-styles/chemisiers/chemisier3.jpg" },
    { name: "Blouse Korean à Fleurs", price: "À partir de 27,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier4.jpg", hover_image: "/k-styles/chemisiers/chemisier4.jpg" },
    { name: "Blouse Chemisier à fleurs", price: "33,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier5.jpg", hover_image: "/k-styles/chemisiers/chemisier5.jpg" },
    { name: "Blouse Design Coloré", price: "37,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier6.jpg", hover_image: "/k-styles/chemisiers/chemisier6.jpg" },
    { name: "Blouse Coreenne Crop Top", price: "27,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier7.jpg", hover_image: "/k-styles/chemisiers/chemisier7.jpg" },
    { name: "Blouse Coreenne Taille Froncée", price: "29,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier8.jpg", hover_image: "/k-styles/chemisiers/chemisier8.jpg" },
    { name: "Blouse Coreenne Sexy Marron", price: "40,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier9.jpg", hover_image: "/k-styles/chemisiers/chemisier9.jpg" },
    { name: "Chemisier Blouse Korean Fleurie", price: "29,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier10.jpg", hover_image: "/k-styles/chemisiers/chemisier10.jpg" },
    { name: "Blouse Korean Noeud", price: "28,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier11.jpg", hover_image: "/k-styles/chemisiers/chemisier11.jpg" },
    { name: "Blouse Coreenne Ruffle", price: "À partir de 27,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier12.jpg", hover_image: "/k-styles/chemisiers/chemisier12.jpg" },
    { name: "Blouse Korean Mini Top", price: "À partir de 26,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier13.jpg", hover_image: "/k-styles/chemisiers/chemisier13.jpg" },
    { name: "Blouse Coreenne Satin", price: "33,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier14.jpg", hover_image: "/k-styles/chemisiers/chemisier14.jpg" },
    { name: "Blouse Coreenne Satin (autre variante)", price: "38,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier15.png", hover_image: "/k-styles/chemisiers/chemisier15.png" },
    { name: "Chemise Coreenne Lune", price: "À partir de 26,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier16.png", hover_image: "/k-styles/chemisiers/chemisier16.png" },
    { name: "Chemise BTS", price: "39,90€", discount_price: "69,90€", image: "/k-styles/chemisiers/chemisier17.jpg", hover_image: "/k-styles/chemisiers/chemisier17.jpg" },
    { name: "Crop Top Dentelle Lisa - Groupe Blackpink", price: "29,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier18.jpg", hover_image: "/k-styles/chemisiers/chemisier18.jpg" },
    { name: "Chemise Etincelante KPOP Suga - Groupe BTS", price: "29,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier19.jpg", hover_image: "/k-styles/chemisiers/chemisier19.jpg" },
    { name: "Top Coreen Blouse", price: "39,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier20.jpg", hover_image: "/k-styles/chemisiers/chemisier20.jpg" },
    { name: "Chemise Korean Fire", price: "36,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier21.jpg", hover_image: "/k-styles/chemisiers/chemisier21.jpg" },
    { name: "Blouse Chemisier Dragon", price: "40,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier22.jpg", hover_image: "/k-styles/chemisiers/chemisier22.jpg" },
    { name: "Chemise Korean Blue Fire", price: "32,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier23.jpg", hover_image: "/k-styles/chemisiers/chemisier23.jpg" },
    { name: "Blouse Coreenne Top Chic", price: "35,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier24.jpg", hover_image: "/k-styles/chemisiers/chemisier24.jpg" },
    { name: "Blouse Coreenne Casual", price: "32,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier25.jpg", hover_image: "/k-styles/chemisiers/chemisier25.jpg" },
    { name: "Chemise Coreenne Abstrait", price: "35,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier26.jpg", hover_image: "/k-styles/chemisiers/chemisier26.jpg" },
    { name: "Blouse Coreen Chat", price: "À partir de 27,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier27.jpg", hover_image: "/k-styles/chemisiers/chemisier27.jpg" },
    { name: "Blouse Coreenne Manche bouffante", price: "33,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier28.jpg", hover_image: "/k-styles/chemisiers/chemisier28.jpg" },
    { name: "Blouse Coreenne Double Piece", price: "À partir de 28,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier29.png", hover_image: "/k-styles/chemisiers/chemisier29.png" },
    { name: "Blouse Originale Fleurs 3D", price: "36,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier30.jpg", hover_image: "/k-styles/chemisiers/chemisier30.jpg" },
    { name: "Blouse Korean Top Backless", price: "33,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier31.jpg", hover_image: "/k-styles/chemisiers/chemisier31.jpg" },
    { name: "Blouse Coreenne Elegante", price: "À partir de 36,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier32.png", hover_image: "/k-styles/chemisiers/chemisier32.png" },
    { name: "Blouse Femme Froncée", price: "30,90€", discount_price: null, image: "/k-styles/chemisiers/chemisier33.jpg", hover_image: "/k-styles/chemisiers/chemisier33.jpg" },
  ],
  "pantalons-coreen": [
    { "nom": "Cosplay Deguisement pour Filles Zoey Huntrix", "prix": "34,90€", "prix_reduction": "54,90€", "note": "", image: "/shop/pantalons/pantalon1.png", hover_image: "/shop/pantalons/pantalon2.png" },
    { "nom": "Jeans Oversize Jeongin - groupe Stray Kids", "prix": "34,90€", "prix_reduction": "", "note": "", image: "/shop/pantalons/pantalon3.webp", hover_image: "/shop/pantalons/pantalon4.png" },
    { "nom": "Pantalon Oversize Jennie - groupe BlackPink", "prix": "34,90€", "prix_reduction": "", "note": "", image: "/shop/pantalons/pantalon5.png", hover_image: "/shop/pantalons/pantalon6.png" },
    { "nom": "Jean Baggy KPOP Jennie - Groupe BlackPink", "prix": "34,90€", "prix_reduction": "", "note": "", image: "/shop/pantalons/pantalon7.png", hover_image: "/shop/pantalons/pantalon8.png" },
    { "nom": "Pyjama Coréen Femme Grande Taille", "prix": "34,90€", "prix_reduction": "", "note": "", image: "/shop/pantalons/pantalon9.png", hover_image: "/shop/pantalons/pantalon10.png" },
    { "nom": "Ensemble Pantalon et Sweat Derpy Tiger Demon Hunters", "prix": "49,90€", "prix_reduction": "", "note": "", image: "/shop/pantalons/pantalon11.webp", hover_image: "/shop/pantalons/pantalon12.webp" },
    { "nom": "Pantalon Jean Gothique Seungmin - Groupe Stray Kids", "prix": "34,90€", "prix_reduction": "", "note": "", image: "/shop/pantalons/pantalon13.png", hover_image: "/shop/pantalons/pantalon14.png" },
    { "nom": "Jean Baggy Japonais Y2K", "prix": "49,90€", "prix_reduction": "", "note": "", image: "/shop/pantalons/pantalon15.png", hover_image: "/shop/pantalons/pantalon16.png" },
    { "nom": "Pantalon Oversize Rose Hyunjin - Groupe StrayKids", "prix": "34,90€", "prix_reduction": "", "note": "", image: "/shop/pantalons/pantalon17.png", hover_image: "/shop/pantalons/pantalon18.png" },
    { "nom": "Pantalon Casual Style", "prix": "34,90€", "prix_reduction": "", "note": "", image: "/shop/pantalons/pantalon19.webp", hover_image: "/shop/pantalons/pantalon20.webp" },
    { "nom": "Shao - Pantalon harem confort en coton", "prix": "39,95€", "prix_reduction": "", "note": "", image: "/shop/pantalons/pantalon21.png", hover_image: "/shop/pantalons/pantalon22.png" },
    { "nom": "Jitsu - Pantalon en velours côtelé", "prix": "49,95€", "prix_reduction": "", "note": "", image: "/shop/pantalons/pantalon23.png", hover_image: "/shop/pantalons/pantalon24.png" },
    { "nom": "Jean Baggy Cherry Blossom", "prix": "49,90€", "prix_reduction": "", "note": "", image: "/shop/pantalons/pantalon25.jpg", hover_image: "/shop/pantalons/pantalon26.jpg" },
    { "nom": "Jeans Oversize KPOP Yeonjun – Groupe TXT", "prix": "34,90€", "prix_reduction": "", "note": "", image: "/shop/pantalons/pantalon27.webp", hover_image: "/shop/pantalons/pantalon28.webp" },
    { "nom": "Pyjama Pantalon Homme", "prix": "54,90€", "prix_reduction": "", "note": "", image: "/shop/pantalons/pantalon29.png", hover_image: "/shop/pantalons/pantalon30.png" },
    { "nom": "Haut Penthouse Korean Drama", "prix": "69,90€", "prix_reduction": "", "note": "", image: "/shop/pantalons/pantalon31.webp", hover_image: "/shop/pantalons/pantalon32.webp" }
  ]

};


// ─── Page metadata ─────────────────────────────────────────────────────────────

const META = {
  't-shirts-korean':    { title: "T-Shirts Korean",         breadcrumb: ["K-Style", "Korean Style", "T-Shirts Korean"] },
  'pyjamas-coreens':    { title: "Pyjamas Coréens",         breadcrumb: ["K-Style", "Korean Style", "Pyjamas Coréens"] },
  'jupes-coreenne':     { title: "Jupes Coréennes",         breadcrumb: ["K-Style", "Mode Coréenne", "Jupes Coréennes"] },
  'manteaux-doudounes': { title: "Manteaux & Doudounes",    breadcrumb: ["K-Style", "Korean Style", "Manteaux & Doudounes"] },
  'blouses-chemises':   { title: "Blouses & Chemises",      breadcrumb: ["K-Style", "Korean Style", "Blouses & Chemises"] },
  'pantalons-coreen':  { title: "Pantalons Coréens",       breadcrumb: ["K-Style", "Korean Style", "Pantalons Coréens"] },
};

// ─── Export: K_STYLE_CATEGORIES[slug] → { title, breadcrumb, products[] } ─────

export const K_STYLE_CATEGORIES = Object.fromEntries(
  Object.entries(RAW).map(([slug, items]) => [
    slug,
    {
      ...META[slug],
      products: items.map((item, i) => ({ id: i + 1, path: `/k-style/${slug}/${i + 1}`, ...normalize(item) })),
    },
  ])
);