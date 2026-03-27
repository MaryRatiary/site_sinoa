import { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageCircle, ChevronRight } from "lucide-react";
import { getRandomReviews } from "../data/reviews";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setReviews(getRandomReviews(5));
  }, []);

  const handleLoadMoreReviews = () => {
    setReviews(getRandomReviews(5));
  };

  return (
    <div className="w-full">
      
      {/* HEADER */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            Avis Clients
          </h2>

          <button
            onClick={handleLoadMoreReviews}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-[#5E2251] hover:bg-[#f5f0f2] rounded-lg transition-colors font-medium text-sm"
          >
            <span className="hidden sm:inline">Charger plus</span>
            <span className="sm:hidden">Plus</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* SCROLL REVIEWS */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 sm:gap-4 px-4 sm:px-6 min-w-min">

          {reviews.map((review) => (
            <div
              key={review.id}
              className="
                w-[260px] 
                sm:w-[300px] 
                md:w-[320px]
                flex-shrink-0 
                bg-white 
                rounded-xl 
                border border-gray-200 
                p-4 sm:p-5 
                hover:shadow-lg 
                transition-all duration-300
              "
            >
              
              {/* HEADER */}
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#5E2251]"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                      {review.author}
                    </h3>

                    {review.verified && (
                      <span className="text-[9px] sm:text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full font-medium">
                        ✓
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] sm:text-[11px] text-gray-500">
                    {new Date(review.date).toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>

              {/* RATING */}
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              {/* TITLE */}
              <h4 className="font-bold text-gray-900 mb-2 text-xs sm:text-sm line-clamp-2">
                {review.title}
              </h4>

              {/* CONTENT */}
              <p className="text-gray-600 text-[11px] sm:text-xs leading-relaxed mb-3 line-clamp-3">
                {review.content}
              </p>

              {/* FOOTER */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                <button className="flex items-center gap-1 text-gray-600 hover:text-[#5E2251] text-[11px] group">
                  <ThumbsUp size={13} className="group-hover:fill-[#5E2251]" />
                  <span>{review.helpful}</span>
                </button>

                <button className="flex items-center gap-1 text-gray-600 hover:text-[#5E2251] text-[11px] group">
                  <MessageCircle size={13} className="group-hover:stroke-[#5E2251]" />
                  <span>Répondre</span>
                </button>
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* CTA */}
      <div className="w-full mt-10 px-4 sm:px-6">
        <div className="
          bg-gradient-to-r from-[#5E2251] to-[#8B3A62] 
          rounded-xl 
          p-5 sm:p-6 
          text-white 
          flex flex-col sm:flex-row 
          items-start sm:items-center 
          justify-between 
          gap-4
        ">
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-1">
              Partagez votre expérience
            </h3>
            <p className="text-xs sm:text-sm text-gray-100">
              Vos avis aident les autres clients
            </p>
          </div>

          <button className="
            w-full sm:w-auto
            px-5 py-2 
            bg-white 
            text-[#5E2251] 
            font-bold 
            rounded-lg 
            hover:bg-gray-100 
            transition-colors 
            text-sm
          ">
            Écrire un avis
          </button>
        </div>
      </div>

    </div>
  );
}