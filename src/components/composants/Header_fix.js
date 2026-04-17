// Créer un fichier de patch pour modifier le Header
const fs = require('fs');

const headerPath = './Header.jsx';
let content = fs.readFileSync(headerPath, 'utf8');

// 1. Ajouter onClick au bouton de la catégorie parent
const pattern1 = /(<button className="flex items-center gap-1 text-gray-700 hover:text-\[#5E2251\] py-2">)/;
const replacement1 = `<button 
                onClick={() => {
                  closeNow();
                  navigate(\`/category/\${category.id}\`);
                }}
                className="flex items-center gap-1 text-gray-700 hover:text-[#5E2251] py-2">`;

content = content.replace(pattern1, replacement1);

// 2. Ajouter la catégorie parent au menu déroulant
const pattern2 = /<div className="grid grid-cols-4 gap-12">/;
const replacement2 = `<div className="grid grid-cols-4 gap-12">
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          closeNow();
                          navigate(\`/category/\${category.id}\`);
                        }}
                        className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#5E2251] w-full hover:text-[#5E2251] transition-colors"
                      >
                        {category.image && (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <h4 className="text-sm font-bold text-[#5E2251] uppercase flex-1 text-left">
                          {category.name}
                        </h4>
                      </button>
                    </div>`;

content = content.replace(pattern2, replacement2);

fs.writeFileSync(headerPath, content, 'utf8');
console.log('✅ Header modifié avec succès!');
