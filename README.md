# Sakhi (सखी)

A private period and cycle health tracker for Android and the web, in **English and Hindi**.
It's built for people aged 16 and over who want to understand their cycle and spot health patterns early.

Everything stays on the phone. There's no account, no server, no ads and no trackers.

## Features

| Area | What it does |
|---|---|
| **Today** | Cycle day, current phase, days until the next period (shown as a range), and one-tap "My period started" / "My period ended" buttons |
| **Calendar** | Logged periods, predicted periods, fertile window, likely ovulation and spotting. Tap any past day to log it |
| **Daily log** | Bleeding (spotting to heavy), pain level, discharge (dry to egg-white), 14 symptoms, 7 moods, pill taken, and notes |
| **Goals** | *Track my cycle*, *Trying to conceive* (shows the best days to try and when to see a doctor), or *Pregnant* |
| **Pregnancy mode** | Week and day, due date and trimester from the last period or a doctor's due date. Stage-by-stage body, baby and to-do guidance, the check-up schedule (WHO, PMSMA, JSSK), danger signs with ambulance numbers 108/102, and healthy habits. Period predictions and late alerts pause; after birth or loss it shows gentle aftercare and waits for the first new period |
| **Waking temperature (BBT)** | Daily °C/°F logging and a chart of the current cycle. It confirms ovulation with the standard "3 over 6" rule and then pins the next-period prediction to ovulation + 14 days |
| **Intimacy log** | Private and can be hidden. Unprotected sex plus a late period gives a clear "take a pregnancy test" note. Within 3 days of unprotected sex it shows an emergency contraception note (not when trying to conceive) |
| **Relief for today** | Natural tips on the home screen for the symptoms and moods logged today (cramps tips by default during a period) |
| **Natural remedies** | 12 symptom guides (cramps, back pain, headache, bloating, breast tenderness, acne, tiredness, nausea, cravings, sleep, mood/PMS, hot flashes). Every tip is labelled *good evidence*, *some evidence* or *traditional*, with safety cautions and when to see a doctor. Food amounts only, never supplement doses |
| **Phase guide** | For each cycle phase: what your hormones and body are doing, plus food, movement and self-care ideas |
| **Predictions** | Average of your last 6 cycles, with recent cycles counting more. The range is wider when your cycles vary more. Ovulation is estimated at about 14 days before the next period |
| **Health notes** | Gentle "talk to a doctor" prompts for frequent, long or irregular cycles, long or heavy periods, no period for 90+ days, late periods, bleeding between periods, severe pain, PCOS-like patterns and possible anaemia. An urgent banner appears for heavy bleeding with dizziness |
| **Doctor report** | A summary of recent cycles, warnings and symptoms. It can be shared from the phone or printed / saved as a PDF on the web, in English or Hindi |
| **Learn** | 16 articles in both languages, in 4 groups. *Know your body:* cycle basics, discharge, breast self-check, period hygiene, myths vs facts, perimenopause. *Health conditions:* when to see a doctor, heavy periods and anaemia, PCOS, pain and endometriosis. *Sexual & reproductive health:* contraception, "could I be pregnant?", STIs, the HPV vaccine and screening, consent. *Wellbeing:* nutrition, stress and sleep, PMS/PMDD. Includes Indian helplines: Tele-MANAS 14416, Women Helpline 181, emergency 112 |
| **Reminders** | Period coming soon, period late, a monthly breast self-check, and a daily pill reminder. These are scheduled on the phone itself |
| **Privacy** | Optional 4-digit PIN lock (it re-locks after 1 minute in the background), backup export/import, and delete all data. Android cloud backup is turned off |

The warning thresholds follow the FIGO and ACOG definitions of normal periods. The details are in the comments in
`src/lib/health.ts`. Every warning says what to do ("talk to a doctor"). None of them names a diagnosis.

## Tech

- React 19 + TypeScript + Vite. The same build is both the website and the Android app.
- Capacitor 8 wraps it for Android, targeting Android 16 (API 36) as Google Play requires. It supports Android 7 and later.
- Data is stored with Capacitor Preferences: Android's on-device settings storage in the app, and the browser's local storage on the web.
- There's no backend.

```
src/lib/cycle.ts        predictions, phases, calendar marks
src/lib/health.ts       health warning rules
src/lib/report.ts       doctor report
src/lib/storage.ts      on-device storage + backup validation
src/lib/notifications.ts reminders
src/i18n/en.ts, hi.ts   every on-screen string (a test checks that Hindi has every English line)
src/i18n/articles*.ts   Learn articles (both languages)
src/i18n/remedies.ts    natural remedies with evidence labels
src/i18n/phases.ts      phase-by-phase guide
src/i18n/pregnancy.ts   pregnancy-mode content
src/lib/pregnancy.ts    pregnancy dating
src/screens/            Today, Calendar, Insights, Report, Learn, Settings, Onboarding, Privacy
android/                the native Android project (generated by Capacitor, committed)
```

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 45 unit tests: predictions, health rules, translations, remedies/articles content, backups, PIN, report
npm run build      # website build in dist/
```

## Android

You need JDK 21 and the Android SDK (Android Studio installs both).

```bash
npm run android:sync     # build the web app and copy it into android/
npm run android:open     # open in Android Studio to run on a phone or emulator
cd android && ./gradlew assembleDebug    # installable test APK: app/build/outputs/apk/debug/app-debug.apk
```

## Releasing on Google Play

1. **Choose the app ID now.** `com.pkjproject.sakhi` is a placeholder in `capacitor.config.ts` and
   `android/app/build.gradle`. **It can never change after the first upload.** Also check that "Sakhi" isn't
   already taken on Play, and change the name if needed.
2. **Create an upload key once, and back it up safely.** If you lose it, you have to ask Google to reset it.
   ```bash
   keytool -genkeypair -v -keystore android/sakhi-upload.jks -alias sakhi-upload -keyalg RSA -keysize 2048 -validity 10000
   cp android/keystore.properties.example android/keystore.properties   # then fill in the passwords
   ```
   Both files are git-ignored. Never commit them.
3. **Build the bundle:** run `npm run android:release`. This produces `android/app/build/outputs/bundle/release/app-release.aab`.
   For every later release, raise `versionCode` (and `versionName`) in `android/app/build.gradle`.
4. **Fill in the Play Console** (play.google.com/console, which has a one-time $25 fee):
   - **Privacy policy URL:** host `dist/privacy.html` (for example with the website, or on GitHub Pages) and paste its link.
   - **Data safety:** "No data collected" and "No data shared". This is accurate, because nothing leaves the device.
   - **Health apps declaration:** choose menstrual / reproductive health tracking. Don't claim contraception or diagnosis.
   - **Target audience:** 16–17 and 18+. Not under 13, which would bring in the Families policy.
   - **Content rating questionnaire, store listing in English and Hindi, and screenshots.**
5. New personal developer accounts must run a **closed test with at least 12 testers for 14 days** before they can publish to production.

## Before public release

- [ ] **Medical review:** have a gynaecologist review `src/lib/health.ts` thresholds, the articles, `src/i18n/remedies.ts` (including the evidence labels) `src/i18n/phases.ts` and `src/i18n/pregnancy.ts` (an obstetrician for that one).
- [ ] **Language review:** have a native Hindi speaker review `src/i18n/hi.ts` and the Hindi articles.
- [ ] **Device testing:** test on a real Android phone (reminders, back button, PIN re-lock, backup share).

## Website

`npm run build` outputs a static site in `dist/` that can go on any static host (Netlify, Vercel, GitHub Pages and so on).
On the web, data lives in that browser only, and reminders aren't available.
