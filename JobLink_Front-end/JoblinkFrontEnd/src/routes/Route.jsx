import ChangePass from "@/components/change-pass/ChangePass";
import ChatInterface from "@/components/chat/chat";
import Dashboard from "@/components/dashboard/Dashboard";
import ChangePasswordPage from "@/components/forgot-pass/ChangePassForgot";
import VerifyEmailPage from "@/components/forgot-pass/VerifyGmail";
import ConfirmJob from "@/components/job/ConfirmationScreen";
import CreateJob from "@/components/job/CreateJob";
import CreateLocation from "@/components/job/CreateLocation";
import LandingPage from "@/components/landing-page/LandingPage";
import JobList from "@/components/list-job/ListJob";
import LoginPage from "@/components/login/Login";
import RegisterForm from "@/components/register/RegisterForm";
import AddSupportRequest from "@/components/support-system/AddSupportRequest";
import SupportRequest from "@/components/support-system/SupportRequest";
import Home from "@/components/test/test";
import UserProfile from "@/components/user-profile/UserProfileDetail";
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
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/listJob" element={<JobList />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/createLocation" element={<CreateLocation />} />
        <Route path="/createJob" element={<CreateJob />} />
        <Route path="/confirmJob" element={<ConfirmJob />} />
        <Route path="/auth/register" element={<RegisterForm/>}/>
        <Route path="/chat" element={<ChatInterface/>} />
        <Route path="/support-list" element={<SupportRequest />} />
        {/* <Route path="/chat" element={<Chat />} /> */}
      </Routes>

      <AddSupportRequest/>
    </Router>
  );
};

export default RoutesConfig