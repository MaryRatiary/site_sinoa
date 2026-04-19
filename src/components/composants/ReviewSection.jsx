import { Star, MessageCircle, ThumbsUp, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ReviewSection({ category_id }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [category_id]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Appel API pour récupérer les avis de la catégorie
      const response = await fetch(`${API_BASE_URL}/reviews/category/${category_id}`);
      
      // Vérifier si la réponse est OK et si c'est du JSON
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setReviews(data.reviews || []);
          setAvgRating(data.avgRating || 0);
        } else {
          console.log('Pas de réponse JSON pour les avis');
          setReviews([]);
        }
      } else {
        // Si erreur API, ne pas afficher d'erreur - juste vider les avis
        console.log('Endpoint avis non disponible:', response.status);
        setReviews([]);
      }
    } catch (error) {
      console.log('Pas d\'avis disponibles pour cette catégorie');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  // Ne pas afficher la section si pas d'avis
  if (reviews.length === 0) {
    return null;
  }

  const totalReviews = reviews.length;

  return (
    <div className="w-full bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-[#5E2251]"></div>
            <div className="flex items-center gap-2">
              <MessageCircle className="text-[#5E2251]" size={28} />
              <h2 className="text-4xl font-black text-gray-900">Avis Clients</h2>
            </div>
          </div>

          {/* Rating Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Average Rating */}
            <div className="bg-gradient-to-br from-[#5E2251] to-purple-900 rounded-xl p-8 text-white shadow-lg">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold">{avgRating.toFixed(1)}</div>
                <div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < Math.floor(avgRating) ? "fill-yellow-300 text-yellow-300" : "text-gray-400"}
                      />
                    ))}
                  </div>
                  <p className="text-sm mt-2 text-purple-100">{totalReviews} avis</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter(r => r.rating === stars).length;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      {[...Array(stars)].map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#5E2251] h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 flex flex-col justify-center">
              <p className="text-sm font-semibold text-blue-900 mb-4">Partagez votre avis !</p>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold">
                ✏️ Écrire un avis
              </button>
              <p className="text-xs text-blue-800 mt-3 text-center">
                Aidez les autres clients à trouver le produit idéal
              </p>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-[#5E2251] to-purple-900 rounded-full flex items-center justify-center text-white font-bold">
                    {review.author?.charAt(0) || 'A'}
                  </div>
                  
                  {/* Author Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{review.author || 'Client'}</h4>
                      {review.verified && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                          ✓ Achat vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{new Date(review.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                {review.title && <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>}
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>

              {/* Review Footer */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 text-gray-600 hover:text-[#5E2251] transition-colors text-sm font-medium group">
                  <ThumbsUp size={16} className="group-hover:fill-[#5E2251]" />
                  Utile ({review.helpful || 0})
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors text-sm font-medium group">
                  <Heart size={16} className="group-hover:fill-red-500" />
                  J'aime ({review.likes || 0})
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-[#5E2251] text-[#5E2251] rounded-lg hover:bg-[#5E2251] hover:text-white transition-all font-semibold">
            Voir plus d'avis
          </button>
        </div>
      </div>
    </div>
  );
}
