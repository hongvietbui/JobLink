import { useState, useEffect } from 'react';
import agent from '../../lib/axios' 
import { Search, MapPin, Calendar, DollarSign, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('postedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await agent.Job.Listjob(currentPage, jobsPerPage, sortBy, sortOrder === 'desc', filter);
        console.log('API response:', response); 
        if (response && response.items) {
          setJobs(response.items);  
        } else {
          console.error('Unexpected response structure:', response);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error.message);
      }
    };
  
    fetchJobs();
  }, [currentPage, jobsPerPage, sortBy, sortOrder, filter]);
  
  

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                <SelectItem value="postedDate">Posted Date</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="name">Job Title</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentJobs.map((job) => (
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
            <span className="text-sm">{job.salary ? `$${job.salary.toLocaleString()} per year` : 'Salary not provided'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm">Posted on {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Date not available'}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm">{job.ownerId ? `Owner ID: ${job.ownerId}` : 'Owner not specified'}</span>
          </div>
          <div className="flex items-center">
            {job.status === 'APPROVED' ? (
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
      <div className="flex justify-center mt-6">
        <ul className="inline-flex items-center -space-x-px">
          {Array.from({ length: Math.ceil(jobs.length / jobsPerPage) }, (_, i) => i + 1).map((number) => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${
                  number === currentPage ? 'bg-gray-200' : ''
                }`}
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
