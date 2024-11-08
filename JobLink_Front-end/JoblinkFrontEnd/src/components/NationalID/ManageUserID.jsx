import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Check, X } from "lucide-react"

// Mock data for ID card submissions
const mockSubmissions = [
  { id: 1, userId: "user1", frontImage: "/mock-front-1.jpg", backImage: "/mock-back-1.jpg", status: "pending" },
  { id: 2, userId: "user2", frontImage: "/mock-front-2.jpg", backImage: "/mock-back-2.jpg", status: "approved" },
  { id: 3, userId: "user3", frontImage: "/mock-front-3.jpg", backImage: "/mock-back-3.jpg", status: "rejected" },
  // Add more mock submissions as needed
]

export default function IDCardManagement() {
  const [submissions, setSubmissions] = useState(mockSubmissions)
  const [filter, setFilter] = useState("all")
  const { toast } = useToast()

  const filteredSubmissions = submissions.filter(sub => 
    filter === "all" ? true : sub.status === filter
  )

  const handleApprove = (id) => {
    setSubmissions(submissions.map(sub =>
      sub.id === id ? { ...sub, status: "approved" } : sub
    ))
    toast({
      title: "ID Card Approved",
      description: `ID Card for user ${id} has been approved.`,
    })
  }

  const handleReject = (id) => {
    setSubmissions(submissions.map(sub =>
      sub.id === id ? { ...sub, status: "rejected" } : sub
    ))
    toast({
      title: "ID Card Rejected",
      description: `ID Card for user ${id} has been rejected.`,
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">ID Card Submissions Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select onValueChange={setFilter} defaultValue={filter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Submissions</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubmissions.map((submission) => (
              <Card key={submission.id}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="font-semibold">User ID: {submission.userId}</p>
                    <p className="text-sm">Status: <span className={`font-semibold ${
                      submission.status === 'approved' ? 'text-green-600' :
                      submission.status === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>{submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}</span></p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium mb-1">Front</p>
                        <img src={submission.frontImage} alt="ID Front" className="w-full h-32 object-cover rounded" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Back</p>
                        <img src={submission.backImage} alt="ID Back" className="w-full h-32 object-cover rounded" />
                      </div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <Button
                        onClick={() => handleApprove(submission.id)}
                        disabled={submission.status === 'approved'}
                        className="w-[48%]"
                      >
                        <Check className="mr-2 h-4 w-4" /> Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(submission.id)}
                        disabled={submission.status === 'rejected'}
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
        </CardContent>
      </Card>
    </div>
  )
}