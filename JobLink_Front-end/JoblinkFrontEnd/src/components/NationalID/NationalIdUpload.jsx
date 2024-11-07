import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { useToast } from "@/components/ui/use-toast"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import agent from "@/lib/axios"


export default function IDCardUpload() {
  const [frontImage, setFrontImage] = useState(null)
  const [backImage, setBackImage] = useState(null)
//   const { toast } = useToast()

  const handleFileChange = (event, side) => {
    const file = event.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        side === 'front' ? setFrontImage(file) : setBackImage(file)
      } else {
        // toast({
        //   title: "Invalid file type",
        //   description: "Please upload an image file.",
        //   variant: "destructive",
        // })
      }
    }
  }

  const handleUpload = () => {
    if (!frontImage || !backImage) {
    //   toast({
    //     title: "Missing images",
    //     description: "Please upload both front and back sides of your ID card.",
    //     variant: "destructive",
    //   })
      return
    }

    // Here you would typically send the images to your server
    // For this example, we'll just show a success message
    // toast({
    //   title: "Upload successful",
    //   description: "Your ID card images have been uploaded.",
    // })
  }

  const handleCancel = () => {
    setFrontImage(null)
    setBackImage(null)
    // toast({
    //   title: "Upload cancelled",
    //   description: "Your ID card upload has been cancelled.",
    // })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Upload ID Card</CardTitle>
          <CardDescription>Please upload the front and back of your national ID card.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="front-id">Front of ID Card</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {frontImage ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(frontImage)}
                      alt="Front of ID"
                      className="w-full h-48 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setFrontImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="front-id" className="flex flex-col items-center justify-center h-48 cursor-pointer">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Click to upload front side</span>
                    <Input
                      id="front-id"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'front')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="back-id">Back of ID Card</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {backImage ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(backImage)}
                      alt="Back of ID"
                      className="w-full h-48 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setBackImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="back-id" className="flex flex-col items-center justify-center h-48 cursor-pointer">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Click to upload back side</span>
                    <Input
                      id="back-id"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'back')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!frontImage || !backImage}>
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}