import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import "./ProductDetail.css";

const ProductDetail = () => {
	const { id } = useParams();
	const [quantity, setQuantity] = useState(1);
	const [activeTab, setActiveTab] = useState("description");

	// Mock data - replace with API call to getProductById(id)
	const product = {
		name: "HP Laptop 15s",
		price: 3000,
		originalPrice: 3500,
		reviews: 11,
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		additionalInfo:
			"Weight: 1.7kg, Dimensions: 35.85 x 24.2 x 1.79 cm, Color: Silver",
		images: [
			"/placeholder-main.png",
			"/placeholder-thumb1.png",
			"/placeholder-thumb2.png",
		], // Use placeholder paths
	};

	return (
		<div className="product-detail-page container">
			<div className="detail-grid">
				<div className="product-gallery">
					<div className="main-image">
						<img src={product.images[0]} alt={product.name} />
					</div>
					<div className="thumbnail-images">
						{product.images.map((img, index) => (
							<img key={index} src={img} alt={`thumbnail ${index + 1}`} />
						))}
					</div>
				</div>
				<div className="product-details">
					<h1>{product.name}</h1>
					<div className="details-rating">
						<span>⭐⭐⭐⭐⭐</span> ({product.reviews} reviews)
					</div>
					<div className="details-price">
						<span className="current-price">Rs {product.price}</span>
						<span className="original-price">Rs {product.originalPrice}</span>
					</div>
					<p className="details-description">
						{product.description.substring(0, 150)}...
					</p>
					<div className="details-actions">
						<div className="quantity-selector">
							<button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
								-
							</button>
							<span>{quantity}</span>
							<button onClick={() => setQuantity((q) => q + 1)}>+</button>
						</div>
						<Button variant="primary">Add To Cart</Button>
					</div>
				</div>
			</div>
			<div className="product-info-tabs">
				<div className="tab-headers">
					<h3
						onClick={() => setActiveTab("description")}
						className={activeTab === "description" ? "active" : ""}
					>
						Description
					</h3>
					<h3
						onClick={() => setActiveTab("info")}
						className={activeTab === "info" ? "active" : ""}
					>
						Additional Info
					</h3>
					<h3
						onClick={() => setActiveTab("reviews")}
						className={activeTab === "reviews" ? "active" : ""}
					>
						Reviews ({product.reviews})
					</h3>
				</div>
				<div className="tab-content">
					{activeTab === "description" && <p>{product.description}</p>}
					{activeTab === "info" && <p>{product.additionalInfo}</p>}
					{activeTab === "reviews" && <p>Reviews would be listed here.</p>}
				</div>
			</div>
		</div>
	);
};

export default ProductDetail;
