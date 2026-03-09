// ─── Helper: converts "99,90€" or "À partir de 24,90€" → { price: 99.90, isEstimated: false }
function parsePrice(str) {
  if (!str) return { price: null, isEstimated: false };
  const isEstimated = str.includes('À partir de');
  const cleaned = str.replace('À partir de', '').replace('€', '').replace(',', '.').trim();
  return { price: parseFloat(cleaned), isEstimated };
}

function normalize(raw) {
  // supports both { nom, prix, prix_reduction } and { name, price, discount_price }
  const nameRaw     = raw.nom   ?? raw.name;
  const priceRaw    = raw.prix  ?? raw.price;
  const reducedRaw  = raw.prix_reduction ?? raw.discount_price;

  const { price, isEstimated } = parsePrice(priceRaw);

  // prix_reduction is the ORIGINAL (crossed-out) price in your data
  // discount_price is also the crossed-out price
  const { price: originalPrice } = parsePrice(reducedRaw);

  return {
    name: nameRaw,
    price,           // actual selling price (number)
    originalPrice,   // crossed-out price if on sale (number | null)
    isEstimated,     // shows "À partir de" prefix
    rating: raw.note ? parseFloat(raw.note) || null : raw.rating ?? null,
    url: raw.url ?? '',
    // placeholder images — replace with real ones
    image: raw.image ?? '',
    hoverImage: raw.hoverImage ?? `https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80`,
  };
}

// ─── Raw data ──────────────────────────────────────────────────────────────────

