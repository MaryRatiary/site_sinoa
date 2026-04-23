// ✅ REVIEWS ORGANISÉES PAR CATÉGORIES
// Chaque catégorie a 10 commentaires spécifiques

const reviewsByCategory = {
  'T-shirts & Débardeurs': [
    { id: 1, author: "Sophie Martin", rating: 5, date: "2026-03-15", title: "T-shirt de qualité exceptionnelle", content: "Le t-shirt est incroyable ! Le coton est super doux, l'impression ne s'efface pas et la couleur reste vive. Vraiment recommandé !", verified: true, helpful: 24 },
    { id: 2, author: "Lucas Dubois", rating: 4, date: "2026-03-14", title: "Bon rapport qualité-prix", content: "Très satisfait de mon achat. Les coutures sont bien faites et la taille correspond parfaitement. Un petit bémol sur le séchage rapide.", verified: true, helpful: 18 },
    { id: 3, author: "Marie Chen", rating: 5, date: "2026-03-13", title: "Parfait pour tous les jours", content: "J'ai commandé plusieurs t-shirts. Ils sont confortables, durables et le design est magnifique. Mes enfants les adorent !", verified: true, helpful: 31 },
    { id: 4, author: "Thomas Moreau", rating: 4, date: "2026-03-12", title: "Très bonne tenue au lavage", content: "Après plusieurs lavages, le t-shirt est encore comme neuf. L'impression est bien résistante. Super qualité pour le prix !", verified: true, helpful: 12 },
    { id: 5, author: "Amélie Rousseau", rating: 5, date: "2026-03-11", title: "Design unique et stylé", content: "Le t-shirt est vraiment unique ! Le design est original et reçoit plein de compliments. Je l'adore et je le porte régulièrement !", verified: true, helpful: 27 },
    { id: 6, author: "Nicolas Lefevre", rating: 5, date: "2026-03-10", title: "Excellent pour les cadeaux", content: "J'en ai acheté plusieurs comme cadeaux. Tout le monde a adoré ! C'est un excellent choix à chaque fois.", verified: true, helpful: 15 },
    { id: 7, author: "Jade Kim", rating: 5, date: "2026-03-09", title: "Qualité premium", content: "Incroyable ! Le coton est premium, les coutures sont parfaites et les détails sont impeccables. Vraiment une excellente acquisition !", verified: true, helpful: 42 },
    { id: 8, author: "Alexandra Martin", rating: 5, date: "2026-03-08", title: "Confortable et durable", content: "Après des mois d'utilisation, le t-shirt n'a rien perdu de sa qualité. Super confortable et reste comme neuf !", verified: true, helpful: 38 },
    { id: 9, author: "Clara Fontaine", rating: 4, date: "2026-03-07", title: "Très joli design", content: "Le design est superbe et très tendance. La qualité est bonne. Les tailles pourraient être un peu plus généreuses.", verified: true, helpful: 35 },
    { id: 10, author: "Raphaël Dupont", rating: 5, date: "2026-03-06", title: "Parfait rapport qualité-prix", content: "C'est clairement le meilleur t-shirt que j'ai jamais acheté dans cette gamme de prix. Highly recommend !", verified: true, helpful: 29 }
  ],
  'Sweats & Pulls': [
    { id: 11, author: "Léa Bertrand", rating: 5, date: "2026-03-05", title: "Sweat ultra confortable", content: "Le sweat est tellement confortable ! La matière est douce, l'ajustement est parfait et je le porte tous les jours.", verified: true, helpful: 21 },
    { id: 12, author: "Maxime Leclerc", rating: 5, date: "2026-03-04", title: "Qualité exceptionnelle", content: "La qualité du tissu est exceptionnelle. Les coutures sont solides et le design est vraiment sympa. Très satisfait !", verified: true, helpful: 16 },
    { id: 13, author: "Camille Dubois", rating: 5, date: "2026-03-03", title: "Chaud et stylé", content: "Le sweat tient super chaud sans être étouffant. Le design est tendance et confortable. J'en ai pris plusieurs couleurs !", verified: true, helpful: 33 },
    { id: 14, author: "Antoine Girard", rating: 4, date: "2026-03-02", title: "Très bon investissement", content: "Bon sweat pour la saison. Le confort est au rendez-vous et les couleurs sont belles. Un seul bémol : le prix.", verified: true, helpful: 14 },
    { id: 15, author: "Isabelle Moreau", rating: 5, date: "2026-03-01", title: "Sweat de rêve", content: "C'est mon sweat préféré ! Super doux, coupe parfaite et le design est magnifique. Je le recommande à tout le monde !", verified: true, helpful: 44 },
    { id: 16, author: "Pierre Blanc", rating: 5, date: "2026-02-28", title: "Parfait pour l'hiver", content: "Le sweat est génial pour l'hiver. Il tient chaud sans être trop lourd et c'est super confortable.", verified: true, helpful: 26 },
    { id: 17, author: "Aurélie Fontaine", rating: 5, date: "2026-02-27", title: "Excellent choix", content: "J'ai acheté ce sweat et je ne le regrette pas. La qualité est au rendez-vous et le style est impeccable !", verified: true, helpful: 39 },
    { id: 18, author: "Benjamin Leroy", rating: 4, date: "2026-02-26", title: "Sweat sympa", content: "Un bon sweat avec un design original. La matière est confortable. J'aurais aimé un peu plus d'options de couleur.", verified: true, helpful: 11 },
    { id: 19, author: "Victoria Chen", rating: 5, date: "2026-02-25", title: "Incontournable", content: "Le sweat est incontournable ! Qualité, confort et style sont présents. C'est un must-have pour la garde-robe !", verified: true, helpful: 37 },
    { id: 20, author: "Émilie Lambert", rating: 5, date: "2026-02-24", title: "Superbe qualité", content: "Superbe sweat avec une qualité vraiment exceptionnelle. Les finitions sont parfaites et le design est très tendance !", verified: true, helpful: 48 }
  ],
  'Vestes & Costumes': [
    { id: 21, author: "David Marchand", rating: 5, date: "2026-02-23", title: "Veste magnifique", content: "La veste est magnifique ! Le tissu est de qualité, les coutures sont impeccables. Elle va avec tous mes vêtements !", verified: true, helpful: 31 },
    { id: 22, author: "Zoé Mercier", rating: 5, date: "2026-02-22", title: "Très bonne qualité", content: "La veste est de très bonne qualité. L'ajustement est parfait et le design est moderne. Super achat !", verified: true, helpful: 22 },
    { id: 23, author: "Julien Fournier", rating: 4, date: "2026-02-21", title: "Veste stylée", content: "La veste est stylée et confortable. Un petit bémol : le col peut être un peu raide au début.", verified: true, helpful: 19 },
    { id: 24, author: "Charlotte Rousseau", rating: 5, date: "2026-02-20", title: "Parfait pour tous les jours", content: "Cette veste est parfaite pour tous les jours. Confortable, durable et avec un design tendance. J'adore !", verified: true, helpful: 45 },
    { id: 25, author: "Olivier Petit", rating: 5, date: "2026-02-19", title: "Excellent investissement", content: "La veste est un excellent investissement. Elle dure longtemps et reste élégante. Vraiment recommandée !", verified: true, helpful: 28 },
    { id: 26, author: "Mélanie Nguyen", rating: 5, date: "2026-02-18", title: "Design magnifique", content: "Le design de la veste est magnifique ! Elle attire l'attention et est super confortable. Très satisfaite !", verified: true, helpful: 52 },
    { id: 27, author: "François Lefevre", rating: 4, date: "2026-02-17", title: "Très bon rapport qualité-prix", content: "La veste offre un très bon rapport qualité-prix. Confortable et durable. Je la recommande !", verified: true, helpful: 20 },
    { id: 28, author: "Sophie Langlois", rating: 5, date: "2026-02-16", title: "Veste de qualité premium", content: "La veste est de qualité premium. Le tissu est confortable et le design est élégant. Un achat excellent !", verified: true, helpful: 25 },
    { id: 29, author: "Marc Dubois", rating: 5, date: "2026-02-15", title: "Très satisfait", content: "Je suis très satisfait de cette veste. Confortable depuis le premier jour et très stylée. Top !", verified: true, helpful: 41 },
    { id: 30, author: "Nathalie Moreau", rating: 5, date: "2026-02-14", title: "Veste extraordinaire", content: "La veste est extraordinaire ! Qualité, confort et style sont au rendez-vous. Je l'adore !", verified: true, helpful: 34 }
  ],
  'Pyjamas & Ensembles': [
    { id: 31, author: "Adrien Leclerc", rating: 5, date: "2026-02-13", title: "Pyjama ultra doux", content: "Le pyjama est ultra doux ! Le coton est de qualité premium et l'ajustement est parfait. Je dors merveilleusement bien !", verified: true, helpful: 29 },
    { id: 32, author: "Viviane Blanc", rating: 4, date: "2026-02-12", title: "Très beau pyjama", content: "Très beau pyjama avec une bonne qualité. Confortable pour dormir. Les motifs sont adorables.", verified: true, helpful: 17 },
    { id: 33, author: "Laurent Martin", rating: 5, date: "2026-02-11", title: "Pyjama incontournable", content: "Ce pyjama est incontournable ! Il va avec tout et la qualité est vraiment excellente. Je le recommande !", verified: true, helpful: 46 },
    { id: 34, author: "Karine Lambert", rating: 5, date: "2026-02-10", title: "Pyjama de qualité", content: "Le pyjama est de vraie qualité. Les finitions sont parfaites et le style est impeccable. Vraiment content !", verified: true, helpful: 32 },
    { id: 35, author: "Sébastien Girard", rating: 5, date: "2026-02-09", title: "Pyjama magnifique", content: "Le pyjama est magnifique ! Il ajoute du confort à mes nuits et la qualité est au rendez-vous. Parfait !", verified: true, helpful: 23 },
    { id: 36, author: "Pascale Fontaine", rating: 5, date: "2026-02-08", title: "Excellent pyjama", content: "Excellent pyjama ! La qualité est premium et le design est unique. Je le porte avec plaisir !", verified: true, helpful: 50 },
    { id: 37, author: "Emmanuel Leroy", rating: 4, date: "2026-02-07", title: "Pyjama sympa", content: "Le pyjama est sympa et bien fait. Bonne qualité. Un peu cher pour ce que c'est mais vraiment joli.", verified: true, helpful: 18 },
    { id: 38, author: "Dominique Leclerc", rating: 5, date: "2026-02-06", title: "Pyjama de style", content: "Le pyjama apporte vraiment du style ! La qualité est exceptionnelle et le design est très tendance !", verified: true, helpful: 27 },
    { id: 39, author: "Véronique Martin", rating: 5, date: "2026-02-05", title: "Pyjama inévitable", content: "Le pyjama est inévitable pour une bonne nuit ! Qualité premium et design impeccable. Recommandé !", verified: true, helpful: 24 },
    { id: 40, author: "Christophe Petit", rating: 5, date: "2026-02-04", title: "Très beau pyjama", content: "Très beau pyjama avec une finition parfaite ! Ça rend le sommeil agréable. Je l'adore !", verified: true, helpful: 36 }
  ],
  'Chaussures & Chaussons': [
    { id: 41, author: "Régine Dubois", rating: 5, date: "2026-02-03", title: "Chaussures ultra confortables", content: "Ces chaussures sont incroyablement confortables ! Je les porte toute la journée sans fatigue. Vraiment excellent !", verified: true, helpful: 40 },
    { id: 42, author: "Yvan Marchand", rating: 5, date: "2026-02-02", title: "Très bonne qualité", content: "Les chaussures sont de très bonne qualité. La semelle tient bien et le design est joli. Super achat !", verified: true, helpful: 22 },
    { id: 43, author: "Géraldine Blanc", rating: 4, date: "2026-02-01", title: "Chaussures stylées", content: "Les chaussures sont stylées et confortables. Un petit bémol : elles peuvent être un peu petites à la première utilisation.", verified: true, helpful: 19 },
    { id: 44, author: "Thierry Leclerc", rating: 5, date: "2026-01-31", title: "Parfait pour tous les jours", content: "Ces chaussures sont parfaites pour tous les jours. Confortables, durables et avec un design tendance. J'adore !", verified: true, helpful: 45 },
    { id: 45, author: "Sabine Lambert", rating: 5, date: "2026-01-30", title: "Excellent investissement", content: "Les chaussures sont un excellent investissement. Elles durent longtemps et restent confortables. Vraiment recommandées !", verified: true, helpful: 28 },
    { id: 46, author: "Félicien Girard", rating: 5, date: "2026-01-29", title: "Design magnifique", content: "Le design des chaussures est magnifique ! Elles attirent l'attention et sont super confortables. Très satisfait !", verified: true, helpful: 52 },
    { id: 47, author: "Monique Fontaine", rating: 4, date: "2026-01-28", title: "Très bon rapport qualité-prix", content: "Les chaussures offrent un très bon rapport qualité-prix. Confortables et durables. Je les recommande !", verified: true, helpful: 20 },
    { id: 48, author: "Bernard Dubois", rating: 5, date: "2026-01-27", title: "Chaussures de qualité premium", content: "Les chaussures sont de qualité premium. La semelle est confortable et le design est élégant. Un achat excellent !", verified: true, helpful: 25 },
    { id: 49, author: "Lydia Leroy", rating: 5, date: "2026-01-26", title: "Très satisfait", content: "Je suis très satisfait de ces chaussures. Confortables depuis le premier jour et très stylées. Top !", verified: true, helpful: 41 },
    { id: 50, author: "Grégoire Moreau", rating: 5, date: "2026-01-25", title: "Chaussures extraordinaires", content: "Les chaussures sont extraordinaires ! Qualité, confort et style sont au rendez-vous. Je les adore !", verified: true, helpful: 34 }
  ],
  'Accessoires Mode': [
    { id: 51, author: "Sophie Beaumont", rating: 5, date: "2026-03-20", title: "Accessoire magnifique", content: "L'accessoire est magnifique ! La finition est parfaite et le design est très élégant. Vraiment recommandé !", verified: true, helpful: 32 },
    { id: 52, author: "Jean Leclerc", rating: 5, date: "2026-03-19", title: "Accessoire de luxe", content: "L'accessoire est vraiment de luxe ! Les matériaux sont de qualité premium et c'est superbe.", verified: true, helpful: 28 },
    { id: 53, author: "Marie Brun", rating: 4, date: "2026-03-18", title: "Très joli accessoire", content: "L'accessoire est très joli et bien fait. Un petit bémol sur la taille qui est un peu petite.", verified: true, helpful: 19 },
    { id: 54, author: "Pierre Fontaine", rating: 5, date: "2026-03-17", title: "Accessoire parfait", content: "L'accessoire est parfait ! Qualité excellente et design très tendance. Je suis ravi !", verified: true, helpful: 41 },
    { id: 55, author: "Lucie Martin", rating: 5, date: "2026-03-16", title: "Accessoire d'exception", content: "L'accessoire est d'exception ! Les détails sont minutieux et l'ensemble est superbe. Vraiment magnifique !", verified: true, helpful: 35 },
    { id: 56, author: "Antoine Dubois", rating: 5, date: "2026-03-15", title: "Accessoire de prestige", content: "L'accessoire est de prestige ! Matériaux nobles et finitions impeccables. Un must-have !", verified: true, helpful: 39 },
    { id: 57, author: "Claire Lefevre", rating: 4, date: "2026-03-14", title: "Accessoire sympa", content: "L'accessoire est sympa et bien fait. Bonne qualité. Peut-être un peu cher pour le design.", verified: true, helpful: 16 },
    { id: 58, author: "Marc Rousseau", rating: 5, date: "2026-03-13", title: "Accessoire extraordinaire", content: "L'accessoire est extraordinaire ! Finition impeccable et design très élégant. Je l'adore !", verified: true, helpful: 44 },
    { id: 59, author: "Sophie Mercier", rating: 5, date: "2026-03-12", title: "Accessoire incontournable", content: "L'accessoire est incontournable ! Qualité et style sont au rendez-vous. Vraiment un excellent achat !", verified: true, helpful: 48 },
    { id: 60, author: "Julien Petit", rating: 5, date: "2026-03-11", title: "Accessoire de collection", content: "L'accessoire est vraiment de collection ! Qualité premium et design unique. Excellent !", verified: true, helpful: 42 }
  ],
  'Sacs & Maroquinerie': [
    { id: 61, author: "Véronique Blanc", rating: 5, date: "2026-03-25", title: "Sac de qualité exceptionnelle", content: "Le sac est de qualité exceptionnelle ! Les matériaux sont premium et les finitions sont parfaites. Très satisfaite !", verified: true, helpful: 26 },
    { id: 62, author: "Laurent Brun", rating: 5, date: "2026-03-24", title: "Sac très pratique", content: "Le sac est très pratique avec de nombreux compartiments. La qualité est bonne. Un peu cher mais vraiment utile.", verified: true, helpful: 30 },
    { id: 63, author: "Caroline Martin", rating: 4, date: "2026-03-23", title: "Sac magnifique", content: "Le sac est magnifique ! Spacieux, durable et avec un design élégant. C'est mon sac préféré maintenant !", verified: true, helpful: 14 },
    { id: 64, author: "Jean Leclerc", rating: 5, date: "2026-03-22", title: "Sac robuste et stylé", content: "Le sac est robuste et très stylé ! Les coutures sont solides et le design plaît à tout le monde. Excellent achat !", verified: true, helpful: 37 },
    { id: 65, author: "Isabelle Dubois", rating: 5, date: "2026-03-21", title: "Sac pour tous les jours", content: "Le sac est parfait pour tous les jours ! Confortable, durable et avec un style impeccable. Je le recommande !", verified: true, helpful: 43 },
    { id: 66, author: "Michel Fontaine", rating: 5, date: "2026-03-20", title: "Sac d'exception", content: "Le sac est vraiment d'exception ! La qualité du cuir, les finitions, le design... Tout est parfait !", verified: true, helpful: 51 },
    { id: 67, author: "Nathalie Leroy", rating: 4, date: "2026-03-19", title: "Sac de qualité", content: "Le sac est de bonne qualité. Les compartiments sont bien organisés. Un peu petit pour mon usage quotidien.", verified: true, helpful: 15 },
    { id: 68, author: "Patrick Rousseau", rating: 5, date: "2026-03-18", title: "Sac fonctionnel et beau", content: "Le sac est à la fois fonctionnel et beau ! Les matériaux sont durables et le design est très tendance !", verified: true, helpful: 52 },
    { id: 69, author: "Francine Petit", rating: 5, date: "2026-03-17", title: "Sac merveilleux", content: "Le sac est merveilleux ! Capacité, confort et style sont excellents. C'est un investissement de qualité !", verified: true, helpful: 49 },
    { id: 70, author: "Gérard Mercier", rating: 5, date: "2026-03-16", title: "Sac extraordinaire", content: "Le sac est extraordinaire ! Qualité premium, design impeccable et très fonctionnel. Je l'adore !", verified: true, helpful: 53 }
  ],
  'Bijoux & Accessoires': [
    { id: 71, author: "Sylvie Blanc", rating: 5, date: "2026-03-30", title: "Bijou magnifique", content: "Le bijou est magnifique ! La finition est parfaite et le design est très élégant. Vraiment recommandé !", verified: true, helpful: 32 },
    { id: 72, author: "Bernard Brun", rating: 5, date: "2026-03-29", title: "Accessoire de luxe", content: "L'accessoire est vraiment de luxe ! Les matériaux sont de qualité premium et c'est superbe.", verified: true, helpful: 28 },
    { id: 73, author: "Monique Martin", rating: 4, date: "2026-03-28", title: "Très joli bijou", content: "Le bijou est très joli et bien fait. Un petit bémol sur la taille qui est un peu petite.", verified: true, helpful: 19 },
    { id: 74, author: "Denis Leclerc", rating: 5, date: "2026-03-27", title: "Bijou parfait", content: "Le bijou est parfait ! Qualité excellente et design très tendance. Je suis ravi !", verified: true, helpful: 41 },
    { id: 75, author: "Jacqueline Dubois", rating: 5, date: "2026-03-26", title: "Bijou d'exception", content: "Le bijou est d'exception ! Les détails sont minutieux et l'ensemble est superbe. Vraiment magnifique !", verified: true, helpful: 35 },
    { id: 76, author: "Alain Fontaine", rating: 5, date: "2026-03-25", title: "Bijou de prestige", content: "Le bijou est de prestige ! Matériaux nobles et finitions impeccables. Un must-have !", verified: true, helpful: 39 },
    { id: 77, author: "Valérie Leroy", rating: 4, date: "2026-03-24", title: "Bijou sympa", content: "Le bijou est sympa et bien fait. Bonne qualité. Peut-être un peu cher pour le design.", verified: true, helpful: 16 },
    { id: 78, author: "Serge Rousseau", rating: 5, date: "2026-03-23", title: "Bijou extraordinaire", content: "Le bijou est extraordinaire ! Finition impeccable et design très élégant. Je l'adore !", verified: true, helpful: 44 },
    { id: 79, author: "Martine Petit", rating: 5, date: "2026-03-22", title: "Bijou incontournable", content: "Le bijou est incontournable ! Qualité et style sont au rendez-vous. Vraiment un excellent achat !", verified: true, helpful: 48 },
    { id: 80, author: "Claude Mercier", rating: 5, date: "2026-03-21", title: "Bijou de collection", content: "Le bijou est vraiment de collection ! Qualité premium et design unique. Excellent !", verified: true, helpful: 42 }
  ],
  'Mode & Protection': [
    { id: 81, author: "Chantal Blanc", rating: 5, date: "2026-04-05", title: "Produit de protection efficace", content: "Le produit est efficace et de bonne qualité ! Parfait pour la protection quotidienne. Je recommande !", verified: true, helpful: 29 },
    { id: 82, author: "Etienne Brun", rating: 5, date: "2026-04-04", title: "Protection de qualité", content: "La protection est de qualité ! Design moderne et très efficace. Vraiment satisfait de cet achat !", verified: true, helpful: 35 },
    { id: 83, author: "Danielle Martin", rating: 4, date: "2026-04-03", title: "Bon produit de protection", content: "Bon produit de protection avec un design sympa. La qualité est correcte. Un peu cher peut-être.", verified: true, helpful: 17 },
    { id: 84, author: "Frédéric Leclerc", rating: 5, date: "2026-04-02", title: "Protection essentielle", content: "La protection est essentielle et de très bonne qualité ! Confortable à porter et très efficace !", verified: true, helpful: 40 },
    { id: 85, author: "Cécile Dubois", rating: 5, date: "2026-04-01", title: "Produit de protection premium", content: "Le produit est de protection premium ! Qualité exceptionnelle et très confortable. Excellent achat !", verified: true, helpful: 43 },
    { id: 86, author: "Hubert Fontaine", rating: 5, date: "2026-03-31", title: "Protection fiable", content: "La protection est fiable et de qualité ! Design élégant et vraiment efficace. Je recommande !", verified: true, helpful: 35 },
    { id: 87, author: "Annie Leroy", rating: 4, date: "2026-03-30", title: "Produit sympa", content: "Le produit est sympa et bien fait. Bonne protection. Pourrait avoir plus d'options de couleur.", verified: true, helpful: 12 },
    { id: 88, author: "Gaston Rousseau", rating: 5, date: "2026-03-29", title: "Protection de confiance", content: "La protection est de confiance ! Qualité vérifiée et design très moderne. Vraiment excellent !", verified: true, helpful: 40 },
    { id: 89, author: "Brigitte Petit", rating: 5, date: "2026-03-28", title: "Produit très efficace", content: "Le produit est très efficace ! Qualité premium et confortable à utiliser. Je l'adore !", verified: true, helpful: 46 },
    { id: 90, author: "Roland Mercier", rating: 5, date: "2026-03-27", title: "Protection exceptionnelle", content: "La protection est exceptionnelle ! Qualité et efficacité sont impeccables. Vraiment magnifique !", verified: true, helpful: 50 }
  ],
  'Objets du Quotidien': [
    { id: 91, author: "Rita Blanc", rating: 5, date: "2026-04-10", title: "Objet indispensable", content: "L'objet est indispensable au quotidien ! Très utile et de bonne qualité. Je l'utilise tous les jours !", verified: true, helpful: 33 },
    { id: 92, author: "Fernand Brun", rating: 5, date: "2026-04-09", title: "Produit pratique et durable", content: "Le produit est pratique et durable ! Excellente qualité et très fonctionnel. Vraiment satisfait !", verified: true, helpful: 39 },
    { id: 93, author: "Yvette Martin", rating: 4, date: "2026-04-08", title: "Objet sympa du quotidien", content: "L'objet est sympa pour le quotidien. Bonne qualité et pratique. Un peu cher pour ce que c'est.", verified: true, helpful: 18 },
    { id: 94, author: "Gustave Leclerc", rating: 5, date: "2026-04-07", title: "Objet de qualité", content: "L'objet est de qualité ! Matériaux robustes et design pratique. Vraiment un bon achat !", verified: true, helpful: 38 },
    { id: 95, author: "Micheline Dubois", rating: 5, date: "2026-04-06", title: "Produit indispensable", content: "Le produit est indispensable ! Qualité premium et très pratique. Je ne peux plus m'en passer !", verified: true, helpful: 34 },
    { id: 96, author: "Raoul Fontaine", rating: 5, date: "2026-04-05", title: "Objet très utile", content: "L'objet est très utile ! Qualité excellente et design pratique. Vraiment excellent choix !", verified: true, helpful: 42 },
    { id: 97, author: "Simone Leroy", rating: 4, date: "2026-04-04", title: "Produit pratique", content: "Le produit est pratique et bien fait. Bonne qualité. Peut-être un peu cher pour l'usage.", verified: true, helpful: 13 },
    { id: 98, author: "Octave Rousseau", rating: 5, date: "2026-04-03", title: "Objet de tous les jours", content: "L'objet est parfait pour tous les jours ! Robuste, pratique et de bonne qualité. Excellent !", verified: true, helpful: 45 },
    { id: 99, author: "Odette Petit", rating: 5, date: "2026-04-02", title: "Produit du quotidien essentiel", content: "Le produit est essentiel au quotidien ! Qualité et pratique sont impeccables. Je l'adore !", verified: true, helpful: 51 },
    { id: 100, author: "Xavier Mercier", rating: 5, date: "2026-04-01", title: "Objet extraordinaire", content: "L'objet est extraordinaire ! Qualité premium et vraiment très pratique. Un achat excellent !", verified: true, helpful: 47 }
  ],
  'Bureau & Tech': [
    { id: 101, author: "Zoé Blanc", rating: 5, date: "2026-04-15", title: "Produit tech de qualité", content: "Le produit tech est de qualité ! Fonctionnalités impeccables et design moderne. Vraiment satisfait !", verified: true, helpful: 31 },
    { id: 102, author: "Thomas Brun", rating: 5, date: "2026-04-14", title: "Accessoire tech excellent", content: "L'accessoire tech est excellent ! Performances au rendez-vous et qualité premium. Très heureux !", verified: true, helpful: 37 },
    { id: 103, author: "Emma Martin", rating: 4, date: "2026-04-13", title: "Produit tech sympa", content: "Le produit tech est sympa et bien conçu. Bonne qualité. Un peu cher pour le marché.", verified: true, helpful: 19 },
    { id: 104, author: "Luc Leclerc", rating: 5, date: "2026-04-12", title: "Accessoire de bureau pratique", content: "L'accessoire de bureau est pratique ! Vraiment utile et de bonne qualité. Excellent achat !", verified: true, helpful: 46 },
    { id: 105, author: "Amélia Dubois", rating: 5, date: "2026-04-11", title: "Produit tech de prestige", content: "Le produit tech est de prestige ! Qualité exceptionnelle et performances impeccables. Magnifique !", verified: true, helpful: 44 },
    { id: 106, author: "Noé Fontaine", rating: 5, date: "2026-04-10", title: "Accessoire de bureau indispensable", content: "L'accessoire de bureau est indispensable ! Vraiment pratique et de qualité premium. Excellent !", verified: true, helpful: 38 },
    { id: 107, author: "Hélène Leroy", rating: 4, date: "2026-04-09", title: "Produit tech correct", content: "Le produit tech est correct. Bonnes performances et qualité convenable. Quelques améliorations possibles.", verified: true, helpful: 14 },
    { id: 108, author: "Cédric Rousseau", rating: 5, date: "2026-04-08", title: "Accessoire tech fiable", content: "L'accessoire tech est fiable ! Qualité vérifiée et vraiment performant. Vraiment excellent !", verified: true, helpful: 49 },
    { id: 109, author: "Fanny Petit", rating: 5, date: "2026-04-07", title: "Produit de bureau de qualité", content: "Le produit de bureau est de qualité ! Fonctionnalités complètes et design ergonomique. J'aime !", verified: true, helpful: 43 },
    { id: 110, author: "Yves Mercier", rating: 5, date: "2026-04-06", title: "Accessoire tech extraordinaire", content: "L'accessoire tech est extraordinaire ! Qualité premium et performances exceptionnelles. Superbe !", verified: true, helpful: 52 }
  ],
  'Décoration': [
    { id: 111, author: "Léo Blanc", rating: 5, date: "2026-04-20", title: "Décoration magnifique", content: "La décoration est magnifique ! Transforme complètement la pièce. Qualité premium. Vraiment adoré !", verified: true, helpful: 34 },
    { id: 112, author: "Gilles Brun", rating: 5, date: "2026-04-19", title: "Accessoire de décoration excellent", content: "L'accessoire de décoration est excellent ! Design superbe et très bien fait. Ajoute vraiment du charme !", verified: true, helpful: 40 },
    { id: 113, author: "Noémie Martin", rating: 4, date: "2026-04-18", title: "Décoration sympa", content: "La décoration est sympa et bien faite. Bon rapport qualité-prix. Un peu fragile à la manipulation.", verified: true, helpful: 18 },
    { id: 114, author: "Stéphane Leclerc", rating: 5, date: "2026-04-17", title: "Accessoire de décoration de prestige", content: "L'accessoire de décoration est de prestige ! Élégant et de qualité premium. Parfait pour le salon !", verified: true, helpful: 45 },
    { id: 115, author: "Véra Dubois", rating: 5, date: "2026-04-16", title: "Décoration de rêve", content: "La décoration est de rêve ! Vraiment magnifique et de qualité exceptionnelle. Je l'aime tellement !", verified: true, helpful: 41 },
    { id: 116, author: "Roger Fontaine", rating: 5, date: "2026-04-15", title: "Accessoire de décoration sublime", content: "L'accessoire de décoration est sublime ! Qualité impeccable et design très élégant. Magnifique !", verified: true, helpful: 36 },
    { id: 117, author: "Liliane Leroy", rating: 4, date: "2026-04-14", title: "Décoration jolie", content: "La décoration est jolie et décore bien. Bonne qualité. Peut-être un peu trop fragile.", verified: true, helpful: 16 },
    { id: 118, author: "Didier Rousseau", rating: 5, date: "2026-04-13", title: "Accessoire de décoration exceptionnel", content: "L'accessoire de décoration est exceptionnel ! Vraiment beau et durable. Ravissant pour la maison !", verified: true, helpful: 48 },
    { id: 119, author: "Ginette Petit", rating: 5, date: "2026-04-12", title: "Décoration élégante", content: "La décoration est élégante ! Transforme toute la décoration intérieure. Qualité excellente. Adoré !", verified: true, helpful: 50 },
    { id: 120, author: "Aurélien Mercier", rating: 5, date: "2026-04-11", title: "Accessoire de décoration extraordinaire", content: "L'accessoire de décoration est extraordinaire ! Design sublime et qualité premium. Vraiment excellent !", verified: true, helpful: 54 }
  ],
  'Peluches': [
    { id: 121, author: "Eva Blanc", rating: 5, date: "2026-04-25", title: "Peluche adorable", content: "La peluche est adorable ! Super douce et les enfants l'adorent. Qualité premium. Très contente !", verified: true, helpful: 28 },
    { id: 122, author: "Hervé Brun", rating: 5, date: "2026-04-24", title: "Peluche de qualité", content: "La peluche est de qualité ! Très douce et durable. Les détails sont parfaits. Excellent cadeau !", verified: true, helpful: 36 },
    { id: 123, author: "Sylvie Martin", rating: 4, date: "2026-04-23", title: "Peluche sympa", content: "La peluche est sympa et bien faite. Bonne qualité. Un peu chère pour une peluche.", verified: true, helpful: 21 },
    { id: 124, author: "Michel Leclerc", rating: 5, date: "2026-04-22", title: "Peluche irrésistible", content: "La peluche est irrésistible ! Les enfants ne veulent pas la lâcher. Durable et adorable. Parfait !", verified: true, helpful: 43 },
    { id: 125, author: "Nicole Dubois", rating: 5, date: "2026-04-21", title: "Peluche extraordinaire", content: "La peluche est extraordinaire ! Qualité premium et design adorable. Un incontournable pour les enfants !", verified: true, helpful: 41 },
    { id: 126, author: "Adrien Fontaine", rating: 5, date: "2026-04-20", title: "Peluche de rêve", content: "La peluche est de rêve ! Super douce, design adorable et qualité exceptionnelle. Je l'aime !", verified: true, helpful: 40 },
    { id: 127, author: "Josette Leroy", rating: 4, date: "2026-04-19", title: "Peluche correcte", content: "La peluche est correcte. Bien faite et douce. Un peu petite peut-être.", verified: true, helpful: 15 },
    { id: 128, author: "Victor Rousseau", rating: 5, date: "2026-04-18", title: "Peluche adorable et durable", content: "La peluche est adorable et vraiment durable ! Qualité vérifiée. Les enfants l'adorent. Excellent !", verified: true, helpful: 51 },
    { id: 129, author: "Janine Petit", rating: 5, date: "2026-04-17", title: "Peluche câlin parfaite", content: "La peluche est parfaite pour les câlins ! Super douce et d'une qualité remarquable. Magnifique !", verified: true, helpful: 44 },
    { id: 130, author: "Frédérique Mercier", rating: 5, date: "2026-04-16", title: "Peluche de collection", content: "La peluche est vraiment de collection ! Qualité exceptionnelle et design unique. Adoré !", verified: true, helpful: 53 }
  ],
  'Figurines': [
    { id: 131, author: "Lisa Blanc", rating: 5, date: "2026-05-05", title: "Figurine magnifique", content: "La figurine est magnifique ! Les détails sont incroyables et la qualité est premium. Vraiment excellent !", verified: true, helpful: 32 },
    { id: 132, author: "Christophe Brun", rating: 5, date: "2026-05-04", title: "Figurine de qualité exceptionnelle", content: "La figurine est de qualité exceptionnelle ! Chaque détail est parfait. C'est une pièce de collection !", verified: true, helpful: 40 },
    { id: 133, author: "Vanessa Martin", rating: 4, date: "2026-05-03", title: "Figurine très sympa", content: "La figurine est très sympa et bien détaillée. Bonne qualité. Un peu fragile à manipuler.", verified: true, helpful: 20 },
    { id: 134, author: "Bruno Leclerc", rating: 5, date: "2026-05-02", title: "Figurine spectaculaire", content: "La figurine est spectaculaire ! Les finitions sont impeccables et le design est superbe. Magnifique !", verified: true, helpful: 47 },
    { id: 135, author: "Sandrine Dubois", rating: 5, date: "2026-05-01", title: "Figurine de prestige", content: "La figurine est de prestige ! Qualité premium et détails remarquables. Vraiment une belle pièce !", verified: true, helpful: 45 },
    { id: 136, author: "Fabien Fontaine", rating: 5, date: "2026-04-30", title: "Figurine extraordinaire", content: "La figurine est extraordinaire ! Chaque détail est travaillé avec soin. Une œuvre d'art en miniature !", verified: true, helpful: 38 },
    { id: 137, author: "Jeanne Leroy", rating: 4, date: "2026-04-29", title: "Figurine bien faite", content: "La figurine est bien faite. Les proportions sont correctes. Peut-être un peu cher.", verified: true, helpful: 17 },
    { id: 138, author: "Georges Rousseau", rating: 5, date: "2026-04-28", title: "Figurine impressionnante", content: "La figurine est impressionnante ! Qualité vérifiée et design impeccable. Vraiment excellent !", verified: true, helpful: 52 },
    { id: 139, author: "Michèle Petit", rating: 5, date: "2026-04-27", title: "Figurine parfaite", content: "La figurine est parfaite ! Qualité premium et détails magnifiques. C'est un investissement de classe !", verified: true, helpful: 49 },
    { id: 140, author: "Wilfried Mercier", rating: 5, date: "2026-04-26", title: "Figurine de collection exceptionnelle", content: "La figurine est une pièce de collection exceptionnelle ! Qualité et finition impeccables. Superbe !", verified: true, helpful: 55 }
  ],
  'Photocards & Cartes': [
    { id: 141, author: "Marcy Blanc", rating: 5, date: "2026-05-10", title: "Cartes magnifiques", content: "Les cartes sont magnifiques ! La qualité de l'impression est impeccable. Vraiment adoré !", verified: true, helpful: 30 },
    { id: 142, author: "Armand Brun", rating: 5, date: "2026-05-09", title: "Photocards de qualité premium", content: "Les photocards sont de qualité premium ! Les images sont claires et les couleurs sont vives. Excellent !", verified: true, helpful: 36 },
    { id: 143, author: "Valérie Martin", rating: 4, date: "2026-05-08", title: "Cartes sympa", content: "Les cartes sont sympa et bien imprimées. Bonne qualité. Peut-être un peu chère.", verified: true, helpful: 23 },
    { id: 144, author: "Léon Leclerc", rating: 5, date: "2026-05-07", title: "Photocards exceptionnelles", content: "Les photocards sont exceptionnelles ! Qualité vérifiée et design superbe. Vraiment excellent !", verified: true, helpful: 43 },
    { id: 145, author: "Bernadette Dubois", rating: 5, date: "2026-05-06", title: "Cartes de collection", content: "Les cartes sont une belle collection ! Qualité premium et images magnifiques. Vraiment adoré !", verified: true, helpful: 41 },
    { id: 146, author: "Fabrice Fontaine", rating: 5, date: "2026-05-05", title: "Photocards parfaites", content: "Les photocards sont parfaites ! Impression nette et couleurs éclatantes. Magnifique collection !", verified: true, helpful: 39 },
    { id: 147, author: "Justine Leroy", rating: 4, date: "2026-05-04", title: "Cartes correctes", content: "Les cartes sont correctes. Bonne impression et qualité convenable. Quelques imperfections.", verified: true, helpful: 18 },
    { id: 148, author: "Henri Rousseau", rating: 5, date: "2026-05-03", title: "Photocards de rêve", content: "Les photocards sont de rêve ! Qualité exceptionnelle et images superbes. Vraiment excellent !", verified: true, helpful: 50 },
    { id: 149, author: "Rosette Petit", rating: 5, date: "2026-05-02", title: "Cartes magnifiques et durable", content: "Les cartes sont magnifiques et durables ! Qualité premium et impression impeccable. Adoré !", verified: true, helpful: 46 },
    { id: 150, author: "Dimitri Mercier", rating: 5, date: "2026-05-01", title: "Photocards extraordinaires", content: "Les photocards sont extraordinaires ! Qualité vérifiée et images claires. Vraiment superbe !", verified: true, helpful: 54 }
  ],
  'Lightsticks': [
    { id: 151, author: "Sofia Blanc", rating: 5, date: "2026-05-15", title: "Lightstick fantastique", content: "Le lightstick est fantastique ! Les lumières sont éclatantes et c'est vraiment de qualité. Adoré !", verified: true, helpful: 33 },
    { id: 152, author: "Raphaële Brun", rating: 5, date: "2026-05-14", title: "Lightstick de qualité", content: "Le lightstick est de qualité ! Les effets lumineux sont impressionnants. Parfait pour les concerts !", verified: true, helpful: 38 },
    { id: 153, author: "Simona Martin", rating: 4, date: "2026-05-13", title: "Lightstick sympa", content: "Le lightstick est sympa et bien conçu. Bonne qualité. La batterie pourrait durer plus longtemps.", verified: true, helpful: 22 },
    { id: 154, author: "Ludovic Leclerc", rating: 5, date: "2026-05-12", title: "Lightstick impressionnant", content: "Le lightstick est impressionnant ! Les couleurs sont vives et la qualité est premium. Excellent !", verified: true, helpful: 44 },
    { id: 155, author: "Bibiane Dubois", rating: 5, date: "2026-05-11", title: "Lightstick spectaculaire", content: "Le lightstick est spectaculaire ! Vraiment bien fait et durable. Les effets lumineux sont magnifiques !", verified: true, helpful: 42 },
    { id: 156, author: "Fabrice Fontaine", rating: 5, date: "2026-05-10", title: "Lightstick de rêve", content: "Le lightstick est de rêve ! Qualité exceptionnelle et super lumineux. Vraiment excellent !", verified: true, helpful: 37 },
    { id: 157, author: "Juliette Leroy", rating: 4, date: "2026-05-09", title: "Lightstick correct", content: "Le lightstick est correct. Bonne luminosité et qualité convenable. Peut-être un peu cher.", verified: true, helpful: 19 },
    { id: 158, author: "Gilles Rousseau", rating: 5, date: "2026-05-08", title: "Lightstick fantastique", content: "Le lightstick est fantastique ! Qualité vérifiée et vraiment lumineux. Parfait pour les fans !", verified: true, helpful: 51 },
    { id: 159, author: "Muriel Petit", rating: 5, date: "2026-05-07", title: "Lightstick parfait", content: "Le lightstick est parfait ! Durable et vraiment éclatant. Qualité premium. Je l'adore !", verified: true, helpful: 48 },
    { id: 160, author: "Wolfgang Mercier", rating: 5, date: "2026-05-06", title: "Lightstick extraordinaire", content: "Le lightstick est extraordinaire ! Qualité premium et effets lumineux magnifiques. Superbe !", verified: true, helpful: 56 }
  ],
  'Posters & Stickers': [
    { id: 161, author: "Marcy Blanc", rating: 5, date: "2026-05-20", title: "Poster magnifique", content: "Le poster est magnifique ! Les couleurs sont éclatantes et l'image est claire. Vraiment adoré !", verified: true, helpful: 30 },
    { id: 162, author: "Armand Brun", rating: 5, date: "2026-05-19", title: "Poster de qualité", content: "Le poster est de qualité ! L'impression est impeccable et les couleurs sont vives. Excellent !", verified: true, helpful: 35 },
    { id: 163, author: "Valérie Martin", rating: 4, date: "2026-05-18", title: "Poster sympa", content: "Le poster est sympa et bien imprimé. Bonne qualité. Le papier est un peu fin.", verified: true, helpful: 23 },
    { id: 164, author: "Léon Leclerc", rating: 5, date: "2026-05-17", title: "Poster impressionnant", content: "Le poster est impressionnant ! Qualité vérifiée et image superbe. Vraiment excellent !", verified: true, helpful: 41 },
    { id: 165, author: "Bernadette Dubois", rating: 5, date: "2026-05-16", title: "Poster de collection", content: "Le poster est une belle pièce de collection ! Qualité premium et image magnifique. Adoré !", verified: true, helpful: 39 },
    { id: 166, author: "Fabrice Fontaine", rating: 5, date: "2026-05-15", title: "Poster parfait", content: "Le poster est parfait ! Impression nette et couleurs éclatantes. Magnifique pour la chambre !", verified: true, helpful: 36 },
    { id: 167, author: "Justine Leroy", rating: 4, date: "2026-05-14", title: "Poster correct", content: "Le poster est correct. Bonne impression et qualité convenable. Rien de spécial.", verified: true, helpful: 20 },
    { id: 168, author: "Henri Rousseau", rating: 5, date: "2026-05-13", title: "Poster de rêve", content: "Le poster est de rêve ! Qualité exceptionnelle et image superbe. Vraiment excellent !", verified: true, helpful: 49 },
    { id: 169, author: "Rosette Petit", rating: 5, date: "2026-05-12", title: "Poster magnifique et durable", content: "Le poster est magnifique et durable ! Qualité premium et impression impeccable. J'adore !", verified: true, helpful: 47 },
    { id: 170, author: "Dimitri Mercier", rating: 5, date: "2026-05-11", title: "Poster extraordinaire", content: "Le poster est extraordinaire ! Qualité vérifiée et image lumineuse. Vraiment superbe !", verified: true, helpful: 53 }
  ],
  'Box & Cosplay': [
    { id: 171, author: "Sofia Blanc", rating: 5, date: "2026-05-25", title: "Box/Costume fantastique", content: "La box/le costume est fantastique ! Tous les détails sont présents et c'est de qualité premium. Adoré !", verified: true, helpful: 33 },
    { id: 172, author: "Raphaële Brun", rating: 5, date: "2026-05-24", title: "Costume de qualité", content: "Le costume est de qualité ! Les détails sont parfaits et il est très confortable. Excellent cosplay !", verified: true, helpful: 40 },
    { id: 173, author: "Simona Martin", rating: 4, date: "2026-05-23", title: "Box/Costume sympa", content: "La box/le costume est sympa et bien conçu. Bonne qualité. Le tissu pourrait être meilleur.", verified: true, helpful: 24 },
    { id: 174, author: "Ludovic Leclerc", rating: 5, date: "2026-05-22", title: "Costume impressionnant", content: "Le costume est impressionnant ! Les couleurs sont exactes et la qualité est premium. Vraiment excellent !", verified: true, helpful: 45 },
    { id: 175, author: "Bibiane Dubois", rating: 5, date: "2026-05-21", title: "Box/Costume spectaculaire", content: "La box/le costume est spectaculaire ! Tous les éléments sont inclus et la qualité est impeccable !", verified: true, helpful: 43 },
    { id: 176, author: "Fabrice Fontaine", rating: 5, date: "2026-05-20", title: "Costume de rêve", content: "Le costume est de rêve ! Détails minutieux et qualité exceptionnelle. Parfait pour le cosplay !", verified: true, helpful: 38 },
    { id: 177, author: "Juliette Leroy", rating: 4, date: "2026-05-19", title: "Box/Costume correct", content: "La box/le costume est correct. Bonne qualité générale. Quelques détails pourraient être améliorés.", verified: true, helpful: 21 },
    { id: 178, author: "Simona Martin", rating: 5, date: "2026-05-18", title: "Costume fantastique", content: "Le costume est fantastique ! Qualité vérifiée et vraiment impressionnant. Parfait cosplay !", verified: true, helpful: 52 },
    { id: 179, author: "Muriel Petit", rating: 5, date: "2026-05-17", title: "Box/Costume parfait", content: "La box/le costume est parfait ! Tous les détails sont là et la qualité est premium. Magnifique !", verified: true, helpful: 50 },
    { id: 180, author: "Wolfgang Mercier", rating: 5, date: "2026-05-16", title: "Costume extraordinaire", content: "Le costume est extraordinaire ! Qualité premium et détails impeccables. Vraiment superbe cosplay !", verified: true, helpful: 57 }
  ]
};

// Fonction pour obtenir les reviews par catégorie
export const getReviewsByCategory = (categoryName) => {
  return reviewsByCategory[categoryName] || [];
};

// Fonction pour obtenir les reviews aléatoires d'une catégorie
export const getRandomReviewsByCategory = (categoryName, count = 4) => {
  const reviews = getReviewsByCategory(categoryName);
  const shuffled = [...reviews].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, reviews.length));
};

export default reviewsByCategory;
