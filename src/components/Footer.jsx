import {
  Twitter,
  Facebook,
  Mail,
  Youtube,
} from "lucide-react";

// Pinterest & Instagram icons as custom SVGs since lucide has limited versions
const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const links = [
  "FAQ",
  "Livraisons",
  "CGV",
  "Politique de retours",
  "Politique de confidentialité",
  "Mention Légales",
  "Suivi colis",
  "Plan du Site",
];

const perks = [
  { icon: "💬", text: "Un support client français très réactif" },
  { icon: "📦", text: "Des livraisons gratuites avec un suivi colis" },
  { icon: "🔒", text: "Des paiements en ligne 100% sécurisés" },
  { icon: "✅", text: "Une option d'achat satisfait ou remboursé" },
];

const socials = [
  { label: "X (Twitter)", icon: <Twitter className="w-5 h-5" />, href: "#" },
  { label: "Facebook", icon: <Facebook className="w-5 h-5" />, href: "#" },
  { label: "Pinterest", icon: <PinterestIcon />, href: "#" },
  { label: "Instagram", icon: <InstagramIcon />, href: "#" },
  { label: "YouTube", icon: <Youtube className="w-5 h-5" />, href: "#" },
  { label: "Email", icon: <Mail className="w-5 h-5" />, href: "mailto:contact@boutique-kpop.fr" },
];

export function Footer() {
  return (
    <footer className="bg-[#5E2251] text-gray-300 pt-14 pb-6 px-6 md:px-16 font-sans">
      {/* Top grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

        {/* Column 1 — Informations */}
        <div>
          <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-5">
            Informations
          </h3>
          <ul className="space-y-2.5">
            {links.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2 — Boutique KPOP c'est */}
        <div>
          <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-5">
            Boutique KPOP c'est
          </h3>
          <ul className="space-y-3">
            {perks.map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-gray-400">
                <span className="text-base leading-snug">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Contact */}
        <div>
          <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-5">
            Contact
          </h3>
          <div className="space-y-2 text-sm text-gray-400 mb-8">
            <p>
              Email :{" "}
              <a
                href="mailto:contact@boutique-kpop.fr"
                className="text-white hover:underline"
              >
                contact@boutique-kpop.fr
              </a>
            </p>
            <p>128 Rue La Boétie, 75008 Paris</p>
          </div>

          {/* Social icons */}
          <div className="flex flex-wrap gap-3">
            {socials.map(({ label, icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-700 text-gray-400 hover:text-white hover:border-white transition-all duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto border-t border-gray-800 mb-6" />

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <span>Madagascar ‎(EUR €)‎</span>
        <span>
          © 2026,{" "}
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Boutique KPOP
          </a>
          .
        </span>
      </div>
    </footer>
  );
}