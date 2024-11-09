import { DollarSign, BarChart2, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import TaskDone from "./TaskDone";

import ChartDashBoard from "./ChartDashboard";
import { useEffect, useState } from "react";
import agent from "@//lib/axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    agent.User.homepage()
      .then((response) => {
        console.log(response);
        setUserData(response);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4 my-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Welcome Banner */}
        <Card className="col-span-1 md:col-span-2 bg-[#584287]">
          <CardContent className="flex items-center p-6 text-[white]">
            <div className="flex-1">
              <h2 className="text-2xl font-bold ">Welcome Back !</h2>
              <p className="text-[white]">JobLink Dashboard</p>
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card className="col-span-1 md:col-span-2">
          <CardContent className="flex items-center p-6">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage
                src="https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/440879710_1311365576486302_465885895535459738_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFwMNEk_sQdV-RfB0sm4YE1ZNm2NsCaeAlk2bY2wJp4CbaqoySVisau52pRC-dwipFqTIGn9kjUzVvfdl1wv1yx&_nc_ohc=mZB2f4hrYGgQ7kNvgFJw4mD&_nc_ht=scontent.fhan15-2.fna&_nc_gid=AIjaqqf7tdycM5HliMh4B4h&oh=00_AYAZEu-QpBbS-mtPHl03aVVmDVzEtd0qKwey1qFH80LGwA&oe=671D5A89"
                alt="User"
              />
              <AvatarFallback>QS</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{userData?.userName}</p>
              <p className="mt-2">
                Balance:{" "}
                <span className="font-bold">
                  {userData?.accountBalance} VND
                </span>
              </p>

              <Button className="mt-2 mr-4  hover:opacity-100">Deposit</Button>
              <Button
                onClick={() => navigate("/withdraw-money")}
                className="mt-2  hover:opacity-100"
              >
                Withdraw
              </Button>
              <Button
                className="mt-2 ml-4  hover:opacity-100"
                onClick={() => navigate("/profile")}
              >
                Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Money earned today
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userData?.amountEarnedToday}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Amount earned this month
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userData?.amountEarnedThisMonth}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
            Total recharge during the month
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.depositAmount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
            Number of jobs created during the month
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userData?.createJobThisMonth}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-4">
          <CardHeader>
            <CardTitle>Doing list for today</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-around">
            <TaskDone />
          </CardContent>
        </Card>

        <ChartDashBoard />
      </div>
    </div>
  );
}
