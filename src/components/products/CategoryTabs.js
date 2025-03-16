import React, { useState, useEffect } from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { productsAPI } from '../../services/api';

const CategoryTabs = ({ selectedCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState(['ALL']);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productsAPI.getCategories();
        if (Array.isArray(response) && response.length > 0) {
          setCategories(['ALL', ...response]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Box sx={{ mb: 3, overflowX: 'auto' }}>
      <ToggleButtonGroup
        value={selectedCategory}
        exclusive
        onChange={(e, newCategory) => {
          if (newCategory !== null) {
            onCategoryChange(newCategory);
          }
        }}
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
  );
};

export default CategoryTabs; 