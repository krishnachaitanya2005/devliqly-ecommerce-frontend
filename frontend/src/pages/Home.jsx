import React from "react";
import HeroBanner from "../components/home/HeroBanner";
import HomeCategories from "../components/home/HomeCategories";
import PopularProducts from "../components/home/PopularProducts";

const Home = () => {
	return (
		<div className="home-page">
			<div className="container">
				<HeroBanner />
			</div>
			<HomeCategories />
			<PopularProducts />
		</div>
	);
};

export default Home;
