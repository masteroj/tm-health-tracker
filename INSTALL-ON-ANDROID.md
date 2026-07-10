# Install the Health Tracker as a real app on your Galaxy A73

Your app is already a proper PWA (Progressive Web App). The easiest way to turn it into a
genuine, signed `.apk` you can install — **without Android Studio** — is Microsoft's free
**PWABuilder**. The flow is three stages: host the files, generate the APK, sideload it.

> Why not build the APK here? A signed APK has to be compiled against Google's Android SDK.
> This assistant's build sandbox can't reach Google's servers, so the APK is produced in the
> cloud by PWABuilder instead (no software to install on your PC).

Files you'll use (all in this folder): `index.html`, `manifest.json`, `sw.js`,
`icon-192.png`, `icon-512.png`.

---

## Stage 1 — Host the app (get an https link)

PWABuilder needs a public https URL. Pick **one** option.

### Option A — Netlify Drop (fastest, ~3 min)
1. Go to **https://app.netlify.com/drop** on your PC.
2. Sign in / sign up (free — Google or email login).
3. Drag this whole folder (`BP and weight tracker`) onto the drop zone.
4. Netlify gives you a URL like `https://calm-otter-1234.netlify.app`. Copy it.
5. Open that URL in a browser to confirm the app loads.

### Option B — GitHub Pages (free, permanent)
1. Create a free account at **https://github.com** if you don't have one.
2. Create a new **public** repository, e.g. `tm-health-tracker`.
3. Upload all five files above (Add file → Upload files → drag them in → Commit).
4. Repo → **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` / root → Save.
5. After ~1 minute your URL appears: `https://<your-username>.github.io/tm-health-tracker/`.

---

## Stage 2 — Generate the signed APK with PWABuilder

1. Go to **https://www.pwabuilder.com**.
2. Paste your hosted URL from Stage 1 and click **Start**.
3. It analyzes the app. You should see green checks for Manifest and Service Worker
   (this app is set up for both). Click **Package For Stores**.
4. Choose **Android**.
5. In the options dialog:
   - Package ID: `com.trendmicro.healthtracker` (or leave the default).
   - App name: `TM Health` (already filled from the manifest).
   - Leave **"Signing key: Create new"** selected so PWABuilder signs it for you.
6. Click **Download**. You get a `.zip` containing:
   - `app-release-signed.apk`  ← this is the file you install
   - `signing.keystore` + a passwords/readme file ← **keep these safe** (needed for any
     future update; without them you'd have to uninstall and reinstall).
   - `assetlinks.json` ← used in the optional step below.

---

## Stage 3 — Install (sideload) on your Galaxy A73

1. Get `app-release-signed.apk` onto the phone — email it to yourself, upload to Google
   Drive, or copy over USB.
2. Open the file on the phone using **My Files** (Samsung's file manager).
3. Samsung will warn: *"For your security, your phone is not allowed to install unknown apps
   from this source."* Tap **Settings** on that prompt.
4. Toggle **Allow from this source** on (this authorizes whichever app you opened the APK
   from — My Files, Chrome, or Drive).
   - Manual route: **Settings → Apps → ⋮ (top right) → Special access → Install unknown apps
     → pick the app → Allow**.
5. Go back and tap **Install**. Done — "TM Health" now appears in your app drawer with the
   red icon, launches full-screen, and works offline.

---

## Optional — remove the small address bar (clean full-screen)

A PWABuilder Android app verifies ownership of your site to hide the browser bar. If you
skip this, the app still works but may show a thin URL strip at the top.

1. Open the `assetlinks.json` from the PWABuilder zip.
2. Put it on your host at this exact path: `/.well-known/assetlinks.json`
   - **Netlify:** add a folder `.well-known` containing `assetlinks.json`, then re-drag the
     folder to Netlify Drop.
   - **GitHub Pages:** create `.well-known/assetlinks.json` in the repo and commit.
3. Reopen the app on the phone — the bar disappears once verification succeeds (may take a
   few minutes / one relaunch).

---

## Troubleshooting

- **PWABuilder shows a red X on Service Worker / Manifest:** make sure you opened the exact
  hosted URL (the page must load over https, not a `file://` path).
- **"App not installed" on the phone:** you likely have an older copy installed — uninstall
  it first, or the APK was re-signed with a different key. Uninstall, then install again.
- **Install button greyed out:** the "unknown sources" permission (Stage 3, step 4) isn't
  granted for the app you're opening the APK from.
- **Data safety:** all readings stay on the phone (local storage). Reinstalling with a new
  signing key can clear stored data, so export a CSV or save a 90-day report first.

---

## Alternative — fully offline APK (no hosting) via Android Studio

If you'd rather have an APK with the app bundled inside (no host needed at all), that route
uses a WebView/Capacitor project built in Android Studio on your PC. It's more setup. Say the
word and I'll generate the complete ready-to-build project in this folder with instructions.
