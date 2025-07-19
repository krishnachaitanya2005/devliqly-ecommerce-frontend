import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
	FaMapMarkerAlt,
	FaHeart,
	FaShoppingCart,
	FaUser,
	FaAngleDown,
	FaSearch,
	FaSignOutAlt,
	FaBoxOpen,
	FaRegHeart,
} from "react-icons/fa";
import { useOnClickOutside } from "../../hooks/useClicksOutside";
import allCountries from "../../data/countries";
import "./Header.css";

const Header = () => {
	// State for click-based dropdowns
	const [isLocationOpen, setIsLocationOpen] = useState(false);
	const [isAccountOpen, setIsAccountOpen] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState("All");
	const [locationSearchTerm, setLocationSearchTerm] = useState("");

	// State to track the hovered navigation item
	const [hoveredItem, setHoveredItem] = useState(null);

	const locationRef = useRef();
	const accountRef = useRef();
	useOnClickOutside(locationRef, () => setIsLocationOpen(false));
	useOnClickOutside(accountRef, () => setIsAccountOpen(false));

	const navItems = [
		{ label: "Home", link: "/" },
		{ label: "Fashion", link: "/products/fashion", dropdown: ["Men", "Women"] },
		{
			label: "Electronics",
			link: "/products/electronics",
			dropdown: ["Laptops", "Mobiles", "Cameras", "Headphones"],
		},
		{
			label: "Bags",
			link: "/products/bags",
			dropdown: ["Mens Bags", "Womens Bags"],
		},
		{
			label: "Footwear",
			link: "/products/footwear",
			dropdown: ["Mens Footwear", "Womens Footwear"],
		},
		{ label: "Groceries", link: "/products/groceries" },
		{ label: "Beauty", link: "/products/beauty" },
		{ label: "Shop", link: "/products", dropdown: ["By Brand", "By Category"] },
	];

	const filteredCountries = allCountries.filter((country) =>
		country.label.toLowerCase().includes(locationSearchTerm.toLowerCase())
	);

	const handleCountrySelect = (countryLabel) => {
		setSelectedCountry(countryLabel);
		setIsLocationOpen(false);
		setLocationSearchTerm("");
	};

	return (
		<header className="header">
			<div className="header-top">
				<div className="header-container">
					<Link to="/" className="logo">
						SHOPSTIC
					</Link>
					<div className="search-bar">
						<input type="text" placeholder="Search for items..." />
						<FaSearch className="search-icon" />
					</div>
					<div className="header-actions">
						<div ref={locationRef} className="action-item-wrapper">
							<div
								className="action-item"
								onClick={() => setIsLocationOpen(!isLocationOpen)}
							>
								<FaMapMarkerAlt />
								<span>{selectedCountry}</span>
								<FaAngleDown
									className={`dropdown-arrow ${isLocationOpen ? "open" : ""}`}
								/>
							</div>
							{isLocationOpen && (
								<div className="dropdown-menu location-dropdown">
									<input
										type="text"
										placeholder="Search country..."
										value={locationSearchTerm}
										onChange={(e) => setLocationSearchTerm(e.target.value)}
									/>
									<ul>
										{filteredCountries.map((country) => (
											<li
												key={country.label}
												onClick={() => handleCountrySelect(country.label)}
											>
												{country.label}
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
						<Link to="/my-wishlist" className="action-item">
							<FaHeart /> <span>Wishlist</span>
						</Link>
						<Link to="/cart" className="action-item">
							<FaShoppingCart /> <span>Cart</span>
						</Link>
						<div ref={accountRef} className="action-item-wrapper">
							<div
								className="action-item"
								onClick={() => setIsAccountOpen(!isAccountOpen)}
							>
								<FaUser /> <span>Account</span>
								<FaAngleDown
									className={`dropdown-arrow ${isAccountOpen ? "open" : ""}`}
								/>
							</div>
							{isAccountOpen && (
								<div className="dropdown-menu account-dropdown">
									<ul>
										<li>
											<Link to="/my-account">
												<FaUser /> My Account
											</Link>
										</li>
										<li>
											<Link to="/my-orders">
												<FaBoxOpen /> Orders
											</Link>
										</li>
										<li>
											<Link to="/my-wishlist">
												<FaRegHeart /> My Wishlist
											</Link>
										</li>
										<li>
											<Link to="#">
												<FaSignOutAlt /> Sign Out
											</Link>
										</li>
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="header-bottom">
				<div className="header-container">
					<nav className="category-nav">
						<ul>
							{navItems.map((item) => (
								// Add mouse enter/leave events to the list item
								<li
									key={item.label}
									onMouseEnter={() => setHoveredItem(item.label)}
									onMouseLeave={() => setHoveredItem(null)}
								>
									<Link to={item.link || "#"}>
										{item.label}
										{item.dropdown && (
											<FaAngleDown className="dropdown-arrow-cat" />
										)}
									</Link>
									{item.dropdown && (
										<ul
											className="category-dropdown"
											style={{
												display: hoveredItem === item.label ? "block" : "none",
											}}
										>
											{item.dropdown.map((subItem) => (
												<li key={subItem}>
													<Link to="#">{subItem}</Link>
												</li>
											))}
										</ul>
									)}
								</li>
							))}
						</ul>
					</nav>
					<div className="support-info">
						<span>1900 - 888</span>
						<p>24/7 Support Center</p>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