const RAW = {
  lightsticks: [
    { nom: "Lightstick BTS Officiel - Special Edition", prix: "99,90€", prix_reduction: "119,90€", image: `/lightstick/lightstick1.png`, hoverImage: `/lightstick/lightstick2.jpg` },
    { nom: "Lightstick Stray Kids - Officiel", prix: "99,90€", prix_reduction: "", image: `/lightstick/lightstick3.png`, hoverImage: `/lightstick/lightstick4.jpg` },
    { nom: "Lightstick BTS - Armybomb Officiel", prix: "79,90€", prix_reduction: "99,90€", image: `/lightstick/lightstick5.png`, hoverImage: `/lightstick/lightstick6.jpg` },
    { nom: "Lightstick Blackpink Ver. 2 - Officiel (Edition Limitée)", prix: "79,90€", prix_reduction: "99,90€", image: `/lightstick/lightstick7.png`, hoverImage: `/lightstick/lightstick8.jpg` },
    // { nom: "Lightstick Ateez - Officiel", prix: "99,90€", prix_reduction: "119,90€", image: `/lightstick/lightstick9.png`, hoverImage: `/lightstick/lightstick10.jpg` },
    // { nom: "Lightstick Blackpink - Officiel", prix: "75,00€", prix_reduction: "", image: `/lightstick/lightstick11.png`, hoverImage: `/lightstick/lightstick12.jpg` },
    // { nom: "Lightstick officiel Version 2 - Seventeen", prix: "99,90€", prix_reduction: "", image: `/lightstick/lightstick13.png`, hoverImage: `/lightstick/lightstick14.jpg` },
    // { nom: "Lightstick KPOP - Ikon", prix: "73,00€", prix_reduction: "", image: `/lightstick/lightstick15.jpg`, hoverImage: `/lightstick/lightstick16.jpg` },
    // { nom: "Lightstick GOT7", prix: "99,90€", prix_reduction: "", image: `/lightstick/lightstick17.png`, hoverImage: `/lightstick/lightstick18.jpg` },
    // { nom: "Lightstick NCT - Officiel", prix: "99,90€", prix_reduction: "", image: `/lightstick/lightstick19.png`, hoverImage: `/lightstick/lightstick20.jpg` },
    // { nom: "Lightstick Twice - Officiel", prix: "99,90€", prix_reduction: "", image: `/lightstick/lightstick21.png`, hoverImage: `/lightstick/lightstick22.png` },
    // { nom: "Lightstick TXT - Officiel", prix: "99,90€", prix_reduction: "", image: `/lightstick/lightstick23.png`, hoverImage: `/lightstick/lightstick24.png` },
    // { nom: "Lightstick KPOP - Wanna One", prix: "99,90€", prix_reduction: "", image: `/lightstick/lightstick25.jpg`, hoverImage: `/lightstick/lightstick26.png` },
    // { nom: "Lightstick Super Junior Ver.2 - Officiel", prix: "75,00€", prix_reduction: "99,90€", image: `/lightstick/lightstick27.png`, hoverImage: `/lightstick/lightstick28.jpg` },
    // { nom: "Lightstick Monsta X - Officiel", prix: "99,90€", prix_reduction: "", image: `/lightstick/lightstick29.jpg`, hoverImage: `/lightstick/lightstick30.png` },
    // { nom: "Lightstick EXO Ver.3 - Officiel", prix: "99,90€", prix_reduction: "", image: `/lightstick/lightstick31.jpg`, hoverImage: `/lightstick/lightstick32.png` },
    // { nom: "Lightstick Mamamoo Ver.2.5 - Officiel", prix: "99,90€", prix_reduction: "", image: `/lightstick/lightstick33.jpg`, hoverImage: `/lightstick/lightstick34.png` },
    // { nom: "Lightstick Red Velvet - Officiel", prix: "99,90€", prix_reduction: "", image: `/lightstick/lightstick35.jpg`, hoverImage: `/lightstick/lightstick36.png` },
    // { nom: "Lightstick SHINee - Officiel", prix: "99,90€", prix_reduction: "", image: `/lightstick/lightstick37.jpg`, hoverImage: `/lightstick/lightstick38.png` },
    // { nom: "Lightstick GFriend Ver.2 - Officiel", prix: "99,90€", prix_reduction: "", image: `/lightstick/lightstick39.jpg`, hoverImage: `/lightstick/lightstick40.png` },
  ],
  'coques': [
    { name: "Coque BTS - Groupe KPOP",                     price: "19,90€", discount_price: null, image: `/coques/coque1.jpg`,  hoverImage: `/coques/coque2.webp` },
    { name: "Coque Aipords BT21 Shooky",                  price: "24,90€", discount_price: null, image: `/coques/coque3.jpg`,  hoverImage: `/coques/coque4.jpg` },
    { name: "Coque BTS - Love Yourself Noir",             price: "19,90€", discount_price: null, image: `/coques/coque5.webp`,  hoverImage: `/coques/coque6.webp` },
    { name: "Coque BT21 - Big Van",                       price: "19,90€", discount_price: null, image: `/coques/coque7.webp`,  hoverImage: `/coques/coque8.webp` },
    { name: "Coque BT21 - Tata",                          price: "19,90€", discount_price: null, image: `/coques/coque9.webp`,  hoverImage: `/coques/coque10.webp` },
    { name: "Coque BT21 - Cooky",                         price: "19,90€", discount_price: null, image: `/coques/coque11.webp`, hoverImage: `/coques/coque12.jpg` },
    { name: "Coque BTS - Love Yourself Rose",             price: "19,90€", discount_price: null, image: `/coques/coque13.webp`, hoverImage: `/coques/coque14.webp` },
    { name: "Coque Boisson Coréenne",                     price: "19,90€", discount_price: null, image: `/coques/coque15.png`, hoverImage: `/coques/coque16.webp` },
    { name: "Coque Airpods EXO",                          price: "19,90€", discount_price: null, image: `/coques/coque17.png`, hoverImage: `/coques/coque18.webp` },
    { name: "Coque Airpods BT21 Cuir",                    price: "19,90€", discount_price: null, image: `/coques/coque19.png`, hoverImage: `/coques/coque20.png` },
    { name: "Coque Airpods BT21 Transparent",             price: "19,90€", discount_price: null, image: `/coques/coque21.jpg`, hoverImage: `/coques/coque22.webp` },
    { name: "Coque NCT - We Boom",                        price: "19,90€", discount_price: null, image: `/coques/coque23.jpg`, hoverImage: `/coques/coque24.png` },
    { name: "Coque BTS - Euphoria",                       price: "19,90€", discount_price: null, image: `/coques/coque25.png`, hoverImage: `/coques/coque26.png` },
    { name: "Coque BTS - Love Yourself Blanc",            price: "19,90€", discount_price: null, image: `/coques/coque27.png`, hoverImage: `/coques/coque28.png` },
    { name: "Coque BTS - Love Yourself Jaune",            price: "19,90€", discount_price: null, image: `/coques/coque29.png`, hoverImage: `/coques/coque30.png` },
    // { name: "Coque BTS - Love Yourself Rouge",            price: "19,90€", discount_price: null, image: `/coques/coque31.png`, hoverImage: `/coques/coque32.png` },
    // { name: "Coque BTS - Map of The Soul 7",              price: "19,90€", discount_price: null, image: `/coques/coque33.png`, hoverImage: `/coques/coque34.jpg` },
    // { name: "Coque BTS - Fanart",                         price: "19,90€", discount_price: null, image: `/coques/coque35.png`, hoverImage: `/coques/coque36.png` },
    // { name: "Coque BTS - August D Musique",               price: "19,90€", discount_price: null, image: `/coques/coque37.png`, hoverImage: `/coques/coque38.png` },
    // { name: "Coque BTS - Min Yoon Gi",                    price: "19,90€", discount_price: null, image: `/coques/coque39.jpg`, hoverImage: `/coques/coque40.jpg` },
  ],
  "posters": [
    { nom: "Poster KPOP Huntrix Demon Hunters",        prix: "À partir de 24,90€", prix_reduction: "", note: "", url: "", image: `/posters/poster42.png`,  hoverImage: `/posters/poster43.png` },
    { nom: "Poster Décoratif KPop Demon Hunters",      prix: "À partir de 24,90€", prix_reduction: "", note: "", url: "", image: `/posters/poster50.png`,  hoverImage: `/posters/poster51.png` },
    { nom: "Poster KPop Demon Hunters",                prix: "À partir de 24,90€", prix_reduction: "", note: "", url: "", image: `/posters/poster68.png`,  hoverImage: `/posters/poster69.png` },
    { nom: "Poster KPOP - groupe Blackpink",           prix: "24,90€",             prix_reduction: "", note: "", url: "", image: `/posters/poster1.jpg`,  hoverImage: `/posters/poster11.png` },
    { nom: "Poster KPOP - groupe Stray Kids",          prix: "24,90€",             prix_reduction: "", note: "", url: "", image: `/posters/poster3.jpg`,  hoverImage: `/posters/poster4.png` },
    { nom: "Poster KPOP - Groupe Twice",               prix: "24,90€",             prix_reduction: "", note: "", url: "", image: `/posters/poster5.jpg`, hoverImage: `/posters/poster6.webp` },
    { nom: "Poster KPOP New Jeans",                    prix: "À partir de 19,90€", prix_reduction: "", note: "", url: "", image: `/posters/poster7.png`, hoverImage: `/posters/poster8.webp` },
    { nom: "Poster KPOP - Groupe IVE",                 prix: "À partir de 19,90€", prix_reduction: "", note: "", url: "", image: `/posters/poster9.png`, hoverImage: `/posters/poster10.png` },
    { nom: "Poster Mural KPOP - Groupe IVE",           prix: "À partir de 19,90€", prix_reduction: "", note: "", url: "", image: `/posters/poster11.png`, hoverImage: `/posters/poster12.webp` },
    { nom: "Poster Drapeau Américain KPOP - Groupe IVE", prix: "À partir de 19,90€", prix_reduction: "", note: "", url: "", image: `/posters/poster13.png`, hoverImage: `/posters/poster14.webp` },
    { nom: "Poster Cha Eun Woo - KPOP A-Astro",        prix: "24,90€",             prix_reduction: "", note: "", url: "", image: `/posters/poster17.jpg`, hoverImage: `/posters/poster18.webp` },
    { nom: "Poster Décoratif KPOP - Groupe Astro",     prix: "24,90€",             prix_reduction: "", note: "", url: "", image: `/posters/poster19.jpg`, hoverImage: `/posters/poster20.webp` },
    { nom: "Poster KPOP - Groupe GOT7",                prix: "24,90€",             prix_reduction: "", note: "", url: "", image: `/posters/poster21.jpg`, hoverImage: `/posters/poster22.jpg` },
    { nom: "Poster KPOP - groupe A-ATEEZ",            prix: "24,90€",             prix_reduction: "", note: "", url: "", image: `/posters/poster23.jpg`, hoverImage: `/posters/poster24.webp` },
    { nom: "Poster Décoratif KPOP - groupe New Jeans", prix: "À partir de 19,90€", prix_reduction: "", note: "", url: "", image: `/posters/poster25.png`, hoverImage: `/posters/poster26.webp` },
    // { nom: "Poster KPOP - Groupe BTS",                 prix: "24,90€",             prix_reduction: "", note: "", url: "", image: `/posters/poster27.jpg`, hoverImage: `/posters/poster28.jpg` },
    // { nom: "Poster KPOP - Groupe EXO",                 prix: "24,90€",             prix_reduction: "", note: "", url: "", image: `/posters/poster29.jpg`, hoverImage: `/posters/poster30.jpg` },
  ],

  'photocards': [
    { nom: "Photocards NCT127",                                    prix: "9,95€",             prix_reduction: "", image: `/photocards/photocard34.jpg`,  hoverImage: `/photocards/photocard35.jpg` },
    { nom: "Set de 10 Photocards NCT127",                           prix: "11,95€",            prix_reduction: "", image: `/photocards/photocard36.jpg`,  hoverImage: `` },
    { nom: "Set de 10 photocards ATEEZ",                            prix: "12,95€",            prix_reduction: "", image: `/photocards/photocard37.jpg`,  hoverImage: `/photocards/photocard38.jpg` },
    { nom: "Set de 6 NCT127 Photocards",                            prix: "9,95€",             prix_reduction: "", image: `/photocards/photocard39.webp`,  hoverImage: `/photocards/photocard40.webp` },
    { nom: "Set de 16 LOMO Cards MONSTA X",                        prix: "11,95€",            prix_reduction: "14,95€", image: `/photocards/photocard23.png`,  hoverImage: `/photocards/photocard17.png` },
    { nom: "Photocard NCT127 - Yellow & Orange",                    prix: "11,95€",            prix_reduction: "", image: `/photocards/photocard42.webp`, hoverImage: `/photocards/photocard61.png` },
    { nom: "Photocard Storage 240 slots",                           prix: "24,90€",            prix_reduction: "", image: `/photocards/photocard56.webp`, hoverImage: `/photocards/photocard62.webp` },
    { nom: "Mini Photocard Binder",                                 prix: "23,90€",            prix_reduction: "", image: `/photocards/photocard63.jpg`, hoverImage: `` },
    { nom: "Transparent Photocard Binder",                          prix: "22,90€",            prix_reduction: "32,90€", image: `/photocards/photocard63.jpg`, hoverImage: `` },
    { nom: "Mini Porte Photocard",                                  prix: "14,90€",            prix_reduction: "", image: `/photocards/photocard19.png`, hoverImage: `/photocards/photocard20.webp` },
    { nom: "Photocard Binder 120 Places",                           prix: "19,90€",            prix_reduction: "29,90€", image: `/photocards/photocard21.png`, hoverImage: `/photocards/photocard22.webp` },
    { nom: "Photocard Binder 72 Places",                            prix: "19,90€",            prix_reduction: "", image: `/photocards/photocard23.png`, hoverImage: `/photocards/photocard24.png` },
    { nom: "Mini Photocard Binder (version 2)",                     prix: "À partir de 9,90€", prix_reduction: "", image: `/photocards/photocard25.webp`, hoverImage: `/photocards/photocard26.png` },
    { nom: "Set of plastic photocard protectors",                   prix: "14,90€",            prix_reduction: "", image: `/photocards/photocard27.webp`, hoverImage: `/photocards/photocard28.png` },
    { nom: "Set of 13 Cards of Idol Boy Group K-pop",               prix: "19,90€",            prix_reduction: "", image: `/photocards/photocard29.png`, hoverImage: `/photocards/photocard30.png` },
    // { nom: "Photocards Stray Kids Album Noeasy",                    prix: "24,90€",            prix_reduction: "", image: `/photocards/photocard31.png`, hoverImage: `/photocards/photocard32.png` },
    // { nom: "Photocards Lomo K-Pop",                                 prix: "19,90€",            prix_reduction: "", image: `/photocards/photocard33.webp`, hoverImage: `/photocards/photocard34.jpg` },
  ],

  'box-coffrets': [
    { nom: "Calendrier de l'Avent KPop Huntrix",                prix: "À partir de 29,90€", prix_reduction: "49,90€", image: `/boxes/box1.png`,  hoverImage: `/boxes/box2.png` },
    { nom: "Calendrier de l'Avent KPop Demon Hunters [Deluxe]", prix: "29,90€",             prix_reduction: "49,90€", image: `/boxes/box3.png`,  hoverImage: `/boxes/box4.png` },
    { nom: "Calendrier de l'Avent Demon Hunters",               prix: "29,90€",             prix_reduction: "",        image: `/boxes/box5.png`,  hoverImage: `/boxes/box6.png` },
    { nom: "Blackpink Coffret Cadeau",                          prix: "49,90€",             prix_reduction: "",        image: `/boxes/box7.png`,  hoverImage: `/boxes/box8.png` },
    { nom: "Box Cadeau Surprise KPop",                          prix: "54,90€",             prix_reduction: "",        image: `/boxes/box9.png`,  hoverImage: `/boxes/box10.png` },
    { nom: "Coffret Cadeau Fans KPop",                          prix: "44,90€",             prix_reduction: "",        image: `/boxes/box11.png`, hoverImage: `/boxes/box12.png` },
    { nom: "Box Premium KPop Idoles",                           prix: "44,90€",             prix_reduction: "",        image: `/boxes/box13.png`, hoverImage: `/boxes/box14.png` },
    { nom: "Boîte Cadeau Stray Kids",                           prix: "89,90€",             prix_reduction: "",        image: `/boxes/box15.png`, hoverImage: `/boxes/box16.png` },
    { nom: "Box Cadeau Fans KPop",                              prix: "39,90€",             prix_reduction: "",        image: `/boxes/box17.png`, hoverImage: `/boxes/box18.png` },
    { nom: "Coffret Cadeau Fans Twice",                         prix: "39,90€",             prix_reduction: "",        image: `/boxes/box19.png`, hoverImage: `/boxes/box20.png` },
    { nom: "Box Cadeau Twice KPop",                             prix: "44,90€",             prix_reduction: "",        image: `/boxes/box21.png`, hoverImage: `/boxes/box22.png` },
    { nom: "Coffret Cadeau KPop GI-DLE",                        prix: "39,90€",             prix_reduction: "",        image: `/boxes/box23.png`, hoverImage: `/boxes/box24.png` },
    { nom: "Coffret Cadeau Officiel Twice",                     prix: "39,90€",             prix_reduction: "",        image: `/boxes/box25.png`, hoverImage: `/boxes/box26.png` },
    { nom: "Box Cadeau Officiel IVE",                           prix: "44,90€",             prix_reduction: "",        image: `/boxes/box27.png`, hoverImage: `/boxes/box28.png` },
    { nom: "Box Cadeau GI-DLE KPop",                            prix: "39,90€",             prix_reduction: "",        image: `/boxes/box29.png`, hoverImage: `/boxes/box30.png` },
    // { nom: "Coffret Cadeau GI-DLE KPop",                        prix: "44,90€",             prix_reduction: "",        image: `/boxes/box31.png`, hoverImage: `/boxes/box32.png` },
    // { nom: "Box IVE Fans Premium",                              prix: "54,90€",             prix_reduction: "",        image: `/boxes/box33.png`, hoverImage: `/boxes/box34.png` },
  ],

  'figurines-poupees': [
    { name: "Poupées Huntrix Demon Hunters",          price: "À partir de 24,90€", discount_price: "39,90€", image: `/figurines/figurine23.png`,  hoverImage: `/figurines/figurine24.png` },
    { name: "Poupées Huntrix KPop Demon Hunters",     price: "24,90€",             discount_price: "39,90€", image: `/figurines/figurine3.png`,  hoverImage: `/figurines/figurine29.png` },
    { name: "Figurines Demon Hunters Huntrix 5pcs",   price: "24,90€",             discount_price: "39,90€", image: `/figurines/figurine29.png`,  hoverImage: `/figurines/figurine12.png` },
    { name: "Figurines Kpop Demon Hunters",           price: "À partir de 29,90€", discount_price: null,      image: `/figurines/figurine30.png`,  hoverImage: `/figurines/figurine30.png` },
    { name: "Figurines KPop Demon Hunters Huntrix",   price: "74,90€",             discount_price: null,      image: `/figurines/figurine15.jpg`,  hoverImage: `` },
    { name: "Figurine KPOP - Groupe New Jeans",       price: "49,90€",             discount_price: null,      image: `/figurines/figurine4.png`, hoverImage: `/figurines/figurine5.png` },
    { name: "Figurine BTS POP UP : Jungkook",         price: "49,90€",             discount_price: null,      image: `/figurines/figurine6.png`, hoverImage: `` },
    { name: "Figurine BTS POP UP : Suga",             price: "49,90€",             discount_price: null,      image: `/figurines/figurine7.png`, hoverImage: `` },
    { name: "Figurine BTS POP UP : V",                price: "49,90€",             discount_price: null,      image: `/figurines/figurine8.png`, hoverImage: `` },
    { name: "Figurine BTS POP UP : J-Hope",           price: "49,90€",             discount_price: null,      image: `/figurines/figurine9.png`, hoverImage: `` },
    { name: "Figurine BTS POP UP : Jin",              price: "49,90€",             discount_price: null,      image: `/figurines/figurine10.png`, hoverImage: `` },
    { name: "Figurine BTS POP UP : Jimin",            price: "49,90€",             discount_price: null,      image: `/figurines/figurine11.png`, hoverImage: `` },
    { name: "Figurine BTS POP UP : House",            price: "249,90€",            discount_price: null,      image: `/figurines/figurine12.png`, hoverImage: `` },
    { name: "Figurine BTS POP UP : RM",               price: "49,90€",             discount_price: null,      image: `/figurines/figurine13.png`, hoverImage: `` },
    { name: "Pack complet Figurine BTS TinyTan Mini", price: "219,90€",            discount_price: null,      image: `/figurines/figurine14.png`, hoverImage: `` },
    // { name: "Figurine BTS TinyTan Jungkook",          price: "49,90€",             discount_price: null,      image: `/figurines/figurine15.jpg`, hoverImage: `` },
    // { name: "Figurine BTS TinyTan Suga",              price: "49,90€",             discount_price: null,      image: `/figurines/figurine17.jpg`, hoverImage: `` },
  ],
  'masques':[
    {"name":"Masque coréen - Motif bouche","price":"14,95€","prix_reduction":"19,95€","image":"/masques/mask1.png","hoverImage":"/masques/mask1-alt.png"},
    {"name":"Masque KPOP - Groupes de musiques","price":"14,95€","prix_reduction":"19,95€","image":"/masques/mask2.png","hoverImage":"/masques/mask2-alt.png"},
    {"name":"Masque Stray Kids","price":"14,95€","prix_reduction":"19,95€","image":"/masques/mask3.png","hoverImage":"/masques/mask3-alt.png"},
    {"name":"Masque de Sommeil BT21","price":"19,90€","prix_reduction":"","image":"/masques/mask4.png","hoverImage":"/masques/mask4-alt.png"},
    {"name":"Lot de 3 Masques BTS - Bangtan Boys","price":"19,90€","prix_reduction":"","image":"/masques/mask5.png","hoverImage":"/masques/mask5-alt.png"},
    {"name":"Lot de 3 Masques BTS - Suga","price":"19,90€","prix_reduction":"","image":"/masques/mask6.png","hoverImage":"/masques/mask6-alt.png"},
    {"name":"Lot de 3 Masques BTS - Jung Kook","price":"19,90€","prix_reduction":"","image":"/masques/mask7.png","hoverImage":"/masques/mask7-alt.png"},
    {"name":"Lot de 3 Masques BTS - V Kawaii","price":"19,90€","prix_reduction":"","image":"/masques/mask8.png","hoverImage":"/masques/mask8-alt.png"},
    {"name":"Masque Coréen B.A.P","price":"14,95€","prix_reduction":"19,95€","image":"/masques/mask9.png","hoverImage":"/masques/mask9-alt.png"},
    {"name":"Masque Blackpink KPOP","price":"14,95€","prix_reduction":"19,95€","image":"/masques/mask10.png","hoverImage":"/masques/mask10-alt.png"},
    {"name":"Masque MONSTA X","price":"14,95€","prix_reduction":"19,95€","image":"/masques/mask11.png","hoverImage":"/masques/mask11-alt.png"},
    {"name":"Masque Seventeen","price":"14,95€","prix_reduction":"19,95€","image":"/masques/mask12.png","hoverImage":"/masques/mask12-alt.png"},
    {"name":"Masque Twice","price":"14,95€","prix_reduction":"19,95€","image":"/masques/mask13.png","hoverImage":"/masques/mask13-alt.png"},
    {"name":"Lot de 3 Masques BTS - Jimin","price":"19,90€","prix_reduction":"","image":"/masques/mask14.png","hoverImage":"/masques/mask14-alt.png"},
    {"name":"Lot de 3 Masques BTS - J-Hope","price":"19,90€","prix_reduction":"","image":"/masques/mask15.png","hoverImage":"/masques/mask15-alt.png"},
  ],
  "vetement-t-shirts": [
    { "nom": "T-Shirt BTS - MOTS7 Black", "prix": "39,90€", "prix_reduction": "59,90€", "note": "", image: "/shop/t-shirts/t-shirt1.png", hoverImage:"/shop/t-shirts/t-shirt2.png" },
    { "nom": "T-Shirt Stray Kids Unveil Tour", "prix": "29,90€", "prix_reduction": "", "note": "", image: "/shop/t-shirts/t-shirt3.png", hoverImage:"/shop/t-shirts/t-shirt4.png" },
    { "nom": "T-Shirt TXT - Members Group", "prix": "29,90€", "prix_reduction": "29,95€", "note": "", image: "/shop/t-shirts/t-shirt5.png", hoverImage:"/shop/t-shirts/t-shirt6.png" },
    { "nom": "T-Shirt Orange", "prix": "29,90€", "prix_reduction": "", "note": "", image: "/shop/t-shirts/t-shirt7.webp", hoverImage:"/shop/t-shirts/t-shirt8.jpg" },
    { "nom": "T-Shirt Stray Kids Members Group", "prix": "29,90€", "prix_reduction": "", "note": "", image: "/shop/t-shirts/t-shirt9.jpg", hoverImage:"/shop/t-shirts/t-shirt10.jpg" },
    { "nom": "T-Shirt Stray Kids Unlock : GO", "prix": "29,90€", "prix_reduction": "", "note": "", image: "/shop/t-shirts/t-shirt11.jpg", hoverImage:"/shop/t-shirts/t-shirt12.png" },
    { "nom": "T-Shirt BTS We Are Bullet Proof Love", "prix": "34,90€", "prix_reduction": "", "note": "", image: "/shop/t-shirts/t-shirt13.jpg", hoverImage:"/shop/t-shirts/t-shirt14.jpg" },
    { "nom": "T-Shirt BTS We Are Bullet Proof Album", "prix": "34,90€", "prix_reduction": "", "note": "", image: "/shop/t-shirts/t-shirt15.jpg", hoverImage:"/shop/t-shirts/t-shirt16.jpg" },
    { "nom": "T-Shirt BTS Jungkook Kawaii", "prix": "24,90€", "prix_reduction": "", "note": "", image: "/shop/t-shirts/t-shirt17.jpg", hoverImage:"/shop/t-shirts/t-shirt18.png" },
    { "nom": "T-Shirt NCT127 WayV", "prix": "19,95€", "prix_reduction": "29,95€", "note": "", image: "/shop/t-shirts/t-shirt19.png", hoverImage:"/shop/t-shirts/t-shirt20.jpg" },
    { "nom": "T-Shirt (G)I-DLE - Never dies Tomboy", "prix": "29,90€", "prix_reduction": "", "note": "", image: "/shop/t-shirts/t-shirt21.jpg", hoverImage:"/shop/t-shirts/t-shirt22.jpg" },
    { "nom": "T-Shirt Ateez The Fellowship", "prix": "29,90€", "prix_reduction": "", "note": "", image: "/shop/t-shirts/t-shirt23.png", hoverImage:"/shop/t-shirts/t-shirt24.jpg" },
    { "nom": "T-Shirt Black Cat Nero Z", "prix": "29,90€", "prix_reduction": "", "note": "", image: "/shop/t-shirts/t-shirt25.jpg", hoverImage:"/shop/t-shirts/t-shirt26.jpg" },
    { "nom": "T-Shirt Seventeen Chibi", "prix": "29,90€", "prix_reduction": "", "note": "", image: "/shop/t-shirts/t-shirt27.jpg", hoverImage:"/shop/t-shirts/t-shirt28.jpg" },
    { "nom": "T-Shirt Seventeen Be The Sun", "prix": "29,90€", "prix_reduction": "", "note": "", image: "/shop/t-shirts/t-shirt29.jpg", hoverImage:"/shop/t-shirts/t-shirt30.jpg" },
    // { "nom": "T-Shirt Seventeen Power Of Love", "prix": "29,90€", "prix_reduction": "", "note": "", image: "/shop/t-shirts/t-shirt31.jpg", hoverImage:"/shop/t-shirts/t-shirt32.png" },
    // { "nom": "T-Shirt KPOP Astro", "prix": "29,90€", "prix_reduction": "", "note": "", image: "/shop/t-shirts/t-shirt33.png", hoverImage:"/shop/t-shirts/t-shirt34.png" },
  ]
};

