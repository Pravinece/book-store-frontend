import { ExternalLink, InspectionPanel, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { STORE } from '../../Datas/store';
import { todayHours } from '../../utils/hours';
import { googleMapsLink, mapEmbedSrc, whatsappGeneralLink } from '../../utils/share';

export default function About() {
  const now = new Date();
  const { isOpenNow } = todayHours(now);
  const today = now.getDay();

  return (
    <div className="h-[80%] overflow-auto max-w-[900px] w-[900px] min-w-[340px] px-4 pt-4 animate-slideUp">
      <span className={`chip ${isOpenNow ? 'bg-sage text-white' : 'bg-cream-200 text-cocoa-500'}`}>
        {isOpenNow ? '● Open now' : '○ Closed right now'}
      </span>
      <h1 className="mt-3 text-3xl font-bold sm:text-5xl">Visit {STORE.name}</h1>
      <p className="mt-2 max-w-xl text-cocoa-500">{STORE.tagline}. Browse the shelves, sip something warm, and swap a book on the pre-loved shelf.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* map */}
        <div initial={{ y: 30 }} animate={{ y: 0 }} className="clay overflow-hidden p-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-cream-200">
            <iframe
              title={`Map of ${STORE.name}`}
              src={mapEmbedSrc()}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 p-3">
            <p className="flex items-start gap-2 text-sm text-cocoa-500"><MapPin size={16} className="mt-0.5 shrink-0 text-terracotta" /> {STORE.address}</p>
            <a href={googleMapsLink()} target="_blank" rel="noopener noreferrer" className="clay-btn-primary !py-2.5"><Navigation size={16} /> Get directions</a>
          </div>
        </div>

        <div className="space-y-6">
          {/* hours */}
          <div className="clay p-6">
            <h2 className="text-xl font-semibold">Store hours</h2>
            <ul className="mt-4 space-y-2">
              {STORE.hours.map((h) => {
                const isToday = h.days.includes(today);
                return (
                  <li key={h.label} className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm ${isToday ? 'clay-inset font-semibold text-terracotta-600' : ''}`}>
                    <span>{h.label}{isToday && ' · today'}</span>
                    <span>{h.open} – {h.close}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs text-cocoa-300">Visit during weekdays for a quieter shopping experience.</p>
          </div>

          {/* contact */}
          <div className="clay space-y-3 p-6">
            <h2 className="text-xl font-semibold">Get in touch</h2>
            <a href={STORE.phoneHref} className="clay-btn w-full !justify-start"><Phone size={16} /> {STORE.phone}</a>
            <a href={whatsappGeneralLink()} target="_blank" rel="noopener noreferrer" className="clay-btn-sage w-full !justify-start"><MessageCircle size={16} /> Chat on WhatsApp</a>
            <a href={STORE.instagramUrl} target="_blank" rel="noopener noreferrer" className="clay-btn w-full !justify-start"><InspectionPanel size={16} /> @{STORE.instagramHandle}</a>
            <a href={STORE.wanderlogUrl} target="_blank" rel="noopener noreferrer" className="clay-btn w-full !justify-start"><ExternalLink size={16} /> See us on Wanderlog</a>
          </div>
        </div>
      </div>
    </div>
  );
}
