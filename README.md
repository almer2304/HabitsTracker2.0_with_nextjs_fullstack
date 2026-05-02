# 🎮 HabitHero: Gamified Habit Tracker

**HabitHero** adalah platform pelacakan kebiasaan (habit tracker) bertema *Cyber-RPG* yang mengubah disiplin diri menjadi sebuah petualangan. Dibangun dengan teknologi modern, aplikasi ini menggabungkan produktivitas dengan elemen *gaming* seperti XP, Streak, Badges, dan Guilds untuk memastikan pengguna tetap konsisten.

---

## 🚀 Fitur Utama

* **Cyber Command Center**: Dashboard utama yang menampilkan statistik vital seperti *Best Streak*, *Total XP*, dan *Active Quests*.
* **XP Growth Timeline**: Grafik interaktif (Weekly/Monthly) untuk melacak tren produktivitas secara real-time.
* **Streak Mechanic (TikTok Style)**: Sistem streak harian yang menantang konsistensi. Jika kamu melewatkan satu hari, api streak akan padam (reset ke 1).
* **RPG Quest System**: Kelola kebiasaan harian sebagai "Quests". Selesaikan misi untuk mendapatkan XP dan meningkatkan progres karakter.
* **Guilds & Community**: Bergabung dengan komunitas (Guild), berinteraksi via *Live Chat*, dan selesaikan misi bersama.
* **Automated Badge System**: Dapatkan lencana (Badges) otomatis berdasarkan pencapaian XP, streak, atau kategori tertentu.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Auth** | [NextAuth.js (JWT Strategy)](https://next-auth.js.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) |
| **Charts** | [Recharts](https://recharts.org/) |

---

## 📂 Struktur Proyek

```text
├── src
│   ├── app            # Next.js App Router (Pages & API Routes)
│   ├── components     # UI Components (Sidebar, Charts, Modals)
│   ├── db             # Database Schema (Drizzle) & Configurations
│   ├── lib            # Utility functions & Auth options
│   └── hooks          # Custom React Hooks
└── public             # Static Assets (Images & Icons)
```
---

## ⚙️ Instalasi Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di mesin lokal Anda:

1. **Clone repositori:**
   ```bash
   git clone [https://github.com/almer2304/HabitsTracker2.0_with_nextjs_fullstack.git](https://github.com/HabitsTracker2.0_with_nextjs_fullstack.git)
   cd HabitsTracker2.0_with_nextjs_fullstack
   ```

2. **Instal dependensi:**
  ```bash
  npm install
  ```

3. **Konfigurasi Environment Variables:**
  ```bash
  DATABASE_URL=postgresql://user:password@localhost:5432/habit_tracker_db
  NEXTAUTH_SECRET=your_secret_key
  GOOGLE_CLIENT_ID=your_google_id
  GOOGLE_CLIENT_SECRET=your_google_secret
  ```

4. **Sinkronisasi Database:
Gunakan Drizzle Kit untuk mendorong skema ke database lokal Anda:**
  ```bash
  npx drizzle-kit push
  ```

5. **Jalankan Aplikasi:**
  ```bash
  npm run dev
  ```

---

## 🤝 Kontribusi

Kami sangat menghargai kontribusi dari komunitas! Jika Anda ingin meningkatkan **HabitHero**, silakan ikuti langkah-langkah berikut:

1. **Fork** repositori ini.
2. **Buat branch** fitur baru:  
   `git checkout -b fitur/FiturKeren`
3. **Commit** perubahan Anda:  
   `git commit -m 'Menambahkan fitur keren'`
4. **Push** ke branch tersebut:  
   `git push origin fitur/FiturKeren`
5. **Buka Pull Request** agar kami bisa meninjau kontribusi Anda.

---

Dibuat dengan 🔥 oleh [Almer](https://github.com/almer2304)
  
