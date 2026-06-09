# Phase Zero — Marine Weather Dashboard

A single-file HTML marine weather dashboard for coastal and offshore use. Built as a companion to the [SAR Calculator](https://github.com/Kels316/SAR-calculator), sharing the same data sources and tide database.

## Features

- **Always-visible Leaflet map** — tap to set location, drag the marker to refine
- **Live conditions panel** — 12-cell grid showing:
  - Marine warnings (BOM Weather API, inline, colour-coded by severity)
  - Conditions (WMO weather code)
  - Wind speed (Beaufort-coloured), direction, gusts
  - Ocean current speed and direction
  - Wave height, direction, period, and Douglas sea state
  - Swell height, direction, period, and swell classification
  - Air temperature and feels-like
  - Sea surface temperature
  - Visibility, pressure, humidity, cloud cover
- **Tide chart** — pure canvas chart from the ANTT 2026 tide database, showing 2 past and 4 future extremes with a NOW line. Nearest station within 150 km is auto-selected.
- **Mobile responsive** — two-column desktop layout collapses to single column on mobile

## Data Sources

| Data | Source |
|------|--------|
| Wind, temperature, pressure, humidity, cloud, visibility | [Open-Meteo Forecast API](https://open-meteo.com/) |
| Waves, swell, ocean current, sea surface temperature | [Open-Meteo Marine API](https://marine-api.open-meteo.com/) |
| Marine warnings | [BOM Weather API](https://api.weather.bom.gov.au/) (no key required) |
| Tide predictions | ANTT 2026 database (`tide-db.js` from SAR Calculator) |

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

1. Tap the map or enter coordinates (decimal, DM, or DMS format with hemisphere suffix)
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
