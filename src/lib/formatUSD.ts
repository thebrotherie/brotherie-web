// lib/formatUSD.ts
export function formatUSD(amount: number): string {
  return '$' + amount.toFixed(2);
}

// OR, using Intl.NumberFormat:
const usdFormatter = new Intl.NumberFormat('en-US', {
  style:               'currency',
  currency:            'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatUSDIntl(amount: number): string {
  return usdFormatter.format(amount);
}
