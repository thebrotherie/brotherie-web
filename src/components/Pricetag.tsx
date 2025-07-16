// components/PriceTag.tsx
import React from 'react';
import { formatUSD, formatUSDIntl } from '../lib/formatUSD';

interface PriceTagProps {
  amount: number;
  useIntl?: boolean;
}

export const PriceTag: React.FC<PriceTagProps> = ({ amount, useIntl = false }) => {
  const formatted = useIntl ? formatUSDIntl(amount) : formatUSD(amount);

  return (
    <span className="font-medium text-gray-900">
      {formatted}
    </span>
  );
};
