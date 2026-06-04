# FinZ - Smart Financial Management

**FinZ** adalah aplikasi manajemen keuangan pribadi berbasis web yang dilengkapi dengan fitur AI untuk membantu pengguna mengelola keuangan secara cerdas.

## 🚀 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: CSS3 dengan responsive design
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **AI Integration**: Gemini AI via backend proxy
- **Deployment**: Vercel

## ✨ Fitur Utama

- 📊 **Dashboard** — Ringkasan keuangan real-time dengan prediksi AI
- 💰 **Transaksi** — Pencatatan pemasukan & pengeluaran dengan kategorisasi otomatis
- 📋 **Budget** — Perencanaan dan monitoring anggaran bulanan
- 🤖 **AI Chatbot** — Asisten keuangan cerdas berbasis AI
- 👤 **Profile** — Manajemen profil dan pengaturan pengguna
- 🔐 **Authentication** — Login & Register dengan JWT

## 📦 Instalasi

```bash
# Clone repository
git clone https://github.com/PRU452-Finz/finz-frontend.git

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dan isi VITE_API_URL

# Jalankan development server
npm run dev
```

## 🌐 Environment Variables

| Variable | Deskripsi |
|----------|-----------|
| `VITE_API_URL` | URL backend API |

## 🏗️ Build Production

```bash
npm run build
```

## 📁 Struktur Project

```
src/
├── components/     # Reusable UI components
├── context/        # React Context providers
├── pages/          # Page components
├── services/       # API service layer
├── utils/          # Helper functions
└── App.jsx         # Root component
```

## 🔗 Related Repositories

- [finz-backend](https://github.com/PRU452-Finz/finz-backend) — Node.js Express API
- [AI-Deploy](https://github.com/PRU452-Finz/AI-Deploy) — Python AI Inference Service

## 📄 License

This project is developed as a capstone project for PRU452.
