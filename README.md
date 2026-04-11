# 🎓 Learn & Earn — Scholastic Contest Platform (Frontend)

Welcome to the **Learn & Earn** frontend repository. This is a premium, high-performance web application designed for students to participate in scholastic contests and for administrators to manage the entire ecosystem with elegance and precision.

## 🚀 Key Features

- **Dynamic Hero Experience**: An auto-sliding, high-fidelity carousel showcasing top contests with smooth Framer Motion transitions.
- **Advanced Authentication**: Secure Login/Register system with role-based access control (Student vs. Admin).
- **Interactive Dashboards**: 
  - **Admin**: Real-time stats (StatCards), Monthly/Weekly enrollment charts, for project-wide oversight.
  - **Student**: Personalized view of enrolled contests, past submissions, and team invitations.
- **Scholastic Contest Lifecycle**: Complete flow from registration to project submission (supporting both Solo and Team projects).
- **Premium Admin Suite**: Hierarchical filtering (Year > Month > Contest > Participant), CSV exporting, and real-time project evaluation.
- **Responsive & Accessible**: Fully optimized for Desktop, Tablet, and Mobile devices using a mobile-first design strategy.

## 🛠️ Technology Stack

| Technology | Purpose | Why We Used It |
|------------|---------|----------------|
| **React (v19)** | Core Framework | Utilizes the latest React features for efficient rendering and state management. |
| **Vite** | Build Tool | Lightning-fast development server and optimized production builds. |
| **Tailwind CSS** | Styling | Rapid UI development with utility-first classes for a modern, sleek design. |
| **Framer Motion** | Animations | For organic, fluid page transitions and interactive micro-animations. |
| **Axios** | API Client | Simple, logic-based HTTP requests with centralized configuration for base URL and interceptors. |
| **React Router** | Navigation | Complex routing with protection logic (ProtectedRoute) for gated access. |
| **React Toastify** | Feedback | Professional, non-intrusive notifications for user actions. |

## 🏗️ Technical Implementation Details

### Performance Optimization & Scalability
- **Code Splitting (Lazy Loading)**: We used `React.lazy()` and `Suspense` for route-based splitting, significantly reducing the initial bundle size and improving the First Contentful Paint (FCP).
- **Memoization (`React.memo`, `useMemo`, `useCallback`)**: 
  - To prevent unnecessary re-renders in complex dashboards (like `AdminDashboard` and `ParticipantsDirectory`), we heavily utilized `React.memo`.
  - Intensive calculations and data filtering are wrapped in `useMemo`.
  - Event handlers passed to child components are stabilized via `useCallback` to maintain reference equality.
- **Custom Adaptive Hooks**: Modularized logic like `useCarousel` handles side effects efficiently without bloating components.

### React Hooks & Features
- **Context API (`AuthContext`, `AdminDashboardContext`)**: Used for global state management to avoid prop drilling and ensure real-time data consistency across the app.
- **Portals (Modals)**: High-performance modal triggers (EditContest, ReviewDetail) using React portals for structural integrity.

### Design System
- **Aesthetic Excellence**: We avoided standard browser defaults. Instead, we used a custom color palette (Green/Gold/Slate), custom Typography, and Glassmorphism effects for a premium "Apple-like" feel.
- **Micro-interactions**: Every button and card features hover scaling and active states for a "living" interface.

## 🛠️ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the root and add:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

---
*Built with ❤️ for scholastic excellence.*
