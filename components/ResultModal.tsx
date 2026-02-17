import React from 'react';
import { formatCurrency } from '../utils';

interface ResultModalProps {
  amount: number;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ amount, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-pop-in">
      <div className="bg-gradient-to-b from-red-600 to-red-800 p-1 rounded-2xl sm:rounded-3xl w-full max-w-sm shadow-2xl animate-float">
        <div className="bg-[#FFF8E7] rounded-[18px] sm:rounded-[22px] p-5 sm:p-8 text-center flex flex-col items-center border-4 border-yellow-400">
          
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-1.5 sm:mb-2 uppercase">Chúc Mừng!</h2>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Bạn đã nhận được</p>
          
          <div className="text-3xl sm:text-5xl font-extrabold text-tet-red mb-6 sm:mb-8 drop-shadow-sm tracking-tight break-words">
            {formatCurrency(amount)}
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-red-200 to-transparent mb-5 sm:mb-6"></div>

          <button
            onClick={onClose}
            className="bg-yellow-400 hover:bg-yellow-300 text-red-800 font-extrabold py-2.5 sm:py-3 px-8 sm:px-10 rounded-full shadow-lg transform transition hover:-translate-y-1 active:translate-y-0 text-sm sm:text-base"
          >
            NHẬN LÌ XÌ
          </button>
        </div>
      </div>
    </div>
  );
};
