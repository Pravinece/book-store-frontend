import { STORE } from '../Datas/store';

const toMinutes = (str) => {
  const [time, mer] = str.split(' ');
  let [h, m] = time.split(':').map(Number);
  if (mer === 'PM' && h !== 12) h += 12;
  if (mer === 'AM' && h === 12) h = 0;
  return h * 60 + m;
};

/** Returns today's opening window and whether the store is open right now (device clock). */
export function todayHours(now = new Date()) {
  const slot = STORE.hours.find((h) => h.days.includes(now.getDay()));
  if (!slot) return { label: 'Closed today', open: '', isOpenNow: false, slot: null };
  const mins = now.getHours() * 60 + now.getMinutes();
  const isOpenNow = mins >= toMinutes(slot.open) && mins < toMinutes(slot.close);
  return { label: slot.label, open: `${slot.open} – ${slot.close}`, isOpenNow, slot };
}
