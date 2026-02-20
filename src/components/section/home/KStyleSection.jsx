export default function KStyleSection() {
  const styleCategories = {
    "Korean Style": [
      "T-Shirts Korean",
      "Débardeurs Coréens",
      "Pulls & Sweats",
      "Manteaux & Doudounes",
      "Pyjamas Coréens",
      "Blouses & Chemises"
    ],
    "Mode coréenne": [
      "Jupes Coréenne",
      "Pantalons Coréen",
      "Robes Coréennes",
      "Vestes & Blazers",
      "Chaussures",
      "Chaussons & Pantoufles"
    ],
    "Hanbok": [
      "Vestes Kimonos",
      "Hanbok Femme",
      "Hanbok Homme",
      "Hanbok Enfant"
    ]
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 bg-gray-50">
      <h2 className="text-2xl font-bold mb-12">K-Style</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {Object.entries(styleCategories).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-lg font-bold mb-6">{category}</h3>
            <ul className="space-y-4">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-center cursor-pointer hover:text-purple-900 transition group">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-4 group-hover:bg-purple-200 transition flex items-center justify-center">
                    <span className="text-sm">👕</span>
                  </div>
                  <span className="text-gray-700 group-hover:font-semibold transition">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
