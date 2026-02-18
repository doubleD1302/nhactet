import React, { useState } from 'react';
import { DistributionMode, GameSettings } from '../types';

interface SetupFormProps {
  onStart: (settings: GameSettings) => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onStart }) => {
  const AVAILABLE_VND_DENOMINATIONS = [500000, 200000, 100000, 50000, 20000, 10000];
  const [totalAmount, setTotalAmount] = useState<string>('500000');
  const [totalEnvelopes, setTotalEnvelopes] = useState<string>('5');
  const [mode, setMode] = useState<DistributionMode>(DistributionMode.RANDOM);
  const [denominationCounts, setDenominationCounts] = useState<Record<number, number>>(
    () => AVAILABLE_VND_DENOMINATIONS.reduce((acc, denomination) => ({ ...acc, [denomination]: 0 }), {})
  );

  const parsedDenominations = AVAILABLE_VND_DENOMINATIONS.flatMap((denomination) =>
    new Array(denominationCounts[denomination] ?? 0).fill(denomination)
  );

  const denominationTotal = parsedDenominations.reduce((sum, value) => sum + value, 0);
  const totalSelectedBills = parsedDenominations.length;

  const updateDenominationCount = (denomination: number, delta: number) => {
    setDenominationCounts((prev) => ({
      ...prev,
      [denomination]: Math.max(0, (prev[denomination] ?? 0) + delta),
    }));
  };

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
        alert("Vui lòng chọn số lượng cho ít nhất 1 mệnh giá.");
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
                : "Chọn số lượng cho từng mệnh giá VND có sẵn, mỗi bao chỉ nhận đúng 1 tờ ngẫu nhiên."}
          </p>
        </div>

        {mode === DistributionMode.DENOMINATION_RANDOM && (
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Số lượng theo mệnh giá VND</label>
            <div className="space-y-2">
              {AVAILABLE_VND_DENOMINATIONS.map((denomination) => (
                <div key={denomination} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-gray-200 bg-white">
                  <span className="text-sm sm:text-base font-semibold text-gray-700">
                    {denomination.toLocaleString('vi-VN')}đ
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateDenominationCount(denomination, -1)}
                      className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 font-bold hover:border-red-300"
                      aria-label={`Giảm mệnh giá ${denomination.toLocaleString('vi-VN')} đồng`}
                    >
                      -
                    </button>

                    <span className="w-10 text-center text-base font-bold text-gray-800">
                      {denominationCounts[denomination] ?? 0}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateDenominationCount(denomination, 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 font-bold hover:border-red-300"
                      aria-label={`Tăng mệnh giá ${denomination.toLocaleString('vi-VN')} đồng`}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Tổng số tờ đã chọn: {totalSelectedBills}. Mỗi bao chỉ chứa 1 tờ, nên số bao không vượt quá tổng số tờ. Tổng mệnh giá: {denominationTotal.toLocaleString('vi-VN')} VNĐ
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
