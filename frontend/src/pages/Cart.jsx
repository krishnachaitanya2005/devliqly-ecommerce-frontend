import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
	// Replace with actual cart state from context or Redux
	const [cartItems] = useState([]);

	if (cartItems.length === 0) {
		return (
			<div className="empty-state-container container">
				<div className="empty-state-icon">🛒</div>
				<h2>Your Cart is currently empty</h2>
				<Link to="/" className="continue-shopping-btn">
					Continue Shopping
				</Link>
			</div>
		);
	}

	return (
		<div className="cart-page container">
			<h2>Your Cart</h2>
			{/* Table of cart items would go here */}
		</div>
	);
};

export default Cart;
