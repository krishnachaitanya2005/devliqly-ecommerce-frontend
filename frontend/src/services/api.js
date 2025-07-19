import axios from "axios";

const API_URL = "http://localhost:5000/api/v1"; // Change to backend URL

const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// add an interceptor to include the auth token
// api.interceptors.request.use(...)

// PRODUCT API CALLS
export const getProducts = (category = "") =>
	api.get(`/products?category=${category}`);
export const getProductById = (id) => api.get(`/product/${id}`);

// AUTH API CALLS
export const loginUser = (credentials) => api.post("/login", credentials);
export const registerUser = (userData) => api.post("/register", userData);

// Add other API functions for cart, orders, etc.

export default api;
