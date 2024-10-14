import { Route, Routes } from "react-router-dom";
import ForgotPass from "@/pages/forget-pass";
import Home from "@/pages/homepage/index";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import AuthLayout from "./layouts/AuthLayout";
import NoAuthLayout from "./layouts/NoAuthLayout";
import Account from "./pages/accounts/page";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Home />} />
        <Route element={<Account />} path="/accounts" />
      </Route>

      <Route element={<NoAuthLayout />}>
        <Route element={<ForgotPass />} path="/about" />
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
      </Route>
    </Routes>
  );
}

export default App;
