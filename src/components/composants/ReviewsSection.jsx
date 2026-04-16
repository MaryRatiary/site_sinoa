import { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageCircle, ChevronRight, X } from "lucide-react";
import { getRandomReviews } from "../../data/reviews";

export default function comReviewsSection() {
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [itemsPerPage] = useState(4);

  useEffect(() => {
    const reviews = getRandomReviews(20);
    setAllReviews(reviews);
    setDisplayedReviews(reviews.slice(0, itemsPerPage));
  }, []);

  const handleLoadMoreReviews = () => {
    const newReviews = getRandomReviews(20);
    setAllReviews(newReviews);
    setDisplayedReviews(newReviews.slice(0, itemsPerPage));
  };

  const handleLoadNext = () => {
    const nextIndex = displayedReviews.length + itemsPerPage;
    setDisplayedReviews(allReviews.slice(0, nextIndex));
  };

  return (
    <div className="w-full">
      
      {/* HEADER */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900">
            Avis Clients
          </h2>

          <button
            onClick={handleLoadMoreReviews}
            className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-white bg-[#5E2251] hover:bg-[#7a2d64] rounded-lg transition-colors font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg"
          >
            <span className="hidden sm:inline">Charger plus</span>
            <span className="sm:hidden">Plus</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* REVIEWS GRID - 2 COLUMNS RESPONSIVE */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          {displayedReviews.map((review) => (
            <button
              key={review.id}
              onClick={() => setSelectedReview(review)}
              className="
                text-left
                bg-white 
                rounded-lg sm:rounded-xl
                border border-gray-200 
                overflow-hidden
                hover:shadow-md sm:hover:shadow-lg
                transition-all duration-300
                transform hover:scale-[1.01] sm:hover:scale-[1.02]
              "
            >
              
              {/* HEADER WITH AVATAR */}
              <div className="p-3 sm:p-4 border-b border-gray-100">
                <div className="flex items-start gap-2.5 sm:gap-3 mb-2">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-[#5E2251] flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                        {review.author}
                      </h3>

                      {review.verified && (
                        <span className="text-[10px] sm:text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">
                          ✓
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString("fr-FR", {
                        month: "short",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                {/* RATING */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-3 sm:p-4">
                {/* TITLE */}
                <h4 className="font-bold text-gray-900 mb-1.5 text-xs sm:text-sm line-clamp-2">
                  {review.title}
                </h4>

                {/* TEXT */}
                <p className="text-gray-600 text-[10px] sm:text-xs leading-relaxed mb-2.5 line-clamp-2">
                  {review.content}
                </p>

                {/* PRODUCT IMAGE */}
                {review.productImage && (
                  <div className="mb-2.5 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={review.productImage}
                      alt="Produit reçu"
                      className="w-full h-24 sm:h-32 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* FOOTER ACTIONS */}
                <div className="flex items-center gap-2 sm:gap-3 pt-2 border-t border-gray-100">
                  <button className="flex items-center gap-0.5 sm:gap-1 text-gray-600 hover:text-[#5E2251] text-[9px] sm:text-xs group transition-colors">
                    <ThumbsUp size={11} className="group-hover:fill-[#5E2251]" />
                    <span className="font-medium">{review.helpful}</span>
                  </button>

                  <button className="flex items-center gap-0.5 sm:gap-1 text-gray-600 hover:text-[#5E2251] text-[9px] sm:text-xs group transition-colors">
                    <MessageCircle size={11} className="group-hover:stroke-[#5E2251]" />
                    <span className="font-medium hidden sm:inline">Répondre</span>
                  </button>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* LOAD MORE BUTTON */}
        {displayedReviews.length < allReviews.length && (
          <div className="flex justify-center mt-5 sm:mt-8">
            <button
              onClick={handleLoadNext}
              className="
                px-6 sm:px-8 py-2 sm:py-3
                bg-[#5E2251]
                text-white
                font-bold
                rounded-lg
                hover:bg-[#7a2d64]
                transition-colors
                text-xs sm:text-base
                shadow-md hover:shadow-lg
              "
            >
              Voir plus d'avis
            </button>
          </div>
        )}
      </div>

      {/* CTA SECTION */}
      <div className="w-full mt-8 sm:mt-12 px-3 sm:px-4">
        <div className="
          max-w-7xl mx-auto
          bg-gradient-to-r from-[#5E2251] to-[#8B3A62] 
          rounded-lg sm:rounded-xl
          p-4 sm:p-6 md:p-8
          text-white 
          flex flex-col sm:flex-row 
          items-start sm:items-center 
          justify-between 
          gap-3 sm:gap-5
        ">
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">
              Partagez votre expérience
            </h3>
            <p className="text-xs sm:text-sm text-gray-100">
              Vos avis aident les autres clients à faire leur choix
            </p>
          </div>

          <button className="
            w-full sm:w-auto
            px-4 sm:px-6 py-2 sm:py-3
            bg-white 
            text-[#5E2251] 
            font-bold 
            rounded-lg 
            hover:bg-gray-100 
            transition-colors 
            text-xs sm:text-base
            shadow-md hover:shadow-lg
            flex-shrink-0
          ">
            Écrire un avis
          </button>
        </div>
      </div>

      {/* MODAL POPUP - RESPONSIVE */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="
            bg-white 
            rounded-lg sm:rounded-2xl
            max-w-2xl w-full 
            max-h-[85vh] sm:max-h-[90vh]
            overflow-y-auto
            shadow-2xl
          ">
            
            {/* MODAL HEADER */}
            <div className="sticky top-0 bg-gradient-to-r from-[#5E2251] to-[#8B3A62] text-white p-4 sm:p-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold">Avis détaillé</h2>
              <button
                onClick={() => setSelectedReview(null)}
                className="
                  p-1.5 sm:p-2
                  hover:bg-white/20 
                  rounded-lg 
                  transition-colors
                "
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-4 sm:p-6 md:p-8">
              
              {/* AUTHOR INFO */}
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                <img
                  src={selectedReview.avatar}
                  alt={selectedReview.author}
                  className="w-10 sm:w-14 h-10 sm:h-14 rounded-full border-3 border-[#5E2251] flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <h3 className="font-bold text-base sm:text-lg text-gray-900">
                      {selectedReview.author}
                    </h3>
                    {selectedReview.verified && (
                      <span className="text-xs sm:text-sm bg-green-100 text-green-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold">
                        ✓ Vérifié
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {new Date(selectedReview.date).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>

              {/* RATING */}
              <div className="flex gap-1 mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < selectedReview.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              {/* TITLE AND CONTENT */}
              <h4 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">
                {selectedReview.title}
              </h4>
              <p className="text-gray-700 leading-relaxed mb-4 sm:mb-8 text-sm sm:text-base">
                {selectedReview.content}
              </p>

              {/* PRODUCT IMAGE - LARGE */}
              {selectedReview.productImage && (
                <div className="mb-6 sm:mb-8">
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    Produit reçu
                  </p>
                  <img
                    src={selectedReview.productImage}
                    alt="Produit reçu"
                    className="w-full h-48 sm:h-96 object-cover rounded-lg sm:rounded-xl border-2 border-[#5E2251]"
                  />
                </div>
              )}

              {/* MODAL FOOTER */}
              <div className="border-t border-gray-200 pt-4 sm:pt-6 flex items-center gap-4 sm:gap-6">
                <button className="flex items-center gap-1.5 sm:gap-2 text-gray-700 hover:text-[#5E2251] font-semibold transition-colors text-xs sm:text-base">
                  <ThumbsUp size={16} />
                  <span className="hidden sm:inline">{selectedReview.helpful} utiles</span>
                  <span className="sm:hidden">{selectedReview.helpful}</span>
                </button>

                <button className="flex items-center gap-1.5 sm:gap-2 text-gray-700 hover:text-[#5E2251] font-semibold transition-colors text-xs sm:text-base">
                  <MessageCircle size={16} />
                  <span className="hidden sm:inline">Répondre</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
