
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

const config = {
  success: {
    title: "Success",
    Icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    bar: "bg-emerald-500",
  },
  error: {
    title: "Error",
    Icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    bar: "bg-red-500",
  },
  warning: {
    title: "Warning",
    Icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    bar: "bg-amber-500",
  },
  info: {
    title: "Information",
    Icon: Info,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    bar: "bg-blue-500",
  },
};

let addToast;
let id = 0;

export const toast = {
  success: (message, options) =>
    addToast?.("success", message, options),
  error: (message, options) =>
    addToast?.("error", message, options),
  warning: (message, options) =>
    addToast?.("warning", message, options),
  info: (message, options) =>
    addToast?.("info", message, options),
};

function ToastItem({ item, remove }) {
  const [closing, setClosing] = useState(false);
  const c = config[item.type];
  const Icon = c.Icon;

  useEffect(() => {
    const timer = setTimeout(() => setClosing(true), item.duration);
    return () => clearTimeout(timer);
  }, [item.duration]);

  useEffect(() => {
    if (!closing) return;

    const timer = setTimeout(() => remove(item.id), 250);
    return () => clearTimeout(timer);
  }, [closing, item.id, remove]);

  return (
    <div
      role={item.type === "error" ? "alert" : "status"}
      className={`overflow-hidden rounded-xl border ${c.border}
        bg-white shadow-lg ${
          closing ? "toast-exit" : "toast-enter"
        }`}
    >
      <div className="flex items-start gap-3 p-4">
        <div className={`rounded-full p-2 ${c.bg}`}>
          <Icon size={22} className={c.color} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">
            {item.title || c.title}
          </p>
          <p className="mt-1 break-words text-sm text-gray-600">
            {item.message}
          </p>
        </div>

        <button
          onClick={() => setClosing(true)}
          aria-label="Close toast"
          className="rounded-md p-1 text-gray-400 hover:bg-gray-100"
        >
          <X size={18} />
        </button>
      </div>

      <div className="h-1 bg-gray-100">
        <div
          className={`toast-progress h-full ${c.bar}`}
          style={{ animationDuration: `${item.duration}ms` }}
        />
      </div>
    </div>
  );
}

function ToastContainer() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    addToast = (type, message, options = {}) => {
      const item = {
        id: ++id,
        type,
        message: String(message ?? ""),
        title: options.title,
        duration: options.duration ?? 3000,
      };

      setItems((current) => [...current, item]);
    };

    return () => {
      addToast = undefined;
    };
  }, []);

  const remove = React.useCallback((itemId) => {
    setItems((current) =>
      current.filter((item) => item.id !== itemId)
    );
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[99999]
      flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {items.map((item) => (
        <div key={item.id} className="pointer-events-auto">
          <ToastItem item={item} remove={remove} />
        </div>
      ))}
    </div>
  );
}

let root;

if (typeof document !== "undefined") {
  let container = document.getElementById("global-toast-root");

  if (!container) {
    container = document.createElement("div");
    container.id = "global-toast-root";
    document.body.appendChild(container);
  }

  root = createRoot(container);
  root.render(<ToastContainer />);
}

export default toast;
