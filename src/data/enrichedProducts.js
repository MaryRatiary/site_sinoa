// Données enrichies pour chaque produit avec tailles, descriptions, etc.

export const PRODUCT_DETAILS = {
  lightsticks: {
    1: {
      id: 1,
      name: "Lightstick BTS Officiel - Special Edition",
      category: "lightsticks",
      price: 99.90,
      originalPrice: 119.90,
      image: "/lightstick/lightstick1.png",
      hoverImage: "/lightstick/lightstick2.jpg",
      description: "Lightstick officiel BTS avec édition spéciale. Couleur rose/violet, LED RGB multicolore avec 25 modes d'illumination.",
      specifications: {
        material: "Plastique résistant",
        height: "20 cm",
        weight: "150 g",
        battery: "3 piles AAA (incluses)",
        colors: ["Rose/Violet"],
        warranty: "2 ans"
      },
      sizes: ["Unique"],
      features: [
        "LED RGB multicolore",
        "25 modes d'illumination",
        "Batterie longue durée",
        "Design ergonomique",
        "Officiel BTS"
      ],
      inStock: true,
      stock: 45
    },
    2: {
      id: 2,
      name: "Lightstick Stray Kids - Officiel",
      category: "lightsticks",
      price: 99.90,
      originalPrice: null,
      image: "/lightstick/lightstick3.png",
      hoverImage: "/lightstick/lightstick4.jpg",
      description: "Lightstick officiel Stray Kids avec LED RGB. Design moderne avec poignée ergonomique.",
      specifications: {
        material: "Plastique premium",
        height: "21 cm",
        weight: "160 g",
        battery: "3 piles AAA",
        colors: ["Noir", "Blanc"],
        warranty: "2 ans"
      },
      sizes: ["Unique"],
      features: [
        "LED RGB colorée",
        "Mode synchronisation",
        "Poignée antidérapante",
        "Officiel Stray Kids"
      ],
      inStock: true,
      stock: 32
    }
    // ... autres produits
  },
  coques: {
    1: {
      id: 1,
      name: "Coque BTS - Groupe KPOP",
      category: "coques",
      price: 19.90,
      originalPrice: null,
      image: "/coques/coque1.jpg",
      hoverImage: "/coques/coque2.webp",
      description: "Coque de protection pour téléphone avec le design du groupe BTS. Motif officiel haute qualité.",
      specifications: {
        material: "TPU + Polycarbonate",
        thickness: "1.5 mm",
        weight: "35 g"
      },
      sizes: ["iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "Samsung Galaxy S21", "Samsung Galaxy S22", "Samsung Galaxy S23"],
      features: [
        "Protection chute jusqu'à 2 mètres",
        "Design antirayures",
        "Grip ergonomique",
        "Officiel BTS"
      ],
      inStock: true,
      stock: 78
    },
    2: {
      id: 2,
      name: "Coque Airpods BT21 Shooky",
      category: "coques",
      price: 24.90,
      originalPrice: null,
      image: "/coques/coque3.jpg",
      hoverImage: "/coques/coque4.jpg",
      description: "Coque de protection pour AirPods avec le design mignon Shooky de BT21.",
      specifications: {
        material: "Silicone doux",
        thickness: "2 mm",
        weight: "8 g"
      },
      sizes: ["AirPods Pro", "AirPods 2", "AirPods 3"],
      features: [
        "Silicone premium",
        "Design mignon Shooky",
        "Anneau de transport",
        "Accès au port de charge"
      ],
      inStock: true,
      stock: 55
    }
    // ... autres coques
  },
  "vetement-t-shirts": {
    1: {
      id: 1,
      name: "T-Shirt BTS - MOTS7 Black",
      category: "vetement-t-shirts",
      price: 39.90,
      originalPrice: 59.90,
      image: "/shop/t-shirts/t-shirt1.png",
      hoverImage: "/shop/t-shirts/t-shirt2.png",
      description: "T-Shirt officiel BTS MOTS7 en noir premium. Tissu 100% coton respirant avec impression haute qualité.",
      specifications: {
        material: "100% coton organique",
        weight: "170 g/m²",
        printTechnique: "Sérigraphie directe"
      },
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Noir", "Gris", "Blanc"],
      features: [
        "Tissu 100% coton",
        "Impression durable",
        "Design confortable",
        "Officiel BTS",
        "Lavable en machine"
      ],
      inStock: true,
      stock: 120,
      sizing: {
        XS: { chest: "32-34 cm", length: "68 cm" },
        S: { chest: "36-38 cm", length: "71 cm" },
        M: { chest: "40-42 cm", length: "74 cm" },
        L: { chest: "44-46 cm", length: "77 cm" },
        XL: { chest: "48-50 cm", length: "80 cm" },
        XXL: { chest: "52-54 cm", length: "83 cm" }
      }
    },
    2: {
      id: 2,
      name: "T-Shirt Stray Kids Unveil Tour",
      category: "vetement-t-shirts",
      price: 29.90,
      originalPrice: null,
      image: "/shop/t-shirts/t-shirt3.png",
      hoverImage: "/shop/t-shirts/t-shirt4.png",
      description: "T-Shirt Stray Kids Unveil Tour avec design graphique exclusif.",
      specifications: {
        material: "100% coton",
        weight: "180 g/m²",
        printTechnique: "Impression directe"
      },
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Noir"],
      features: [
        "Design tour exclusif",
        "Qualité premium",
        "Coton respirant",
        "Officiel Stray Kids"
      ],
      inStock: true,
      stock: 95
    }
    // ... autres t-shirts
  },
  posters: {
    1: {
      id: 1,
      name: "Poster KPOP Huntrix Demon Hunters",
      category: "posters",
      price: 24.90,
      originalPrice: null,
      image: "/posters/poster42.png",
      hoverImage: "/posters/poster43.png",
      description: "Poster décoratif KPOP Demon Hunters haute résolution. Parfait pour décorer votre chambre.",
      specifications: {
        material: "Papier mat premium 200g",
        printQuality: "4K ultra HD"
      },
      sizes: ["A3 (29.7x42cm)", "A2 (42x59.4cm)", "A1 (59.4x84.1cm)"],
      features: [
        "Impression haute résolution",
        "Papier mat premium",
        "Sans cadre",
        "Tube de transport inclus"
      ],
      inStock: true,
      stock: 60
    }
    // ... autres posters
  },
  photocards: {
    1: {
      id: 1,
      name: "Photocards NCT127",
      category: "photocards",
      price: 9.95,
      originalPrice: null,
      image: "/photocards/photocard34.jpg",
      hoverImage: "/photocards/photocard35.jpg",
      description: "Set de photocards NCT127 officiel. Cartes holographiques avec finition premium.",
      specifications: {
        material: "Carton photographique",
        size: "7.6 x 10.7 cm",
        quantity: 7,
        finition: "Holographique"
      },
      sizes: ["Unique"],
      features: [
        "Set complet du groupe",
        "Finition holographique",
        "Qualité officielle",
        "Emballage collecteur"
      ],
      inStock: true,
      stock: 140
    }
    // ... autres photocards
  },
  "box-coffrets": {
    1: {
      id: 1,
      name: "Calendrier de l'Avent KPop Huntrix",
      category: "box-coffrets",
      price: 29.90,
      originalPrice: 49.90,
      image: "/boxes/box1.png",
      hoverImage: "/boxes/box2.png",
      description: "Calendrier de l'Avent Huntrix avec 24 produits surprise KPOP.",
      specifications: {
        material: "Carton premium",
        items: 24,
        size: "50x40x10 cm",
        weight: "1.5 kg"
      },
      sizes: ["Standard"],
      features: [
        "24 produits surprise",
        "Design exclusif Huntrix",
        "Contenu aléatoire",
        "Édition limitée"
      ],
      inStock: true,
      stock: 28,
      contents: "Lightsticks, photocards, autocollants, posters, figurines"
    }
    // ... autres boxes
  },
  "figurines-poupees": {
    1: {
      id: 1,
      name: "Poupées Huntrix Demon Hunters",
      category: "figurines-poupees",
      price: 24.90,
      originalPrice: 39.90,
      image: "/figurines/figurine23.png",
      hoverImage: "/figurines/figurine24.png",
      description: "Set de poupées collectibles Huntrix Demon Hunters. Chiffres articulés avec détails fins.",
      specifications: {
        material: "PVC haute qualité",
        height: "10 cm",
        quantity: 5,
        articulation: "Complète"
      },
      sizes: ["10 cm"],
      features: [
        "Articulée complètement",
        "Détails fins",
        "Boîte collecteur",
        "Accessoires inclus"
      ],
      inStock: true,
      stock: 42
    }
    // ... autres figurines
  }
};
