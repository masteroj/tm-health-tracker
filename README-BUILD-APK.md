# TM Health — Expo app: run it & build a real APK

A native React Native (Expo) app for tracking blood pressure and weight.
Four tabs — **Dashboard, Log, History, Settings/Export** — with trend charts,
BP classification (Normal / Elevated / High), kg⇄lb toggle, on-device 90-day
storage with auto-cleanup, and PDF export via `expo-print`.

## What you need on your PC (one-time)
1. **Node.js LTS** — https://nodejs.org (v18+).
2. A free **Expo account** — https://expo.dev/signup (needed only for the cloud APK build).

> **Folder path note:** React Native tooling dislikes spaces in the path. This project sits
> under "BP and weight tracker" (which has spaces). If you hit odd Metro/Gradle errors,
> copy the `TMHealthApp` folder to a space-free location first, e.g. `C:\dev\TMHealthApp`,
> and run the commands from there.

## Step 1 — Install dependencies
Open a terminal in the `TMHealthApp` folder and run:
```
npm install
npx expo install        # aligns native module versions to this Expo SDK
```

## Step 2 — Try it instantly on your Galaxy A73 (no build)
Fastest way to see it running:
1. Install **Expo Go** from the Play Store on the A73.
2. On the PC run:
   ```
   npx expo start
   ```
3. Scan the QR code with Expo Go (same Wi-Fi). The app loads live; edits refresh instantly.

This is great for testing, but Expo Go is not a standalone install. For an installable
`.apk`, do Step 3.

## Step 3 — Build a real installable APK (EAS Build, free cloud)
No Android Studio needed — Expo compiles it in the cloud and gives you a download link.
```
npm install -g eas-cli
eas login
eas build -p android --profile preview
```
- `preview` is configured in `eas.json` to output an **APK** (not an app-bundle).
- The build runs on Expo's servers (~10–20 min the first time). When done, the terminal
  prints a URL; open it and **Download** the `.apk`. EAS handles signing for you.

## Step 4 — Install on the Galaxy A73
1. Get the `.apk` onto the phone (download directly on the phone, email, or USB).
2. Open it with **My Files**.
3. When prompted *"not allowed to install unknown apps,"* tap **Settings → Allow from
   this source**, then go back and tap **Install**.
   (Or: Settings → Apps → ⋮ → Special access → Install unknown apps → pick the app → Allow.)
4. "TM Health" appears in your app drawer with the blue icon — full-screen, works offline,
   data stays on the device.

## Updating later
Bump `versionCode` in `app.json` (e.g. 1 → 2), rebuild with the same command, reinstall.
Because EAS keeps your signing key, updates install over the top without losing data.

## Project layout
```
App.js                     Navigation + 4 tabs + shared header
src/theme.js               Medical-blue palette, shadows, spacing
src/logic.js               BP classification, kg/lb conversion, stats
src/storage.js             AsyncStorage + 90-day auto-cleanup
src/DataContext.js         App-wide data + add/edit/delete actions
src/report.js              HTML for the PDF report
src/components/            Card, StatusPill, LineChart (SVG), DateTimeField
src/screens/               DashboardScreen, LogScreen, HistoryScreen, SettingsScreen
assets/                    App icon, adaptive icon, splash
```

## Notes
- Storage key is `tm_health_v2`; readings older than 90 days are pruned on launch.
- Weight is stored canonically in kg and converted for display, so the kg/lb toggle never
  loses precision.
- The PDF report covers the last 90 days and opens the system share sheet (save to Files,
  email, print, etc.).
