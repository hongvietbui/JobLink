'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Calendar, DollarSign, Briefcase, CheckCircle, XCircle, Users, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock agent for demonstration purposes
const agent = {
  ListJobAvaible: {
    Listjob: async (pageIndex, pageSize, sortBy, isDescending, filter) => {
      // Simulating API call
      return {
        items: [
          {
            id: 1,
            name: 'Software Engineer',
            company: 'Tech Corp',
            description: 'Developing cutting-edge software solutions',
            address: 'San Francisco, CA',
            price: 120000,
            duration: '2023-07-01',
            status: 'WAITING_FOR_APPLICANTS',
            type: 'Full-time'
          },
          {
            id: 2,
            name: 'Data Analyst',
            company: 'Data Insights Inc',
            description: 'Analyzing complex datasets to derive insights',
            address: 'New York, NY',
            price: 90000,
            duration: '2023-07-02',
            status: 'CLOSED',
            type: 'Part-time'
          }
        ],
        totalItems: 2
      }
    }
  }
}

function JobList({ isCreatedJobs }) {
  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [isDescending, setIsDescending] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(6)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true)
        const response = await agent.ListJobAvaible.Listjob(
          pageIndex,
          pageSize,
          sortBy,
          isDescending,
          filter
        )

        if (response && response.items) {
          setJobs(response.items)
          setTotalPages(Math.ceil(response.totalItems / pageSize))
        } else {
          setJobs([])
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error.message)
        setJobs([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [pageIndex, pageSize, sortBy, isDescending, filter])

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setPageIndex(pageNumber)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isCreatedJobs ? 'Jobs Created by You' : 'Jobs Applied by You'}
          </CardTitle>
          <CardDescription>
            {isCreatedJobs ? 'Manage your job listings' : 'Track your job applications'}
          </CardDescription>
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
                  {isCreatedJobs ? (
                    <Button>
                      <Users className="w-4 h-4 mr-2" />
                      View Applicants
                    </Button>
                  ) : (
                    <Button>
                      <Info className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                  )}
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
  )
}

export default function JobDashboard() {
  return (
    <Tabs defaultValue="created" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="created">Jobs Created by You</TabsTrigger>
        <TabsTrigger value="applied">Jobs Applied by You</TabsTrigger>
      </TabsList>
      <TabsContent value="created">
        <JobList isCreatedJobs={true} />
      </TabsContent>
      <TabsContent value="applied">
        <JobList isCreatedJobs={false} />
      </TabsContent>
    </Tabs>
  )
}