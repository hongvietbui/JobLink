import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Users,
  Info,
  Check,
  X,
  FileText,
  Mail,
  Phone,
  MessageCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import agent from "../../lib/axios";
import { useNavigate } from "react-router-dom";

async function fetchJobs({
  isCreatedJobs,
  pageIndex,
  pageSize,
  sortBy,
  isDescending,
  filter,
}) {
  const response = isCreatedJobs
    ? await agent.ListJobUserCreated.JobUserCreated(
        pageIndex,
        pageSize,
        sortBy,
        isDescending
      )
    : await agent.ListJobUserApplied.JobUserApplied(
        pageIndex,
        pageSize,
        sortBy,
        isDescending
      );

  return response;
}

// Fetch job details for "Jobs Applied by You"
const fetchJobOwnerDetail = async (jobId) => {
  try {
    const response = await agent.JobandOwnerViewDetail.getJobOwner(jobId);
    return response;
  } catch (error) {
    console.error("Error fetching job details:", error);
    toast.error("Failed to load job details.");
  }
};

// Component for displaying detailed job and owner information
function JobDetail({ jobId }) {
  const [jobDetail, setJobDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadJobDetail = async () => {
      setIsLoading(true);
      const detail = await fetchJobOwnerDetail(jobId);
      setJobDetail(detail);
      setIsLoading(false);
    };
    loadJobDetail();
  }, [jobId]);

  if (isLoading) return <p>Loading job details...</p>;
  if (!jobDetail) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <img
          src={jobDetail.avatar}
          alt={`${jobDetail.firstName} ${jobDetail.lastName}`}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {jobDetail.jobName}
          </h3>
          <p className="text-sm text-muted-foreground">
            Posted by: {jobDetail.firstName} {jobDetail.lastName}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-600">{jobDetail.description}</p>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm">{jobDetail.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm">{jobDetail.phoneNumber}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm">
            Lat: {jobDetail.lat}, Lon: {jobDetail.lon}
          </span>
        </div>
      </div>
    </div>
  );
}

