# Get an installable APK — built entirely on GitHub

You don't need to install anything. GitHub compiles the app on its own servers and puts a
ready-to-install **TM-Health.apk** on your repository's Releases page. You then download and
install it directly on your Android phone.

**You need:** a free GitHub account (https://github.com/signup). That's it.

The project files are in `TM-Health-project.zip` (in this folder). Unzip it first — you'll
upload its contents to GitHub. It already includes the build recipe at
`.github/workflows/build-apk.yml`.

---

## Step 1 — Create a repository
1. Sign in at https://github.com.
2. Click **+** (top right) → **New repository**.
3. Name it e.g. `tm-health-app`, set it to **Public**, and click **Create repository**.

## Step 2 — Upload the project files
On the new empty repo page, click **"uploading an existing file"** (or **Add file → Upload files**).

1. Unzip `TM-Health-project.zip` on your device.
2. Select **everything inside** the unzipped folder (so `App.js`, `package.json`, the `src`
   folder, `assets`, etc. sit at the **top level** of the repo — do not upload the outer
   folder itself).
3. Drag them into the upload area, then click **Commit changes**.

> **Important — the hidden `.github` folder.** It holds the build instructions. If your
> uploader skipped it (some phones/browsers hide dot-folders), add it by hand:
> **Add file → Create new file**, type this exact name in the box:
> `.github/workflows/build-apk.yml`
> then open `build-apk.yml` from the unzipped project, copy all of it, paste, and commit.

## Step 3 — Let GitHub build the APK
Uploading to the main branch starts the build automatically. To watch or re-run it:
1. Open the **Actions** tab. If prompted, click **"I understand my workflows, enable them."**
2. You'll see **Build Android APK** running (yellow dot). You can also start it manually:
   select it → **Run workflow**.
3. Wait for the green check. The first build takes about **15–20 minutes** (it downloads the
   Android toolchain); later builds are faster.

## Step 4 — Download the APK on your phone
1. On the phone, open your repo in the browser and tap **Releases** (right side, or add
   `/releases` to the repo URL).
2. Open **TM Health (latest build)** and tap **`TM-Health.apk`** to download it.

## Step 5 — Install it
1. Tap the downloaded `TM-Health.apk` (from the notification or your Downloads).
2. If Android says *"can't install unknown apps,"* tap **Settings → Allow from this source**,
   go back, and tap **Install**.
3. "TM Health" appears in your app drawer — full-screen, offline, data stays on the phone.

---

## Troubleshooting
- **No build started / Actions tab empty:** the `.github/workflows/build-apk.yml` file
  didn't upload. Add it manually as described in Step 2.
- **Build fails almost immediately:** the files were probably uploaded inside an extra
  folder. `package.json` must be at the **root** of the repo, not under `TMHealthApp/`.
- **Build fails during "Build release APK":** open the failed step's log and send me the last
  ~20 lines — I'll adjust the workflow.
- **APK won't install / "app not installed":** you may have an older copy installed; uninstall
  it first, then install again.

## Updating later
Change something, upload the changed file(s) to the repo — a new build runs automatically and
replaces the APK under Releases. Because every build uses the same signing key, the new
version installs right over the old one without losing your data.
