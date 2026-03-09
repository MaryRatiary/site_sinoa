import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Search, User, ShoppingBag, X, Plus } from "lucide-react";
import { categoriesAPI } from "../../services/api";

export default function RespNav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [expandedSubcategory, setExpandedSubcategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoriesAPI.getAll();
                setCategories(data || []);
            } catch (error) {
                console.error('Erreur lors du chargement des catégories:', error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const toggleCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
        setExpandedSubcategory(null);
    };

    const toggleSubcategory = (subcategoryId) => {
        setExpandedSubcategory(expandedSubcategory === subcategoryId ? null : subcategoryId);
    };

    // Vérifier si une sous-catégorie a un seul niveau (pas de children)
    const isSingleLevelCategory = (category) => {
        return category.children && 
            category.children.length > 0 && 
            category.children.every(child => !child.children || child.children.length === 0);
    };

    // Afficher les sous-catégories en grid (pour catégories simples)
    const renderGridSubcategories = (children) => {
        return (
            <div className="grid grid-cols-2 gap-1 mt-2 pl-2">
                {children.map((child) => (
                    <button
                        key={child.id}
                        onClick={() => {
                            setIsMenuOpen(false);
                            navigate(`/category/${child.id}`);
                        }}
                        className="flex flex-col items-center text-center group"
                    >
                        {child.image && (
                            <div className="mb-0.5 overflow-hidden rounded-md border border-gray-200 group-hover:shadow-sm transition-shadow" style={{ width: '150px', height: '150px' }}>
                                <img
                                    src={child.image}
                                    alt={child.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        )}
                        <span className="text-[11px] font-semibold text-gray-900 group-hover:text-[#5E2251] transition line-clamp-2">
                            {child.name}
                        </span>
                    </button>
                ))}
            </div>
        );
    };

    // Afficher les sous-catégories imbriquées avec dropdowns
    const renderNestedSubcategories = (children) => {
        return (
            <div className="space-y-3 mt-3 pl-2">
                {children.map((child) => {
                    const hasChildren = child.children && child.children.length > 0;
                    const isExpanded = expandedSubcategory === child.id;

                    return (
                        <div key={child.id}>
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => {
                                        if (hasChildren) {
                                            toggleSubcategory(child.id);
                                        } else {
                                            setIsMenuOpen(false);
                                            navigate(`/category/${child.id}`);
                                        }
                                    }}
                                    className="flex-1 text-left flex items-center gap-2 text-xs font-bold uppercase text-gray-900 hover:text-[#5E2251] transition py-2"
                                >
                                    {child.image && (
                                        <img
                                            src={child.image}
                                            alt={child.name}
                                            className="w-5 h-5 object-cover rounded flex-shrink-0"
                                        />
                                    )}
                                    <span>{child.name}</span>
                                </button>
                                {hasChildren && (
                                    <Plus 
                                        size={14} 
                                        className={`transition-transform flex-shrink-0 ${isExpanded ? "rotate-45 text-[#5E2251]" : "text-gray-400"}`}
                                        onClick={() => toggleSubcategory(child.id)}
                                    />
                                )}
                            </div>

                            {/* Afficher les enfants si disponibles et expandus */}
                            {hasChildren && isExpanded && (
                                <div className="mt-2 pl-4 border-l-2 border-gray-200">
                                    {renderNestedSubcategories(child.children)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="lg:hidden bg-white">
            {/* Header with logo and icons */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                    {isMenuOpen ? <X size={24} /> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>}
                </button>

                <Link to="/" className="flex flex-col items-center text-center">
                    <h1 className="text-sm font-bold tracking-tighter">프랑스</h1>
                    <h1 className="text-lg font-black tracking-[0.2em] mt-[-4px]">KPOP</h1>
                </Link>

                <div className="flex items-center gap-3">
                    <Search size={20} className="cursor-pointer hover:text-[#5E2251] transition" />
                    <User size={20} className="cursor-pointer hover:text-[#5E2251] transition" />
                    <div className="relative">
                        <ShoppingBag size={20} className="cursor-pointer hover:text-[#5E2251] transition" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#5E2251] text-white text-xs rounded-full flex items-center justify-center font-bold">0</span>
                    </div>
                </div>
            </div>

            {/* Menu Drawer */}
            {isMenuOpen && (
                <div className="bg-white border-t border-gray-200 max-h-[70vh] overflow-y-auto">
                    <div className="p-4 space-y-4">
                        {/* Best Sellers */}
                        <Link
                            to="/best-sellers"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between font-bold text-sm uppercase"
                        >
                            <span>Best Sellers</span>
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">HOT</span>
                        </Link>

                        {/* Categories Parents */}
                        {loading ? (
                            <div className="p-4 text-center">
                                <p className="text-xs text-gray-500">Chargement des catégories...</p>
                            </div>
                        ) : categories.length > 0 ? (
                            categories.map((category) => {
                                const hasChildren = category.children && category.children.length > 0;
                                const isExpanded = expandedCategory === category.id;
                                const isSingleLevel = isSingleLevelCategory(category);

                                return (
                                    <div key={category.id} className="border-b border-gray-200 pb-4">
                                        {/* Catégorie parent */}
                                        <div className="flex items-center justify-between gap-2">
                                            <button
                                                onClick={() => {
                                                    if (hasChildren) {
                                                        toggleCategory(category.id);
                                                    } else {
                                                        setIsMenuOpen(false);
                                                        navigate(`/category/${category.id}`);
                                                    }
                                                }}
                                                className="flex-1 text-left flex items-center gap-2 text-sm font-bold uppercase text-gray-900 hover:text-[#5E2251] transition py-2"
                                            >
                                                {category.icon && (
                                                    <img
                                                        src={category.icon}
                                                        alt={category.name}
                                                        className="w-6 h-6 object-cover rounded flex-shrink-0"
                                                    />
                                                )}
                                                <span>{category.name}</span>
                                            </button>
                                            {hasChildren && (
                                                <Plus 
                                                    size={16} 
                                                    className={`transition-transform flex-shrink-0 ${isExpanded ? "rotate-45 text-[#5E2251]" : "text-gray-400"}`}
                                                    onClick={() => toggleCategory(category.id)}
                                                />
                                            )}
                                        </div>

                                        {/* Sous-catégories */}
                                        {hasChildren && isExpanded && (
                                            <div>
                                                {/* Mode grille pour catégories simples */}
                                                {isSingleLevel ? (
                                                    renderGridSubcategories(category.children)
                                                ) : (
                                                    /* Mode dropdown imbriqué pour catégories complexes */
                                                    renderNestedSubcategories(category.children)
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-xs text-gray-500 text-center py-4">Aucune catégorie disponible</p>
                        )}
                    </div>

                    {/* Language/Currency Footer */}
                    <div className="border-t border-gray-200 p-4">
                        <button className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 bg-gray-100 p-2 rounded hover:bg-gray-200 transition">
                            <span>🌍 Madagascar (EUR €)</span>
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}