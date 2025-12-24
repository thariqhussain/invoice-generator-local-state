import { useState } from "react";
import { signin } from "../../services/auth";
import { useNavigate, Link } from "react-router-dom";

import Label from "../../reusables/Label"
import Input from "../../reusables/Input"
import Button from "../../reusables/Button"
import './Signin.css';

export default function Signin({ setIsAnimating }) {
    const [form, setForm] = useState({
        email: '',
        password: '',
        org: ''
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        // Clear error for this field when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    function validateForm() {
        const newErrors = {};

        if (!form.org.trim()) {
            newErrors.org = 'Organization is required';
        }

        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!form.password) {
            newErrors.password = 'Password is required';
        } else if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        return newErrors;
    };

    async function handleSignin(e) {
        e.preventDefault();
        setMessage('');
        
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        
        try {
            const result = await signin(form);

            if(result.success) {
                // Trigger animation
                setIsAnimating(true);
                
                // Wait for animation to complete, then navigate
                setTimeout(() => {
                    navigate("/sidenav");
                }, 500); 
                
            } else {
                setMessage(result.message || "Sign in failed. Please check your credentials.");
            };
        } catch (error) {
            setMessage("An error occurred during sign in. Please try again.");
            console.error("Sign in error:", error);
        }
    };

    return(
        <>
            <form id='signin-form' onSubmit={handleSignin}>
                <h2>Sign In to Your Account</h2>
                
                <Label htmlFor="organization">Organization</Label>
                <Input 
                    id="organization" 
                    type="text" 
                    name="org" 
                    value={form.org} 
                    onChange={handleChange} 
                    placeholder="Enter your Organization"
                />
                {errors.org && <span className="error-text">{errors.org}</span>}

                <Label htmlFor="email">Email Address</Label>
                <Input 
                    id="email" 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    placeholder="Enter your Email Address"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}

                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    type="password" 
                    name="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    placeholder="Enter your Password"
                />
                {errors.password && <span className="error-text">{errors.password}</span>}

                <Button type="submit">Sign in</Button>
                   <p className="auth-switch-text">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                   </p>
            </form>
        {/* <p id="response-message">{message}</p> */}
        </>
    )
}