import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import SalesTrend from './SalesTrend';
import CategoryPerformance from './CategoryPerformance';
import LowStock from './LowStock';
import { isAdmin } from '../../utils/RoleValidater';
import { getSecureUser } from '../../utils/cookieAuth';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className='h-[90%] overflow-auto max-w-[900px] w-[900px] min-w-[340px] animate-slideUp' style={{ background: '#e9e0d2', padding: '16px', boxSizing: 'border-box' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#294C3B', fontFamily: 'Georgia, serif' }}>Dashboard</h1>
          <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#92754f' }}>Store overview & analytics</p>
        </div>
        {isAdmin() && <button
          onClick={() => navigate('adminpanel')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 16px', borderRadius: '10px',
            background: '#294C3B', color: '#FFF4D8',
            fontWeight: 600, fontSize: '0.8rem',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(41,76,59,0.3)',
          }}
        >
          <ShieldCheck size={15} /> View Admin Panel
        </button>}
      </div>

      {/* Grid layout — 1 col mobile, 2 col tablet+, 3 col desktop */}
      <div style={{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      }}>
        {/* Sales Trend — full width on all screens */}
        <div style={{ gridColumn: '1 / -1' }}>
          <SalesTrend />
        </div>

        {/* Category Performance */}
        {isAdmin() && <CategoryPerformance />
}
        {/* Low Stock */}
        {isAdmin() && <LowStock />}
      </div>
    </div>
  );
}
