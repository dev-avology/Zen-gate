import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CheckoutPage from './pages/CheckoutPage';
import SettingsPage from './pages/SettingsPage';
import OAuthRedirect from './pages/OAuthRedirect';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Toaster position="top-right" reverseOrder={false} />
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/oauth-redirect" element={<OAuthRedirect />} />
      </Routes>
    </Router>
  );
};

export default App;
