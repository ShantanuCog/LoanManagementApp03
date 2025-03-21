import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                alert('Failed to fetch users');
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h1>User Management</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.name} - {user.role}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;
