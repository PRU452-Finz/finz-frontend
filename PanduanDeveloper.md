# 🛠️ Panduan Developer — FinZ

Panduan setup dan pengembangan untuk tim developer FinZ.

---

## 1. Arsitektur Sistem

```
┌────────────────┐     ┌──────────────────┐     ┌────────────────┐
│   Frontend     │────▶│   Backend        │────▶│   AI Server    │
│   React/Vite   │     │   Express/MySQL  │     │   Flask/TF     │
│   Port 5173    │     │   Port 8000      │     │   Port 5000    │
└────────────────┘     └──────────────────┘     └────────────────┘
```

| Komponen | Tech Stack | Lokasi |
|----------|-----------|--------|
| Frontend | React 19, Vite, Tailwind CSS, Recharts | `FinZ/` |
| Backend | Express, Sequelize, MySQL, JWT | `finz-backend/` |
| AI Server | Flask, TensorFlow, Scikit-learn | `AI-master/` |

---

## 2. Prerequisites

- **Node.js** v18+ dan npm
- **Python** 3.10+ dan pip
- **MySQL** 8.0+
- **Git**

---

## 3. Setup Frontend (FinZ)

```bash
# 1. Masuk ke folder frontend
cd FinZ

# 2. Install dependencies
npm install

# 3. Buat file .env (jika belum ada)
echo "VITE_API_URL=http://localhost:8000/api" > .env
echo "VITE_APP_NAME=FinZ" >> .env

# 4. Jalankan dev server
npm run dev
```

Frontend berjalan di `http://localhost:5173`.

### Struktur Folder Frontend
```
src/
├── App.jsx              # Routing utama
├── main.jsx             # Entry point
├── index.css            # Global styles
├── pages/               # Halaman
│   ├── LandingPage.jsx  # Landing page (public)
│   ├── Login.jsx        # Halaman login
│   ├── Register.jsx     # Halaman register
│   ├── Dashboard.jsx    # Dashboard utama
│   ├── Transactions.jsx # Riwayat transaksi
│   ├── AddTransaction.jsx # Tambah transaksi
│   ├── Budget.jsx       # Manajemen budget
│   └── Profile.jsx      # Profil & pengaturan
├── components/          # Komponen reusable
│   ├── Navbar.jsx       # Navigasi atas
│   ├── Sidebar.jsx      # Sidebar navigasi
│   ├── NotificationBell.jsx # Lonceng notifikasi
│   ├── SearchModal.jsx  # Modal pencarian
│   └── charts/          # Komponen grafik
├── context/             # React Context (Auth, Finance)
├── services/api.js      # Axios API client
├── utils/               # Helper functions
└── data/                # Data statis
```

---

## 4. Setup Backend (finz-backend)

```bash
# 1. Masuk ke folder backend
cd finz-backend

# 2. Install dependencies
npm install

# 3. Konfigurasi .env
# Pastikan file .env berisi:
PORT=8000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=finz_db
DB_USER=finz
DB_PASSWORD=finz123
CLIENT_URL=http://localhost:5173
AI_API_URL=http://localhost:5000
JWT_SECRET=finz-super-secret-key-2026-pru452
JWT_EXPIRES_IN=7d

# 4. Buat database MySQL
mysql -u root -e "CREATE DATABASE IF NOT EXISTS finz_db;"
mysql -u root -e "CREATE USER IF NOT EXISTS 'finz'@'localhost' IDENTIFIED BY 'finz123';"
mysql -u root -e "GRANT ALL PRIVILEGES ON finz_db.* TO 'finz'@'localhost';"

# 5. Jalankan seeder (opsional, untuk data dummy)
npm run seed

# 6. Jalankan dev server
npm run dev
```

Backend berjalan di `http://localhost:8000`.

