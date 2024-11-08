import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Plus, ImageIcon, Upload } from "lucide-react";
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
  0: "User Interface/User Experience (UI/UX) Error",
  1: "Functional Error",
  2: "Security Error",
  3: "Performance Error",
  4: "Job Error",
  5: "Payment Error",
  6: "Improvement Suggestions or Feedback",
  7: "Other Errors",
};

const AddSupportRequest = () => {
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const createSupportRequest = async () => {
    console.log(newRequest);
    const formData = new FormData();
    formData.append("title", newRequest.title);
    formData.append("description", newRequest.description);
    formData.append("priority", newRequest.priority);
    formData.append("category", newRequest.category);
    formData.append("Attachment", selectedImage);

    formData.append("JobId", "");
    console.log(formData);
    try {
      await agent.SupportRequest.createNewRequest(formData);
      toast.success("Create new request ticket successfully");
      setNewRequest({});
      setSelectedImage(null);
      setIsNewRequestOpen(false);
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error(error.data);
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
    } else {
      toast.error("You need to fill in all information");
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
      event.target.value = null;
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  className="col-span-3"
                  id="title"
                  placeholder="Brief description of the issue"
                  value={newRequest.title || ""}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  className="col-span-3"
                  id="description"
                  placeholder="Detailed description of the issue"
                  value={newRequest.description || ""}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="priority">
                  Priority
                </Label>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  className="mt-2"
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
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right" htmlFor="image">
                  Attach Image
                </Label>
                <div className="col-span-3 space-y-4">
                  <div className="flex gap-4 items-center">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <Label
                      htmlFor="image"
                      className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4"
                    >
                      <Upload className="h-4 w-4" />
                      Choose File
                    </Label>

                    {selectedImage && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedImage(null);
                        }}
                      >
                        Clear Image
                      </Button>
                    )}
                  </div>
                  {selectedImage ? (
                    <div className="relative w-32 h-32">
                      <Dialog>
                        <DialogTrigger asChild>
                          <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Selected"
                            className="mt-2 max-w-[100px] h-auto cursor-pointer"
                            onClick={(e) => {
                              setEnlargedImage(
                                URL.createObjectURL(selectedImage)
                              );
                            }}
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                          <img
                            src={enlargedImage}
                            alt="Enlarged"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                </div>
              </div>
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
