import React, { useEffect, useRef, useState } from 'react';
import { IMAGES } from '../constants';
import { EnvelopeData } from '../types';

interface EnvelopeProps {
  data: EnvelopeData;
  onClick: () => void;
  index: number; 
  disabled: boolean;
  isMega?: boolean;
}

export const Envelope: React.FC<EnvelopeProps> = ({ data, onClick, index, disabled, isMega = false }) => {
  // Stagger animation delay based on index
  const animationDelay = `${index * 50}ms`;
  const wobbleDelay = `${index * 120}ms`;
  const [isOpeningBurst, setIsOpeningBurst] = useState(false);
  const openTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (data.isOpened || disabled || isOpeningBurst) {
      return;
    }

    setIsOpeningBurst(true);
    openTimerRef.current = window.setTimeout(() => {
      onClick();
      setIsOpeningBurst(false);
      openTimerRef.current = null;
    }, 220);
  };

  const envelopeSizeClass = isMega
    ? 'w-[500px] h-[700px] sm:w-[540px] sm:h-[756px]'
    : 'w-20 h-28 sm:w-24 sm:h-36 md:w-28 md:h-40 lg:w-32 lg:h-44';

  return (
    <div 
      className={`relative flex items-center justify-center cursor-pointer transition-transform duration-300 ${isMega ? '' : 'hover:scale-105 active:scale-95'} animate-pop-in`}
      style={{ animationDelay }}
      onClick={handleClick}
    >
      <div
        className={`${envelopeSizeClass} relative transition-all duration-500 ${data.isOpened ? 'opacity-50 grayscale' : 'opacity-100 animate-envelope-wobble'} ${isOpeningBurst ? 'animate-shake scale-110' : ''}`}
        style={!data.isOpened ? { animationDelay: wobbleDelay } : undefined}
      >
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
