import { useState } from "react";
import { Input } from "../ui/input";
import agent from "@/lib/axios";
import { error } from "console";

export default function RegisterForm(){
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        repassword: "",
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: ""});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(formData.password !== formData.repassword){
            return;
        }

        try {
            const response = await agent.Account.register(formData);
            console.log('Registration Successfully!');
        } catch (e) {
            console.error('Registration failed:', e);
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <Input type='text' name='username' id='username' placeholder='Enter username'/>
            <Input type='password' name='password' id='password' placeholder='Enter password'/>
            <Input type='password' name='repassword' id='repassword' placeholder='Enter repassword'/>
            <Input type='email' name='email' id='email' placeholder='Enter email '/>
            <Input type='date' name='dob' id='dob' placeholder='Enter dob '/>
            <Input type='text' name='firstName' id='email' placeholder='Enter first name'/>
            <Input type='text' name='lastName' id='lastName' placeholder='Enter last name'/>
            <Input type='tel' name="phoneNumber" id='phoneNumber' placeholder='Enter phone number'/>
            <Input type='text' name='address' id='address' placeholder='Enter address'/>
            <Input type='submit' value='Register'/>
        </form>
    );
}