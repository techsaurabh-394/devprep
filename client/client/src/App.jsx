import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Index from "./pages/Index";
import Community from "./pages/Community";
import Esmoai from "./pages/Esmoai";
import Roadmap from "./pages/Roadmap";
import Findevents from "./pages/Findevents";
import Profile from "./components/Profile";
import Interview from "./components/Interview";
import InterviewIndex from "./components/InterviewIndex";
import Career from "./components/Career";
import PlanYourDay from "./pages/Planyourday";
import ResumeForm from "./pages/ResumeForm";
import ResumePreview from "./pages/ResumePreview";
import { useState, useEffect } from "react";

// Import landing page components
import Home1 from "./lp/components/Home1";
import Features from "./lp/components/Features";
import Aboutus from "./lp/components/Aboutus";
import Footer from "./lp/components/Footer";
import Navbar from "./lp/components/Navbar";
import PersonalizedRoadmap from "./pages/PersonalizedRoadmap";
import EnhanceResume from "./pages/EnhanceResume";
import AdditionalInterview from "./components/AdditionalInterview";
import MachineCode from "./pages/MachineCode";
import TypingTest from "./pages/TypingTest";
import { HelmetProvider } from "react-helmet-async";
import { WebsiteStructuredData } from "./components/StructuredData";
import SEO from "./components/SEO";
import { Toaster } from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <>
              <Navbar />
              <Home1 />
              <Features />
              <Aboutus />
              <Footer />
            </>
          )
        }
      />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 p-0">
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/userprofile" element={<Profile />} />
                  <Route path="/skills" element={<Index />} />
                  <Route path="/roadmap" element={<Roadmap />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/esmoai" element={<Esmoai />} />
                  <Route path="/findevents" element={<Findevents />} />
                  <Route path="/interview" element={<InterviewIndex />} />
                  <Route path="/interview/:role" element={<Interview />} />
                  <Route path="/career" element={<Career />} />
                  <Route path="/plan-your-day" element={<PlanYourDay />} />
                  <Route path="/resume-form" element={<ResumeForm />} />
                  <Route path="/resume-preview" element={<ResumePreview />} />
                  <Route
                    path="/personalized-roadmap"
                    element={<PersonalizedRoadmap />}
                  />
                  <Route path="/enhance-resume" element={<EnhanceResume />} />
                  <Route path="/machine-coding" element={<MachineCode />} />
                  <Route path="/typing-test" element={<TypingTest />} />
                  <Route
                    path="/additional-interview"
                    element={<AdditionalInterview />}
                  />
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <HelmetProvider>
      <SEO />
      <WebsiteStructuredData />
      <Router>
        <AuthProvider>
          <Toaster position="top-right" />
          <AppContent />
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
