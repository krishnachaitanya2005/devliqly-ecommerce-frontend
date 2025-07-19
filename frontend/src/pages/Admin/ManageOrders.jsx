import React from "react";
import "../../styles/Table.css";
import "./Admin.css";

const ManageOrders = () => {
	// Mock orders data - replace with API call
	const orders = [
		{
			id: "ORD-123",
			customer: "John Doe",
			date: "2025-07-15",
			total: 3000,
			status: "processing",
		},
		{
			id: "ORD-124",
			customer: "Jane Smith",
			date: "2025-07-10",
			total: 999,
			status: "delivered",
		},
		{
			id: "ORD-125",
			customer: "Peter Jones",
			date: "2025-07-05",
			total: 250,
			status: "cancelled",
		},
		{
			id: "ORD-126",
			customer: "Mary Jane",
			date: "2025-07-16",
			total: 1250,
			status: "processing",
		},
		{
			id: "ORD-127",
			customer: "Chris Green",
			date: "2025-07-11",
			total: 850,
			status: "delivered",
		},
	];

	return (
		<div className="admin-page container">
			<div className="page-header">
				<h1 className="admin-title">Manage Orders</h1>
			</div>
			<div className="table-container">
				<table className="data-table">
					<thead>
						<tr>
							<th>Order ID</th>
							<th>Customer Name</th>
							<th>Date</th>
							<th>Total Amount</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr key={order.id}>
								<td>{order.id}</td>
								<td>{order.customer}</td>
								<td>{order.date}</td>
								<td>Rs {order.total}</td>
								<td>
									<span className={`status-badge status-${order.status}`}>
										{order.status}
									</span>
								</td>
								<td>
									<button className="action-btn">View Details</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ManageOrders;
