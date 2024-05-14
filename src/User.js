import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const User = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    address: '',
    contactNumber: '',
    email: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/users/');
      console.log(response)
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {    
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`http://localhost:8081/api/users/${editingUserId}`, formData);
        setEditMode(false);
        setEditingUserId(null);
      } else {
        await axios.post('http://localhost:8081/api/users/', formData);
      }
      fetchUsers();
      setFormData({
        name: '',
        username: '',
        password: '',
        address: '',
        contactNumber: '',
        email: '',
      });
    } catch (error) {
      console.error('Error creating/updating user:', error);
    }
  };

  const startEditMode = (user) => {
    setFormData(user);
    setEditMode(true);
    setEditingUserId(user.id);
  };

  const cancelEditMode = () => {
    setEditMode(false);
    setEditingUserId(null);
    setFormData({
      name: '',
      username: '',
      password: '',
      address: '',
      contactNumber: '',
      email: '',
    });
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Users</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" />
          </div>
          <div className="col-md-6">
            <input type="text" className="form-control" name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" />
          </div>
          <div className="col-md-6">
            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <input type="text" className="form-control" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} placeholder="Contact Number" />
          </div>
          <div className="col-md-6">
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />
          </div>
        </div>
        <div className="mt-3">
          {editMode ? (
            <>
              <button type="submit" className="btn btn-dark mr-2" >Update</button>
              <button type="button" className="btn btn-secondary" onClick={cancelEditMode}>Cancel</button>
            </>
          ) : (
            <button type="submit" className="btn btn-dark">Add User</button>
          )}
        </div>
      </form>
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Password</th>
            <th>Address</th>
            <th>Contact Number</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.password}</td>
              <td>{user.address}</td>
              <td>{user.contactNumber}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => startEditMode(user)} className="btn btn-dark mr-2" style={{ marginRight: '8px' }}>Edit</button>
                <button onClick={() => deleteUser(user.id)} className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;
