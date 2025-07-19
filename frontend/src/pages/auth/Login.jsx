import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { loginUser } from '../../services/api'; // API call placeholder
import "./AuthForm.css";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Logging in with:", formData);
		// loginUser(formData).then(...)
	};

	return (
		<div className="auth-container">
			<div className="auth-form-wrapper">
				<h2 className="auth-title">Sign In</h2>
				<form onSubmit={handleSubmit}>
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
						<label htmlFor="password">Password</label>
						<input
							type="password"
							name="password"
							id="password"
							required
							onChange={handleChange}
						/>
					</div>
					<Link to="/forgot-password" className="forgot-password">
						Forgot Password?
					</Link>
					<button type="submit" className="auth-button">
						Sign In
					</button>
				</form>
				<div className="auth-separator">OR</div>
				<button className="google-signin-btn">Sign in with Google</button>
				<p className="auth-redirect">
					Don't have an account? <Link to="/signup">Sign Up</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
