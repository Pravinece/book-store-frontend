import React from "react";

function NotFound() {
    const BASE = import.meta.env.VITE_APP_URL;

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary3 p-4">
      <div className="text-center">
        <p className="text-8xl font-black text-brand1">
          404
        </p>
        <h1 className="text-2xl font-bold text-bg1 mt-4">
          Not Found !
        </h1>
        <a
          href={`/${BASE}/`}
          className="mt-6 inline-block border-write border-1 bg-secondary1 px-6 py-2.5 bg-brand-600 text-write rounded-xl font-medium hover:bg-brand-700"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}

export default NotFound;
