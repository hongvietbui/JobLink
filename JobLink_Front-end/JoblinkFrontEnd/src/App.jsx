import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/test/test';
import VerifyEmailPage from './components/forgot-pass/ForgotPass'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dd" element={<Home />} />
        <Route path="/verifyEmail" element={<VerifyEmailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
