import React from "react";
import Button from "../../components/ui/Button";
import "../../styles/Table.css";
import "./Admin.css";

const ManageCategories = () => {
	// Mock category data - replace with API call
	const categories = [
		{ id: "cat-01", name: "Electronics", productCount: 125 },
		{ id: "cat-02", name: "Fashion", productCount: 340 },
		{ id: "cat-03", name: "Groceries", productCount: 510 },
		{ id: "cat-04", name: "Footwear", productCount: 88 },
		{ id: "cat-05", name: "Bags", productCount: 75 },
	];

	return (
		<div className="admin-page container">
			<div className="page-header">
				<h1 className="admin-title">Manage Categories</h1>
				<Button>Add New Category</Button>
			</div>
			<div className="table-container">
				<table className="data-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Number of Products</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{categories.map((category) => (
							<tr key={category.id}>
								<td>{category.id}</td>
								<td>{category.name}</td>
								<td>{category.productCount}</td>
								<td>
									<button className="action-btn">Edit</button>
									<button className="action-btn-delete">Delete</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ManageCategories;
