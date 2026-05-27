import { useState, useRef, useEffect } from 'react';
import {
  Sparkle,
  X,
  PaperPlaneTilt,
  Robot,
  User,
  CircleNotch,
  ChatText,
} from '@phosphor-icons/react';
import { chatAPI } from '../services/api';

const GREETING = 'Hai! Aku asisten keuangan FinZ-mu 👋\nAda yang bisa kubantu soal keuanganmu bulan ini?';

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#34d399',
            animation: 'chat-bounce 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Lightweight Markdown renderer — tanpa library tambahan.
 * Mendukung: **bold**, *italic*, bullet list, numbered list, newlines.
 */
function renderMarkdown(text) {
  if (!text) return null;

  // Split by double newline for paragraphs, single newline for lines
  const lines = text.split('\n');
  const elements = [];
  let listBuffer = [];
  let listType = null; // 'ul' or 'ol'

  const flushList = () => {
    if (listBuffer.length > 0) {
      const Tag = listType === 'ol' ? 'ol' : 'ul';
      elements.push(
        <Tag key={`list-${elements.length}`} style={{
          margin: '6px 0', paddingLeft: '20px', listStyleType: listType === 'ol' ? 'decimal' : 'disc',
        }}>
          {listBuffer.map((item, i) => (
            <li key={i} style={{ marginBottom: '3px' }}>{formatInline(item)}</li>
          ))}
        </Tag>
      );
      listBuffer = [];
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Bullet list: - or *  (but not ** which is bold)
    const bulletMatch = line.match(/^\s*[-*]\s+(.+)/);
    if (bulletMatch && !line.match(/^\s*\*\*[^*]/)) {
      if (listType === 'ol') flushList();
      listType = 'ul';
      listBuffer.push(bulletMatch[1]);
      continue;
    }

    // Numbered list: 1. 2. etc
    const numMatch = line.match(/^\s*\d+[.)]\s+(.+)/);
    if (numMatch) {
      if (listType === 'ul') flushList();
      listType = 'ol';
      listBuffer.push(numMatch[1]);
      continue;
    }

    // Not a list item — flush any pending list
    flushList();

    // Empty line = spacing
    if (line.trim() === '') {
      elements.push(<div key={`br-${i}`} style={{ height: '8px' }} />);
      continue;
    }

    // Normal paragraph
    elements.push(
      <p key={`p-${i}`} style={{ margin: '2px 0' }}>{formatInline(line)}</p>
    );
  }

  flushList(); // flush remaining list
  return elements;
}

/**
 * Format inline markdown: **bold**, *italic*
 */
function formatInline(text) {
  // Split by markdown patterns and create React elements
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Italic: *text* (but not **)
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+?)\*(?!\*)/);

    // Find which comes first
    let firstMatch = null;
    let matchType = null;

    if (boldMatch && (!italicMatch || boldMatch.index <= italicMatch.index)) {
      firstMatch = boldMatch;
      matchType = 'bold';
    } else if (italicMatch) {
      firstMatch = italicMatch;
      matchType = 'italic';
    }

    if (!firstMatch) {
      parts.push(remaining);
      break;
    }

    // Add text before match
    if (firstMatch.index > 0) {
      parts.push(remaining.substring(0, firstMatch.index));
    }

    // Add formatted text
    if (matchType === 'bold') {
      parts.push(
        <strong key={`b-${key++}`} style={{ fontWeight: 700, color: '#6ee7b7' }}>
          {firstMatch[1]}
        </strong>
      );
    } else {
      parts.push(
        <em key={`i-${key++}`} style={{ fontStyle: 'italic', color: '#a7f3d0' }}>
          {firstMatch[1]}
        </em>
      );
    }

    remaining = remaining.substring(firstMatch.index + firstMatch[0].length);
  }

  return parts;
}

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '12px',
        animation: 'chat-slide-in 0.25s ease-out',
      }}
    >
      {!isUser && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginRight: '8px', marginTop: '2px',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
        }}>
          <Robot size={14} color="white" weight="fill" />
        </div>
      )}
      <div
        style={{
          maxWidth: '78%',
          padding: '10px 14px',
          borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
          background: isUser
            ? 'linear-gradient(135deg, #10b981, #059669)'
            : 'rgba(21, 29, 53, 0.95)',
          border: isUser ? 'none' : '1px solid rgba(16, 185, 129, 0.12)',
          color: 'white',
          fontSize: '13px',
          lineHeight: '1.6',
          wordBreak: 'break-word',
          boxShadow: isUser
            ? '0 2px 12px rgba(16, 185, 129, 0.2)'
            : '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        {isUser ? msg.content : renderMarkdown(msg.content)}
      </div>
      {isUser && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '10px',
          background: 'rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginLeft: '8px', marginTop: '2px',
        }}>
          <User size={14} color="#a78bfa" weight="fill" />
        </div>
      )}
    </div>
  );
}

