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

const MoneyWithdrawal = () => {
  const [amount, setAmount] = useState("");
  const [bankNumber, setbankNumber] = useState("");
  const [bankName, setbankName] = useState("");
  const [userReceive, setUserReceive] = useState("");
  const { accountBalance, refreshUserData, email } = useAuthStore();
  const [isOpen, setIsOpen] = useState();
  const [loading, setLoading] = useState(false); // Loading state
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // Track if OTP has been sent
  const [isValidOtp, setIsValidOtp] = useState(false); // Track if OTP is valid

  const handleSendOtp = async () => {
    try {
      if (isOtpSent) {
        return;
      }
      await agent.EmailInput.OtpSend({ email }); // Call your API to send the OTP
      setIsOtpSent(true); // Mark OTP as sent
      toast.success("Mã OTP đã được gửi đến email của bạn!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi mã OTP. Vui lòng thử lại.");
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
      toast.error("Mã OTP không hợp lệ. Vui lòng thử lại.");
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
      toast.error("Vui lòng nhập số tiền hợp lệ.");
      setIsOpen(false);
      return;
    }

    if (!bankName) {
      toast.error("Vui lòng chọn ngân hàng.");
      setIsOpen(false);
      return;
    }

    if (!bankNumber) {
      toast.error("Vui lòng nhập số tài khoản.");
      setIsOpen(false);
      return;
    }

    if (!userReceive) {
      toast.error("Vui lòng nhập tên người nhận.");
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
      userId: "FF41A35A-868D-47E9-902B-F1687FA16A4A",
    };

    try {
      setLoading(true);
      await agent.Transaction.createWithdraw(formData);
      toast.success("Rút tiền thành công!");
      setIsOpen(false);

      // Await refreshUserData to ensure it's completed
      await refreshUserData();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
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
            <p className="text-sm">Số dư tài khoản</p>
            <p className="font-bold">
              {" "}
              {Number(accountBalance).toLocaleString("vi-VN")} đ
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[rgb(245,200,66)] text-white">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Clock className="mb-2" />
            <p className="text-sm">Lịch sử</p>
            <p className="font-bold">Rút tiền</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-red-100 text-red-800 mb-4">
        <CardContent className="p-4 text-sm">
          <p className="font-bold mb-2">Lưu ý:</p>
          <p>- Số tiền rút tối thiểu là 10.000 VND</p>
          <p>- Joblink sẽ chuyển tiền tới bạn trong 2-7 ngày làm việc</p>
          <p>
            - Rút Tiền sẽ bị trừ 10% số tiền rút ví dụ rút 100.000 thì nhận được
            90.000
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <p className="font-semibold mb-2">Thông tin thanh toán</p>
          <Select className="mb-2" onValueChange={setbankName} value={bankName}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn ngân hàng" />
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
            placeholder="Số tiền muốn rút"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Input
            className="my-4"
            type="number"
            placeholder="Số tài khoản"
            value={bankNumber}
            onChange={(e) => setbankNumber(e.target.value)}
          />
          <Input
            className="my-4"
            type="text"
            placeholder="Tên chủ tài khoản"
            value={userReceive}
            onChange={(e) => setUserReceive(e.target.value)}
          />
        </div>

        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger>
            <Button onClick={() => handleSendOtp()}>Rút tiền</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isOtpSent ? "Xác thực mã OTP" : "Xác thực mã OTP"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isOtpSent
                  ? "Nhập mã OTP đã được gửi đến email của bạn."
                  : "Đang thực hiện gửi mã OTP xác thực tới email của bạn"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <CardContent>
              {isOtpSent && (
                <Input
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="my-4"
                />
              )}
            </CardContent>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsOpen(false)}>
                Hủy
              </AlertDialogCancel>
              {isOtpSent ? (
                <AlertDialogAction onClick={(e) => handleVerifyOtp(e)}>
                  Xác nhận
                </AlertDialogAction>
              ) : (
                <AlertDialogAction disabled={!isOtpSent}>
                  Đang gửi OTP
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
