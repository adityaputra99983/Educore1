# Laporan Kehadiran dan Kenaikan Kelas

## Deskripsi
Fitur laporan dalam sistem NOAH menyediakan berbagai jenis laporan untuk memantau kehadiran siswa dan status kenaikan kelas. Laporan ini terhubung langsung dengan API backend untuk menampilkan data yang akurat dan terkini.

## Jenis Laporan yang Tersedia

### 1. Ringkasan Kehadiran
Menampilkan statistik kehadiran harian dengan detail:
- Jumlah siswa hadir
- Jumlah siswa terlambat
- Jumlah siswa tidak hadir
- Jumlah siswa izin/sakit
- Tingkat kehadiran keseluruhan

### 2. Laporan per Kelas
Menampilkan statistik kehadiran dan kenaikan kelas berdasarkan kelas:
- Jumlah siswa per kelas
- Statistik kehadiran per kelas
- Jumlah siswa naik kelas
- Jumlah siswa tinggal kelas
- Jumlah siswa lulus

### 3. Laporan Kenaikan Kelas
Menampilkan detail status kenaikan kelas:
- Jumlah siswa naik kelas
- Jumlah siswa tinggal kelas
- Jumlah siswa lulus
- Jumlah siswa belum ditentukan statusnya

### 4. Detail Laporan
Menampilkan data lengkap per siswa:
- NIS dan nama siswa
- Kelas saat ini
- Status kehadiran
- Tingkat kehadiran
- Status kenaikan kelas
- Kelas tujuan

### 5. Statistik Performa
Menampilkan analisis statistik performa kehadiran:
- Siswa dengan kehadiran sempurna (100%)
- Siswa dengan kehadiran tinggi (90-99%)
- Siswa dengan kehadiran sedang (75-89%)
- Siswa dengan kehadiran rendah (<75%)

## Cara Mengakses Laporan

1. Buka aplikasi NOAH
2. Navigasi ke menu "Laporan" di sidebar
3. Pilih jenis laporan yang diinginkan
4. Sesuaikan periode laporan (harian/mingguan/bulanan)
5. Klik "Hasilkan Laporan" untuk menampilkan data

## Ekspor Laporan

Laporan dapat diekspor dalam format:
- **PDF**: Dokumen PDF yang dapat dicetak
- **Excel**: File spreadsheet untuk analisis lebih lanjut

## Koneksi API

Laporan terhubung langsung dengan API backend melalui endpoint `/api/reports` dengan parameter:
- `type`: Jenis laporan (summary, class, promotion, detailed, performance)
- `period`: Periode laporan (daily, weekly, monthly)

Contoh permintaan API:
```
GET /api/reports?type=summary&period=daily
```

## Fitur Real-time

Data laporan diperbarui secara real-time ketika ada perubahan dalam sistem:
- Perubahan status kehadiran siswa
- Update status kenaikan kelas
- Penambahan siswa baru

## Persyaratan Sistem

- Koneksi internet untuk mengakses API
- Browser modern yang mendukung JavaScript
- Hak akses administrator untuk mengakses laporan