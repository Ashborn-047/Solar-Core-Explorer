# 🚀 Major Space Missions Implementation Plan

> **Status**: Ready for Implementation  
> **Last Updated**: February 6, 2026

Expand the Solar System Explorer's mission tracking system to include ~35 major space missions from humanity's exploration history, covering all major space agencies (NASA, ISRO, ESA, JAXA, CNSA, USSR/Roscosmos, UAE).

---

## Data Schema

Each mission entry follows this structure:

```javascript
{
    name: 'Mission Name',
    agency: 'AGENCY',           // NASA, ISRO, ESA, JAXA, CNSA, USSR, UAE
    color: '#hexcolor',
    path: [[x,y,z], ...],       // 3D trajectory points
    size: 1.2,
    target: 'Target Body',
    launch: 'YYYY',
    status: 'Active|Success|Completed|Historic',
    description: 'Brief mission summary',
    scientific_goal: 'Primary objective',
    importance: 'Historical significance'
}
```

---

## Missions to Add (~35)

### 🌙 Lunar Exploration
| Mission | Agency | Year | Status |
|---------|--------|------|--------|
| Luna 2 | USSR | 1959 | Historic |
| Luna 9 | USSR | 1966 | Historic |
| Apollo 11 | NASA | 1969 | Historic |
| Apollo 13 | NASA | 1970 | Historic |
| LRO | NASA | 2009 | Active |
| Chang'e 4 | CNSA | 2019 | Active |
| Chandrayaan-1 | ISRO | 2008 | Completed |
| Artemis I | NASA | 2022 | Success |

### 🔴 Mars Missions
| Mission | Agency | Year | Status |
|---------|--------|------|--------|
| Viking 1 | NASA | 1975 | Historic |
| Viking 2 | NASA | 1975 | Historic |
| Mars Pathfinder | NASA | 1996 | Completed |
| Spirit | NASA | 2004 | Completed |
| Opportunity | NASA | 2004 | Completed |
| Mars Express | ESA | 2003 | Active |
| Curiosity | NASA | 2012 | Active |
| Perseverance | NASA | 2021 | Active |
| Hope Probe | UAE | 2020 | Active |

### 🪐 Outer Giants
| Mission | Agency | Year | Status |
|---------|--------|------|--------|
| Pioneer 10 | NASA | 1972 | Historic |
| Pioneer 11 | NASA | 1973 | Historic |
| Voyager 2 | NASA | 1977 | Active |
| Galileo | NASA | 1989 | Completed |
| Cassini-Huygens | NASA/ESA | 1997 | Completed |
| New Horizons | NASA | 2006 | Active |
| Juno | NASA | 2011 | Active |
| JUICE | ESA | 2023 | Active |

### ✨ Historic & Interstellar
| Mission | Agency | Year | Status |
|---------|--------|------|--------|
| Sputnik 1 | USSR | 1957 | Historic |

### 🇮🇳 ISRO
| Mission | Agency | Year | Status |
|---------|--------|------|--------|
| Aditya-L1 | ISRO | 2023 | Active |

### 🇨🇳 CNSA
| Mission | Agency | Year | Status |
|---------|--------|------|--------|
| Chang'e 6 | CNSA | 2024 | Success |

### 🇯🇵 JAXA
| Mission | Agency | Year | Status |
|---------|--------|------|--------|
| Hayabusa | JAXA | 2003 | Completed |
| Hayabusa2 | JAXA | 2014 | Completed |
| Akatsuki | JAXA | 2010 | Active |

### 🇷🇺 USSR/Roscosmos
| Mission | Agency | Year | Status |
|---------|--------|------|--------|
| Venera 7 | USSR | 1970 | Historic |
| Venera 9 | USSR | 1975 | Historic |

---

## Implementation Notes

### UI Rendering (Automatic)
- **3D Scene**: Agency-specific 3D shapes (Octahedron=ISRO, Box=ESA, Cone=CNSA, Tetrahedron=USSR, Sphere=NASA/JAXA/UAE)
- **Deep Dive Overlay**: Mission cards auto-display in "Missions" tab per celestial body

### File to Modify
- `src/data.js` → Expand `MISSION_DATA` array

### Verification Steps
1. Toggle **MISSIONS** button in Command Unit panel
2. Verify 3D paths render correctly
3. Check Deep Dive overlay for Moon, Mars, Jupiter, Saturn targets

---

> 🛰️ **Ready to implement when you are!**
