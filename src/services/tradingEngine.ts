import { GreenAsset, TradeOrder, InvestmentThesis, PortfolioPosition, OrderSide, OrderType } from '@/types';

export const SIMULATED_TRANSACTION_FEE_RATE = 0.001; // 0.1% virtual fee

/**
 * Validates whether a thesis meets the 3-sentence structured governance requirement.
 */
export function evaluateThesisText(text: string): {
  valid: boolean;
  sentenceCount: number;
  qualityRating: 'Strong' | 'Solid' | 'Basic';
  feedback: string;
} {
  const clean = text.trim();
  if (!clean) {
    return { valid: false, sentenceCount: 0, qualityRating: 'Basic', feedback: 'Thesis cannot be empty.' };
  }

  // Count sentences using standard punctuation split
  const sentences = clean.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 5);
  const sentenceCount = sentences.length;

  if (sentenceCount < 3) {
    return {
      valid: false,
      sentenceCount,
      qualityRating: 'Basic',
      feedback: `You entered ${sentenceCount} sentence(s). VERDEX requires a 3-sentence thesis covering: (1) Signal Observation, (2) Risk Factor, and (3) Financial Rationale.`,
    };
  }

  let qualityRating: 'Strong' | 'Solid' | 'Basic' = 'Solid';
  if (clean.length > 140 && (clean.toLowerCase().includes('risk') || clean.toLowerCase().includes('yield') || clean.toLowerCase().includes('rain') || clean.toLowerCase().includes('solar') || clean.toLowerCase().includes('carbon'))) {
    qualityRating = 'Strong';
  }

  return {
    valid: true,
    sentenceCount,
    qualityRating,
    feedback: 'Thesis validated! Research Lock unlocked for trade execution.',
  };
}

/**
 * Executes a Market or Limit order against current virtual portfolio state.
 */
export function executeOrder(
  asset: GreenAsset,
  side: OrderSide,
  type: OrderType,
  quantity: number,
  limitPrice: number | undefined,
  currentCash: number,
  currentPositions: PortfolioPosition[],
  thesisId: string
): {
  success: boolean;
  errorMessage?: string;
  newCash: number;
  newPositions: PortfolioPosition[];
  order: TradeOrder;
} {
  const executionPrice = type === 'market' ? asset.price : (limitPrice || asset.price);
  const rawValue = executionPrice * quantity;
  const fee = Number((rawValue * SIMULATED_TRANSACTION_FEE_RATE).toFixed(2));
  const totalCost = side === 'buy' ? rawValue + fee : -(rawValue - fee);

  if (side === 'buy' && totalCost > currentCash) {
    throw new Error(`Insufficient buying power. Total cost (GH₵${totalCost.toFixed(2)}) exceeds available virtual cash (GH₵${currentCash.toFixed(2)}).`);
  }

  const existingPos = currentPositions.find((p) => p.assetId === asset.id);

  if (side === 'sell') {
    if (!existingPos || existingPos.quantity < quantity) {
      throw new Error(`Insufficient asset position. You hold ${existingPos?.quantity || 0} unit(s) of ${asset.symbol}.`);
    }
  }

  const newCash = Number((currentCash - totalCost).toFixed(2));
  let updatedPositions = [...currentPositions];

  if (side === 'buy') {
    if (existingPos) {
      const newQty = existingPos.quantity + quantity;
      const newTotalInvested = existingPos.totalValue + rawValue;
      const newAvgPrice = Number((newTotalInvested / newQty).toFixed(2));
      const newTotalValue = Number((newQty * executionPrice).toFixed(2));
      const pnl = Number((newTotalValue - newTotalInvested).toFixed(2));
      const pnlPercent = Number(((pnl / newTotalInvested) * 100).toFixed(2));

      updatedPositions = updatedPositions.map((p) =>
        p.assetId === asset.id
          ? {
              ...p,
              quantity: newQty,
              avgBuyPrice: newAvgPrice,
              currentPrice: executionPrice,
              totalValue: newTotalValue,
              unrealizedPnl: pnl,
              unrealizedPnlPercent: pnlPercent,
            }
          : p
      );
    } else {
      updatedPositions.push({
        assetId: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        category: asset.category,
        quantity,
        avgBuyPrice: executionPrice,
        currentPrice: executionPrice,
        totalValue: rawValue,
        unrealizedPnl: 0,
        unrealizedPnlPercent: 0,
      });
    }
  } else {
    // Sell side
    if (existingPos) {
      const remainingQty = existingPos.quantity - quantity;
      if (remainingQty <= 0) {
        updatedPositions = updatedPositions.filter((p) => p.assetId !== asset.id);
      } else {
        const newTotalValue = Number((remainingQty * executionPrice).toFixed(2));
        const totalInvested = remainingQty * existingPos.avgBuyPrice;
        const pnl = Number((newTotalValue - totalInvested).toFixed(2));
        const pnlPercent = Number(((pnl / totalInvested) * 100).toFixed(2));

        updatedPositions = updatedPositions.map((p) =>
          p.assetId === asset.id
            ? {
                ...p,
                quantity: remainingQty,
                currentPrice: executionPrice,
                totalValue: newTotalValue,
                unrealizedPnl: pnl,
                unrealizedPnlPercent: pnlPercent,
              }
            : p
        );
      }
    }
  }

  const order: TradeOrder = {
    id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    assetId: asset.id,
    symbol: asset.symbol,
    assetName: asset.name,
    side,
    type,
    quantity,
    price: executionPrice,
    totalValue: rawValue,
    fee,
    status: 'executed',
    timestamp: Date.now(),
    thesisId,
  };

  return {
    success: true,
    newCash,
    newPositions: updatedPositions,
    order,
  };
}
