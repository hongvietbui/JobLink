import { useState } from "react";
import { Input } from "../ui/input";

export default function RegisterForm(){
    const [formData, setFormData] = useState({username: "", password: "", email: "", firstName: "", lastName: "", phoneNumber: "", address: "", dateOfBirth: ""});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return(
        <form>
            <Input type='email' name='email' id='email' placeholder='Enter email '/>
            <div></div>
            <div></div>
            <div></div>
        </form>
    );
}