import { Clock, Wallet } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Loader2 } from "lucide-react"; // Import the loader icon from lucide-react

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import agent from "@//lib/axios";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import useAuthStore from "@/stores/useAuthStore";
import LoadingCustom from "../ui/loading/LoadingCustom";
import { useNavigate } from "react-router-dom";

const MoneyWithdrawal = () => {
  const [amount, setAmount] = useState("");
  const [bankNumber, setbankNumber] = useState("");
  const [bankName, setbankName] = useState("");
  const [userReceive, setUserReceive] = useState("");
  const { accountBalance, refreshUserData, email, id } = useAuthStore();
  const [isOpen, setIsOpen] = useState();
  const [loading, setLoading] = useState(false); // Loading state
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // Track if OTP has been sent
  const [isValidOtp, setIsValidOtp] = useState(false); // Track if OTP is valid
  const navigate = useNavigate();
  const handleSendOtp = async () => {
    try {
      if (isOtpSent) {
        return;
      }
      await agent.EmailInput.OtpSend({ email }); // Call your API to send the OTP
      setIsOtpSent(true); // Mark OTP as sent
      toast.success("OTP code has been sent to your email!");
    } catch (error) {
      toast.error(
        "An error occurred while sending the OTP code. Please try again."
      );
    }
  };

  // Function to verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await agent.VerifyOtp.verifyCode({ email, code: otp });
      setIsValidOtp(true);
      handleSubmit(); // Call handleSubmit after validating OTP
    } catch (error) {
      toast.error("OTP code is not valid. Please try again.");
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (
      !amount ||
      isNaN(amount) ||
      Number(amount) < 10000 ||
      amount > accountBalance
    ) {
      toast.error("Please enter a valid amount.");
      setIsOpen(false);
      return;
    }

    if (!bankName) {
      toast.error("Please select a bank.");
      setIsOpen(false);
      return;
    }

    if (!bankNumber) {
      toast.error("Please enter account number.");
      setIsOpen(false);
      return;
    }

    if (!userReceive) {
      toast.error("Please enter the recipient's name.");
      setIsOpen(false);
      return;
    }
    const formData = {
      amount,
      bankNumber,
      bankName,
      userReceive,
      transactionDate: new Date(),
      paymentType: 0,
      userId: id,
    };

    console.log(formData);
    try {
      setLoading(true);
      await agent.Transaction.createWithdraw(formData);
      toast.success("Withdraw money successfully!");
      setIsOpen(false);

      // Await refreshUserData to ensure it's completed
      await refreshUserData();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred! Please try again.");
      setIsOpen(false);
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }

    // Gửi dữ liệu đến API hoặc thực hiện hành động cần thiết ở đây
  };
  return (
    <div className="mx-auto bg-gray-100 p-4 ">
      {loading && <LoadingCustom />}
      <div className="grid grid-cols-2 gap-4 my-4">
        <Card className="bg-[#584287] text-white">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Wallet className="mb-2" />
            <p className="text-sm">Account balance</p>
            <p className="font-bold">
              {" "}
              {Number(accountBalance).toLocaleString("vi-VN")} đ
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[rgb(245,200,66)] text-white">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Clock className="mb-2" />
            <p
              onClick={() => navigate("/TransactionHistory")}
              className="text-sm"
            >
              History
            </p>
            <p className="font-bold">Withdraw money</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-red-100 text-red-800 mb-4">
        <CardContent className="p-4 text-sm">
          <p className="font-bold mb-2">Note:</p>
          <p>- Minimum withdrawal amount is 10,000 VND</p>
          <p>- Joblink will transfer money to you in 2-7 working days</p>
          <p>
            - Withdrawals will be deducted 10% of the withdrawal amount. For
            example, if you withdraw 100,000, you will receive 90,000
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <p className="font-semibold mb-2">Payment information</p>
          <Select className="mb-2" onValueChange={setbankName} value={bankName}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mb">MB - NH TMCP QUAN DOI</SelectItem>
              <SelectItem value="Vietcombank">
                VIETCOMBANK - NH TMCP NGOAI THUONG VIET NAM (VCB)
              </SelectItem>
              <SelectItem value="Vietinbank">
                VIETINBANK - NH TMCP CONG THUONG VIET NAM
              </SelectItem>
              <SelectItem value="Abbank">
                ABBANK - NH TMCP AN BINH (ABB)
              </SelectItem>
              <SelectItem value="Acb">ACB - NH TMCP A CHAU</SelectItem>
              <SelectItem value="Agribank">
                AGRIBANK - NH NN - PTNT VIET NAM
              </SelectItem>
              <SelectItem value="Banviet">
                BANVIET - NH TMCP BAN VIET
              </SelectItem>
              <SelectItem value="Baovietbank">
                BAOVIETBANK - NH TMCP BAO VIET (BVB)
              </SelectItem>
              <SelectItem value="Bidv">
                BIDV - NH DAU TU VA PHAT TRIEN VIET NAM
              </SelectItem>
              <SelectItem value="Cbbank">
                CBBANK - NH TM TNHH MTV XAY DUNG VIET NAM
              </SelectItem>
              <SelectItem value="CitibankVietnam">
                CITIBANK VIETNAM - NH TNHH MTV CITIBANK VIET NAM
              </SelectItem>
              <SelectItem value="Dongabank">
                DONGABANK - NH TMCP DONG A
              </SelectItem>
              <SelectItem value="Eximbank">
                EXIMBANK - NH TMCP XUAT NHAP KHAU VIET NAM (EIB)
              </SelectItem>
              <SelectItem value="Gpbank">
                GPBANK - NH TMCP GUANGZHOU (VIET NAM)
              </SelectItem>
              <SelectItem value="Hdbank">
                HDBANK - NH TMCP PHAT TRIEN TP HO CHI MINH (HDB)
              </SelectItem>
              <SelectItem value="HsbcVietnam">
                HSBC VIETNAM - NH TNHH MTV HANG HAI (VIET NAM)
              </SelectItem>
              <SelectItem value="Indovinabank">
                INDOVINABANK - NH TMCP INDONESIA VIET NAM (IVB)
              </SelectItem>
              <SelectItem value="Kienlongbank">
                KIENLONGBANK - NH TMCP KIEN LONG
              </SelectItem>
              <SelectItem value="Lienvietpostbank">
                LIENVIETPOSTBANK - NH TMCP BUU DIEN LIEN VIET
              </SelectItem>
              <SelectItem value="MariannaBank">
                MARIANNA BANK - NH TMCP ĐẦU TƯ VÀ PHÁT TRIEN NAM VIỆT
              </SelectItem>
              <SelectItem value="Msb">MSB - NH TMCP HANG HAI (MSB)</SelectItem>
              <SelectItem value="Namabank">NAMABANK - NH TMCP NAM A</SelectItem>
              <SelectItem value="Ncb">NCB - NH TMCP QUOC DAN</SelectItem>
              <SelectItem value="Ocb">
                OCB - NH TMCP PHUONG DONG (OCB)
              </SelectItem>
              <SelectItem value="Pgbank">
                PGBANK - NH TMCP XUONG TRANG VA XAY DUNG VIET NAM
              </SelectItem>
              <SelectItem value="Pvcombank">
                PVCOMBANK - NH TMCP DAU TU VA PHAT TRIEN VIET NAM (PVCOMBANK)
              </SelectItem>
              <SelectItem value="Saigonbank">
                SAIGONBANK - NH TMCP SAI GON (SCB)
              </SelectItem>
              <SelectItem value="Sacombank">
                SACOMBANK - NH TMCP SAI GON THUONG TIN
              </SelectItem>
              <SelectItem value="Seabank">
                SEABANK - NH TMCP DONG NAM A (SEABANK)
              </SelectItem>
              <SelectItem value="Shb">SHB - NH TMCP SAIGON HA NOI</SelectItem>
              <SelectItem value="Shinhanbank">
                SHINHANBANK - NH TNHH MTV SHINHAN VIET NAM
              </SelectItem>
              <SelectItem value="Techcombank">
                TECHCOMBANK - NH TMCP KY THUAT VIET NAM (TCB)
              </SelectItem>
              <SelectItem value="Tpbank">
                TPBANK - NH TMCP TIEN PHONG
              </SelectItem>
              <SelectItem value="Trustbank">
                TRUSTBANK - NH TMCP TIN NGHIA
              </SelectItem>
              <SelectItem value="Vib">VIB - NH TMCP QUOC TE VIET</SelectItem>
              <SelectItem value="Vrb">
                VRB - NH TMCP KHOANG SAN VIET NAM
              </SelectItem>
              <SelectItem value="Wooribank">
                WOORIBANK - NH TMCP WOORI HAN VIE
              </SelectItem>
            </SelectContent>
          </Select>

          <Input
            className="my-4"
            type="number"
            placeholder="Amount you want to withdraw"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Input
            className="my-4"
            type="number"
            placeholder="Account number"
            value={bankNumber}
            onChange={(e) => setbankNumber(e.target.value)}
          />
          <Input
            className="my-4"
            type="text"
            placeholder="Account holder name"
            value={userReceive}
            onChange={(e) => setUserReceive(e.target.value)}
          />
        </div>

        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger>
            <Button onClick={() => handleSendOtp()}>Withdraw money</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isOtpSent ? "Verify OTP code" : "Verify OTP code"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isOtpSent
                 ? "Enter the OTP code sent to your email."
                 : "Sending authentication OTP code to your email"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <CardContent>
              {isOtpSent && (
                <Input
                  type="text"
                  placeholder="Enter OTP code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="my-4"
                />
              )}
            </CardContent>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsOpen(false)}>
                Cancel
              </AlertDialogCancel>
              {isOtpSent ? (
                <AlertDialogAction onClick={(e) => handleVerifyOtp(e)}>
                  Confirm
                </AlertDialogAction>
              ) : (
                <AlertDialogAction disabled={!isOtpSent}>
                  Sending OTP
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default MoneyWithdrawal;
