import { STORE } from '../Datas/store';
import { formatPrice } from './format';

const origin = () => (typeof window !== 'undefined' ? window.location.origin : '');

export const bookUrl = (book) => `${origin()}${import.meta.env.BASE_URL}${encodeURIComponent(book.id)}`;

// Only share absolute image URLs that recipients can access.
export const shareImage = (book) => {
  const image = book.imageUrl || book.image;
  return image && /^https?:\/\//i.test(image) ? image : '';
};

export function buildBookShareMessage(book) {
  return [
    `📚 ${book.name || book.title}`,
    '',
    `✍️ ${book.author}`,
    `💰 ${formatPrice(book.price)}`,
    book.publisher && `🏛️ ${book.publisher}`,
    book.isbn && `ISBN: ${book.isbn}`,
    book.categoryName && `Category: ${book.categoryName}`,
    book.stock !== undefined && `Availability: ${Number(book.stock) > 0 ? `${book.stock} in stock` : 'Out of stock'}`,
    book.description && `\n${book.description}`,
    shareImage(book) && `🖼️ ${shareImage(book)}`,
    `🔗 ${bookUrl(book)}`,
  ].filter(Boolean).join('\n');
}

export function buildInquiryMessage(book) {
  return [
    `Hi ${STORE.name}! 👋 I'd like to check availability for this book:`,
    '',
    buildBookShareMessage(book),
    '',
    'Is it in stock? Could you reserve a copy for me?',
  ].join('\n');
}

export function whatsappLink(book) {
  return `https://wa.me/?text=${encodeURIComponent(buildBookShareMessage(book))}`;
}

export function whatsappGeneralLink(text = `Hi ${STORE.name}! I have a question.`) {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function googleMapsLink() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE.mapQuery)}`;
}

export function mapEmbedSrc() {
  return `https://www.google.com/maps?q=${encodeURIComponent(STORE.mapQuery)}&output=embed`;
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
