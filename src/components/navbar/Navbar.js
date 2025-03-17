import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  InputBase,
  IconButton
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Store search query in localStorage and navigate to products page
    localStorage.setItem('searchQuery', searchQuery);
    navigate('/products');
  };

  const buttonStyle = {
    color: 'white',
    textTransform: 'none',
    textDecoration: 'underline',
    '&:hover': {
      textDecoration: 'underline'
    }
  };

  const logoutButtonStyle = {
    bgcolor: '#ff3366',
    color: 'white',
    '&:hover': {
      bgcolor: '#ff1744'
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#3f51b5' }}>
      <Toolbar className="navbar-container">
        {/* Left section - Logo */}
        <Box 
          className="navbar-logo" 
          onClick={() => navigate('/')}
          sx={{ 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            flexGrow: 0
          }}
        >
          <ShoppingCartIcon sx={{ mr: 1 }} />
          <h1>upGrad E-Shop</h1>
        </Box>

        {/* Center section - Search */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <form onSubmit={handleSearch} className="search-form">
            <Box className="search-container">
              <IconButton type="submit" sx={{ color: 'white', p: 1 }}>
                <SearchIcon />
              </IconButton>
              <InputBase
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                sx={{
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                  minWidth: '300px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              />
            </Box>
          </form>
        </Box>

        {/* Right section - Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 0 }}>
          <Button 
            component={RouterLink} 
            to="/products"
            sx={buttonStyle}
          >
            Home
          </Button>
          
          {isLoggedIn && isAdmin && (
            <Button 
              component={RouterLink} 
              to="/products/add"
              sx={buttonStyle}
            >
              Add Product
            </Button>
          )}

          {!isLoggedIn ? (
            <>
              <Button 
                component={RouterLink} 
                to="/login"
                sx={buttonStyle}
              >
                Login
              </Button>
              <Button 
                component={RouterLink} 
                to="/signup"
                sx={buttonStyle}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Button 
              variant="contained"
              onClick={handleLogout}
              sx={logoutButtonStyle}
            >
              LOGOUT
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 