import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Trash2, CheckCircle } from 'lucide-react';
import { categoriesAPI } from '../services/api';

/**
 * ✅ MODALE DE SUPPRESSION SÉCURISÉE POUR LES CATÉGORIES
 * - Récupère les données à supprimer avant de demander la confirmation
 * - Affiche un message clair avec le nombre de produits et sous-catégories
 * - Exige le texte exact "Je veux effacer tout" en italique
 * - Les catégories vides peuvent être supprimées immédiatement
 */
const CategoryDeleteModal = ({ category_id, category_name, isOpen, onClose, onConfirm }) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteCheckData, setDeleteCheckData] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('loading'); // 'loading', 'confirm', 'success', 'error'

  useEffect(() => {
    if (isOpen && category_id) {
      fetchDeleteCheckData();
    }
  }, [isOpen, category_id]);

  const fetchDeleteCheckData = async () => {
    try {
      setStep('loading');
      setError(null);
      // ✅ MODIFIÉ: Utiliser categoriesAPI.preDeleteCheck au lieu de fetch direct
      const data = await categoriesAPI.preDeleteCheck(category_id);
      setDeleteCheckData(data);
      setStep('confirm');
    } catch (err) {
      setError(err.message);
      setStep('error');
    }
  };

  const handleConfirmDelete = async () => {
    // Vérifier la confirmation du texte
    if (deleteCheckData?.isDangerous && confirmationText !== 'Je veux effacer tout') {
      setError('❌ Vous devez taper exactement: "Je veux effacer tout"');
      return;
    }

    setIsLoading(true);
    try {
      // ✅ MODIFIÉ: Utiliser categoriesAPI.delete avec confirmationText
      await categoriesAPI.delete(category_id, confirmationText || undefined);

      setStep('success');
      setTimeout(() => {
        onConfirm?.();
        onClose?.();
      }, 2000);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        
        {/* Contenu dynamique selon l'étape */}
        {step === 'loading' && (
          <div className="p-6 flex flex-col items-center gap-4">
            <div className="animate-spin">
              <AlertTriangle className="w-12 h-12 text-orange-500" />
            </div>
            <p className="text-gray-600">Vérification des données...</p>
          </div>
        )}

        {step === 'error' && (
          <div className="p-6 flex flex-col items-center gap-4">
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <p className="text-red-600 font-semibold">Erreur</p>
            <p className="text-gray-600 text-center text-sm">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
              Fermer
            </button>
          </div>
        )}

        {step === 'confirm' && deleteCheckData && (
          <>
            {/* En-tête */}
            <div className={`p-6 ${deleteCheckData.isDangerous ? 'bg-red-50' : 'bg-green-50'} border-b flex justify-between items-start`}>
              <div className="flex gap-3">
                <AlertTriangle className={`w-6 h-6 ${deleteCheckData.isDangerous ? 'text-red-600' : 'text-green-600'} flex-shrink-0 mt-1`} />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Supprimer la catégorie</h2>
                  <p className="text-gray-600 text-sm mt-1">{deleteCheckData.category.name}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-4">
              
              {/* Message d'avertissement */}
              {deleteCheckData.isDangerous && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-900 font-semibold text-sm">⚠️ ATTENTION - Action irréversible</p>
                  <p className="text-red-800 text-sm mt-2">
                    Cette catégorie contient:
                  </p>
                  <ul className="text-red-800 text-sm mt-2 space-y-1 ml-4">
                    {deleteCheckData.summary.totalProducts > 0 && (
                      <li>📦 <strong>{deleteCheckData.summary.totalProducts}</strong> produit(s)</li>
                    )}
                    {deleteCheckData.summary.directChildCategories > 0 && (
                      <li>📁 <strong>{deleteCheckData.summary.directChildCategories}</strong> sous-catégorie(s)</li>
                    )}
                  </ul>
                  <p className="text-red-900 font-semibold text-sm mt-4 mb-3">
                    Tout sera SUPPRIMÉ définitivement.
                  </p>
                </div>
              )}

              {/* Message OK pour catégories vides */}
              {!deleteCheckData.isDangerous && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 font-semibold text-sm">✅ Catégorie vide</p>
                  <p className="text-green-800 text-sm mt-2">
                    Cette catégorie ne contient aucun produit ou sous-catégorie et peut être supprimée immédiatement.
                  </p>
                </div>
              )}

              {/* Champ de confirmation pour catégories dangereuses */}
              {deleteCheckData.isDangerous && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Confirmez en tapant le texte suivant:
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg border-2 border-gray-200">
                    <p className="text-gray-600 italic text-sm">Je veux effacer tout</p>
                  </div>
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => {
                      setConfirmationText(e.target.value);
                      setError(null);
                    }}
                    placeholder="Tapez le texte ici..."
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                  />
                  {error && (
                    <p className="text-red-600 text-sm">{error}</p>
                  )}
                  {confirmationText === 'Je veux effacer tout' && (
                    <p className="text-green-600 text-sm flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Confirmation validée
                    </p>
                  )}
                </div>
              )}

              {/* Affichage détaillé des données */}
              {deleteCheckData.data.allProductsCount > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    📦 Produits à supprimer ({deleteCheckData.data.allProductsCount}):
                  </p>
                  <div className="space-y-2">
                    {Object.entries(deleteCheckData.data.productsByCategory).map(([catId, catData]) => (
                      <div key={catId} className="text-xs">
                        <p className="font-semibold text-gray-700">{catData.category_name}</p>
                        <ul className="ml-3 space-y-1">
                          {catData.products.slice(0, 3).map(product => (
                            <li key={product.id} className="text-gray-600">
                              • {product.name}
                            </li>
                          ))}
                          {catData.products.length > 3 && (
                            <li className="text-gray-500 italic">
                              ... et {catData.products.length - 3} autres
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={
                  isLoading || 
                  (deleteCheckData.isDangerous && confirmationText !== 'Je veux effacer tout')
                }
                className={`flex-1 px-4 py-2 font-semibold rounded-lg transition flex items-center justify-center gap-2 ${
                  deleteCheckData.isDangerous
                    ? (confirmationText === 'Je veux effacer tout'
                      ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                      : 'bg-red-300 text-gray-700 cursor-not-allowed')
                    : 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer'
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    {deleteCheckData.isDangerous ? 'Supprimer définitivement' : 'Supprimer'}
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {step === 'success' && (
          <div className="p-6 flex flex-col items-center gap-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <p className="text-green-600 font-semibold">Suppression réussie!</p>
            <p className="text-gray-600 text-center text-sm">
              La catégorie "{deleteCheckData.category.name}" a été supprimée avec succès.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDeleteModal;
