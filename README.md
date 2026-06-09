# Phase Zero — Marine Weather Dashboard

A single-file HTML marine weather dashboard for coastal and offshore use. Built as a companion to the [SAR Calculator](https://github.com/Kels316/SAR-calculator), sharing the same data sources and tide database.

## Features

### Map
- Always-visible Leaflet map (CARTO Voyager tiles) — tap to set location, drag the marker to refine, or enter coordinates manually
- Map zooms to the selected location on every input method
- Floating overlay showing current conditions emoji (day/night-aware), air temperature, wind arrow + speed, and ocean current arrow + speed — all positioned on the right side of the map

### Live Conditions Panel
12-cell grid showing:
- Marine warnings (BOM Weather API, inline, colour-coded by severity)
- Conditions (WMO weather code description)
- Wind speed (Beaufort-coloured), direction and gusts
- Ocean current speed and direction
- Wave height, direction, period, and Douglas sea state
- Swell height, direction, period, and swell classification
- Air temperature and feels-like
- Sea surface temperature
- Visibility, pressure, humidity, cloud cover

### Sun & Moon Panel
Calculated client-side from lat/lon — no extra API call:
- Moon phase emoji, name, and illumination percentage
- Sun times table: astronomical, nautical, and civil twilight dawn/dusk, plus sunrise and sunset

### Tides
Pure canvas chart from the ANTT 2026 tide database, showing 2 past and 4 future extremes with a NOW line. Nearest station within 150 km is auto-selected.

### General
- Mobile responsive — two-column desktop layout collapses to single column on mobile
- Local time throughout; live conditions panel shows "correct as at" fetch timestamp

## Data Sources

| Data | Source |
|------|--------|
| Wind, temperature, pressure, humidity, cloud, visibility | [Open-Meteo Forecast API](https://open-meteo.com/) |
| Waves, swell, ocean current, sea surface temperature | [Open-Meteo Marine API](https://marine-api.open-meteo.com/) |
| Marine warnings | [BOM Weather API](https://api.weather.bom.gov.au/) (no key required) |
| Tide predictions | ANTT 2026 database (`tide-db.js` from SAR Calculator) |
| Sun & moon times | Calculated client-side (NOAA solar algorithm) |

## Usage

Open `index.html` directly in a browser. No build step or server required.

The tide database is loaded from `../SAR-calculator/tide-db.js` — both repos should be cloned as siblings:

```
parent/
├── SAR-calculator/
│   └── tide-db.js
└── marine-weather-dashboard/
    └── index.html
```

1. Tap the map or enter coordinates (decimal, DM, or DMS with hemisphere suffix)
2. Press **Load Conditions**
3. The map zooms to the location and all data loads in parallel

## Location Input Formats

All of the following are accepted:

```
-27.46980          (decimal, southern hemisphere)
27.46980 S         (decimal with hemisphere)
27 28.188 S        (degrees and decimal minutes)
27 28 11.3 S       (degrees, minutes, seconds)
```
