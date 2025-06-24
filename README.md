````md
# 🧙‍♂️ Hxbit — The Solo Leveling-Inspired Extracurricular RPG 🎮

Welcome to **Hxbit** — a gamified, dark-themed, fully-featured platform that transforms real-life extracurriculars into an epic RPG adventure. Track your progress, earn XP, complete tasks, and level up like you're the main character in *Solo Leveling*. Here, you're not only building habits that stick, but also life skills, extracurricular success, and winning in an IRL RPG system.

---

## 🌟 Features at a Glance

### 🎮 Core Gamification
- 🔄 **XP & Leveling**: Earn XP from tasks, competitions, internships, and self-growth.
- 🏆 **Achievements**: Foundation for unlockable rewards.
- 🧠 **RPG Stats**: Strength, Agility, Perception, Endurance, Luck, Hygiene, etc.
- ⚔️ **Level-Up Celebrations**: Glowing progress bars, animated XP counters.
- 🏋 **Fitness and Self Improvement**: Level up your physical stats like a videogame with attribute points.

### 🧰 Activity Management
- ✅ **Tasks**: Create, complete, and gain XP.
- 📊 **Real-Time Feedback**: XP bars, level indicators, live updates.
- 📚 **Extracurriculars**: Dynamically create/manage multiple activities.
- 📈 **Internships**: Actively log internship hours, time commitments, and success.
- 🥇 **Competitions**: Quickly log wins, results, prizes, and competition attendances.
- 💪 **Fitness**: Add self-improvement to mental, physical, and emotional health, and level up stat bars.

### 💼 Career & Competitions
- 🥇 **Competitions Tab**: Track medals, ranks, dates, and more.
- 💻 **Internships Tab**: Log companies, durations, roles, and skill gains.
- 🧲 **Self Improvement Tab**: Log health and physical attribute growth.
- 🧑‍💻 **Profile Tab**: Coming soon....


### 🧘 Self-Improvement System
- 📈 **10 Attributes**: Strength, Agility, Intelligence, Vitality, Sense, Charisma, Luck, Endurance, Hygiene, Perception.
- 🎯 **Stat Points**: Earn points from XP and spend to improve personal attributes.
- 🔓 **Mastery Progress**: Track mastery over your life stats.

### 💻 Tech Stack
- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Supabase (Auth + Realtime DB)
- **Styling**: Glassmorphism + glowing effects + animated UI
- **Deployment**: Vite

---

## 🖼️ Aesthetic Design

| Feature | Description |
|--------|-------------|
| 🎨 **Dark Theme** | Inspired by Solo Leveling’s electric visuals |
| 🌘 **Dark/Light Mode** | Toggle with persistent preferences |
| 💎 **Colors** | `#00D4FF` (Electric Blue), `#8B5CF6` (Purple), `#F59E0B` (Gold) |
| 🖼️ **Modern UI** | Responsive card-based layout, glowing borders |
| ✨ **Particles & Animations** | Subtle hover and background effects |

---

## 🛠️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/extracurrihub.git
cd extracurrihub
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Supabase

* Create a project at [https://supabase.com](https://supabase.com)
* Copy your Supabase URL and public anon key to `.env`:

```bash
cp .env.example .env
```

Update your `.env`:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4️⃣ Apply Supabase Migrations

Use the following SQL files:

* `supabase/migrations/create_tables.sql`
* `supabase/migrations/enhanced_schema.sql`

You can run these directly in Supabase's SQL editor.

### 5️⃣ Start the Dev Server

```bash
npm run dev
```

---

## 🧩 Project Structure

```
📁 src/
├── lib/                # Supabase client
├── hooks/              # Custom React hooks
├── components/         # UI components
│   ├── Dashboard.tsx
│   ├── Auth.tsx
│   ├── ExtracurricularCard.tsx
│   ├── TaskList.tsx
│   ├── CreateTaskModal.tsx
│   ├── SelfImprovementTab.tsx
│   ├── CompetitionsTab.tsx
│   ├── InternshipsTab.tsx
│   └── ...
├── contexts/           # Theme context
├── App.tsx             # Main app shell
└── index.html
```

---

## 🧠 RPG Stat System Overview

| Attribute    | Description                   |
| ------------ | ----------------------------- |
| Strength     | Physical prowess              |
| Agility      | Speed and reflex              |
| Intelligence | Cognitive skills              |
| Vitality     | Stamina and resilience        |
| Sense        | Awareness and intuition       |
| Charisma     | Leadership and persuasion     |
| Luck         | Affects chance-based events   |
| Endurance    | Ability to withstand pressure |
| Hygiene      | Health and self-maintenance   |
| Perception   | Attention to detail           |

Earn stat points as you complete tasks and progress in competitions/internships. Redeem them in the **Self-Improvement Tab**.

---

## 📊 Roadmap

* [x] Real-time XP + Leveling
* [x] Self-improvement with RPG attributes
* [x] Competition and Internship tabs
* [x] Responsive card layout with modals
* [x] Dark/Light mode toggle
* [ ] Achievements system (Tiered)
* [ ] Friends / Leaderboard
* [ ] Mobile app version (React Native)

---

## 🧪 Testing

You can test features like:

* 📌 XP progression
* 🏁 Level-up animations
* 🧑‍💼 Adding internships
* 🧠 Upgrading RPG stats
* 💫 Dark/light theme switching

---

## 🤝 Contributing

Feel free to fork the repo, make enhancements, and submit a PR!

```bash
git checkout -b feature/my-feature
git commit -m "Added my cool feature"
git push origin feature/my-feature
```

---

## 📜 License

MIT License. Feel free to use, expand, and customize!

---

## 🔗 Connect

* **Demo**: *hxbit.netlify.app*
* **Github**: *ekans-0*
* **Discord**: *ekans_*
* **Email Me**: *dave.ekansh@gmail.com*

---

> Level up your real-life skills like you're grinding dungeons. Welcome to **ExtracurriHub** — where productivity meets RPG.
