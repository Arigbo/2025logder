import React from "react";
import { useRouter } from "next/router";
export const navlink = [
	{ name: "Dashboard", path: "/landlords/dashboard", icon: "fas fa-home" },
	{ name: "Properties", path: "/landlords/properties", icon: "fas fa-hotel" },
	{ name: "Tenants", path: "/landlords/tenants", icon: "fas fa-users" },
	{ name: "Payments", path: "/landlords/payments", icon: "fas fa-dollar" },
	{ name: "Settings", path: "/landlords/settings", icon: "fas fa-gear" },
];

const MobileNav = ({}) => {
	const router = useRouter();
	return (
		<div className="mobileDashb">
			<div className="mobileDashb_inner">
				{navlink.map((link) => {
					return (
						<a href={link.path} className={router.pathname == `${link.path}` ? "active" : ""}>
							<i className={link.icon}></i>
							{/* <h1>{link.name}</h1> */}
						</a>
					);
				})}
			</div>
		</div>
	);
};
export default MobileNav;
