import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/common/ProductCard";
// import { getProducts } from '../services/api';
import "./ProductListing.css";

const ProductListing = () => {
	const { category } = useParams();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	// Mock data - replace with API call
	const mockProducts = [
		{
			_id: "1",
			name: "HP Laptop 15s",
			images: [{ url: "" }],
			price: 3000,
			originalPrice: 3500,
			category: "Electronics",
			brand: "HP",
		},
		{
			_id: "2",
			name: "Apple iPhone 14 Pro",
			images: [{ url: "" }],
			price: 999,
			originalPrice: 1099,
			category: "Phones",
			brand: "Apple",
		},
		{
			_id: "3",
			name: "Samsung Galaxy Watch 5",
			images: [{ url: "" }],
			price: 250,
			originalPrice: 299,
			category: "Watches",
			brand: "Samsung",
		},
		{
			_id: "4",
			name: "Sony Alpha a7 IV",
			images: [{ url: "" }],
			price: 1200,
			originalPrice: 1350,
			category: "Cameras",
			brand: "Sony",
		},
		{
			_id: "5",
			name: "VNEED Women Embroidered Kurta",
			images: [{ url: "" }],
			price: 450,
			originalPrice: 490,
			category: "Fashion",
			brand: "VNEED",
		},
		{
			_id: "6",
			name: "Black Solid Casual Shirt",
			images: [{ url: "" }],
			price: 459,
			originalPrice: 495,
			category: "Fashion",
			brand: "V-Mart",
		},
	];

	useEffect(() => {
		setLoading(true);
		// getProducts(category).then(response => {
		//   setProducts(response.data);
		//   setLoading(false);
		// });
		setTimeout(() => {
			// Simulate API delay
			setProducts(mockProducts);
			setLoading(false);
		}, 500);
	}, [category]);

	return (
		<div className="product-listing-page container">
			<aside className="filters-sidebar">
				<h3>Filters</h3>
				{/* Filter options will go here */}
				<div className="filter-group">
					<h4>Category</h4>
					<ul>
						<li>
							<a href="#">Electronics</a>
						</li>
						<li>
							<a href="#">Fashion</a>
						</li>
						<li>
							<a href="#">Groceries</a>
						</li>
					</ul>
				</div>
				<div className="filter-group">
					<h4>Price Range</h4>
					<input type="range" min="0" max="5000" />
				</div>
			</aside>
			<main className="products-main">
				<h2 className="listing-title">
					{category ? `Category: ${category}` : "All Products"}
				</h2>
				{loading ? (
					<p>Loading products...</p>
				) : (
					<div className="products-grid">
						{products.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>
				)}
			</main>
		</div>
	);
};

export default ProductListing;
