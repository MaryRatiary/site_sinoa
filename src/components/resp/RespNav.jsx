import { useState } from "react";
import { menuItems, dropdownData } from "../../data/menuData";
import { ChevronRight, Minus, Plus } from "lucide-react";

export default function RespNav() {
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

        /* ================= SHOP ================= */
        if (type === "shop") {
            return (
                <div className="mt-4 space-y-6 pl-2">

                    {/* Featured */}
                    <div className="space-y-3">
                        {data.featured.map((item) => (
                            <a
                                key={item.label}
                                href={item.url}
                                className="block text-sm font-semibold text-[#5E2251]"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Columns */}
                    {data.columns.map((col) => {
                        const isOpen = openSub === col.title;

                        return (
                            <div key={col.title}>
                                <button
                                    onClick={() => toggleSub(col.title)}
                                    className="flex justify-between items-center w-full text-sm font-medium uppercase"
                                >
                                    {col.title}
                                    <ChevronRight
                                        size={16}
                                        className={`transition-transform ${isOpen ? "rotate-90 text-[#5E2251]" : ""
                                            }`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="mt-3 space-y-2 pl-3">
                                        {col.items.map((item) => (
                                            <a
                                                key={item.label}
                                                href="#"
                                                className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#5E2251]"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.label}
                                                    className="w-8 h-8 object-cover rounded"
                                                />
                                                {item.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        /* ================= DRAMA (simple strings) ================= */
        if (type === "drama") {
            return (
                <div className="mt-4 space-y-3 pl-3">
                    {data.map((item) => (
                        <a
                            key={item}
                            href="#"
                            className="block text-sm text-gray-600 hover:text-[#5E2251]"
                        >
                            {item}
                        </a>
                    ))}
                </div>
            );
        }

        /* ================= GROUPS ================= */
        if (type === "groups") {
            return (
                <div className="mt-4 grid grid-cols-2 gap-4 pl-2">
                    {data.map((group) => (
                        <a
                            key={group.name}
                            href={group.url}
                            className="flex flex-col items-center text-center"
                        >
                            <img
                                src={group.image}
                                alt={group.name}
                                className="w-20 h-20 object-cover rounded-md mb-2"
                            />
                            <span className="text-xs font-medium">
                                {group.name}
                            </span>
                        </a>
                    ))}
                </div>
            );
        }

        /* ================= STYLE / BEAUTY ================= */
        if (Array.isArray(data)) {
            return (
                <div className="mt-4 space-y-4 pl-2">
                    {data.map((section) => {
                        const isOpen = openSub === section.title;

                        return (
                            <div key={section.title}>
                                <button
                                    onClick={() => toggleSub(section.title)}
                                    className="flex justify-between items-center w-full text-sm font-medium uppercase"
                                >
                                    {section.title}
                                    <ChevronRight
                                        size={16}
                                        className={`transition-transform ${isOpen ? "rotate-90 text-[#5E2251]" : ""
                                            }`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="mt-3 space-y-2 pl-3">
                                        {section.items.map((item) => (
                                            <a
                                                key={item.label}
                                                href={item.url}
                                                className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#5E2251]"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.label}
                                                    className="w-8 h-8 object-cover rounded"
                                                />
                                                {item.label}
                                            </a>
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
        <div className="w-full bg-white p-6 space-y-6">

            {menuItems
                .filter((menu) => menu.name !== "Blog")
                .map((menu) => {
                    const isOpen = openMenu === menu.name;

                    return (
                        <div key={menu.name}>
                            <button
                                onClick={() => toggleMenu(menu.name)}
                                className="flex justify-between items-center w-full text-base font-semibold uppercase"
                            >
                                {menu.name}
                                {menu.hasDropdown && (
                                    isOpen ? (<Minus size={18} className="text-[#5E2251] transition-colors" />
                                    ) : (
                                        <Plus size={18} className="text-gray-700 transition-colors" />)
                                )}
                            </button>

                            {menu.hasDropdown && isOpen && renderSubmenu(menu.type)}
                        </div>
                    );
                })}
        </div>
    );
}