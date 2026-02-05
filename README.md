# Solar Core Explorer 🌌

A high-fidelity, interactive 3D Solar System simulation built with **React**, **Three.js**, and **Tailwind CSS**. Experience the cosmos with cinematic rendering, advanced procedural textures, and real-time planetary telemetry.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)

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
To enable the robotic voice analysis, create a `.env` file in the root directory and add your key:
```env
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```
*(Note: Use `.env.example` as a template. The `.env` file is git-ignored for safety.)*

## 📜 Deployment

The project is configured for **GitHub Pages** via GitHub Actions. Any push to the `main` branch will automatically build and deploy the latest version.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to enhance the planetary data or graphical fidelity.

---
*Created with passion for science and technology.*
