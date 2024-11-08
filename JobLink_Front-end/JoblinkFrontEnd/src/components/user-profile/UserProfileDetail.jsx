"use client";
import { useState, useEffect } from "react";
import agent from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

// User status information
const statusInfo = {
  ACTIVE: { label: "Active", color: "text-green-500", icon: "✅" },
  PENDING_VERIFICATION: { label: "Pending Verification", color: "text-yellow-500", icon: "⏳" },
  SUSPENDED: { label: "Suspended", color: "text-orange-500", icon: "⚠️" },
  LOCKED: { label: "Locked", color: "text-red-500", icon: "🔒" },
};

// Sample review data
const sampleReviews = [
  {
    username: "Alice",
    rating: 5,
    comment: "Great experience working with this user!",
    date: "2 weeks ago",
    avatar: "https://example.com/alice.jpg",
  },
  {
    username: "John",
    rating: 4,
    comment: "Knowledgeable and helpful, highly recommend.",
    date: "1 month ago",
    avatar: "https://example.com/john.jpg",
  },
  {
    username: "Sarah",
    rating: 5,
    comment: "Very professional and friendly!",
    date: "1 month ago",
    avatar: "https://example.com/sarah.jpg",
  },
];

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await agent.User.me();
        setUserData(response);
        setEditData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  if (!userData) return <div>Loading...</div>;

  const avatarUrl = userData.avatar || "https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-1/440879710_1311365576486302_465885895535459738_n.jpg?stp=dst-jpg_s200x200&_nc_cat=100&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeFwMNEk_sQdV-RfB0sm4YE1ZNm2NsCaeAlk2bY2wJp4CbaqoySVisau52pRC-dwipFqTIGn9kjUzVvfdl1wv1yx&_nc_ohc=4s-9EEj9JyAQ7kNvgHAVDyJ&_nc_zt=24&_nc_ht=scontent.fhan15-2.fna&_nc_gid=AUFduflDam84OFI79XzsrF4&oh=00_AYAV84dfUb_5Uk3TQcVI9LEt7Wxva0uQPn5KAd-LaOHPsQ&oe=6732AF0F";
  const userStatus = statusInfo[userData.status] || statusInfo["ACTIVE"];
  const averageRating = sampleReviews.reduce((acc, review) => acc + review.rating, 0) / sampleReviews.length;

  // Field validation function
  const validateFields = () => {
    const newErrors = {};
    if (!editData.firstName) newErrors.firstName = "First name cannot be empty.";
    if (!editData.lastName) newErrors.lastName = "Last name cannot be empty.";
    if (editData.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(editData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (editData.phoneNumber && !/^[0-9]+$/.test(editData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number can only contain digits.";
    }
    if (editData.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(editData.dateOfBirth)) {
      newErrors.dateOfBirth = "Invalid date format (YYYY-MM-DD).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field change
  const handleFieldChange = (field, value) => {
    setEditData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  // Save edited information
  const handleSave = async () => {
    if (!validateFields()) {
      alert("Please check your inputs.");
      return;
    }
    try {
      await agent.User.editUser(editData);
      setUserData(editData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

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
            {!isEditing ? (
              <p className="text-sm text-muted-foreground">{userData.address}</p>
            ) : (
              <Input
                value={editData.address || ""}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                placeholder="Enter address"
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                <Button variant="outline">Change Password</Button>
              </>
            )}
          </div>

          <div className="mb-4">
            <label>First Name:</label>
            {isEditing ? (
              <>
                <Input
                  value={editData.firstName || ""}
                  onChange={(e) => handleFieldChange("firstName", e.target.value)}
                  placeholder="First name"
                />
                {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
              </>
            ) : (
              <p>{userData.firstName}</p>
            )}
          </div>

          <div className="mb-4">
            <label>Last Name:</label>
            {isEditing ? (
              <>
                <Input
                  value={editData.lastName || ""}
                  onChange={(e) => handleFieldChange("lastName", e.target.value)}
                  placeholder="Last name"
                />
                {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
              </>
            ) : (
              <p>{userData.lastName}</p>
            )}
          </div>

          <div className="mb-4">
            <label>Email:</label>
            {isEditing ? (
              <>
                <Input
                  value={editData.email || ""}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="Enter email"
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </>
            ) : (
              <p>{userData.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label>Phone Number:</label>
            {isEditing ? (
              <>
                <Input
                  value={editData.phoneNumber || ""}
                  onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
                  placeholder="Enter phone number"
                />
                {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
              </>
            ) : (
              <p>{userData.phoneNumber}</p>
            )}
          </div>

          <div className="mb-4">
            <label>Date of Birth:</label>
            {isEditing ? (
              <>
                <Input
                  value={editData.dateOfBirth || ""}
                  onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
                {errors.dateOfBirth && <p className="text-red-500">{errors.dateOfBirth}</p>}
              </>
            ) : (
              <p>{userData.dateOfBirth}</p>
            )}
          </div>

          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Job Reviews</h4>
            <div className="space-y-4">
              {sampleReviews.map((review, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={review.avatar || "https://via.placeholder.com/150"} alt={review.username} />
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
        </CardContent>
      </Card>
    </div>
  );
}
