import React, { useState, useEffect } from "react";
import ProductCard from "../common/ProductCard";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./PopularProducts.css";

// This is your master list of all popular products
const allPopularProducts = [
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
	{
		_id: "3",
		name: "Samsung Galaxy Watch 5",
		images: [{ url: "" }],
		price: 250,
		originalPrice: 299,
		category: "Electronics",
		brand: "Samsung",
	},
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
		_id: "7",
		name: "Classic Leather Bag",
		images: [{ url: "" }],
		price: 120,
		originalPrice: 150,
		category: "Bags",
		brand: "Generic",
	},
	{
		_id: "8",
		name: "Running Shoes",
		images: [{ url: "" }],
		price: 80,
		originalPrice: 100,
		category: "Footwear",
		brand: "BrandX",
	},
	{
		_id: "9",
		name: "Organic Apples",
		images: [{ url: "" }],
		price: 5,
		originalPrice: 6,
		category: "Groceries",
		brand: "FarmFresh",
	},
];

const PopularProducts = () => {
	// State to hold the products that are currently visible
	const [filteredProducts, setFilteredProducts] = useState([]);

	// State to manage the currently selected tab
	const [currentTab, setCurrentTab] = useState("All");

	// The categories for your tabs
	const tabCategories = [
		"All",
		"Fashion",
		"Electronics",
		"Bags",
		"Footwear",
		"Groceries",
	];

	// This effect runs whenever the currentTab changes
	useEffect(() => {
		if (currentTab === "All") {
			setFilteredProducts(allPopularProducts);
		} else {
			const filtered = allPopularProducts.filter(
				(product) => product.category === currentTab
			);
			setFilteredProducts(filtered);
		}
	}, [currentTab]); // Dependency array - effect re-runs when currentTab changes

	const handleTabChange = (event, newValue) => {
		setCurrentTab(newValue);
	};

	return (
		<section className="popular-products-section container">
			<div className="section-header">
				<h2 className="section-title">Popular Products</h2>
				<Box sx={{ bgcolor: "background.paper" }}>
					<Tabs
						value={currentTab}
						onChange={handleTabChange}
						variant="scrollable"
						scrollButtons="auto"
						aria-label="popular products categories"
						sx={{
							"& .MuiTabs-indicator": {
								backgroundColor: "var(--primary-color)",
							},
							"& .MuiTab-root": {
								color: "var(--light-text-color)",
								textTransform: "capitalize",
							},
							"& .Mui-selected": { color: "var(--primary-color) !important" },
						}}
					>
						{tabCategories.map((category) => (
							<Tab key={category} label={category} value={category} />
						))}
					</Tabs>
				</Box>
			</div>

			<div className="products-grid">
				{filteredProducts.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</section>
	);
};

export default PopularProducts;
