import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
const initialRequests = [
  {
    id: "REQ-001",
    title: "Cannot access email",
    description: "I am unable to log into my work email account.",
    status: "Open",
    priority: "High",
    date: "2024-03-15",
    user: "john.doe@example.com",
    category: "Software",
  },
  {
    id: "REQ-002",
    title: "Printer not working",
    description: "The office printer on the 2nd floor is not responding.",
    status: "In Progress",
    priority: "Medium",
    date: "2024-03-14",
    user: "jane.smith@example.com",
    category: "Hardware",
  },
  {
    id: "REQ-003",
    title: "Software installation request",
    description:
      "I need the latest version of Adobe Photoshop installed on my workstation.",
    status: "Closed",
    priority: "Low",
    date: "2024-03-13",
    user: "bob.johnson@example.com",
    category: "Software",
  },
  {
    id: "REQ-004",
    title: "Network connectivity issues",
    description:
      "Im experiencing frequent disconnections from the company network.",
    status: "Open",
    priority: "High",
    date: "2024-03-12",
    user: "alice.williams@example.com",
    category: "Network",
  },
  {
    id: "REQ-005",
    title: "Password reset",
    description: "I forgot my password and need it reset.",
    status: "Closed",
    priority: "Low",
    date: "2024-03-11",
    user: "charlie.brown@example.com",
    category: "Other",
  },
];

const SupportRequest = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");


  const handleCloseRequest = (id) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, status: "Closed" } : request
      )
    );
  };

  const filteredRequests = requests.filter(
    (request) =>
      (request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || request.status === statusFilter) &&
      (priorityFilter === "all" || request.priority === priorityFilter) &&
      (categoryFilter === "all" || request.category === categoryFilter)
  );
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
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Hardware">Hardware</SelectItem>
              <SelectItem value="Software">Software</SelectItem>
              <SelectItem value="Network">Network</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
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
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.title}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      request.status === "Open"
                        ? "default"
                        : request.status === "In Progress"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      request.priority === "High"
                        ? "destructive"
                        : request.priority === "Medium"
                        ? "warning"
                        : "default"
                    }
                  >
                    {request.priority}
                  </Badge>
                </TableCell>
                <TableCell>{request.category}</TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{request.title}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 space-y-2">
                        <p>
                          <strong>ID:</strong> {request.id}
                        </p>
                        <p>
                          <strong>Description:</strong> {request.description}
                        </p>
                        <p>
                          <strong>Status:</strong> {request.status}
                        </p>
                        <p>
                          <strong>Priority:</strong> {request.priority}
                        </p>
                        <p>
                          <strong>Category:</strong> {request.category}
                        </p>
                        <p>
                          <strong>Date:</strong> {request.date}
                        </p>
                        <p>
                          <strong>User:</strong> {request.user}
                        </p>
                        {request.image && (
                          <div>
                            <p>
                              <strong>Attached Image:</strong>
                            </p>
                            <img
                              src={request.image}
                              alt="Request"
                              className="mt-2 max-w-[100px] h-auto cursor-pointer"
                              onClick={() => setEnlargedImage(request.image)}
                            />
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <DialogClose asChild>
                          <Button variant="outline">Close</Button>
                        </DialogClose>
                        {request.status !== "Closed" && (
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
      </CardContent>
    </Card>
  );
};
export default SupportRequest;
