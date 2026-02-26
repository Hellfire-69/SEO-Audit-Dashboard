 import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SparklesProvider } from './context/SparklesContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import PageWrapper from './components/PageWrapper';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Home from './pages/Home';
import Audit from './pages/Audit';
import History from './pages/History';
import Settings from './pages/Settings';
import CompetitorCompare from './pages/CompetitorCompare';
import TechnicalReport from './pages/TechnicalReport';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Routes outside Layout - full screen */}
        <Route 
          path="/" 
          element={
            <PageWrapper>
              <LandingPage />
            </PageWrapper>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PageWrapper>
              <LoginPage />
            </PageWrapper>
          } 
        />
        <Route
          path="/signup"
          element={
            <PageWrapper>
              <SignUpPage />
            </PageWrapper>
          }
        />
        <Route
          path="/privacy"
          element={
            <PageWrapper>
              <Privacy />
            </PageWrapper>
          }
        />
        <Route
          path="/terms"
          element={
            <PageWrapper>
              <Terms />
            </PageWrapper>
          }
        />

        {/* Routes inside Layout - with sidebar */}
        <Route 
          path="/dashboard" 
          element={
            <Layout>
              <PageWrapper>
                <Home />
              </PageWrapper>
            </Layout>
          } 
        />
        <Route 
          path="/audit" 
          element={
            <Layout>
              <PageWrapper>
                <Audit />
              </PageWrapper>
            </Layout>
          } 
        />
        <Route 
          path="/technical" 
          element={
            <Layout>
              <PageWrapper>
                <TechnicalReport />
              </PageWrapper>
            </Layout>
          } 
        />
        <Route 
          path="/compare" 
          element={
            <Layout>
              <PageWrapper>
                <CompetitorCompare />
              </PageWrapper>
            </Layout>
          } 
        />
        <Route 
          path="/history" 
          element={
            <Layout>
              <PageWrapper>
                <History />
              </PageWrapper>
            </Layout>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <Layout>
              <PageWrapper>
                <Settings />
              </PageWrapper>
            </Layout>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SparklesProvider>
        <AnimatedRoutes />
      </SparklesProvider>
    </ThemeProvider>
  );
}

export default App;
