import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import agent from "../../lib/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      //Call backend
      const response = await agent.Account.loginUsername({
        username,
        password,
      });

      console.log(response);
      //check if backend response
      const accessToken = response.accessToken;
      localStorage.setItem("token", accessToken);

      const userInfo = await agent.User.me();

      const hasAdminRole = userInfo.roleList.some(
        (role) => role.name === "Admin"
      );

      if (hasAdminRole) {
        // Redirect sang trang khác nếu người dùng có role "Admin"
        window.location.href = "/support-list"; // Thay đường dẫn này bằng trang bạn muốn chuyển hướng đến
      } else {
        // Thực hiện hành động khác nếu không phải là admin
        window.location.href = "/dashboard"; // Hoặc trang mặc định của người dùng bình thường
      }
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error(error.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
            <div className="flex justify-between w-full text-sm">
              <a href="/verifyEmail" className="text-blue-500 hover:underline">
                Forgot password?
              </a>
              <a
                href="/auth/register"
                className="text-blue-500 hover:underline"
              >
                Sign up
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
