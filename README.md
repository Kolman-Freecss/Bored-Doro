# Bored Doro 🦥

**Time to bore you.**

A reverse Pomodoro: instead of a productivity timer, this is a **boredom timer**. Permission to do nothing. You're allowed to be bored.

Built with **Ionic React** + **Capacitor** so you can run it on the web and publish to the **Google Play Store (Android)**.

---

## Getting started

### Prerequisites

- **Node.js** 18+ and npm
- For Android builds: **Android Studio** and **Java 17** (or use the Android SDK installed by Android Studio)

### Install and run in the browser

```bash
# Install dependencies
npm install

# Run the app in the browser (dev server)
npm run dev
```

Then open **http://localhost:5173** in your browser.

### Build for production (web)

```bash
npm run build
```

The built files are in the `dist/` folder. You can deploy `dist/` to any static host (Vercel, Netlify, Firebase Hosting, etc.).

### Run on an Android device or emulator

1. Build the web app and add the Android platform (one-time):

   ```bash
   npm run build
   npx cap add android
   ```

2. Sync the web build into the native project:

   ```bash
   npx cap sync
   ```

3. Open the project in Android Studio and run it:

   ```bash
   npx cap open android
   ```

   In Android Studio: choose a device or emulator and click **Run** (green play button).

---

### Useful commands summary

| Task              | Command              |
|-------------------|----------------------|
| Dev (browser)     | `npm run dev`        |
| Production build  | `npm run build`      |
| Sync to Android  | `npx cap sync`       |
| Open Android      | `npx cap open android` |

---

## Project structure (simple)

```
boreddoro/
├── src/
│   ├── App.tsx           # Root: Ionic app + router
│   ├── App.css           # App layout and Bored Doro styles
│   ├── main.tsx          # Entry point
│   ├── theme/
│   │   └── variables.css  # CSS variables (colors, font)
│   ├── pages/
│   │   └── Home.tsx      # Main page (timer + game)
│   └── components/
│       ├── Timer.tsx    # Boredom session timer
│       └── Game.tsx     # Dino-style jump game
├── android/              # Created by: npx cap add android
├── dist/                 # Created by: npm run build
├── index.html
├── package.json
├── vite.config.ts
├── ionic.config.json
├── capacitor.config.ts
├── README.md
└── docs/
    └── PLAY-CONSOLE-GUIDE.md   # Full Google Play Console & deployment guide
```

---

## What’s in the app

- **Boredom session timer**: presets 2, 5, 10, 15 min or custom (1–120); start, pause, resume. “Session done” when it ends.
- **Mini-game**: sloth runs; you jump (Space or tap) over bones. Light/dark theme, Support link.

---

*You don’t have to be productive. You’re allowed to be bored.*
