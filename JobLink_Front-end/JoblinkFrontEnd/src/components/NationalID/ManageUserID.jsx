import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import agent from "@/lib/axios";

const ITEMS_PER_PAGE = 5;

export default function IDCardManagement() {
  const [submissions, setSubmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const totalPages = Math.ceil(submissions.length / ITEMS_PER_PAGE);
  const paginatedSubmissions = submissions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Hàm lấy dữ liệu pending từ backend
  const fetchPendingIds = async () => {
    try {
      const response = await agent.NationalId.getPendingNationalIds();
      const data = Array.isArray(response) ? response : response.data;

      setSubmissions(
        data.map((submission) => ({
          userId: submission.userId,
          username: submission.username,
          frontImage: submission.nationalIdFrontUrl,
          backImage: submission.nationalIdBackUrl,
          status: submission.nationalIdStatus === 0 ? "Pending" : submission.nationalIdStatus === 1 ? "Approved" : "Rejected",
        }))
      );
    } catch (error) {
      console.error("Failed to fetch pending IDs:", error);
      toast({
        title: "Error",
        description: "Failed to load pending ID submissions.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPendingIds();
  }, []);

  const handleApprove = async (userId) => {
    if (!window.confirm("Are you sure you want to approve this ID?")) return;

    try {
      await agent.NationalId.approveNationalId(userId);
      toast({
        title: "ID Card Approved",
        description: `ID Card for user ${userId} has been approved.`,
      });
      await fetchPendingIds(); // Tải lại danh sách sau khi approve
    } catch (error) {
      console.error("Failed to approve ID:", error);
      toast({
        title: "Error",
        description: "Failed to approve ID. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm("Are you sure you want to reject this ID?")) return;

    try {
      await agent.NationalId.rejectNationalId(userId);
      toast({
        title: "ID Card Rejected",
        description: `ID Card for user ${userId} has been rejected.`,
        variant: "destructive",
      });
      await fetchPendingIds(); // Tải lại danh sách sau khi reject
    } catch (error) {
      console.error("Failed to reject ID:", error);
      toast({
        title: "Error",
        description: "Failed to reject ID. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">ID Card Submissions Management</CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="text-center text-gray-500 font-semibold">NO Pending ID</p>
          ) : (
            <div className="space-y-6">
              {paginatedSubmissions.map((submission) => (
                <Card key={submission.userId}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-lg">Username: {submission.username}</p>
                        <p className="text-sm">
                          Status:{" "}
                          <span
                            className={`font-semibold ${
                              submission.status === "Approved"
                                ? "text-green-600"
                                : submission.status === "Rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {submission.status}
                          </span>
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Front</p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="relative cursor-pointer group">
                                <img src={submission.frontImage} alt="ID Front" className="w-full h-64 object-cover rounded" />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ZoomIn className="text-white" size={24} />
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Front of ID Card</DialogTitle>
                                <DialogDescription>Username: {submission.username}</DialogDescription>
                              </DialogHeader>
                              <img src={submission.frontImage} alt="ID Front" className="w-full object-contain max-h-[80vh]" />
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Back</p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="relative cursor-pointer group">
                                <img src={submission.backImage} alt="ID Back" className="w-full h-64 object-cover rounded" />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ZoomIn className="text-white" size={24} />
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Back of ID Card</DialogTitle>
                                <DialogDescription>Username: {submission.username}</DialogDescription>
                              </DialogHeader>
                              <img src={submission.backImage} alt="ID Back" className="w-full object-contain max-h-[80vh]" />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <div className="flex justify-between mt-4">
                        <Button
                          onClick={() => handleApprove(submission.userId)}
                          className="w-[48%]"
                        >
                          <Check className="mr-2 h-4 w-4" /> Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(submission.userId)}
                          variant="destructive"
                          className="w-[48%]"
                        >
                          <X className="mr-2 h-4 w-4" /> Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {submissions.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => setCurrentPage(index + 1)}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
