<div align="center">

<img src="https://img.shields.io/badge/NikhOS-Student%20Dashboard-a855f7?style=for-the-badge&logoColor=white" />
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Framer_Motion-✓-ec4899?style=for-the-badge" />

<br />
<br />

# 🎓 NikhOS

### A premium SaaS-level student dashboard — built for focus, designed for excellence.

[🚀 Live Demo](https://nikh-os-red.vercel.app) · [📦 Repo](https://github.com/Nikhcodes/NikhOS)

<br />

![NikhOS Dashboard Preview]()

</div>

---

## ✨ Features

| Widget | Description |
|---|---|
| 📊 **Grade Tracker** | Animated average grade with pass/fail indicator |
| 📚 **Subjects** | Add, edit, delete subjects with color coding |
| ✅ **Assignments** | Task manager with priority levels and urgency glow |
| 📅 **Calendar** | Upcoming tests and events with countdown |
| 🔗 **Quick Links** | Personal bookmark bar with emoji icons |
| ⏱️ **Study Timer** | Pomodoro timer with animated progress ring |
| 🧠 **Insights** | Productivity score, completion rate, grade trends |

---

## 🎨 Design System

- **Background:** Pure black `#000000`
- **Cards:** Glass morphism — `bg-white/5` + `backdrop-blur-xl` + subtle borders
- **Accent:** Pink → Purple gradients throughout
- **Typography:** Inter font — clean Apple-style UI
- **Animations:** Framer Motion everywhere — staggered entrances, spring buttons, animated counters

---

## 🛠️ Tech Stack

- **[Vite](https://vitejs.dev/)** — lightning fast build tool
- **[React 18](https://react.dev/)** — component-based UI
- **[Tailwind CSS v4](https://tailwindcss.com/)** — utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** — production-grade animations
- **LocalStorage** — zero-backend persistence

---

## 🚀 Getting Started
```bash
# Clone the repo
git clone https://github.com/Nikhcodes/NikhOS.git

# Navigate into the project
cd NikhOS

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure
```
src/
├── components/
│   ├── Header.jsx
│   ├── GradeWidget.jsx
│   ├── SubjectsWidget.jsx
│   ├── AssignmentsWidget.jsx
│   ├── CalendarWidget.jsx
│   ├── LinksWidget.jsx
│   ├── StudyTimer.jsx
│   └── InsightsWidget.jsx
├── hooks/
│   └── useLocalStorage.js
├── utils/
│   └── storage.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 📱 Responsive

| Breakpoint | Layout |
|---|---|
| Mobile `< 768px` | Single column stack + hamburger drawer |
| Tablet `768px–1023px` | Two column grid |
| Desktop `1024px+` | Premium 3-column intentional layout |

---

<div align="center">

Built by [Nikh](https://github.com/Nikhcodes) · Powered by caffeine and Framer Motion ☕

</div>