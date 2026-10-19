import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LayoutGrid } from 'lucide-react';
import { getCategoryPerformance } from '../../app/api/dashboardapi';

const COLORS = ['#294C3B', '#C65B27', '#6B8F5E', '#493323', '#4A7C6F', '#8B5E3C', '#2E6B4F'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fffaf0', border: '1px solid #d8c6a9', borderRadius: '8px', padding: '10px 14px', fontSize: '0.75rem', color: '#34291f' }}>
      <p style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</p>
      <p>Revenue: <strong>₹{payload[0]?.value?.toLocaleString()}</strong></p>
      <p>Units Sold: <strong>{payload[1]?.value}</strong></p>
      <p>Titles: <strong>{payload[2]?.value}</strong></p>
    </div>
  );
}

export default function CategoryPerformance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategoryPerformance().then((res) => {
      setLoading(false);
      if (res.success) setData(res.data.map(d => ({ ...d, name: d.categoryName })));
      else setError(res.message);
    });
  }, []);

  return (
    <div style={{ background: '#fffaf0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(125,88,56,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <LayoutGrid size={18} color="#C65B27" />
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#294C3B', fontFamily: 'Georgia, serif' }}>Category Performance</span>
      </div>

      {loading && <p style={{ textAlign: 'center', color: '#92754f', fontSize: '0.8rem', padding: '40px 0' }}>Loading…</p>}
      {error && <p style={{ textAlign: 'center', color: '#c0392b', fontSize: '0.8rem' }}>{error}</p>}

      {!loading && !error && (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9e0d2" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#92754f' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#92754f' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#e9e0d220' }} />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
              <Bar dataKey="unitsSold" radius={[4, 4, 0, 0]} fill="#E9D8B8" />
              <Bar dataKey="titles" radius={[4, 4, 0, 0]} fill="#d8c6a9" />
            </BarChart>
          </ResponsiveContainer>

          {/* Summary table for mobile */}
          <div style={{ marginTop: '16px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem', fontFamily: 'Georgia, serif' }}>
              <thead>
                <tr style={{ background: '#294C3B', color: '#FFF4D8' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>Revenue</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>Sold</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>Stock</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={row.categoryId} style={{ background: i % 2 === 0 ? 'transparent' : '#f5ede0' }}>
                    <td style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      {row.categoryName}
                    </td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', color: '#294C3B', fontWeight: 600 }}>₹{row.revenue.toLocaleString()}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right' }}>{row.unitsSold}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right' }}>{row.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
