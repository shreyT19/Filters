import { startCase } from "lodash";
import { IStatusBarThemeType, ThemesFilledVariant } from "~/utils/themes.utils";

export const truncateString = (
  inputString: string,
  noOfChars: number, // Excludes ellipsis `...` if enabled
  ellipsis: boolean = true
) => {
  if (noOfChars >= inputString.length) {
    return inputString;
  }
  let result = inputString.substring(0, noOfChars) + (ellipsis ? "..." : "");

  return result;
};

export const capitalizeEachWord = (sentence = ""): string => {
  return sentence.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
};

export const filterUnderscore = (inputString = ""): string => {
  if (inputString.includes("_")) {
    return inputString.replace(/_/g, " ");
  } else {
    return inputString;
  }
};

/**
 * Formats a number to a currency string
 * @example
 * const formattedAmount1 = formatAmountToCurrency('1000', 'USD');
 * Output: $1,000.00
 * const formattedAmount2 = formatAmountToCurrency(1500, 'EUR');
 * Output: €1,500.00
 */

export const formatAmountToCurrency = (
  amount: string | number,
  currency?: string
): string => {
  const parsedAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(parsedAmount)) return "NaN";

  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: currency ? "currency" : "decimal",
      currency: currency ? currency.toUpperCase() : undefined,
      minimumFractionDigits: 2,
      maximumFractionDigits: 10,
    });
    return formatter.format(parsedAmount);
  } catch (err) {
    return parsedAmount.toFixed(2);
  }
};

interface Address {
  line1?: string;
  line2?: string;
  line3?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Utility function to format address
export const formatAddress = (address: Address): string => {
  const parts: (string | undefined)[] = [
    address?.line1,
    address?.line2,
    address?.line3,
    address?.city,
    address?.state,
    address?.zipCode,
    address?.country,
  ];

  // Filter out undefined or empty parts
  const formattedParts = parts?.filter(Boolean);

  // Join the non-empty parts with ', '
  const formattedAddress = formattedParts?.join(", ");

  return formattedAddress;
};

export function toCents(val: number) {
  return Math.round((Math.abs(val) / 100) * 10000);
}

export const removeScriptExtension = (str: string | null | undefined) => {
  try {
    if (!str) return null;
    return str?.replace(/\.(py|js|ts|jsx|tsx)$/, "");
  } catch (error) {
    console.error("Error removing script extension", error);
    return startCase(str ?? "");
  }
};

export function isUUID(str: string) {
  var uuidPattern =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  return uuidPattern.test(str);
}

/**
 * Options for the getInitials function
 */
interface InitialsOptions {
  /** Whether to return initials in uppercase (default: true) */
  uppercase?: boolean;
  /** Whether to include middle name/word initials (default: true) */
  includeMiddle?: boolean;
  /** Whether to only use alphabetic characters (default: true) */
  onlyAlpha?: boolean;
  /** Maximum number of initials to return (default: 0 - no limit) */
  maxInitials?: number;
  /** Separator between initials (default: '') */
  separator?: string;
}

/**
 * Utility to extract initials from a string
 * @param str - The input string
 * @param options - Configuration options
 * @returns The extracted initials
 */
export const getInitials = (
  str: string | null | undefined,
  options: InitialsOptions = {}
): string => {
  // Default options
  const defaults: Required<InitialsOptions> = {
    uppercase: true,
    includeMiddle: true,
    onlyAlpha: true,
    maxInitials: 0, // 0 means no limit
    separator: "",
  };

  // Merge provided options with defaults
  const settings: Required<InitialsOptions> = { ...defaults, ...options };

  // Return empty string for invalid input
  if (!str || typeof str !== "string") {
    return "";
  }

  // If string is empty after trimming, return empty string
  const trimmedStr = str.trim();
  if (trimmedStr.length === 0) {
    return "";
  }

  // Split the string into words, treating hyphens, underscores, and spaces as word separators
  const words: string[] = trimmedStr.split(/[\s\-_]+/);

  // Filter words based on settings
  const initialsArray: string[] = [];

  if (words.length === 1) {
    // For a single word, use the first character
    const firstChar: string = settings.onlyAlpha
      ? words?.[0]?.match(/[a-zA-Z]/)?.at(0) || words?.[0]?.charAt(0) || ""
      : words?.[0]?.charAt(0) || "";

    initialsArray.push(firstChar);
  } else {
    // For multiple words
    const numWords: number = words.length;

    // Always include first word
    const firstWordInitial: string = settings.onlyAlpha
      ? words?.[0]?.match(/[a-zA-Z]/)?.at(0) || words?.[0]?.charAt(0) || ""
      : words?.[0]?.charAt(0) || "";

    initialsArray.push(firstWordInitial);

    // Include middle word(s) if specified
    if (settings.includeMiddle && numWords > 2) {
      for (let i = 1; i < numWords - 1; i++) {
        const middleInitial: string = settings.onlyAlpha
          ? words?.[i]?.match(/[a-zA-Z]/)?.at(0) || words?.[i]?.charAt(0) || ""
          : words?.[i]?.charAt(0) || "";

        if (middleInitial) {
          initialsArray.push(middleInitial);
        }
      }
    }

    // Always include last word if it exists
    if (numWords > 1) {
      const lastWordInitial: string = settings.onlyAlpha
        ? words?.[numWords - 1]?.match(/[a-zA-Z]/)?.at(0) ||
          words?.[numWords - 1]?.charAt(0) ||
          ""
        : words?.[numWords - 1]?.charAt(0) || "";

      initialsArray.push(lastWordInitial);
    }
  }

  // If no initials were found, return the first character of the string
  if (initialsArray.length === 0) {
    return settings.uppercase
      ? trimmedStr.charAt(0).toUpperCase()
      : trimmedStr.charAt(0);
  }

  // Apply max initials limit if specified
  const finalInitials: string[] =
    settings.maxInitials > 0
      ? initialsArray.slice(0, settings.maxInitials)
      : initialsArray;

  // Format the result
  const initials: string = finalInitials.join(settings.separator);

  return settings.uppercase ? initials.toUpperCase() : initials;
};

/**
 * Get a deterministic theme color based on string
 * @param str - The input string
 * @returns The theme color
 */
export const getThemeColorForString = (str: string) => {
  // Simple hash function to get a number from a string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str?.charCodeAt(i) + ((hash << 5) - hash);
  }

  const themeColors = Object.keys(ThemesFilledVariant);

  // Use the hash to pick a color
  const index = Math.abs(hash) % themeColors.length;
  return themeColors?.[index] as IStatusBarThemeType;
};

/**
 * Debounce a function
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
