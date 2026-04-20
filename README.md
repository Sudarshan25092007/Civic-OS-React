# 🏙️ CIIC REPLICA (Civic Operating System)

## 🧠 Problem Statement
**The Problem:** Urban infrastructure issues (potholes, garbage, broken streetlights) often go unreported due to bureaucratic friction. Citizens feel disconnected from municipal authorities, and officials lack real-time, aggregated data to prioritize repairs.
**The Solution:** CIIC REPLICA is a hyper-accessible, real-time "Civic Operating System" where citizens can instantly pin issues on a map, upload photographic evidence, and upvote community priorities. 
**Why it matters:** It bridges the gap between citizens and municipal authorities using absolute transparency, crowdsourcing, and real-time mapping data.

## ✨ Core Features
1. **Real-time Civic Map:** Visualizes all active incidents across the city using custom glowing severity markers.
2. **Community Heat (Upvotes):** Citizens can upvote issues they care about most, dynamically sorting priorities for officials.
3. **Role-Based Access Control:** Standard citizens can report and upvote, while Root Admins can resolve issues and clear the map.
4. **Bento Dashboard Stats:** Automatically aggregates total reports, resolution rate, and community heat into a sleek dashboard.
5. **Glassmorphic UI:** Implemented a stunning, modern Cyber-Urban aesthetic utilizing `framer-motion` for fluid micro-interactions.

## 🛠️ Tech Stack
- **Frontend Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS V4 + Vanilla CSS (Custom Keyframes)
- **State Management:** React Context API + Custom Hooks
- **Map Engine:** React-Leaflet (`leaflet`)
- **Backend (BaaS):** Firebase (Authentication + Firestore Database)
- **Automated Testing:** Vitest & React Testing Library (CI via GitHub Actions)

## 🚀 Setup Instructions
1. Clone the repository:
   ```bash
   git clone <your-github-repo-url>
   cd "CIIC REPLICA"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the app locally at `http://localhost:5173`.

*(Note: Ensure your Firebase environment is configured or linked via Firebase CLI if you intend to deploy the security rules).*
