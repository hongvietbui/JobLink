"use client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import agent from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ArrowLeft, CreditCard, MapPin, Percent, ChevronRight } from "lucide-react";

export default function CreateJob() {
  const navigate = useNavigate(); 
  // Lấy dữ liệu từ localStorage khi tải trang, và chuyển đổi lại thành Date nếu cần
  const getInitialData = () => {
    const savedData = localStorage.getItem("jobData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return {
        ...parsedData,
        startTime: new Date(parsedData.startTime), // Chuyển đổi về Date
        endTime: parsedData.endTime ? new Date(parsedData.endTime) : "", // Chuyển đổi về Date nếu có giá trị
      };
    }
    return {
      name: "",
      description: "",
      duration: 2,
      price: 0,
      avatar: "string",
      startTime: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000),
      endTime: "",
    };
  };

  const [jobData, setJobData] = useState(getInitialData);
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    startTime: "",
  });

  useEffect(() => {
    // Cập nhật endTime mỗi khi startTime hoặc duration thay đổi
    const end = new Date(jobData.startTime);
    end.setHours(end.getHours() + jobData.duration);
    setJobData((prevData) => ({
      ...prevData,
      endTime: end,
    }));

    // Lưu vào localStorage
    localStorage.setItem("jobData", JSON.stringify(jobData));
  }, [jobData.startTime, jobData.duration]);

  const calculateTotalPrice = () => jobData.price * 1.1;

  const validateFields = () => {
    const newErrors = {
      name: jobData.name ? "" : "Job name is required.",
      description: jobData.description.length >= 10 ? "" : "Description must be at least 10 characters.",
      price: jobData.price > 0 ? "" : "Price must be greater than 0.",
      startTime: jobData.startTime ? "" : "Start time is required.",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleCreateJob = async () => {
    if (!validateFields()) return;

    const payload = {
      ...jobData,
      startTime: new Date(jobData.startTime.getTime() - jobData.startTime.getTimezoneOffset() * 60000).toISOString(),
      endTime: new Date(jobData.endTime.getTime() - jobData.endTime.getTimezoneOffset() * 60000).toISOString()
    };

    try {
      const response = await agent.Job.createJob(payload);
      alert("Job created successfully!");
      localStorage.removeItem("jobData");
      navigate("/jobmanage");
    } catch (error) {
      const { status, message } = error;

      if (status == 400) {
        alert("Invalid request. Please check your inputs.");
      } else if (status == 402) {
        alert("Insufficient funds. Redirecting to recharge page...");
        navigate("/topup"); // Điều hướng tới trang nạp tiền
      } else {
        console.error("Unexpected error:", error);
        alert("Network or server error occurred. Please try again later.");
      }
    }
  };
  
  
  

  const updateField = (field, value) => {
    setJobData((prevData) => {
      const updatedData = { ...prevData, [field]: value };
      localStorage.setItem("jobData", JSON.stringify(updatedData)); // Lưu lại sau khi cập nhật
      return updatedData;
    });
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Confirm and Pay</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-red-500" />
            <span>8V2W+HJV, Tan Hung, Soc Son, Ha...</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Name</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={jobData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Enter job name..."
            className="w-full"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Work Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Select Date</Label>
                <Calendar
                  onChange={(date) => {
                    const hours = jobData.startTime.getHours();
                    const minutes = jobData.startTime.getMinutes();
                    const newDate = new Date(date);
                    newDate.setHours(hours, minutes);
                    setJobData({
                      ...jobData,
                      startTime: newDate,
                    });
                    setErrors((prevErrors) => ({ ...prevErrors, startTime: "" }));
                  }}
                  value={jobData.startTime}
                  className="border border-gray-300 p-2 rounded-md w-full mt-2"
                />
              </div>

              <div>
                <Label>Select Start Time</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={jobData.startTime.getHours().toString().padStart(2, "0")}
                    onChange={(e) => {
                      const hours = parseInt(e.target.value);
                      const newDate = new Date(jobData.startTime);
                      newDate.setHours(hours);
                      setJobData({
                        ...jobData,
                        startTime: newDate,
                      });
                      setErrors((prevErrors) => ({ ...prevErrors, startTime: "" }));
                    }}
                    type="number"
                    min="0"
                    max="23"
                    className="w-16 text-center"
                  />
                  <span>:</span>
                  <Input
                    value={jobData.startTime.getMinutes().toString().padStart(2, "0")}
                    onChange={(e) => {
                      const minutes = parseInt(e.target.value);
                      const newDate = new Date(jobData.startTime);
                      newDate.setMinutes(minutes);
                      setJobData({
                        ...jobData,
                        startTime: newDate,
                      });
                      setErrors((prevErrors) => ({ ...prevErrors, startTime: "" }));
                    }}
                    type="number"
                    min="0"
                    max="59"
                    className="w-16 text-center"
                  />
                </div>
                {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime}</p>}
              </div>

              <div>
                <Label>Duration</Label>
                <RadioGroup
                  value={jobData.duration.toString()}
                  onValueChange={(value) => updateField("duration", parseInt(value))}
                  className="grid gap-2 mt-2"
                >
                  {[
                    { value: "2", hours: "2 hours", desc: "Ideal for small tasks or meetings" },
                    { value: "3", hours: "3 hours", desc: "Suitable for medium-sized projects" },
                    { value: "4", hours: "4 hours", desc: "Best for long or detailed tasks" },
                  ].map((option) => (
                    <Label
                      key={option.value}
                      className="border rounded-lg p-4 cursor-pointer [&:has(:checked)]:border-primary"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value={option.value} />
                        <div>
                          <div className="font-medium">{option.hours}</div>
                          <div className="text-sm text-muted-foreground">{option.desc}</div>
                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notes for Tasker</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={jobData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Enter additional details for the tasker..."
                className="min-h-[100px]"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-between" asChild>
                <Label className="cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <span>Select from list</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Label>
              </Button>

              <Button variant="outline" className="w-full justify-between" asChild>
                <Label className="cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Percent className="h-5 w-5" />
                    <span>Promotion</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Label>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Label>Price</Label>
                <Input
                  type="number"
                  value={jobData.price}
                  onChange={(e) => updateField("price", parseFloat(e.target.value))}
                  placeholder="Enter price"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                <h3 className="font-semibold">Refund Policy for Paid Packages:</h3>
                <div className="space-y-2 text-sm">
                  <p>bTaskee supports one of the two refund methods below</p>
                  <ol className="list-decimal pl-4 space-y-2">
                    <li>Refund via bPay: bTaskee refunds the full amount for unused sessions.</li>
                    <li>
                      Refund via bank transfer: bTaskee refunds the full amount for unused sessions, minus 20% of the original package price.
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="sticky bottom-0 bg-background p-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold">{calculateTotalPrice().toFixed(2)} $</span>
            </div>
            <Button className="w-full" size="lg" onClick={handleCreateJob}>
              Book Package
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
