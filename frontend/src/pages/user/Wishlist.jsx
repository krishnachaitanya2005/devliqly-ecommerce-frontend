import React from "react";
import { Link } from "react-router-dom";
import "./Wishlist.css";

const Wishlist = () => {
	// Replace with actual wishlist state
	const wishlistItems = [];

	if (wishlistItems.length === 0) {
		return (
			<div className="empty-state-container container">
				<div className="empty-state-icon">❤️</div>
				<h2>Your Wishlist is currently empty</h2>
				<p>Add items you love to your wishlist to see them here.</p>
				<Link to="/" className="continue-shopping-btn">
					Continue Shopping
				</Link>
			</div>
		);
	}

	return (
		<div className="wishlist-page container">
			<h2>My Wishlist</h2>
			{/* Grid of ProductCards would go here */}
		</div>
	);
};

export default Wishlist;
