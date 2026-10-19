import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { getLowStock } from '../../app/api/dashboardapi';

function StockBar({ stock, max = 5 }) {
  const pct = max === 0 ? 0 : Math.min((stock / max) * 100, 100);
  const color = stock === 0 ? '#c0392b' : stock <= 2 ? '#C65B27' : '#6B8F5E';
  return (
    <div style={{ height: '5px', background: '#e9e0d2', borderRadius: '4px', overflow: 'hidden', marginTop: '4px' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.4s' }} />
    </div>
  );
}

export default function LowStock() {
  const [data, setData] = useState([]);
  const [threshold, setThreshold] = useState(5);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetch = () => {
    setLoading(true);
    setError('');
    getLowStock({ threshold, limit }).then((res) => {
      setLoading(false);
      if (res.success) setData(res.data);
      else setError(res.message);
    });
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div style={{ background: '#fffaf0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(125,88,56,0.1)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="#C65B27" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#294C3B', fontFamily: 'Georgia, serif' }}>Low Stock</span>
          {!loading && <span style={{ background: '#C65B27', color: '#fff', borderRadius: '20px', padding: '1px 8px', fontSize: '0.68rem', fontWeight: 700 }}>{data.length}</span>}
        </div>
        <button onClick={fetch} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92754f', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <label style={{ fontSize: '0.65rem', color: '#92754f', fontWeight: 600, letterSpacing: '0.05em' }}>THRESHOLD</label>
          <input
            type="number" min={0} max={10000} value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            onBlur={fetch}
            style={{ width: '70px', padding: '5px 8px', borderRadius: '6px', border: '1px solid #d8c6a9', background: '#fffaf0', fontSize: '0.8rem', color: '#34291f', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <label style={{ fontSize: '0.65rem', color: '#92754f', fontWeight: 600, letterSpacing: '0.05em' }}>LIMIT</label>
          <input
            type="number" min={1} max={100} value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            onBlur={fetch}
            style={{ width: '70px', padding: '5px 8px', borderRadius: '6px', border: '1px solid #d8c6a9', background: '#fffaf0', fontSize: '0.8rem', color: '#34291f', outline: 'none' }}
          />
        </div>
      </div>

      {loading && <p style={{ textAlign: 'center', color: '#92754f', fontSize: '0.8rem', padding: '30px 0' }}>Loading…</p>}
      {error && <p style={{ textAlign: 'center', color: '#c0392b', fontSize: '0.8rem' }}>{error}</p>}

      {!loading && !error && data.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6B8F5E', fontSize: '0.8rem', padding: '30px 0' }}>✓ All books are well stocked</p>
      )}

      {!loading && !error && data.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
          {data.map((book) => {
            const stockColor = book.stock === 0 ? '#c0392b' : book.stock <= 2 ? '#C65B27' : '#4b3628';
            return (
              <div key={book.id} style={{ padding: '10px 12px', borderRadius: '10px', background: book.stock === 0 ? '#fff0ee' : '#f5ede0', border: `1px solid ${book.stock === 0 ? '#f5c6c0' : '#e1d4bf'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34291f', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.name}</p>
                    <p style={{ fontSize: '0.68rem', color: '#92754f', margin: '2px 0 0' }}>{book.author}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: stockColor, margin: 0 }}>{book.stock}</p>
                    <p style={{ fontSize: '0.65rem', color: '#92754f', margin: 0 }}>in stock</p>
                  </div>
                </div>
                <StockBar stock={book.stock} max={threshold} />
                <p style={{ fontSize: '0.65rem', color: '#92754f', margin: '4px 0 0' }}>{book.soldCount} sold</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
