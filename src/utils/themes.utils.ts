//! Please make sure to update the theme colors in both StatusBarThemes and ThemesFilledVariant else it will break the theme color else where
const StatusBarThemes = {
  blue: {
    bg: "bg-blue-75",
    border: "border border-blue-200",
    text: "text-blue-400",
  },
  orange: {
    bg: "bg-orange-900",
    border: "border border-orange-3000",
    text: "text-orange-3000",
  },
  green: {
    bg: "bg-green-70",
    border: "border border-green-1000",
    text: "text-green-5000",
  },
  red: {
    bg: "bg-red-50",
    border: "border border-red-200",
    text: "text-red-500",
  },
  gray: {
    bg: "bg-gray-55",
    border: "border border-gray-750",
    text: "text-gray-8000",
  },
  indigo: {
    bg: "bg-secondary-indigo-50",
    text: "text-secondary-indigo-600",
    border: "border-violet-50-darker border",
  }, // same as violet,
} as const;

export const ThemesFilledVariant = {
  blue: {
    bg: "bg-blue-400",
    border: "border border-blue-500",
    text: "text-blue-75",
  },
  orange: {
    bg: "bg-orange-3000",
    border: "border border-orange-4000",
    text: "text-orange-900",
  },
  green: {
    bg: "bg-green-5000",
    border: "border border-green-6000",
    text: "text-green-70",
  },
  red: {
    bg: "bg-red-500",
    border: "border border-red-600",
    text: "text-red-50",
  },
  gray: {
    bg: "bg-gray-8000",
    border: "border border-gray-9000",
    text: "text-gray-55",
  },
  indigo: {
    bg: "bg-secondary-indigo-600",
    text: "text-secondary-indigo-50",
    border: "border-secondary-indigo-700 border",
  },
} as const;

export const getThemeForKeyword = (
  keyword: IStatusBarThemeType,
  variant: "filled" | "outlined" = "outlined"
) => {
  return variant === "filled"
    ? ThemesFilledVariant[keyword]
    : StatusBarThemes[keyword];
};

export type IStatusBarThemeType = keyof typeof StatusBarThemes;
