import ChangePass from "@/components/change-pass/ChangePass";
import ChatInterface from "@/components/chat/chat";
import Dashboard from "@/components/dashboard/Dashboard";
import ChangePasswordPage from "@/components/forgot-pass/ChangePassForgot";
import VerifyEmailPage from "@/components/forgot-pass/VerifyGmail";
import LandingPage from "@/components/landing-page/LandingPage";
import JobList from "@/components/list-job/ListJob";
import LoginPage from "@/components/login/Login";
import SupportRequest from "@/components/support-system/SupportRequest";
import Home from "@/components/test/test";
import WithdrawAdminList from "@/components/withdraw-money/WithdrawAdminList";
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
        <Route path="/chat" element={<ChatInterface/>} />
        <Route path="/support-list" element={<SupportRequest />} />
        <Route path="/withdraw" element={<WithdrawAdminList />} />
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/listJob" element={<JobList />} />
      </Routes>
    </Router>
  );
};

export default RoutesConfig