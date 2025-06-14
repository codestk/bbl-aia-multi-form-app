// utils/number.js

/**
 * Format a number string with commas.
 * @param {string|number} str
 * @returns {string}
 */
export function formatNumber(str) {
  const num = parseInt((str || "").toString().replace(/[^\d]/g, ""), 10);
  if (isNaN(num)) return "-";
  return num.toLocaleString();
}
