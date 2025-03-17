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
  CircularProgress
} from '@mui/material';
import { productsAPI } from '../../services/api';
import CategoryTabs from './CategoryTabs';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

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
        state: { quantity, product }
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
      <Container sx={{ mt: 4 }}>
        <CategoryTabs 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ mt: 4 }}>
        <CategoryTabs 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange}
        />
        <Alert severity="error">{error || 'Product not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <CategoryTabs 
        selectedCategory={selectedCategory} 
        onCategoryChange={handleCategoryChange}
      />
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 400,
                objectFit: 'contain',
                bgcolor: '#f5f5f5',
                borderRadius: 1
              }}
              src={product.imageUrl || 'https://via.placeholder.com/400'}
              alt={product.name || 'Product image'}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400';
                e.target.alt = 'Product image not available';
              }}
            />
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>

            <Chip 
              label={`Category: ${product.category}`}
              sx={{ mb: 2, bgcolor: '#f5f5f5' }}
            />

            <Box sx={{ my: 2 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                ₹ {product.price}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                {product.description}
              </Typography>

              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Available Quantity: {product.availableItems || 0}
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ 
                  min: 1, 
                  max: product.availableItems,
                  'aria-label': 'quantity'
                }}
                sx={{ width: 100, mr: 2 }}
              />

              <Button
                variant="contained"
                onClick={handleBuyNow}
                disabled={!product?.availableItems}
                sx={{
                  mt: 3,
                  bgcolor: '#3f51b5',
                  color: 'white',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  padding: '6px 16px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: '#303f9f',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }
                }}
              >
                PLACE ORDER
              </Button>
            </Box>

            {product.availableItems === 0 && (
              <Alert severity="error" sx={{ mt: 2 }}>
                This product is currently out of stock
              </Alert>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetails; 