import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import agent from "@/lib/axios";

function AssignJobButton({ jobId }) {
  const [jobResponse, setJobResponse] = useState(null);
  const [jobRoleResponse, setJobRoleResponse] = useState(null);

  useEffect(() => {
    // Hàm lấy dữ liệu công việc và vai trò của người dùng
    const fetchData = async () => {
      try {
        const jobResponseData = await agent.Job.getById(jobId);
        const jobRoleResponseData = await agent.Job.getUserRoleByJobId(jobId);

        setJobResponse(jobResponseData);
        setJobRoleResponse(jobRoleResponseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [jobId]);

  const handleAssign = (jobId) => {
    agent.Job.assignJob(jobId)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error assigning job:", error);
      });
  };

  const handleViewApplicants = () => {
    console.log("Handle view applicants");
  };

  const handleChatWithOwner = () => {
    console.log("Handle chat with owner");
  };

  // Hiển thị nút khác nhau dựa trên vai trò và trạng thái công việc
  if (jobRoleResponse === "Job Owner" && jobResponse?.status === "WAITING_FOR_APPLICANTS") {
    return (
      <Button onClick={handleViewApplicants} className="w-full mt-4 px-6 py-2 text-white font-semibold rounded-md">
        View Applicants
      </Button>
    );
  }

  if (jobRoleResponse === "Worker" && jobResponse?.status === "WAITING_FOR_APPLICANTS") {
    return (
      <Button onClick={handleChatWithOwner} className="w-full mt-4 px-6 py-2 text-white font-semibold rounded-md">
        Chat With Owner
      </Button>
    );
  }

  if(jobResponse?.status === "Complete") {
    return (
      <Button disabled className="w-full mt-4 px-6 py-2 text-white font-semibold rounded-md">
        This job is completed
      </Button>
    );
  }

  // Nút Assign Job mặc định
  return (
    <Button onClick={() => handleAssign(jobId)} className="w-full mt-4 px-6 py-2 text-white font-semibold rounded-md">
      Assign Job
    </Button>
  );
}

export default AssignJobButton;