export default function ChatbotUI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: GREETING }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input saat dibuka
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // History hanya role user/assistant (tanpa greeting)
    const history = messages.filter((m) => m.role !== 'system');

    try {
      const res = await chatAPI.ask(text, history);
      const reply = res?.data?.reply || 'Maaf, aku tidak bisa merespons sekarang.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      const errMsg = err?.message?.includes('belum dikonfigurasi')
        ? 'Fitur AI Chat belum aktif. Hubungi admin.'
        : 'Koneksi ke AI gagal. Coba lagi sebentar.';
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: errMsg,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const QUICK_PROMPTS = [
    'Pengeluaranku aman gak bulan ini?',
    'Gimana cara hemat lebih banyak?',
    'Kategori apa yang paling boros?',
  ];

  return (
    <>
      {/* ── Floating Button ─────────────────────── */}
      <button
        id="chatbot-fab"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Buka chatbot AI"
        style={{
          position: 'fixed',
          bottom: 'calc(70px + env(safe-area-inset-bottom, 0px))',
          right: '18px',
          zIndex: 200,
          width: '52px', height: '52px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.45)',
          transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isOpen ? 'rotate(0deg) scale(0.92)' : 'rotate(0deg) scale(1)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(16, 185, 129, 0.6)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = isOpen ? 'scale(0.92)' : 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.45)'; }}
      >
        {isOpen
          ? <X size={22} color="white" weight="bold" />
          : <Sparkle size={22} color="white" weight="fill" />
        }
        {/* Unread badge */}
        {hasUnread && !isOpen && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            width: '12px', height: '12px', borderRadius: '50%',
            background: '#f87171', border: '2px solid #0a0e1a',
            animation: 'chat-ping 1.2s ease-in-out infinite',
          }} />
        )}
      </button>

      {/* ── Chat Panel ─────────────────────────── */}
      <div
        id="chatbot-panel"
        style={{
          position: 'fixed',
          bottom: 'calc(134px + env(safe-area-inset-bottom, 0px))',
          right: '12px',
          zIndex: 190,
          width: 'min(380px, calc(100vw - 24px))',
          height: '520px',
          maxHeight: 'calc(100dvh - 180px)',
          borderRadius: '20px',
          background: 'linear-gradient(145deg, rgba(10, 14, 26, 0.98), rgba(15, 22, 41, 0.99))',
          border: '1px solid rgba(16, 185, 129, 0.18)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(16, 185, 129, 0.06)',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        role="dialog"
        aria-label="FinZ AI Chat"
        aria-modal="true"
      >
        {/* Header */}
        <div style={{
          padding: '16px 18px',
          borderBottom: '1px solid rgba(16, 185, 129, 0.1)',
          background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.08), transparent)',
          display: 'flex', alignItems: 'center', gap: '12px',
          flexShrink: 0,
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)',
          }}>
            <Sparkle size={18} color="white" weight="fill" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
              FinZ AI
            </p>
            <p style={{ fontSize: '11px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 6px #34d399' }} />
              Penasihat Keuanganmu
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a6d99', padding: '4px', borderRadius: '8px', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#c1cbde'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#5a6d99'}
            aria-label="Tutup chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginRight: '8px', marginTop: '2px',
              }}>
                <Robot size={14} color="white" weight="fill" />
              </div>
              <div style={{
                background: 'rgba(21, 29, 53, 0.95)',
                border: '1px solid rgba(16, 185, 129, 0.12)',
                borderRadius: '4px 16px 16px 16px',
              }}>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts — tampil hanya saat 1 pesan (opening) */}
        {messages.length <= 1 && (
          <div style={{ padding: '0 12px 10px', display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
                style={{
                  fontSize: '11px', color: '#34d399',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '20px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.16)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)'; }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div style={{
          padding: '12px',
          borderTop: '1px solid rgba(16, 185, 129, 0.08)',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
          background: 'rgba(5, 8, 16, 0.5)',
          flexShrink: 0,
        }}>
          <textarea
            ref={inputRef}
            id="chatbot-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanya soal keuanganmu..."
            rows={1}
            disabled={isLoading}
            style={{
              flex: 1,
              resize: 'none',
              background: 'rgba(15, 22, 41, 0.7)',
              border: '1px solid rgba(30, 42, 74, 0.7)',
              borderRadius: '12px',
              padding: '10px 14px',
              color: 'white',
              fontSize: '13px',
              lineHeight: '1.5',
              outline: 'none',
              maxHeight: '100px',
              overflowY: 'auto',
              transition: 'border-color 0.2s',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(16, 185, 129, 0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(30, 42, 74, 0.7)'}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
            }}
          />
          <button
            id="chatbot-send"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="Kirim pesan"
            style={{
              width: '40px', height: '40px',
              borderRadius: '12px',
              background: input.trim() && !isLoading
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'rgba(21, 29, 53, 0.8)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s',
              boxShadow: input.trim() && !isLoading ? '0 2px 12px rgba(16, 185, 129, 0.3)' : 'none',
            }}
          >
            {isLoading
              ? <CircleNotch size={18} color="#34d399" style={{ animation: 'spin 0.8s linear infinite' }} />
              : <PaperPlaneTilt size={18} color={input.trim() ? 'white' : '#384770'} weight="fill" />
            }
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes chat-slide-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes chat-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%           { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes chat-ping {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.3); opacity: 0.6; }
        }
      `}</style>
    </>
  );
}
