import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { getSalesTrend } from '../../app/api/dashboardapi';

const DAYS_OPTIONS = [7, 30, 90];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fffaf0', border: '1px solid #d8c6a9', borderRadius: '8px', padding: '10px 14px', fontSize: '0.75rem', color: '#34291f' }}>
      <p style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</p>
      <p>Sales: <strong>{payload[0]?.value}</strong></p>
      <p>Units: <strong>{payload[1]?.value}</strong></p>
      <p>Revenue: <strong>₹{payload[2]?.value?.toLocaleString()}</strong></p>
    </div>
  );
}

export default function SalesTrend() {
  const [data, setData] = useState([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getSalesTrend(days).then((res) => {
      setLoading(false);
      if (res.success) setData(res.data.map(d => ({ ...d, date: d.date.slice(5) })));
      else setError(res.message);
    });
  }, [days]);

  return (
    <div style={{ background: '#fffaf0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(125,88,56,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="#294C3B" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#294C3B', fontFamily: 'Georgia, serif' }}>Sales Trend</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {DAYS_OPTIONS.map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              style={{
                padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                background: days === d ? '#294C3B' : '#e9e0d2',
                color: days === d ? '#FFF4D8' : '#4b3628',
              }}
            >{d}d</button>
          ))}
        </div>
      </div>

      {loading && <p style={{ textAlign: 'center', color: '#92754f', fontSize: '0.8rem', padding: '40px 0' }}>Loading…</p>}
      {error && <p style={{ textAlign: 'center', color: '#c0392b', fontSize: '0.8rem' }}>{error}</p>}
      {!loading && !error && (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#294C3B" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#294C3B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C65B27" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#C65B27" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9e0d2" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#92754f' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10, fill: '#92754f' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="sales" stroke="#294C3B" strokeWidth={2} fill="url(#salesGrad)" dot={false} />
            <Area type="monotone" dataKey="units" stroke="#6B8F5E" strokeWidth={1.5} fill="none" dot={false} strokeDasharray="4 2" />
            <Area type="monotone" dataKey="revenue" stroke="#C65B27" strokeWidth={2} fill="url(#revenueGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {!loading && !error && (
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
          {[{ label: 'Sales', color: '#294C3B' }, { label: 'Units', color: '#6B8F5E' }, { label: 'Revenue', color: '#C65B27' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#4b3628' }}>
              <span style={{ width: '10px', height: '3px', background: l.color, borderRadius: '2px', display: 'inline-block' }} />
              {l.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
