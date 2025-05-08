import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CheckoutPage from './pages/CheckoutPage';
import SettingsPage from './pages/SettingsPage';
import OAuthRedirect from './pages/OAuthRedirect';
import SuccessForm from './pages/SuccessForm';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/oauth-redirect" element={<OAuthRedirect />} />
        <Route path="/success" element={<SuccessForm />} />
      </Routes>
    </Router>
  );
};

export default App;
