import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/register', formData);
            alert(response.data);
        } catch (error) {
            alert('Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            <select name="role" onChange={handleChange}>
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Borrower">Borrower</option>
                <option value="Loan Officer">Loan Officer</option>
            </select>
            <button type="submit">Register</button>
        </form>
    );
};
export default Register;
