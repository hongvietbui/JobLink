import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Plus, X } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { Label } from "../ui/label";
import agent from "@/lib/axios";
import { toast } from "react-toastify";

const SupportCategory = {
  0: "Lỗi giao diện người dùng (UI/UX)",
  1: "Lỗi chức năng",
  2: "Lỗi về bảo mật",
  3: "Lỗi về hiệu suất",
  4: "Lỗi job",
  5: "Lỗi thanh toán",
  6: "Đề xuất cải tiến hoặc góp ý",
  7: "Lỗi khác",
};

const AddSupportRequest = () => {
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const createSupportRequest = async () => {
    console.log(newRequest)
    const formData = new FormData();
    formData.append("title", newRequest.title);
    formData.append("description", newRequest.description);
    formData.append("priority", newRequest.priority);
    formData.append("category", newRequest.category);
    formData.append("Attachment", selectedImage);

    formData.append("JobId", '');
    console.log(formData);
    try {
      await agent.SupportRequest.createNewRequest(formData);
      toast.success("Create new request ticket successfully");
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error("Create new request ticket failed!");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      newRequest.title &&
      newRequest.description &&
      newRequest.priority &&
      newRequest.category
    ) {
      //   const newId = `REQ-${(requests.length + 1).toString().padStart(3, '0')}`
      //   const createdRequest = {
      //     ...newRequest ,
      //     id: newId,
      //     status: 'Open',
      //     date: new Date().toISOString().split('T')[0],
      //     user: 'current.user@example.com', // This should be the logged-in user
      //     image: selectedImage ? URL.createObjectURL(selectedImage) : undefined
      //   }
      createSupportRequest();
      setNewRequest({});
      setSelectedImage(null);
      setIsNewRequestOpen(false);
    }
  };

  const handleCloseRequest = (id) => {
    // setRequests(requests.map(request =>
    //   request.id === id ? { ...request, status: 'Closed' } : request
    // ))
  };

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  return (
    <>
      <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-4 right-4 rounded-full" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Submit New Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={newRequest.title || ""}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the issue"
                value={newRequest.description || ""}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                onValueChange={(value) =>
                  setNewRequest({ ...newRequest, priority: value })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Low</SelectItem>
                  <SelectItem value="1">Medium</SelectItem>
                  <SelectItem value="0">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) =>
                  setNewRequest({ ...newRequest, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SupportCategory).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="image">Attach Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <div>
              {selectedImage && (
                <div>
                  <p>Selected Image Preview:</p>
                  {/* <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="mt-2 max-w-[100px] h-auto cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setEnlargedImage(URL.createObjectURL(selectedImage));
                  }}
                /> */}

                  <Dialog>
                    <DialogTrigger asChild>
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected"
                        className="mt-2 max-w-[100px] h-auto cursor-pointer"
                        onClick={(e) => {
                          setEnlargedImage(URL.createObjectURL(selectedImage));
                        }}
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]"
                        // onClick={() => setEnlargedImage(null)} // Đóng khi nhấp vào lớp phủ
                      >
                        <div className="relative z-[1000]">
                          {" "}
                          {/* Đảm bảo hình ảnh có z-index cao */}
                          <img
                            src={enlargedImage}
                            alt="Enlarged"
                            className="max-w-full max-h-[90vh] object-contain"
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewRequestOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddSupportRequest;
