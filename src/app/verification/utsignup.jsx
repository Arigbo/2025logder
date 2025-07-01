import React from "react";
import Link from "next/link";
import FrontLayout from "../../layouts/front.layout";
const UserTypeSignup = () => {
	return (
		<div className="verify">
			<FrontLayout>
				<div className="usertype">
					<div className="header">
						<header>
							<h1>User Type</h1>
						</header>
						<p>Who you signup in as please?</p>
					</div>
					<div className="usertype_inner">
						<Link href="./student/signup">
							<div className="user tenant">
								<img src="/images/9334180 4.png" />
								<header>
									<h1>Student</h1>
								</header>
							</div>
						</Link>
						<Link href="">
							<div className="user landlord">
								<img src="/images/9334407 1.png" />
								<header>
									<h1>landlord</h1>
								</header>
							</div>
						</Link>
					</div>
				</div>
			</FrontLayout>
		</div>
	);
};
export default UserTypeSignup;
