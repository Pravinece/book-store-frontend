import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Loader2, Upload } from "lucide-react";
import { getCategories, createCategory, updateCategory, deleteCategory, uploadImage } from "../../app/api/adminapi";
import toast from "../../components/Toast";

const EMPTY = { categoryName: "", description: "", imageUrl: "" };

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-[#294C3B] text-base">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18} /></button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

function CategoryForm({ initial = EMPTY, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial);
  console.log('form: ', form);
  const [imgLoading, setImgLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgLoading(true);
    const res = await uploadImage("categories", file);
    setImgLoading(false);
    if (res.success) {toast.success("Uploaded Successfully."),set("imageUrl", `${import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL : 'https://book-store-backend-czfy.onrender.com'}${res.imageUrl}`)}
    else {toast.error(res.message);}
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
      {field("Name", "categoryName", "text", { placeholder: "Fiction" })}
      {/* {field("Slug", "slug", "text", { placeholder: "fiction" })} */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
        <textarea
          value={form.description}
          onChange={e => set("description", e.target.value)}
          rows={3}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#294C3B] transition resize-none"
        />
      </div>

      {/* <div className="grid grid-cols-2 gap-3">
        {[["Cover Color", "color"], ["Spine Color", "spineColor"], ["Text Color", "textColor"], ["Accent Color", "accentColor"]].map(([label, key]) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5">
              <input type="color" value={form[key]} onChange={e => set(key, e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent" />
              <span className="text-xs text-gray-500">{form[key]}</span>
            </div>
          </div>
        ))}
      </div> */}

      {/* <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cover Image</label>
        {form.imageUrl && <img src={form.imageUrl} alt="preview" className="w-full h-32 object-cover rounded-lg mb-2" />}
        <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-[#294C3B] transition text-sm text-gray-500">
          {imgLoading ? <Loader2 size={14} className="animate-spin" /> : "Upload image"}
          <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </label>
      </div> */}
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
          disabled={loading || !form.categoryName}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer disabled:opacity-50"
          style={{ background: "#294C3B" }}
        >
          {loading ? <Loader2 size={14} className="animate-spin inline" /> : <><Check size={14} className="inline mr-1" />Save</>}
        </button>
      </div>
    </div>
  );
}

export default function CategoriesPanel() {
  const [categories, setCategories] = useState([]);
  console.log('categories: ', categories);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // null | { mode: 'create' | 'edit', data }
  const [deleteId, setDeleteId] = useState(null);

  const load = () => {
    setLoading(true);
    getCategories().then(res => {
      setLoading(false);
      if (res.success) setCategories(res.data?.items || res.data?.categories || (Array.isArray(res.data) ? res.data : []));
      else setError(res.message);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    const res = modal.mode === "create"
    ? await createCategory(form)
    : await updateCategory(modal.data.id, form);
    setSaving(false);
    if (res.success) { toast.success("Successfully Done."),setModal(null); load(); }
    else setError(res.message),toast.error(res.message);
  };

  const handleDelete = async () => {
    setSaving(true);
    const res = await deleteCategory(deleteId);
    setSaving(false);
    setDeleteId(null);
    if (res.success) load(),toast.success("Deleted Successfully");
    else setError(res.message), toast.error(res.message);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#294C3B]">Categories</h2>
          <p className="text-xs text-gray-400">{categories.length} total</p>
        </div>
        <button
          onClick={() => setModal({ mode: "create", data: EMPTY })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
          style={{ background: "#294C3B" }}
        >
          <Plus size={15} /> New Category
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-[#294C3B]" /></div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition">
              {cat.imageUrl && <img src={cat.imageUrl} alt={cat.categoryName} className="w-full h-28 object-cover" />}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                    <span className="font-semibold text-sm text-gray-800">{cat.categoryName}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setModal({ mode: "edit", data: cat })} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#294C3B] cursor-pointer"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cat.description}</p>
                <span className="inline-block mt-2 text-[10px] bg-gray-100 text-gray-500 rounded px-2 py-0.5">{cat.slug}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === "create" ? "New Category" : "Edit Category"} onClose={() => setModal(null)}>
          <CategoryForm initial={modal.data} onSave={handleSave} onCancel={() => setModal(null)} loading={saving} />
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Category" onClose={() => setDeleteId(null)}>
          <p className="text-sm text-gray-600 mb-4">This will permanently delete the category. Books inside it must be removed first.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg text-sm border border-gray-200 cursor-pointer">Cancel</button>
            <button onClick={handleDelete} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 cursor-pointer disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin inline" /> : "Delete"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
