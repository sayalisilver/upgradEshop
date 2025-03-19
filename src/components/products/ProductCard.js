import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Box, Stack, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductCard = ({ product, isAdmin, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleBuy = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "4px",
        backgroundColor: "#fff"
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl || "https://via.placeholder.com/250"}
        alt={product.name}
        sx={{
          objectFit: "contain",
          p: 2,
          backgroundColor: "#f8f8f8"
        }}
      />

      <CardContent sx={{ p: 2, pt: 0, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Title and Price */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ mb: 1 }}
        >
          <Typography 
            variant="h6" 
            component="h2"
            sx={{ 
              fontSize: "1.25rem",
              color: "rgb(72, 85, 99)"
            }}
          >
            {product.name}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: "rgb(72, 85, 99)"
            }}
          >
            ₹ {product.price}
          </Typography>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: "rgb(144, 152, 170)",
            mb: 2,
            lineHeight: 1.4,
            flex: 1,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical"
          }}
        >
          {product.description}
        </Typography>

        {/* Buy Button and Admin Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Button
            variant="contained"
            onClick={handleBuy}
            sx={{
              backgroundColor: "rgb(63, 81, 181)",
              color: "#fff",
              textTransform: "uppercase",
              borderRadius: "4px",
              py: 0.5,
              px: 3,
              "&:hover": {
                backgroundColor: "rgb(48, 63, 159)"
              }
            }}
          >
            BUY
          </Button>
          
          {isAdmin && (
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => onEdit(product.id)}
                size="small"
                sx={{
                  color: '#666',
                  '&:hover': { color: '#3f51b5' }
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => onDelete(product.id, product.name)}
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
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 