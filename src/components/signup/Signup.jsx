import { useState } from "react";
import { signup } from "../../services/auth";
import { useNavigate, Link } from "react-router-dom"; 

import Label from "../../reusables/Label";
import Input from "../../reusables/Input"
import Button from "../../reusables/Button"
import './Signup.css'; 

export default function Signup({ setIsAnimating }) {
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
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
            newErrors.org = 'Organization name is required';
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

        if (!form.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    async function handleSignup(e) {
        e.preventDefault();
        setMessage('');

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        
        try {
            const {confirmPassword, ...dataToSend} = form;
            const result = await signup(dataToSend);

            if(result.success) {
                // Trigger animation
                setIsAnimating(true);
                
                setMessage("Success! Account created. Redirecting to sign-in...");
                setTimeout(() => navigate("/signin"), 2000); 
            } else {
                setMessage(result.message || "Sign up failed. Please check the details.");
            };
        } catch (error) {
            setMessage("An error occurred during sign up. Please try again.");
            console.error("Sign up error:", error);
        }
    };

    return(
        <>
            <form id='signup-form' onSubmit={handleSignup}>
                <h2>Create Your Account</h2>
                
                <Label htmlFor="organization">Organization Name</Label>
                <Input 
                    id="organization" 
                    type="text" 
                    name="org" 
                    value={form.org} 
                    onChange={handleChange} 
                    placeholder="Enter your Organization Name"
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
                    placeholder="Create a Password"
                />
                {errors.password && <span className="error-text">{errors.password}</span>}

                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                    id="confirmPassword" 
                    type="password" 
                    name="confirmPassword" 
                    value={form.confirmPassword} 
                    onChange={handleChange} 
                    placeholder="Confirm your Password"
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}

                <Button type="submit">Sign Up</Button>
                
                <p className="auth-switch-text">
                    Already have an account? <Link to="/signin">Sign In</Link>
                </p>
            </form>
        {/* <p id="response-message">{message}</p> */}
        </>
    )
}