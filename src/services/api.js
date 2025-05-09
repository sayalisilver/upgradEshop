import axios from 'axios';

const BASE_URL = 'https://dev-project-ecommerce.upgrad.dev/api';
const X_AUTH_TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkZW1vQGRlbW8uY29tIiwiaWF0IjoxNzQyNDAxMTY5LCJleHAiOjE3NDI0MDk1Njl9.qUZq82xnW6nviPr6z_WfSF1b1akEyf9zkcOnQ-9g7B9pDRjXrSYwG2AjbO0HNiukQNQsIsn7jDKLnmBp-hm2-g';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkZW1vLmNvbSIsImlhdCI6MTc0MjQwMzYzNSwiZXhwIjoxNzQyNDEyMDM1fQ.R-S8XsNvgZn1KtjtbKw4-z1En8kCXarTq9knntlH4PgNf2dBE15iI_v1xyWQvQk0r5TbKD1xYQkF_fPuzJ1vkg';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-auth-token': X_AUTH_TOKEN
  }
});

// Auth APIs
export const authAPI = {
  login: async (data) => {
    console.log('API login request data:', data);
    const response = await axios.post(`${BASE_URL}/auth/signin`, {
      username: data.email,
      password: data.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },
  signup: async (data) => {
    try {
      console.log('Starting signup with data:', data);
      // Format the data according to API requirements
      const formattedData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        role: ["admin"],  // Changed to match the required format
        lastName: data.lastName,
        contactNumber: data.contactNumber
      };
      
      console.log('Formatted signup data:', formattedData);
      
      const response = await axios.post(`${BASE_URL}/auth/signup`, formattedData, {
        headers: {
          'Content-Type': 'application/json',
          
        }
      });
      
      console.log('Signup response:', response.data);
      
      
      // If signup returns a token, store it
      if (response.data.token) {
        localStorage.setItem('x-auth-token', response.data.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isAdmin', true); // Since we're signing up as admin
      }
      
      return response.data;
    } catch (error) {
      console.error('Signup error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  }
};

// Products APIs
export const productsAPI = {
  fetchAll: async () => {
    try {
      console.log('Fetching all products...');
      const response = await axios.get(`${BASE_URL}/products`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-auth-token': X_AUTH_TOKEN
        }
      });
      console.log('Products data:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error in fetchAll:', error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      console.log('Fetching categories...');
      const response = await axios.get(`${BASE_URL}/products/categories`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-auth-token': X_AUTH_TOKEN
        }
      });
      console.log('Categories data:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error in getCategories:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      console.log('Fetching product details for id:', id);
      console.log('Using admin token for product fetch');
      
      const response = await axios({
        method: 'get',
        url: `${BASE_URL}/products/${id}`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-auth-token': ADMIN_TOKEN
        }
      });

      console.log('Product details fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getById:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  },

  create: async (productData) => {
    try {
      console.log('Creating new product with data:', productData);
      console.log('Using admin token for product creation');
      
      const response = await axios({
        method: 'post',
        url: `${BASE_URL}/products`,
        data: productData,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-auth-token': ADMIN_TOKEN
        }
      });
      
      console.log('Product creation successful:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating product:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  },

  update: async (id, productData) => {
    try {
      console.log('Updating product with ID:', id);
      console.log('Update product data:', productData);
      console.log('Using admin token for product update');

      // Ensure the data structure matches exactly what the API expects
      const formattedData = {
        name: productData.name,
        category: productData.category,
        price: Number(productData.price),
        description: productData.description || '',
        manufacturer: productData.manufacturer,
        availableItems: Number(productData.availableItems),
        imageUrl: productData.imageUrl || ''
      };

      console.log('Formatted request data:', formattedData);

      const response = await axios({
        method: 'put',
        url: `${BASE_URL}/products/${id}`,
        data: formattedData,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-auth-token': ADMIN_TOKEN
        }
      });
      
      console.log('Product update successful:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating product:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        productId: id,
        productData: productData
      });
      if (error.response?.status === 403) {
        console.error('Authorization error - token may be invalid or expired');
      }
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log('Deleting product with ID:', id);
      console.log('Using admin token for product deletion');
      
      const response = await axios({
        method: 'delete',
        url: `${BASE_URL}/products/${id}`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-auth-token': ADMIN_TOKEN
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

// Address APIs
export const addressAPI = {
  getAll: async () => {
    try {
      console.log('Starting address fetch...');
      console.log('Using hardcoded token');
      
      const response = await axios.get(`${BASE_URL}/addresses`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-auth-token': X_AUTH_TOKEN
        }
      });
      
      console.log('Address API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching addresses:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  },

  create: async (addressData) => {
    try {
      console.log('Creating address with data:', addressData);
      
      // Format the data according to API requirements
      const formattedData = {
        name: addressData.name,
        contactNumber: addressData.contactNumber,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        landmark: addressData.landmark || '',
        zipcode: addressData.zipCode
      };
      
      console.log('Formatted address data:', formattedData);
      
      const response = await axios.post(`${BASE_URL}/addresses`, formattedData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-auth-token': X_AUTH_TOKEN
        }
      });
      
      console.log('Address creation successful:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating address:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        requestData: addressData
      });
      throw error;
    }
  }
};

// Order APIs
export const orderAPI = {
  create: async (orderData) => {
    try {
      console.log('Creating order:', orderData);
      const response = await axios.post(`${BASE_URL}/orders`, orderData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-auth-token': X_AUTH_TOKEN
        }
      });
      console.log('Order creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
};

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response interceptor success:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText
    });
    return response;
  },
  (error) => {
    console.error('Response interceptor error:', {
      url: error.config?.url,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('Unauthorized access, redirecting to login...');
          window.location.href = '/login';
          break;
        case 403:
          console.log('Forbidden access');
          break;
        default:
          console.log(`Unhandled error status: ${error.response.status}`);
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api; 