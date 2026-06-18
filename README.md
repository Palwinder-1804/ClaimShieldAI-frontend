# ClaimShield AI - React + Vite Frontend Client 🌌

Welcome to the frontend repository of **ClaimShield AI**—a futuristic, enterprise-grade claims auditing and fraud detection dashboard. Built with a bespoke **Aurora Glass** dark aesthetic, this React application offers a responsive and interactive interface for insurance auditors.

---

## ✨ UI Features & Capabilities

### 1. 🌌 Aurora Glass Design System
- Styled using a customized, high-contrast dark theme built on Tailwind CSS.
- Features modern glassmorphism panels, glowing drop-shadows, sleek gradients, and clean typography (Inter/Outfit).
- Fluid layout designed for massive screen resolutions down to mobile devices.

### 2. 📊 Auditor Claims Registry & Analytics
- **Live Risk Metrics:** Stat cards displaying total claims, pending reviews, fraud alerts, and approval ratios with dynamic counting animations.
- **Visual Analytics:** Interactive data visualizations powered by `recharts`:
  - Claims submission volume trend chart.
  - Severity risk distribution pie chart.
  - Auditing decisions outcome bar chart.
- **Dossier Table:** A searchable, paginated registry containing every claim, its category, creation date, pipeline status, and fraud risk index.

### 3. 🛡️ Claim Audit Dossier & Validation
- **Structured Reports:** Renders markdown reports highlighting risk alerts, provider trust validations, and exclusions.
- **Action Toolbar:** 
  - **PDF Export / Print:** Print-friendly CSS media queries format the report into an official auditor page.
  - **MD Download:** Direct markdown downloads.
  - **How to Claim Guide:** Dynamic, RAG-grounded walkthrough guide detailing claiming procedures.
- **Document Vault:** Secure links that stream supporting documents (PDFs/Images) directly from backend storage.
- **Decision Feedback:** Validation form allows auditors to agree/disagree with AI findings, rate accuracy, and provide comments.

### 4. 💬 Interactive Policy RAG Chat
- A dedicated chat environment allowing auditors to upload, parse, and "talk" directly to insurance policies.
- Matched source indicators show the specific page content and document name used by the AI to answer the question.
- Dynamic typing animations and confidence score meters for every message.

---

## 🛠️ Technology Stack

- **Framework:** React 18 (Vite build system)
- **Styling:** Tailwind CSS (Custom themes)
- **State Management:** Zustand (Global stores for Auth, Claims, Policy Chat)
- **Animations:** Framer Motion (Transitions and layout animations)
- **Data Charts:** Recharts
- **Icons:** Lucide React
- **API Client:** Axios (Custom retry interceptors for localhost fallback)

---

## 📂 Directory Layout

```text
frontend/
├── src/
│   ├── api/          # Axios HTTP clients (apiClient, auth, claims, policyChat)
│   ├── assets/       # Static assets, SVG logos
│   ├── components/   # Reusable UI elements
│   │   ├── claim/    # ClaimForm, ClaimReport, ClaimStatus
│   │   ├── common/   # Navbar, Footer, Loader, StatusBadge, MarkdownRenderer
│   │   └── upload/   # DocumentUploader
│   ├── pages/        # Router Pages (Landing, Login, Dashboard, ClaimDetail, PolicyChatPage)
│   ├── store/        # Zustand global states (authStore, claimStore)
│   ├── App.jsx       # Routing configurations
│   ├── index.css     # Global styles & glassmorphic classes
│   └── main.jsx      # React app initializer
├── tailwind.config.js# Custom Tailwind palette and utility settings
├── package.json      # Node requirements
└── .env              # Environment config
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **NPM** or **Yarn**

### Installation

1. Install package dependencies:
   ```bash
   npm install
   ```

2. Configure the environment:
   Create a `.env` file in the frontend root directory and configure the backend API endpoint:
   ```env
   VITE_API_URL=https://your-backend-api-url.com
   ```
   *(If not provided, the client defaults to `http://localhost:8000`)*

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will run locally at `http://localhost:5173`.

---

*Premium, dynamic, and state-of-the-art UI for modern insurance verification.*
