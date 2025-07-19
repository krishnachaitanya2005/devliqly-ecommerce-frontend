import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { registerUser } from '../../services/api'; // API call placeholder
import "./AuthForm.css";

const SignUp = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Signing up with:", formData);
		// registerUser(formData).then(...)
	};

	return (
		<div className="auth-container">
			<div className="auth-form-wrapper">
				<h2 className="auth-title">Sign Up</h2>
				<form onSubmit={handleSubmit}>
					<div className="input-group">
						<label htmlFor="name">Full Name</label>
						<input
							type="text"
							name="name"
							id="name"
							required
							onChange={handleChange}
						/>
					</div>
					<div className="input-group">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							name="email"
							id="email"
							required
							onChange={handleChange}
						/>
					</div>
					<div className="input-group">
						<label htmlFor="phone">Phone</label>
						<input
							type="tel"
							name="phone"
							id="phone"
							required
							onChange={handleChange}
						/>
					</div>
					<div className="input-group">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							name="password"
							id="password"
							required
							onChange={handleChange}
						/>
					</div>
					<button type="submit" className="auth-button">
						Sign Up
					</button>
				</form>
				<div className="auth-separator">OR</div>
				<button className="google-signin-btn">Sign in with Google</button>
				<p className="auth-redirect">
					Already have an account? <Link to="/login">Sign In</Link>
				</p>
			</div>
		</div>
	);
};

export default SignUp;
