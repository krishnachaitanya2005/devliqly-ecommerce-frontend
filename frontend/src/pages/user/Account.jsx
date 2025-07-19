import React, { useState } from "react";
import Button from "../../components/ui/Button";
import "../../styles/Form.css";
import "./Account.css";

const Account = () => {
	const [activeTab, setActiveTab] = useState("profile");

	// Mock user data
	const [profile, setProfile] = useState({
		name: "John Doe",
		email: "john.doe@example.com",
		phone: "1234567890",
	});

	const handleProfileChange = (e) => {
		setProfile({ ...profile, [e.target.name]: e.target.value });
	};

	return (
		<div className="container">
			<h1 className="page-title">My Account</h1>
			<div className="account-container">
				<div className="account-tabs">
					<button
						onClick={() => setActiveTab("profile")}
						className={activeTab === "profile" ? "active" : ""}
					>
						Edit Profile
					</button>
					<button
						onClick={() => setActiveTab("password")}
						className={activeTab === "password" ? "active" : ""}
					>
						Change Password
					</button>
				</div>
				<div className="account-content">
					{activeTab === "profile" && (
						<form className="profile-form">
							<div className="profile-picture-section">
								<img src="https://via.placeholder.com/150" alt="Profile" />
								<Button>Upload Photo</Button>
							</div>
							<div className="profile-fields">
								<div className="input-group">
									<label htmlFor="name">Name</label>
									<input
										type="text"
										id="name"
										name="name"
										value={profile.name}
										onChange={handleProfileChange}
									/>
								</div>
								<div className="input-group">
									<label htmlFor="email">Email</label>
									<input
										type="email"
										id="email"
										name="email"
										value={profile.email}
										onChange={handleProfilechange}
										readOnly
									/>
								</div>
								<div className="input-group">
									<label htmlFor="phone">Phone</label>
									<input
										type="tel"
										id="phone"
										name="phone"
										value={profile.phone}
										onChange={handleProfileChange}
									/>
								</div>
								<div className="form-actions">
									<Button type="submit">Save Changes</Button>
								</div>
							</div>
						</form>
					)}
					{activeTab === "password" && (
						<form>
							<div className="input-group">
								<label htmlFor="currentPassword">Current Password</label>
								<input
									type="password"
									id="currentPassword"
									name="currentPassword"
								/>
							</div>
							<div className="input-group">
								<label htmlFor="newPassword">New Password</label>
								<input type="password" id="newPassword" name="newPassword" />
							</div>
							<div className="form-actions">
								<Button type="submit">Update Password</Button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default Account;
