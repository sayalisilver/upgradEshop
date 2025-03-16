import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  TextField,
  Container,
  Snackbar,
  Alert,
} from '@mui/material';
import { productsAPI } from '../../services/api';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [editFormData, setEditFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    manufacturer: '',
    availableItems: '',
    imageUrl: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product details for editing, ID:', id);
        if (id) {
          const product = await productsAPI.getById(id);
          console.log('Fetched product details:', product);
          setEditFormData({
            name: product.name || '',
            category: product.category || '',
            price: product.price || '',
            description: product.description || '',
            manufacturer: product.manufacturer || '',
            availableItems: product.availableItems || '',
            imageUrl: product.imageUrl || ''
          });
          console.log('Form data set successfully');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setSnackbar({ open: true, message: 'Error fetching product details' });
      }
    };
    fetchProduct();
  }, [id]);

  const handleEditProduct = async () => {
    try {
      console.log('Starting product modification...');
      
      // Validate required fields
      if (!editFormData.name || !editFormData.category || !editFormData.manufacturer || 
          !editFormData.availableItems || !editFormData.price) {
        console.log('Validation failed - missing required fields');
        setSnackbar({ open: true, message: 'Please fill all required fields' });
        return;
      }

      // Format data for API
      const productData = {
        name: editFormData.name,
        category: editFormData.category,
        price: Number(editFormData.price),
        description: editFormData.description || '',
        manufacturer: editFormData.manufacturer,
        availableItems: Number(editFormData.availableItems),
        imageUrl: editFormData.imageUrl || ''
      };

      console.log('Sending update request with data:', productData);
      
      const response = await productsAPI.update(id, productData);
      console.log('Update successful, response:', response);
      
      // Navigate first, then show notification through state
      navigate('/products', { 
        state: { notification: `Product ${editFormData.name} modified successfully` }
      });
    } catch (error) {
      console.error('Error modifying product:', error);
      let errorMessage = 'Error modifying product';
      
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = 'You are not authorized to modify this product. Please check your permissions.';
        } else {
          errorMessage = error.response.data?.message || 'Failed to modify product';
        }
      }
      
      setSnackbar({ 
        open: true, 
        message: errorMessage
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 4, color: '#3f51b5' }}>
        Modify Product
      </Typography>
      
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography component="label" sx={{ mb: 1, display: 'block', color: 'rgba(0, 0, 0, 0.6)' }}>
            Name *
          </Typography>
          <TextField
            fullWidth
            value={editFormData.name || ''}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            variant="outlined"
            size="small"
          />
        </Box>

        <Box>
          <Typography component="label" sx={{ mb: 1, display: 'block', color: 'rgba(0, 0, 0, 0.6)' }}>
            Category *
          </Typography>
          <TextField
            fullWidth
            value={editFormData.category || ''}
            onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
            variant="outlined"
            size="small"
          />
        </Box>

        <Box>
          <Typography component="label" sx={{ mb: 1, display: 'block', color: 'rgba(0, 0, 0, 0.6)' }}>
            Manufacturer *
          </Typography>
          <TextField
            fullWidth
            value={editFormData.manufacturer || ''}
            onChange={(e) => setEditFormData({ ...editFormData, manufacturer: e.target.value })}
            variant="outlined"
            size="small"
          />
        </Box>

        <Box>
          <Typography component="label" sx={{ mb: 1, display: 'block', color: 'rgba(0, 0, 0, 0.6)' }}>
            Available Items *
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={editFormData.availableItems || ''}
            onChange={(e) => setEditFormData({ ...editFormData, availableItems: Number(e.target.value) })}
            variant="outlined"
            size="small"
          />
        </Box>

        <Box>
          <Typography component="label" sx={{ mb: 1, display: 'block', color: 'rgba(0, 0, 0, 0.6)' }}>
            Price *
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={editFormData.price || ''}
            onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
            variant="outlined"
            size="small"
          />
        </Box>

        <Box>
          <Typography component="label" sx={{ mb: 1, display: 'block', color: 'rgba(0, 0, 0, 0.6)' }}>
            Image URL
          </Typography>
          <TextField
            fullWidth
            value={editFormData.imageUrl || ''}
            onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
            variant="outlined"
            size="small"
          />
        </Box>

        <Box>
          <Typography component="label" sx={{ mb: 1, display: 'block', color: 'rgba(0, 0, 0, 0.6)' }}>
            Product Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={editFormData.description || ''}
            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
            variant="outlined"
            size="small"
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleEditProduct}
          sx={{
            mt: 2,
            backgroundColor: '#3f51b5',
            '&:hover': {
              backgroundColor: '#303f9f'
            },
            width: '100%'
          }}
        >
          MODIFY PRODUCT
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity="error"
          sx={{ width: '100%', backgroundColor: 'transparent', color: 'white' }}
          icon={false}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditProduct; 