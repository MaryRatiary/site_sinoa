import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronRight, SlidersHorizontal, ChevronDown, X, ShoppingBag, Star } from "lucide-react";
import { CATEGORIES } from "../../data/productData";
import { K_STYLE_CATEGORIES } from "../../data/k-styleData";
import { ProductCard2 } from "../card/ProductCard2";
import Navbar from "../Header";
import { RevealText } from '../text/RevealText';
import Footer from '../Footer';
import PercentageReduction from "../card/PercentageReduction";

// Merge all category maps — add more imports here as you create new data files
const ALL_CATEGORIES = { ...CATEGORIES, ...K_STYLE_CATEGORIES };

// ─── Sort helpers ─────────────────────────────────────────────────────────────

const SORT_OPTIONS = ["Popularité", "Prix croissant", "Prix décroissant", "Nouveautés", "Meilleures notes"];
const PRICE_FILTERS = ["Moins de 20€", "20€ – 50€", "50€ – 100€", "Plus de 100€"];

function applySort(products, sort) {
  const arr = [...products];
  if (sort === "Prix croissant")   return arr.sort((a, b) => a.price - b.price);
  if (sort === "Prix décroissant") return arr.sort((a, b) => b.price - a.price);
  if (sort === "Meilleures notes") return arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  return arr;
}

function applyPriceFilter(products, filter) {
  if (!filter) return products;
  return products.filter(({ price }) => {
    if (filter === "Moins de 20€")  return price < 20;
    if (filter === "20€ – 50€")     return price >= 20  && price < 50;
    if (filter === "50€ – 100€")    return price >= 50  && price < 100;
    if (filter === "Plus de 100€")  return price >= 100;
    return true;
  });
}

// ─── List Card ────────────────────────────────────────────────────────────────

function ListCard({ product }) {
  const [added, setAdded] = useState(false);
  const { name, price, originalPrice, isEstimated, image, rating, isNew } = product;
  const isOnSale = originalPrice !== null && originalPrice !== undefined;

  return (
    <div className="group flex gap-5 bg-white rounded-2xl p-4 border border-gray-100 hover:border-[#5E2251]/30 hover:shadow-md transition-all duration-300">
      <div className="relative w-28 h-36 overflow-hidden rounded-xl bg-gray-50 flex-shrink-0">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {isNew && (
          <span className="absolute top-2 left-2 bg-[#5E2251] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            Nouveau
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          {rating && (
            <div className="flex items-center gap-0.5 mb-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={11} className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
              ))}
            </div>
          )}
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{name}</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {isOnSale ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-red-500 text-sm">
                  {isEstimated && <span className="font-normal text-xs">À partir de </span>}
                  {price.toFixed(2).replace('.', ',')}€
                </span>
                <span className="text-gray-400 line-through text-xs">
                  {originalPrice.toFixed(2).replace('.', ',')}€
                </span>
              </div>
            ) : (
              <span className="font-bold text-[#5E2251] text-sm">
                {isEstimated && <span className="font-normal text-xs">À partir de </span>}
                {price.toFixed(2).replace('.', ',')}€
              </span>
            )}
          </div>

          <button
            onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1500); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300
              ${added ? "bg-green-500 text-white" : "bg-[#5E2251] text-white hover:bg-[#4a1a40]"}`}
          >
            {added ? "✓ Ajouté" : <><ShoppingBag size={13} /> Ajouter</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const { slug } = useParams();
  const category = ALL_CATEGORIES[slug];

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort]               = useState("Popularité");
  const [priceFilter, setPriceFilter] = useState(null);
  const [view, setView]               = useState("grid");
  useEffect(() => {
    ALL_CATEGORIES[slug] ?? null;
  }, [slug]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 font-sans">
        Catégorie introuvable — slug : <strong className="ml-1">{slug}</strong>
      </div>
    );
  }

  const displayed = applyPriceFilter(applySort(category.products, sort), priceFilter);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar/>
      <PercentageReduction/>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-sans mb-6">
          <a href="/" className="hover:text-[#5E2251] transition-colors">Accueil</a>
          {category.breadcrumb.map((crumb, i) => (
            <span key={crumb} className="flex items-center gap-1.5">
              <ChevronRight size={12} />
              <span className={i === category.breadcrumb.length - 1
                ? "text-[#5E2251] font-semibold"
                : "hover:text-[#5E2251] cursor-pointer transition-colors"
              }>
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          

        {/* Page Header */}
        <div className="mb-8 w-screen flex flex-col justify-center items-center gap-4">
          <RevealText>
            <h1 className="text-4xl font-black text-gray-900 leading-none tracking-tight">{category.title}</h1>

          </RevealText>

          <div className="flex items-center gap-3 font-sans justify-between">
            <p className="text-sm text-gray-400 font-sans mt-1">{displayed.length} produits</p>
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 hover:border-[#5E2251] hover:text-[#5E2251] transition-colors"
            >
              <SlidersHorizontal size={15} /> Filtres
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 pr-8 cursor-pointer hover:border-[#5E2251] focus:outline-none focus:border-[#5E2251] transition-colors bg-white"
              >
                {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              {["grid", "list"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-2 text-xs transition-colors ${view === v ? "bg-[#5E2251] text-white" : "text-gray-500 hover:text-[#5E2251]"}`}
                >
                  {v === "grid" ? "⊞" : "☰"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active filter pill */}
        {priceFilter && (
          <div className="flex items-center gap-2 mb-6 font-sans">
            <span className="text-xs text-gray-400">Filtres actifs :</span>
            <button
              onClick={() => setPriceFilter(null)}
              className="flex items-center gap-1.5 bg-[#5E2251]/10 text-[#5E2251] text-xs px-3 py-1 rounded-full font-medium hover:bg-[#5E2251]/20 transition-colors"
            >
              {priceFilter} <X size={11} />
            </button>
          </div>
        )}

        {/* Sidebar + Grid */}
        <div className="flex gap-10">

          <div className="flex-1">
            {displayed.length === 0 ? (
              <div className="text-center py-24 text-gray-400 font-sans">
                Aucun produit ne correspond à ces filtres.
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                {displayed.map((product) => (
                  <ProductCard2 key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {displayed.map((product) => (
                  <ListCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}