### Struktur Folder Backend
```
src/
├── app.js               # Express app config (CORS, routes, middleware)
├── server.js            # Entry point (listen port)
├── config/database.js   # Konfigurasi Sequelize/MySQL
├── controllers/         # Request handler
│   ├── authController.js
│   ├── dashboardController.js
│   ├── transactionController.js
│   ├── budgetController.js
│   ├── budgetAlertController.js  # Budget alert + AI integration
│   ├── aiController.js           # AI prediction endpoints
│   └── userController.js
├── models/              # Sequelize models
│   ├── User.js
│   ├── Transaction.js
│   └── Budget.js
├── routes/              # Express routes
├── services/            # Business logic
│   ├── aiService.js     # AI logic + fallback
│   ├── aiClient.js      # HTTP client ke Flask AI
│   ├── dashboardService.js
│   └── transactionService.js
├── middlewares/          # Auth, validators, logger
└── database/            # Seeder & migrations
```

---

## 5. Setup AI Server (AI-master)

```bash
# 1. Masuk ke folder AI
cd AI-master

# 2. Buat virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Jalankan Flask server
python app.py
```

AI Server berjalan di `http://localhost:5000`.

### File Penting AI Server
| File | Fungsi |
|------|--------|
| `app.py` | Flask app + semua route |
| `rule_engine.py` | Rule matrix untuk analisis keuangan |
| `budget_alert.py` | Sistem alert budget |
| `model_klasifikasi.h5` | Model ML klasifikasi kategori |
| `model_prediksi_saldo.keras` | Model ML prediksi saldo |
| `tfidf_vectorizer.pkl` | TF-IDF untuk NLP |

---

## 6. Menjalankan Semua Server

Buka **3 terminal** terpisah:

```bash
# Terminal 1 — AI Server (harus pertama)
cd AI-master && source venv/bin/activate && python app.py

# Terminal 2 — Backend
cd finz-backend && npm run dev

# Terminal 3 — Frontend
cd FinZ && npm run dev
```

### Urutan Start
1. ⚡ **AI Server** (port 5000) — harus jalan duluan
2. ⚡ **Backend** (port 8000) — tergantung AI & MySQL
3. ⚡ **Frontend** (port 5173) — tergantung Backend

### Verifikasi
```bash
# Cek AI Server
curl http://localhost:5000/health

# Cek Backend
curl http://localhost:8000/

# Cek koneksi Backend → AI
curl http://localhost:8000/api/ai/health
```

---

## 7. API Endpoints

### Auth
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| POST | `/api/auth/register` | Daftar akun baru |
| POST | `/api/auth/login` | Login, dapat JWT token |

### Transaksi (🔒 perlu login)
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/api/transactions` | Ambil semua transaksi user |
| POST | `/api/transactions` | Tambah transaksi baru |
| PUT | `/api/transactions/:id` | Edit transaksi |
| DELETE | `/api/transactions/:id` | Hapus transaksi |

### Dashboard & AI (🔒 perlu login)
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/api/dashboard` | Ringkasan dashboard |
| POST | `/api/predict/balance` | Prediksi saldo AI |
| POST | `/api/predict/category` | Klasifikasi kategori AI |
| GET | `/api/recommendation/:user_id` | Rekomendasi finansial |
| GET | `/api/financial-score/:user_id` | Skor kesehatan keuangan |

### Budget Alert (🔒 perlu login)
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/api/budget-alert/:user_id/:month` | Ambil alert (auto generate jika kosong) |
| POST | `/api/budget-alert/generate` | Manual generate alert |
| GET | `/api/budget-alert/:user_id/history` | Riwayat alert |

---

## 8. Environment Variables

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=FinZ
```

### Backend (`.env`)
```
PORT=8000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=finz_db
DB_USER=finz
DB_PASSWORD=finz123
CLIENT_URL=http://localhost:5173
AI_API_URL=http://localhost:5000
JWT_SECRET=<your-secret>
JWT_EXPIRES_IN=7d
```

---

## 9. Troubleshooting

| Masalah | Solusi |
|---------|--------|
| CORS error | Pastikan `CLIENT_URL` di backend `.env` sesuai dengan URL frontend |
| AI alerts kosong | Pastikan AI server (port 5000) aktif, cek dengan `curl localhost:5000/health` |
| Database error | Pastikan MySQL berjalan dan kredensial di `.env` benar |
| JWT expired | Login ulang. Token berlaku 7 hari |
| Prediksi AI aneh | Pastikan ada cukup data transaksi bulan ini |

---

*© 2026 FinZ — CC26-PRU452*
