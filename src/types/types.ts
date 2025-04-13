import { map, startCase, omit } from "lodash";

// Utility type to convert enum to union type of its values
export type EnumValues<T> = T[keyof T];

export const generateEnumOptions = <T extends object>(
  _enum: T,
  excludedKeys: Array<keyof T> = []
) => {
  // Omit the excluded keys from the enum
  const filteredEnum = omit(_enum, excludedKeys);
  return map(filteredEnum, (value, key) => ({
    label: startCase(key.toLowerCase()),
    value,
  }));
};