function ApplicantsList({ jobId, onAccept }) {
  const [noApplicants, setNoApplicants] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadApplicants = async () => {
      try {
        setIsLoading(true);
        const response = await agent.AppliedWorker.AppliedWorker(jobId);
        if (response == null) {
          setNoApplicants(true);
        } else {
          setApplicants(response);
        }
      } catch (error) {
        console.error("Failed to load applicants:", error.message);
        setApplicants([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplicants();
  }, [jobId]);

  const handleAccept = async (workerId) => {
    setActionLoading(workerId);
    try {
      const data = { status: "accepted" };
      await agent.acceptWorker.accept(jobId, workerId, data);
      toast.success("Applicant accepted successfully!");

      // Trigger the onAccept callback to hide the job
      onAccept(jobId);
    } catch (error) {
      console.error(
        `Failed to accept applicant with workerId ${workerId}:`,
        error.message
      );
      toast.error("Failed to accept applicant.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (workerId) => {
    setActionLoading(workerId);
    try {
      const data = { status: "rejected" };
      await agent.RejectWorker.reject(jobId, workerId, data);
      toast.success("Applicant rejected successfully.");
      // Keep the applicant list visible if rejected
      setApplicants((prev) =>
        prev.filter((applicant) => applicant.workerId !== workerId)
      );
    } catch (error) {
      console.error(
        `Failed to reject applicant with workerId ${workerId}:`,
        error.message
      );
      toast.error("Failed to reject applicant.");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <p className="text-center text-muted-foreground">Loading applicants...</p>
    );
  }

  if (noApplicants) {
    return (
      <p className="text-center text-muted-foreground">
        No applicants found for this job.
      </p>
    );
  }

  // xử lí tạo chat
  const initiateChat = async (workerId) => {
    try {
      const response = await agent.Chat.getOrCreate(jobId, workerId);
      const conversationId = response.id;
      navigate(`/chat/${conversationId}`);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="space-y-4">
      {applicants.map((applicant) => (
        <div
          key={applicant.workerId}
          className="flex items-center justify-between p-6 bg-white rounded-lg shadow-sm border"
        >
          <div className="flex items-center space-x-4">
            {applicant.user.avatar ? (
              <img
                src={applicant.user.avatar}
                alt={`${applicant.user.firstName} ${applicant.user.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600">
                {applicant.user.firstName?.[0]}
                {applicant.user.lastName?.[0]}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{`${applicant.user.firstName} ${applicant.user.lastName}`}</h3>
            </div>
          </div>
          <div className="space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              onClick={() => initiateChat(applicant.workerId)}
              disabled={actionLoading === applicant.workerId}
            >
              {actionLoading === applicant.workerId ? (
                "Processing..."
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" /> Chat
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              onClick={() => handleAccept(applicant.workerId)}
              disabled={actionLoading === applicant.workerId}
            >
              {actionLoading === applicant.workerId ? (
                "Processing..."
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" /> Accept
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              onClick={() => handleReject(applicant.workerId)}
              disabled={actionLoading === applicant.workerId}
            >
              {actionLoading === applicant.workerId ? (
                "Processing..."
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" /> Reject
                </>
              )}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                  onClick={() => setSelectedApplicant(applicant)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-primary">
                    Applicant Details
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Detailed information about the applicant.
                  </DialogDescription>
                </DialogHeader>
                {selectedApplicant && (
                  <ApplicantDetails applicant={selectedApplicant} />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}
    </div>
  );
}

function JobList({ isCreatedJobs }) {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isDescending, setIsDescending] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        const response = await fetchJobs({
          isCreatedJobs,
          pageIndex,
          pageSize,
          sortBy,
          isDescending,
          filter,
        });

        if (response && response.items) {
          setJobs(response.items);
          setTotalPages(response.totalPages || 1);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error.message);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, [pageIndex, pageSize, sortBy, isDescending, filter, isCreatedJobs]);

  const handleJobAccept = (jobId) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setPageIndex(pageNumber);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Card className="mb-8 shadow-lg">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-2xl font-bold text-primary">
            {isCreatedJobs ? "Jobs Created by You" : "Jobs Applied by You"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isCreatedJobs
              ? "Manage your job listings"
              : "Track your job applications"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search jobs..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Select onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Name">Name</SelectItem>
                <SelectItem value="Price">Salary</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => setIsDescending(value === "true")}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ascending</SelectItem>
                <SelectItem value="false">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-xl text-muted-foreground">No jobs available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-xl font-semibold text-primary">
                  {job.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {job.company || "Company not specified"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <p className="text-sm text-gray-600 mb-4">{job.description}</p>
                <Separator className="my-4" />
                <div className="flex flex-col gap-3">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {job.address || "Address not specified"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {job.price
                        ? `$${job.price.toLocaleString()} per year`
                        : "Salary not provided"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Posted on{" "}
                      {job.duration
                        ? new Date(job.duration).toLocaleDateString()
                        : "Date not available"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {job.status === "WAITING_FOR_APPLICANTS" ? (
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 mr-2 text-yellow-500" />
                    )}
                    <span className="text-sm">{job.status}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4">
                <div className="flex justify-between items-center w-full">
                  <Badge
                    variant={
                      job.type === "Full-time"
                        ? "default"
                        : job.type === "Part-time"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {job.type || "Type not specified"}
                  </Badge>
                  {isCreatedJobs ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Users className="w-4 h-4 mr-2" />
                          View Applicants
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[800px] w-11/12 max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader className="pb-4 border-b">
                          <DialogTitle className="text-2xl font-bold text-primary">
                            Applicants for {job.name}
                          </DialogTitle>
                          <DialogDescription className="text-lg text-muted-foreground">
                            Review and manage applicants for this job posting.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex-grow overflow-y-auto py-4">
                          <ApplicantsList
                            jobId={job.id}
                            onAccept={handleJobAccept}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedJobId(job.id)}
                          >
                            <Info className="w-4 h-4 mr-2" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-primary">
                              Job Details
                            </DialogTitle>
                          </DialogHeader>
                          {selectedJobId && <JobDetail jobId={selectedJobId} />}
                        </DialogContent>
                      </Dialog>
                    
                    </>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <ul className="inline-flex items-center -space-x-px rounded-md bg-white shadow-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`px-4 py-2 text-sm font-medium ${
                  number === pageIndex
                    ? "text-primary-foreground bg-primary"
                    : "text-gray-500 bg-white hover:bg-gray-50"
                } border border-gray-300 first:rounded-l-md last:rounded-r-md focus:z-20 focus:outline-offset-0`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function JobDashboard() {
  return (
    <div>
      <ToastContainer autoClose={3000} position="top-right" theme="light" />

      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="created" className="text-lg py-3">
            Jobs Created by You
          </TabsTrigger>
          <TabsTrigger value="applied" className="text-lg py-3">
            Jobs Applied by You
          </TabsTrigger>
        </TabsList>
        <TabsContent value="created">
          <JobList isCreatedJobs={true} />
        </TabsContent>
        <TabsContent value="applied">
          <JobList isCreatedJobs={false} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
                                