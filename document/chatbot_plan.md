# 🤖 Rencana Implementasi: Fitur Chatbot AI (Gemini)

Tujuan dari fitur ini adalah menyediakan Asisten Keuangan Pribadi (Chatbot) di dalam aplikasi FinZ. Pengguna dapat berkonsultasi mengenai kondisi keuangannya secara interaktif melalui antarmuka percakapan yang modern.

## User Review Required

> [!IMPORTANT]
> **Metode Respons AI**: Apakah Chatbot ini perlu menggunakan efek *Streaming* (mengetik satu per satu seperti ChatGPT) atau langsung menampilkan teks secara keseluruhan setelah selesai *loading*? *Streaming* memberikan UX yang lebih baik tapi membutuhkan setup yang sedikit lebih rumit di sisi Frontend.

## Rencana Arsitektur & Perubahan

---

### 1. `finz-backend` (Node.js API)

Kita akan membuat *endpoint* khusus untuk percakapan Chatbot agar tidak bercampur dengan AI klasifikasi transaksi.

#### [NEW] `src/controllers/chatController.js`
- Menerima *input text* dari *frontend*.
- Menarik konteks *real-time* user:
  - Saldo saat ini.
  - Total pemasukan & pengeluaran bulan ini.
  - Top 3 kategori pengeluaran terbesar.
- Menggabungkan *input* user dengan *System Prompt* (instruksi agar LLM bertindak sebagai penasihat keuangan).

#### [MODIFY] `src/services/aiService.js` (Atau servis baru `geminiService.js`)
- Implementasi fungsi `generateChatResponse(prompt, history, context)`.
- Memanggil `gemini-2.5-flash` menggunakan SDK `@google/genai`.
- *Role-play* prompt: `"Kamu adalah asisten keuangan pintar di aplikasi FinZ. Berikut adalah data keuangan user: [CONTEXT]. Jawab pertanyaan user berikut secara ringkas, bersahabat, dan berikan tips keuangan yang relevan."`

#### [MODIFY] `src/routes/api.js`
- Menambahkan rute `POST /api/chat/ask`.

---

### 2. `FinZ` (React Frontend)

Kita akan membuat antarmuka *chat* *floating* (melayang) atau sebagai halaman terpisah agar mudah diakses.

#### [NEW] `src/components/ChatbotUI.jsx`
- Komponen *modal* atau *floating panel* di pojok kanan bawah (mirip Intercom/Zendesk).
- Menampilkan *bubble chat* untuk pesan User (kanan) dan pesan AI (kiri).
- Fitur *auto-scroll* ke pesan terbaru.
- Jika user memilih efek *streaming*, kita akan mengelola *state* karakter per karakter.

#### [MODIFY] `src/App.jsx` atau `src/components/BottomNav.jsx`
- Menambahkan tombol **"Tanya AI"** (Ikon Sparkle/Magic Wand) di *Bottom Navigation* (atau di halaman *Dashboard* sebelah kanan atas).

## Alur Kerja (User Flow)

1. Pengguna mengklik tombol "Tanya AI".
2. Kotak obrolan terbuka.
3. Chatbot menyapa: *"Hai! Ada yang bisa kubantu soal keuanganmu bulan ini?"*
4. Pengguna bertanya: *"Kenapa pengeluaranku bulan ini bengkak ya?"*
5. Backend mengambil riwayat transaksi pengguna bulan ini, mengirimnya ke Gemini sebagai konteks, dan membalas (misal: *"Sepertinya kamu banyak menghabiskan di kategori Hiburan (Rp 800.000) dan Makanan (Rp 1.200.000). Mau coba kurangi nongkrong di sisa bulan ini?"*).

---

### 3. AI Financial Health di Dashboard (Gemini)

Selain fitur Chatbot interaktif, kita juga akan menggunakan Gemini untuk meng-upgrade fitur **AI Financial Health** yang ada di halaman Dashboard.

#### [NEW/MODIFY] `src/controllers/aiController.js` atau `financialHealthController.js` (Backend)
- Memodifikasi *endpoint* skor kesehatan keuangan agar memanggil servis Gemini.
- Mengirimkan ringkasan metrik bulan berjalan (total pemasukan, pengeluaran, sisa budget, dan kategori teratas) ke Gemini.
- Meminta Gemini untuk menghasilkan deskripsi/insight singkat (1-2 paragraf) serta skor (0-100) mengenai kondisi keuangan pengguna yang lebih dinamis dibanding *rule-based engine* lama.

#### [MODIFY] `src/pages/Dashboard.jsx` (Frontend)
- Memperbarui komponen *Financial Health Card* di Dashboard agar menampilkan teks ringkasan yang dihasilkan secara *real-time* oleh Gemini.
- Menyediakan *state loading* (*shimmer/skeleton*) saat data sedang di-fetch dari LLM.
