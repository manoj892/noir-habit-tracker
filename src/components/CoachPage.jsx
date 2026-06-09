import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './CoachPage.css';

/* ── Icons ─────────────────────────────────────────────── */
const SparkleIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936a2 2 0 0 0 1.437-1.437l1.582-6.135a.5.5 0 0 1 .963 0l1.582 6.135a2 2 0 0 0 1.437 1.437l6.135 1.582a.5.5 0 0 1 0 .963l-6.135 1.581a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /></svg>;
const FlameIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>;
const ZapIcon      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
const CompassIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" /></svg>;
const SendIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
const RetryIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>;
const SaveIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
const DownloadIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
const ShareIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
const CopyIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
const CheckIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
const ChevronIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>;
const EditIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const CalendarIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const PlusIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const MoreIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>;
const ChatsIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const CloseIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12" /></svg>;
const FileTextIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
const FilePdfIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 13h1a1 1 0 0 1 0 2H9v-2zm0 2v2m3-4h1.5a1.5 1.5 0 0 1 0 3H12v-3zm3 0v4" /></svg>;
const CrownIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M5 20V10l7-7 7 7v10" /></svg>;

const TIMELINE_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'week',  label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'year',  label: 'This Year' },
  { id: 'custom',label: 'Custom Range' },
];

const INITIAL_HISTORY = [
  { id: 1, title: 'Analyse my performance', date: '2 hours ago' },
  { id: 2, title: 'Weekly habit review',    date: 'Yesterday'   },
  { id: 3, title: 'Morning routine tips',   date: '3 days ago'  },
  { id: 4, title: 'Focus improvement',      date: '1 week ago'  },
];

const CONV_KEY = 'habitflow-saved-convs';
const FREE_CHATS = 5;

const getSavedConvs = () => {
  try { return JSON.parse(localStorage.getItem(CONV_KEY) || '[]') } catch { return [] }
};

/* ── Small Toast ────────────────────────────────────────── */
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div className="coach-toast"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.25 }}
    >
      <CheckIcon /> {message}
    </motion.div>
  );
}

