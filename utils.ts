import { DistributionMode, EnvelopeData } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const generateEnvelopes = (
  totalAmount: number,
  count: number,
  mode: DistributionMode,
  denominations: number[] = []
): EnvelopeData[] => {
  let amounts: number[] = [];

  if (count <= 0) return [];

  if (mode === DistributionMode.DENOMINATION_RANDOM) {
    const shuffledDenominations = [...denominations]
      .filter(value => Number.isFinite(value) && value > 0)
      .sort(() => Math.random() - 0.5);

    amounts = new Array(count)
      .fill(0)
      .map((_, index) => shuffledDenominations[index] ?? 0);
  } else if (mode === DistributionMode.EQUAL) {
    const amountPerPerson = Math.floor(totalAmount / count);
    // Handle remainder by adding to the first few or just ignoring small remainder
    // Ideally, totalAmount should be divisible, but let's be safe.
    amounts = new Array(count).fill(amountPerPerson);
    
    // Add remainder to random envelopes so no money is lost
    let remainder = totalAmount - (amountPerPerson * count);
    let i = 0;
    while (remainder > 0) {
        amounts[i]++;
        remainder--;
        i = (i + 1) % count;
    }
  } else {
    // Random distribution logic
    // We want to ensure everyone gets at least something (e.g., 1 unit).
    // Let's assume the minimum unit is 1.
    
    if (totalAmount < count) {
        // Not enough money to give 1 to everyone
        // Fallback to equal (fractional) or just 0
        return new Array(count).fill(0).map((amt, idx) => ({
            id: idx,
            amount: amt,
            isOpened: false
        }));
    }

    // 1. Reserve 1 unit for everyone
    const minPerPerson = 1; // Could be 1000 if user thinks in k, but let's keep it raw
    let remaining = totalAmount - (count * minPerPerson);
    
    // 2. Generate random weights
    const weights = new Array(count).fill(0).map(() => Math.random());
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    
    // 3. Distribute remaining based on weights
    const randomParts = weights.map(w => Math.floor((w / totalWeight) * remaining));
    
    // 4. Calculate current sum and fix rounding error
    const currentDistributed = randomParts.reduce((a, b) => a + b, 0);
    let error = remaining - currentDistributed;
    
    // Add error to the luckiest (highest weight) or random
    // Let's just add to the first one for simplicity, or random index
    while (error > 0) {
        const luckyIndex = Math.floor(Math.random() * count);
        randomParts[luckyIndex]++;
        error--;
    }

    amounts = randomParts.map(part => part + minPerPerson);
  }

  // Shuffle the amounts so the order in array doesn't match generation logic
  for (let i = amounts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [amounts[i], amounts[j]] = [amounts[j], amounts[i]];
  }

  return amounts.map((amt, idx) => ({
    id: idx,
    amount: amt,
    isOpened: false,
  }));
};
