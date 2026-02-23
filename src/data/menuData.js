export const menuItems = [
  { name: 'Best Sellers', hot: true },
  { name: 'Kpop Shop', hasDropdown: true, type: 'shop' },
  { name: 'Par Groupe', hasDropdown: true, type: 'groups' },
  { name: 'K-Style', hasDropdown: true, type: 'style' },
  { name: 'K-Beauty', hasDropdown: true, type: 'beauty' },
  { name: 'K-Drama', hasDropdown: true, type: 'drama' },
  { name: 'Blog', hasDropdown: true, type: 'blog' },
];

export const dropdownData = {
  shop: {
    featured: [
      {
        label: 'K-POP DEMON HUNTERS',
        bg: 'bg-purple-900',
        italic: true,
        url: '/menu/k-pop/demon-hunters',
        image: '/menu/k-pop/kdh.png'
      },
      {
        label: 'BTS SHOP',
        bg: 'bg-purple-600',
        url: '/menu/k-pop/bts',
        image: '/menu/k-pop/bts.png'
      },
      {
        label: 'BTS SUMMER',
        bg: 'bg-yellow-300',
        url: '/menu/k-pop/bts-summer',
        image: '/menu/k-pop/bt21.jpg'
      }
    ],
    columns: [
      {
        title: 'KPOP Merch',
        items: [
          { label: 'Lightsticks', image: '/menu/k-pop/lightstick.jpg' },
          { label: 'Box & Coffrets', image: '/menu/k-pop/calendar.png' },
          { label: 'Figurines & Poupées', image: '/menu/k-pop/figurine.png' },
          { label: 'Coques', image: '/menu/k-pop/coques.jpg' },
          { label: 'Photocards', image: '/menu/k-pop/photocard.jpg' },
          { label: 'Posters', image: '/menu/k-pop/poster.jpg' },
        ],
      },
      {
        title: 'Vêtement KPOP',
        items: [
          { label: 'T-Shirts', image: '/menu/k-pop/t-shirt.jpg' },
          { label: 'Sweats & Pulls', image: '/menu/k-pop/hoodie.jpg' },
          { label: 'Masques', image: '/menu/k-pop/masque.jpg' },
          { label: 'Casquettes', image: '/menu/k-pop/casquette.jpg' },
          { label: 'Bonnets & Bobs', image: '/menu/k-pop/bonnet.jpg' },
          { label: 'Gants & Mitaines', image: '/menu/k-pop/gants.jpg' },
        ],
      },
      {
        title: 'Bijoux KPOP',
        items: [
          { label: 'Bagues', image: '/menu/k-pop/bague.jpg' },
          { label: 'Colliers', image: '/menu/k-pop/collier.jpg' },
          { label: "Boucles d'oreilles", image: '/menu/k-pop/boucle-oreille.jpg' },
          { label: 'Bracelets', image: '/menu/k-pop/bracelet.jpg' },
          { label: 'Porte-clés', image: '/menu/k-pop/porte-cle.png' },
          { label: 'Serre-Têtes', image: '/menu/k-pop/serre-tete.png' },
        ],
      },
      {
        title: 'Accessoires KPOP',
        items: [
          { label: 'Peluches', image: '/menu/k-pop/peluche.jpg' },
          { label: 'Sacs à dos', image: '/menu/k-pop/sac.jpg' },
          { label: 'Mugs & Gourdes', image: '/menu/k-pop/mug.jpg' },
          { label: 'Trousses', image: '/menu/k-pop/trousse.jpg' },
          { label: 'Portefeuilles', image: '/menu/k-pop/portefeuille.jpg' },
          { label: 'Totebags', image: '/menu/k-pop/sac-totebag.jpg' },
        ],
      },
    ]
  },

  groups: [
    {
      name: 'BTS',
      image: '/menu/groups/bts.jpg',
      url: '/groups/bts'
    },
    {
      name: 'Blackpink',
      image: '/menu/groups/blackpink.jpg',
      url: '/groups/blackpink'
    },
    {
      name: 'Huntrix',
      image: '/menu/groups/huntrix.png',
      url: '/groups/huntrix'
    },
    {
      name: 'Stray Kids',
      image: '/menu/groups/straykids.png',
      url: '/groups/stray-kids'
    },
    {
      name: 'Twice',
      image: '/menu/groups/twice.jpg',
      url: '/groups/twice'
    },
    {
      name: 'New Jeans',
      image: '/menu/groups/nj.webp',
      url: '/groups/new-jeans'
    },
    {
      name: 'ATEEZ',
      image: '/menu/groups/ateez.jpg',
      url: '/groups/ateez'
    },
    {
      name: 'Seventeen',
      image: '/menu/groups/seventeen.png',
      url: '/groups/seventeen'
    },
    {
      name: '+TOMORROW X+TOGETHER',
      image: '/menu/groups/txt.png',
      url: '/groups/txt'
    },
    {
      name: 'NCT',
      image: '/menu/groups/nct.jpg',
      url: '/groups/nct'
    },
    {
      name: 'ITZY',
      image: '/menu/groups/itzy.png',
      url: '/groups/itzy'
    },
    {
      name: 'IVE',
      image: '/menu/groups/ive.webp',
      url: '/groups/ive'
    }
  ],
  style: [
    {
      title: 'Korean Style',
      items: [
        {
          label: 'T-Shirts Korean',
          url: '/style/t-shirts-korean',
          image: '/menu/k-style/t-shirt.jpg'
        },
        {
          label: 'Débardeurs Coréens',
          url: '/style/debardeurs-coreens',
          image: '/menu/k-style/debardeur.jpg'
        },
        {
          label: 'Pulls & Sweats',
          url: '/style/pulls-sweats',
          image: '/menu/k-style/pull.jpg'
        },
        {
          label: 'Manteaux & Doudounes',
          url: '/style/manteaux-doudounes',
          image: '/menu/k-style/vestelong.jpg'
        },
        {
          label: 'Pyjamas Coréens',
          url: '/style/pyjamas-coreens',
          image: '/menu/k-style/pyjama.jpg'
        },
        {
          label: 'Blouses & Chemises',
          url: '/style/blouses-chemises',
          image: '/menu/k-style/chemisier.jpg'
        },
      ],
    },
    {
      title: 'Mode coréenne',
      items: [
        {
          label: 'Jupes Coréenne',
          url: '/style/jupes-coreenne',
          image: '/menu/k-style/jupe.jpg'
        },
        {
          label: 'Pantalons Coréen',
          url: '/style/pantalons-coreen',
          image: '/menu/k-style/patalon.jpg'
        },
        {
          label: 'Robes Coréennes',
          url: '/style/robes-coreennes',
          image: '/menu/k-style/robe.jpg'
        },
        {
          label: 'Vestes & Blazers',
          url: '/style/vestes-blazers',
          image: '/menu/k-style/veste.jpg'
        },
        {
          label: 'Chaussures',
          url: '/style/chaussures',
          image: '/menu/k-style/basket.jpg'
        },
        {
          label: 'Chaussons & Pantoufles',
          url: '/style/chaussons-pantoufles',
          image: '/menu/k-style/claquette.jpg'
        },
      ],
    },
    {
      title: 'Hanbok',
      items: [
        {
          label: 'Vestes Kimonos',
          url: '/style/vestes-kimonos',
          image: '/menu/k-style/vestelong.jpg'
        },
        {
          label: 'Hanbok Femme',
          url: '/style/hanbok-femme',
          image: '/menu/k-style/hanbokm.jpg'
        },
        {
          label: 'Hanbok Homme',
          url: '/style/hanbok-homme',
          image: '/menu/k-style/hanbokh.jpg'
        },
        {
          label: 'Hanbok Enfant',
          url: '/style/hanbok-enfant',
          image: '/menu/k-style/hanbokc.jpg'
        },
      ],
    },
  ],

  beauty: [
    {
      title: 'Produits Skincare',
      items: [
        {
          label: 'Huile Démaquillante',
          url: '/beauty/huile-demaquillante',
          image: '/menu/k-beauty/oil.webp'
        },
        {
          label: 'Toner',
          url: '/beauty/toner',
          image: '/menu/k-beauty/toner.webp'
        },
        {
          label: 'Essence',
          url: '/beauty/essence',
          image: '/menu/k-beauty/essence.webp'
        },
        {
          label: 'Sérum & Ampoule',
          url: '/beauty/serum-ampoule',
          image: '/menu/k-beauty/serum.webp'
        },
        {
          label: 'Nettoyant',
          url: '/beauty/nettoyant',
          image: '/menu/k-beauty/hydracream.webp'
        },
        {
          label: 'Crème',
          url: '/beauty/creme',
          image: '/menu/k-beauty/suncream.webp'
        },
      ],
    },
    {
      title: 'Marques',
      items: [
        {
          label: 'Anua',
          url: '/beauty/anua',
          image: '/menu/k-beauty/anua.jpg'
        },
        {
          label: 'Medicube',
          url: '/beauty/medicube',
          image: '/menu/k-beauty/medicube.jpg'
        },
        {
          label: 'Beauty of Jason',
          url: '/beauty/beatyofjason',
          image: '/menu/k-beauty/boj.jpg'
        },
        {
          label: 'RoundLab',
          url: '/beauty/roundlab',
          image: '/menu/k-beauty/roundlab.jpg'
        },
        {
          label: 'Skin1004',
          url: '/beauty/skin1004',
          image: '/menu/k-beauty/skin1004.jpg'
        },
        {
          label: 'Cosrx',
          url: '/beauty/cosrx',
          image: '/menu/k-beauty/cosrx.jpg'
        },
        {
          label: 'Innisfree',
          url: '/beauty/innisfree',
          image: '/menu/k-beauty/innisfree.jpg'
        },
        {
          label: 'Etude House',
          url: '/beauty/etudehouse',
          image: '/menu/k-beauty/etudehouse.jpg'
        },
        {
          label: 'Laneige',
          url: '/beauty/laneige',
          image: '/menu/k-beauty/laneige.jpg'
        },
        {
          label: 'Holika Holika',
          url: '/beauty/holika',
          image: '/menu/k-beauty/holika.jpg'
        },
      ],
    },
  ],

  drama: [
    'A Korean Odyssey',
    'Crash Landing On You',
    'Start-Up Drama',
  ],

  blog: [
  {
    title: "BTS : Réservez vos billets pour Paris dès ce jeudi (Tournée mondiale 2026)",
    slug: "bts-stade-de-france-2026",
    category: "Actualités K-pop",
    image: "/menu/blog/paris-concert.webp",
    excerpt: "Le phénomène musical BTS, connu pour ses performances électrisantes et son immense fanbase"
  },
  {
    title: "Oulalalala - Lyrics/Paroles Orelsan ft. FIFTY FIFTY",
    slug: "orelsan-fifty-fifty-oualalala",
    category: "Actualités K-pop",
    image: "/menu/blog/orlesan-lyrics.webp",
    excerpt: "[OrelSan]Ouh la la la la la laOuh, je crois que j'ai plus toute ma têteSi vous m'aimez,"
  },
  {
    title: "Golden - 'Briller' Huntrix Paroles en Français",
    slug: "huntrix-briller-paroles-fr",
    category: "Guides & Conseils",
    image: "/menu/blog/golden.png",
    excerpt: "Vous trouverez ci-dessous les paroles complètes en français de la chanson Briller (Golden) de Huntrix."
  },
  {
    title: "Quand la k-pop inspire les k-dramas : ces séries où les idoles volent la vedette",
    slug: "kpop-inspire-kdramas",
    category: "Tendances Coréennes",
    image: "/menu/blog/idols.png",
    excerpt: "L’industrie du divertissement coréen connaît depuis quelques années un succès international sans précédent."
  },
  {
    title: "Les BTS sont-ils Gay ?",
    slug: "bts-rumeurs-vie-privee",
    category: "Tendances Coréennes",
    image: "/menu/blog/gay.png",
    excerpt: "Parmi les sujets qui déchaînent le plus de curiosité sur internet, la vie privée des stars et, plus particulièrement, des groupes de K-pop, occupe une place de choix."
  }
]
};