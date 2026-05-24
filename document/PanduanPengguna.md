# 📱 Panduan Pengguna — FinZ

**FinZ** adalah aplikasi pengelola keuangan pribadi berbasis AI untuk Gen-Z.

---

## 1. Memulai (Register & Login)

### Membuat Akun Baru
1. Buka FinZ di browser (`http://localhost:5173`).
2. Klik **"Daftar Sekarang"** di Landing Page.
3. Isi: Nama, Email, Password (min 6 karakter).
4. Klik **"Register"** → otomatis masuk ke Dashboard.

### Login
1. Buka `/login`, masukkan Email dan Password.
2. Klik **"Login"** → masuk ke Dashboard.

> Sesi login berlaku **7 hari**.

---

## 2. Dashboard

Halaman utama setelah login berisi ringkasan keuangan bulan ini.

### Kartu Ringkasan
| Kartu | Penjelasan |
|-------|-----------|
| **Saldo Saat Ini** | Saldo + persentase prediksi sisa |
| **Pemasukan** | Total pemasukan bulan ini |
| **Pengeluaran** | Total pengeluaran + jumlah transaksi |
| **Prediksi Sisa** | Prediksi saldo akhir bulan oleh AI 🤖 |

### Grafik & Analisis
- **Tren Pengeluaran Harian** — Grafik garis pengeluaran harian.
- **Financial Health Score** — Skor 0-100 dengan breakdown: Saving Ratio, Spending Consistency, Category Diversity, Bill Payment.
- **Pengeluaran per Kategori** — Pie chart distribusi pengeluaran.
- **Pengeluaran Bulanan** — Bar chart riwayat 6 bulan.

### Rekomendasi AI
- Budget Warning dengan status (aman/warning/bahaya).
- Saran finansial otomatis berdasarkan pola pengeluaranmu.

---

## 3. Tambah Transaksi

1. Klik **"Tambah"** di sidebar atau tombol di Dashboard.
2. Isi formulir:

| Field | Keterangan |
|-------|-----------|
| Tipe | Pemasukan atau Pengeluaran |
| Nominal | Jumlah uang (Rupiah) |
| Kategori | Makanan, Transport, Hiburan, Belanja, Tagihan, Pendidikan, Kesehatan, Lainnya |
| Deskripsi | Keterangan singkat (contoh: "Makan siang warteg") |
| Metode Pembayaran | Cash, Debit, Credit, E-Wallet, Transfer, QRIS |
| Tanggal | Default hari ini |

3. Klik **"Simpan Transaksi"**.

> 💡 Tulis deskripsi jelas agar AI bisa klasifikasi kategori lebih akurat.

---

## 4. Riwayat Transaksi

- **Filter** — Berdasarkan tipe, kategori, dan tanggal.
- **Pencarian** — Cari berdasarkan deskripsi.
- **Edit** — Klik ikon ✏️ untuk mengubah transaksi.
- **Hapus** — Klik ikon 🗑️ untuk menghapus.

---

## 5. Manajemen Budget

### Cara Set Budget
1. Buka **"Budget"** di sidebar.
2. Klik **"Set Budget"**.
3. Pilih kategori, masukkan limit (Rp), klik **"Simpan"**.

### Status Budget
| Status | Warna | Arti |
|--------|-------|------|
| Aman | 🟢 | Di bawah 80% limit |
| Hampir Penuh | 🟡 | 80-99% limit |
| Melebihi | 🔴 | Melebihi limit |

---

## 6. Notifikasi & AI Alert

Klik ikon lonceng 🔔 di pojok kanan atas.

| Ikon | Jenis | Keterangan |
|------|-------|-----------|
| 🍔🚗🎮 | Budget Alert | Pengeluaran mendekati/melebihi limit |
| 🤖 | AI Insight | Analisis cerdas: rasio income, prediksi saldo, dll |

---

## 7. Profil & Pengaturan

| Field | Keterangan |
|-------|-----------|
| Nama | Nama lengkap |
| Email | Alamat email |
| Pemasukan Bulanan | Penghasilan per bulan (untuk AI) |
| Pekerjaan | Mahasiswa, Karyawan, Freelancer, Wirausaha, Lainnya |
| Tujuan Finansial | Hemat, Investasi, Bebas Utang, Dana Darurat |
| Profil Risiko | Konservatif, Moderat, Agresif |

> 💡 Isi pemasukan bulanan agar AI lebih akurat.

---

## 8. Fitur AI

| Fitur | Penjelasan |
|-------|-----------|
| 🏷️ Klasifikasi Kategori | AI menebak kategori dari deskripsi transaksi |
| 📊 Prediksi Saldo | Prediksi sisa saldo akhir bulan |
| 💡 Rekomendasi | Saran finansial berdasarkan pola pengeluaran |
| 🏆 Financial Health Score | Skor kesehatan keuangan 0-100 |
| 🤖 Budget Alert | Peringatan cerdas dari AI |

---

## 9. FAQ

**Apakah data saya aman?**
Ya. Password dienkripsi (bcrypt) dan autentikasi menggunakan JWT.

**Bagaimana jika AI salah?**
Kamu bisa ubah kategori secara manual saat edit transaksi.

**Harus online?**
Ya, FinZ membutuhkan koneksi ke server.

**Data bulan lalu?**
Dashboard tampilkan 6 bulan terakhir. Gunakan filter tanggal di halaman Transaksi.

**Server AI mati?**
Aplikasi tetap jalan. Prediksi AI menggunakan fallback perhitungan manual.

---

*© 2026 FinZ — CC26-PRU452*
