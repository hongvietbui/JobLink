import { Layout } from "@/components/common/layout/layout";
import "@/styles/globals.css";
import { Outlet } from "react-router-dom";
export default function AuthLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
