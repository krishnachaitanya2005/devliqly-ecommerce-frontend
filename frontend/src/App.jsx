import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Account from "./pages/user/Account";
import Orders from "./pages/user/Orders";
import Wishlist from "./pages/user/Wishlist";
import AdminDashboard from "./pages/Admin/AdminDashboard";
// Import other admin pages as needed

function App() {
	return (
		<div className="app">
			<Header />
			<main className="main-content">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/products" element={<ProductListing />} />
					<Route path="/products/:category" element={<ProductListing />} />
					<Route path="/product/:id" element={<ProductDetail />} />
					<Route path="/cart" element={<Cart />} />
					<Route path="/checkout" element={<Checkout />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/my-account" element={<Account />} />
					<Route path="/my-orders" element={<Orders />} />
					<Route path="/my-wishlist" element={<Wishlist />} />
					<Route path="/admin" element={<AdminDashboard />} />
					{/* Add other admin routes here */}
				</Routes>
			</main>
			<Footer />
		</div>
	);
}

export default App;
