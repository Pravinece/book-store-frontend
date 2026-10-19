import { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import styles from './Login.module.css';
import { loginUser, registerUser } from '../../app/api/authapi';
import Button from '../../components/Button';
import { setSecureToken, setSecureUser } from '../../utils/cookieAuth';

const COVER = {
  color: '#294C3B',
  spineColor: '#1D362A',
  textColor: '#FFF4D8',
  accentColor: '#E9D7A5',
};

const inputStyle = {
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #d8c6a9',
  background: '#fffaf0',
  fontSize: '0.8rem',
  color: '#34291f',
  outline: 'none',
  width: '100%',
};

const labelStyle = {
  fontSize: '0.7rem',
  color: '#4b3628',
  fontWeight: 600,
  letterSpacing: '0.05em',
};

/**
 * Wraps interactive content so the flip-book never sees its pointer events.
 * react-pageflip attaches NATIVE listeners, so we must stop propagation natively
 * (React's synthetic stopPropagation fires too late).
 */
function NoFlip({ children, style, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stop = (e) => e.stopPropagation();
    const events = [
      'mousedown', 'mouseup', 'mousemove',
      'touchstart', 'touchend', 'touchmove',
      'pointerdown', 'pointerup', 'pointermove',
      'click', 'dblclick',
    ];
    events.forEach((evt) => el.addEventListener(evt, stop));
    return () => events.forEach((evt) => el.removeEventListener(evt, stop));
  }, []);

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}

function FrontCover() {
  const env = import.meta.env;

  return (
    <div
      className={styles.bookCover}
      style={{
        '--cover-color': COVER.color,
        '--spine-color': COVER.spineColor,
        '--text-color': COVER.textColor,
        '--accent-color': COVER.accentColor,
      }}
    >
      <div className={styles.bookCoverSpine} />
      <div className={styles.bookCoverContent}>
        <p className={styles.bookCoverCategory}>Member Access</p>
        <div className="flex flex-col items-center gap-4">
          <img
            src={`/${env.VITE_APP_URL}/brandLogo.png`}
            alt="Brand Logo"
            className="w-28 h-28 object-contain rounded-full opacity-90"
          />
          <h2 style={{ color: COVER.textColor, fontSize: '1.5rem', fontFamily: 'Georgia, serif' }}>
            The Book Store
          </h2>
          <p style={{ color: COVER.accentColor, fontSize: '0.8rem', textAlign: 'center' }}>
            Sign in or create an account to explore your library
          </p>
        </div>
        <span className={styles.bookCoverOrnament}>✦</span>
      </div>
    </div>
  );
}

function BackCover() {
  return (
    <div
      className={styles.bookCover}
      style={{
        '--cover-color': '#493323',
        '--spine-color': '#2E2017',
        '--text-color': '#FFF4D8',
        '--accent-color': '#D9B77C',
      }}
    >
      <div className={styles.bookCoverSpine} />
      <div className={styles.bookCoverContent}>
        <p className={styles.bookCoverCategory}>The Book Store</p>
        <div className="flex flex-col items-center gap-3">
          <BookOpen size={40} style={{ color: '#D9B77C' }} />
          <p style={{ color: '#D9B77C', fontSize: '0.85rem', textAlign: 'center', fontFamily: 'Georgia, serif' }}>
            "A reader lives a thousand lives before he dies."
          </p>
          <p style={{ color: '#FFF4D8', fontSize: '0.7rem' }}>— George R.R. Martin</p>
        </div>
        <span className={styles.bookCoverOrnament}>✦</span>
      </div>
    </div>
  );
}

