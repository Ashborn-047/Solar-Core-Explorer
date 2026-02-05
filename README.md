# Solar Core Explorer 🌌

A high-fidelity, interactive 3D Solar System simulation built with **React**, **Three.js**, and **Tailwind CSS**. Experience the cosmos with cinematic rendering, advanced procedural textures, and real-time planetary telemetry.

![Project Preview](https://raw.githubusercontent.com/Ashborn-047/Solar-Core-Explorer/main/preview.png) *(Placeholder for your preview image)*

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **3D Library**: [Three.js](https://threejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI/Voice**: [Google Gemini Pro Vision (TTS)](https://ai.google.dev/)
- **CI/CD**: [GitHub Actions](https://github.com/features/actions)

## ✨ Key Features

- **High-Fidelity Planetary Models**: Each celestial body features custom shaders and procedural textures (e.g., Jupiter's dynamic flow engine, Saturn's 4K sharp rings).
- **Cinematic HUD**: A sofisticated telemetry overlay providing real-time technical data on planetary composition, physics, and orbital dynamics.
- **Neural Voice Integration**: Automated AI analysis and audio readouts for planetary data (Gemini API supported).
- **Interactive Exploration**: Precise raycasting for selection, cinematic framing, and smooth orbital navigation.
- **Modern Tech Stack**: Powered by Vite for ultra-fast performance and Tailwind CSS for a premium, glassmorphic UI.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Ashborn-047/Solar-Core-Explorer.git
   cd Solar-Core-Explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Configuration

### Neural Voice (Optional)
To enable the robotic voice analysis, add your Gemini API Key in `src/SolarSystemExplorer.jsx`:
```javascript
const apiKey = "YOUR_GEMINI_API_KEY";
```

## 📜 Deployment

The project is configured for **GitHub Pages** via GitHub Actions. Any push to the `main` branch will automatically build and deploy the latest version.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to enhance the planetary data or graphical fidelity.

---
*Created with passion for science and technology.*
