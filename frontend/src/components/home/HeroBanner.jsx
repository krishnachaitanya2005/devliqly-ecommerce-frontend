import React from "react";
import Slider from "react-slick";
import "./HeroBanner.css";

const HeroBanner = () => {
	// Mock data for your carousel slides.
	const slides = [
		{
			image:
				"https://imgs.search.brave.com/Zjz-RuX2T_Ii0ijMIzZnd9eP077Jgq7vvIx2IPClJ2I/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTkv/MTk1LzcxNy9zbWFs/bC9zcGVjaWFsLW9m/ZmVyLWJhZGdlLXdp/dGgteWVsbG93LWJh/Y2tncm91bmQtZnJl/ZS12ZWN0b3IuanBn",
		},
		{
			image:
				"https://imgs.search.brave.com/QshklU-8OMGzyAuQIAFJCu4sq1i1rLP6INgscIwqpMs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvYmVzdC1vZmZl/ci1zYWxlLWJhbm5l/ci12ZWN0b3ItdGVt/cGxhdGUtb2ZmZXIt/YmFubmVyLXNhbGUt/b2ZmZXItZGlzY291/bnRzLWJhY2tncm91/bmQtb2ZmZXItcHJv/bW90aW9uLW1hcmtl/dGluZy1wb3N0ZXIt/ZGVzaWduLXdlYi1z/b2NpYWwtdmVjdG9y/LWlsbHVzdHJhdGlv/bl8xMjEzOTg5LTEw/MDMuanBnP3NlbXQ9/YWlzX2h5YnJpZCZ3/PTc0MA",
		},
		{
			image:
				"https://imgs.search.brave.com/hCKhwgDwSx6tfAuHk0FXqt_jXIBqCRfozfWBf5qPy3Y/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDMv/NzgzLzExNS9zbWFs/bC9zcGVjaWFsLW9m/ZmVyLXNhbGUtYmFu/bmVyLXByb21vdGlv/bi1vZmZlci1mcmVl/LXZlY3Rvci5qcGc",
		},
	];

	// Settings for the carousel
	const settings = {
		dots: true,
		infinite: true,
		speed: 500, // Transition speed in ms
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000, // Autoplay speed in ms (3 seconds)
	};

	return (
		<section className="hero-banner-section">
			<Slider {...settings}>
				{slides.map((slide, index) => (
					<div key={index} className="slide-item">
						<img src={slide.image} alt={`Slide ${index + 1}`} />
					</div>
				))}
			</Slider>
		</section>
	);
};

export default HeroBanner;
