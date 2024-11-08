import React, { useEffect, useState } from "react";
import agent from "@/lib/axios";
import AssignButton from "../buttons/AssignButton";
import SmallUserProfile from "../user-profile/SmallUserProfile";
import JobDetails from "./JobDetails";
import { useParams } from "react-router-dom";
import { toast, useToast } from "@/hooks/use-toast";

function JobDetailsPage() {
  const { jobId } = useParams(); // Lấy jobId từ URL parameter
  const { toast } = useToast();

  // State để lưu thông tin job và người dùng
  const [jobDetails, setJobDetails] = useState(null);
  const [jobAndOwnerDetails, setJobAndOwnerDetails] = useState(null);
  const [jobRole, setJobRole] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Gọi API và ghi log response để kiểm tra
        const jobResponse = await agent.Job.getById(jobId);
        console.log("Job response:", jobResponse);

        const jobOwnerResponse = await agent.User.getUserByJobOwnerId(jobResponse.ownerId);
        console.log("Job Owner response:", jobOwnerResponse);

        const jobRoleResponse = await agent.Job.getUserRoleByJobId(jobId);
        console.log("Job Role response:", jobRoleResponse);

        // Cập nhật state với dữ liệu từ API
        setJobDetails({
          jobName: jobResponse.name,
          description: jobResponse.description,
          address: jobResponse.address,
          price: `${jobResponse.price} VND`,
          avatar: jobResponse.avatar,
          status: jobResponse.status,
        });

        setJobAndOwnerDetails({
          name: `${jobOwnerResponse.firstName} ${jobOwnerResponse.lastName}`,
          rating: jobOwnerResponse.rating || 5,  // Gán rating mặc định nếu không có
          picture: jobOwnerResponse.avatar,
          address: jobOwnerResponse.address,
          phoneNumber: jobOwnerResponse.phoneNumber,
        });
      } catch (error) {
        toast({
          title: "Failed to load job details",
          description: error.message,
          status: "error",
        });
      }
    };

  fetchJobDetails();
  }, [jobId, toast]);

  // Kiểm tra nếu dữ liệu chưa tải xong thì hiển thị loading
  if (!jobDetails || !jobAndOwnerDetails) {
    console.log("Loading...");
    return <div>Loading...</div>;
  }

  console.log("Job Details:", jobDetails);
  console.log("Job Owner Details:", jobAndOwnerDetails);

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
        <img 
          src={jobDetails.avatar} 
          alt="Job Avatar" 
          className="rounded-lg max-w-full h-auto max-h-64 object-cover" 
        />
      </div>

      <div className="flex space-x-6">
        <div className="flex-1">
          <JobDetails
            jobName={jobDetails.jobName}
            description={jobDetails.description}
            address={jobDetails.address}
            price={jobDetails.price}
          />
        </div>
        <div className="flex-1 space-y-4">
          <SmallUserProfile
            name={jobAndOwnerDetails.name}
            rating={jobAndOwnerDetails.rating}
            picture={jobAndOwnerDetails.picture || "https://via.placeholder.com/150"}
            address={jobAndOwnerDetails.address}
            phoneNumber={jobAndOwnerDetails.phoneNumber}
          />
          <AssignButton jobId={jobId} />
        </div>
      </div>
    </div>
  );
}

export default JobDetailsPage;