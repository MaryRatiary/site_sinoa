import React from 'react';
import { Clock, CheckCircle, AlertCircle, Edit3, DollarSign } from 'lucide-react';

export const OrderTimeline = ({ order }) => {
  // Créer une timeline basée sur les changements de statut
  const timelineEvents = [
    {
      type: 'created',
      label: 'Commande créée',
      date: order.createdat,
      status: 'completed',
      details: `Commande #{order.id} créée par le client`
    },
    {
      type: 'payment',
      label: 'Paiement',
      date: order.createdat,
      status: order.paymentstatus === 'paid' ? 'completed' : 'pending',
      details: `Statut: ${order.paymentstatus || 'unpaid'} - Méthode: ${order.paymentmethod}`
    },
    {
      type: 'status',
      label: 'Statut commande',
      date: order.updatedat || order.createdat,
      status: order.status === 'completed' ? 'completed' : order.status === 'processing' ? 'active' : 'pending',
      details: `Statut actuel: ${order.status}`
    },
    ...(order.trackingnumber ? [{
      type: 'tracking',
      label: 'Suivi expédition',
      date: order.updatedat || order.createdat,
      status: 'completed',
      details: `Numéro de suivi: ${order.trackingnumber}`
    }] : []),
    ...(order.status === 'completed' ? [{
      type: 'delivery',
      label: 'Livraison',
      date: order.updatedat || order.createdat,
      status: 'completed',
      details: 'Commande livrée avec succès'
    }] : [])
  ];

  const getEventIcon = (type) => {
    switch(type) {
      case 'created':
      case 'delivery':
        return <CheckCircle className="text-green-600" size={24} />;
      case 'payment':
        return <DollarSign className="text-blue-600" size={24} />;
      case 'tracking':
        return <AlertCircle className="text-purple-600" size={24} />;
      case 'status':
        return <Clock className="text-yellow-600" size={24} />;
      default:
        return <Edit3 className="text-gray-600" size={24} />;
    }
  };

  const getEventColor = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'active':
        return 'bg-yellow-50 border-yellow-200';
      case 'pending':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Clock className="text-[#5E2251]" size={20} />
        Historique de la Commande
      </h3>

      <div className="relative">
        {/* Ligne verticale */}
        <div className="absolute left-6 top-8 bottom-0 w-1 bg-gradient-to-b from-green-400 to-gray-200"></div>

        {/* Événements */}
        <div className="space-y-6">
          {timelineEvents.map((event, idx) => (
            <div key={idx} className="relative pl-20">
              {/* Icône du point */}
              <div className="absolute -left-3 top-1 bg-white rounded-full p-1 border-4 border-white">
                {getEventIcon(event.type)}
              </div>

              {/* Contenu */}
              <div className={`border rounded-lg p-4 ${getEventColor(event.status)}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{event.label}</p>
                    <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                  </div>
                  <time className="text-xs font-semibold text-gray-500 whitespace-nowrap ml-2">
                    {new Date(event.date).toLocaleDateString('fr-FR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </time>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
