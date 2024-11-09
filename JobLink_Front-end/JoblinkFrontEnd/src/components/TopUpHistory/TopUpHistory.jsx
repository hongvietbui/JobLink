import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, subDays } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import agent from "@/lib/axios";

const paymentStatusMap = {
    0: "Pending",
    1: "Done",
    2: "Failed",
};

const paymentTypeMap = {
    0: "Deposit",
    1: "Withdraw",
};

const ITEMS_PER_PAGE = 10;

export default function TransactionHistory() {
    const [toDate, setToDate] = useState(new Date());
    const [fromDate, setFromDate] = useState(subDays(new Date(), 7));
    const [allTransactions, setAllTransactions] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);

    const fetchTransaction = async () => {
        setLoading(true);
        try {
            const response = await agent.TopUpHistory.TopUp(fromDate, toDate);
            console.log("Api Response:", response);

            const data = response.map((transaction) => ({
                id: transaction.id,
                date: transaction.transactionDate,
                status: paymentStatusMap[transaction.status] || "Unknown",
                paymentType: paymentTypeMap[transaction.paymentType] || "Unknown",
                amount: transaction.amount,
            }));

            setAllTransactions(data);
            setPageIndex(1);
        } catch (error) {
            console.error("Fetch transaction failed!", error);
        } finally {
            setLoading(false);
        }
    };

    const applyFiltersAndPagination = () => {
        const filteredTransactions = allTransactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return (
                (!fromDate || transactionDate >= fromDate) &&
                (!toDate || transactionDate <= toDate)
            );
        });

        const start = (pageIndex - 1) * ITEMS_PER_PAGE;
        setTransactions(filteredTransactions.slice(start, start + ITEMS_PER_PAGE));
    };

    useEffect(() => {
        fetchTransaction();
    }, [fromDate, toDate]);

    useEffect(() => {
        applyFiltersAndPagination();
    }, [allTransactions, fromDate, toDate, pageIndex]);

    const handlePageChange = (newPageIndex) => {
        if (newPageIndex >= 1) {
            setPageIndex(newPageIndex);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-6xl mx-auto">
                <CardHeader className="bg-white shadow">
                    <CardTitle className="text-3xl font-bold text-gray-800">Transaction History</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="space-y-2">
                            <Label htmlFor="fromDate" className="text-sm font-medium text-gray-700">From Date</Label>
                            <DatePicker
                                id="fromDate"
                                selected={fromDate}
                                onChange={(date) => setFromDate(date)}
                                maxDate={new Date()}
                                placeholderText="Select From Date"
                                className="w-full p-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                customInput={
                                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-white hover:bg-gray-50">
                                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                                        {fromDate ? format(fromDate, "MM/dd/yyyy") : "Select From Date"}
                                    </Button>
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="toDate" className="text-sm font-medium text-gray-700">To Date</Label>
                            <DatePicker
                                id="toDate"
                                selected={toDate}
                                onChange={(date) => setToDate(date)}
                                maxDate={new Date()}
                                minDate={fromDate}
                                placeholderText="Select To Date"
                                className="w-full p-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                customInput={
                                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-white hover:bg-gray-50">
                                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                                        {toDate ? format(toDate, "MM/dd/yyyy") : "Select To Date"}
                                    </Button>
                                }
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                onClick={() => { setPageIndex(1); fetchTransaction(); }}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
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
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <Table>
                            <TableCaption>A list of your recent transactions.</TableCaption>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="w-1/4 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</TableHead>
                                    <TableHead className="w-1/4 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</TableHead>
                                    <TableHead className="w-1/4 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</TableHead>
                                    <TableHead className="w-1/4 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan="4" className="text-center py-4 text-gray-500">
                                            NO TRANSACTION FOUND.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((transaction) => (
                                        <TableRow key={transaction.id} className="hover:bg-gray-50">
                                            <TableCell className="py-4 px-6 text-sm font-medium text-gray-900">{format(new Date(transaction.date), "MM/dd/yyyy HH:mm")}</TableCell>
                                            <TableCell className="py-4 px-6 text-sm text-gray-500">{transaction.amount.toFixed(2)} VND</TableCell>
                                            <TableCell className="py-4 px-6 text-sm text-gray-500">{transaction.paymentType}</TableCell>
                                            <TableCell className="py-4 px-6 text-sm">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-xs font-semibold",
                                                    {
                                                        "bg-yellow-100 text-yellow-800": transaction.status === "Pending",
                                                        "bg-green-100 text-green-800": transaction.status === "Done",
                                                        "bg-red-100 text-red-800": transaction.status === "Failed",
                                                    }
                                                )}>
                                                    {transaction.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange(pageIndex - 1)}
                                        className={cn(
                                            "px-3 py-2 rounded-md text-sm font-medium",
                                            pageIndex === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"
                                        )}
                                    />
                                </PaginationItem>
                                {[...Array(Math.ceil(allTransactions.filter(transaction => {
                                    const transactionDate = new Date(transaction.date);
                                    return (
                                        (!fromDate || transactionDate >= fromDate) &&
                                        (!toDate || transactionDate <= toDate)
                                    );
                                }).length / ITEMS_PER_PAGE))].map((_, index) => (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            onClick={() => handlePageChange(index + 1)}
                                            className={cn(
                                                "px-3 py-2 rounded-md text-sm font-medium",
                                                pageIndex === index + 1
                                                    ? "bg-primary text-white"
                                                    : "text-gray-700 hover:bg-gray-50"
                                            )}
                                        >
                                            {index + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange(pageIndex + 1)}
                                        className={cn(
                                            "px-3 py-2 rounded-md text-sm font-medium",
                                            pageIndex >= Math.ceil(allTransactions.filter(transaction => {
                                                const transactionDate = new Date(transaction.date);
                                                return (
                                                    (!fromDate || transactionDate >= fromDate) &&
                                                    (!toDate || transactionDate <= toDate)
                                                );
                                            }).length / ITEMS_PER_PAGE)
                                                ? "text-gray-300 cursor-not-allowed"
                                                : "text-gray-700 hover:bg-gray-50"
                                        )}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}