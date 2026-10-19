const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export const formatPrice = (n) => (Number(n) === 0 ? 'Free' : `₹${inr.format(Number(n) || 0)}`);
export const formatRupees = (n) => `₹${inr.format(Number(n) || 0)}`;

export function discountPct(price, mrp) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

// Deterministic hash → used to give each generated cover its own colours
export function hashString(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function uid(prefix = 'b') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
