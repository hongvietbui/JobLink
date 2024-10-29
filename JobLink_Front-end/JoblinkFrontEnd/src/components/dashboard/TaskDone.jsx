import {
  MoreHorizontal,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import agent from "@//lib/axios";

const statusIcons = {
  Todo: <AlertCircle className="h-4 w-4 text-gray-500" />,
  "In Progress": <Clock className="h-4 w-4 text-blue-500" />,
  Done: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  Canceled: <XCircle className="h-4 w-4 text-red-500" />,
  Backlog: <AlertCircle className="h-4 w-4 text-yellow-500" />,
};

const priorityIcons = {
  Low: <ArrowDown className="h-4 w-4 text-blue-500" />,
  Medium: <ArrowRight className="h-4 w-4 text-yellow-500" />,
  High: <ArrowUp className="h-4 w-4 text-red-500" />,
};

const TaskStatus = {
  'pending-approval': "Pending-approval",
  'approved': "Approved",
  'rejected': "Rejected",
  'expired': "Expired",
  'deleted': "Deleted",
  'completed': "Completed",
  'in-progress': "In progress",
};
export default function TaskDone() {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [owner, setOwner] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const handleFilterClick = () => {
    fetchTasks(currentPage);
  };

  const fetchTasks = (page) => {
    const params = {
      search: searchTerm,
      status: status,
      isOwner: owner === "all" ? "" : owner === "owner",
      pageNumber: page,
      pageSize: rowsPerPage,
    };

    agent.Job.getListJobDoneDashboard(params)
      .then((response) => {
        setTasks(response.items);
        setTotalPages(response.totalPages); // Tổng số trang từ API
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };

  // Gọi API khi currentPage hoặc rowsPerPage thay đổi
  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage, rowsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (event) => {
    console.log(event)
    setRowsPerPage(parseInt(event, 10));
    setCurrentPage(1); // Quay lại trang đầu khi thay đổi số dòng trên mỗi trang
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Filter tasks..."
          className="w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex space-x-2">
          <Select value={status} onValueChange={(e) => setStatus(e)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending-approval">Pending approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In progress</SelectItem>
            </SelectContent>
          </Select>

          <Select value={owner} onValueChange={(e) => setOwner(e)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="worker">Worker</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleFilterClick()}>Filter</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{task.name}</div>
                  <Badge variant="outline" className="mr-2">
                    {task.description}
                  </Badge>
                  {task.title}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {TaskStatus[task.status]}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {priorityIcons[task.price]}
                  <span className="ml-2">{task.price}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {task.address}
                </div>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <Select value={rowsPerPage} onValueChange={(e) => handleRowsPerPageChange(e)}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={10}>10</SelectItem>
              <SelectItem value={20}>20</SelectItem>
              <SelectItem value={50}>50</SelectItem>
            </SelectContent>
          </Select>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <div className="flex space-x-1">
            <Button
              onClick={() => handlePageChange(1)}
              variant="outline"
              size="icon"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              variant="outline"
              size="icon"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              variant="outline"
              size="icon"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handlePageChange(totalPages)}
              variant="outline"
              size="icon"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
