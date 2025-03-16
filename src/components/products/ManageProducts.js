import React, { useState } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Chip } from '@mui/material';

const BASE_URL = 'https://dev-project-ecommerce.upgrad.dev/api';
const token = localStorage.getItem('authToken');

const ManageProducts = ({ product, refetch }) => {
  const [editProduct, setEditProduct] = useState(product);
  const [openDialog, setOpenDialog] = useState(false);

  const updateProduct = async () => {
    await axios.put(`${BASE_URL}/products/${product.id}`, editProduct, {
      headers: { 'x-auth-token': token }
    });
    alert(`Product ${editProduct.name} modified successfully`);
    refetch();
  };

  const confirmDelete = () => {
    setOpenDialog(true);
  };

  const deleteProduct = async () => {
    await axios.delete(`${BASE_URL}/products/${product.id}`, {
      headers: { 'x-auth-token': token }
    });
    alert(`Product ${product.name} deleted successfully`);
    refetch();
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  return (
    <Card style={{ margin: '10px' }}>
      <CardContent>
        <TextField label="Name" name="name" value={editProduct.name} onChange={handleInputChange} />
        <TextField label="Category" name="category" value={editProduct.category} onChange={handleInputChange} />
        <TextField label="Price" name="price" value={editProduct.price} onChange={handleInputChange} />
        <TextField label="Description" name="description" value={editProduct.description} onChange={handleInputChange} />
        <TextField label="Manufacturer" name="manufacturer" value={editProduct.manufacturer} onChange={handleInputChange} />
        <TextField label="Available Items" name="availableItems" value={editProduct.availableItems} onChange={handleInputChange} />
        <Chip label={`Category: ${editProduct.category}`} style={{ marginBottom: '10px' }} />
        <Button onClick={updateProduct} variant="contained" color="primary">Update</Button>
        <Button onClick={confirmDelete} color="secondary">Delete</Button>
      </CardContent>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete {product.name}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
          <Button onClick={deleteProduct} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ManageProducts;
