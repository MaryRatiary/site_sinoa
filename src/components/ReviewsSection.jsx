import { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageCircle, ChevronRight } from "lucide-react";
import { getRandomReviews } from "../data/reviews";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Récupérer 5 avis aléatoires
    const randomReviews = getRandomReviews(5);
    setReviews(randomReviews);
  }, []);

  const handleLoadMoreReviews = () => {
    const randomReviews = getRandomReviews(5);
    setReviews(randomReviews);
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="min-w-full mx-auto px-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900">
            Avis Clients
          </h2>
          <button
            onClick={handleLoadMoreReviews}
            className="flex items-center gap-2 px-4 py-2 text-[#5E2251] hover:bg-[#f5f0f2] rounded-lg transition-colors font-medium"
          >
            <span>Charger plus</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Reviews */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 px-5 min-w-min">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="w-[320px] flex-shrink-0 bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300"
            >
              {/* Header with Avatar */}
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-10 h-10 rounded-full border-2 border-[#5E2251] flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{review.author}</h3>
                    {review.verified && (
                      <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {new Date(review.date).toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>

              {/* Title */}
              <h4 className="font-bold text-gray-900 mb-2 text-sm line-clamp-2">{review.title}</h4>

              {/* Content */}
              <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-3">
                {review.content}
              </p>

              {/* Footer with Helpful Counter */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                <button className="flex items-center gap-1 text-gray-600 hover:text-[#5E2251] transition-colors text-xs group">
                  <ThumbsUp size={13} className="group-hover:fill-[#5E2251]" />
                  <span className="text-[11px]">{review.helpful}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-[#5E2251] transition-colors text-xs group">
                  <MessageCircle size={13} className="group-hover:stroke-[#5E2251]" />
                  <span className="text-[11px]">Répondre</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review CTA - Compact */}
      <div className="w-full mt-8 px-4 py-10">
        <div className="bg-gradient-to-r from-[#5E2251] to-[#8B3A62] rounded-xl p-6 text-white flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold mb-1">Partagez votre expérience</h3>
            <p className="text-sm text-gray-100">
              Vos avis aident les autres clients
            </p>
          </div>
          <button className="px-6 py-2 bg-white text-[#5E2251] font-bold rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 text-sm">
            Écrire un avis
          </button>
        </div>
      </div>
    </div>
  );
}
