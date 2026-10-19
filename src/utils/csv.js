import { GENRES } from '../data/store';

export const CSV_HEADERS = ['title', 'author', 'genre', 'price', 'stock', 'image', 'description', 'tags', 'mrp'];
const REQUIRED = ['title', 'author', 'genre', 'price', 'stock'];

/** Minimal RFC-4180 style parser (quoted fields, escaped quotes, CRLF). */
export function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  const src = text.replace(/^﻿/, '');

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((v) => v.trim() !== '')) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  row.push(field);
  if (row.some((v) => v.trim() !== '')) rows.push(row);
  return rows;
}

/**
 * Parse + validate a CSV string of books.
 * Returns { valid: Book-ish[], errors: [{ row, message }], total }
 * `row` is the 1-based spreadsheet row number (header = row 1).
 */
export function parseBooksCSV(text) {
  const rows = parseCSV(text);
  const errors = [];
  const valid = [];

  if (rows.length === 0) {
    return { valid, errors: [{ row: 1, message: 'The file is empty.' }], total: 0 };
  }

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const missingCols = REQUIRED.filter((h) => !headers.includes(h));
  if (missingCols.length) {
    return {
      valid,
      errors: [{ row: 1, message: `Missing required column(s): ${missingCols.join(', ')}` }],
      total: rows.length - 1,
    };
  }

  const idx = (name) => headers.indexOf(name);

  rows.slice(1).forEach((cells, i) => {
    const rowNum = i + 2;
    const get = (name) => (idx(name) >= 0 ? (cells[idx(name)] ?? '').trim() : '');
    const problems = [];

    const title = get('title');
    const author = get('author');
    const genreRaw = get('genre');
    const priceRaw = get('price');
    const stockRaw = get('stock');
    const mrpRaw = get('mrp');

    if (!title) problems.push('title is missing');
    if (!author) problems.push('author is missing');
    if (!genreRaw) problems.push('genre is missing');
    if (priceRaw === '') problems.push('price is missing');
    if (stockRaw === '') problems.push('stock is missing');

    const genre = GENRES.find((g) => g.toLowerCase() === genreRaw.toLowerCase());
    if (genreRaw && !genre) problems.push(`unknown genre "${genreRaw}" (use ${GENRES.join(' / ')})`);

    const price = Number(priceRaw);
    if (priceRaw !== '' && (!Number.isFinite(price) || price < 0)) problems.push(`price "${priceRaw}" is not a valid number`);

    const stock = Number(stockRaw);
    if (stockRaw !== '' && (!Number.isInteger(stock) || stock < 0)) problems.push(`stock "${stockRaw}" must be a whole number ≥ 0`);

    const mrp = mrpRaw === '' ? price : Number(mrpRaw);
    if (mrpRaw !== '' && (!Number.isFinite(mrp) || mrp < 0)) problems.push(`mrp "${mrpRaw}" is not a valid number`);

    const image = get('image');
    if (image && !/^https?:\/\//i.test(image)) problems.push('image must be a full http(s) URL');

    if (problems.length) {
      errors.push({ row: rowNum, message: problems.join('; '), title: title || undefined });
      return;
    }

    valid.push({
      title,
      author,
      genre,
      price,
      mrp: Math.max(mrp, price),
      stock,
      image,
      description: get('description'),
      tags: get('tags').split(/[,;|]/).map((t) => t.trim()).filter(Boolean),
    });
  });

  return { valid, errors, total: rows.length - 1 };
}

export function templateCSV() {
  const sample = [
    ['The Little Prince', 'Antoine de Saint-Exupéry', 'Fiction', '249', '12', '', 'A pilot meets a small traveller from another planet.', 'classic,gift', '299'],
  ];
  const esc = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return [CSV_HEADERS, ...sample].map((r) => r.map(esc).join(',')).join('\n');
}

export function downloadText(filename, text, type = 'text/csv') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
