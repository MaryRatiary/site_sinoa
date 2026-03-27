const huntrixProducts = [
  {
    id: 'huntrix-1',
    name: "T-Shirt Huntrix Demon Hunter",
    price: 34.90,
    originalPrice: 54.90,
    url: "/figurines/figurine1.png",
    urlHover: "/figurines/figurine2.png",
    description: "T-shirt officiel Huntrix Demon Hunter avec logo brodé. Confortable et tendance pour tous les fans.",
    category: "Vêtements",
    brand: "Huntrix Official",
    material: "100% Coton Premium",
    colors: [
      { colorName: "Noir", colorHex: "#000000", stock: 25 },
      { colorName: "Blanc", colorHex: "#FFFFFF", stock: 18 },
      { colorName: "Gris", colorHex: "#808080", stock: 12 }
    ],
    sizes: [
      { size: "XS", stock: 5 },
      { size: "S", stock: 12 },
      { size: "M", stock: 15 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 8 },
      { size: "XXL", stock: 5 }
    ],
    rating: 4.6,
    reviewCount: 142,
    inStock: true,
    stock: 55,
    isEstimated: false,
    careInstructions: "Lavage à 30°C, ne pas sécher au sèche-linge"
  },
  {
    id: 'huntrix-2',
    name: "Sweat Huntrix Premium",
    price: 59.90,
    originalPrice: 89.90,
    url: "/figurines/figurine3.png",
    urlHover: "/figurines/figurine4.png",
    description: "Sweatshirt premium Huntrix avec design exclusif et détails brodés. Parfait pour l'hiver.",
    category: "Vêtements",
    brand: "Huntrix Premium",
    material: "80% Coton, 20% Polyester",
    colors: [
      { colorName: "Noir", colorHex: "#000000", stock: 18 },
      { colorName: "Gris Foncé", colorHex: "#2F4F4F", stock: 15 },
      { colorName: "Bleu Marine", colorHex: "#000080", stock: 12 }
    ],
    sizes: [
      { size: "XS", stock: 3 },
      { size: "S", stock: 8 },
      { size: "M", stock: 10 },
      { size: "L", stock: 7 },
      { size: "XL", stock: 5 }
    ],
    rating: 4.8,
    reviewCount: 178,
    inStock: true,
    stock: 43,
    isEstimated: false,
    careInstructions: "Lavage délicat à 30°C, séchage à l'air libre"
  },
  {
    id: 'huntrix-3',
    name: "Figurine Huntrix Articulée",
    price: 44.90,
    originalPrice: 74.90,
    url: "/figurines/figurine5.webp",
    urlHover: "/figurines/figurine6.png",
    description: "Figurine articulée collector Huntrix haute qualité. Détails impeccables et posables à volonté.",
    category: "Figurines",
    brand: "Huntrix Collectibles",
    material: "PVC haute qualité",
    colors: [
      { colorName: "Version Standard", colorHex: "#C0C0C0", stock: 32 }
    ],
    sizes: [],
    rating: 4.9,
    reviewCount: 267,
    inStock: true,
    stock: 32,
    isEstimated: false,
    careInstructions: "Protéger de la lumière directe et de l'humidité"
  },
  {
    id: 'huntrix-4',
    name: "Sac à Dos Huntrix Officiel",
    price: 69.90,
    originalPrice: 109.90,
    url: "/figurines/figurine7.png",
    urlHover: "/figurines/figurine8.png",
    description: "Sac à dos officiel Huntrix avec design ergonomique et plusieurs compartiments. Pratique et stylé.",
    category: "Accessoires",
    brand: "Huntrix Official",
    material: "Polyester haute densité",
    colors: [
      { colorName: "Noir", colorHex: "#000000", stock: 28 },
      { colorName: "Gris", colorHex: "#808080", stock: 22 }
    ],
    sizes: [],
    rating: 4.7,
    reviewCount: 145,
    inStock: true,
    stock: 50,
    isEstimated: false,
    careInstructions: "Nettoyage à l'eau tiède avec un chiffon humide"
  },
  {
    id: 'huntrix-5',
    name: "Poster Huntrix Limited Edition",
    price: 14.90,
    originalPrice: 24.90,
    url: "/figurines/figurine9.png",
    urlHover: "/figurines/figurine10.png",
    description: "Poster collector limited edition Huntrix. Format A2 avec finition brillante premium.",
    category: "Posters",
    brand: "Huntrix Official",
    material: "Papier brillant 300g",
    colors: [],
    sizes: [
      { size: "A2", stock: 150 }
    ],
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    stock: 150,
    isEstimated: false,
    careInstructions: "Conserver à plat, protéger de l'humidité"
  },
  {
    id: 'huntrix-6',
    name: "Mug Huntrix Collector",
    price: 12.90,
    originalPrice: 19.90,
    url: "/figurines/figurine11.png",
    urlHover: "/figurines/figurine12.png",
    description: "Mug collector Huntrix avec design exclusif. Parfait pour prendre le café en tant que fan.",
    category: "Accessoires",
    brand: "Huntrix Official",
    material: "Céramique premium",
    colors: [
      { colorName: "Blanc", colorHex: "#FFFFFF", stock: 67 },
      { colorName: "Noir", colorHex: "#000000", stock: 45 }
    ],
    sizes: [],
    rating: 4.6,
    reviewCount: 124,
    inStock: true,
    stock: 112,
    isEstimated: false,
    careInstructions: "Lave-vaisselle, ne pas mettre au micro-ondes"
  },
  {
    id: 'huntrix-7',
    name: "Casquette Huntrix Officielle",
    price: 29.90,
    originalPrice: 49.90,
    url: "/figurines/figurine13.png",
    urlHover: "/figurines/figurine14.png",
    description: "Casquette officielle Huntrix avec broderie premium. Ajustable et confortable pour tous.",
    category: "Accessoires",
    brand: "Huntrix Official",
    material: "Coton 100%",
    colors: [
      { colorName: "Noir", colorHex: "#000000", stock: 38 },
      { colorName: "Blanc", colorHex: "#FFFFFF", stock: 25 }
    ],
    sizes: [
      { size: "One Size", stock: 63 }
    ],
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    stock: 63,
    isEstimated: false,
    careInstructions: "Lavage délicat à la main"
  },
  {
    id: 'huntrix-8',
    name: "Album Huntrix Demon Hunters",
    price: 24.90,
    originalPrice: 39.90,
    url: "/figurines/figurine15.jpg",
    urlHover: "/figurines/figurine16.jpg",
    description: "Album officiel Huntrix Demon Hunters avec photobook, CD et photocards collector.",
    category: "Musique",
    brand: "Huntrix Records",
    material: "Coque rigide premium",
    colors: [],
    sizes: [],
    rating: 4.9,
    reviewCount: 312,
    inStock: true,
    stock: 89,
    isEstimated: false,
    careInstructions: "Conserver dans un endroit sec"
  }
];

export default huntrixProducts;
