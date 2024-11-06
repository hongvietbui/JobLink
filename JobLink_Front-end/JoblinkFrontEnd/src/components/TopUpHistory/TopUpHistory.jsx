import { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { format, subDays } from "date-fns"
import { Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import agent from "@/lib/axios"

const paymentStatusMap = {
    0: "Pending",
    1: "Done",
    2: "Failed"
}

const paymentTypeMap = {
    1: "Deposit",
    2: "Withdraw"
}

const ITEMS_PER_PAGE = 10

export default function TransactionHistory() {
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(new Date())
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(false)
    const [pageIndex, setPageIndex] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(false)

    const maxDate = new Date()
    const minFromDate = subDays(toDate || maxDate, 7)

    const fetchTransaction = async () => {
        setLoading(true)
        try {
            const response = await agent.TopUpHistory.TopUp(fromDate, toDate, pageIndex, ITEMS_PER_PAGE)
            const data = response.data.data

            const mappedTransactions = data.map((transaction) => ({
                id: transaction.transactionDate + transaction.amount,
                date: transaction.transactionDate,
                status: paymentStatusMap[transaction.status] || "Unknown",
                paymentType: paymentTypeMap[transaction.paymentType] || "Unknown",
                amount: transaction.amount
            }))

            setTransactions(mappedTransactions)
            setHasNextPage(data.length === ITEMS_PER_PAGE)
        } catch (error) {
            console.error("Fetch transaction failed!", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransaction()
    }, [fromDate, toDate, pageIndex])

    const handlePageChange = (newPageIndex) => {
        if (newPageIndex >= 1) {
            setPageIndex(newPageIndex)
        }
    }

    return (
        <Card className="w-full max-w-[1200px] mx-auto">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="fromDate">From Date</Label>
                            <DatePicker
                                id="fromDate"
                                selected={fromDate}
                                onChange={(date) => setFromDate(date)}
                                maxDate={subDays(toDate, 0)}
                                minDate={minFromDate}
                                placeholderText="Select From Date"
                                className="w-full p-2 border rounded"
                                customInput={
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {fromDate ? format(fromDate, "MM/dd/yyyy") : "Select From Date"}
                                    </Button>
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="toDate">To Date</Label>
                            <DatePicker
                                id="toDate"
                                selected={toDate}
                                onChange={(date) => setToDate(date)}
                                maxDate={maxDate}
                                minDate={fromDate}
                                placeholderText="Select To Date"
                                className="w-full p-2 border rounded"
                                customInput={
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {toDate ? format(toDate, "MM/dd/yyyy") : "Select To Date"}
                                    </Button>
                                }
                            />
                        </div>
                        <div className="flex items-end">
                            <Button 
                                onClick={() => { setPageIndex(1); fetchTransaction() }}
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Filtering...
                                    </>
                                ) : (
                                    "Filter Transactions"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableCaption>A list of your recent transactions.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Date & Time</TableHead>
                                <TableHead>Payment Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{format(new Date(transaction.date), "MM/dd/yyyy HH:mm")}</TableCell>
                                    <TableCell>{transaction.paymentType}</TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-xs font-medium",
                                            {
                                                "bg-yellow-100 text-yellow-800": transaction.status === "Pending",
                                                "bg-green-100 text-green-800": transaction.status === "Done",
                                                "bg-red-100 text-red-800": transaction.status === "Failed",
                                            }
                                        )}>
                                            {transaction.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(pageIndex - 1)}
                                    className={pageIndex === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                            {[...Array(Math.ceil(transactions.length / ITEMS_PER_PAGE))].map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        onClick={() => handlePageChange(index + 1)}
                                        isActive={pageIndex === index + 1}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(pageIndex + 1)}
                                    className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </CardContent>
        </Card>
    )
}