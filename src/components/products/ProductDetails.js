import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { productsAPI } from '../../services/api';
import CategoryTabs from './CategoryTabs';

const steps = ['Items', 'Select Address', 'Confirm Order'];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      console.log('Product details:', response);
      setProduct(response);
      if (response?.category) {
        setSelectedCategory(response.category);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to fetch product details');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= (product?.availableItems || 0)) {
      setQuantity(value);
    }
  };

  const handleBuyNow = () => {
    if (product && quantity > 0) {
      navigate(`/products/${id}/order`, {
        state: { 
          quantity,
          product
        }
      });
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'ALL') {
      navigate('/products');
    } else {
      navigate(`/products?category=${category}`);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <CategoryTabs selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Stepper activeStep={0} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ 
          display: 'flex', 
          gap: 6,
          alignItems: 'flex-start'
        }}>
          {/* Product Image */}
          <Box
            component="img"
            sx={{
              width: '300px',
              height: '300px',
              objectFit: 'contain',
              bgcolor: '#f8f9fa',
              borderRadius: 2,
              padding: 2,
              border: '1px solid #ddd',
            }}
            src={product.imageUrl || 'https://via.placeholder.com/300'}
            alt={product.name || 'Product image'}
          />

          {/* Product Details */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Name and Available Quantity */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4" sx={{ fontSize: '2rem' }}>
                {product.name}
              </Typography>
              <Box sx={{ 
                backgroundColor: '#3f51b5',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '0.875rem',
              }}>
                Available Quantity: {product.availableItems || 0}
              </Box>
            </Box>

            {/* Category */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Typography sx={{ color: 'text.secondary', minWidth: 'fit-content' }}>
                Category:&nbsp;
              </Typography>
              <Typography fontWeight="bold">
                {product.category}
              </Typography>
            </Box>

            {/* Description */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Typography sx={{ 
                fontSize: '0.875rem',
                fontStyle: 'italic',
                color: 'text.secondary'
              }}>
                {product.description}
              </Typography>
            </Box>

            {/* Price */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ color: 'text.secondary', minWidth: 'fit-content' }}>
                Price:&nbsp;
              </Typography>
              <Typography 
                sx={{ 
                  color: '#ff3d00',
                  fontWeight: 'bold',
                  fontSize: '1.5rem'
                }}
              >
                ₹ {product.price}
              </Typography>
            </Box>

            {/* Quantity Input */}
            <TextField
              type="number"
              variant="outlined"
              value={quantity}
              onChange={handleQuantityChange}
              label="Enter Quantity"
              inputProps={{
                min: 1,
                max: product.availableItems,
              }}
              sx={{ 
                width: '200px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
            />

            {/* Place Order Button */}
            <Button
              variant="contained"
              onClick={handleBuyNow}
              disabled={!product?.availableItems}
              sx={{
                width: '200px',
                bgcolor: '#3f51b5',
                color: 'white',
                borderRadius: 1,
                padding: '10px 20px',
                textTransform: 'uppercase',
                '&:hover': {
                  bgcolor: '#303f9f',
                },
              }}
            >
              PLACE ORDER
            </Button>

            {product.availableItems === 0 && (
              <Alert severity="error" sx={{ mt: 1, width: 'fit-content' }}>
                This product is currently out of stock
              </Alert>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProductDetails; 