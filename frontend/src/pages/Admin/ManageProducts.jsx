import React from "react";
import Button from "../../components/ui/Button";
import "../../styles/Table.css";
import "./Admin.css";

const ManageProducts = () => {
	// Mock data
	const products = [
		{
			id: "1",
			name: "HP Laptop",
			category: "Electronics",
			price: 3000,
			stock: 50,
		},
		{ id: "2", name: "iPhone 14", category: "Phones", price: 999, stock: 100 },
	];
	return (
		<div className="admin-page container">
			<div className="page-header">
				<h1 className="admin-title">Manage Products</h1>
				<Button>Add New Product</Button>
			</div>
			<div className="table-container">
				<table className="data-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Category</th>
							<th>Price</th>
							<th>Stock</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{products.map((p) => (
							<tr key={p.id}>
								<td>{p.id}</td>
								<td>{p.name}</td>
								<td>{p.category}</td>
								<td>Rs {p.price}</td>
								<td>{p.stock}</td>
								<td>Edit / Delete</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ManageProducts;
