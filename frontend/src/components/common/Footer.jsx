import React from "react";
import { Link } from "react-router-dom";
import {
	FaMapMarkerAlt,
	FaHeadset,
	FaEnvelope,
	FaClock,
	FaFacebookF,
	FaTwitter,
	FaInstagram,
	FaYoutube,
} from "react-icons/fa";
import Newsletter from "./Newsletter";
import FeatureBoxes from "./FeatureBoxes";
import "./Footer.css";

const Footer = () => {
	return (
		<>
			<Newsletter />
			<FeatureBoxes />
			<footer className="footer">
				<div className="footer-container container">
					<div className="footer-column">
						<Link to="/" className="footer-logo">
							SHOPSTIC
						</Link>
						<p className="footer-desc">
							Awesome grocery store website template
						</p>
						<ul className="contact-info">
							<li>
								<FaMapMarkerAlt /> <strong>Address:</strong> 5171 W Campbell Ave
								undefined Kent, Utah 53127 United States
							</li>
							<li>
								<FaHeadset /> <strong>Call Us:</strong> (+91) - 540-025-12453
							</li>
							<li>
								<FaEnvelope /> <strong>Email:</strong> sale@nest.com
							</li>
							<li>
								<FaClock /> <strong>Hours:</strong> 10:00 - 18:00, Mon - Sat
							</li>
						</ul>
					</div>

					<div className="footer-column">
						<h4>Company</h4>
						<ul>
							<li>
								<Link to="/about">About Us</Link>
							</li>
							<li>
								<Link to="/delivery">Delivery Information</Link>
							</li>
							<li>
								<Link to="/privacy">Privacy Policy</Link>
							</li>
							<li>
								<Link to="/terms">Terms & Conditions</Link>
							</li>
							<li>
								<Link to="/contact">Contact Us</Link>
							</li>
							<li>
								<Link to="/support">Support Center</Link>
							</li>
						</ul>
					</div>

					<div className="footer-column">
						<h4>Account</h4>
						<ul>
							<li>
								<Link to="/login">Sign In</Link>
							</li>
							<li>
								<Link to="/cart">View Cart</Link>
							</li>
							<li>
								<Link to="/my-wishlist">My Wishlist</Link>
							</li>
							<li>
								<Link to="/orders">Track My Order</Link>
							</li>
							<li>
								<Link to="/help">Help Ticket</Link>
							</li>
							<li>
								<Link to="/shipping">Shipping Details</Link>
							</li>
						</ul>
					</div>

					<div className="footer-column">
						<h4>Corporate</h4>
						<ul>
							<li>
								<Link to="#">Become a Vendor</Link>
							</li>
							<li>
								<Link to="#">Affiliate Program</Link>
							</li>
							<li>
								<Link to="#">Farm Business</Link>
							</li>
							<li>
								<Link to="#">Farm Careers</Link>
							</li>
							<li>
								<Link to="#">Our Suppliers</Link>
							</li>
							<li>
								<Link to="#">Accessibility</Link>
							</li>
						</ul>
					</div>

					<div className="footer-column">
						<h4>Popular</h4>
						<ul>
							<li>
								<Link to="#">Milk & Flavoured Milk</Link>
							</li>
							<li>
								<Link to="#">Butter and Margarine</Link>
							</li>
							<li>
								<Link to="#">Eggs Substitutes</Link>
							</li>
							<li>
								<Link to="#">Marmalades</Link>
							</li>
							<li>
								<Link to="#">Sour Cream and Dips</Link>
							</li>
							<li>
								<Link to="#">Tea & Kombucha</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="footer-bottom">
					<div className="container footer-bottom-container">
						<p>© 2025, Ecommerce Template All rights reserved</p>
						<div className="social-links">
							<span>Follow Us</span>
							<a href="#" aria-label="Facebook">
								<FaFacebookF />
							</a>
							<a href="#" aria-label="Twitter">
								<FaTwitter />
							</a>
							<a href="#" aria-label="Instagram">
								<FaInstagram />
							</a>
							<a href="#" aria-label="YouTube">
								<FaYoutube />
							</a>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
};

export default Footer;
