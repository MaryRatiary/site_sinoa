import { Star, User, ThumbsUp, MessageCircle } from 'lucide-react';

export default function CategoryReviews({ categoryName }) {
  // Données d'avis simulées (à remplacer par des données API)
  const reviews = [
    {
      id: 1,
      author: "Marie D.",
      rating: 5,
      title: "Excellent choix de produits !",
      content: "Vraiment satisfaite de ma commande. Les produits sont de très bonne qualité et l'emballage était très soigné.",
      helpful: 24,
      verified: true,
      date: "Il y a 2 semaines"
    },
    {
      id: 2,
      author: "Jean K.",
      rating: 5,
      title: "Service impeccable",
      content: "Livraison rapide et produits conformes à la description. Je recommande vivement cette boutique !",
      helpful: 18,
      verified: true,
      date: "Il y a 1 mois"
    },
    {
      id: 3,
      author: "Sophie L.",
      rating: 4,
      title: "Très bonne variété",
      content: "Une large sélection de produits {categoryName}. Seul bémol : un produit était légèrement endommagé à la réception.",
      helpful: 12,
      verified: true,
      date: "Il y a 3 semaines"
    },
    {
      id: 4,
      author: "Lucas R.",
      rating: 5,
      title: "Fan satisfait",
      content: "J'ai trouvé exactement ce que je cherchais. Les prix sont honnêtes et la qualité est au rendez-vous.",
      helpful: 8,
      verified: true,
      date: "Il y a 1 semaine"
    }
  ];

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const RatingBar = ({ rating, count, total }) => {
    const percentage = (count / total) * 100;
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 w-8">{rating} ⭐</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
      </div>
    );
  };

  return (
    <div className="w-full bg-white py-16 px-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Avis des clients</h2>
          <p className="text-gray-600">Découvrez les retours de nos clients satisfaits</p>
        </div>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 pb-12 border-b border-gray-200">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8">
            <div className="text-5xl font-black text-[#5E2251] mb-2">{averageRating}</div>
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <p className="text-sm text-gray-700 font-medium">{reviews.length} avis vérifiés</p>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2 space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <RatingBar
                key={rating}
                rating={rating}
                count={ratingDistribution[rating]}
                total={reviews.length}
              />
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Avis récents</h3>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{review.author}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
                {review.verified && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                    ✓ Achat vérifié
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>

              {/* Title and Content */}
              <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>

              {/* Helpful Button */}
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#5E2251] transition-colors py-2 px-3 rounded-lg hover:bg-purple-50">
                <ThumbsUp size={16} />
                Utile ({review.helpful})
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#5E2251] text-white rounded-lg hover:bg-[#6b2e62] transition-all font-semibold">
            <MessageCircle size={18} />
            Laisser un avis
          </button>
        </div>
      </div>
    </div>
  );
}
