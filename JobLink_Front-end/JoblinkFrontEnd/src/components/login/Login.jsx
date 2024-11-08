import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import agent from '../../lib/axios'
import { useToast } from "../../hooks/use-toast"  // Import the custom toast hook
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const  username = email
      //Call backend
      const response = await agent.Account.loginEmail({username,password})

      //check if backend response
      if (response.data.status === 200) {
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken)

        //navigate to homepage
        navigate('');
        toast({
          title: "Logged in successfully!",
          description: "You have been logged in.",
          status: "success",
        });
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        status: "error",
      });

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
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
              <a href="/forgot-password" className="text-blue-500 hover:underline">
                Forgot password?
              </a>
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}