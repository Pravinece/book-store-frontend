import { useEffect, useState } from "react";
import { Plus, Download, X, Check, Loader2, Search } from "lucide-react";
import { createSale, getSales, exportSalesCSV } from "../../app/api/adminapi";
import DateRangePicker from "../../components/DateRangePicker";
import BookSearchSelect from "../../components/BookSearchSelect";
import { formatPrice } from "../../utils/format";

const LIMIT = 20;

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-[#294C3B] text-base">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18} /></button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

function RecordSaleModal({ onClose, onDone }) {
  const [form, setForm] = useState({ bookId: "", quantity: 1, buyerName: "", buyerMobile: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.bookId || !form.buyerName || !form.buyerMobile) {
      setError("Book, buyer name and mobile are required.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await createSale({ ...form, quantity: Number(form.quantity) });
    setLoading(false);
    if (res.success) { onDone(res.data); onClose(); }
    else setError(res.message);
  };

  const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#294C3B] transition w-full";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Book</label>
        <BookSearchSelect
          value={form.bookId}
          onChange={(bookId) => set("bookId", bookId)}
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantity</label>
        <input type="number" min={1} value={form.quantity} onChange={e => set("quantity", e.target.value)} className={inputCls} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Buyer Name</label>
        <input type="text" value={form.buyerName} onChange={e => set("buyerName", e.target.value)} placeholder="Full name" className={inputCls} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Buyer Mobile</label>
        <input type="tel" value={form.buyerMobile} onChange={e => set("buyerMobile", e.target.value)} placeholder="+91..." className={inputCls} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Note (optional)</label>
        <textarea value={form.note} onChange={e => set("note", e.target.value)} rows={2} className={`${inputCls} resize-none`} />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm border border-gray-200 cursor-pointer">Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer disabled:opacity-50"
          style={{ background: "#294C3B" }}
        >
          {loading ? <Loader2 size={14} className="animate-spin inline" /> : <><Check size={14} className="inline mr-1" />Record Sale</>}
        </button>
      </div>
    </div>
  );
}

function SaleReceiptModal({ sale, onClose }) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2">
        <Row label="Book" value={sale.bookName} />
        <Row label="Qty" value={sale.quantity} />
        <Row label="Unit Price" value={formatPrice(sale.unitPrice)} />
        <Row label="Total" value={<span className="font-bold text-[#294C3B]">{formatPrice(sale.totalAmount)}</span>} />
        <hr className="border-gray-200 my-1" />
        <Row label="Buyer" value={sale.buyerName} />
        <Row label="Mobile" value={sale.buyerMobile} />
        {sale.note && <Row label="Note" value={sale.note} />}
        <Row label="Sold by" value={sale.soldByName} />
        <Row label="Date" value={new Date(sale.soldAt).toLocaleString()} />
      </div>
      <div className="flex justify-end">
        <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ background: "#294C3B" }}>Close</button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-gray-400 text-xs uppercase tracking-wide shrink-0">{label}</span>
      <span className="text-gray-800 text-right">{value}</span>
    </div>
  );
}

export default function SalesPanel() {
  const [sales, setSales] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRecord, setShowRecord] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [q, setQ] = useState("");
  const [dateRange, setDateRange] = useState({ dateFrom: "", dateTo: "" });

  const totalPages = Math.ceil(total / LIMIT);

  const load = () => {
    setLoading(true);
    getSales({ page, limit: LIMIT, q, ...dateRange }).then(res => {
      setLoading(false);
      if (res.success) { setSales(res.data.items || []); setTotal(res.data.total || 0); }
      else setError(res.message);
    });
  };

  useEffect(() => { setPage(1); }, [q, dateRange]);
  useEffect(() => { load(); }, [q, dateRange, page]);

  const handleExport = () => exportSalesCSV(dateRange);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#294C3B]">Sales</h2>
          <p className="text-xs text-gray-400">{total} records</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">
            <Download size={13} /> Export CSV
          </button>
          <button
            onClick={() => setShowRecord(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
            style={{ background: "#294C3B" }}
          >
            <Plus size={15} /> Record Sale
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white flex-1 min-w-[180px]">
          <Search size={14} className="text-gray-400" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search by mobile number…"
            className="text-sm outline-none bg-transparent flex-1"
          />
        </div>
        <DateRangePicker dateFrom={dateRange.dateFrom} dateTo={dateRange.dateTo} onChange={setDateRange} />
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-[#294C3B]" /></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: "#294C3B", color: "#FFF4D8" }}>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide">Book</th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide hidden sm:table-cell">Buyer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide hidden md:table-cell">Mobile</th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide">Qty</th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-center text-xs font-semibold tracking-wide">View</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No sales found</td></tr>
              )}
              {sales.map((sale, i) => (
                <tr key={sale.id} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-[#f5ede0] transition`}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 line-clamp-1">{sale.bookName}</p>
                    <p className="text-xs text-gray-400 sm:hidden">{sale.buyerName}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{sale.buyerName}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{sale.buyerMobile}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{sale.quantity}</td>
                  <td className="px-4 py-3 text-right font-semibold text-[#294C3B]">{formatPrice(sale.totalAmount)}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{new Date(sale.soldAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setReceipt(sale)} className="text-xs text-[#294C3B] font-semibold hover:underline cursor-pointer">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
          <p className="text-xs text-gray-400">Page {page} of {totalPages} · {total} total</p>
          <div className="flex gap-1">
            <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50 cursor-pointer">«</button>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50 cursor-pointer">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => { if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...'); acc.push(p); return acc; }, [])
              .map((p, i) => p === '...' ? (
                <span key={`e${i}`} className="px-2 py-1.5 text-xs text-gray-400">…</span>
              ) : (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer ${page === p ? 'border-[#294C3B] bg-[#294C3B] text-white' : 'border-gray-200 hover:bg-gray-50'}`}>{p}</button>
              ))}
            <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50 cursor-pointer">Next</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50 cursor-pointer">»</button>
          </div>
        </div>
      )}

      {showRecord && <Modal title="Record Sale" onClose={() => setShowRecord(false)}><RecordSaleModal onClose={() => setShowRecord(false)} onDone={(sale) => { setReceipt(sale); load(); }} /></Modal>}
      {receipt && <Modal title="Sale Details" onClose={() => setReceipt(null)}><SaleReceiptModal sale={receipt} onClose={() => setReceipt(null)} /></Modal>}
    </div>
  );
}
