import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { authAPI } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Attempting login with:', formData);
    
    try {
      console.log('Making API call to login...');
      const response = await authAPI.login(formData);
      console.log('Login response:', response);
      
      // Set login status
      localStorage.setItem('isLoggedIn', 'true');
      
      // Check if user is admin (you might need to adjust this based on the actual response)
      localStorage.setItem('isAdmin', response.roles?.includes('ADMIN') ? 'true' : 'false');
      
      // Navigate to products page after successful login
      navigate('/products');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 400) {
        setError('Invalid username or password. Please try again.');
      } else {
        setError(err.response?.data?.message || 'An error occurred during login');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#f50057',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 1
          }}
        >
          <LockIcon sx={{ color: 'white' }} />
        </Box>

        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign in
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            sx={{ 
              backgroundColor: '#f5f5f5',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            sx={{ 
              backgroundColor: '#f5f5f5',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: '#3f51b5',
              '&:hover': {
                bgcolor: '#303f9f'
              }
            }}
          >
            SIGN IN
          </Button>
          <Box sx={{ textAlign: 'center', mt: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
              Don't have an account?
            </Typography>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/signup');
              }}
              underline="hover"
              sx={{ color: '#3f51b5' }}
            >
              Sign up
            </Link>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 5, mb: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Copyright © <Link href="#" underline="hover" color="inherit">upGrad</Link> 2021
        </Typography>
      </Box>
    </Container>
  );
};

export default Login; 