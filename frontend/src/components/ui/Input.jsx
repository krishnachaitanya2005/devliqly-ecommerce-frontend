import React from "react";
import "./Input.css";

const Input = ({ label, id, type = "text", value, onChange, placeholder }) => {
	return (
		<div className="custom-input-group">
			<label htmlFor={id}>{label}</label>
			<input
				type={type}
				id={id}
				name={id}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
			/>
		</div>
	);
};

export default Input;
