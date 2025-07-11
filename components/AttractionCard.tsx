
import React from 'react';
import type { Attraction } from '../types';

interface AttractionCardProps {
    attraction: Attraction;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction }) => {
    return (
        <div className="bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col">
            <img src={attraction.image} alt={`Imagen de ${attraction.name}`} className="w-full h-48 object-cover" />
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-white mb-2">{attraction.name}</h3>
                <p className="text-gray-300 text-sm mb-4 flex-grow">{attraction.description}</p>
                <div className="mt-auto pt-4 border-t border-white/10">
                     <p className="text-xs text-gray-400 mb-2">📍 {attraction.city}</p>
                     <a
                        href={attraction.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50 w-full"
                    >
                        Reservar Ahora
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AttractionCard;
