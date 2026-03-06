const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string, locale: string): Intl.NumberFormat {
  const key = `${locale}:${currency}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    formatterCache.set(key, formatter);
  }
  return formatter;
}

export function formatCurrency(
  amount: string | number,
  currency: string,
  locale = 'en-US',
): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return getFormatter(currency, locale).format(numericAmount);
}
