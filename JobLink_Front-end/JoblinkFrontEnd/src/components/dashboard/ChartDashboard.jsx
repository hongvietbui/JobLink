import { addDays, format, subDays } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useEffect, useState } from "react";
import { cn } from "@//lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import axios from "axios";
import agent from "@//lib/axios";

const ChartDashBoard = () => {
  // const data = [
  //   { name: "10/11", value1: 4000, value2: 2400 },
  //   { name: "11/11", value1: 3000, value2: 1398 },
  //   { name: "12/11", value1: 2000, value2: 9800 },
  //   { name: "13/11", value1: 2780, value2: 3908 },
  //   { name: "14/11", value1: 1890, value2: 4800 },
  //   { name: "15/11", value1: 2390, value2: 3800 },
  //   { name: "16/11", value1: 3490, value2: 4300 },
  //   { name: "17/11", value1: 1890, value2: 4800 },
  //   { name: "18/11", value1: 2390, value2: 3800 },
  //   { name: "19/11", value1: 3490, value2: 4300 },
  //   { name: "20/11", value1: 4000, value2: 2400 },
  //   { name: "21/11", value1: 3000, value2: 1398 },
  //   { name: "22/11", value1: 2000, value2: 9800 },
  //   { name: "23/11", value1: 2780, value2: 3908 },
  //   { name: "24/11", value1: 1890, value2: 4800 },
  //   { name: "25/11", value1: 2390, value2: 3800 },
  //   { name: "26/11", value1: 3490, value2: 4300 },
  //   { name: "27/11", value1: 1890, value2: 4800 },
  //   { name: "28/11", value1: 2390, value2: 3800 },
  //   { name: "29/11", value1: 3490, value2: 4300 },
  //   { name: "30/11", value1: "4000", value2: 2400 },
  // ];
  const [date, setDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [data, setData] = useState();

  const handleFilter = async () => {
    const { from, to } = date;
    console.log(date);

    // Kiểm tra khoảng thời gian không vượt quá 30 ngày
    if (
      from &&
      to &&
      ((to - from) / (1000 * 60 * 60 * 24) > 30 ||
        from >= addDays(new Date(), 30))
    ) {
      alert("Khoảng thời gian không được vượt quá 30 ngày.");
      return;
    }

    // Nếu hợp lệ, gọi API để lấy dữ liệu
    try {
      const response = await agent.Job.getStatistical({ from, to });
      setData(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    handleFilter(); // Gọi handleFilter khi component được mount
  }, []);

  const formattedData = data?.map((item) => ({
    ...item,
    date: format(new Date(item.date), "d/M"), // Định dạng ngày
  }));
  return (
    <Card className="col-span-1 md:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Thống kê sử dụng</CardTitle>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={() => handleFilter()}>Filter</Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="earn"
              stroke="green"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="deposit"
              stroke="red"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center text-sm text-gray-500">
          Đã nạp: 0 Đã kiếm được: 0
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartDashBoard;
