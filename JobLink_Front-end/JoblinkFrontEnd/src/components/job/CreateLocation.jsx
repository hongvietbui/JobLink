import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MapPin, Search } from "lucide-react"

export default function Component() {
  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-xl font-medium">Chọn vị trí làm việc</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input
                className="pl-10 pr-10 h-12 bg-muted border-none text-lg"
                placeholder="Chọn địa chỉ"
                type="text"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 h-8 w-8"
              >
                <MapPin className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4 h-[600px] rounded-lg bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Map will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}