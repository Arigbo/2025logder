import React from "react";
import Link from "next/link";
import FrontLayout from "../layouts/front.layout";
const url = "http://localhost:3000/users";
const url2 = "http://localhost:3000/post";
export const getStaticProps = async () => {
	const response = await fetch(url);
	const req = await fetch(url2);
	const data = await response.json();
	const data2 = await req.json();
	console.log(data);
	return {
		props: { users: data, bookmark: data2 },
	};
};
const Bookmarks = ({ users, bookmark }) => {
	return (
		<div>
			<FrontLayout>
				<div className="bookmark_page">
					<header>
						<h1>Bookmarks</h1>
					</header>
					<>
						{users &&
							users.map((user) => (
								<div key={user.user.id} className="bookmark_page_inner">
									{/* if user is logged in display below if not do #else */}
									{user.user.logged == true ? (
										<>
											{/* if user is logged but has no bookmarked apartment display the below or the *else*/}
											{user.user.bookmarks.length == 0 ? (
												<div className="no_bookmarked">
													<div className="no_bookmarked_inner">
														<img src="/images/house.png" alt="mmmm" />
														<h1>No Apartment in Bookmarks</h1>
														<button>Search For Vaccant Apartment</button>
													</div>
												</div>
											) : (
												<section className="bookmark_page_inner_results">
													{bookmark.map((item) => (
														<div
															className={`${item.bookmark == true ? "bookmark_page_inner_results_result" : "none"}`}
															key={item.id}
															id={item.id}
														>
															<div className="left">
																<Link href={"/bookmarks#" + item.id}>
																	{" "}
																	<i className="fas fa-bookmark"></i>
																</Link>
																<img src={item.frontyard.picture} alt="mmm" />
															</div>
															<a href={"/discover/" + item.id} className="right">
																<div className="right_top">
																	<div className="name">
																		<h1>{item.name}</h1>
																	</div>
																	<div className="rating">
																		<i className="fas fa-star"></i>
																		<span className="rating-count fa-fade">4.5</span>
																	</div>
																</div>
																<div className="right_middle">
																	<p className="location">
																		<i className="fas fa-location-dot"></i> {item.location.houseNo}{" "}
																		{item.location.streetName} {item.location.state}
																	</p>
																	<div className="amenities">
																		<p>
																			<i className="fas fa-parking"></i>
																		</p>
																		{item.apartmentType === "oneBedroom" ? (
																			<div className="fa-fade">
																				<span>1</span>
																				<i className="fas fa-bed"></i>
																			</div>
																		) : (
																			""
																		)}
																		<p>
																			<i className="fas fa-bath"></i>
																		</p>
																	</div>
																</div>
																<div className="right_bottom">
																	<div className="right_bottom_left">
																		<i className="fas fa-user"></i>
																		<span className="reviews-count">321 reviews</span>
																	</div>
																	<h1>
																		$<span>{item.price}</span>/month
																	</h1>
																</div>
															</a>
														</div>
													))}
												</section>
											)}
										</>
									) : (
										<div className="">
											<div className="no_bookmarked_inner">
												<div className="no_bookmarked_inner_inner">
													<img src="/images/house.png" alt="mmmm" />
													<a href="./verification/student/signup">
														<button>Go to Signup</button>
													</a>
												</div>
											</div>
										</div>
									)}
								</div>
							))}
					</>
					<></>
				</div>
			</FrontLayout>
		</div>
	);
};
export default Bookmarks;
