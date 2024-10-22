import { Clock, ShieldCheck, Wallet } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const MoneyWithdrawal = () => {
  return (
    <div className="mx-auto bg-gray-100 p-4 ">
      <div className="grid grid-cols-2 gap-4 my-4">
        <Card className="bg-[#584287] text-white">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Wallet className="mb-2" />
            <p className="text-sm">Số dư tài khoản</p>
            <p className="font-bold">10.000.000 đ</p>
          </CardContent>
        </Card>
        <Card className="bg-[#F5C842] text-white">
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
          <p>- Giờ làm việc từ 9h sáng đến 18h chiều.</p>
          <p>- Joblink không hỗ trợ duyệt Rút Tiền vào Thứ 7 và Chủ Nhật.</p>
        </CardContent>
      </Card>

      <Card className="bg-blue-100 text-blue-800 mb-4">
        <CardContent className="p-4 text-sm flex items-center">
          <ShieldCheck className="mr-2" />
          <p>
            Để tránh bị mất tiền, bạn hãy Click để cài đặt bật bảo mật tài khoản
            ngay.
          </p>
        </CardContent>
      </Card>

      <form className="space-y-4">
        <div>
          <p className="font-semibold mb-2">Phương thức</p>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn phương thức rút tiền" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phone">Thẻ điện thoại</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="font-semibold mb-2">Hình thức</p>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Rút tiền thường(2-7 ngày)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Rút tiền thường(2-7 ngày)</SelectItem>
              <SelectItem value="fast">Rút tiền nhanh(24h)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-red-500 text-xs mt-1">
            (Rút Tiền Nhanh 24h sẽ bị trừ 10% số tiền rút ví dụ rút 100.000 thì
            nhận được 90.000)
          </p>
        </div>

        <div>
          <p className="font-semibold mb-2">Thông tin thanh toán</p>
          <Select className="mb-2">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn ngân hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MB">MB - NH TMCP QUAN DOI</SelectItem>
              <SelectItem value="VIETCOMBANK">
                VIETCOMBANK - NH TMCP NGOAI THUONG VIET NAM (VCB)
              </SelectItem>
              <SelectItem value="VIETINBANK">
                VIETINBANK - NH TMCP CONG THUONG VIET NAM
              </SelectItem>
              <SelectItem value="ABBANK">
                ABBANK - NH TMCP AN BINH (ABB)
              </SelectItem>
              <SelectItem value="ACB">ACB - NH TMCP A CHAU</SelectItem>
              <SelectItem value="AGRIBANK">
                AGRIBANK - NH NN - PTNT VIET NAM
              </SelectItem>
              <SelectItem value="BANVIET">
                BANVIET - NH TMCP BAN VIET
              </SelectItem>
              <SelectItem value="BAOVIETBANK">
                BAOVIETBANK - NH TMCP BAO VIET (BVB)
              </SelectItem>
              <SelectItem value="BIDV">
                BIDV - NH DAU TU VA PHAT TRIEN VIET NAM
              </SelectItem>
              <SelectItem value="CBBANK">
                CBBANK - NH TM TNHH MTV XAY DUNG VIET NAM
              </SelectItem>
              <SelectItem value="CITIBANK VIETNAM">
                CITIBANK VIETNAM - NH TNHH MTV CITIBANK VIET NAM
              </SelectItem>
              <SelectItem value="DONGABANK">
                DONGABANK - NH TMCP DONG A
              </SelectItem>
              <SelectItem value="EXIMBANK">
                EXIMBANK - NH TMCP XUAT NHAP KHAU VIET NAM (EIB)
              </SelectItem>
              <SelectItem value="GPBANK">
                GPBANK - NH TMCP GUANGZHOU (VIET NAM)
              </SelectItem>
              <SelectItem value="HDBANK">
                HDBANK - NH TMCP PHAT TRIEN TP HO CHI MINH (HDB)
              </SelectItem>
              <SelectItem value="HSBC VIETNAM">
                HSBC VIETNAM - NH TNHH MTV HANG HAI (VIET NAM)
              </SelectItem>
              <SelectItem value="INDOVINABANK">
                INDOVINABANK - NH TMCP INDONESIA VIET NAM (IVB)
              </SelectItem>
              <SelectItem value="KIENLONGBANK">
                KIENLONGBANK - NH TMCP KIEN LONG
              </SelectItem>
              <SelectItem value="LIENVIETPOSTBANK">
                LIENVIETPOSTBANK - NH TMCP BUU DIEN LIEN VIET
              </SelectItem>
              <SelectItem value="MARIANNA BANK">
                MARIANNA BANK - NH TMCP ĐẦU TƯ VÀ PHÁT TRIEN NAM VIỆT
              </SelectItem>
              <SelectItem value="MSB">MSB - NH TMCP HANG HAI (MSB)</SelectItem>
              <SelectItem value="NAMABANK">NAMABANK - NH TMCP NAM A</SelectItem>
              <SelectItem value="NCB">NCB - NH TMCP QUOC DAN</SelectItem>
              <SelectItem value="OCB">
                OCB - NH TMCP PHUONG DONG (OCB)
              </SelectItem>
              <SelectItem value="PGBANK">
                PGBANK - NH TMCP XUONG TRANG VA XAY DUNG VIET NAM
              </SelectItem>
              <SelectItem value="PVCOMBANK">
                PVCOMBANK - NH TMCP DAU TU VA PHAT TRIEN VIET NAM (PVCOMBANK)
              </SelectItem>
              <SelectItem value="SAIGONBANK">
                SAIGONBANK - NH TMCP SAI GON (SCB)
              </SelectItem>
              <SelectItem value="SACOMBANK">
                SACOMBANK - NH TMCP SAI GON THUONG TIN
              </SelectItem>
              <SelectItem value="SEABANK">
                SEABANK - NH TMCP DONG NAM A (SEABANK)
              </SelectItem>
              <SelectItem value="SHB">SHB - NH TMCP SAIGON HA NOI</SelectItem>
              <SelectItem value="SHINHANBANK">
                SHINHANBANK - NH TNHH MTV SHINHAN VIET NAM
              </SelectItem>
              <SelectItem value="TECHCOMBANK">
                TECHCOMBANK - NH TMCP KY THUAT VIET NAM (TCB)
              </SelectItem>
              <SelectItem value="TPBANK">
                TPBANK - NH TMCP TIEN PHONG
              </SelectItem>
              <SelectItem value="TRUSTBANK">
                TRUSTBANK - NH TMCP TIN NGHIA
              </SelectItem>
              <SelectItem value="VIB">VIB - NH TMCP QUOC TE VIET</SelectItem>
              <SelectItem value="VRB">
                VRB - NH TMCP KHOANG SAN VIET NAM
              </SelectItem>
              <SelectItem value="WOORIBANK">
                WOORIBANK - NH TMCP WOORI HAN VIE
              </SelectItem>
            </SelectContent>
          </Select>

          <Input className="my-4" type="number" placeholder="Số tiền muốn rút" />

          <Input className="my-4" type="number" placeholder="Số tài khoản" />
          <Input className="my-4" type="text" placeholder="Tên chủ tài khoản" />
        </div>

        <Button className="w-[300px]">Rút tiền</Button>
      </form>
    </div>
  );
};

export default MoneyWithdrawal;
