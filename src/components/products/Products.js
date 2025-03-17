import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  FormControl,
  Select,
  MenuItem,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Fab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { productsAPI } from '../../services/api';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [deleteDialog, setDeleteDialog] = useState({ open: false, productId: null, productName: '' });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('x-auth-token');
    
    console.log('Auth status:', { isLoggedIn, hasToken: !!token });
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Check for notification from location state
    if (location.state?.notification) {
      setNotification({
        open: true,
        message: location.state.notification,
        severity: 'success'
      });
      // Clear the location state
      window.history.replaceState({}, document.title);
    }

    fetchProducts();
    fetchCategories();
  }, [navigate, location]);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const response = await productsAPI.fetchAll();
      console.log('Products response:', response);
      
      if (!response) {
        console.warn('No response from products API');
        setProducts([]);
        setError('No products available');
        return;
      }

      if (!Array.isArray(response)) {
        console.warn('Products response is not an array:', response);
        setProducts([]);
        setError('Invalid products data received');
        return;
      }

      setProducts(response);
      console.log('Products set to state:', response);
      setError('');
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await productsAPI.getCategories();
      console.log('Categories response:', response);
      
      if (!Array.isArray(response)) {
        console.warn('Categories response is not an array:', response);
        setCategories(['ALL']);
        return;
      }

      // Add 'ALL' category at the beginning and remove duplicates
      const uniqueCategories = [...new Set(response)].filter(Boolean);
      setCategories(['ALL', ...uniqueCategories]);
      console.log('Categories set to state:', ['ALL', ...uniqueCategories]);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories(['ALL']);
    }
  };

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleBuy = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleEdit = (productId) => {
    navigate(`/products/${productId}/edit`);
  };

  const handleDelete = async (productId, productName) => {
    setDeleteDialog({
      open: true,
      productId,
      productName
    });
  };

  const confirmDelete = async () => {
    try {
      await productsAPI.delete(deleteDialog.productId);
      setNotification({
        open: true,
        message: `Product ${deleteDialog.productName} deleted successfully`,
        severity: 'success'
      });
      fetchProducts(); // Refresh the products list
    } catch (err) {
      console.error('Error deleting product:', err);
      setNotification({
        open: true,
        message: 'Failed to delete product',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, productId: null, productName: '' });
    }
  };

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  const filteredAndSortedProducts = () => {
    console.log('Filtering products:', products);
    if (!Array.isArray(products)) return [];
    
    let filtered = [...products];
    const searchQuery = localStorage.getItem('searchQuery') || '';

    // Apply category filter
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
      );
      console.log('After category filter:', filtered);
    }

    // Apply search filter from navbar
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('After search filter:', filtered);
    }

    // Apply sorting
    switch (sortBy) {
      case 'priceLowToHigh':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Keep default order as received from API
        break;
    }
    console.log('Final filtered products:', filtered);
    return filtered;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading products...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  const filteredProducts = filteredAndSortedProducts();

  return (
    <Container maxWidth="lg" sx={{ mt: 2, position: 'relative' }}>
      {/* Category Toggle Buttons */}
      <Box sx={{ mb: 3, overflowX: 'auto' }}>
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={handleCategoryChange}
          aria-label="product categories"
          sx={{
            minWidth: '100%',
            '& .MuiToggleButton-root': {
              textTransform: 'uppercase',
              px: 3,
              color: 'text.secondary',
              '&.Mui-selected': {
                backgroundColor: '#f5f5f5',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
              },
            },
          }}
        >
          {categories.map((category) => (
            <ToggleButton 
              key={category} 
              value={category}
              sx={{ 
                borderRadius: '4px',
                m: 0.5,
              }}
            >
              {category}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* Sort Control */}
      <Box className="sort-container" sx={{ mb: 2 }}>
        <Typography component="label" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          Sort By:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            displayEmpty
            variant="outlined"
            renderValue={(value) => value === "default" ? "Select..." : value === "priceHighToLow" ? "Price: High to Low" : value === "priceLowToHigh" ? "Price: Low to High" : value === "newest" ? "Newest" : "Default"}
            sx={{ 
              '& .MuiSelect-select': {
                py: 1,
                bgcolor: 'white',
                fontSize: '14px'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.12)'
              }
            }}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
            <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={4}>
        {filteredProducts.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
              No products found
            </Typography>
          </Grid>
        ) : (
          filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }
              }}>
                <CardMedia
                  component="img"
                  sx={{ 
                    height: 200, 
                    objectFit: 'contain', 
                    p: 2,
                    bgcolor: '#f5f5f5'
                  }}
                  image={product.imageUrl || 'https://via.placeholder.com/200'}
                  alt={product.name || 'Product image'}
                />
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" sx={{ 
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    mb: 1
                  }}>
                    {product.name || 'Unnamed Product'}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#3f51b5', 
                    fontWeight: 600,
                    mb: 1
                  }}>
                    ₹ {product.price || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    mb: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {product.description || 'No description available'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0, display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Button
                    variant="contained"
                    onClick={() => handleBuy(product.id)}
                    sx={{
                      cursor: 'pointer',
                      display: 'inline-block',
                      width: 'auto',
                      padding: '5px 10px',
                      backgroundColor: 'blue',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      textAlign: 'center',
                      '&:hover': {
                        backgroundColor: '#0000dd'
                      }
                    }}
                  >
                    BUY
                  </Button>
                  {isAdmin && (
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={() => handleEdit(product.id)}
                        size="small"
                        sx={{
                          color: '#666',
                          '&:hover': { color: '#3f51b5' }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(product.id, product.name)}
                        size="small"
                        sx={{
                          color: '#666',
                          '&:hover': { color: '#f44336' }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add Product FAB */}
      {isAdmin && (
        <Fab
          color="primary"
          aria-label="add product"
          onClick={handleAddProduct}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#3f51b5',
            '&:hover': {
              bgcolor: '#303f9f'
            }
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, productId: null, productName: '' })}
      >
        <DialogTitle>Confirm deletion of product!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product "{deleteDialog.productName}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={confirmDelete}
            color="primary"
            variant="contained"
            sx={{
              backgroundColor: '#3f51b5',
              '&:hover': {
                backgroundColor: '#303f9f'
              }
            }}
          >
            OK
          </Button>
          <Button 
            onClick={() => setDeleteDialog({ open: false, productId: null, productName: '' })}
            color="primary"
          >
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiAlert-root': {
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '5px',
            padding: '10px 20px',
            animation: 'fadeOut 4s ease-in-out forwards',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          },
          '@keyframes fadeOut': {
            '0%': { opacity: 1 },
            '100%': { opacity: 0 }
          }
        }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%', backgroundColor: 'transparent', color: 'white' }}
          icon={false}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Products; 