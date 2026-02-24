import { useState } from "react";
import { Link } from "react-router-dom";
import { menuItems, dropdownData } from "../../data/menuData";
import { ChevronRight, Search, User, ShoppingBag, X, Plus } from "lucide-react";

export default function RespNav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const [openSub, setOpenSub] = useState(null);

    const toggleMenu = (name) => {
        setOpenMenu(openMenu === name ? null : name);
        setOpenSub(null);
    };

    const toggleSub = (title) => {
        setOpenSub(openSub === title ? null : title);
    };

    const renderSubmenu = (type) => {
        const data = dropdownData[type];
        if (!data) return null;

        if (type === "shop") {
            return (
                <div className="space-y-4 mt-3 pl-4 border-l-2 border-gray-200">
                    {/* Featured */}
                    {data.featured.map((item) => (
                        <Link
                            key={item.label}
                            to={item.url}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-xs font-semibold text-[#5E2251] hover:text-[#3E1A31] transition"
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Columns */}
                    {data.columns.map((col) => {
                        const isOpen = openSub === col.title;
                        return (
                            <div key={col.title}>
                                <button
                                    onClick={() => toggleSub(col.title)}
                                    className="flex justify-between items-center w-full text-xs font-bold uppercase text-gray-900 hover:text-[#5E2251]"
                                >
                                    {col.title}
                                    <Plus size={14} className={`transition-transform ${isOpen ? "rotate-45" : ""}`} />
                                </button>

                                {isOpen && (
                                    <div className="mt-2 space-y-2 pl-3">
                                        {col.items.map((item) => (
                                            <Link
                                                key={item.label}
                                                to={`/products/${item.slug}`}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#5E2251] transition"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.label}
                                                    className="w-6 h-6 object-cover rounded"
                                                />
                                                <span>{item.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (type === "groups") {
            return (
                <div className="grid grid-cols-3 gap-3 mt-3 pl-2">
                    {data.map((group) => (
                        <Link
                            key={group.name}
                            to={group.url}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex flex-col items-center text-center"
                        >
                            <img
                                src={group.image}
                                alt={group.name}
                                className="w-16 h-16 object-cover rounded-md mb-1"
                            />
                            <span className="text-xs font-semibold text-gray-900">{group.name}</span>
                        </Link>
                    ))}
                </div>
            );
        }

        if (type === "drama") {
            return (
                <div className="space-y-2 mt-3 pl-4 border-l-2 border-gray-200">
                    {data.map((item) => (
                        <a
                            key={item}
                            href="#"
                            className="block text-xs text-gray-600 hover:text-[#5E2251] transition"
                        >
                            {item}
                        </a>
                    ))}
                </div>
            );
        }

        if (Array.isArray(data)) {
            return (
                <div className="space-y-3 mt-3 pl-4 border-l-2 border-gray-200">
                    {data.map((section) => {
                        const isOpen = openSub === section.title;
                        return (
                            <div key={section.title}>
                                <button
                                    onClick={() => toggleSub(section.title)}
                                    className="flex justify-between items-center w-full text-xs font-bold uppercase text-gray-900 hover:text-[#5E2251]"
                                >
                                    {section.title}
                                    <Plus size={14} className={`transition-transform ${isOpen ? "rotate-45" : ""}`} />
                                </button>

                                {isOpen && (
                                    <div className="mt-2 space-y-2 pl-3">
                                        {section.items.map((item) => (
                                            <Link
                                                key={item.label}
                                                to={item.slug ? `/products/${item.slug}` : item.url}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#5E2251] transition"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.label}
                                                    className="w-6 h-6 object-cover rounded"
                                                />
                                                <span>{item.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        return null;
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
                    <div className="p-4 space-y-5">
                        {/* Best Sellers */}
                        <Link
                            to="/best-sellers"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between font-bold text-sm uppercase"
                        >
                            <span>Best Sellers</span>
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">HOT</span>
                        </Link>

                        {/* Menu Items */}
                        {menuItems
                            .filter((menu) => menu.name !== "Blog")
                            .map((menu) => {
                                const isOpen = openMenu === menu.name;
                                return (
                                    <div key={menu.name}>
                                        <button
                                            onClick={() => toggleMenu(menu.name)}
                                            className="flex justify-between items-center w-full text-sm font-bold uppercase text-gray-900 hover:text-[#5E2251] transition py-2"
                                        >
                                            {menu.name}
                                            {menu.hasDropdown && (
                                                <Plus 
                                                    size={18} 
                                                    className={`transition-transform ${isOpen ? "rotate-45 text-[#5E2251]" : "text-gray-400"}`} 
                                                />
                                            )}
                                        </button>

                                        {menu.hasDropdown && isOpen && renderSubmenu(menu.type)}
                                    </div>
                                );
                            })}
                    </div>

                    {/* Featured Images */}
                    <div className="border-t border-gray-200 p-4 space-y-2">
                        {dropdownData.shop.featured.map((item) => (
                            <Link
                                key={item.label}
                                to={item.url}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center rounded-lg overflow-hidden h-20 hover:opacity-80 transition"
                            >
                                <img
                                    src={item.image}
                                    alt={item.label}
                                    className="w-full h-full object-cover"
                                />
                                <span className="absolute text-white font-bold text-xs px-2 line-clamp-1">{item.label}</span>
                            </Link>
                        ))}
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