export type RGBColor = { r: number; g: number; b: number };

/**
 * Convert an RGB color to a hex color
 * @param r The red color component
 * @param g The green color component
 * @param b The blue color component
 */
export function rgbToHex({ r, g, b }: RGBColor) {
  // Convert each color component to a 2-digit hexadecimal string
  return `#${[r, g, b]
    .map(x => {
      const hex = x.toString(16); // Convert to hex
      return hex.length === 1 ? `0${hex}` : hex; // Pad single digit hex values
    })
    .join('')}`;
}

/* eslint-disable no-bitwise */
/**
 * Convert a hex color to an RGB color
 * @param hex
 */
export function hexToRgb(hex: string): RGBColor {
  const cleanHex = hex.replace(/^#/, ''); // Use const because it's not reassigned
  const bigint = parseInt(cleanHex, 16); // Convert to an integer
  const r = (bigint >> 16) & 255; // Extract red
  const g = (bigint >> 8) & 255; // Extract green
  const b = bigint & 255; // Extract blue
  return { r, g, b };
}
/* eslint-enable no-bitwise */
