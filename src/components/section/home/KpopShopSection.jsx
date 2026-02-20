export default function KpopShopSection() {
  const shopCategories = {
    "KPOP Merch": [
      { name: "Lightsticks", icon: "💡" },
      { name: "Box & Coffrets", icon: "📦" },
      { name: "Figurines & Poupées", icon: "🎨" },
      { name: "Coques", icon: "📱" },
      { name: "Photocards", icon: "📷" },
      { name: "Posters", icon: "📌" }
    ],
    "Vêtement KPOP": [
      { name: "T-Shirts", icon: "👕" },
      { name: "Sweats & Pulls", icon: "🧥" },
      { name: "Masques", icon: "😷" },
      { name: "Casquettes", icon: "🧢" },
      { name: "Bonnets & Bobs", icon: "🎩" },
      { name: "Gants & Mitaines", icon: "🧤" }
    ],
    "Bijoux KPOP": [
      { name: "Bagues", icon: "💍" },
      { name: "Colliers", icon: "⛓️" },
      { name: "Boucles d'oreilles", icon: "💎" },
      { name: "Bracelets", icon: "🔗" },
      { name: "Porte-clés", icon: "🔑" },
      { name: "Serre-Têtes", icon: "👑" }
    ],
    "Accessoires KPOP": [
      { name: "Peluches", icon: "🧸" },
      { name: "Sacs à dos", icon: "🎒" },
      { name: "Mugs & Gourdes", icon: "☕" },
      { name: "Trousses", icon: "📚" },
      { name: "Portefeuilles", icon: "👜" },
      { name: "Totebags", icon: "🛍️" }
    ]
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 bg-gray-50">
      <h2 className="text-2xl font-bold mb-12">KPOP Shop</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {Object.entries(shopCategories).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-lg font-bold mb-6">{category}</h3>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white transition-all hover:shadow-md group"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <span className="text-gray-700 group-hover:text-purple-900 font-medium transition">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
