import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaEye } from "react-icons/fa";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
	const { _id, name, images, price, originalPrice, category, brand } = product;

	return (
		<div className="product-card">
			<div className="product-image-container">
				<Link to={`/product/${_id}`}>
					<img
						src={images[0]?.url || "https://via.placeholder.com/250"}
						alt={name}
					/>
				</Link>
				<div className="product-hover-icons">
					<button className="icon-btn">
						<FaHeart />
					</button>
					<button className="icon-btn">
						<FaEye />
					</button>
				</div>
			</div>
			<div className="product-info">
				<span className="product-category">{category}</span>
				<h3 className="product-name">
					<Link to={`/product/${_id}`}>{name}</Link>
				</h3>
				<span className="product-brand">By {brand}</span>
				<div className="product-rating">
					<span>⭐⭐⭐⭐☆</span>
				</div>
				<div className="product-price-container">
					<span className="product-price">Rs {price}</span>
					{originalPrice && (
						<span className="product-original-price">Rs {originalPrice}</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
