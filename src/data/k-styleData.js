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
  const { price: originalPrice } = parsePrice(reducedRaw);

  return {
    name: nameRaw,
    price,
    originalPrice,   // crossed-out original price (null if no sale)
    isEstimated,
    rating: null,
    url: raw.url ?? '',
    image:      raw.image      || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
    hoverImage: raw.hoverImage || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80',
  };
}

// ─── Raw data ──────────────────────────────────────────────────────────────────

export const RAW = {
  't-shirts-korean': [
    { name: "T-shirt Korean Style", price: "24,90€", discount_price: "37,90€", image: "/k-styles/t-shirt/t-shirt1.jpg", hoverImage: "/k-styles/t-shirt/t-shirt1.webp" },
    { name: "T-shirt Finger Heart", price: "22,90€", discount_price: "37,90€", image: "/k-styles/t-shirt/t-shirt2.jpg", hoverImage: "/k-styles/t-shirt/t-shirt2.webp" },
    { name: "T-shirt Coréen Blanc Imprimé", price: "24,90€", discount_price: null, image: "/k-styles/t-shirt/t-shirt3.jpg", hoverImage: "/k-styles/t-shirt/t-shirt3.webp" },
    { name: "T-shirt Korean Pop", price: "24,90€", discount_price: null, image: "/k-styles/t-shirt/t-shirt4.jpg", hoverImage: "/k-styles/t-shirt/t-shirt4.webp" },
    { name: "T-shirt Korean Imprimé", price: "29,90€", discount_price: null, image: "/k-styles/t-shirt/t-shirt5.jpg", hoverImage: "/k-styles/t-shirt/t-shirt5.webp" },
    { name: "T-shirt Coréen Long", price: "30,90€", discount_price: "36,90€", image: "/k-styles/t-shirt/t-shirt6.jpg", hoverImage: "/k-styles/t-shirt/t-shirt6.webp" },
    { name: "T-shirt Korean Unisex", price: "24,90€", discount_price: null, image: "/k-styles/t-shirt/t-shirt7.jpg", hoverImage: "/k-styles/t-shirt/t-shirt7.webp" },
    { name: "T-shirt Coréen Hangoul", price: "29,90€", discount_price: null, image: "/k-styles/t-shirt/t-shirt8.jpg", hoverImage: "/k-styles/t-shirt/t-shirt8.webp" },
    { name: "T-shirt Coréen Halloween", price: "29,90€", discount_price: null, image: "/k-styles/t-shirt/t-shirt9.jpg", hoverImage: "/k-styles/t-shirt/t-shirt9.webp" },
    { name: "T-shirt Korean pour Couple", price: "24,90€", discount_price: null, image: "/k-styles/t-shirt/t-shirt10.jpg", hoverImage: "/k-styles/t-shirt/t-shirt10.webp" },
  ],

  'pyjamas-coreens': [
    { name: "Ensemble Pyjama Huntrix pour Enfant", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama1.jpg", hoverImage: "/k-styles/pyjamas/pyjama1.webp" },
    { name: "Pyjama Cosplay Zoey Huntrix Demon Hunters", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama2.jpg", hoverImage: "/k-styles/pyjamas/pyjama2.webp" },
    { name: "Ensemble Pyjama Imprimé Huntrix Enfant", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama3.jpg", hoverImage: "/k-styles/pyjamas/pyjama3.webp" },
    { name: "Ensemble Pyjama Huntrix Enfant", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama4.jpg", hoverImage: "/k-styles/pyjamas/pyjama4.webp" },
    { name: "Pyjama pour Femme KPop Demon Hunters", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama5.jpg", hoverImage: "/k-styles/pyjamas/pyjama5.webp" },
    { name: "Pyjama Huntrix Demon Hunters Enfant", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama6.jpg", hoverImage: "/k-styles/pyjamas/pyjama6.webp" },
    { name: "Pyjama BT21", price: "39,90€", discount_price: "59,90€", image: "/k-styles/pyjamas/pyjama7.jpg", hoverImage: "/k-styles/pyjamas/pyjama7.webp" },
    { name: "Pyjama Dessin Bt21", price: "29,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama8.jpg", hoverImage: "/k-styles/pyjamas/pyjama8.webp" },
    { name: "Ensemble de Pyjama Coréen Femme", price: "29,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama9.jpg", hoverImage: "/k-styles/pyjamas/pyjama9.webp" },
    { name: "Pyjama BT21 Court", price: "34,90€", discount_price: "59,90€", image: "/k-styles/pyjamas/pyjama10.jpg", hoverImage: "/k-styles/pyjamas/pyjama10.webp" },
    { name: "Pyjama Coréen Femme Grande Taille", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama11.jpg", hoverImage: "/k-styles/pyjamas/pyjama11.webp" },
    { name: "Pyjama Coréen Kawaii pour Couple", price: "29,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama12.jpg", hoverImage: "/k-styles/pyjamas/pyjama12.webp" },
    { name: "Pyjama Coréen Short Femme", price: "29,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama13.jpg", hoverImage: "/k-styles/pyjamas/pyjama13.webp" },
    { name: "Pyjama Coréen Ourson", price: "29,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama14.jpg", hoverImage: "/k-styles/pyjamas/pyjama14.webp" },
    { name: "Pyjama Short Coréen Homme", price: "44,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama15.jpg", hoverImage: "/k-styles/pyjamas/pyjama15.webp" },
    { name: "Ensemble Pyjama Short Fleuri", price: "39,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama16.jpg", hoverImage: "/k-styles/pyjamas/pyjama16.webp" },
    { name: "Ensemble Pyjama Blanc", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama17.jpg", hoverImage: "/k-styles/pyjamas/pyjama17.webp" },
    { name: "Pyjama Korean Leger pour Femme", price: "29,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama18.jpg", hoverImage: "/k-styles/pyjamas/pyjama18.webp" },
    { name: "Pyjama Coréen Kawaii", price: "59,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama19.jpg", hoverImage: "/k-styles/pyjamas/pyjama19.webp" },
    { name: "Ensemble Pyjama Coréen à Rayure", price: "44,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama20.jpg", hoverImage: "/k-styles/pyjamas/pyjama20.webp" },
    { name: "Pyjama Korean à Dentelles", price: "99,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama21.jpg", hoverImage: "/k-styles/pyjamas/pyjama21.webp" },
    { name: "Pyjama Coréen Rouge Femme", price: "59,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama22.jpg", hoverImage: "/k-styles/pyjamas/pyjama22.webp" },
    { name: "Pyjama Coréen pour Couple", price: "49,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama23.jpg", hoverImage: "/k-styles/pyjamas/pyjama23.webp" },
    { name: "Pyjama Hiver Coréen", price: "84,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama24.jpg", hoverImage: "/k-styles/pyjamas/pyjama24.webp" },
    { name: "Pyjama Coréen Matelassé", price: "84,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama25.jpg", hoverImage: "/k-styles/pyjamas/pyjama25.webp" },
    { name: "Ensemble de Pyjama Coréen Homme", price: "64,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama26.jpg", hoverImage: "/k-styles/pyjamas/pyjama26.webp" },
    { name: "Pyjama Pantalon Homme", price: "54,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama27.jpg", hoverImage: "/k-styles/pyjamas/pyjama27.webp" },
    { name: "Pyjama Coréen Homme Grande Taille", price: "104,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama28.jpg", hoverImage: "/k-styles/pyjamas/pyjama28.webp" },
    { name: "Pyjama Femme Korean", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama29.jpg", hoverImage: "/k-styles/pyjamas/pyjama29.webp" },
    { name: "Pyjama Korean Homme Marron", price: "54,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama30.jpg", hoverImage: "/k-styles/pyjamas/pyjama30.webp" },
    { name: "Ensemble Pyjama Derpy Tiger Demon Hunters", price: "34,90€", discount_price: null, image: "/k-styles/pyjamas/pyjama31.jpg", hoverImage: "/k-styles/pyjamas/pyjama31.webp" },
  ],

  'jupes-coreenne': [
    { name: "Jupe Coréenne Plissée", price: "19,90€", discount_price: null, image: "/k-styles/jupes/jupe1.jpg", hoverImage: "/k-styles/jupes/jupe1.webp" },
    { name: "Jupe Coréenne Écolière", price: "22,90€", discount_price: null, image: "/k-styles/jupes/jupe2.jpg", hoverImage: "/k-styles/jupes/jupe2.webp" },
    { name: "Jupe Coréenne Courte", price: "24,90€", discount_price: null, image: "/k-styles/jupes/jupe3.jpg", hoverImage: "/k-styles/jupes/jupe3.webp" },
    { name: "Jupe Coréenne Taille Haute", price: "26,90€", discount_price: null, image: "/k-styles/jupes/jupe4.jpg", hoverImage: "/k-styles/jupes/jupe4.webp" },
    { name: "Jupe Coréenne Longue", price: "29,90€", discount_price: null, image: "/k-styles/jupes/jupe5.jpg", hoverImage: "/k-styles/jupes/jupe5.webp" },
    { name: "Jupe Coréenne à Carreaux", price: "27,90€", discount_price: null, image: "/k-styles/jupes/jupe6.jpg", hoverImage: "/k-styles/jupes/jupe6.webp" },
    { name: "Jupe Coréenne A-Line", price: "25,90€", discount_price: null, image: "/k-styles/jupes/jupe7.jpg", hoverImage: "/k-styles/jupes/jupe7.webp" },
    { name: "Jupe Coréenne avec Poches", price: "28,90€", discount_price: null, image: "/k-styles/jupes/jupe8.jpg", hoverImage: "/k-styles/jupes/jupe8.webp" },
    { name: "Jupe Coréenne K-Pop Style", price: "24,90€", discount_price: null, image: "/k-styles/jupes/jupe9.jpg", hoverImage: "/k-styles/jupes/jupe9.webp" },
    { name: "Jupe Coréenne à Volants", price: "29,90€", discount_price: null, image: "/k-styles/jupes/jupe10.jpg", hoverImage: "/k-styles/jupes/jupe10.webp" },
    { name: "Mini Jupe Coréenne", price: "19,90€", discount_price: null, image: "/k-styles/jupes/jupe11.jpg", hoverImage: "/k-styles/jupes/jupe11.webp" },
    { name: "Jupe Coréenne À Fleurs", price: "27,90€", discount_price: null, image: "/k-styles/jupes/jupe12.jpg", hoverImage: "/k-styles/jupes/jupe12.webp" },
    { name: "Jupe Coréenne Imprimée", price: "28,90€", discount_price: null, image: "/k-styles/jupes/jupe13.jpg", hoverImage: "/k-styles/jupes/jupe13.webp" },
    { name: "Jupe Coréenne Tennis", price: "24,90€", discount_price: null, image: "/k-styles/jupes/jupe14.jpg", hoverImage: "/k-styles/jupes/jupe14.webp" },
    { name: "Jupe Coréenne Noir Classique", price: "22,90€", discount_price: null, image: "/k-styles/jupes/jupe15.jpg", hoverImage: "/k-styles/jupes/jupe15.webp" },
  ],

  'manteaux-doudounes': [
    { name: "Manteau Coreen", price: "61,90€", discount_price: "75,90€", image: "/k-styles/manteaux/manteau1.jpg", hoverImage: "/k-styles/manteaux/manteau1.webp" },
    { name: "Doudoune Pastel Femme", price: "77,90€", discount_price: "94,90€", image: "/k-styles/manteaux/manteau2.jpg", hoverImage: "/k-styles/manteaux/manteau2.webp" },
    { name: "Doudoune Style Coreen", price: "51,90€", discount_price: "63,90€", image: "/k-styles/manteaux/manteau3.jpg", hoverImage: "/k-styles/manteaux/manteau3.webp" },
    { name: "Doudoune Coréenne Mi-Longue", price: "34,90€", discount_price: null, image: "/k-styles/manteaux/manteau4.jpg", hoverImage: "/k-styles/manteaux/manteau4.webp" },
    { name: "Veste en Jean Coreen", price: "49,90€", discount_price: null, image: "/k-styles/manteaux/manteau5.jpg", hoverImage: "/k-styles/manteaux/manteau5.webp" },
    { name: "Doudoune Korean Mi-Longue", price: "59,90€", discount_price: null, image: "/k-styles/manteaux/manteau6.jpg", hoverImage: "/k-styles/manteaux/manteau6.webp" },
    { name: "Manteau Hiver Homme Coréen", price: "49,90€", discount_price: null, image: "/k-styles/manteaux/manteau7.jpg", hoverImage: "/k-styles/manteaux/manteau7.webp" },
    { name: "Manteau Style Coréen Femme", price: "59,90€", discount_price: null, image: "/k-styles/manteaux/manteau8.jpg", hoverImage: "/k-styles/manteaux/manteau8.webp" },
    { name: "Parka Korean Luxe Homme", price: "129,90€", discount_price: null, image: "/k-styles/manteaux/manteau9.jpg", hoverImage: "/k-styles/manteaux/manteau9.webp" },
    { name: "Parka à Col Fourrure Femme", price: "69,90€", discount_price: null, image: "/k-styles/manteaux/manteau10.jpg", hoverImage: "/k-styles/manteaux/manteau10.webp" },
    { name: "Parka Korean pour Homme", price: "64,90€", discount_price: null, image: "/k-styles/manteaux/manteau11.jpg", hoverImage: "/k-styles/manteaux/manteau11.webp" },
    { name: "Parka Longue Femme", price: "149,90€", discount_price: null, image: "/k-styles/manteaux/manteau12.jpg", hoverImage: "/k-styles/manteaux/manteau12.webp" },
    { name: "Parka Coréenne à Fourrure", price: "174,90€", discount_price: null, image: "/k-styles/manteaux/manteau13.jpg", hoverImage: "/k-styles/manteaux/manteau13.webp" },
    { name: "Parka Coréenne Homme", price: "59,90€", discount_price: null, image: "/k-styles/manteaux/manteau14.jpg", hoverImage: "/k-styles/manteaux/manteau14.webp" },
    { name: "Parka Homme à Capuche", price: "64,90€", discount_price: null, image: "/k-styles/manteaux/manteau15.jpg", hoverImage: "/k-styles/manteaux/manteau15.webp" },
    { name: "Doudoune Oversize Style Coréenne", price: "89,90€", discount_price: null, image: "/k-styles/manteaux/manteau16.jpg", hoverImage: "/k-styles/manteaux/manteau16.webp" },
    { name: "Doudoune Courte à Fourrure", price: "74,90€", discount_price: null, image: "/k-styles/manteaux/manteau17.jpg", hoverImage: "/k-styles/manteaux/manteau17.webp" },
    { name: "Doudoune Coréenne Longue", price: "354,90€", discount_price: null, image: "/k-styles/manteaux/manteau18.jpg", hoverImage: "/k-styles/manteaux/manteau18.webp" },
    { name: "Doudoune Rembourrée Sans Manches", price: "34,90€", discount_price: null, image: "/k-styles/manteaux/manteau19.jpg", hoverImage: "/k-styles/manteaux/manteau19.webp" },
    { name: "Doudoune Femme Extra Longue", price: "84,90€", discount_price: null, image: "/k-styles/manteaux/manteau20.jpg", hoverImage: "/k-styles/manteaux/manteau20.webp" },
    { name: "Doudoune Coréenne Femme Oversize", price: "59,90€", discount_price: null, image: "/k-styles/manteaux/manteau21.jpg", hoverImage: "/k-styles/manteaux/manteau21.webp" },
    { name: "Doudoune Femme à Col Fourrure", price: "214,90€", discount_price: null, image: "/k-styles/manteaux/manteau22.jpg", hoverImage: "/k-styles/manteaux/manteau22.webp" },
    { name: "Doudoune Homme à Capuche", price: "99,90€", discount_price: null, image: "/k-styles/manteaux/manteau23.jpg", hoverImage: "/k-styles/manteaux/manteau23.webp" },
    { name: "Doudoune Coréenne Rembourrée", price: "104,90€", discount_price: null, image: "/k-styles/manteaux/manteau24.jpg", hoverImage: "/k-styles/manteaux/manteau24.webp" },
    { name: "Doudoune Matelassée Femme", price: "69,90€", discount_price: null, image: "/k-styles/manteaux/manteau25.jpg", hoverImage: "/k-styles/manteaux/manteau25.webp" },
    { name: "Manteau Korean Long en Laine", price: "179,90€", discount_price: null, image: "/k-styles/manteaux/manteau26.jpg", hoverImage: "/k-styles/manteaux/manteau26.webp" },
    { name: "Manteaux Coréen Femme Mi-Long", price: "104,90€", discount_price: null, image: "/k-styles/manteaux/manteau27.jpg", hoverImage: "/k-styles/manteaux/manteau27.webp" },
    { name: "Manteau Femme Pied de Poule", price: "84,90€", discount_price: null, image: "/k-styles/manteaux/manteau28.jpg", hoverImage: "/k-styles/manteaux/manteau28.webp" },
    { name: "Manteau Court pour Homme", price: "64,90€", discount_price: null, image: "/k-styles/manteaux/manteau29.jpg", hoverImage: "/k-styles/manteaux/manteau29.webp" },
    { name: "Manteau Korean Beige", price: "129,90€", discount_price: null, image: "/k-styles/manteaux/manteau30.jpg", hoverImage: "/k-styles/manteaux/manteau30.webp" },
    { name: "Manteau Korean Unisex", price: "144,90€", discount_price: null, image: "/k-styles/manteaux/manteau31.jpg", hoverImage: "/k-styles/manteaux/manteau31.webp" },
    { name: "Trench Coréen pour Femme", price: "144,90€", discount_price: null, image: "/k-styles/manteaux/manteau32.jpg", hoverImage: "/k-styles/manteaux/manteau32.webp" },
    { name: "Manteau Court à Fourrures", price: "104,90€", discount_price: null, image: "/k-styles/manteaux/manteau33.jpg", hoverImage: "/k-styles/manteaux/manteau33.webp" },
    { name: "Manteau Hiver Coréen", price: "154,90€", discount_price: null, image: "/k-styles/manteaux/manteau34.jpg", hoverImage: "/k-styles/manteaux/manteau34.webp" },
    { name: "Manteau Style Coréen Homme", price: "319,90€", discount_price: null, image: "/k-styles/manteaux/manteau35.jpg", hoverImage: "/k-styles/manteaux/manteau35.webp" },
    { name: "Manteau Long Style Coréen", price: "74,90€", discount_price: null, image: "/k-styles/manteaux/manteau36.jpg", hoverImage: "/k-styles/manteaux/manteau36.webp" },
    { name: "Long Manteau Noir Korean", price: "204,90€", discount_price: null, image: "/k-styles/manteaux/manteau37.jpg", hoverImage: "/k-styles/manteaux/manteau37.webp" },
    { name: "Manteau Coréen Col Fourrure", price: "234,90€", discount_price: null, image: "/k-styles/manteaux/manteau38.jpg", hoverImage: "/k-styles/manteaux/manteau38.webp" },
    { name: "Blouson Parka Coreen", price: "64,90€", discount_price: "78,90€", image: "/k-styles/manteaux/manteau39.jpg", hoverImage: "/k-styles/manteaux/manteau39.webp" },
    { name: "Manteau Velours Femme", price: "65,90€", discount_price: "79,90€", image: "/k-styles/manteaux/manteau40.jpg", hoverImage: "/k-styles/manteaux/manteau40.webp" },
    { name: "Coupe Vent Dinosaure", price: "73,90€", discount_price: "90,90€", image: "/k-styles/manteaux/manteau41.jpg", hoverImage: "/k-styles/manteaux/manteau41.webp" },
    { name: "Parka Coreen", price: "118,90€", discount_price: "145,90€", image: "/k-styles/manteaux/manteau42.jpg", hoverImage: "/k-styles/manteaux/manteau42.webp" },
    { name: "Doudoune Tricolore Degradé", price: "82,90€", discount_price: null, image: "/k-styles/manteaux/manteau43.jpg", hoverImage: "/k-styles/manteaux/manteau43.webp" },
  ],

  'blouses-chemises': [
    { name: "Blouse Coreenne Design à Ceinture", price: "32,90€", discount_price: null, image: "/k-styles/blouses/blouse1.jpg", hoverImage: "/k-styles/blouses/blouse1.webp" },
    { name: "Blouse Korean Broderie Blanche", price: "33,90€", discount_price: null, image: "/k-styles/blouses/blouse2.jpg", hoverImage: "/k-styles/blouses/blouse2.webp" },
    { name: "Chemise à fleur de couleur", price: "À partir de 28,90€", discount_price: null, image: "/k-styles/blouses/blouse3.jpg", hoverImage: "/k-styles/blouses/blouse3.webp" },
    { name: "Blouse Korean à Fleurs", price: "À partir de 27,90€", discount_price: null, image: "/k-styles/blouses/blouse4.jpg", hoverImage: "/k-styles/blouses/blouse4.webp" },
    { name: "Blouse Chemisier à fleurs", price: "33,90€", discount_price: null, image: "/k-styles/blouses/blouse5.jpg", hoverImage: "/k-styles/blouses/blouse5.webp" },
    { name: "Blouse Design Coloré", price: "37,90€", discount_price: null, image: "/k-styles/blouses/blouse6.jpg", hoverImage: "/k-styles/blouses/blouse6.webp" },
    { name: "Blouse Coreenne Crop Top", price: "27,90€", discount_price: null, image: "/k-styles/blouses/blouse7.jpg", hoverImage: "/k-styles/blouses/blouse7.webp" },
    { name: "Blouse Coreenne Taille Froncée", price: "29,90€", discount_price: null, image: "/k-styles/blouses/blouse8.jpg", hoverImage: "/k-styles/blouses/blouse8.webp" },
    { name: "Blouse Coreenne Sexy Marron", price: "40,90€", discount_price: null, image: "/k-styles/blouses/blouse9.jpg", hoverImage: "/k-styles/blouses/blouse9.webp" },
    { name: "Chemisier Blouse Korean Fleurie", price: "29,90€", discount_price: null, image: "/k-styles/blouses/blouse10.jpg", hoverImage: "/k-styles/blouses/blouse10.webp" },
    { name: "Blouse Korean Noeud", price: "28,90€", discount_price: null, image: "/k-styles/blouses/blouse11.jpg", hoverImage: "/k-styles/blouses/blouse11.webp" },
    { name: "Blouse Coreenne Ruffle", price: "À partir de 27,90€", discount_price: null, image: "/k-styles/blouses/blouse12.jpg", hoverImage: "/k-styles/blouses/blouse12.webp" },
    { name: "Blouse Korean Mini Top", price: "À partir de 26,90€", discount_price: null, image: "/k-styles/blouses/blouse13.jpg", hoverImage: "/k-styles/blouses/blouse13.webp" },
    { name: "Blouse Coreenne Satin", price: "33,90€", discount_price: null, image: "/k-styles/blouses/blouse14.jpg", hoverImage: "/k-styles/blouses/blouse14.webp" },
    { name: "Blouse Coreenne Satin (autre variante)", price: "38,90€", discount_price: null, image: "/k-styles/blouses/blouse15.jpg", hoverImage: "/k-styles/blouses/blouse15.webp" },
    { name: "Chemise Coreenne Lune", price: "À partir de 26,90€", discount_price: null, image: "/k-styles/blouses/blouse16.jpg", hoverImage: "/k-styles/blouses/blouse16.webp" },
    { name: "Chemise BTS", price: "39,90€", discount_price: "69,90€", image: "/k-styles/blouses/blouse17.jpg", hoverImage: "/k-styles/blouses/blouse17.webp" },
    { name: "Crop Top Dentelle Lisa - Groupe Blackpink", price: "29,90€", discount_price: null, image: "/k-styles/blouses/blouse18.jpg", hoverImage: "/k-styles/blouses/blouse18.webp" },
    { name: "Chemise Etincelante KPOP Suga - Groupe BTS", price: "29,90€", discount_price: null, image: "/k-styles/blouses/blouse19.jpg", hoverImage: "/k-styles/blouses/blouse19.webp" },
    { name: "Top Coreen Blouse", price: "39,90€", discount_price: null, image: "/k-styles/blouses/blouse20.jpg", hoverImage: "/k-styles/blouses/blouse20.webp" },
    { name: "Chemise Korean Fire", price: "36,90€", discount_price: null, image: "/k-styles/blouses/blouse21.jpg", hoverImage: "/k-styles/blouses/blouse21.webp" },
    { name: "Blouse Chemisier Dragon", price: "40,90€", discount_price: null, image: "/k-styles/blouses/blouse22.jpg", hoverImage: "/k-styles/blouses/blouse22.webp" },
    { name: "Chemise Korean Blue Fire", price: "32,90€", discount_price: null, image: "/k-styles/blouses/blouse23.jpg", hoverImage: "/k-styles/blouses/blouse23.webp" },
    { name: "Blouse Coreenne Top Chic", price: "35,90€", discount_price: null, image: "/k-styles/blouses/blouse24.jpg", hoverImage: "/k-styles/blouses/blouse24.webp" },
    { name: "Blouse Coreenne Casual", price: "32,90€", discount_price: null, image: "/k-styles/blouses/blouse25.jpg", hoverImage: "/k-styles/blouses/blouse25.webp" },
    { name: "Chemise Coreenne Abstrait", price: "35,90€", discount_price: null, image: "/k-styles/blouses/blouse26.jpg", hoverImage: "/k-styles/blouses/blouse26.webp" },
    { name: "Blouse Coreen Chat", price: "À partir de 27,90€", discount_price: null, image: "/k-styles/blouses/blouse27.jpg", hoverImage: "/k-styles/blouses/blouse27.webp" },
    { name: "Blouse Coreenne Manche bouffante", price: "33,90€", discount_price: null, image: "/k-styles/blouses/blouse28.jpg", hoverImage: "/k-styles/blouses/blouse28.webp" },
    { name: "Blouse Coreenne Double Piece", price: "À partir de 28,90€", discount_price: null, image: "/k-styles/blouses/blouse29.jpg", hoverImage: "/k-styles/blouses/blouse29.webp" },
    { name: "Blouse Originale Fleurs 3D", price: "36,90€", discount_price: null, image: "/k-styles/blouses/blouse30.jpg", hoverImage: "/k-styles/blouses/blouse30.webp" },
    { name: "Blouse Korean Top Backless", price: "33,90€", discount_price: null, image: "/k-styles/blouses/blouse31.jpg", hoverImage: "/k-styles/blouses/blouse31.webp" },
    { name: "Blouse Coreenne Elegante", price: "À partir de 36,90€", discount_price: null, image: "/k-styles/blouses/blouse32.jpg", hoverImage: "/k-styles/blouses/blouse32.webp" },
    { name: "Blouse Femme Froncée", price: "30,90€", discount_price: null, image: "/k-styles/blouses/blouse33.jpg", hoverImage: "/k-styles/blouses/blouse33.webp" },
  ]
};


// ─── Page metadata ─────────────────────────────────────────────────────────────

const META = {
  't-shirts-korean':    { title: "T-Shirts Korean",         breadcrumb: ["K-Style", "Korean Style", "T-Shirts Korean"] },
  'pyjamas-coreens':    { title: "Pyjamas Coréens",         breadcrumb: ["K-Style", "Korean Style", "Pyjamas Coréens"] },
  'jupes-coreenne':     { title: "Jupes Coréennes",         breadcrumb: ["K-Style", "Mode Coréenne", "Jupes Coréennes"] },
  'manteaux-doudounes': { title: "Manteaux & Doudounes",    breadcrumb: ["K-Style", "Korean Style", "Manteaux & Doudounes"] },
  'blouses-chemises':   { title: "Blouses & Chemises",      breadcrumb: ["K-Style", "Korean Style", "Blouses & Chemises"] },
};

// ─── Export: K_STYLE_CATEGORIES[slug] → { title, breadcrumb, products[] } ─────

export const K_STYLE_CATEGORIES = Object.fromEntries(
  Object.entries(RAW).map(([slug, items]) => [
    slug,
    {
      ...META[slug],
      products: items.map((item, i) => ({ id: i + 1, ...normalize(item) })),
    },
  ])
);