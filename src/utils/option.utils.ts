/**
 * Get the label of an option
 * @param option - The option to get the label from
 * @param labelKey - The key of the label to get
 * @returns The label of the option
 */
export const getLabelValue = <T>(option: T, labelKey: keyof T): string => {
  if (typeof option === "string" || typeof option === "number")
    return `${option}`;
  else if (
    typeof option?.[labelKey] === "string" ||
    typeof option?.[labelKey] === "number"
  )
    return `${option?.[labelKey]}`;
  return "";
};

/**
 * Get the value of an option
 * @param option - The option to get the value from
 * @param valueKey - The key of the value to get
 * @returns The value of the option
 */
export const getOptionValue = <T>(
  option: T,
  valueKey: keyof T
): string | undefined => {
  if ((option && typeof option === "string") || typeof option === "number")
    return `${option}`;
  else if (
    typeof option === "object" &&
    option?.[valueKey] &&
    (typeof option?.[valueKey] === "string" ||
      typeof option?.[valueKey] === "number")
  )
    return `${option?.[valueKey]}`;
  return undefined;
};
