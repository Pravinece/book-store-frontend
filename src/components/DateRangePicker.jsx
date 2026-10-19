import { CalendarDays, X } from "lucide-react";

export default function DateRangePicker({ dateFrom, dateTo, onChange }) {
  const set = (k, v) => onChange({ dateFrom, dateTo, [k]: v });
  const clear = () => onChange({ dateFrom: "", dateTo: "" });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 bg-white">
        <CalendarDays size={14} className="text-gray-400" />
        <input
          type="date"
          value={dateFrom}
          onChange={e => set("dateFrom", e.target.value)}
          className="text-sm text-gray-700 outline-none bg-transparent"
        />
      </div>
      <span className="text-xs text-gray-400">to</span>
      <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 bg-white">
        <CalendarDays size={14} className="text-gray-400" />
        <input
          type="date"
          value={dateTo}
          min={dateFrom}
          onChange={e => set("dateTo", e.target.value)}
          className="text-sm text-gray-700 outline-none bg-transparent"
        />
      </div>
      {(dateFrom || dateTo) && (
        <button onClick={clear} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 cursor-pointer">
          <X size={13} /> Clear
        </button>
      )}
    </div>
  );
}
