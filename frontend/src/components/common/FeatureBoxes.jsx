import React from "react";
import {
	FaTag,
	FaShippingFast,
	FaLeaf,
	FaBoxOpen,
	FaUndo,
} from "react-icons/fa";
import "./FeatureBoxes.css";

const FeatureBoxes = () => {
	const features = [
		{
			icon: <FaTag />,
			title: "Best prices & offers",
			subtitle: "Orders $50 or more",
		},
		{
			icon: <FaShippingFast />,
			title: "Free delivery",
			subtitle: "24/7 amazing services",
		},
		{
			icon: <FaLeaf />,
			title: "Great daily deal",
			subtitle: "When you sign up",
		},
		{
			icon: <FaBoxOpen />,
			title: "Wide assortment",
			subtitle: "Mega Discounts",
		},
		{ icon: <FaUndo />, title: "Easy returns", subtitle: "Within 30 days" },
	];

	return (
		<section className="feature-boxes-section container">
			{features.map((feature, index) => (
				<div key={index} className="feature-box">
					<div className="feature-icon">{feature.icon}</div>
					<div className="feature-text">
						<h4>{feature.title}</h4>
						<p>{feature.subtitle}</p>
					</div>
				</div>
			))}
		</section>
	);
};

export default FeatureBoxes;
