import React from "react";
import FrontLayout from "../../layouts/front.layout";
const Profile = () => {
	return (
		<>
			<FrontLayout>
				<div className="profile_page">
					<div className="profile_page_header">
						<div>
							<i className="fas fa-chevron-left"></i>
						</div>
						<header>
							<h1>profile</h1>
						</header>
						<i className="fas fa-sign-out"></i>
					</div>
					<div className="profile_page_inner">
						<div className="profile_page_inner_top">
							<i className="fas fa-user"></i>
							<div className="profile_page_inner_top_bottom">
								<header>
									<h1>Tosin hearald</h1>
								</header>
								<a href="mailto:arigbjesse@gmail.com">arigbjesse@gmail.com</a>
							</div>
						</div>
						<div className="profile_page_inner_bottom">
							<section>
								<div className="left">
									<i className="fas fa-gear"></i>
								</div>
								<div className="right">
									<h4>Settings</h4>
								</div>
							</section>
							<section>
								<div className="left">
									<i className="fas fa-gear"></i>
								</div>
								<div className="right">
									<h4>Settings</h4>
								</div>
							</section>
							<section>
								<div className="left">
									<i className="fas fa-gear"></i>
								</div>
								<div className="right">
									<h4>Settings</h4>
								</div>
							</section>
							<section>
								<div className="left">
									<i className="fas fa-gear"></i>
								</div>
								<div className="right">
									<h4>Settings</h4>
								</div>
							</section>
							<section>
								<div className="left">
									<i className="fas fa-gear"></i>
								</div>
								<div className="right">
									<h4>Settings</h4>
								</div>
							</section>
						</div>
					</div>
					<></>
				</div>
			</FrontLayout>
		</>
	);
};
export default Profile;
