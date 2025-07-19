import React from "react";
import { Link } from "react-router-dom";
import "./HomeCategories.css";

const HomeCategories = () => {
	// Updated data to match your image, including background colors
	const categories = [
		{
			name: "Fashion",
			image: "https://via.placeholder.com/60/FFDDC1/000000?Text=F",
			bgColor: "rgba(255, 221, 193, 0.5)",
		},
		{
			name: "Electronics",
			image: "https://via.placeholder.com/60/D4F1F4/000000?Text=E",
			bgColor: "rgba(212, 241, 244, 0.5)",
		},
		{
			name: "Bags",
			image: "https://via.placeholder.com/60/F6C6EA/000000?Text=B",
			bgColor: "rgba(246, 198, 234, 0.5)",
		},
		{
			name: "Footwear",
			image: "https://via.placeholder.com/60/B2EBF2/000000?Text=FW",
			bgColor: "rgba(178, 235, 242, 0.5)",
		},
		{
			name: "Groceries",
			image: "https://via.placeholder.com/60/FFE6E6/000000?Text=G",
			bgColor: "rgba(255, 230, 230, 0.5)",
		},
		{
			name: "Beauty",
			image: "https://via.placeholder.com/60/FADCD9/000000?Text=B",
			bgColor: "rgba(250, 220, 217, 0.5)",
		},
		{
			name: "Wellness",
			image: "https://via.placeholder.com/60/E1F5FE/000000?Text=W",
			bgColor: "rgba(225, 245, 254, 0.5)",
		},
		{
			name: "Jewellery",
			image: "https://via.placeholder.com/60/D1FFBD/000000?Text=J",
			bgColor: "rgba(209, 255, 189, 0.5)",
		},
	];

	return (
		<section className="home-categories-section container">
			<h2 className="section-title">Featured Categories</h2>
			<div className="categories-grid">
				{categories.map((category) => (
					<Link
						to={`/products/${category.name.toLowerCase()}`}
						key={category.name}
						className="category-item"
					>
						<div
							className="category-icon-circle"
							style={{ backgroundColor: category.bgColor }}
						>
							<img src={category.image} alt={category.name} />
						</div>
						<span>{category.name}</span>
					</Link>
				))}
			</div>
		</section>
	);
};

export default HomeCategories;
