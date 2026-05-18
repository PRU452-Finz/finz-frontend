import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import heroBanner from "../assets/hero-banner.png";
import finZImage from "../assets/finZ.png";
import logoFinz from "../assets/logoFinz.png";

const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rock+Salt&family=Oswald:wght@400;700&family=Open+Sans:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:#030505;color:#E5ECF6;font-family:'Open Sans',sans-serif;}
::-webkit-scrollbar{width:6px;}
::-webkit-scrollbar-track{background:#030505;}
::-webkit-scrollbar-thumb{background:#39FF6A;border-radius:3px;}

@keyframes float{0%,100%{transform:translateY(0px);}50%{transform:translateY(-10px);}}
@keyframes pulse-glow{0%,100%{opacity:0.4;}50%{opacity:0.8;}}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
@keyframes spin-ring{from{stroke-dashoffset:220;}to{stroke-dashoffset:0;}}
@keyframes count-bar{from{width:0%;}to{width:var(--w);}}

.fade-up{opacity:0;transform:translateY(28px);transition:opacity 0.6s ease,transform 0.6s ease;}
.fade-up.visible{opacity:1;transform:translateY(0);}
.fade-up:nth-child(2){transition-delay:0.1s;}
.fade-up:nth-child(3){transition-delay:0.2s;}

.mock-float{animation:float 3.5s ease-in-out infinite;}

.nav-link-item{color:#E5ECF6;text-decoration:none;font-size:15px;font-weight:400;padding:8px 16px;border-radius:4px;cursor:pointer;transition:all 0.2s;background:transparent;border:none;font-family:'Open Sans',sans-serif;}
.nav-link-item:hover{background:rgba(57,255,106,0.1);color:#39FF6A;}

.btn-primary{background:#39FF6A;color:#030505;font-family:'Open Sans',sans-serif;font-size:16px;font-weight:600;padding:0 32px;height:40px;border-radius:4px;border:none;cursor:pointer;transition:all 0.2s;display:inline-flex;align-items:center;gap:8px;text-decoration:none;}
.btn-primary:hover{background:#00A87D;}
.btn-primary:active{background:#008F6A;}

.btn-ghost{background:transparent;color:#E5ECF6;font-family:'Open Sans',sans-serif;font-size:16px;font-weight:600;padding:0 32px;height:40px;border-radius:4px;border:1px solid rgba(57,255,106,0.5);cursor:pointer;transition:all 0.2s;display:inline-flex;align-items:center;gap:8px;text-decoration:none;}
.btn-ghost:hover{background:rgba(57,255,106,0.1);border-color:#39FF6A;color:#39FF6A;}

.feature-card{background:#0D1F1A;padding:24px;border-radius:8px;border:1px solid rgba(57,255,106,0.15);transition:all 0.3s ease;cursor:default;}
.feature-card:hover{border-color:rgba(57,255,106,0.6);box-shadow:0 0 24px rgba(57,255,106,0.15);}
.feature-card.featured{border-color:#39FF6A;box-shadow:0 0 32px rgba(57,255,106,0.2);}

.step-card{background:#0D1F1A;padding:28px 24px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);flex:1;transition:all 0.3s;}
.step-card:hover{border-color:rgba(57,255,106,0.4);}

.stat-card{background:#0D1F1A;padding:32px 24px;border-radius:8px;border:1px solid rgba(57,255,106,0.15);text-align:center;flex:1;}

.hamburger{display:none;flex-direction:column;gap:5px;background:transparent;border:none;cursor:pointer;padding:4px;}
.hamburger span{display:block;width:24px;height:2px;background:#E5ECF6;transition:all 0.3s;}

.hero-section{height:calc(100vh - 64px);}
.hero-bg{background-size:100% 100%;}

@media(max-width:640px){
  .hamburger{display:flex;}
  .nav-links-desktop{display:none!important;}
  .hero-section{height:auto!important;aspect-ratio:16/9!important;}
  .hero-bg{background-size:cover!important;background-position:left center!important;}
  .features-grid{grid-template-columns:1fr!important;}
  .about-grid{grid-template-columns:1fr!important;}
  .steps-row{flex-direction:column!important;}
  .step-connector{display:none!important;}
  .stats-row{flex-direction:column!important;}
  .footer-grid{grid-template-columns:1fr!important;gap:24px!important;}
  .section-pad{padding:48px 16px!important;}
  .cta-h2{font-size:20px!important;}
}
@media(min-width:641px) and (max-width:1024px){
  .features-grid{grid-template-columns:repeat(2,1fr)!important;}
  .section-pad{padding:64px 32px!important;}
}
`;

function useIntersection(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function CountUp({ target, suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const visible = useIntersection(ref, 0.3);
  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function MockDashboard() {
  return (
    <div className="mock-float" style={{
      background: "#0A1A15",
      borderRadius: 12,
      border: "1px solid rgba(57,255,106,0.25)",
      boxShadow: "0 0 60px rgba(57,255,106,0.12)",
      width: "100%",
      maxWidth: 520,
      overflow: "hidden",
      fontSize: 12,
    }}>
      {/* Top bar */}
      <div style={{ background: "#061210", padding: "10px 16px", borderBottom: "1px solid rgba(57,255,106,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={logoFinz} alt="FinZ Logo" style={{ width: 16, height: 16, objectFit: "contain" }} />
          <span style={{ fontFamily: "'Rock Salt', serif", fontSize: 11, color: "#39FF6A" }}>FinZ</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#CC0000" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFDC13" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#39FF6A" }} />
        </div>
      </div>

      <div style={{ display: "flex", height: 280 }}>
        {/* Sidebar */}
        <div style={{ width: 110, background: "#061210", borderRight: "1px solid rgba(57,255,106,0.08)", padding: "12px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ color: "#6B7280", fontSize: 9, letterSpacing: 1, padding: "0 8px", marginBottom: 6, fontFamily: "'Oswald', sans-serif" }}>MENU</div>
          {[
            { icon: "⊞", label: "Dashboard", active: true },
            { icon: "⇄", label: "Transaksi" },
            { icon: "+", label: "Tambah" },
            { icon: "◫", label: "Budget" },
            { icon: "○", label: "Profil" },
          ].map((item) => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 8px", borderRadius: 4,
              background: item.active ? "rgba(57,255,106,0.15)" : "transparent",
              color: item.active ? "#39FF6A" : "#6B7280",
              fontSize: 11, cursor: "default",
            }}>
              <span style={{ fontSize: 12 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        {/* Main area */}
        <div style={{ flex: 1, padding: "12px 14px", overflowY: "hidden" }}>
          <div style={{ color: "#6B7280", fontSize: 10, marginBottom: 2 }}>Selamat Pagi 👋</div>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Bayu</div>

          {/* Stat cards row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
            {[
              { label: "SALDO", val: "Rp 3.253.000", accent: "#39FF6A", sub: "● Active" },
              { label: "PEMASUKAN", val: "Rp 7.500.000", accent: "#A374F8", sub: "Bulan ini" },
              { label: "PENGELUARAN", val: "Rp 4.247.000", accent: "#CC0000", sub: "47 transaksi" },
            ].map((c) => (
              <div key={c.label} style={{
                background: "#0D1F1A", borderRadius: 6, padding: "8px 10px",
                border: `1px solid rgba(57,255,106,0.1)`,
              }}>
                <div style={{ color: "#6B7280", fontSize: 8, letterSpacing: 0.5, fontFamily: "'Oswald', sans-serif", marginBottom: 4 }}>{c.label}</div>
                <div style={{ color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "'Oswald', sans-serif", marginBottom: 3 }}>{c.val}</div>
                <div style={{ color: c.accent, fontSize: 8 }}>{c.sub}</div>
              </div>
            ))}
          </div>

          {/* Health score + chart row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: 8 }}>
            {/* Mini chart */}
            <div style={{ background: "#0D1F1A", borderRadius: 6, padding: "8px 10px", border: "1px solid rgba(57,255,106,0.1)" }}>
              <div style={{ color: "#E5ECF6", fontSize: 10, fontWeight: 600, marginBottom: 6 }}>Prediksi Sisa Saldo</div>
              <svg width="100%" height="60" viewBox="0 0 200 60">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#39FF6A" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#39FF6A" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,50 C20,40 30,20 50,25 C70,30 80,15 100,20 C120,25 130,35 150,22 C170,10 185,30 200,28 L200,60 L0,60 Z" fill="url(#chartGrad)" />
                <path d="M0,50 C20,40 30,20 50,25 C70,30 80,15 100,20 C120,25 130,35 150,22 C170,10 185,30 200,28" fill="none" stroke="#39FF6A" strokeWidth="1.5" />
              </svg>
            </div>
            {/* Score ring */}
            <div style={{ background: "#0D1F1A", borderRadius: 6, padding: "8px", border: "1px solid rgba(57,255,106,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ color: "#6B7280", fontSize: 8, letterSpacing: 0.5, fontFamily: "'Oswald', sans-serif", marginBottom: 4 }}>HEALTH SCORE</div>
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(57,255,106,0.15)" strokeWidth="4" />
                <circle cx="26" cy="26" r="20" fill="none" stroke="#39FF6A" strokeWidth="4"
                  strokeDasharray="88" strokeDashoffset="26" strokeLinecap="round"
                  transform="rotate(-90 26 26)" />
                <text x="26" y="30" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="Oswald,sans-serif">70</text>
              </svg>
              <div style={{ color: "#39FF6A", fontSize: 9, marginTop: 4 }}>Cukup Baik</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresVisible = useIntersection(featuresRef);
  const stepsVisible = useIntersection(stepsRef);
  const statsVisible = useIntersection(statsRef);
  const ctaVisible = useIntersection(ctaRef);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = FONTS_CSS;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div style={{ background: "#030505", minHeight: "100vh", fontFamily: "'Open Sans', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(3,5,5,0.92)",
        backdropFilter: "blur(12px)",
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px",
        boxShadow: scrolled ? "rgba(0,0,0,0.3) 0px 4px 20px -1px, rgba(57,255,106,0.08) 0px 1px 0px" : "none",
        transition: "box-shadow 0.3s",
        borderBottom: "1px solid rgba(57,255,106,0.08)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logoFinz} alt="FinZ Logo" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain" }} />
          <div>
            <div style={{ fontFamily: "'Rock Salt', serif", fontSize: 16, color: "#39FF6A", lineHeight: 1 }}>FinZ</div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 9, color: "#6B7280", letterSpacing: 2 }}>SMART FINANCE</div>
          </div>
        </div>

        {/* Desktop links */}
        <div className="nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {["Fitur", "Cara Kerja", "Tentang"].map((l) => (
            <button key={l} className="nav-link-item" onClick={() => scrollTo(l === "Fitur" ? "features" : l === "Cara Kerja" ? "howitworks" : "stats")}>{l}</button>
          ))}
          <button className="btn-primary" style={{ marginLeft: 12, fontSize: 14, height: 36, padding: "0 20px" }} onClick={() => navigate("/login")}>
            Mulai Gratis
          </button>
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
          background: "rgba(3,5,5,0.97)", borderBottom: "1px solid rgba(57,255,106,0.15)",
          padding: "16px 24px", display: "flex", flexDirection: "column", gap: 4,
        }}>
          {["Fitur", "Cara Kerja", "Tentang"].map((l) => (
            <button key={l} className="nav-link-item" style={{ textAlign: "left" }} onClick={() => scrollTo(l === "Fitur" ? "features" : l === "Cara Kerja" ? "howitworks" : "stats")}>{l}</button>
          ))}
          <button className="btn-primary" style={{ marginTop: 8, justifyContent: "center", fontSize: 14 }} onClick={() => scrollTo("cta")}>Mulai Gratis</button>
        </div>
      )}

      <style>{`
        .hero-section {
          height: calc(100vh - 64px);
        }
        .hero-bg {
          background-size: 100% 100%;
        }
        @media (max-width: 640px) {
          .hero-section {
            height: auto !important;
            aspect-ratio: 16 / 9 !important;
          }
          .hero-bg {
            background-size: cover !important;
            background-position: left center !important;
          }
        }
      `}</style>

      {/* HERO — DBS-style full-width banner */}
      <section className="hero-section" style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}>
        {/* Background image */}
        <div className="hero-bg" style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${heroBanner})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }} />

      </section>



      {/* APP EXPLANATION (DBS Style) */}
      <section id="about" className="section-pad" style={{ padding: "80px 40px", background: "#030505" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          
          {/* Top text area */}
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ color: "#39FF6A", fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>TENTANG APLIKASI</div>
            <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Kelola Keuangan dengan Gaya Baru</h3>
            <p style={{ color: "#6B7280", fontSize: 16, lineHeight: "26px", maxWidth: 800, margin: "0 auto" }}>
              FinZ dirancang khusus untuk Gen-Z Indonesia yang ingin mandiri secara finansial tanpa ribet. Kami menggabungkan teknologi AI dengan antarmuka yang simpel untuk memberikan pengalaman mengelola uang yang belum pernah ada sebelumnya.
            </p>
          </div>

          {/* Image + Text Row */}
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 40, alignItems: "center", marginBottom: 80 }}>
            {/* Image (Mockup or Photo) */}
            <div style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ paddingBottom: "75%", background: "#0D1F1A", position: "relative" }}>
                <img src={finZImage} alt="FinZ App" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>

            {/* Text Description */}
            <div>
              <p style={{ color: "#E5ECF6", fontSize: 16, lineHeight: "28px", marginBottom: 20 }}>
                Program ini merupakan hasil dedikasi tim PRU452 untuk menciptakan solusi finansial yang relevan bagi generasi muda. Kami percaya bahwa literasi keuangan tidak harus membosankan. Dengan FinZ, Anda bisa melihat ke mana uang Anda pergi secara otomatis.
              </p>
              <p style={{ color: "#E5ECF6", fontSize: 16, lineHeight: "28px" }}>
                Aplikasi ini menawarkan fitur otomatisasi kategori menggunakan AI, prediksi saldo masa depan, dan tips personal yang disesuaikan dengan kebiasaan belanja Anda. Tujuannya adalah membantu Anda mencapai kebebasan finansial lebih cepat.
              </p>
            </div>
          </div>

          {/* Three Principles */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h3 style={{ fontFamily: "'Rock Salt', serif", fontSize: 24, color: "#fff", marginBottom: 32 }}>Tiga Prinsip Utama</h3>
          </div>

          <div style={{ display: "flex", gap: 30 }}>
            {[
              { title: "AUTOMATION", desc: "Mempercepat pencatatan dengan klasifikasi otomatis berbasis AI NLP." },
              { title: "PREDICTION", desc: "Memberikan proyeksi saldo akhir bulan agar Anda bisa bersiap lebih awal." },
              { title: "PERSONALIZATION", desc: "Menawarkan rekomendasi yang tidak terbatas pada template umum, tapi spesifik untuk Anda." },
            ].map((p) => (
              <div key={p.title} style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, color: "#39FF6A", letterSpacing: 1, marginBottom: 12 }}>🚀 {p.title}</div>
                <p style={{ color: "#6B7280", fontSize: 14, lineHeight: "22px" }}>{p.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section-pad" style={{ padding: "80px 40px", background: "rgba(13,31,26,0.3)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }} ref={featuresRef}>
            <div style={{ color: "#39FF6A", fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>FITUR UNGGULAN</div>
            <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 32, fontWeight: 700, color: "#fff" }}>Yang Bikin FinZ Beda</h3>
          </div>

          <div className="features-grid fade-up" style={{
            display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20,
            opacity: featuresVisible ? 1 : 0, transform: featuresVisible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
            {[
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#39FF6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                    <rect x="9" y="9" width="6" height="6"></rect>
                    <line x1="9" y1="1" x2="9" y2="4"></line>
                    <line x1="15" y1="1" x2="15" y2="4"></line>
                    <line x1="9" y1="20" x2="9" y2="23"></line>
                    <line x1="15" y1="20" x2="15" y2="23"></line>
                    <line x1="20" y1="9" x2="23" y2="9"></line>
                    <line x1="20" y1="15" x2="23" y2="15"></line>
                    <line x1="1" y1="9" x2="4" y2="9"></line>
                    <line x1="1" y1="15" x2="4" y2="15"></line>
                  </svg>
                ),
                title: "AI Klasifikasi Kategori",
                desc: "Deskripsi transaksimu otomatis diklasifikasi ke 8 kategori pakai model NLP. Gak perlu milih manual lagi.",
                tag: "NLP Model",
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#39FF6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                    <line x1="6" y1="20" x2="18" y2="20"></line>
                  </svg>
                ),
                title: "Prediksi Saldo Akhir Bulan",
                desc: "AI analisis pola pengeluaranmu dan prediksi saldo di akhir bulan. Tau dulu sebelum bokek.",
                tag: "ML Regression", featured: true,
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#39FF6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a5 5 0 0 0-4.9 4.1 5 5 0 0 0-1 2.9c0 1.3.5 2.5 1.4 3.4.3.3.5.7.5 1.1v1.5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-1.5c0-.4.2-.8.5-1.1a5 5 0 0 0 1.4-3.4 5 5 0 0 0-1-2.9A5 5 0 0 0 12 2z"></path>
                    <path d="M9 16v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2"></path>
                    <line x1="12" y1="12" x2="12" y2="12"></line>
                  </svg>
                ),
                title: "Rekomendasi Personal",
                desc: "Dapat insight finansial yang spesifik buat profil kamu — bukan template generik.",
                tag: "Rule Engine",
              },
            ].map((f) => (
              <div key={f.title} className={`feature-card${f.featured ? " featured" : ""}`}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                <div style={{
                  display: "inline-block", background: "rgba(57,255,106,0.12)", color: "#39FF6A",
                  borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 600, marginBottom: 14,
                }}>{f.tag}</div>
                <h4 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{f.title}</h4>
                <p style={{ color: "#6B7280", fontSize: 14, lineHeight: "22px" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="howitworks" className="section-pad" style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }} ref={stepsRef}>
            <div style={{ color: "#39FF6A", fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>CARA KERJA</div>
            <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 32, fontWeight: 700, color: "#fff" }}>Simpel. Cerdas. Efektif.</h3>
          </div>

          <div className="steps-row" style={{
            display: "flex", gap: 0, alignItems: "stretch",
            opacity: stepsVisible ? 1 : 0, transform: stepsVisible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
            {[
              { num: "01", title: "Catat Transaksi", desc: "Input nominal dan deskripsi singkat. Bisa expense atau income." },
              { num: "02", title: "AI Analisis", desc: "Model NLP FinZ klasifikasi kategori otomatis dan hitung health score kamu." },
              { num: "03", title: "Dapat Insight", desc: "Dashboard tampilin prediksi saldo, alert budget, dan rekomendasi personal." },
            ].map((s, i) => (
              <div key={s.num} style={{ display: "flex", alignItems: "stretch", flex: 1 }}>
                <div className="step-card">
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "rgba(57,255,106,0.15)", border: "2px solid #39FF6A",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 700, color: "#39FF6A",
                    marginBottom: 20,
                  }}>{s.num}</div>
                  <h4 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{s.title}</h4>
                  <p style={{ color: "#6B7280", fontSize: 14, lineHeight: "22px" }}>{s.desc}</p>
                </div>
                {i < 2 && (
                  <div className="step-connector" style={{
                    display: "flex", alignItems: "center", padding: "0 8px", flexShrink: 0,
                  }}>
                    <div style={{ width: 40, borderTop: "2px dashed rgba(57,255,106,0.35)" }} />
                    <span style={{ color: "#39FF6A", fontSize: 16, marginLeft: -2 }}>›</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="section-pad" style={{ padding: "80px 40px", background: "rgba(13,31,26,0.3)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }} ref={statsRef}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ color: "#39FF6A", fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>ANGKA NYATA</div>
            <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 32, fontWeight: 700, color: "#fff" }}>FinZ dalam Angka</h3>
          </div>
          <div className="stats-row" style={{ display: "flex", gap: 20 }}>
            {[
              { target: 500, suffix: "+", label: "Keyword AI Terlatih", sub: "Covers 8 kategori transaksi Gen-Z" },
              { target: 8, suffix: "", label: "Kategori Cerdas", sub: "Makanan, transport, hiburan & lainnya" },
              { target: 70, suffix: "+", label: "Insight Personal", sub: "Rekomendasi spesifik per user" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 52, fontWeight: 700, color: "#39FF6A", lineHeight: 1, marginBottom: 8 }}>
                  {statsVisible ? <CountUp target={s.target} suffix={s.suffix} /> : `0${s.suffix}`}
                </div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{s.label}</div>
                <div style={{ color: "#6B7280", fontSize: 13 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section id="cta" className="section-pad" style={{
        padding: "80px 40px",
        background: "linear-gradient(135deg,#0D1F1A 0%,#051410 100%)",
        borderTop: "1px solid rgba(57,255,106,0.25)",
        borderBottom: "1px solid rgba(57,255,106,0.25)",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }} ref={ctaRef}>
          <div style={{
            opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
            <div style={{ fontSize: 40, marginBottom: 20 }}>⚡</div>
            <h2 className="cta-h2" style={{
              fontFamily: "'Rock Salt', serif", fontSize: 26, fontWeight: 400,
              color: "#fff", lineHeight: "38px", marginBottom: 16,
            }}>
              Siap kelola<br />keuanganmu?
            </h2>
            <p style={{ color: "#6B7280", fontSize: 16, marginBottom: 36 }}>
              Gratis. Cerdas. Buat Gen-Z.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ fontSize: 16, height: 44, padding: "0 40px" }} onClick={() => navigate("/login")}>
                Daftar Sekarang →
              </button>
              <button className="btn-ghost" style={{ height: 44, padding: "0 32px" }}>
                Pelajari Fitur
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "48px 40px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="footer-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <img src={logoFinz} alt="FinZ Logo" style={{ width: 32, height: 32, borderRadius: 6, objectFit: "contain" }} />
              <span style={{ fontFamily: "'Rock Salt', serif", fontSize: 14, color: "#39FF6A" }}>FinZ</span>
            </div>
            <p style={{ color: "#6B7280", fontSize: 13, lineHeight: "22px", maxWidth: 280 }}>
              Smart Finance untuk Gen-Z Indonesia. AI-powered, personal, dan gratis.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, color: "#6B7280", letterSpacing: 1.5, marginBottom: 16 }}>PRODUK</div>
            {["Fitur", "Cara Kerja", "FAQ"].map((l) => (
              <div key={l} style={{ color: "#E5ECF6", fontSize: 14, marginBottom: 10, cursor: "pointer" }}
                onMouseEnter={e => e.target.style.color = "#39FF6A"}
                onMouseLeave={e => e.target.style.color = "#E5ECF6"}
              >{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, color: "#6B7280", letterSpacing: 1.5, marginBottom: 16 }}>PROJECT</div>
            {["GitHub", "Tim PRU452", "Capstone 2026"].map((l) => (
              <div key={l} style={{ color: "#E5ECF6", fontSize: 14, marginBottom: 10, cursor: "pointer" }}
                onMouseEnter={e => e.target.style.color = "#39FF6A"}
                onMouseLeave={e => e.target.style.color = "#E5ECF6"}
              >{l}</div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: "32px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <span style={{ color: "#6B7280", fontSize: 13 }}>© 2026 FinZ. Capstone Project PRU452. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
