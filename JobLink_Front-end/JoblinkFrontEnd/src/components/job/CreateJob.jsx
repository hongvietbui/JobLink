"use client";

import { useState } from "react";
import agent from "@/lib/axios"; // Đảm bảo đường dẫn đúng đến file axios.js
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CreditCard, MapPin, Percent, ChevronRight } from "lucide-react";

export default function CreateJob() {
  const [jobData, setJobData] = useState({
    name: "",
    description: "",
    duration: 2, // mặc định là 2 giờ
    price: 0,
    avatar: "string",
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
  });

  // Hàm gửi request đến API
  const handleCreateJob = async () => {
    try {
      const response = await agent.Job.createJob(jobData);
      alert("Job created successfully!");
      console.log("Response:", response);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the job.");
    }
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Booking Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Work Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="cn" className="w-full">
                <TabsList className="grid grid-cols-7 h-14">
                  <TabsTrigger value="cn">Sun</TabsTrigger>
                  <TabsTrigger value="t2">Mon</TabsTrigger>
                  <TabsTrigger value="t3">Tue</TabsTrigger>
                  <TabsTrigger value="t4">Wed</TabsTrigger>
                  <TabsTrigger value="t5">Thu</TabsTrigger>
                  <TabsTrigger value="t6">Fri</TabsTrigger>
                  <TabsTrigger value="t7">Sat</TabsTrigger>
                </TabsList>
              </Tabs>

              <div>
                <Label>Select Start Time</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input value="08" className="w-16 text-center" />
                  <span>:</span>
                  <Input value="00" className="w-16 text-center" />
                </div>
              </div>

              <div>
                <Label>Duration</Label>
                <RadioGroup
                  value={jobData.duration.toString()}
                  onChange={(e) => setJobData({ ...jobData, duration: parseInt(e.target.value) })}
                  className="grid gap-2 mt-2"
                >
                  {[
                    { value: "2", hours: "2 hours", desc: "Up to 55m² or 2 rooms" },
                    { value: "3", hours: "3 hours", desc: "Up to 85m² or 3 rooms" },
                    { value: "4", hours: "4 hours", desc: "Up to 105m² or 4 rooms" },
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

          <Card>
            <CardHeader>
              <CardTitle>Notes for Tasker</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={jobData.description}
                onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                placeholder="Enter your notes..."
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Payment Details */}
        <div className="space-y-6">
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
              <span className="text-2xl font-bold">1,025,000 VND</span>
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
