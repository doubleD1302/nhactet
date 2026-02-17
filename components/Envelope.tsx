import React from 'react';
import { IMAGES } from '../constants';
import { EnvelopeData } from '../types';

interface EnvelopeProps {
  data: EnvelopeData;
  onClick: () => void;
  index: number; 
  disabled: boolean;
}

export const Envelope: React.FC<EnvelopeProps> = ({ data, onClick, index, disabled }) => {
  // Stagger animation delay based on index
  const animationDelay = `${index * 50}ms`;

  return (
    <div 
      className={`relative flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 animate-pop-in`}
      style={{ animationDelay }}
      onClick={() => !data.isOpened && !disabled && onClick()}
    >
      <div className={`w-24 h-32 sm:w-28 sm:h-40 md:w-32 md:h-44 relative transition-all duration-500 ${data.isOpened ? 'opacity-50 grayscale' : 'opacity-100'}`}>
        <img 
          src={IMAGES.LIXI} 
          alt="Lixi" 
          className="w-full h-full object-contain drop-shadow-lg"
        />
        {/* Number Badge (Optional, can remove if we want pure mystery) */}
        {/* <div className="absolute top-0 right-0 bg-yellow-400 text-red-800 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md border border-red-800">
            {index + 1}
        </div> */}
        
        {data.isOpened && (
             <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-2xl font-bold text-gray-800">✅</span>
             </div>
        )}
      </div>
    </div>
  );
};
