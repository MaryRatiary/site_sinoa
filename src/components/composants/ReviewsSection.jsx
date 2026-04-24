import { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageCircle, ChevronRight, X } from "lucide-react";
import { ReviewFormModal } from "./ReviewFormModal";
import { reviewsAPI } from "../../services/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const isRecent = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMinutes = (now - date) / (1000 * 60);
  return diffInMinutes < 15;
};



// 📊 Composant Jauge d'étoiles COMPACT
// 📊 Composant Jauge d'étoiles PREMIUM
const RatingGauge = ({ reviews, averageRating }) => {
  const totalReviews = reviews.length;
  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 mb-8">
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl shadow-purple-900/5 overflow-hidden flex flex-col sm:flex-row items-stretch">
        <div className="flex-shrink-0 px-10 py-8 sm:py-12 border-b sm:border-b-0 sm:border-r border-gray-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#5E2251]/5 to-transparent min-w-[200px]">
          <div className="text-6xl font-black text-gray-900 leading-none mb-4">{averageRating.toFixed(1)}</div>
          <div className="flex gap-1.5 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className={i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
            ))}
          </div>
          <div className="px-4 py-1.5 bg-purple-100 rounded-full">
            <p className="text-[11px] font-black text-[#5E2251] uppercase tracking-wider">{totalReviews} Avis Vérifiés</p>
          </div>
        </div>
        <div className="flex-1 px-8 py-8 sm:py-10 flex flex-col justify-center space-y-4">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingCounts[stars];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-4 group">
                <div className="flex items-center gap-1.5 w-12 flex-shrink-0">
                  <span className="text-xs font-black text-gray-600 group-hover:text-[#5E2251] transition-colors">{stars}</span>
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <div className="h-full bg-gradient-to-r from-[#5E2251] to-[#8B3A62] rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
                </div>
                <div className="text-xs font-bold text-gray-400 w-10 text-right tabular-nums">{count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function ReviewsSection({ product_id, category_name, slug }) {
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [allReviews, setAllReviews] = useState([]);

  const [newReviewId, setNewReviewId] = useState(null);

  const loadReviews = async (isManual = false) => {
    try {
      if (!isManual) setLoading(true);
      const data = await reviewsAPI.getProductReviews(product_id, 50, 0, slug || '');
      const reviews = data.reviews || [];
      setAllReviews(reviews);
      setDisplayedReviews(reviews);
      setAverageRating(data.average || 0);

      if (isManual && reviews.length > 0) {
        setNewReviewId(reviews[0].id);
        setTimeout(() => setNewReviewId(null), 10000);
      }
    } catch (err) {
      console.error('Erreur chargement avis dynamiques:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product_id) loadReviews();
  }, [product_id, slug]);

  const handleReviewSuccess = () => {
    loadReviews(true); 
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      const res = await reviewsAPI.markHelpful(reviewId);
      setDisplayedReviews(prev => prev.map(r => 
        r.id === reviewId ? { ...r, helpful: res.helpful } : r
      ));
    } catch (err) {
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

      {/* REVIEWS LIST */}
      {allReviews.length > 0 ? (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedReviews.map((review) => (
              <button
                key={review.id}
                onClick={() => setSelectedReview(review)}
                className={`
                  relative text-left bg-white rounded-3xl border transition-all duration-500 overflow-hidden group
                  ${newReviewId === review.id ? 'border-green-400 ring-4 ring-green-50 shadow-green-100 scale-[1.02] z-10' : 'border-gray-100 shadow-sm'}
                  hover:shadow-2xl hover:border-purple-200 hover:-translate-y-1
                  flex h-[160px] sm:h-[180px]
                `}
              >
                {/* NEW BADGE */}
                {(newReviewId === review.id || isRecent(review.createdat)) && (
                  <div className="absolute top-3 right-3 z-20 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-bounce">
                    NOUVEAU
                  </div>
                )}

                {/* IMAGE */}
                <div className="w-1/3 sm:w-1/4 flex-shrink-0 relative overflow-hidden bg-gray-50 border-r border-gray-100">
                  {review.images && review.images.length > 0 ? (
                    <img
                      src={review.images[0]?.imageUrl || review.images[0]?.image_url || (typeof review.images[0] === 'string' ? review.images[0] : '')}
                      alt="Review"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=K-Pop'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-white">
                      <MessageCircle size={24} className="text-purple-200 mb-2" />
                      <span className="text-[10px] text-purple-300 font-black uppercase text-center">Avis</span>
                    </div>
                  )}
                  {review.images?.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg font-bold">
                      +{review.images.length - 1} photos
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5E2251] to-[#8B3A62] flex items-center justify-center text-white font-black text-xs shadow-md">
                          {review.author?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-900 text-sm truncate max-w-[150px]">
                          {review.author}
                        </span>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                        ))}
                      </div>
                    </div>

                    <h4 className="font-black text-gray-900 text-base line-clamp-1 mb-2 group-hover:text-[#5E2251] transition-colors leading-tight">
                      {review.title}
                    </h4>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                      {review.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMarkHelpful(review.id); }}
                        className="flex items-center gap-1.5 text-gray-400 hover:text-[#5E2251] transition-all"
                      >
                        <ThumbsUp size={14} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold">{review.helpful || 0}</span>
                      </button>
                      {review.verified && (
                        <div className="flex items-center gap-1 text-green-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm animate-pulse"></div>
                          <span className="text-[10px] font-black uppercase tracking-tight">Vérifié</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-gray-300">
                      {new Date(review.createdat).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
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
                        src={img?.image_url || img?.imageUrl || (typeof img === 'string' ? img : '')}
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
