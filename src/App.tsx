import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocationProvider } from './hooks/LocationContext';
import { ThemeProvider } from './hooks/ThemeContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import MovieDetailsPage from './pages/MovieDetailsPage';
import MyUploadsPage from './pages/MyUploadsPage';
import ProfilePage from './pages/ProfilePage';
import ContestsPage from './pages/ContestsPage';
import ProtectedRoute from './routes/ProtectedRoute';

const Services: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Services</h1>
      <p className="text-gray-600 dark:text-gray-300">Services page coming soon!</p>
    </div>
  </div>
);

const NotFound: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <a href="/" className="btn-primary">
        Go Home
      </a>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <Router>
          <div className="App min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/movies" element={<Home />} />
                <Route path="/movies/:id" element={<MovieDetailsPage />} />
                <Route path="/theatres" element={<Services />} />
                <Route path="/contests" element={<ContestsPage />} />
                <Route path="/contests/:slug" element={<ContestsPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-uploads"
                  element={
                    <ProtectedRoute>
                      <MyUploadsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Services />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </LocationProvider>
    </ThemeProvider>
  );
}

export default App;
