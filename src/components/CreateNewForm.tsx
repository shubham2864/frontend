import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Container, Typography, Box, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { getProfile, updateProfile, signUp, newUser } from '@/services/api';  // Adjust the path if necessary
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import styles from "../styles/Settings.module.css";

const UserForm = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: ''
  });

  useEffect(() => {
    if (id && id !== 'new') {
      const token = localStorage.getItem('token');
      getProfile(token)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name!]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name!]: value,
    }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (id && id !== 'new') {
        console.log("helloooo23344")
        // await updateProfile(user, token);
      } else {
        console.log("helloooo23111344")
        await newUser(user);
      }
      router.push('/settings');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <div className={styles.header}>
        <Link href="/settings" className={styles.backButton}>
          <FontAwesomeIcon
            icon={faArrowAltCircleLeft}
            style={{ color: "black" }}
          />
        </Link>
        <h1>New User</h1>
      </div>
      <Box sx={{ marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          {id === 'new' ? 'New User' : 'Edit User'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            name="firstName"
            label="First name"
            fullWidth
            variant="outlined"
            margin="normal"
            value={user.firstName}
            onChange={handleChange}
          />
          <TextField
            name="lastName"
            label="Last name"
            fullWidth
            variant="outlined"
            margin="normal"
            value={user.lastName}
            onChange={handleChange}
          />
          <TextField
            name="email"
            label="Email address"
            fullWidth
            variant="outlined"
            margin="normal"
            value={user.email}
            onChange={handleChange}
          />
          <TextField
            name="phoneNumber"
            label="Phone number"
            fullWidth
            variant="outlined"
            margin="normal"
            value={user.phoneNumber}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={user.role}
              onChange={handleSelectChange}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
            {id === 'new' ? 'Create' : 'Update'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserForm;
