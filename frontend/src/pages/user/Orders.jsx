import React from "react";
import "../../styles/Table.css";
import "./Orders.css";

const Orders = () => {
	// Mock orders data
	const orders = [
		{
			id: "ORD-123",
			products: "HP Laptop",
			date: "2025-07-15",
			total: 3000,
			status: "processing",
		},
		{
			id: "ORD-124",
			products: "iPhone 14",
			date: "2025-07-10",
			total: 999,
			status: "delivered",
		},
		{
			id: "ORD-125",
			products: "Galaxy Watch",
			date: "2025-07-05",
			total: 250,
			status: "cancelled",
		},
	];
	return (
		<div className="container">
			<h1 className="page-title">My Orders</h1>
			<div className="table-container">
				<table className="data-table">
					<thead>
						<tr>
							<th>Order ID</th>
							<th>Products</th>
							<th>Date</th>
							<th>Total Amount</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr key={order.id}>
								<td>{order.id}</td>
								<td>{order.products}</td>
								<td>{order.date}</td>
								<td>Rs {order.total}</td>
								<td>
									<span className={`status-badge status-${order.status}`}>
										{order.status}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Orders;
