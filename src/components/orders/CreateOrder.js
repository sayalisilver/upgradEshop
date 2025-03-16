import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Paper,
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Alert,
  Divider,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import { productsAPI, addressAPI, orderAPI } from '../../services/api';

const steps = ['Product Details', 'Address Details', 'Confirm Order'];

const CreateOrder = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [product, setProduct] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [quantity, setQuantity] = useState(location.state?.quantity || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newAddress, setNewAddress] = useState({
    name: '',
    contactNumber: '',
    street: '',
    city: '',
    state: '',
    landmark: '',
    zipCode: ''
  });

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      console.log('Product details:', response);
      setProduct(response);
    } catch (err) {
      setError('Failed to fetch product details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await addressAPI.getAll();
      console.log('Addresses:', response);
      setAddresses(response || []);
    } catch (err) {
      setError('Failed to fetch addresses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    fetchProduct();
    if (activeStep === 1) {
      fetchAddresses();
    }
  }, [activeStep, navigate, fetchProduct, fetchAddresses]);

  const handleNext = () => {
    if (activeStep === 1 && !selectedAddress) {
      setError('Please select address!');
      return;
    }
    if (activeStep === steps.length - 1) {
      placeOrder();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
      setError('');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const placeOrder = async () => {
    try {
      setLoading(true);
      await orderAPI.create({
        productId: id,
        addressId: selectedAddress,
        quantity: quantity
      });
      setSuccess('Order placed successfully!');
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (err) {
      setError('Failed to place order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const response = await addressAPI.create(newAddress);
      console.log('New address created:', response);
      
      // Reset form and refresh addresses
      setNewAddress({
        name: '',
        contactNumber: '',
        street: '',
        city: '',
        state: '',
        landmark: '',
        zipCode: ''
      });
      await fetchAddresses();
    } catch (err) {
      setError('Failed to save address');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            {product && (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        width: '100%',
                        maxHeight: '400px',
                        objectFit: 'contain',
                        backgroundColor: '#f5f5f5'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h4">
                        {product.name}
                      </Typography>
                      <Chip
                        label={`Available Quantity : ${product.availableItems}`}
                        sx={{
                          backgroundColor: '#3f51b5',
                          color: 'white',
                          borderRadius: 1,
                          fontSize: '0.875rem',
                          height: '32px'
                        }}
                      />
                    </Box>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      Category: {product.category}
                    </Typography>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }} paragraph>
                      {product.description}
                    </Typography>
                    <Typography variant="h5" color="error" gutterBottom>
                      ₹{product.price}
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <TextField
                        type="number"
                        label="Enter Quantity *"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                        inputProps={{ 
                          min: 1, 
                          max: product.availableItems,
                          style: { fontSize: '1rem' }
                        }}
                        sx={{ 
                          width: '100%',
                          maxWidth: '300px',
                          '& .MuiInputLabel-root': {
                            fontSize: '1rem'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Select Address</Typography>
            {addresses.length > 0 ? (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <Select
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  displayEmpty
                  error={error && !selectedAddress}
                >
                  <MenuItem value="" disabled>Select an address...</MenuItem>
                  {addresses.map((address) => (
                    <MenuItem key={address.id} value={address.id}>
                      <Box>
                        <Typography variant="subtitle1">{address.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {`${address.street}, ${address.city}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {`${address.state} - ${address.zipcode}`}
                        </Typography>
                        {address.landmark && (
                          <Typography variant="body2" color="text.secondary">
                            Landmark: {address.landmark}
                          </Typography>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {error && !selectedAddress && (
                  <FormHelperText error>Please select an address</FormHelperText>
                )}
              </FormControl>
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>
                No saved addresses found. Please add a new address below.
              </Alert>
            )}

            <Typography variant="body1" align="center" sx={{ my: 2 }}>
              -OR-
            </Typography>

            <Typography variant="h6" gutterBottom>Add Address</Typography>
            <Box component="form" onSubmit={handleAddressSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="name"
                    label="Name"
                    value={newAddress.name}
                    onChange={handleAddressInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="contactNumber"
                    label="Contact Number"
                    value={newAddress.contactNumber}
                    onChange={handleAddressInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="street"
                    label="Street"
                    value={newAddress.street}
                    onChange={handleAddressInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="city"
                    label="City"
                    value={newAddress.city}
                    onChange={handleAddressInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="state"
                    label="State"
                    value={newAddress.state}
                    onChange={handleAddressInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="landmark"
                    label="Landmark"
                    value={newAddress.landmark}
                    onChange={handleAddressInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="zipCode"
                    label="Zip Code"
                    value={newAddress.zipCode}
                    onChange={handleAddressInputChange}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  Save Address
                </Button>
              </Box>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            {product && (
              <>
                <Typography variant="h6" gutterBottom>Order Summary</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Product:</Typography>
                    <Typography variant="body1" color="text.secondary">{product.name}</Typography>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Quantity:</Typography>
                    <Typography variant="body1" color="text.secondary">{quantity}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Total Amount:</Typography>
                    <Typography variant="h6" color="primary">₹{product.price * quantity}</Typography>
                  </Grid>
                </Grid>
                {success && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Your order is confirmed.
                  </Alert>
                )}
              </>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            sx={{
              bgcolor: activeStep === 0 ? '#3f51b5' : undefined,
              '&:hover': {
                bgcolor: activeStep === 0 ? '#303f9f' : undefined
              }
            }}
          >
            {activeStep === 0 ? 'PLACE ORDER' : 
             activeStep === steps.length - 1 ? 'Place Order' : 
             'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateOrder; 