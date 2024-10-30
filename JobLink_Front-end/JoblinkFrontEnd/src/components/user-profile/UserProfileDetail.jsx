import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Star } from "lucide-react"

export default function UserProfile() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/placeholder-avatar.jpg" alt="TuấnAnh026" />
            <AvatarFallback>TA</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl">TuấnAnh026</CardTitle>
            <p className="text-sm text-muted-foreground">
              Đại học Bách Khoa Hà Nội CNTT: Khoa học Máy tính
            </p>
            <p className="mt-1 italic">"Do geniuses exist?"</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button variant="outline">Danh sách ưa thích</Button>
            <Button variant="outline">Thay đổi tiểu sử</Button>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Lịch sử hoạt động</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tân binh</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">719</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Xếp hạng</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <Progress value={0} max={100} className="h-2 mb-2" />
                <p className="text-2xl font-bold">0,0</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Đáp án</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary text-xl">⚗️</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Điểm đánh giá</h4>
              <p className="text-sm text-muted-foreground">Chuyên gia Khoa học (Lý/Hóa/Sinh/Tin)</p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Đánh giá của học sinh</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="font-medium">Ngố</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">1 tháng trước</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="font-medium">Hay</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">1 tháng trước</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}