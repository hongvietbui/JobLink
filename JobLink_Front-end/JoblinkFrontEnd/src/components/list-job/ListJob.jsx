import { useState, useEffect } from 'react';
import agent from '../../lib/axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from "react-router-dom";

export default function JobList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isDescending, setIsDescending] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [userOwnerId, setUserOwnerId] = useState(null); 

  useEffect(() => {
    const fetchUserData = async () => {
   
        const userResponse = await agent.User.me(); 
        const ownerResponse = await agent.owner.ownerid(userResponse.id); 
        setUserOwnerId(ownerResponse.id); 
    
    };
    fetchUserData();
  }, [navigate]);

  // Fetch available jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await agent.ListJobAvaible.Listjob(
          pageIndex,
          pageSize,
          sortBy,
          isDescending,
          filter
        );

        if (response && response.items) {
          setJobs(response.items);
          setTotalPages(Math.ceil(response.totalItems / pageSize));
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error.message);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [pageIndex, pageSize, sortBy, isDescending, filter]);

  const handleApply = async (job) => {
    // Prevent the job owner from applying to their own job
    if (userOwnerId === job.ownerId) {
      toast.warning("You can't apply to a job you created.");
      return;
    }
  
    try {
      // Attempt to apply for the job
      const response = await agent.WorkerAssign.assign(job.id, {});
      // If successful
      toast.success("Job assigned successfully!");
    } catch (error) {
      console.log("Full Error Object:", error);     
  
      const status = error.data?.status;
      const message = error.data?.message;
  
      // Check if we received a 400 status and specific messages
      if (status === 400) {
        if (message === "Job owner cannot assign job.") {
          toast.warning("You cannot apply to a job you created!");
        } else if (message === "An error occurred while saving the entity changes. See the inner exception for details.") {
          toast.warning("You have already applied to this job!");
        }
      } else if (status === 401) {
        toast.warning("You are not authorized. Redirecting to login...");
        navigate('/Login');
      } else {
        // Network or unknown error
        toast.error("Failed to apply for the job. Please check your connection.");
      }
    }
  };
  
  
  
  
  
  
  
  
  
  

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setPageIndex(pageNumber);
    }
  };

  return (
    <div>
      <ToastContainer autoClose={3000} position="top-right" theme="light" />
      
      <div className="container mx-auto py-10">
        {isLoading ? (
          <div className="text-center py-4">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-4">No jobs available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{job.name}</CardTitle>
                  <CardDescription>{job.company || 'Company not specified'}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-500 mb-4">{job.description}</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm">{job.address || 'Address not specified'}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm">{job.price ? `$${job.price.toLocaleString()} per year` : 'Salary not provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm">Posted on {job.duration ? new Date(job.duration).toLocaleDateString() : 'Date not available'}</span>
                    </div>
                    <div className="flex items-center">
                      {job.status === 'WAITING_FOR_APPLICANTS' ? (
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2 text-yellow-500" />
                      )}
                      <span className="text-sm">{job.status}</span>
                    </div>
                  </div>
                </CardContent>
                <CardContent className="pt-0 mt-auto">
                  <div className="flex justify-between items-center">
                    <Badge variant={job.type === 'Full-time' ? 'default' : job.type === 'Part-time' ? 'secondary' : 'outline'}>
                      {job.type || 'Type not specified'}
                    </Badge>
                    <Button onClick={() => handleApply(job)}>Apply Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <ul className="inline-flex items-center -space-x-px">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <li key={number}>
                <button
                  onClick={() => paginate(number)}
                  className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${number === pageIndex ? 'bg-gray-200' : ''}`}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
