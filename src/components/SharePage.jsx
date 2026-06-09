import { useEffect, useState } from 'react';
import './CoachPage.css';
import './SharePage.css';

export default function SharePage() {
  const [conv, setConv] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const hash = window.location.hash.slice(1);
      if (!hash) { setError(true); return; }
      const decoded = JSON.parse(atob(hash));
      setConv(decoded);
    } catch {
      setError(true);
    }
  }, []);

  if (error) return (
    <div className="share-page-wrapper">
      <div className="share-error">
        <p>This share link is invalid or has expired.</p>
      </div>
    </div>
  );

  if (!conv) return (
    <div className="share-page-wrapper">
      <div className="share-loading">Loading conversation…</div>
    </div>
  );

  return (
    <div className="share-page-wrapper">
      <div className="future-noise" />
      <div className="future-grid" />
      <div className="future-glow glow-a" />

      <div className="share-header">
        <div className="share-brand">OBSIDURE</div>
        <div className="share-badge">Read-only · Shared conversation</div>
      </div>

      <div className="share-container">
        <div className="share-title-row">
          <h1 className="share-conv-title">{conv.title}</h1>
          <span className="share-date">{conv.date}</span>
        </div>

        <div className="share-messages">
          {conv.messages.map((msg, idx) => (
            <div key={idx} className={`matrix-row ${msg.role === 'user' ? 'user-row-align' : 'coach-row-align'}`}>
              <div className={`matrix-bubble ${msg.role === 'user' ? 'user-bubble-style' : 'coach-bubble-style'}`}>
                <div className="message-content">{msg.content}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="share-footer">
          <span>Shared from</span>
          <a href="/" className="share-footer-link">Obsidure</a>
          <span>· Read-only, no actions available</span>
        </div>
      </div>
    </div>
  );
}
