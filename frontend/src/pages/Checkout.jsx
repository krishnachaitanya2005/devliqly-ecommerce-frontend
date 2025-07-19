import React from "react";
import Button from "../components/ui/Button";
import "../styles/Form.css";

const Checkout = () => {
	return (
		<div className="container">
			<form className="form-container">
				<h2 className="form-title">Shipping Details</h2>
				<div className="form-grid">
					<div className="input-group">
						<label htmlFor="firstName">First Name</label>
						<input type="text" id="firstName" name="firstName" required />
					</div>
					<div className="input-group">
						<label htmlFor="lastName">Last Name</label>
						<input type="text" id="lastName" name="lastName" required />
					</div>
					<div className="input-group">
						<label htmlFor="address">Address</label>
						<input type="text" id="address" name="address" required />
					</div>
					<div className="input-group">
						<label htmlFor="city">City</label>
						<input type="text" id="city" name="city" required />
					</div>
					<div className="input-group">
						<label htmlFor="pincode">Pincode</label>
						<input type="text" id="pincode" name="pincode" required />
					</div>
					<div className="input-group">
						<label htmlFor="phone">Phone Number</label>
						<input type="tel" id="phone" name="phone" required />
					</div>
				</div>

				<h2 className="form-title" style={{ marginTop: "40px" }}>
					Payment Method
				</h2>
				{/* Payment gateway integration (e.g., Stripe, Razorpay) would go here */}
				<p>Payment Gateway Placeholder</p>

				<div className="form-actions">
					<Button type="submit">Place Order</Button>
				</div>
			</form>
		</div>
	);
};

export default Checkout;
