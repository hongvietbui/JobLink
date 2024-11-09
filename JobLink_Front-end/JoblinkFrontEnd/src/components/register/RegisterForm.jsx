import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import agent from "@/lib/axios";
import { timeStamp } from "console";
import { useToast } from "@/hooks/use-toast";

export default function RegisterForm() {
    const {toast} = useToast();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        repassword: "",
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};

        // Username validation
        if (!formData.username) newErrors.username = "Username is required.";

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        // Confirm password validation
        if (formData.password !== formData.repassword) {
            newErrors.repassword = "Passwords do not match.";
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email format is invalid.";
        }

        // Phone number validation
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = "Phone number is required.";
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Phone number must be 10 digits.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const response = await agent.Account.register(formData);
            toast({
                title: "Registration successfully!",
                description: "You have been registered, please login",
                status: "success",
                duration: 5000,
                isClosable: true 
            });
            console.log("Registration Successful!");
            //go to login page
            window.location.href = "/login";
        } catch (error) {
            //add new toast
            toast({
                title: "Registration failed",
                description: error.message,
                status: "error",
            });
            console.error("Registration failed:", error);
            setErrors({ form: "Registration failed. Please try again." });
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 mt-10 bg-white rounded-md shadow-md">
                <h1 className="text-2xl font-semibold text-center text-gray-700 mb-1">Register</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.form && <div className="text-red-500 mb-2">{errors.form}</div>}

                    <div>
                        <Label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">Username</Label>
                        <Input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Enter username"
                            onChange={handleChange}
                            required
                        />
                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                    </div>

                    <div>
                        <Label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</Label>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter password"
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <Label htmlFor="repassword" className="block mb-1 text-sm font-medium text-gray-700">Confirm Password</Label>
                        <Input
                            type="password"
                            name="repassword"
                            id="repassword"
                            placeholder="Confirm password"
                            onChange={handleChange}
                            required
                        />
                        {errors.repassword && <p className="text-red-500 text-sm mt-1">{errors.repassword}</p>}
                    </div>

                    <div>
                        <Label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</Label>
                        <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter email"
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                                {/* Date of Birth field with custom icon */}
                                <div className="relative">
                                    <Label htmlFor="dateOfBirth" className="block mb-1 text-sm font-medium text-gray-700">Date of Birth</Label>
                                    
                                    {/* Sử dụng `appearance-none` để ẩn icon mặc định và `pr-10` để có không gian cho icon */}
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        id="dateOfBirth"
                                        placeholder="mm/dd/yyyy"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 appearance-none"
                                        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }} // Ẩn icon mặc định
                                    />
                                </div>
                            </div>

                    <div>
                        <Label htmlFor="firstName" className="block mb-1 text-sm font-medium text-gray-700">First Name</Label>
                        <Input
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="Enter first name"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="lastName" className="block mb-1 text-sm font-medium text-gray-700">Last Name</Label>
                        <Input
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Enter last name"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="phoneNumber" className="block mb-1 text-sm font-medium text-gray-700">Phone Number</Label>
                        <Input
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            placeholder="Enter phone number"
                            onChange={handleChange}
                            required
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                    </div>

                    <div>
                        <Label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700">Address</Label>
                        <Input
                            type="text"
                            name="address"
                            id="address"
                            placeholder="Enter address"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full mt-4">Register</Button>
                </form>

                <p className="mt-4 text-center text-gray-600">
                    Already have an account?{" "}
                    <a href="/auth/login" className="text-blue-500 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}
