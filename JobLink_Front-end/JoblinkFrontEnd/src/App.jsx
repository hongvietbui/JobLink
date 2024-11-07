/* eslint-disable react/no-unescaped-entities */

import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "./stores/useAuthStore";
import { useEffect } from "react";
import agent from "./lib/axios";
import RoutesConfig from "./routes/Route";
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

  const { setAuthData } = useAuthStore();

  useEffect(() => {
    agent.User.me()
      .then((response) => {
        setAuthData(
          response.id,
          response.username,
          response.email,
          response.firstName,
          response.lastName,
          response.phoneNumber,
          response.avatar,
          response.refreshToken,
          response.accountBalance
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
      });
  }, []);

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
    <div className="flex flex-col min-h-screen">
      <ToastContainer autoClose={3000} position="top-right" theme="light" />
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          {/* <h1 className="text-2xl font-bold">JobLink</h1> */}
          <img
            src="https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-1/440879710_1311365576486302_465885895535459738_n.jpg?stp=dst-jpg_s200x200&_nc_cat=100&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeFwMNEk_sQdV-RfB0sm4YE1ZNm2NsCaeAlk2bY2wJp4CbaqoySVisau52pRC-dwipFqTIGn9kjUzVvfdl1wv1yx&_nc_ohc=mZB2f4hrYGgQ7kNvgFJw4mD&_nc_ht=scontent.fhan15-2.fna&_nc_gid=AkFV3U5emRflPx-gK0O2G45&oh=00_AYBznXGNXxFUG8qrm-JTmPZ-8elENMeftPiZGKc071saRg&oe=671D5ECF"
            className="w-10 h-10 rounded-full animate-spin"
          />
          <nav className="hidden md:flex space-x-4">
            <a href="#" className="text-sm font-medium">
              Find talent
            </a>
            <a href="#" className="text-sm font-medium">
              Find work
            </a>
            <a href="#" className="text-sm font-medium">
              Why JobLink
            </a>
            <a href="#" className="text-sm font-medium">
              Enterprise
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            className="hidden md:flex"
            placeholder="Search"
            type="search"
          />
          <Button variant="ghost">Log in</Button>
          <Button>Sign up</Button>
          <Button
            onClick={() => {
              const value = prompt("Nhập giá trị text:");
              if (value) {
                localStorage.setItem("token", value);
                alert(
                  "Giá trị đã được lưu vào localStorage với key là 'token'"
                );
              } else {
                alert("Không có giá trị nào được nhập");
              }
            }}
          >
            Test
          </Button>
        </div>
      </header>
      <main className="flex-1 min-h-[80vh] mx-[40px] my-[30px]">

        {/* Config routes */}
        <RoutesConfig />



        
      </main>
      <footer className="bg-black text-white p-8 mx-[24px] rounded-lg mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {footerLinks.map((column, index) => (
            <div key={index}>
              <h3 className="font-bold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div>© 2015 - 2024 JobLink® Global Inc.</div>
          <div className="flex flex-wrap justify-center md:justify-end space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              CA Notice at Collection
            </a>
            <a href="#" className="hover:text-white">
              Cookie Settings
            </a>
            <a href="#" className="hover:text-white">
              Accessibility
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
