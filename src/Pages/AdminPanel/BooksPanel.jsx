import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, Check, Loader2, Upload, Download, PackagePlus, PackageMinus } from "lucide-react";
import { getAdminBooks, createBook, updateBook, deleteBook, patchBookStock, bulkUploadBooks, exportBooksCSV, uploadImage, getCategories } from "../../app/api/adminapi";
import toast from "../../components/Toast";

const EMPTY_BOOK = { name: "", author: "", publisher: "", description: "", categoryId: "", isbn: "", price: "", stock: "", imageUrl: "" };

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-[#294C3B] text-base">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18} /></button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

function BookForm({ initial = EMPTY_BOOK, categories = [], onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial);
  const [imgLoading, setImgLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgLoading(true);
    const res = await uploadImage("books", file);
    setImgLoading(false);
    if (res.success) set("imageUrl", res.imageUrl);
  };

  const field = (label, key, type = "text", extra = {}) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => set(key, e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#294C3B] transition"
        {...extra}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Title", "name", "text", { placeholder: "Book title" })}
        {field("Author", "author", "text", { placeholder: "Author name" })}
        {field("Publisher", "publisher", "text", { placeholder: "Publisher" })}
        {field("ISBN", "isbn", "text", { placeholder: "978-..." })}
        {field("Price", "price", "number", { placeholder: "0.00", min: 0 })}
        {field("Stock", "stock", "number", { placeholder: "0", min: 0 })}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</label>
        <select
          value={form.categoryId}
          onChange={e => set("categoryId", e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#294C3B] transition"
        >
          <option value="">Select category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
        <textarea
          value={form.description}
          onChange={e => set("description", e.target.value)}
          rows={3}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#294C3B] transition resize-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cover Image</label>
        {form.imageUrl && <img src={form.imageUrl} alt="preview" className="w-24 h-36 object-cover rounded-lg mb-2" />}
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={form.imageUrl}
            onChange={e => set("imageUrl", e.target.value)}
            placeholder="Paste image URL (e.g. https://...)"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#294C3B] transition"
          />
          <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-[#294C3B] transition text-sm text-gray-500">
            {imgLoading ? <Loader2 size={14} className="animate-spin" /> : <><Upload size={13} /> Or upload a file</>}
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer">Cancel</button>
        <button
          onClick={() => onSave(form)}
          disabled={loading || !form.name || !form.author}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer disabled:opacity-50"
          style={{ background: "#294C3B" }}
        >
          {loading ? <Loader2 size={14} className="animate-spin inline" /> : <><Check size={14} className="inline mr-1" />Save</>}
        </button>
      </div>
    </div>
  );
}

function StockModal({ book, onClose, onDone }) {
  const [delta, setDelta] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apply = async () => {
    if (delta === 0) return;
    setLoading(true);
    const res = await patchBookStock(book.id, Number(delta));
    setLoading(false);
    if (res.success) { onDone(); onClose(); }
    else setError(res.message);
  };

  return (
    <Modal title={`Adjust Stock — ${book.name}`} onClose={onClose}>
      <p className="text-sm text-gray-500 mb-3">Current stock: <strong className="text-gray-800">{book.stock}</strong></p>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setDelta(d => d - 1)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50"><PackageMinus size={14} /></button>
        <input
          type="number"
          value={delta}
          onChange={e => setDelta(e.target.value)}
          className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm text-center outline-none focus:border-[#294C3B]"
        />
        <button onClick={() => setDelta(d => d + 1)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50"><PackagePlus size={14} /></button>
        <span className="text-xs text-gray-400">→ New: <strong>{Number(book.stock) + Number(delta)}</strong></span>
      </div>
      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm border border-gray-200 cursor-pointer">Cancel</button>
        <button onClick={apply} disabled={loading || delta === 0} className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer disabled:opacity-50" style={{ background: "#294C3B" }}>
          {loading ? <Loader2 size={14} className="animate-spin inline" /> : "Apply"}
        </button>
      </div>
    </Modal>
  );
}

function BulkModal({ onClose, onDone }) {
  const [file, setFile] = useState(null);
  const [dryRun, setDryRun] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    const res = await bulkUploadBooks(file, dryRun);
    setLoading(false);
    if (res.success) { setResult(res.data), toast.success("Uploaded Successfully."); if (!dryRun) onDone(); }
    else setError(res.message), toast.error(res.message);
  };

  const downloadTemplate = () => {
  try {
    let url = `/${import.meta.env.VITE_APP_URL}/sample_books.csv`
    const a = document.createElement("a");
    a.href = url;
    a.download = "books_sample_template.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Template downloaded successfully!");
    return { success: true };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
  };

  return (
    <Modal title="Bulk Upload Books" onClose={onClose} wide>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Upload a CSV file to create multiple books at once.</p>
          <button onClick={downloadTemplate} className="flex items-center gap-1 text-xs text-[#294C3B] font-semibold hover:underline cursor-pointer">
            <Download size={13} /> Download Template
          </button>
        </div>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-8 cursor-pointer hover:border-[#294C3B] transition">
          <Upload size={24} className="text-gray-300 mb-2" />
          <span className="text-sm text-gray-400">{file ? file.name : "Click to select CSV"}</span>
          <input type="file" accept=".csv" className="hidden" onChange={e => setFile(e.target.files[0])} />
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={dryRun} onChange={e => setDryRun(e.target.checked)} className="rounded" />
          Dry run (validate only, don't save)
        </label>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {result && (
          <div className="bg-gray-50 rounded-xl p-4 text-sm">
            <p className="font-semibold text-gray-700 mb-2">{dryRun ? "Dry Run Result" : "Upload Result"}</p>
            <pre className="text-xs text-gray-500 overflow-auto max-h-40">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm border border-gray-200 cursor-pointer">Close</button>
          <button onClick={handleUpload} disabled={!file || loading} className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer disabled:opacity-50" style={{ background: "#294C3B" }}>
            {loading ? <Loader2 size={14} className="animate-spin inline" /> : dryRun ? "Validate" : "Upload"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function BooksPanel() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [modal, setModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [stockBook, setStockBook] = useState(null);
  const [showBulk, setShowBulk] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  const load = () => {
    setLoading(true);
    Promise.all([
      getAdminBooks({ q: search, categoryId: filterCat, page, limit: LIMIT }),
      getCategories()
    ]).then(([bRes, cRes]) => {
      setLoading(false);
      if (bRes.success) {
        setBooks(bRes.data?.items || []);
        setTotal(bRes.data?.total || 0);
      }
      if (cRes.success) setCategories(cRes.data?.items || cRes.data?.categories || (Array.isArray(cRes.data) ? cRes.data : []));
    });
  };

  useEffect(() => { setPage(1); }, [search, filterCat]);
  useEffect(() => { load(); }, [search, filterCat, page]);

  const totalPages = Math.ceil(total / LIMIT);

  const handleSave = async (form) => {
    setSaving(true);
    const payload = {
      name: form.name,
      author: form.author,
      publisher: form.publisher,
      description: form.description,
      categoryId: form.categoryId,
      isbn: form.isbn,
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrl: form.imageUrl,
    };
    const res = modal.mode === "create"
    ? await createBook(payload)
    : await updateBook(modal.data.id, payload);
    setSaving(false);
    if (res.success) { toast.success("successfully Done."), setModal(null); load(); }
    else setError(res.message), toast.error(res.message);
  };

  const handleDelete = async () => {
    setSaving(true);
    const res = await deleteBook(deleteId);
    setSaving(false);
    setDeleteId(null);
    if (res.success) load(), toast.success("Book deleted successfully!");
    else setError(res.message), toast.error(res.message);
  };

  const catName = (id) => categories.find(c => c.id === id)?.name || "—";

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#294C3B]">Books</h2>
          <p className="text-xs text-gray-400">{total} records</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => exportBooksCSV()} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">
            <Download size={13} /> Export BookList 
          </button>
          <button onClick={() => setShowBulk(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">
            <Upload size={13} /> Bulk Upload
          </button>
          <button
            onClick={() => setModal({ mode: "create", data: EMPTY_BOOK })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
            style={{ background: "#294C3B" }}
          >
            <Plus size={15} /> New Book
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search title, author…"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#294C3B] flex-1 min-w-[180px]"
        />
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#294C3B]"
        >
          <option value="">All categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
        </select>
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
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide">Cover</th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide hidden sm:table-cell">Author</th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide">Price</th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide">Stock</th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide hidden md:table-cell">Sold</th>
                <th className="px-4 py-3 text-center text-xs font-semibold tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400 text-sm">No books found</td></tr>
              )}
              {books.map((book, i) => (
                <tr key={book.id} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-[#f5ede0] transition`}>
                  <td className="px-4 py-3">
                    {book.imageUrl
                      ? <img src={book.imageUrl} alt={book.name} className="w-8 h-12 object-cover rounded" />
                      : <div className="w-8 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-300 text-xs">N/A</div>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 line-clamp-1">{book.name}</p>
                    <p className="text-xs text-gray-400 sm:hidden">{book.author}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{book.author}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-0.5">{book.categoryName}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">₹{book.price}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${book.stock === 0 ? "text-red-500" : book.stock <= 5 ? "text-orange-500" : "text-[#294C3B]"}`}>{book.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-400 hidden md:table-cell">{book.soldCount ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setStockBook(book)} title="Adjust stock" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#294C3B] cursor-pointer"><PackagePlus size={14} /></button>
                      <button onClick={() => setModal({ mode: "edit", data: book })} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#294C3B] cursor-pointer"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteId(book.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer"><Trash2 size={14} /></button>
                    </div>
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
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
            >«</button>
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
            >Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) => p === '...' ? (
                <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-xs text-gray-400">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer ${
                    page === p ? 'border-[#294C3B] bg-[#294C3B] text-white' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >{p}</button>
              ))
            }
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
            >Next</button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-2 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
            >»</button>
          </div>
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === "create" ? "New Book" : "Edit Book"} onClose={() => setModal(null)} wide>
          <BookForm initial={modal.data} categories={categories} onSave={handleSave} onCancel={() => setModal(null)} loading={saving} />
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Book" onClose={() => setDeleteId(null)}>
          <p className="text-sm text-gray-600 mb-4">This will permanently delete the book and cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg text-sm border border-gray-200 cursor-pointer">Cancel</button>
            <button onClick={handleDelete} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 cursor-pointer disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin inline" /> : "Delete"}
            </button>
          </div>
        </Modal>
      )}

      {stockBook && <StockModal book={stockBook} onClose={() => setStockBook(null)} onDone={load} />}
      {showBulk && <BulkModal onClose={() => setShowBulk(false)} onDone={load} />}
    </div>
  );
}
