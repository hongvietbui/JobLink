import ChangePass from "@/components/change-pass/ChangePass";
import Dashboard from "@/components/dashboard/Dashboard";
import ChangePasswordPage from "@/components/forgot-pass/ChangePassForgot";
import VerifyEmailPage from "@/components/forgot-pass/VerifyGmail";
import LandingPage from "@/components/landing-page/LandingPage";
import MoneyWithdrawal from "@/components/withdraw-money/WithdrawMoney";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const RoutesConfig = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/change-pass" element={<ChangePass />} />
        <Route path="/verifyEmail" element={<VerifyEmailPage />} />
        <Route path="/changePasswordPage" element={<ChangePasswordPage />} />
        <Route path="/withdraw-money" element={<MoneyWithdrawal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/chat" element={<Chat />} /> */}
      </Routes>
    </Router>
  );
};

export default RoutesConfig