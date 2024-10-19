import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster" // Ensure the correct path
import agent from '../../lib/axios'
import { useToast } from "../../hooks/use-toast"  // Import the custom toast hook

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showOtpInput, setShowOtpInput] = useState(false)
  const navigate = useNavigate()

  const { toast } = useToast() 

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!showOtpInput) {
        await agent.EmailInput.OtpSend({ email })
        localStorage.setItem("verificationEmail", email)
        setShowOtpInput(true)

        toast({
          title: "OTP Sent",
          description: "Please check your email for the verification code.",
        })
      } else {
        const code = otp
        await agent.VerifyOtp.verifyCode({ email, code })

        console.log("Navigating to changePasswordPage");
        navigate('/changePasswordPage', { state: { email } });
      }
    } catch (error) {
      // Trigger an error toast
      toast({
        title: "Error",
        description: showOtpInput 
          ? "Failed to verify OTP. Please try again." 
          : "Failed to send OTP. Please try again.",
        variant: "destructive",
      })

      if (!showOtpInput) setShowOtpInput(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setShowOtpInput(false)
    setOtp("")
  }

  return (
    <div className="container max-w-md mx-auto mt-16 p-6 bg-gray-50 shadow-lg rounded-lg">
      <Card className="bg-white p-8 rounded-lg">
        <CardHeader className="mb-4">
          <CardTitle className="text-2xl font-bold text-center text-indigo-600">
            {showOtpInput ? "OTP Verification" : "Email Verification"}
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            {showOtpInput 
              ? "Enter the verification code sent to your email." 
              : "Enter your email to receive a verification code."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-6">
              {!showOtpInput ? (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className={`w-full py-3 ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-500'} text-white text-lg font-semibold rounded-lg`}
              disabled={isLoading}
            >
              {isLoading 
                ? (showOtpInput ? "Verifying..." : "Sending...") 
                : (showOtpInput ? "Verify OTP" : "Send Verification Code")}
            </Button>
            {showOtpInput && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full py-3 border border-gray-300 hover:bg-gray-100 rounded-lg"
                onClick={handleBackToEmail}
              >
                Back to Email Input
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
      <Toaster /> {/* Ensure this is included to render toasts */}
    </div>
  )
}
