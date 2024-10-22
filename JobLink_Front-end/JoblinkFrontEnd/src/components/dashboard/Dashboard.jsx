
import {
  Facebook,
  Instagram,
  DollarSign,
  BarChart2,
  Wallet,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";

const data = [
  { name: "16/10", value: 0 },
  { name: "17/10", value: 0 },
  { name: "18/10", value: 0 },
  { name: "19/10", value: 0 },
  { name: "20/10", value: 0 },
  { name: "21/10", value: 0 },
  { name: "22/10", value: 0 },
];

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4 my-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Welcome Banner */}
        <Card className="col-span-1 md:col-span-2 bg-[#584287]">
          <CardContent className="flex items-center p-6 text-[white]">
            <div className="flex-1">
              <h2 className="text-2xl font-bold ">
                Welcome Back !
              </h2>
              <p className="text-[white]">JobLink Dashboard</p>
            </div>
           
          </CardContent>
        </Card>

        {/* User Info */}
        <Card className='col-span-1 md:col-span-2'>
          <CardContent className="flex items-center p-6">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage
                src="https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/440879710_1311365576486302_465885895535459738_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFwMNEk_sQdV-RfB0sm4YE1ZNm2NsCaeAlk2bY2wJp4CbaqoySVisau52pRC-dwipFqTIGn9kjUzVvfdl1wv1yx&_nc_ohc=mZB2f4hrYGgQ7kNvgFJw4mD&_nc_ht=scontent.fhan15-2.fna&_nc_gid=AIjaqqf7tdycM5HliMh4B4h&oh=00_AYAZEu-QpBbS-mtPHl03aVVmDVzEtd0qKwey1qFH80LGwA&oe=671D5A89"
                alt="User"
              />
              <AvatarFallback>QS</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">QuangNV1911</p>
              <p className="text-sm text-gray-500">Role: User</p>
              <p className="mt-2">
                Số dư: <span className="font-bold">1,131</span>
              </p>
              <p>
                Đã hoàn hôm nay: <span className="font-bold">0</span>
              </p>
              <Button className="mt-2  hover:opacity-100">
                Mua Xu
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Số tiền kiếm được hôm nay
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số tiền kiếm được tháng này</CardTitle>
            <BarChart2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng nạp tháng
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Số công việc tạo ra trong tháng
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        {/* Social Media Usage */}
        <Card className="col-span-1 md:col-span-4">
          <CardHeader>
            <CardTitle>Sử dụng hôm nay</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-around">
            <div className="text-center">
              <Facebook className="h-12 w-12 text-blue-600 mx-auto" />
              <p className="mt-2 font-bold">Facebook</p>
              <p className="text-sm text-gray-500">0 đơn</p>
              <p className="text-sm text-gray-500">0 xu</p>
            </div>
            <div className="text-center">
              <Instagram className="h-12 w-12 text-pink-500 mx-auto" />
              <p className="mt-2 font-bold">Instagram</p>
              <p className="text-sm text-gray-500">0 đơn</p>
              <p className="text-sm text-gray-500">0 xu</p>
            </div>
            <div className="text-center">
              <svg
                className="h-12 w-12 mx-auto"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
              <p className="mt-2 font-bold">Tiktok</p>
              <p className="text-sm text-gray-500">0 đơn</p>
              <p className="text-sm text-gray-500">0 xu</p>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics Chart */}
        <Card className="col-span-1 md:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Thống kê sử dụng</CardTitle>
            <div className="flex items-center space-x-2">
              <span>16/10/2024 - 22/10/2024</span>
              <Switch />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center text-sm text-gray-500">
              Sử dụng: 0 Đã nạp: 0 Đã hoàn: 0
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
