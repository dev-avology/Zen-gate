import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CheckoutPage from './pages/CheckoutPage';
import SettingsPage from './pages/SettingsPage';
import OAuthRedirect from './pages/OAuthRedirect';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/oauth-redirect" element={<OAuthRedirect />} />
      </Routes>
    </Router>
  );
};

export default App;
