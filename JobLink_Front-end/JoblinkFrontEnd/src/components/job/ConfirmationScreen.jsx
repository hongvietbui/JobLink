import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Phone } from "lucide-react"

export default function ConfirmJob() {
  return (
    <div className="container mx-auto max-w-3xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Xác nhận và thanh toán</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Vị trí làm việc</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">8V2W+HJV Tân Hưng</h3>
              <div className="flex items-start gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>8V2W+HJV, Tân Hưng, Sóc Sơn, Hà Nội, Việt Nam</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="font-medium">Công Minh Vương</div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>(+84) 0372495101</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Chi tiết địa chỉ</div>
              <div>
                <div className="font-medium">Nhà/nhà phố</div>
                <div className="text-muted-foreground">
                  snn, 8V2W+HJV, Tân Hưng, Sóc Sơn, Hà Nội, Việt Nam
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin công việc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Ngày bắt đầu</div>
                  <div className="font-medium">thứ bảy, 02/11/2024</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Ngày kết thúc</div>
                  <div className="font-medium">thứ hai, 02/12/2024</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Làm trong</div>
                  <div className="font-medium">3 giờ, 08:00 đến 11:00</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Số buổi</div>
                  <div className="font-medium">5 buổi</div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="font-medium mb-2">Ghi chú cho Tasker</div>
                <div className="text-muted-foreground">
                  Không có ghi chú
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-0 bg-background pt-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Tổng cộng</span>
            <span className="text-2xl font-bold">1,315,000 VND</span>
          </div>
          <Button className="w-full" size="lg">
            Đặt gói
          </Button>
        </div>
      </div>
    </div>
  )
}