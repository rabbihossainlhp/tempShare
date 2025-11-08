import React from 'react';

export default function Navbar({ theme, toggleTheme }) {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between navbar">
      <div className="flex items-center gap-3">
        <div className="logo flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">TS</div>
          <div>
            <div className="text-lg font-bold text-primary">TempShare</div>
            <div className="text-xs text-muted">Instant temporary sharing</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <a className="text-sm text-primary hover:underline" href="#">Home</a>
        <a className="text-sm text-primary hover:underline" href="#how">How it works</a>

        {/* Theme toggle on right */}
        <button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="ml-4 flex items-center gap-2 px-3 py-2 rounded-full outline-none transition theme-toggle"
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path>
            </svg>
          )}

          <span className="text-sm text-primary">{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </nav>
  );
}
