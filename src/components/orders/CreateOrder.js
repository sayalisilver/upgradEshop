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
import { styled } from '@mui/material/styles';

// Styled components
const StyledConfirmContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  background: 'white',
  padding: '0',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr'
  }
});

const StyledDetailsBox = styled('div')(({ isRightSection }) => ({
  padding: '24px',
  background: '#fff',
  borderRight: isRightSection ? 'none' : '1px solid #e0e0e0',
  '@media (max-width: 768px)': {
    borderRight: 'none',
    borderBottom: isRightSection ? 'none' : '1px solid #e0e0e0'
  }
}));

const StyledProductName = styled(Typography)({
  fontSize: '28px',
  fontWeight: 700,
  marginBottom: '20px',
  color: '#000'
});

const StyledDescription = styled(Typography)({
  fontSize: '16px',
  fontStyle: 'italic',
  color: '#666',
  marginBottom: '20px',
  lineHeight: '1.6'
});

const StyledTotalPrice = styled(Typography)({
  fontSize: '24px',
  fontWeight: 700,
  color: '#f44336',
  marginTop: '20px'
});

const StyledLabel = styled(Typography)({
  fontSize: '16px',
  color: '#333',
  marginBottom: '8px'
});

const StyledAddressTitle = styled(Typography)({
  fontSize: '22px',
  fontWeight: 600,
  marginBottom: '20px',
  color: '#000'
});

const StyledButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',
  marginTop: '32px'
});

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
      // Format order request to match API requirements
      await orderAPI.create({
        quantity: quantity,
        product: id,  // Using product_id from URL params
        address: selectedAddress  // Using selected address ID
      });
      
      // Navigate to products page with success message
      navigate('/products', {
        state: { notification: 'Order placed successfully!' }
      });
    } catch (err) {
      setError('Failed to place order: ' + (err.response?.data?.message || err.message));
      console.error('Order creation error:', err);
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
        const selectedAddressDetails = addresses.find(addr => addr.id === selectedAddress);
        return (
          <Box>
            {product && selectedAddressDetails && (
              <>
                <Typography variant="h5" gutterBottom sx={{ 
                  color: '#3f51b5', 
                  mb: 3,
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 600
                }}>
                  
                </Typography>
                <StyledConfirmContainer>
                  {/* Order Details - Left Section */}
                  <StyledDetailsBox>
                    <StyledProductName>
                      {product.name}
                    </StyledProductName>
                    
                    <StyledLabel>
                      Quantity: {quantity}
                    </StyledLabel>
                    
                    <StyledLabel>
                      Category: {product.category}
                    </StyledLabel>
                    
                    <StyledDescription>
                      {product.description}
                    </StyledDescription>
                    
                    <StyledTotalPrice>
                      Total Price: ₹{product.price * quantity}
                    </StyledTotalPrice>
                  </StyledDetailsBox>

                  {/* Address Details - Right Section */}
                  <StyledDetailsBox isRightSection>
                    <StyledAddressTitle>
                      Address Details
                    </StyledAddressTitle>
                    
                    <StyledLabel sx={{ fontWeight: 600 }}>
                      {selectedAddressDetails.name}
                    </StyledLabel>
                    
                    <StyledLabel>
                      Contact: {selectedAddressDetails.contactNumber}
                    </StyledLabel>
                    
                    <Box sx={{ mt: 2 }}>
                      <StyledLabel>
                        {selectedAddressDetails.street},<br />
                        {selectedAddressDetails.city},<br />
                        {selectedAddressDetails.state},<br />
                        {selectedAddressDetails.zipcode}
                      </StyledLabel>
                      
                      {selectedAddressDetails.landmark && (
                        <StyledLabel sx={{ color: '#666', mt: 1 }}>
                          Landmark: {selectedAddressDetails.landmark}
                        </StyledLabel>
                      )}
                    </Box>
                  </StyledDetailsBox>
                </StyledConfirmContainer>
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

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: 3,
          gap: 2
        }}>
          {activeStep !== 0 && (
            <Button
              onClick={handleBack}
              variant="outlined"
              sx={{
                minWidth: '120px',
                borderColor: '#3f51b5',
                color: '#3f51b5'
              }}
            >
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            sx={{
              bgcolor: '#3f51b5',
              '&:hover': {
                bgcolor: '#303f9f'
              },
              minWidth: '120px',
              ...(activeStep === steps.length - 1 && {
                fontSize: '1rem',
                py: 1
              })
            }}
          >
            {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateOrder; 