// ─── Page metadata (title + breadcrumb) ───────────────────────────────────────

const META = {
  lightsticks:         { title: "Lightstick KPOP",      breadcrumb: ["KPOP Merch", "Lightsticks"] },
  coques:              { title: "Coques KPOP",           breadcrumb: ["KPOP Merch", "Coques"] },
  posters:             { title: "Posters KPOP",          breadcrumb: ["KPOP Merch", "Posters"] },
  photocards:          { title: "Photocards KPOP",       breadcrumb: ["KPOP Merch", "Photocards"] },
  'box-coffrets':      { title: "Box & Coffrets KPOP",   breadcrumb: ["KPOP Merch", "Box & Coffrets"] },
  'figurines-poupees': { title: "Figurines & Poupées",   breadcrumb: ["KPOP Merch", "Figurines & Poupées"] },
  'masques':           { title: "Masques KPOP",          breadcrumb: ["Vetements POP", "Masques"] },
  'vetement-t-shirts':           { title: "T-Shirts KPOP",          breadcrumb: ["Vetements POP", "T-Shirts"] },
};

// ─── Final export: CATEGORIES[slug] → { title, breadcrumb, products[] } ───────

export const CATEGORIES = Object.fromEntries(
  Object.entries(RAW).map(([slug, items]) => [
    slug,
    {
      ...META[slug],
      products: items.map((item, i) => ({ id: i + 1, path: `/shop/${slug}/${i + 1}`, ...normalize(item) })),
    },
  ])
);