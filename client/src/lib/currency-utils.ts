// Simple currency formatting utilities for PKR only

export type Currency = "PKR";

export const CURRENCY_SYMBOLS = {
  PKR: "₨", // Pakistani Rupee symbol
};

export const CURRENCY_NAMES = {
  PKR: "Pakistani Rupee",
};

/**
 * Format PKR currency amount with proper symbol and formatting
 */
export function formatCurrency(
  amount: number,
  currency: Currency = "PKR",
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSymbol?: boolean;
  } = {}
): string {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showSymbol = true,
  } = options;

  // Handle undefined, null, or NaN values
  const safeAmount = (typeof amount === 'number' && !isNaN(amount)) ? amount : 0;

  const formattedAmount = safeAmount.toLocaleString("en-PK", {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  if (!showSymbol) {
    return formattedAmount;
  }

  return `${CURRENCY_SYMBOLS[currency]} ${formattedAmount}`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(): string {
  return CURRENCY_SYMBOLS.PKR;
}

/**
 * Parse currency string to get numeric value
 */
export function parseCurrencyString(currencyString: string): number {
  // Remove all non-numeric characters except decimal point and minus sign
  const numericString = currencyString.replace(/[^\d.-]/g, '');
  return parseFloat(numericString) || 0;
}

/**
 * Validate currency code (always PKR now)
 */
export function isValidCurrency(currency: string): currency is Currency {
  return currency === "PKR";
}

/**
 * Get supported currencies (only PKR)
 */
export function getSupportedCurrencies(): Currency[] {
  return ["PKR"];
}
