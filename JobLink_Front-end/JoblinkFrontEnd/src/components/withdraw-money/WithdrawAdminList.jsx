import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { QrCode } from 'lucide-react'
const withdrawalRequests = [
    { id: 1, user: 'John Doe', amount: 1000, status: 'pending' },
    { id: 2, user: 'Jane Smith', amount: 1500, status: 'completed' },
    { id: 3, user: 'Bob Johnson', amount: 750, status: 'pending' },
  ]
  
  export default function WithdrawAdminList() {
    const [filter, setFilter] = useState('pending')
    const [selectedRequest, setSelectedRequest] = useState(null)
  
    const filteredRequests = withdrawalRequests.filter(
      request => filter === 'all' || request.status === filter
    )
  
    return (
      <Card className="mx-[10%]">
        <CardHeader>
          <CardTitle>Danh sách rút tiền</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.user}</TableCell>
                  <TableCell>${request.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      request.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                    }`}>
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:w-[425px] md:w-[1000px]">
                        <DialogHeader>
                          <DialogTitle>Payment Details</DialogTitle>
                        </DialogHeader>
                        {selectedRequest && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p><strong>User:</strong> {selectedRequest.user}</p>
                              <p><strong>Amount:</strong> ${selectedRequest.amount}</p>
                              <p><strong>Status:</strong> {selectedRequest.status}</p>
                              <p><strong>Bank:</strong> Example Bank</p>
                              <p><strong>Account:</strong> **** **** **** 1234</p>
                            </div>
                            <div className="flex items-center justify-center">
                              <QrCode size={120} />
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }