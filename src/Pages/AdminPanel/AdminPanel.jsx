import { useState } from "react";
import { LayoutGrid, BookOpen, ArrowLeft, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoriesPanel from "./CategoriesPanel";
import BooksPanel from "./BooksPanel";
import SalesPanel from "./SalesPanel";

const TABS = [
  { id: "books", label: "Books", icon: BookOpen },
  { id: "categories", label: "Categories", icon: LayoutGrid },
  { id: "sales", label: "Sales", icon: ShoppingBag },
];

export default function AdminPanel() {
  const [tab, setTab] = useState("books");
  const navigate = useNavigate();

  return (
    <div className="h-[100%] overflow-auto max-w-[900px] w-[900px] min-w-[340px] animate-slideUp" style={{ background: "#f5f0e8" }}>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#294C3B] cursor-pointer"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <span className="text-gray-200">|</span>
            <span className="font-bold text-[#294C3B] text-sm tracking-wide">Admin Panel</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                    active ? "bg-white text-[#294C3B] shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="w-16" /> {/* spacer */}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          {tab === "books" && <BooksPanel />}
          {tab === "categories" && <CategoriesPanel />}
          {tab === "sales" && <SalesPanel />}
        </div>
      </div>
    </div>
  );
}
