import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, LoaderCircle, MessageCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookById } from "../../app/api/adminapi";
import toast from "../../components/Toast";
import { buildBookShareMessage, copyText, whatsappLink } from "../../utils/share";
import { formatPrice } from "../../utils/format";
import { STORE } from "../../Datas/store";
import Instagram from "../../../public/Instagram";

function BookDetails({ book }) {
  const navigate = useNavigate();
  const shareMessage = buildBookShareMessage(book);

  const shareToInstagram = async () => {
    window.open(STORE.instagramDm, "_blank", "noopener,noreferrer");
    const copied = await copyText(shareMessage);
    if (copied) {
      toast.success("Book details copied. Paste them into your Instagram message.");
    } else {
      toast.error("Could not copy book details. Please copy the book link manually.");
    }
  };

  return (
    <article className="mx-auto h-full w-full max-w-5xl overflow-y-auto px-4 py-6 sm:px-6 lg:py-10">
      <button onClick={() => navigate(-1)} className="clay-btn mb-5 !py-2.5" type="button">
        <ArrowLeft size={16} /> Back
      </button>

      <section className="clay grid gap-6 p-5 sm:p-8 md:grid-cols-[minmax(220px,0.8fr)_1.2fr] md:gap-10">
        <div className="clay-inset mx-auto flex aspect-[2/3] w-full max-w-[300px] items-center justify-center overflow-hidden p-3">
          {book.imageUrl ? (
            <img
              src={book.imageUrl}
              alt={`Cover of ${book.name}`}
              className="h-full w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl bg-cream-200 text-cocoa-300">
              <BookOpen size={48} />
              <span className="text-sm">Cover unavailable</span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col">
          <span className="chip w-fit bg-sage/15 text-sage">{book.categoryName || "Book"}</span>
          <h1 className="mt-4 break-words font-serif text-3xl font-bold text-cocoa-700 sm:text-4xl">
            {book.name}
          </h1>
          <p className="mt-2 text-lg text-cocoa-500">by {book.author}</p>
          <p className="mt-5 text-2xl font-bold text-terracotta">{formatPrice(book.price)}</p>
          <p className={`mt-2 text-sm font-semibold ${Number(book.stock) > 0 ? "text-sage" : "text-terracotta"}`}>
            {Number(book.stock) > 0 ? `${book.stock} in stock` : "Currently out of stock"}
          </p>

          <dl className="clay-inset mt-6 grid gap-3 p-4 text-sm sm:grid-cols-2">
            {book.publisher && <Detail label="Publisher" value={book.publisher} />}
            {book.isbn && <Detail label="ISBN" value={book.isbn} />}
            {book.categoryName && <Detail label="Category" value={book.categoryName} />}
          </dl>

          {book.description && (
            <section className="mt-6">
              <h2 className="font-serif text-xl font-semibold text-cocoa-700">About this book</h2>
              <p className="mt-2 whitespace-pre-line leading-7 text-cocoa-500">{book.description}</p>
            </section>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink(book)}
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn-sage w-full sm:w-auto"
            >
              <MessageCircle size={18} /> Share on WhatsApp
            </a>
            <button type="button" onClick={shareToInstagram} className="clay-btn w-full sm:w-auto">
              <Instagram size={18} /> Share on Instagram
            </button>
          </div>
          <p className="mt-3 text-xs text-cocoa-300">
            Instagram does not support prefilled messages; details are copied so you can paste them into a chat.
          </p>
        </div>
      </section>
    </article>
  );
}

function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-cocoa-300">{label}</dt>
      <dd className="mt-1 break-words text-cocoa-600">{value}</dd>
    </div>
  );
}

export default function Book() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ status: "loading", book: null, message: "" });

  useEffect(() => {
    let active = true;

    const loadBook = async () => {
      setState({ status: "loading", book: null, message: "" });
      const result = await getBookById(id);
      if (!active) return;
      if (!result.success) {
        setState({ status: "error", book: null, message: result.message });
        return;
      }

      const book = result.data?.book || result.data?.item || result.data;
      if (!book || typeof book !== "object" || !(book.name || book.title)) {
        setState({ status: "error", book: null, message: "The book details could not be found." });
        return;
      }
      const b = { ...book, name: book.name || book.title };
      setState({ status: "success", book: b, message: "" });

      // Inject OG meta tags so WhatsApp/Telegram bots see them on revisit
      const setMeta = (prop, content, attr = 'property') => {
        let el = document.querySelector(`meta[${attr}='${prop}']`);
        if (!el) { el = document.createElement('meta'); el.setAttribute(attr, prop); document.head.appendChild(el); }
        el.setAttribute('content', content);
      };
      const url = window.location.href;
      document.title = `${b.name} — ${b.author}`;
      setMeta('og:title', `${b.name} by ${b.author}`);
      setMeta('og:description', `${formatPrice(b.price)} · ${b.categoryName || 'Book'}${b.stock > 0 ? ` · ${b.stock} in stock` : ' · Out of stock'}`);
      setMeta('og:url', url);
      setMeta('og:type', 'product');
      if (b.imageUrl && /^https?:\/\//i.test(b.imageUrl)) setMeta('og:image', b.imageUrl);
      setMeta('twitter:card', 'summary_large_image', 'name');
      setMeta('twitter:title', `${b.name} by ${b.author}`, 'name');
      if (b.imageUrl && /^https?:\/\//i.test(b.imageUrl)) setMeta('twitter:image', b.imageUrl, 'name');
    };

    loadBook();
    return () => { active = false; };
  }, [id]);

  if (state.status === "loading") {
    return (
      <div className="flex h-full items-center justify-center" role="status" aria-live="polite">
        <LoaderCircle className="animate-spin text-sage" size={32} />
        <span className="sr-only">Loading book details</span>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto flex h-full w-full max-w-xl flex-col items-center justify-center px-4 text-center">
        <div className="clay p-8">
          <h1 className="font-serif text-2xl font-bold text-cocoa-700">Book unavailable</h1>
          <p className="mt-3 text-cocoa-500">{state.message}</p>
          <button onClick={() => navigate(-1)} className="clay-btn-primary mt-6" type="button">
            <ArrowLeft size={16} /> Go back
          </button>
        </div>
      </div>
    );
  }

  return <BookDetails book={state.book} />;
}