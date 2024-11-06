"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CreditCard, MapPin, Percent, ChevronRight } from "lucide-react"

export default function Component() {
  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Xác nhận và thanh toán</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-red-500" />
            <span>8V2W+HJV, Tân Hưng, Sóc Sơn, Hà...</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Booking Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chọn lịch làm việc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="cn" className="w-full">
                <TabsList className="grid grid-cols-7 h-14">
                  <TabsTrigger value="cn">CN</TabsTrigger>
                  <TabsTrigger value="t2">T2</TabsTrigger>
                  <TabsTrigger value="t3">T3</TabsTrigger>
                  <TabsTrigger value="t4">T4</TabsTrigger>
                  <TabsTrigger value="t5">T5</TabsTrigger>
                  <TabsTrigger value="t6">T6</TabsTrigger>
                  <TabsTrigger value="t7">T7</TabsTrigger>
                </TabsList>
              </Tabs>

              <div>
                <Label>Chọn giờ bắt đầu</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input value="08" className="w-16 text-center" />
                  <span>:</span>
                  <Input value="00" className="w-16 text-center" />
                </div>
              </div>

              <div>
                <Label>Thời lượng</Label>
                <RadioGroup defaultValue="2" className="grid gap-2 mt-2">
                  {[
                    { value: "2", hours: "2 giờ", desc: "Tối đa 55m² hoặc 2 phòng" },
                    { value: "3", hours: "3 giờ", desc: "Tối đa 85m² hoặc 3 phòng" },
                    { value: "4", hours: "4 giờ", desc: "Tối đa 105m² hoặc 4 phòng" },
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
              <CardTitle>Ghi chú cho Tasker</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Nhập ghi chú của bạn..." className="min-h-[100px]" />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Payment Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-between" asChild>
                <Label className="cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <span>Chọn trong danh sách</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Label>
              </Button>

              <Button variant="outline" className="w-full justify-between" asChild>
                <Label className="cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Percent className="h-5 w-5" />
                    <span>Khuyến mãi</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Label>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Quy định hủy gói đã thanh toán - hoàn tiền:</h3>
                <div className="space-y-2 text-sm">
                  <p>bTaskee hỗ trợ 1 trong 2 hình thức hoàn tiền bên dưới</p>
                  <ol className="list-decimal pl-4 space-y-2">
                    <li>Hoàn tiền qua bPay: bTaskee hoàn lại tổng số tiền của những buổi chưa sử dụng.</li>
                    <li>
                      Hoàn tiền qua chuyển khoản ngân hàng: bTaskee hoàn lại tổng số tiền của những buổi chưa sử dụng trừ
                      đi 20% giá trị của gói ban đầu.
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="sticky bottom-0 bg-background p-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Tổng cộng</span>
              <span className="text-2xl font-bold">1,025,000 VND</span>
            </div>
            <Button className="w-full" size="lg">
              Đặt gói
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}