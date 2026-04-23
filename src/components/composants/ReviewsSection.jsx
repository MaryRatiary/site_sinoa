import { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageCircle, ChevronRight, X } from "lucide-react";
import { ReviewFormModal } from "./ReviewFormModal";
import { reviewsAPI } from "../../services/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const anonymizeName = (name) => {
  if (!name || name.length === 0) return 'A***y';
  const firstLetter = name.charAt(0).toUpperCase();
  const lastLetter = name.charAt(name.length - 1).toUpperCase();
  const asterisks = '*'.repeat(Math.max(1, name.length - 2));
  return `${firstLetter}${asterisks}${lastLetter}`;
};



// 📊 Composant Jauge d'étoiles COMPACT
const RatingGauge = ({ reviews, averageRating }) => {
  const totalReviews = reviews.length;
  
  // Compter les avis par nombre d'étoiles
  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 mb-3 sm:mb-4">
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[100px] sm:h-[100px] flex items-center">
        
        {/* LEFT - Moyenne */}
        <div className="flex-shrink-0 px-3 sm:px-4 py-2 sm:py-3 border-r border-gray-100 flex flex-col items-center justify-center h-full min-w-[80px] sm:min-w-[100px] bg-gradient-to-br from-yellow-50 to-white">
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <p className="text-[8px] font-medium text-gray-500 mt-1">
            {totalReviews}
          </p>
        </div>

        {/* RIGHT - Distribution compacte */}
        <div className="flex-1 px-3 sm:px-4 py-2 sm:py-3 h-full flex flex-col justify-center space-y-1.5">
          {[5, 4, 3].map((stars) => {
            const count = ratingCounts[stars];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            return (
              <div key={stars} className="flex items-center gap-2">
                {/* Label */}
                <div className="flex items-center gap-0.5 w-10 sm:w-12 flex-shrink-0">
                  <span className="text-[8px] sm:text-[9px] font-semibold text-gray-700">{stars}</span>
                  <Star size={9} className="fill-yellow-400 text-yellow-400" />
                </div>

                {/* Bar */}
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Count */}
                <div className="text-[8px] sm:text-[9px] font-semibold text-gray-600 w-5 sm:w-6 text-right flex-shrink-0">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function ReviewsSection({ product_id, category_name }) {
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [allReviews, setAllReviews] = useState([]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsAPI.getCategoryReviews(category_name, 50, 0);
      setAllReviews(data.reviews || []);
      setDisplayedReviews(data.reviews || []);
      setAverageRating(data.average || 0);
    } catch (err) {
      console.error('Erreur chargement avis dynamiques:', err);
      // Fallback
      setAllReviews([]);
      setDisplayedReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category_name) loadReviews();
  }, [category_name]);

  const handleReviewSuccess = () => {
    loadReviews(); // Recharger les avis depuis l'API !
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      const res = await reviewsAPI.markHelpful(reviewId);
      
      const updatedDisplayedReviews = displayedReviews.map(r =>
        r.id === reviewId ? { ...r, helpful: res.helpful } : r
      );
      
      setDisplayedReviews(updatedDisplayedReviews);
      
      if (selectedReview?.id === reviewId) {
        setSelectedReview({ ...selectedReview, helpful: res.helpful });
      }
    } catch(err) {
      console.error(err);
    }
  };



  if (loading && allReviews.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-12 text-center">
        <p className="text-gray-500">Chargement des avis...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      
      {/* HEADER */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 mb-2">
              Avis Clients
            </h2>
          </div>

          <button
            onClick={() => setShowFormModal(true)}
            className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-white bg-[#5E2251] hover:bg-[#7a2d64] rounded-lg transition-colors font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg"
          >
            <span className="hidden sm:inline">Écrire un avis</span>
            <span className="sm:hidden">Avis</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 📊 JAUGE D'ÉTOILES */}
      {allReviews.length > 0 && (
        <RatingGauge reviews={allReviews} averageRating={averageRating} />
      )}

      {/* REVIEWS LIST - HAUTEUR RÉDUITE */}
      {allReviews.length > 0 ? (
        <>
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 mb-6 sm:mb-8 reviews-container">
            <div className="space-y-2 sm:space-y-3">
              {displayedReviews.map((review) => (
                <button
                  key={review.id}
                  onClick={() => setSelectedReview(review)}
                  className="
                    w-full text-left
                    bg-white 
                    rounded-lg sm:rounded-xl
                    border border-gray-200 
                    overflow-hidden
                    hover:shadow-md sm:hover:shadow-lg
                    transition-all duration-300
                    transform hover:scale-[1.005]
                    h-[100px]
                    flex
                  "
                >
                  
                  {/* IMAGES LEFT SIDE - 1/4 width */}
                  <div className="w-1/4 flex-shrink-0 border-r border-gray-100 overflow-hidden">
                    {review.images && review.images.length > 0 ? (
                      <img
                        src={review.images[0]?.image_url || review.images[0]}
                        alt="Photo"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100?text=Photo';
                        }}
                      />
                    ) : review.productImage ? (
                      <img
                        src={review.productImage}
                        alt="Produit"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100?text=Photo';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-[9px] text-gray-500">Pas photo</span>
                      </div>
                    )}
                  </div>

                  {/* CONTENT RIGHT SIDE - 3/4 width */}
                  <div className="flex-1 p-2 sm:p-2.5 flex flex-col justify-between">
                    
                    {/* TOP - AUTHOR & RATING */}
                    <div>
                      <div className="flex items-start gap-1.5 mb-1">
                        <div className="w-5 h-5 rounded-full border-2 border-[#5E2251] bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-[8px] flex-shrink-0">
                          {review.author?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-[10px] truncate">
                            {anonymizeName(review.author)}
                          </h3>
                        </div>
                      </div>
                      
                      {/* RATING STARS */}
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={9}
                            className={
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* MIDDLE - TITLE & CONTENT */}
                    <div className="flex-1 min-w-0 mb-1">
                      <h4 className="font-bold text-gray-900 text-[10px] line-clamp-1 mb-0.5">
                        {review.title}
                      </h4>
                      <p className="text-gray-600 text-[8px] line-clamp-1 leading-tight">
                        {review.content}
                      </p>
                    </div>

                    {/* BOTTOM - ACTIONS */}
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkHelpful(review.id);
                        }}
                        className="flex items-center gap-0.5 text-gray-600 hover:text-[#5E2251] text-[8px] group transition-colors"
                      >
                        <ThumbsUp size={9} className="group-hover:fill-[#5E2251]" />
                        <span className="font-medium">{review.helpful || 0}</span>
                      </button>

                      {review.verified && (
                        <span className="text-[7px] bg-green-100 text-green-800 px-1 py-0.5 rounded font-semibold">
                          ✓ Vérifié
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>


          </div>
        </>
      ) : (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">Aucun avis pour le moment</p>
            <button
              onClick={() => setShowFormModal(true)}
              className="px-4 py-2 bg-[#5E2251] text-white rounded-lg hover:bg-[#7a2d64] transition-colors font-semibold"
            >
              Soyez le premier à donner votre avis!
            </button>
          </div>
        </div>
      )}

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

          <button 
            onClick={() => setShowFormModal(true)}
            className="
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

      {/* MODAL POPUP - REVIEW DETAILS */}
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
                <div className="w-10 sm:w-14 h-10 sm:h-14 rounded-full border-3 border-[#5E2251] bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {selectedReview.author?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
                    <h3 className="font-bold text-base sm:text-lg text-gray-900">
                      {anonymizeName(selectedReview.author)}
                    </h3>
                    {selectedReview.verified && (
                      <span className="text-xs sm:text-sm bg-green-100 text-green-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold">
                        ✓ Vérifié
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">{selectedReview.date}</p>
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
              <p className="text-gray-700 leading-relaxed mb-4 sm:mb-8 text-[10px] sm:text-base whitespace-pre-wrap">
                {selectedReview.content}
              </p>

              {/* PRODUCT IMAGES - GALLERY - FIXED */}
              {selectedReview.productImage ? (
                <div className="mb-6 sm:mb-8">
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    📸 Photo du produit
                  </p>
                  <div className="flex justify-center">
                    <img
                      src={selectedReview.productImage}
                      alt="Photo du produit"
                      className="max-w-full h-auto max-h-96 object-cover rounded-lg border-2 border-[#5E2251] shadow-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400?text=Photo+Produit';
                      }}
                    />
                  </div>
                </div>
              ) : selectedReview.images && selectedReview.images.length > 0 ? (
                <div className="mb-6 sm:mb-8">
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    Photos du produit ({selectedReview.images.length})
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedReview.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.image_url || img}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg border-2 border-[#5E2251]"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200?text=Photo';
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {/* MODAL FOOTER */}
              <div className="border-t border-gray-200 pt-4 sm:pt-6 flex items-center gap-4 sm:gap-6">
                <button 
                  onClick={() => handleMarkHelpful(selectedReview.id)}
                  className="flex items-center gap-1.5 sm:gap-2 text-gray-700 hover:text-[#5E2251] font-semibold transition-colors text-xs sm:text-base group"
                >
                  <ThumbsUp size={16} className="group-hover:fill-[#5E2251]" />
                  <span className="hidden sm:inline">{selectedReview.helpful || 0} utiles</span>
                  <span className="sm:hidden">{selectedReview.helpful || 0}</span>
                </button>

                <button className="flex items-center gap-1.5 sm:gap-2 text-gray-700 hover:text-[#5E2251] font-semibold transition-colors text-xs sm:text-base group">
                  <MessageCircle size={16} className="group-hover:fill-[#5E2251]" />
                  <span className="hidden sm:inline">Répondre</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL */}
      {showFormModal && (
        <ReviewFormModal
          product_id={product_id}
          category_name={category_name}
          onClose={() => setShowFormModal(false)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}