function LoginPage({ onGoRegister }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await loginUser(form);
    setLoading(false);
    if (res.success) {
      console.log('res: ', res)
      setSecureToken(res.data.accessToken);
      setSecureUser(res.data.user);
      navigate(location.state?.from || '/', { replace: true });
    }
    else setError(res.message);
  };

  return (
    <NoFlip
      className={styles.page}
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
    >
      <p className={styles.pageLabel}>Welcome Back</p>
      <h2 style={{ fontSize: '1.3rem', color: '#294C3B', marginBottom: '4px', fontFamily: 'Georgia, serif' }}>
        Sign In
      </h2>
      <p style={{ fontSize: '0.72rem', color: '#92754f', marginBottom: '20px' }}>
        Access your personal library
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label style={labelStyle}>EMAIL</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jordan@example.com"
            style={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label style={labelStyle}>PASSWORD</label>
          <div style={{ position: 'relative' }}>
            <input
              name="password"
              type={showPass ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{ ...inputStyle, padding: '8px 36px 8px 12px' }}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              style={{
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#92754f',
              }}
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {error && <p style={{ fontSize: '0.72rem', color: '#c0392b' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '4px', padding: '10px', borderRadius: '8px',
            background: '#294C3B', color: '#FFF4D8', fontWeight: 600,
            fontSize: '0.82rem', border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, letterSpacing: '0.05em',
          }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <button
        type="button"
        onClick={onGoRegister}
        style={{
          marginTop: '16px', background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '0.72rem', color: '#92754f', display: 'flex', alignItems: 'center', gap: '4px',
        }}
      >
        No account? Create one <ArrowRight size={12} />
      </button>

      <span className={styles.pageNumber}>01 / 02</span>
    </NoFlip>
  );
}

function RegisterPage({ onGoLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const res = await registerUser(form);
    setLoading(false);
    if (res.success) {
      setSuccess('Account created! You can now sign in.');
      setForm({ name: '', email: '', password: '' });
    } else {
      setError(res.message);
    }
  };

  return (
    <NoFlip
      className={styles.page}
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
    >
      <p className={styles.pageLabel}>Join Us</p>
      <h2 style={{ fontSize: '1.3rem', color: '#493323', marginBottom: '4px', fontFamily: 'Georgia, serif' }}>
        Create Account
      </h2>
      {/* <p style={{ fontSize: '0.72rem', color: '#92754f', marginBottom: '16px' }}>
        Start your reading journey
      </p> */}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label style={labelStyle}>FULL NAME</label>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jordan Smith"
            style={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label style={labelStyle}>EMAIL</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jordan@example.com"
            style={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label style={labelStyle}>PASSWORD</label>
          <div style={{ position: 'relative' }}>
            <input
              name="password"
              type={showPass ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{ ...inputStyle, padding: '8px 36px 8px 12px' }}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              style={{
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#92754f',
              }}
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {error && <p style={{ fontSize: '0.72rem', color: '#c0392b' }}>{error}</p>}
        {success && <p style={{ fontSize: '0.72rem', color: '#294C3B', fontWeight: 600 }}>{success}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '4px', padding: '10px', borderRadius: '8px',
            background: '#493323', color: '#FFF4D8', fontWeight: 600,
            fontSize: '0.82rem', border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, letterSpacing: '0.05em',
          }}
        >
          {loading ? 'Creating…' : 'Create Account'}
        </button>
      </form>

      <button
        type="button"
        onClick={onGoLogin}
        style={{
          marginTop: '16px', background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '0.72rem', color: '#92754f', display: 'flex', alignItems: 'center', gap: '4px',
        }}
      >
        <ArrowLeft size={12} /> Already have account? Sign in
      </button>

      <span className={styles.pageNumber}>02 / 02</span>
    </NoFlip>
  );
}

export default function Login() {
  const bookRef = useRef(null);
  const navigate = useNavigate();
  const isLap = window.innerWidth > 480;

  const flipTo = (index) => bookRef.current?.pageFlip().flip(index);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#f5f5f5]">
      <div className="w-full flex justify-start items-center px-5 py-2">
        <Button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-[#4b3628] mb-3 cursor-pointer bg-transparent border-none"
        >
          <ChevronLeft size={16} /> Back to Home
        </Button>
      </div>

      <div>
        <main className={styles.library}>
          <div className={styles.bookContainer}>
            <HTMLFlipBook
              ref={bookRef}
              width={320}
              height={480}
              size="stretch"
              minWidth={280}
              maxWidth={650}
              minHeight={400}
              maxHeight={800}
              maxShadowOpacity={0.45}
              showCover={true}
              usePortrait={!isLap}
              mobileScrollSupport={false}
              flippingTime={900}
              useMouseEvents={false}      // no drag / click-to-flip
              clickEventForward={true}    // clicks reach inputs & buttons
              disableFlipByClick={true}
              swipeDistance={0}
              className="flip-book"
            >
              {/* Page 0 — Front cover (click the button below to open) */}
              <div className={styles.page} data-density="hard">
                <FrontCover />
              </div>

              {/* Page 1 — Login */}
              <div className={styles.page}>
                <LoginPage onGoRegister={() => flipTo(2)} />
              </div>

              {/* Page 2 — Register */}
              <div className={styles.page}>
                <RegisterPage onGoLogin={() => flipTo(1)} />
              </div>

              {/* Page 3 — Back cover */}
              <div className={styles.page} data-density="hard">
                <BackCover />
              </div>
            </HTMLFlipBook>
          </div>
        </main>
      </div>

      {/* Since mouse flipping is off, the cover needs an explicit way to open the book */}
      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          style={{ fontSize: '0.8rem', color: '#4b3628', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => bookRef.current?.pageFlip().flipNext()}
          style={{ fontSize: '0.8rem', color: '#4b3628', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}