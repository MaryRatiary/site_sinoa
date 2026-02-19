const BlogSection = () => {
  const posts = [
    { title: "BTS : Réservez vos billets pour Paris dès ce jeudi", date: "2026", img: "bg-red-100" },
    { title: "Oulalalala - Lyrics/Paroles Orelsan ft. FIFTY FIFTY", date: "2026", img: "bg-blue-100" },
    { title: "Les BTS sont-ils Gay ?", date: "2026", img: "bg-yellow-100" },
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto border-t border-gray-100">
      <h2 className="text-sm font-bold uppercase tracking-widest mb-8 text-gray-400">Recent Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post, idx) => (
          <div key={idx} className="flex gap-4 group cursor-pointer">
            <div className={`w-40 h-24 rounded-lg flex-shrink-0 ${post.img} overflow-hidden`}>
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-[15px] leading-tight group-hover:text-purple-700">{post.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">Le phénomène musical BTS, connu pour ses performances électrisantes...</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;