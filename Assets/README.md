# Play Store assets — Bored Doro

Resources for **Google Play Console**: app icon, feature graphic, and screenshots (phone, 7" tablet, 10" tablet). All can be taken or generated from the same application.

**Included in this folder:**
- `icon/app-icon-512.png` — 512×512 app icon (use in Play Console).
- `feature-graphic/feature-graphic-1024x500.png` — 1024×500 feature graphic (store banner).

**Screenshots:** Capture from the running app (see “How to capture” below) and save into those folders. Included: phone-home.png, phone-timer.png, tablet-7-home.png, tablet-10-home.png.

## Required dimensions (Google Play)

| Resource | Size | Format | Folder |
|----------|------|--------|--------|
| **App icon** | 512 × 512 px | 32-bit PNG (alpha allowed) | `icon/` |
| **Feature graphic** | 1024 × 500 px | PNG or JPEG | `feature-graphic/` |
| **Phone screenshots** | Min 320 px on shortest side (e.g. 1080×1920) | PNG or JPEG | `screenshots/phone/` |
| **7" tablet screenshots** | 1920 × 1080 (16:9), same as 10" | PNG or JPEG | `screenshots/tablet-7/` |
| **10" tablet screenshots** | 1920 × 1080 (16:9), same as 7" | PNG or JPEG | `screenshots/tablet-10/` |

## Folder structure

```
Assets/
├── README.md
├── icon/                    # 512×512 app icon
├── feature-graphic/         # 1024×500 store banner
└── screenshots/
    ├── phone/               # Phone captures (e.g. 1080×1920)
    ├── tablet-7/            # 7" tablet captures
    └── tablet-10/           # 10" tablet captures
```

## How to capture from the app

1. Run the app: `npm run dev` and open http://localhost:5173
2. **Phone:** Resize browser to 390×844 (or 1080×1920 for full-res). Capture the main screen (timer), then game screen if needed.
3. **7" and 10" tablet:** Both use 16:9. Resize to 1920×1080 (or 1280×720). Take screenshots; same dimensions for both.
5. Save files into the folders above with clear names (e.g. `phone-timer.png`, `tablet-7-home.png`).

You need at least **2 phone screenshots**. Tablet screenshots are optional but recommended.
