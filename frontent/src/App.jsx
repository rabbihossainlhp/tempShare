import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

export default function App() {
  const [mode, setMode] = useState(null); // "share" | "access" | null
  const [theme, setTheme] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light'
  );
  const [sharePassword, setSharePassword] = useState("");
  const [shareContent, setShareContent] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [showSharePassword, setShowSharePassword] = useState(false);
  const [showAccessPassword, setShowAccessPassword] = useState(false);
  const [accessContent, setAccessContent] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const resetState = () => {
    setSharePassword("");
    setShareContent("");
    setAccessPassword("");
    setAccessContent(null);
    setMessage("");
  };

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore localStorage errors */
    }
    // also toggle a class on the root element for global CSS
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const handleShare = async () => {
    setMessage("");
    if (!sharePassword || !shareContent) {
      setMessage("Password and content are required.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("https://tempshare-e4md.onrender.com/temps/api/share_content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: sharePassword, content: shareContent }),
      });
      const data = await res.json();
      // console.log(data);
      if (data.status === "success") setMessage("✅ Content shared successfully!");
      else setMessage(data.message || "Something went wrong");
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
    setLoading(false);
  };

  const handleAccess = async () => {
    setMessage("");
    setAccessContent(null);
    if (!accessPassword) {
      setMessage("Password required");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`https://tempshare-e4md.onrender.com/temps/api/share_content?password=${encodeURIComponent(accessPassword)}`, { method: "GET" });

      const data = await res.json();
      // console.log(data);
      // accept either { status:'success', data: { ... } } or { message:'success', data: { ... } }
      const payload = data && (data.data ?? (data.content ? data : null));
      if (payload && typeof payload.content !== 'undefined') {
        // store the full payload (content + metadata)
        setAccessContent(payload);
        setMessage('');
      } else {
        setMessage(data.message || "Not found");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      console.error('copy failed', e);
      setMessage('Copy failed');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-theme ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      {/* Navbar */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-start p-6">
        {/* Home Buttons */}
        {mode === null && (
          <>
            <h2 className="text-3xl font-semibold heading mt-10 text-center">
              Secure & Temporary Content Sharing
            </h2>
            <p className="max-w-xl text-center lead mt-3">
              Share text, code, small notes with a temporary password. Retrieve instantly from anywhere — no sign‑up required.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mt-10">
              <button
                onClick={() => {
                  resetState();
                  setMode("share");
                }}
                className="px-8 py-3 btn-primary text-lg"
              >
                Share Content
              </button>

              <button
                onClick={() => {
                  resetState();
                  setMode("access");
                }}
                className="px-8 py-3 btn-accent text-lg"
              >
                Access Content
              </button>
            </div>

            <div className="mt-16 max-w-3xl text-center">
              <h3 className="text-xl font-bold heading mb-2">How it Works</h3>
              <p>Instantly store confidential short‑lived data. Simply set a password while sharing, and use the same password to retrieve later.</p>
              <p className="mt-2">Great for sharing code snippets, temporary notes, or small personal text across devices.</p>
            </div>
          </>
        )}

        {/* Share Mode */}
        {mode === "share" && (
          <div className={`w-full max-w-2xl rounded-2xl shadow-xl mt-6 card ${theme === 'dark' ? 'card-dark' : ''}`}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold heading mb-2">Share Content</h2>
              <p className="lead">Paste text or code below and protect it with a simple password.</p>
            </div>

            <textarea
              className="w-full input p-3 rounded-lg h-44 mb-4"
              placeholder="Paste your text/code here..."
              value={shareContent}
              onChange={(e) => setShareContent(e.target.value)}
            />
            <div className="relative mb-4">
              <input
                className="w-full input p-3 rounded-lg pr-12"
                type={showSharePassword ? "text" : "password"}
                placeholder="Set password"
                value={sharePassword}
                onChange={(e) => setSharePassword(e.target.value)}
              />

              <button
                type="button"
                className="icon-btn absolute right-3 top-3"
                onClick={() => setShowSharePassword(s => !s)}
                aria-label={showSharePassword ? 'Hide password' : 'Show password'}
              >
                {showSharePassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.32 20.32 0 0 1 5.06-6.06" />
                    <path d="M1 1l22 22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="flex-1 btn-primary p-3 rounded-lg"
                onClick={handleShare}
                disabled={loading}
              >
                {loading ? "Sharing..." : "Share Content"}
              </button>

              <button
                className="px-4 py-2 rounded-lg text-primary bg-transparent border border-transparent hover:bg-white/5"
                onClick={() => { setShareContent(''); setSharePassword(''); }}
              >
                Clear
              </button>
            </div>

            {message && <p className="text-center msg-error font-semibold mt-4">{message}</p>}

            <div className="mt-6 flex justify-between items-center">
              <button className="btn-ghost flex items-center gap-2" onClick={() => setMode(null)} aria-label="Back">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span className="font-medium">Back</span>
              </button>
              <div className="text-sm text-muted">Tip: use a short memorable password</div>
            </div>
          </div>
        )}

        {/* Access Mode */}
        {mode === "access" && (
          <div className={`w-full max-w-2xl rounded-2xl shadow-xl mt-6 card ${theme === 'dark' ? 'card-dark' : ''}`}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold heading mb-2">Access Content</h2>
              <p className="lead">Enter the password used when sharing to retrieve the content.</p>
            </div>

            <div className="relative mb-4">
              <input
                className="w-full input p-3 rounded-lg pr-12"
                type={showAccessPassword ? "text" : "password"}
                placeholder="Enter password"
                value={accessPassword}
                onChange={(e) => setAccessPassword(e.target.value)}
              />

              <button
                type="button"
                className="icon-btn absolute right-3 top-3"
                onClick={() => setShowAccessPassword(s => !s)}
                aria-label={showAccessPassword ? 'Hide password' : 'Show password'}
              >
                {showAccessPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.32 20.32 0 0 1 5.06-6.06" />
                    <path d="M1 1l22 22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="flex-1 btn-accent p-3 rounded-lg"
                onClick={handleAccess}
                disabled={loading}
              >
                {loading ? "Loading..." : "Access Content"}
              </button>

              <button
                className="px-4 py-2 rounded-lg text-primary bg-transparent border border-transparent hover:bg-white/5"
                onClick={() => { setAccessPassword(''); setAccessContent(null); }}
              >
                Clear
              </button>
            </div>

            {accessContent && (
              <div className="mt-5 access-box p-4 rounded-lg shadow-inner max-h-72 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm text-muted">Shared</div>
                    <div className="text-xs text-muted">{accessContent.createdAt ? new Date(accessContent.createdAt).toLocaleString() : ''}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-ghost px-3 py-2" onClick={() => copyToClipboard(accessContent.content)} aria-label="Copy content">Copy</button>
                    <button className="btn-ghost px-3 py-2" onClick={() => { const blob = new Blob([accessContent.content], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `tempshare-${accessContent._id || Date.now()}.txt`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }} aria-label="Download content">Download</button>
                  </div>
                </div>

                <pre className="whitespace-pre-wrap text-sm leading-relaxed">{accessContent.content}</pre>

                {copied && <div className="mt-2 text-xs text-primary">Copied!</div>}
              </div>
            )}

            {message && <p className="text-center msg-error font-semibold mt-4">{message}</p>}

            <div className="mt-6 flex justify-between items-center">
              <button className="btn-ghost flex items-center gap-2" onClick={() => setMode(null)} aria-label="Back">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span className="font-medium">Back</span>
              </button>
              <div className="text-sm text-muted">Stored items expire after use</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-4 footer">
        <p className="text-muted">© {new Date().getFullYear()} TempShare — Developed By <a href="https://github.com/rabbihossinlhp">Rabbi_hossain</a></p>
      </footer>
    </div>
  );
}
