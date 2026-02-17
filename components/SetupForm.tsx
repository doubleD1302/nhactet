import React, { useState } from 'react';
import { DistributionMode, GameSettings } from '../types';

interface SetupFormProps {
  onStart: (settings: GameSettings) => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onStart }) => {
  const [totalAmount, setTotalAmount] = useState<string>('500000');
  const [totalEnvelopes, setTotalEnvelopes] = useState<string>('5');
  const [mode, setMode] = useState<DistributionMode>(DistributionMode.RANDOM);
  const [denominationsInput, setDenominationsInput] = useState<string>('50x3, 20x2');

  const parsedDenominations = denominationsInput
    .split(/[\n,]+/)
    .map(part => part.trim())
    .filter(Boolean)
    .flatMap(item => {
      const normalized = item.replace(/\s+/g, '');
      const matched = normalized.match(/^(\d+)(?:x|\*)(\d+)$/i);

      if (!matched) {
        return [];
      }

      const denominationInThousand = parseInt(matched[1], 10);
      const quantity = parseInt(matched[2], 10);

      if (!Number.isFinite(denominationInThousand) || denominationInThousand <= 0 || !Number.isFinite(quantity) || quantity <= 0) {
        return [];
      }

      return new Array(quantity).fill(denominationInThousand * 1000);
    });

  const denominationTotal = parsedDenominations.reduce((sum, value) => sum + value, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(totalAmount.replace(/,/g, ''), 10);
    const count = parseInt(totalEnvelopes, 10);
    const usingDenominations = mode === DistributionMode.DENOMINATION_RANDOM;

    if (isNaN(count) || count <= 0) {
      alert("Vui lòng nhập số bao lì xì hợp lệ.");
      return;
    }

    if (usingDenominations) {
      if (parsedDenominations.length === 0) {
        alert("Vui lòng nhập đúng định dạng mệnh giá, ví dụ: 50x3, 20x2.");
        return;
      }

      if (count > parsedDenominations.length) {
        alert(`Bạn có ${parsedDenominations.length} tờ tiền, nên số bao tối đa là ${parsedDenominations.length} (mỗi bao chỉ 1 tờ).`);
        return;
      }

      onStart({
        totalAmount: denominationTotal,
        totalEnvelopes: count,
        mode,
        denominations: parsedDenominations,
      });
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      alert("Vui lòng nhập tổng số tiền hợp lệ.");
      return;
    }

    onStart({
      totalAmount: amount,
      totalEnvelopes: count,
      mode
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md border-2 border-tet-red mx-2 sm:mx-4 animate-pop-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-tet-red mb-4 sm:mb-6 uppercase tracking-wide sm:tracking-wider">Thiết Lập Lì Xì</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label className="block text-gray-700 font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Tổng số tiền (VNĐ)</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            disabled={mode === DistributionMode.DENOMINATION_RANDOM}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-tet-red focus:ring-2 focus:ring-red-200 outline-none transition-all text-base sm:text-lg font-medium text-gray-800"
            placeholder={mode === DistributionMode.DENOMINATION_RANDOM ? "Tự tính theo mệnh giá" : "Ví dụ: 500000"}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Số lượng bao</label>
          <input
            type="number"
            value={totalEnvelopes}
            onChange={(e) => setTotalEnvelopes(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-tet-red focus:ring-2 focus:ring-red-200 outline-none transition-all text-base sm:text-lg font-medium text-gray-800"
            placeholder="Ví dụ: 10"
            min="1"
            max="100"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Cách chia tiền</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setMode(DistributionMode.RANDOM)}
              className={`p-2.5 sm:p-3 rounded-lg border-2 text-sm sm:text-base font-bold transition-all ${
                mode === DistributionMode.RANDOM
                  ? 'bg-tet-red text-white border-tet-red shadow-lg scale-105'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-red-300'
              }`}
            >
              🎲 Ngẫu nhiên
            </button>
            <button
              type="button"
              onClick={() => setMode(DistributionMode.EQUAL)}
              className={`p-2.5 sm:p-3 rounded-lg border-2 text-sm sm:text-base font-bold transition-all ${
                mode === DistributionMode.EQUAL
                  ? 'bg-tet-red text-white border-tet-red shadow-lg scale-105'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-red-300'
              }`}
            >
              ⚖️ Chia đều
            </button>
            <button
              type="button"
              onClick={() => setMode(DistributionMode.DENOMINATION_RANDOM)}
              className={`p-2.5 sm:p-3 rounded-lg border-2 text-sm sm:text-base font-bold transition-all ${
                mode === DistributionMode.DENOMINATION_RANDOM
                  ? 'bg-tet-red text-white border-tet-red shadow-lg scale-105'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-red-300'
              }`}
            >
              💵 Theo mệnh giá
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center leading-relaxed">
            {mode === DistributionMode.RANDOM
              ? "Số tiền trong mỗi bao sẽ khác nhau, tạo sự bất ngờ!"
              : mode === DistributionMode.EQUAL
                ? "Mọi người đều nhận được số tiền bằng nhau."
                : "Nhập theo dạng 50x3, 20x2 (đơn vị nghìn), mỗi bao chỉ nhận đúng 1 tờ ngẫu nhiên."}
          </p>
        </div>

        {mode === DistributionMode.DENOMINATION_RANDOM && (
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Mệnh giá x số lượng (đơn vị nghìn)</label>
            <textarea
              value={denominationsInput}
              onChange={(e) => setDenominationsInput(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-tet-red focus:ring-2 focus:ring-red-200 outline-none transition-all text-sm sm:text-base font-medium text-gray-800 min-h-[88px] sm:min-h-[90px]"
              placeholder="Ví dụ: 50x3, 20x2"
            />
            <p className="text-xs text-gray-500 mt-2">
              Mỗi mục theo dạng mệnh giá x số lượng, ngăn cách bằng dấu phẩy hoặc xuống dòng. Mỗi bao chỉ chứa 1 tờ, nên số bao không vượt quá tổng số tờ đã nhập. Tổng mệnh giá: {denominationTotal.toLocaleString('vi-VN')} VNĐ
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-tet-red to-orange-600 text-white font-bold py-3 sm:py-4 rounded-xl text-lg sm:text-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 mt-3 sm:mt-4 active:scale-95"
        >
          BẮT ĐẦU CHIA LÌ XÌ
        </button>
      </form>
    </div>
  );
};
