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

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: ''
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
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Prepare data for API - matching the exact format required
      const signupData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        role: ["admin"],
        lastName: formData.lastName,
        contactNumber: formData.contactNumber
      };

      console.log('Attempting signup with:', signupData);
      const response = await authAPI.signup(signupData);
      console.log('Signup successful:', response);
      
      // After successful signup, navigate to login
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage = err.response?.data?.message || 'An error occurred during signup. Please try again.';
      setError(errorMessage);
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
          Sign up
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
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            value={formData.firstName}
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
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={formData.lastName}
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
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
            name="contactNumber"
            label="Contact Number"
            type="tel"
            id="contactNumber"
            autoComplete="tel"
            value={formData.contactNumber}
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
            SIGN UP
          </Button>
          <Box sx={{ textAlign: 'right' }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/login')}
              sx={{
                color: '#673ab7',
                textDecoration: 'underline',
                cursor: 'pointer',
                '&:hover': {
                  color: '#512da8'
                }
              }}
            >
              Already have an account? Sign in
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

export default SignUp; 