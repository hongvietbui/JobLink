import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  UserIcon,
  PaperclipIcon,
} from "lucide-react";

import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import agent from "@/lib/axios";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";

// Enum mappings in JavaScript
const SupportRequestStatus = {
  0: "Open",
  1: "Closed",
};

const SupportPriority = {
  0: "High",
  1: "Medium",
  2: "Low",
};

const SupportCategory = {
  0: "UI/UX Error",
  1: "Functional Error",
  2: "Security Issue",
  3: "Performance Issue",
  4: "Job Error",
  5: "Payment Error",
  6: "Improvement Suggestion",
  7: "Other",
};

const SupportRequest = () => {
  const [requests, setRequests] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const handleImageClick = () => {
    setIsImageZoomed(true);
  };
  useEffect(() => {
    fetchRequests();
  }, [
    currentPage,
    rowsPerPage,
    searchTerm,
    statusFilter,
    priorityFilter,
    categoryFilter,
  ]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (event) => {
    console.log(event);
    setRowsPerPage(parseInt(event, 10));
    setCurrentPage(1); // Quay lại trang đầu khi thay đổi số dòng trên mỗi trang
  };

  const fetchRequests = async () => {
    try {
      const response = await agent.SupportRequest.listAllRequest({
        pageNumber: currentPage,
        pageSize: rowsPerPage,
        searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
      });
      setRequests(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };
  const handleCloseRequest = async (id) => {
    // setRequests(
    //   requests.map((request) =>
    //     request.id === id
    //       ? { ...request, status: SupportRequestStatus.Closed }
    //       : request
    //   )
    // );

    try {
      await agent.SupportRequest.updateRequestStatus(id);
      toast.success("Close request ticket successfully!");
      setIsOpen(false);
    } catch (e) {
      console.log(e);
      toast.error("Create new request ticket failed!");
    }
  };

  // const filteredRequests = requests.filter(
  //   (request) =>
  //     (request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       request.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
  //     (statusFilter === "all" || request.status === statusFilter) &&
  //     (priorityFilter === "all" || request.priority === priorityFilter) &&
  //     (categoryFilter === "all" || request.category === categoryFilter)
  //);

  if (!requests) {
    return <></>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Existing Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search requests"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(SupportRequestStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {Object.values(SupportPriority).map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.values(SupportCategory).map((category, index) => (
                <SelectItem key={index} value={index}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.title}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      request.status === SupportRequestStatus.Open
                        ? "default"
                        : request.status === SupportRequestStatus.InProgress
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {SupportRequestStatus[request.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      request.priority === SupportPriority.High
                        ? "destructive"
                        : request.priority === SupportPriority.Medium
                        ? "warning"
                        : "default"
                    }
                  >
                    {SupportPriority[request.priority]}
                  </Badge>
                </TableCell>
                <TableCell>{SupportCategory[request.category]}</TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          <h2 className="text-2xl font-bold mb-2">
                            {request.title}
                          </h2>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div>
                          <p className="text-muted-foreground">
                            {request.description}
                          </p>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardContent className="pt-6">
                              <div className="space-y-2">
                                <div className="ml-1">
                                  <Label>Status</Label>
                                </div>
                                <div>
                                  <Badge
                                    variant={
                                      request.status === 0
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {SupportRequestStatus[request.status]}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-6">
                              <div className="space-y-2">
                                <div>
                                  <Label>Priority</Label>
                                </div>
                                <div>
                                  <Badge
                                    variant={
                                      request.priority === 0
                                        ? "destructive"
                                        : request.priority === 1
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {SupportPriority[request.priority]}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-6">
                              <div className="space-y-2">
                                <Label>Category</Label>
                                <p>{SupportCategory[request.category]}</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-6">
                              <div className="space-y-2">
                                <Label>ID</Label>
                                <p>{request.id}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {new Date(request.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <UserIcon className="mr-2 h-4 w-4" />
                            {request.user.firstName} {request.user.lastName}
                          </div>
                        </div>
                        {request.attachment && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center">
                              <PaperclipIcon className="mr-2 h-5 w-5" />
                              Attachment
                            </h3>
                            <div className="relative w-full h-64 rounded-lg overflow-clip cursor-pointer">
                              <img
                                src={request.attachment}
                                alt="Attached image"
                                className="rounded-lg shadow-md w-full h-full object-cover"
                                onClick={handleImageClick}
                              />
                            </div>
                          </div>
                        )}

                        <Dialog
                          open={isImageZoomed}
                          onOpenChange={setIsImageZoomed}
                        >
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <img
                              src={request.attachment}
                              alt="Zoomed image"
                              className="w-full h-full object-contain rounded-lg cursor-pointer"
                            />
                            <div className="mt-4 flex justify-end">
                              <Button
                                variant="outline"
                                onClick={() => setIsImageZoomed(false)}
                              >
                                Close
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <DialogClose asChild>
                          <Button variant="outline">Close</Button>
                        </DialogClose>
                        {request.status !== SupportRequestStatus.Closed && (
                          <Button
                            onClick={() => handleCloseRequest(request.id)}
                          >
                            Close Request
                          </Button>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span>Rows per page:</span>
            <Select
              value={rowsPerPage}
              onValueChange={(e) => handleRowsPerPageChange(e)}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={10}>10</SelectItem>
                <SelectItem value={20}>20</SelectItem>
                <SelectItem value={50}>50</SelectItem>
              </SelectContent>
            </Select>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <div className="flex space-x-1">
              <Button
                onClick={() => handlePageChange(1)}
                variant="outline"
                size="icon"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                variant="outline"
                size="icon"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                variant="outline"
                size="icon"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => handlePageChange(totalPages)}
                variant="outline"
                size="icon"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default SupportRequest;
