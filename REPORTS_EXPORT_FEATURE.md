# Laporan dan Ekspor PDF/Excel

## Gambaran Umum

Fitur ekspor laporan memungkinkan pengguna untuk mengunduh laporan kehadiran siswa dalam format PDF dan Excel (CSV). Fitur ini tersedia di tab "Laporan" dalam aplikasi dan mendukung berbagai jenis laporan.

## Jenis Laporan yang Tersedia

1. **Laporan Ringkasan** - Memberikan statistik umum tentang kehadiran siswa
2. **Laporan Performa** - Menampilkan data performa kehadiran siswa dengan grafik
3. **Laporan Detail** - Menyediakan informasi lengkap tentang kehadiran siswa
4. **Laporan per Kelas** - Menampilkan statistik kehadiran berdasarkan kelas
5. **Laporan Kenaikan Kelas** - Menunjukkan status kenaikan kelas siswa

## Cara Menggunakan Fitur Ekspor

1. Buka tab "Laporan" di aplikasi
2. Pilih jenis laporan yang diinginkan dari dropdown
3. Klik tombol "Hasilkan Laporan"
4. Setelah laporan ditampilkan, klik tombol "PDF" atau "Excel" untuk mengunduh

## Format File

### PDF
- Format file: `.pdf`
- Berisi representasi terstruktur dari data laporan
- Dapat dibuka dengan pembaca PDF apa pun

### Excel
- Format file: `.csv` (dapat dibuka dengan Excel)
- Data disusun dalam format yang mudah dibaca
- Cocok untuk analisis lebih lanjut

## API Endpoint

### Ekspor Laporan
- **Endpoint**: `POST /api/reports`
- **Deskripsi**: Mengekspor laporan dalam format yang ditentukan
- **Parameter Body**:
  - `format` (string, required): Format ekspor ("pdf" atau "excel")
  - `reportType` (string, required): Jenis laporan ("summary", "performance", "detailed", "class", atau "promotion")
  - `data` (object): Data laporan opsional

### Contoh Penggunaan API

```javascript
// Ekspor laporan ringkasan dalam format PDF
const response = await fetch('/api/reports', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    format: 'pdf',
    reportType: 'summary',
    data: {} // Data opsional
  })
});

// Ekspor laporan performa dalam format Excel
const response = await fetch('/api/reports', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    format: 'excel',
    reportType: 'performance',
    data: {} // Data opsional
  })
});
```

## Struktur Data Laporan

### Laporan Ringkasan
Mencakup:
- Statistik kehadiran (total siswa, hadir, terlambat, tidak hadir, izin/sakit, tingkat kehadiran)
- Statistik siswa (siswa baru, pindahan, lama)
- Statistik kenaikan kelas (naik kelas, tinggal kelas, lulus, belum ditentukan)
- Siswa terbaik (berdasarkan tingkat kehadiran)

### Laporan Performa
Mencakup:
- Statistik umum kehadiran
- Data individu siswa dengan tingkat kehadiran
- Representasi grafik data

### Laporan Detail
Mencakup:
- Informasi lengkap tentang setiap siswa
- Riwayat kehadiran mingguan
- Ringkasan bulanan
- Status kenaikan kelas

### Laporan per Kelas
Mencakup:
- Statistik kehadiran untuk setiap kelas
- Jumlah siswa per kelas
- Distribusi status kehadiran
- Statistik kenaikan kelas per kelas

### Laporan Kenaikan Kelas
Mencakup:
- Statistik kenaikan kelas keseluruhan
- Status kenaikan kelas per kelas
- Jumlah siswa dalam setiap kategori

## Pengembangan Lebih Lanjut

Untuk meningkatkan fitur ekspor:
1. Integrasi dengan library PDF yang lebih lengkap seperti pdfmake atau jsPDF
2. Dukungan untuk format Excel asli (.xlsx) menggunakan libraries seperti SheetJS
3. Template laporan yang dapat disesuaikan
4. Opsi pengaturan ekspor (orientasi halaman, ukuran kertas, dll.)

## Penanganan Kesalahan

Fitur ekspor mencakup penanganan kesalahan untuk:
- Parameter yang tidak valid
- Format yang tidak didukung
- Kesalahan pembuatan file
- Masalah jaringan

Jika terjadi kesalahan, sistem akan mengembalikan pesan kesalahan yang sesuai untuk membantu pengguna memahami masalahnya.