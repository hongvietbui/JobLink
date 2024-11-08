"use client";
import { useState, useEffect } from "react";
import agent from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

const statusInfo = {
  ACTIVE: { label: "Active", color: "text-green-500", icon: "✅" },
  PENDING_VERIFICATION: { label: "Pending Verification", color: "text-yellow-500", icon: "⏳" },
  SUSPENDED: { label: "Suspended", color: "text-orange-500", icon: "⚠️" },
  LOCKED: { label: "Locked", color: "text-red-500", icon: "🔒" },
};

// Dữ liệu giả cho phần đánh giá người dùng
const sampleReviews = [
  {
    username: "Alice",
    rating: 5,
    comment: "Great experience working with this user!",
    date: "2 weeks ago",
  },
  {
    username: "John",
    rating: 4,
    comment: "Knowledgeable and helpful, highly recommend.",
    date: "1 month ago",
  },
  {
    username: "Sarah",
    rating: 5,
    comment: "Very professional and friendly!",
    date: "1 month ago",
  },
];

export default function UserProfile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await agent.User.me();
        setUserData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  if (!userData) return <div>Loading...</div>;

  const avatarUrl = userData.avatar
    ? userData.avatar
    : "https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-1/440879710_1311365576486302_465885895535459738_n.jpg?stp=dst-jpg_s200x200&_nc_cat=100&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeFwMNEk_sQdV-RfB0sm4YE1ZNm2NsCaeAlk2bY2wJp4CbaqoySVisau52pRC-dwipFqTIGn9kjUzVvfdl1wv1yx&_nc_ohc=4s-9EEj9JyAQ7kNvgHAVDyJ&_nc_zt=24&_nc_ht=scontent.fhan15-2.fna&_nc_gid=AUFduflDam84OFI79XzsrF4&oh=00_AYAV84dfUb_5Uk3TQcVI9LEt7Wxva0uQPn5KAd-LaOHPsQ&oe=6732AF0F";

  const userStatus = statusInfo[userData.status] || statusInfo["ACTIVE"];
  const averageRating = sampleReviews.reduce((acc, review) => acc + review.rating, 0) / sampleReviews.length;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatarUrl} alt={userData.username} />
            <AvatarFallback>{userData.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl">{userData.username}</CardTitle>
            <p className="text-sm text-muted-foreground">{userData.address}</p>
            <p className="mt-1 italic">"Explore beyond the limits"</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button variant="outline">Favorite List</Button>
            <Button variant="outline">Edit Profile</Button>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Activity History</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{userData.accountBalance} VND</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <Progress value={(averageRating / 5) * 100} max={100} className="h-2 mb-2" />
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`w-full flex items-center justify-start gap-2 ${userStatus.color}`}>
                  <span className="text-2xl">{userStatus.icon}</span>
                  <span className="text-lg font-semibold">{userStatus.label}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Review Score</h4>
              <p className="text-sm text-muted-foreground">Specialist in Science & Technology</p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Student Reviews</h4>
              <div className="space-y-4">
                {sampleReviews.map((review, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="https://via.placeholder.com/150" alt={review.username} />
                      <AvatarFallback>{review.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{review.username}</p>
                      <div className="flex mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                      <p>{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
