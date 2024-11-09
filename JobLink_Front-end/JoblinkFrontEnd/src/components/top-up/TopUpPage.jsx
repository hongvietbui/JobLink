// src/components/TopUpPage.js
import React, { useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import agent from "@/lib/axios";
import { toast } from "react-toastify";

const TopUpPage = () => {
  const [connection, setConnection] = useState(null);
  const bankAccount = "0387718770 - MB Bank";
  const accountName = "BUI VIET HONG";

  const [qrValue, setQrValue] = useState("null");
  
  // Thiết lập kết nối với SignalR khi component mount
  useEffect(() => {
      // Hàm async để kết nối với SignalR và lấy dữ liệu
      const connectToSignalR = async () => {
        try {
          // Giả sử agent.User.me và agent.Transaction.getQRCodeByUserId là async functions
          const user = await agent.User.me();
          const QRCode = await agent.Transaction.getQRCodeByUserId(user.id);
          console.log(QRCode);
          setQrValue(QRCode);
  
          // Thiết lập kết nối với SignalR
          const newConnection = new HubConnectionBuilder()
            .withUrl(`http://localhost:8080/hub/transfer?userId=${user.id}`)
            .withAutomaticReconnect()
            .build();
  
          newConnection.on("ReceiveTransfer", (message) => {
            toast.success('Chuyen khoan thanh cong voi so tien '+ 11000 +'VND'); // Hiển thị thông báo thành công
            console.log("ReceiveTransfer:", message);
          });
  
          await newConnection.start();
          console.log("SignalR Connected.");
          setConnection(newConnection);
        } catch (error) {
          console.error("Connection failed: ", error);
        }
      };
  
      connectToSignalR();
  
      // Hàm dọn dẹp kết nối khi component unmount
      return () => {
        if (connection) {
          connection.stop();
        }
      };
    }, []); // Đảm bảo connection được dọn dẹp đúng cách khi thay đổi

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-6 space-y-8">

      <h1 className="text-3xl font-bold text-green-400">Transfer Information</h1>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        <img src={qrValue}/>
      </div>

      <div className="text-center space-y-2">
        <p className="text-lg font-semibold">Bank Account: <span className="font-normal">{bankAccount}</span></p>
        <p className="text-lg font-semibold">Name: <span className="font-normal">{accountName}</span></p>
      </div>

      <p className="text-red-500 text-center font-semibold">
        Please do not change the description!
      </p>
    </div>
  );
};

export default TopUpPage;
