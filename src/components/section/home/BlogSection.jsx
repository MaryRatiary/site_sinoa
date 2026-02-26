const BlogSection = () => {
  const posts = [
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
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto border-t border-gray-100">
      <h2 className="text-sm font-bold uppercase tracking-widest mb-8 text-gray-400">Recent Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post, idx) => (
          <div key={idx} className="flex gap-4 group cursor-pointer">
            {/* Image Container corrigé */}
            <div className="w-40 h-24 rounded-lg flex-shrink-0 overflow-hidden bg-gray-200">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  /* Si l'image ne charge pas, on garde le fond gris */
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-[15px] leading-tight group-hover:text-purple-700 transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;