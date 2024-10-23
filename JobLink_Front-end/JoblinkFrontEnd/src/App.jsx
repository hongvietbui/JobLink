import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/test/test';
import VerifyEmailPage from './components/forgot-pass/VerifyGmail'
import ChangePasswordPage from './components/forgot-pass/ChangePassForgot'
import ChangePass from './components/change-pass/ChangePass';
import LoginPage from './components/login/Login';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/change-pass" element={<ChangePass />} />
        <Route path="/verifyEmail" element={<VerifyEmailPage />} />
        <Route path="/changePasswordPage" element={<ChangePasswordPage />} />
        <Route path="/Login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
