import { useState, useEffect } from 'react';
import agent from '../../lib/axios';
import { Search, MapPin, Calendar, DollarSign, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isDescending, setIsDescending] = useState(false); 
  const [pageIndex, setPageIndex] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(6);
  const [isLoading, setIsLoading] = useState(false); 

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

        console.log("Parameters sent to API:", { pageIndex, pageSize, sortBy, isDescending, filter });
        console.log('Full API response:', response);

        if (response && response.items) {
          console.log("Jobs in response:", response.items);
          setJobs(response.items); 
          setTotalPages(Math.ceil(response.totalItems / pageSize));
          console.log("Updated jobs state:", jobs); 
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

  const indexOfLastJob = pageIndex * pageSize;
  const indexOfFirstJob = indexOfLastJob - pageSize;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => {
    console.log('Paginate function triggered with pageNumber:', pageNumber);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setPageIndex(pageNumber); // Ensure we only paginate within available pages
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Job Listings</CardTitle>
          <CardDescription>Find your next career opportunity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Search jobs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-grow"
            />
            <Select onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Name">Name</SelectItem>
                <SelectItem value="Price">Salary</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setIsDescending(value === 'true')}>
              <SelectTrigger className="w-[180px]">
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
                  <Button>Apply Now</Button>
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
  );
}