/* ── Download Sheet ─────────────────────────────────────── */
function DownloadSheet({ title, onDownload, onClose }) {
  return (
    <>
      <motion.div className="coach-mobile-backdrop" style={{ display: 'block' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div className="download-sheet"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 240 }}
      >
        <div className="download-sheet-header">
          <span className="download-sheet-title">{title}</span>
          <button className="download-sheet-close" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="download-sheet-options">
          <button className="download-sheet-option" onClick={() => { onDownload('txt'); onClose(); }}>
            <span className="download-option-icon"><FileTextIcon /></span>
            <div>
              <div className="download-option-label">Plain Text</div>
              <div className="download-option-sub">.txt — lightweight, readable anywhere</div>
            </div>
          </button>
          <button className="download-sheet-option" onClick={() => { onDownload('pdf'); onClose(); }}>
            <span className="download-option-icon"><FilePdfIcon /></span>
            <div>
              <div className="download-option-label">PDF Document</div>
              <div className="download-option-sub">.pdf — formatted, shareable</div>
            </div>
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default function CoachPage() {
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // ── Auth & plan ────────────────────────────────────────
  const authUser = (() => { try { return JSON.parse(localStorage.getItem('habitflow-auth')) } catch { return null } })();
  const hasPlan  = authUser?.plan === 'pro';

  // Real-time saved convs — single source of truth
  const [savedConvs, setSavedConvs] = useState(getSavedConvs);
  const savedCount = savedConvs.length;
  const atChatLimit = !authUser && savedCount >= FREE_CHATS;

  // Auto-save with FIFO (max 5): called after each assistant reply
  const autoSave = useCallback((msgs) => {
    if (!msgs.length) return;
    const title = msgs.find(m => m.role === 'user')?.content?.slice(0, 40) || 'Chat';
    setSavedConvs(prev => {
      const entry = { id: Date.now(), title, date: new Date().toLocaleDateString(), msgs };
      const next = [entry, ...prev].slice(0, FREE_CHATS);
      localStorage.setItem(CONV_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const [messages,       setMessages]       = useState([]);
  const [input,          setInput]          = useState('');
  const [loading,        setLoading]        = useState(false);
  const [copiedId,       setCopiedId]       = useState(null);
  const [savedIds,       setSavedIds]       = useState(new Set());
  const [toast,          setToast]          = useState(null);

  const [selectedTimeline, setSelectedTimeline] = useState('week');
  const [showTimeline,     setShowTimeline]     = useState(false);
  const [showCustomDate,   setShowCustomDate]   = useState(false);
  const [customDateRange,  setCustomDateRange]  = useState({ start: '', end: '' });

  const [chatHistory,    setChatHistory]    = useState(INITIAL_HISTORY);
  const [activeConv,     setActiveConv]     = useState(null);
  const [activeMenuId,   setActiveMenuId]   = useState(null);
  const [downloadConvId, setDownloadConvId] = useState(null);
  const [renamingId,     setRenamingId]     = useState(null);
  const [renameValue,    setRenameValue]    = useState('');
  const [confirmDeleteId,setConfirmDeleteId]= useState(null);

  const [showChatDownload,   setShowChatDownload]   = useState(false);
  const [showMsgDownloadIdx, setShowMsgDownloadIdx] = useState(null);

  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileInput,   setShowMobileInput]   = useState(false);

  const [editingIdx,   setEditingIdx]   = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const holdTimerRef = useRef(null);
  const [holdConvId,        setHoldConvId]        = useState(null);
  const [holdDeleteConfirm, setHoldDeleteConfirm] = useState(false);
  const [holdDownloadOpen,  setHoldDownloadOpen]  = useState(false);

  const showToast = useCallback((msg) => setToast(msg), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-save after each assistant reply
  useEffect(() => {
    if (messages.length && messages[messages.length - 1]?.role === 'assistant') {
      autoSave(messages);
    }
  }, [messages, autoSave]);

  useEffect(() => {
    document.body.style.overflow =
      showMobileSidebar || showMobileInput || showChatDownload || showMsgDownloadIdx !== null
        ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showMobileSidebar, showMobileInput, showChatDownload, showMsgDownloadIdx]);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.timeline-dropdown-portal')) setShowTimeline(false);
      if (!e.target.closest('.custom-date-picker-wrap')) setShowCustomDate(false);
      if (!e.target.closest('.conversation-more-menu') &&
          !e.target.closest('.coach-conversation-more') &&
          !e.target.closest('.conversation-download-menu')) {
        setActiveMenuId(null);
        setDownloadConvId(null);
        setConfirmDeleteId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── chat ─────────────────────────────────────────────── */
  const simulateResponse = (userContent) => {
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `This is a simulated AI response to: "${userContent}". In the future, this will connect to your actual backend data!`,
      }]);
      setLoading(false);
    }, 1500);
  };

  const handleSend = (overrideInput) => {
    const text = (overrideInput ?? input).trim();
    if (!text || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    simulateResponse(text);
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleRetry = (idx) => {
    const userMsg = [...messages].slice(0, idx).reverse().find(m => m.role === 'user');
    if (!userMsg) return;
    setMessages(prev => prev.slice(0, idx));
    simulateResponse(userMsg.content);
  };

  /* ── copy / save ──────────────────────────────────────── */
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      showToast('Copied to clipboard');
    });
  };

  const handleSave = (id) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); showToast('Removed from saved'); }
      else              { next.add(id);    showToast('Response saved'); }
      return next;
    });
  };

  /* ── download ─────────────────────────────────────────── */
  const doDownload = (content, filename, format) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${filename}.${format}`; a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded as .${format}`);
  };

  const handleDownloadMsg  = (content, format) => doDownload(content, 'obsidure-coach-response', format);
  const handleDownloadChat = (format) => {
    const text = messages.length
      ? messages.map(m => `${m.role.toUpperCase()}:\n${m.content}`).join('\n\n---\n\n')
      : 'No messages yet.';
    doDownload(text, 'obsidure-conversation', format);
  };
  const handleDownloadConv = (id, format) => {
    const item = chatHistory.find(c => c.id === id);
    doDownload(`Conversation: ${item?.title}\n\n(Messages would populate here)`, item?.title ?? 'conversation', format);
    setDownloadConvId(null); setActiveMenuId(null);
  };

  /* ── share ────────────────────────────────────────────── */
  const handleShare = async (content) => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Obsidure Coach', text: content }); } catch {}
    } else {
      await navigator.clipboard.writeText(content);
      showToast('Copied to clipboard');
    }
  };

  /* ── timeline ─────────────────────────────────────────── */
  const handleTimelineSelect = (id) => {
    if (id === 'custom') { setShowCustomDate(true); }
    else { setSelectedTimeline(id); setShowCustomDate(false); }
    setShowTimeline(false);
  };

  const handleCustomApply = () => {
    if (customDateRange.start && customDateRange.end) {
      setSelectedTimeline('custom');
      setShowCustomDate(false);
    }
  };

  /* ── conversations ────────────────────────────────────── */
  const handleNewChat = () => {
    if (atChatLimit) return;
    const id = Date.now();
    setChatHistory(prev => [{ id, title: 'New Chat', date: 'Just now' }, ...prev]);
    setActiveConv(id); setMessages([]); setInput('');
    setShowMobileSidebar(false);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleRenameSubmit = (id) => {
    if (renameValue.trim()) setChatHistory(prev => prev.map(c => c.id === id ? { ...c, title: renameValue.trim() } : c));
    setRenamingId(null); setRenameValue('');
  };

  const handleDeleteChat = (id) => {
    setChatHistory(prev => prev.filter(c => c.id !== id));
    if (activeConv === id) { setMessages([]); setActiveConv(null); }
    setConfirmDeleteId(null); setActiveMenuId(null);
  };

  const handleShareConv = (id) => {
    const item = chatHistory.find(c => c.id === id);
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify({
      title: item?.title ?? 'Conversation', date: item?.date ?? '',
      messages: activeConv === id ? messages : [],
    }))));
    const shareUrl = `${window.location.origin}/share#${payload}`;
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile && navigator.share) {
      navigator.share({ title: `Obsidure — ${item?.title}`, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => showToast('Share link copied'));
    }
    setActiveMenuId(null);
  };

  /* ── edit message ─────────────────────────────────────── */
  const handleEditSubmit = (idx) => {
    if (!editingValue.trim()) return;
    setMessages([...messages.slice(0, idx), { role: 'user', content: editingValue.trim() }]);
    setEditingIdx(null); setEditingValue('');
    simulateResponse(editingValue.trim());
  };

  const timelineLabel = selectedTimeline === 'custom'
    ? `${customDateRange.start} – ${customDateRange.end}`
    : TIMELINE_OPTIONS.find(t => t.id === selectedTimeline)?.label ?? 'Week';

  /* ── long-press ───────────────────────────────────────── */
  const startHold = (id) => {
    holdTimerRef.current = setTimeout(() => {
      setHoldConvId(id); setHoldDeleteConfirm(false); setHoldDownloadOpen(false);
      if (navigator.vibrate) navigator.vibrate(40);
    }, 500);
  };
  const cancelHold = () => clearTimeout(holdTimerRef.current);
  const closeActionSheet = () => { setHoldConvId(null); setHoldDeleteConfirm(false); setHoldDownloadOpen(false); };

  /* ── Auth gate banner ─────────────────────────────────── */
  const AuthGateBanner = () => {
    if (authUser && hasPlan) return null; // fully unlocked

    if (!authUser) {
      // Not signed in at all
      return (
        <div className="coach-limit-banner">
          <div className="coach-limit-banner-row">
            <span>🔒 {savedCount}/{FREE_CHATS} chats saved</span>
          </div>
          <div className="coach-limit-actions">
            <a href="/signin" className="coach-limit-btn coach-limit-btn--primary">Sign in →</a>
            <a href="/pricing" className="coach-limit-btn coach-limit-btn--secondary"><CrownIcon /> Get Pro</a>
          </div>
        </div>
      );
    }

    // Signed in but no plan
    return (
      <div className="coach-limit-banner coach-limit-banner--signedin">
        <span className="coach-limit-signedin-label">👋 Signed in as {authUser.name || authUser.email}</span>
        <a href="/pricing" className="coach-limit-btn-small"><CrownIcon /> Upgrade to Pro</a>
      </div>
    );
  };

  /* ── ConversationList ─────────────────────────────────── */
  const ConversationList = ({ onSelect }) => (
    <div className="coach-conversation-list">
      {chatHistory.map((conv) => (
        <div key={conv.id} style={{ position: 'relative' }}>
          <div
            role="button" tabIndex={0}
            className={`coach-conversation-item ${activeConv === conv.id ? 'active' : ''}`}
            onClick={() => { setActiveConv(conv.id); onSelect?.(); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveConv(conv.id); onSelect?.(); } }}
            onPointerDown={() => startHold(conv.id)}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onContextMenu={(e) => { e.preventDefault(); setHoldConvId(conv.id); setHoldDeleteConfirm(false); setHoldDownloadOpen(false); }}
          >
            <div className="coach-conversation-content">
              {renamingId === conv.id ? (
                <input
                  className="coach-rename-input" autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSubmit(conv.id);
                    if (e.key === 'Escape') { setRenamingId(null); setRenameValue(''); }
                  }}
                  onBlur={() => handleRenameSubmit(conv.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="coach-conversation-title">{conv.title}</span>
              )}
              <span className="coach-conversation-date">{conv.date}</span>
            </div>
            <button
              className="coach-conversation-more"
              onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === conv.id ? null : conv.id); setDownloadConvId(null); setConfirmDeleteId(null); }}
            ><MoreIcon /></button>
          </div>

          <AnimatePresence>
            {activeMenuId === conv.id && (
              <motion.div className="conversation-more-menu" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}>
                {confirmDeleteId === conv.id ? (
                  <div className="conv-delete-confirm">
                    <span>Delete this chat?</span>
                    <div className="conv-delete-confirm-btns">
                      <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}>Cancel</button>
                      <button className="delete-text" onClick={(e) => { e.stopPropagation(); handleDeleteChat(conv.id); }}>Delete</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); setRenamingId(conv.id); setRenameValue(conv.title || ''); setActiveMenuId(null); }}>Rename</button>
                    <button onClick={(e) => { e.stopPropagation(); setDownloadConvId(conv.id); setActiveMenuId(null); }}>Download</button>
                    <button onClick={(e) => { e.stopPropagation(); handleShareConv(conv.id); }}>Share</button>
                    <button className="delete-text" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(conv.id); }}>Delete</button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {downloadConvId === conv.id && (
              <motion.div className="conversation-download-menu" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}>
                <button onClick={() => handleDownloadConv(conv.id, 'txt')}>Download as TXT</button>
                <button onClick={() => handleDownloadConv(conv.id, 'pdf')}>Download as PDF</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );

  /* ─────────────────────────────────────────────────────── */
  return (
    <>
      <AnimatePresence>
        {toast && <Toast key={toast + Date.now()} message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showChatDownload && (
          <DownloadSheet title="Download Conversation" onDownload={handleDownloadChat} onClose={() => setShowChatDownload(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMsgDownloadIdx !== null && (
          <DownloadSheet
            title="Download Response"
            onDownload={(fmt) => handleDownloadMsg(messages[showMsgDownloadIdx]?.content ?? '', fmt)}
            onClose={() => setShowMsgDownloadIdx(null)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Conversations Drawer */}
      <AnimatePresence>
        {showMobileSidebar && (
          <>
            <motion.div className="coach-mobile-backdrop" style={{ display: 'block' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMobileSidebar(false)}
            />
            <motion.div className="coach-mobile-drawer"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            >
              <div className="coach-mobile-drawer-header">
                <h2 className="coach-sidebar-title">Conversations</h2>
                <button className="coach-new-chat-btn" onClick={handleNewChat} disabled={atChatLimit}><PlusIcon /><span>New</span></button>
                <button className="coach-mobile-drawer-close" onClick={() => setShowMobileSidebar(false)}><CloseIcon /></button>
              </div>
              <ConversationList onSelect={() => setShowMobileSidebar(false)} />
              <div className="coach-sidebar-footer">
                <AuthGateBanner />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Conv Action Sheet (long-press) */}
      <AnimatePresence>
        {holdConvId !== null && (() => {
          const conv = chatHistory.find(c => c.id === holdConvId);
          return (
            <>
              <motion.div className="coach-mobile-backdrop" style={{ display: 'block' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={closeActionSheet}
              />
              <motion.div className="conv-action-sheet"
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              >
                <div className="conv-action-sheet-handle" />
                <div className="conv-action-sheet-title">{conv?.title}</div>
                {holdDeleteConfirm ? (
                  <div className="conv-action-sheet-delete-confirm">
                    <p>Delete this conversation? This can&apos;t be undone.</p>
                    <div className="conv-action-sheet-delete-btns">
                      <button className="cas-btn-cancel" onClick={() => setHoldDeleteConfirm(false)}>Cancel</button>
                      <button className="cas-btn-delete" onClick={() => { handleDeleteChat(holdConvId); closeActionSheet(); }}>Delete</button>
                    </div>
                  </div>
                ) : holdDownloadOpen ? (
                  <div className="conv-action-sheet-options">
                    <button className="conv-action-sheet-option" onClick={() => { handleDownloadConv(holdConvId, 'txt'); closeActionSheet(); }}><FileTextIcon /><span>Download as TXT</span></button>
                    <button className="conv-action-sheet-option" onClick={() => { handleDownloadConv(holdConvId, 'pdf'); closeActionSheet(); }}><FilePdfIcon /><span>Download as PDF</span></button>
                    <button className="conv-action-sheet-option cas-back" onClick={() => setHoldDownloadOpen(false)}><ChevronIcon /><span>Back</span></button>
                  </div>
                ) : (
                  <div className="conv-action-sheet-options">
                    <button className="conv-action-sheet-option" onClick={() => { closeActionSheet(); setRenamingId(holdConvId); setRenameValue(conv?.title || ''); }}><EditIcon /><span>Rename</span></button>
                    <button className="conv-action-sheet-option" onClick={() => setHoldDownloadOpen(true)}><DownloadIcon /><span>Download</span></button>
                    <button className="conv-action-sheet-option" onClick={() => { handleShareConv(holdConvId); closeActionSheet(); }}><ShareIcon /><span>Share</span></button>
                    <button className="conv-action-sheet-option cas-delete" onClick={() => setHoldDeleteConfirm(true)}><CloseIcon /><span>Delete</span></button>
                  </div>
                )}
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>

      {/* Mobile Input Drawer */}
      <AnimatePresence>
        {showMobileInput && (
          <>
            <motion.div className="coach-mobile-backdrop" style={{ display: 'block' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMobileInput(false)}
            />
            <motion.div className="coach-mobile-input-drawer"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            >
              <div className="mobile-input-drawer-pills">
                <button className="prompt-action-pill-node" onClick={() => setInput('Analyse my performance')}><SparkleIcon /> Analyse</button>
                <button className="prompt-action-pill-node" onClick={() => setInput('Roast my habits')}><FlameIcon /> Roast me</button>
                <button className="prompt-action-pill-node" onClick={() => setInput('Give me a challenge')}><ZapIcon /> Challenge</button>
                <button className="prompt-action-pill-node" onClick={() => setInput('What should I focus on?')}><CompassIcon /> Focus</button>
              </div>
              <div className="mobile-input-drawer-inner">
                <input autoFocus type="text" className="coach-input-field"
                  placeholder="Ask your AI coach..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { handleSend(); setShowMobileInput(false); } }}
                />
                <button className="coach-send-btn"
                  onClick={() => { handleSend(); setShowMobileInput(false); }}
                  disabled={loading || !input.trim()}
                ><SendIcon /></button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Page */}
      <div className="future-homepage mega-homepage brand-page coach-page-wrapper">
        <div className="future-noise" />
        <div className="future-grid" />
        <div className="future-glow glow-a" />
        <div className="future-glow glow-c" />

        <div className="coach-page-hero">
          <p className="coach-page-quote">"Discipline is the bridge between goals and accomplishment."</p>
        </div>

        <div className="coach-interface-container">

          {/* Desktop Sidebar */}
          <aside className="coach-sidebar-panel">
            <div className="coach-sidebar-header">
              <h2 className="coach-sidebar-title">Conversations</h2>
              <button className="coach-new-chat-btn" onClick={handleNewChat} disabled={atChatLimit} title={atChatLimit ? 'Chat limit reached' : ''}><PlusIcon /><span>New</span></button>
            </div>
            <ConversationList />
            <div className="coach-sidebar-footer">
              <AuthGateBanner />
            </div>
          </aside>

          {/* Chat Terminal */}
          <main className="coach-chat-terminal">
            <div className="terminal-header-node">
              <div className="terminal-header-left">
                <button className="coach-mobile-conversations-btn" onClick={() => setShowMobileSidebar(true)}>
                  <ChatsIcon /><span>Chats</span>
                </button>
                <span className="terminal-analyze-label">Analyze:</span>
                <div className="timeline-dropdown-portal">
                  <button className="timeline-dropdown-trigger"
                    onClick={() => { setShowTimeline(v => !v); setShowCustomDate(false); }}
                  >
                    <CalendarIcon /><span>{timelineLabel}</span><ChevronIcon />
                  </button>
                  <AnimatePresence>
                    {showTimeline && (
                      <motion.div className="timeline-dropdown-menu"
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                      >
                        {TIMELINE_OPTIONS.map(opt => (
                          <button key={opt.id}
                            className={`timeline-dropdown-item ${selectedTimeline === opt.id ? 'active' : ''}`}
                            onClick={() => handleTimelineSelect(opt.id)}
                          >{opt.label}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {showCustomDate && (
                    <motion.div className="custom-date-picker-wrap"
                      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div className="custom-date-field">
                        <label>From</label>
                        <input type="date" value={customDateRange.start} onChange={(e) => setCustomDateRange(p => ({ ...p, start: e.target.value }))} />
                      </div>
                      <div className="custom-date-field">
                        <label>To</label>
                        <input type="date" value={customDateRange.end} onChange={(e) => setCustomDateRange(p => ({ ...p, end: e.target.value }))} />
                      </div>
                      <button className="custom-date-apply" onClick={handleCustomApply}>Apply</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Messages */}
            <div className="terminal-message-matrix">
              {messages.length === 0 ? (
                <div className="coach-empty-state">
                  <div className="coach-empty-icon"><SparkleIcon /></div>
                  <h3 className="coach-empty-title">Your AI Performance Coach</h3>
                  <p className="coach-empty-subtitle">Ask me anything about your habits, get insights, or request a roast.</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`matrix-row ${msg.role === 'user' ? 'user-row-align' : 'coach-row-align'}`}>
                    <div className={`matrix-bubble ${msg.role === 'user' ? 'user-bubble-style' : 'coach-bubble-style'}`}>
                      {editingIdx === idx ? (
                        <div className="message-edit-wrapper">
                          <textarea className="message-edit-input"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEditSubmit(idx); }
                              if (e.key === 'Escape') setEditingIdx(null);
                            }}
                            autoFocus rows={3}
                          />
                          <div className="message-edit-actions">
                            <button className="edit-cancel-btn" onClick={() => setEditingIdx(null)}>Cancel</button>
                            <button className="edit-submit-btn" onClick={() => handleEditSubmit(idx)}>Send</button>
                          </div>
                        </div>
                      ) : (
                        <div className="message-content">{msg.content}</div>
                      )}

                      {msg.role === 'assistant' ? (
                        <div className="message-actions assistant-actions">
                          <button className="message-action-btn" title="Copy" onClick={() => handleCopy(msg.content, `ai-${idx}`)}>
                            {copiedId === `ai-${idx}` ? <CheckIcon /> : <CopyIcon />}
                          </button>
                          <button className={`message-action-btn ${savedIds.has(`ai-${idx}`) ? 'saved' : ''}`} title={savedIds.has(`ai-${idx}`) ? 'Unsave' : 'Save'} onClick={() => handleSave(`ai-${idx}`)}>
                            <SaveIcon />
                          </button>
                          <button className="message-action-btn" title="Download" onClick={() => setShowMsgDownloadIdx(idx)}><DownloadIcon /></button>
                          <button className="message-action-btn" title="Share" onClick={() => handleShare(msg.content)}><ShareIcon /></button>
                          <button className="message-action-btn" title="Retry" onClick={() => handleRetry(idx)}><RetryIcon /></button>
                        </div>
                      ) : (
                        <div className="message-actions user-actions">
                          <button className="message-action-btn" title="Copy" onClick={() => handleCopy(msg.content, `user-${idx}`)}>
                            {copiedId === `user-${idx}` ? <CheckIcon /> : <CopyIcon />}
                          </button>
                          {idx === messages.findLastIndex(m => m.role === 'user') && (
                            <button className="message-action-btn" title="Edit" onClick={() => { setEditingIdx(idx); setEditingValue(msg.content); }}>
                              <EditIcon />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="matrix-row coach-row-align">
                  <div className="matrix-bubble coach-bubble-style">
                    <div className="intelligence-pulse">Analyzing your data...</div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Desktop input dock */}
            <div className="terminal-control-dock desktop-input-dock">
              <div className="prompt-pill-row-layout">
                <button className="prompt-action-pill-node" onClick={() => handleQuickPrompt('Analyse my performance')}><SparkleIcon /> Analyse my performance</button>
                <button className="prompt-action-pill-node" onClick={() => handleQuickPrompt('Roast my habits')}><FlameIcon /> Roast my habits</button>
                <button className="prompt-action-pill-node" onClick={() => handleQuickPrompt('Give me a challenge')}><ZapIcon /> Give me a challenge</button>
                <button className="prompt-action-pill-node" onClick={() => handleQuickPrompt('What should I focus on?')}><CompassIcon /> What should I focus on?</button>
              </div>
              <div className="terminal-input-input-row">
                <input ref={inputRef} type="text" className="coach-input-field"
                  placeholder="Ask your AI coach..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="coach-send-btn" onClick={() => handleSend()} disabled={loading || !input.trim()}>
                  <SendIcon />
                </button>
              </div>
            </div>

            {/* Mobile FAB */}
            <div className="mobile-ask-fab-row">
              <button className="mobile-ask-fab" onClick={() => setShowMobileInput(true)}>
                <SparkleIcon /><span>Ask your AI coach...</span>
              </button>
              <button className="coach-send-btn" onClick={() => setShowMobileInput(true)}>
                <SendIcon />
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
