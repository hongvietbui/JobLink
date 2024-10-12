import { AuthLayoutWrapper } from "@/components/common/auth/authLayout";
import "@/styles/globals.css";
import { Outlet } from "react-router-dom";
export default function NoAuthLayout() {
  return (
    <AuthLayoutWrapper>
      <Outlet />
    </AuthLayoutWrapper>
  );
}
