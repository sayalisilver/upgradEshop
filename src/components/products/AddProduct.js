import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  TextField,
  Container,
  Snackbar,
  Alert,
  Autocomplete,
  createFilterOptions
} from '@mui/material';
import { productsAPI } from '../../services/api';

const filter = createFilterOptions();

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    manufacturer: '',
    availableItems: '',
    imageUrl: ''
  });
  const [categories, setCategories] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productsAPI.getCategories();
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleAddProduct = async () => {
    try {
      console.log('Starting product creation...');
      
      // Validate required fields
      if (!formData.name || !formData.category || !formData.manufacturer || 
          !formData.availableItems || !formData.price) {
        setSnackbar({ open: true, message: 'Please fill all required fields' });
        return;
      }

      // Format data for API
      const productData = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        description: formData.description || '',
        manufacturer: formData.manufacturer,
        availableItems: Number(formData.availableItems),
        imageUrl: formData.imageUrl || ''
      };

      console.log('Sending create request with data:', productData);
      
      const response = await productsAPI.create(productData);
      console.log('Create successful, response:', response);
      
      // Navigate first, then show notification through state
      navigate('/products', { 
        state: { notification: `Product ${formData.name} created successfully` }
      });
    } catch (error) {
      console.error('Error creating product:', error);
      let errorMessage = 'Error creating product';
      
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = 'You are not authorized to create products. Please check your permissions.';
        } else {
          errorMessage = error.response.data?.message || 'Failed to create product';
        }
      }
      
      setSnackbar({ 
        open: true, 
        message: errorMessage
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      mt: 4, 
      mb: 4,
      minHeight: 'calc(100vh - 128px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Typography variant="h5" sx={{ mb: 4, color: '#3f51b5', textAlign: 'center' }}>
        Add Product
      </Typography>
      
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          variant="outlined"
          size="small"
        />

        <Autocomplete
          value={formData.category}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setFormData({ ...formData, category: newValue });
            } else if (newValue && newValue.inputValue) {
              setFormData({ ...formData, category: newValue.inputValue });
            } else {
              setFormData({ ...formData, category: newValue || '' });
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            const { inputValue } = params;
            const isExisting = options.some((option) => inputValue === option);
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                title: `Add "${inputValue}"`,
              });
            }
            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          options={categories}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option;
          }}
          renderOption={(props, option) => <li {...props}>{option.title || option}</li>}
          freeSolo
          renderInput={(params) => (
            <TextField {...params} placeholder="Category *" variant="outlined" size="small" />
          )}
        />

        <TextField
          fullWidth
          placeholder="Manufacturer *"
          value={formData.manufacturer}
          onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
          variant="outlined"
          size="small"
        />

        <TextField
          fullWidth
          type="number"
          placeholder="Available Items *"
          value={formData.availableItems}
          onChange={(e) => setFormData({ ...formData, availableItems: Number(e.target.value) })}
          variant="outlined"
          size="small"
        />

        <TextField
          fullWidth
          type="number"
          placeholder="Price *"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          variant="outlined"
          size="small"
        />

        <TextField
          fullWidth
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          variant="outlined"
          size="small"
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Product Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          variant="outlined"
          size="small"
        />

        <Button
          variant="contained"
          onClick={handleAddProduct}
          sx={{
            mt: 2,
            backgroundColor: '#3f51b5',
            '&:hover': {
              backgroundColor: '#303f9f'
            },
            width: '100%'
          }}
        >
          SAVE PRODUCT
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

export default AddProduct; 