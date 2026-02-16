# Solar Core Explorer 🌌

A high-fidelity, interactive 3D Solar System simulation built with **React**, **Three.js**, and **Tailwind CSS**. Experience the cosmos with cinematic rendering, NASA-sourced textures, procedural planet generation, and real-time planetary telemetry.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

## ✨ Key Features

- **🌍 Photorealistic Earth**: Real NASA satellite imagery textures sourced from the [Three.js examples repository](https://github.com/mrdoob/three.js/tree/dev/examples/textures/planets), including atmosphere, specular maps, cloud layers, and normal/bump maps
- **☀️ Procedural Sun**: Custom canvas-generated solar texture with convection cells, granulation patterns, and animated corona glow
- **🪐 High-Fidelity Planets**: Each celestial body features custom shaders and procedural textures (e.g., Jupiter's dynamic flow engine, Saturn's crystalline rings with Cassini Division)
- **📊 Cinematic HUD**: Sophisticated telemetry overlay with real-time technical data on planetary composition, physics, and orbital dynamics
- **🔬 Deep Dive Mode**: Interactive exploration panels with scientific data, mission history, satellite registry, and atmospheric composition
- **🚀 Advanced Mission Database**: Comprehensive historical data for 20+ key missions, including motivation, context, outcomes, and legacy impacts
- **📱 Fully Responsive**: Optimized for mobile, tablet, laptop, and desktop with adaptive layouts and touch-friendly controls
- **🎙️ Neural Voice Integration**: Automated AI analysis and audio readouts for planetary data (Gemini API supported)

## 🚀 Potential Use Cases & Educational Value

Solar Core Explorer is designed as both a technical showcase and a powerful educational tool:

- **Interactive Science Classroom**: A visual aid for teaching planetary science, orbital mechanics, and solar physics. The "Deep Dive" mode provides raw data that can be used for classroom assignments.
- **Museum/Exhibit Display**: Optimized cinematic rendering makes it suitable for public-facing kiosks or educational exhibits.
- **Physics Visualization**: Real-time telemetry calculations help students visualize gravity, rotational periods, and atmospheric compositions.
- **Reference Encyclopedia**: The integrated mission database serves as a quick-reference guide for space exploration history.
- **Open-Source Learning**: For developers, it serves as a robust example of React & Three.js integration, procedural generation, and complex shader logic.

---

## 🛠️ Technical Architecture

### How It's Built

```
┌─────────────────────────────────────────────────────────────────┐
│                     Solar Core Explorer                         │
├─────────────────────────────────────────────────────────────────┤
│  React 18          │  Component-based UI & State Management    │
│  Three.js r167     │  WebGL 3D Rendering Engine                │
│  Vite 5.4          │  Ultra-fast HMR & Production Bundling     │
│  Tailwind CSS 3.4  │  Utility-first Responsive Styling         │
└─────────────────────────────────────────────────────────────────┘
```

### Planet Rendering Pipeline

Each planet is built using a modular factory pattern (`createPlanet()`) that returns:
- **Mesh Group**: Parent container for multi-layer planetary geometry
- **Update Function**: Per-frame animation and state-reactive rendering
- **Special Effects**: Atmosphere glow, rings, structural cutaways, and heatmaps

---

## 🌍 Earth: NASA Texture Integration

Earth is rendered using **real NASA/ESA satellite imagery** hosted on the Three.js GitHub repository:

| Texture | Resolution | Source |
|---------|------------|--------|
| **Surface Map** | 2048x1024 | `earth_atmos_2048.jpg` - NASA Blue Marble imagery |
| **Specular Map** | 2048x1024 | `earth_specular_2048.jpg` - Ocean reflectivity data |
| **Cloud Layer** | 1024x512 | `earth_clouds_1024.png` - Atmospheric cloud cover |
| **Normal/Bump** | 2048x1024 | `earth_normal_2048.jpg` - Terrain elevation data |

```javascript
// Texture URLs from Three.js examples (NASA-derived public domain imagery)
const TEXTURE_URLS = {
  map: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg",
  specular: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg",
  clouds: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png"
};
```

The Earth renderer also includes:
- **Phong Material Lighting**: Realistic specular highlights on ocean surfaces
- **Multi-layer Atmosphere**: Inner glow (rim light) + outer atmospheric haze
- **Animated Cloud Layer**: Separate rotating mesh with transparency blending
- **Structural Cutaway Mode**: Mantle and core layers for educational visualization

---

## ☀️ Sun: Procedural Generation

The Sun uses a fully **procedural canvas-based texture** instead of static images:

```javascript
// Canvas-generated solar texture (2048x1024)
1. Deep Magma Base       - Gradient from dark poles (#220500) to bright equator (#ff5500)
2. Convection Cells      - 3500+ radial gradients simulating granulation
3. Fine Grain Noise      - 50000+ pixel noise overlay for surface detail
4. Animated Corona       - Sprite-based halo with pulsing opacity
```

### Why Procedural?
- **No external dependencies**: Works offline, no CDN failures
- **Dynamic variation**: Each page load generates unique surface patterns
- **NASA-accurate colors**: Based on SDO/AIA solar imaging wavelengths

---

## 📁 Project Structure

```
src/
├── planets/              # Planet factory modules
├── components/
│   ├── ui/               # Navigation & common UI
│   ├── overlays/         # Deep Dive panels & HUD layers
│   └── visuals/          # Spacetime grid, orbital paths
├── data/
│   └── missions/         # Modular mission database
│       ├── lunar/        # Moon exploration history
│       ├── mars/         # Mars surface missions
│       └── outer/        # Deep space explorers
├── data.js               # Planetary telemetry & core configurations
└── SolarSystemExplorer.jsx  # Main application entry point
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Ashborn-047/Solar-Core-Explorer.git
cd Solar-Core-Explorer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
```

**Build Output** (optimized chunks):
| File | Size | Gzip |
|------|------|------|
| `vendor-three.js` | 499 kB | 127 kB |
| `vendor-react.js` | 140 kB | 45 kB |
| `index.js` | 120 kB | 34 kB |
| `index.css` | 37 kB | 7 kB |

---

## 🛠️ Configuration

### Neural Voice (Optional)
To enable the robotic voice analysis, create a `.env` file:
```env
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

## 📜 Deployment

The project is configured for **GitHub Pages** via GitHub Actions. Any push to `main` automatically builds and deploys.

**Live Demo**: [https://ashborn-047.github.io/Solar-Core-Explorer/](https://ashborn-047.github.io/Solar-Core-Explorer/)

---

## 🎨 Design Philosophy

- **Frontier Ghost Aesthetic**: Glassmorphic UI with subtle blur and transparency
- **Scientific Accuracy**: Real orbital distances, rotational periods, and composition data
- **Responsive First**: Touch-friendly on mobile, expansive on desktop
- **Performance Optimized**: Code splitting, lazy loading, and efficient WebGL rendering

---

## 📚 Data Sources & Credits

| Resource | Source | License |
|----------|--------|---------|
| Earth Textures | [Three.js Examples](https://github.com/mrdoob/three.js) (NASA/Blue Marble) | Public Domain |
| Planetary Data | NASA Planetary Fact Sheets | Public Domain |
| Mission Database | NASA Mission Archives | Public Domain |
| Icons | [Lucide React](https://lucide.dev/) | MIT |

---

## 📜 Code of Conduct

This project adheres to the **Contributor Covenant**. We are committed to providing a friendly, safe, and welcoming environment for all, regardless of level of experience, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

Please be kind and respectful in all interactions. Discriminatory or harassing behavior of any kind will not be tolerated.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to enhance planetary data, graphical fidelity, or add new celestial bodies.

---

*Created with passion for science, technology, and the infinite cosmos.* ✨
