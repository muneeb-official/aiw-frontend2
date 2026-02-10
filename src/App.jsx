// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// import { useState } from "react";
// import Dashboard from "./components/Dashboard";
// import SalesAgent from "./pages/SalesAgent";

// // Simple routing without react-router for now
// function App() {
//   const [currentPage, setCurrentPage] = useState("dashboard");

// You can replace this with React Router later
//   const renderPage = () => {
//     switch (currentPage) {
//       case "sales":
//         return <SalesAgent />;
//       case "dashboard":
//       default:
//         return <Dashboard onNavigate={setCurrentPage} />;
//     }
//   };

//   return renderPage();
// }

// export default App;

// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Dashboard from './components/Dashboard';
// import SalesAgent from './pages/SalesAgent';

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/sales" element={<SalesAgent />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// App.jsx
// import { useState } from "react";
// import Layout from "./components/Layout";
// import DashboardContent from "./components/DashboardContent";
// import SalesAgentContent from "./pages/SalesAgentContent";

// function App() {
//   const [activePage, setActivePage] = useState("analytics");

//   const renderContent = () => {
//     switch (activePage) {
//       case "sales":
//         return <SalesAgentContent />;
//       case "analytics":
//       default:
//         return <DashboardContent />;
//     }
//   };

//   return (
//     <Layout activePage={activePage} setActivePage={setActivePage}>
//       {renderContent()}
//     </Layout>
//   );
// }

// export default App;

// App.jsx
// import { useState } from "react";
// import { SearchProvider } from "./context/SearchContext";
// import { B2BSearchProvider } from "./context/B2BSearchContext";
// import Layout from "./components/Layout";
// import DashboardContent from "./components/DashboardContent";
// import SalesAgentContent from "./pages/SalesAgentContent";
// import B2BAgentContent from "./pages/B2BAgentContent";

// function AppContent() {
//   const [activePage, setActivePage] = useState("analytics");

//  const renderContent = () => {
//     switch (activePage) {
//       case "dashboard":
//         return <DashboardContent />;
//       case "b2c":
//         return <SalesAgentContent />;
//       case "b2b":
//         return <B2BAgentContent />;
//       default:
//         return <SalesAgentContent />;
//     }
//   };

//   return (
//     <Layout activePage={activePage} setActivePage={setActivePage}>
//       {renderContent()}
//     </Layout>
//   );
// }

// function App() {
//   return (
//     <SearchProvider>
//       <B2BSearchProvider>
//         <AppContent />
//       </B2BSearchProvider>
//     </SearchProvider>
//   );
// }

// export default App;

// App.jsx
// App.jsx - Updated with Authentication
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";
import { B2BSearchProvider } from "./context/B2BSearchContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SubscriptionProvider } from "./services/SubscriptionContext";
import Layout from "./components/layout/Layout";
import DashboardContent from "./pages/DashboardContent";
import SalesAgentContent from "./pages/salesAgent/SalesAgentContent";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ChoosePlanPage from "./pages/auth/ChoosePlanPage";
import CartPage from "./pages/auth/CartPage";
import PaymentSuccessPage from "./pages/auth/PaymentSuccessPage";
import PaymentCancelPage from "./pages/auth/PaymentCancelPage";
import { useSearch } from "./context/SearchContext";
import { useB2BSearch } from "./context/B2BSearchContext";
import IntegrationHubPage from "./pages/auth/IntegrationHubPage";
import WelcomePage from "./pages/auth/WelcomePage";
import OnboardingPage from "./pages/auth/OnboardingPage";

// App.jsx
// import { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { SearchProvider } from "./context/SearchContext";
// import { B2BSearchProvider } from "./context/B2BSearchContext";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import { SubscriptionProvider } from "./services/SubscriptionContext";
// import Layout from "./components/layout/Layout";
// import DashboardContent from "./pages/DashboardContent";
// import SalesAgentContent from "./pages/salesAgent/SalesAgentContent";
// import LoginPage from "./pages/auth/LoginPage";
// import SignUpPage from "./pages/auth/SignUpPage";
// import ChoosePlanPage from "./pages/auth/ChoosePlanPage";
// import CartPage from "./pages/auth/CartPage";
// import PaymentSuccessPage from "./pages/auth/PaymentSuccessPage";
// import PaymentCancelPage from "./pages/auth/PaymentCancelPage";
// import { useSearch } from "./context/SearchContext";
// import { useB2BSearch } from "./context/B2BSearchContext";
// import IntegrationHubPage from "./pages/auth/IntegrationHubPage";
// import WelcomePage from "./pages/auth/WelcomePage";
// import OnboardingPage from "./pages/auth/OnboardingPage";

// Protected Route - Requires authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#4F46E5]"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route - For login page only
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return children;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Main App Content
function AppContent() {
  const [activePage, setActivePage] = useState("analytics");

  const b2cContext = useSearch();
  const b2bContext = useB2BSearch();
  const credits = activePage === "b2b" ? b2bContext.credits : b2cContext.credits;

  const renderContent = () => {
    switch (activePage) {
      case "analytics":
        return <DashboardContent setActivePage={setActivePage} />;
      case "b2c":
        return <SalesAgentContent mode="b2c" setActivePage={setActivePage} />;
      case "b2b":
        return <SalesAgentContent mode="b2b" setActivePage={setActivePage} />;
      default:
        return <DashboardContent setActivePage={setActivePage} />;
    }
  };

  return (
    <Layout activePage={activePage} setActivePage={setActivePage} credits={credits}>
      {renderContent()}
    </Layout>
  );
}

// App with all providers and routing
function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Router>
          <Routes>
            {/* ==================== */}
            {/* PUBLIC ROUTES        */}
            {/* ==================== */}
            
            {/* Login - Redirects to dashboard if already authenticated */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            
            {/* SignUp - No wrapper to allow redirect to choose-plan after auto-login */}
            <Route path="/signup" element={<SignUpPage />} />

            {/* ==================== */}
            {/* SUBSCRIPTION FLOW    */}
            {/* SignUp → ChoosePlan → Cart → PaymentSuccess */}
            {/* ==================== */}
            
            <Route
              path="/choose-plan"
              element={
                <ProtectedRoute>
                  <ChoosePlanPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            
            {/* Payment callbacks - No protection (Stripe redirects here) */}
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/cancel" element={<PaymentCancelPage />} />

            {/* ==================== */}
            {/* ONBOARDING FLOW      */}
            {/* PaymentSuccess → IntegrationHub → Onboarding → Dashboard */}
            {/* ==================== */}
            
            <Route
              path="/integration-hub"
              element={
                <ProtectedRoute>
                  <IntegrationHubPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/welcome"
              element={
                <ProtectedRoute>
                  <WelcomePage />
                </ProtectedRoute>
              }
            />

            {/* ==================== */}
            {/* MAIN APP             */}
            {/* ==================== */}
            
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <SearchProvider>
                    <B2BSearchProvider>
                      <AppContent />
                    </B2BSearchProvider>
                  </SearchProvider>
                </ProtectedRoute>
              }
            />

            {/* ==================== */}
            {/* DEFAULT REDIRECTS    */}
            {/* ==================== */}
            
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;