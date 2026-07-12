# TM Health — Blood Pressure & Weight Tracker

A simple, private Android app for tracking blood pressure and weight, built for the
**Trend Micro Active Lifestyle Program**. Log daily readings, watch your trends, and export
a PDF report — all stored locally on your device.

![Build Android APK](../../actions/workflows/build-apk.yml/badge.svg)

---

## Features

- **Dashboard** — latest blood pressure and weight at a glance, with trend charts (7 / 30 / 90-day) and 7-day averages.
- **Log** — record systolic/diastolic readings and weight, with a **kg ⇄ lb** toggle and a date/time picker.
- **BP classification** — every reading is labelled **Normal**, **Elevated**, or **High** with a color indicator, based on standard thresholds.
- **History** — review, **edit**, or delete any past reading.
- **PDF export** — generate a 90-day report (summary + full readings) to save, print, or share.
- **Private by design** — all data stays on your phone. No account, no cloud, no tracking.
- **Auto-cleanup** — readings older than 90 days are removed automatically to keep the app fast.

## Install the app (no tools required)

GitHub builds the APK for you and publishes it on the **Releases** page.

1. Fork or upload this project to your own GitHub repository.
2. The **Build Android APK** workflow runs automatically and attaches `TM-Health.apk` to a release.
3. On your Android phone, open **Releases → TM Health (latest build) → `TM-Health.apk`**, then install it (allow "unknown apps" if prompted).

Full step-by-step instructions: see [`GET-APK-FROM-GITHUB.md`](GET-APK-FROM-GITHUB.md).

## Build it yourself (optional, for developers)

```bash
npm install
npx expo start           # run live on a device via the Expo Go app
```

To produce an APK locally, see [`README-BUILD-APK.md`](README-BUILD-APK.md).

## How the automatic build works

`.github/workflows/build-apk.yml` runs on GitHub's servers and:
1. installs dependencies,
2. generates the native Android project with `expo prebuild`,
3. compiles a release APK with Gradle, and
4. publishes it to the repository's **Releases**.

It runs on every push to `main` and can also be triggered manually from the **Actions** tab.

## Tech stack

- [Expo](https://expo.dev) / React Native (SDK 51)
- React Navigation (bottom tabs)
- `react-native-svg` for charts
- `@react-native-async-storage/async-storage` for local storage
- `expo-print` + `expo-sharing` for PDF export

## Project structure

```
App.js                 Navigation, tabs, and shared header
src/theme.js           Medical-blue palette, shadows, spacing
src/logic.js           BP classification, kg/lb conversion, stats
src/storage.js         AsyncStorage + 90-day auto-cleanup
src/DataContext.js     App-wide data with add / edit / delete actions
src/report.js          HTML template for the PDF report
src/components/        Card, StatusPill, LineChart, DateTimeField
src/screens/           Dashboard, Log, History, Settings/Export
assets/                App icon, adaptive icon, splash screen
.github/workflows/     Automated APK build
```

## Disclaimer

This app is for personal wellness tracking only and is **not a medical device**. It does not
provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare
professional about your blood pressure, weight, or any health concerns.

---

*Trend Micro · Active Lifestyle Program*
