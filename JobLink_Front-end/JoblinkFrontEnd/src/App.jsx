import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/test/test';
import VerifyEmailPage from './components/forgot-pass/VerifyGmail'
import ChangePasswordPage from './components/forgot-pass/ChangePassForgot'
import ChangePass from './components/change-pass/ChangePass';
import LoginPage from './components/login/Login';
import JobList from './components/list-job/ListJob';
import UserProfile from './components/user-profile/UserProfileDetail';
import CreateLocation from './components/job/CreateLocation';
import CreateJob from './components/job/CreateJob';
import ConfirmJob from './components/job/ConfirmationScreen';
import TransactionHistory from './components/TopUpHistory/TopUpHistory';
import NationalIdUpload from './components/NationalID/NationalIdUpload';
import ManageUserID from './components/NationalID/ManageUserID';
function App() {
  const footerLinks = [
    {
      title: "For Clients",
      links: [
        "How to hire",
        "Talent Marketplace",
        "Project Catalog",
        "Hire an agency",
        "Enterprise",
        "Any Hire",
        "Contract-to-hire",
        "Direct Contracts",
        "Hire worldwide",
        "Hire in the USA",
      ],
    },
    {
      title: "For Talent",
      links: [
        "How to find work",
        "Direct Contracts",
        "Find freelance jobs worldwide",
        "Find freelance jobs in the USA",
        "Win work with ads",
        "Exclusive resources with Freelancer Plus",
      ],
    },
    {
      title: "Resources",
      links: [
        "Help & support",
        "Success stories",
        "JobLink reviews",
        "Resources",
        "Blog",
        "Community",
        "Affiliate programme",
        "Free Business Tools",
      ],
    },
    {
      title: "Company",
      links: [
        "About us",
        "Leadership",
        "Investor relations",
        "Careers",
        "Our impact",
        "Press",
        "Contact us",
        "Partners",
        "Trust, safety & security",
        "Modern slavery statement",
      ],
    },
  ];

  // const { setAuthData } = useAuthStore();

  // useEffect(() => {
  //   agent.User.me()
  //     .then((response) => {
  //       setAuthData(
  //         response.id,
  //         response.username,
  //         response.email,
  //         response.firstName,
  //         response.lastName,
  //         response.phoneNumber,
  //         response.avatar,
  //         response.refreshToken,
  //         response.accountBalance
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //       toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
  //     });
  // }, []);

  // const handleSetAuthData = () => {
  //   setAuthData(
  //     "ff41a35a-868d-47e9-902b-f1687fa16a4a", // id
  //     "user1", // username
  //     "user1@example.com", // email
  //     "John", // firstName
  //     "Doe", // lastName
  //     "1234567890", // phoneNumber
  //     "https://example.com/avatar.jpg", // avatar
  //     "cff3d26b-573c-4566-b72f-375f3e0ebf38", // refreshToken,
  //     "900000.00"
  //   );
  // };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/change-pass" element={<ChangePass />} />
        <Route path="/verifyEmail" element={<VerifyEmailPage />} />
        <Route path="/changePasswordPage" element={<ChangePasswordPage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/listJob" element={<JobList />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/createLocation" element={<CreateLocation />} />
        <Route path="/createJob" element={<CreateJob />} />
        <Route path="/confirmJob" element={<ConfirmJob />} />
        <Route path="/TopUpHistory" element={<TransactionHistory />} />
        <Route path="/IDUpload" element={<NationalIdUpload />} />
        <Route path="IdManagement" element={<ManageUserID />} />
      </Routes>
    </Router>
  );
}

export default App;
