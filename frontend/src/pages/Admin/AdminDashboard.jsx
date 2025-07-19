import React from "react";
import "./Admin.css";

const AdminDashboard = () => {
	return (
		<div className="admin-page container">
			<h1 className="admin-title">Admin Dashboard</h1>
			<div className="summary-cards">
				<div className="card">
					<h3>Total Orders</h3>
					<p>1,234</p>
				</div>
				<div className="card">
					<h3>Total Revenue</h3>
					<p>Rs 5,43,210</p>
				</div>
				<div className="card">
					<h3>Total Users</h3>
					<p>567</p>
				</div>
				<div className="card">
					<h3>Total Products</h3>
					<p>89</p>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
